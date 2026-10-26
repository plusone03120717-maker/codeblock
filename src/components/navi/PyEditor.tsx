'use client'

// Python ナビのエディター：上にコード、下にターミナル（とアプリの窓）。
// Python はブラウザの中（public/py/worker.js の Pyodide）で動く。
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { Decoration, keymap, type DecorationSet } from '@codemirror/view'
import { EditorState, StateEffect, StateField } from '@codemirror/state'
import { HighlightStyle, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { indentWithTab } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { friendlyError, type PyError } from '@/lib/navi/friendlyError'
import { AppWindow, type TkNode } from './AppWindow'
import { findFullWidth, fullWidthMessage } from '@/lib/navi/fullwidth'

type Line =
  | { kind: 'cmd' | 'out' | 'err' | 'info' | 'ok'; text: string }
  | { kind: 'explain'; text: string; trace: string }
  | { kind: 'answer'; prompt: string; text: string }

// file：動かしたファイル（チャレンジのファイルを動かしたときは、その名前）
export type RunResult = { ok: boolean; output: string; error?: PyError; file?: string }

// チャレンジは、それぞれ新しいファイル（challenge1.py など）に書いて、そのファイルだけを動かす
// （上のコードの input の質問に、毎回答えなくてすむように・2026-10-26 依頼主）
export const isChallengeFile = (name: string) => /^challenge\d*\.py$/.test(name)

type Props = {
  initialFiles: Record<string, string>
  onRunFinished?: (result: RunResult) => void
  // 数を渡すとその高さ、'fill' で親の高さいっぱい
  height?: number | 'fill'
  // エディターをさわったとき（動画を止めるのに使う）
  onFocus?: () => void
  onFilesChange?: (files: Record<string, string>) => void
  // 上の案内の帯
  banner?: ReactNode
  // input() の回に、ターミナルの上に出す「入れる値」
  inputsHint?: string[]
  highlight?: boolean
  // ヒントで色をつける行（1から）。null で消す
  markLine?: number | null
  // コードの上に重ねて出すもの（「見出しクリア！」など）
  overlay?: ReactNode
  // このファイルを開く（なければ starter の中身で作る）。チャレンジの見出しに来たときに使う
  openFile?: { name: string; starter: string } | null
}

// ヒントで「ちがう行」に色をつける
const setMark = StateEffect.define<number | null>()
const markField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes)
    for (const e of tr.effects) {
      if (!e.is(setMark)) continue
      if (e.value === null || e.value < 1 || e.value > tr.state.doc.lines) deco = Decoration.none
      else deco = Decoration.set([Decoration.line({ class: 'cm-navi-wrong' }).range(tr.state.doc.line(e.value).from)])
    }
    // 打ちなおしたら消す
    if (tr.docChanged) deco = Decoration.none
    return deco
  },
  provide: (f) => EditorView.decorations.from(f),
})

const editorTheme = EditorView.theme(
  {
    '&': { height: '100%', backgroundColor: '#23203b', color: '#dcdcf0', fontSize: '16px' },
    '.cm-scroller': { fontFamily: "'JetBrains Mono', 'BIZ UDGothic', monospace", lineHeight: '1.8' },
    '.cm-content': { caretColor: '#ffd23f', padding: '10px 0' },
    '.cm-gutters': { backgroundColor: '#23203b', color: '#5d5880', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'rgba(255,255,255,.05)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#b8b3d8' },
    '&.cm-focused .cm-cursor': { borderLeftColor: '#ffd23f', borderLeftWidth: '2px' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { backgroundColor: 'rgba(116,72,240,.45) !important' },
    '.cm-matchingBracket': { backgroundColor: 'rgba(255,210,63,.25)', outline: 'none' },
    '.cm-navi-wrong': { backgroundColor: 'rgba(255,138,31,.28)', boxShadow: 'inset 4px 0 0 #ff8a1f' },
  },
  { dark: true },
)

// コードの色（モックアップと同じ）
const codeColors = HighlightStyle.define([
  { tag: t.keyword, color: '#c678dd' },
  { tag: [t.string, t.special(t.string)], color: '#98c379' },
  { tag: [t.number, t.bool, t.null], color: '#d19a66' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#61afef' },
  { tag: t.comment, color: '#8f94a0', fontStyle: 'italic' },
  { tag: [t.variableName, t.propertyName], color: '#e5c07b' },
  { tag: [t.definition(t.variableName), t.className], color: '#e5c07b' },
  { tag: [t.operator, t.punctuation, t.bracket], color: '#dcdcf0' },
])

export function PyEditor({ initialFiles, onRunFinished, height = 640, onFocus, onFilesChange, banner, inputsHint, highlight, markLine, overlay, openFile }: Props) {
  const [files, setFiles] = useState<Record<string, string>>(initialFiles)
  const [active, setActive] = useState(Object.keys(initialFiles)[0])
  const [lines, setLines] = useState<Line[]>([])
  const [status, setStatus] = useState<'booting' | 'ready' | 'running' | 'app' | 'error'>('booting')
  const [inputPrompt, setInputPrompt] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [tk, setTk] = useState<TkNode | null>(null)
  const [tkMessage, setTkMessage] = useState<{ title: string; text: string } | null>(null)

  const workerRef = useRef<Worker | null>(null)
  const editorHost = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const filesRef = useRef(files)
  const activeRef = useRef(active)
  const outputRef = useRef('')
  const ranFileRef = useRef('')
  const termEnd = useRef<HTMLDivElement>(null)
  const inputBox = useRef<HTMLInputElement>(null)
  useEffect(() => {
    filesRef.current = files
    activeRef.current = active
  }, [files, active])

  // 親から渡される関数は ref で持つ（変わるたびに Python の係を作り直さないため）
  const onRunFinishedRef = useRef(onRunFinished)
  useEffect(() => {
    onRunFinishedRef.current = onRunFinished
  }, [onRunFinished])
  const onFilesChangeRef = useRef(onFilesChange)
  useEffect(() => {
    onFilesChangeRef.current = onFilesChange
  }, [onFilesChange])
  useEffect(() => {
    onFilesChangeRef.current?.(files)
  }, [files])

  const push = useCallback((line: Line) => setLines((prev) => [...prev, line]), [])

  // 出力は1文字ずつ届くことがあるので、同じ種類なら前の行につなげる
  const appendStream = useCallback((kind: 'out' | 'err', text: string) => {
    if (kind === 'out') outputRef.current += text
    setLines((prev) => {
      const last = prev[prev.length - 1]
      if (last && last.kind === kind && !last.text.endsWith('\n')) {
        return [...prev.slice(0, -1), { kind, text: last.text + text }]
      }
      return [...prev, { kind, text }]
    })
  }, [])

  const startWorker = useCallback(() => {
    workerRef.current?.terminate()
    const w = new Worker('/py/worker.js', { type: 'module' })
    w.onmessage = (e: MessageEvent) => {
      const m = e.data
      switch (m.type) {
        case 'ready':
          setStatus('ready')
          break
        case 'boot-error':
          setStatus('error')
          push({ kind: 'err', text: 'Python の準備に失敗しました。インターネットにつながっているか確かめて、ページを開き直してください\n' })
          break
        case 'stdout':
          appendStream('out', m.text)
          break
        case 'stderr':
          appendStream('err', m.text)
          break
        case 'input-request':
          setInputPrompt(m.prompt)
          setInputValue('')
          break
        case 'tk-render':
          if (m.tree?.closed) setTk(null)
          else setTk(m.tree)
          break
        case 'tk-message':
          setTkMessage({ title: m.title, text: m.text })
          break
        case 'done': {
          setInputPrompt(null)
          if (m.ok) {
            push({ kind: 'ok', text: m.appOpen ? 'アプリの窓をひらきました →' : 'おわりました' })
            setStatus(m.appOpen ? 'app' : 'ready')
            onRunFinishedRef.current?.({ ok: true, output: outputRef.current, file: ranFileRef.current })
          } else {
            const err = m.error as PyError
            push({ kind: 'err', text: `${err.type}: ${err.message}` })
            push({ kind: 'explain', text: friendlyError(err), trace: err.trace })
            setStatus('ready')
            onRunFinishedRef.current?.({ ok: false, output: outputRef.current, error: err, file: ranFileRef.current })
          }
          break
        }
      }
    }
    workerRef.current = w
  }, [appendStream, push])

  useEffect(() => {
    startWorker()
    return () => workerRef.current?.terminate()
  }, [startWorker])

  const run = useCallback(() => {
    if (!workerRef.current || status === 'booting' || status === 'running') return
    outputRef.current = ''
    setTk(null)
    setTkMessage(null)
    // ふだんは最初のファイル（step07.py など）を動かす。チャレンジのファイルを開いているときは、そのファイルだけ
    const main = isChallengeFile(activeRef.current) ? activeRef.current : Object.keys(filesRef.current)[0]
    ranFileRef.current = main
    push({ kind: 'cmd', text: `python ${main}` })
    // 全角チェック：全角の記号・数字・空白があれば、動かす前に知らせて、その行に色をつける
    const full = findFullWidth(filesRef.current[main] ?? '')
    if (full) {
      push({ kind: 'explain', text: fullWidthMessage(full), trace: '' })
      if (main === activeRef.current) viewRef.current?.dispatch({ effects: setMark.of(full.line) })
      return
    }
    setStatus('running')
    workerRef.current.postMessage({ type: 'run', files: filesRef.current, main })
  }, [push, status])

  const runRef = useRef(run)
  useEffect(() => {
    runRef.current = run
  }, [run])

  const stop = useCallback(() => {
    push({ kind: 'info', text: 'とめました' })
    setInputPrompt(null)
    setTk(null)
    setStatus('booting')
    startWorker()
  }, [push, startWorker])

  // チャレンジの見出しに来たら、そのチャレンジのファイルを開く（なければ作る）
  const openName = openFile?.name
  useEffect(() => {
    if (!openFile) return
    const { name, starter } = openFile
    setFiles((prev) => (name in prev ? prev : { ...prev, [name]: starter }))
    setActive(name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openName])

  // CodeMirror：ファイルを切りかえるたびに作り直す
  useEffect(() => {
    if (!editorHost.current) return
    const view = new EditorView({
      parent: editorHost.current,
      state: EditorState.create({
        doc: filesRef.current[active] ?? '',
        extensions: [
          basicSetup,
          python(),
          indentUnit.of('    '),
          keymap.of([indentWithTab, { key: 'Ctrl-Enter', run: () => (runRef.current(), true) }]),
          editorTheme,
          syntaxHighlighting(codeColors),
          markField,
          EditorView.updateListener.of((u) => {
            if (u.docChanged) {
              const text = u.state.doc.toString()
              setFiles((prev) => ({ ...prev, [activeRef.current]: text }))
            }
          }),
        ],
      }),
    })
    viewRef.current = view
    return () => view.destroy()
  }, [active])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({ effects: setMark.of(markLine ?? null) })
    if (markLine && markLine <= view.state.doc.lines) {
      view.dispatch({ effects: EditorView.scrollIntoView(view.state.doc.line(markLine).from, { y: 'center' }) })
    }
  }, [markLine, active])

  useEffect(() => {
    termEnd.current?.scrollIntoView({ block: 'nearest' })
  }, [lines, inputPrompt])

  useEffect(() => {
    if (inputPrompt !== null) inputBox.current?.focus()
  }, [inputPrompt])

  const sendInput = () => {
    if (inputPrompt === null || !workerRef.current) return
    push({ kind: 'answer', prompt: inputPrompt, text: inputValue })
    workerRef.current.postMessage({ type: 'input', value: inputValue })
    setInputPrompt(null)
  }

  const addFile = () => {
    let n = Object.keys(files).length
    let name = `file${n}.py`
    while (files[name]) name = `file${++n}.py`
    const typed = window.prompt('新しいファイルの名前（半角で。.py はなくてもOK）', name)
    if (!typed) return
    const clean = typed.trim().replace(/\.py$/, '') + '.py'
    if (!/^[A-Za-z_][A-Za-z0-9_]*\.py$/.test(clean)) {
      window.alert('ファイル名は、半角の英字・数字・_ だけで、英字から始めてね')
      return
    }
    setFiles((prev) => ({ ...prev, [clean]: '' }))
    setActive(clean)
  }

  const busy = status === 'running'
  const showApp = tk !== null

  const termHeight = height === 'fill' ? 270 : Math.round(height * 0.42)

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[22px] bg-[#23203b] shadow-lg ${highlight ? 'ring-[3px] ring-[#ffc21a] ring-offset-0 shadow-[0_0_0_9px_rgba(255,210,63,.25)]' : ''}`}
      style={{ height: height === 'fill' ? '100%' : height }}
    >
      {banner}
      {/* 上の帯：ファイルと実行 */}
      <div className="flex h-[52px] flex-none items-center gap-2 bg-[#1b1832] px-3">
        {/* ファイルがふえたら（チャレンジのファイルなど）、ここだけ横にスクロールして、▶ 実行はいつも見えるように */}
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none]">
        {Object.keys(files).map((name) => (
          <button
            key={name}
            ref={name === active ? (el) => el?.scrollIntoView({ block: 'nearest', inline: 'nearest' }) : undefined}
            onClick={() => setActive(name)}
            className={`flex h-[34px] flex-none items-center gap-2 whitespace-nowrap rounded-[10px] px-3 font-mono text-sm font-bold ${
              name === active ? 'bg-[#23203b] text-white' : 'text-[#8a85ad] hover:text-white'
            }`}
          >
            <span className="h-4 w-4 rounded-[5px] bg-[linear-gradient(135deg,#4f7cff_50%,#ffd23f_50%)]" />
            {name}
          </button>
        ))}
        <button onClick={addFile} className="h-[34px] flex-none rounded-[10px] px-3 text-sm font-bold text-[#8a85ad] hover:text-white" title="ファイルを足す">
          ＋
        </button>
        </div>
        <span className="max-w-[150px] flex-none truncate text-xs font-bold text-[#8a85ad]">
          {status === 'booting' ? 'Python を準備中…' : busy ? (inputPrompt !== null ? '入力を待っています' : '実行中…') : 'Ctrl + Enter でも実行'}
        </span>
        {busy || status === 'app' ? (
          <button onClick={stop} className="flex h-[38px] flex-none items-center gap-2 whitespace-nowrap rounded-full bg-[#ef5a5a] px-5 font-black text-white shadow-[0_4px_0_#c13f3f]">
            ■ とめる
          </button>
        ) : (
          <button
            onClick={run}
            disabled={status === 'booting'}
            className="flex h-[38px] flex-none items-center gap-2 whitespace-nowrap rounded-full bg-[#22b573] px-5 font-black text-white shadow-[0_4px_0_#16905a] disabled:opacity-50"
          >
            ▶ 実行
          </button>
        )}
      </div>

      {/* コード */}
      <div className="relative min-h-0 flex-1">
        <div ref={editorHost} onMouseDownCapture={() => onFocus?.()} onKeyDownCapture={() => onFocus?.()} className="h-full overflow-hidden" />
        {overlay}
      </div>

      <div className="flex h-[10px] flex-none items-center justify-center bg-[#1b1832]">
        <span className="h-1 w-11 rounded bg-[#3a3462]" />
      </div>

      {/* ターミナル（とアプリの窓） */}
      <div className={`grid flex-none bg-[#120f24] ${showApp ? 'grid-cols-[0.75fr_1.4fr]' : 'grid-cols-1'}`} style={{ height: termHeight }}>
        <div className="flex min-h-0 flex-col border-r border-[#241f40]">
          <div className="flex h-[38px] flex-none items-center gap-4 border-b border-[#241f40] px-4 text-[13px] font-bold text-[#8a85ad]">
            <b className="-mb-[10px] border-b-2 border-[#ffd23f] pb-2 text-white">ターミナル</b>
            <span className="flex-1" />
            <button onClick={() => setLines([])} className="hover:text-white">
              🗑 けす
            </button>
          </div>
          {inputsHint && inputsHint.length > 0 && (
            <div className="flex-none border-b border-[#241f40] bg-[rgba(255,210,63,.08)] px-4 py-1.5 text-[13px] font-bold text-[#ffe6a8]">
              入れる値：{inputsHint.map((v, i) => (
                <span key={i} className="mx-1 rounded bg-[rgba(255,210,63,.2)] px-1.5 font-mono text-white">{v}</span>
              ))}
              <span className="ml-1 text-[#9d98c2]">（この順に入れると、動画と同じ結果になるよ）</span>
              {/* 1つのファイルに書き足していくので、上の行の input の質問も出る（2026-10-26 ステップ7） */}
              {((files[isChallengeFile(active) ? active : Object.keys(files)[0]] ?? '').match(/\binput\s*\(/g)?.length ?? 0) > inputsHint.length && (
                <span className="ml-1 text-[#ffe6a8]">上の行の質問にも、答えてね（答えは何でもOK）</span>
              )}
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2 font-mono text-[15px] leading-[1.75] text-[#cfcbe8]">
            {lines.map((l, i) => {
              if (l.kind === 'cmd')
                return (
                  <div key={i} className="whitespace-pre-wrap">
                    <span className="text-[#7ee2a8]">&gt;</span> {l.text}
                  </div>
                )
              if (l.kind === 'answer')
                return (
                  <div key={i} className="whitespace-pre-wrap">
                    {l.prompt}
                    <span className="rounded bg-[rgba(255,210,63,.18)] px-1 text-white">{l.text}</span>
                  </div>
                )
              if (l.kind === 'explain')
                return (
                  <div key={i} className="my-1 rounded-r-lg border-l-[3px] border-[#ffd23f] bg-[rgba(255,210,63,.1)] px-3 py-1 font-sans text-[13.5px] font-bold text-[#ffe6a8]">
                    {l.text}
                    {l.trace && (
                      <details className="mt-1 font-mono text-[12px] font-normal text-[#9d98c2]">
                        <summary className="cursor-pointer">くわしいエラー</summary>
                        <pre className="whitespace-pre-wrap">{l.trace}</pre>
                      </details>
                    )}
                  </div>
                )
              const color =
                l.kind === 'err' ? 'text-[#ff9b9b]' : l.kind === 'info' ? 'text-[#9d98c2]' : l.kind === 'ok' ? 'text-[#9d98c2]' : ''
              return (
                <div key={i} className={`whitespace-pre-wrap ${color}`}>
                  {l.kind === 'ok' ? `（${l.text}）` : l.text}
                </div>
              )
            })}
            {inputPrompt !== null && (
              <div className="flex items-center whitespace-pre-wrap">
                <span>{inputPrompt}</span>
                <input
                  ref={inputBox}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) sendInput()
                  }}
                  className="min-w-0 flex-1 rounded bg-[rgba(255,210,63,.18)] px-1 text-white outline-none"
                  aria-label="入力"
                />
                <span className="ml-2 font-sans text-xs text-[#9d98c2]">Enter で決定</span>
              </div>
            )}
            {status !== 'booting' && !busy && inputPrompt === null && (
              <div>
                <span className="text-[#7ee2a8]">&gt;</span> <span className="inline-block h-[18px] w-[9px] animate-pulse bg-[#cfcbe8] align-[-3px]" />
              </div>
            )}
            <div ref={termEnd} />
          </div>
        </div>

        {showApp && (
          <AppWindow
            tree={tk}
            message={tkMessage}
            onCloseMessage={() => setTkMessage(null)}
            onEvent={(ev) => workerRef.current?.postMessage({ type: 'tk-event', ...ev })}
          />
        )}
      </div>
    </div>
  )
}
