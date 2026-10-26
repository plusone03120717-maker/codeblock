'use client'

// いちかに質問（2026-10-26 依頼主：Python を知らない講師でも、アプリの中で生徒の質問に答えられるように。1人1日3回まで・文字だけ）
// 今のステップ・見出し・生徒のコード・さいごのエラーをいっしょに送り、いちかが短く答える（/api/navi-ask）
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ASK_MAX_QUESTION, ASK_PER_DAY, askIchika, askStatus } from '@/lib/navi/ask'

type QA = { q: string; a: string }

const QUICK = ['エラーの いみが わからない', 'どこが ちがうの？', 'つぎに 何をすればいい？', 'どうして こうなるの？']

// きょうのやりとり（このパソコンのブラウザにだけ。開き直しても見えるように）
const KEY = () => `navi_ask_${new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10)}`
function loadToday(): QA[] {
  try {
    return JSON.parse(localStorage.getItem(KEY()) || '[]') as QA[]
  } catch {
    return []
  }
}

type Props = {
  step: number
  section: number | null
  code: string
  lastError?: string
  lastOutput?: string
  onClose: () => void
}

export function NaviAsk({ step, section, code, lastError, lastOutput, onClose }: Props) {
  const [left, setLeft] = useState<number | null>(null)
  const [ready, setReady] = useState(true)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [log, setLog] = useState<QA[]>([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLog(loadToday())
    askStatus().then((s) => {
      if (!s) return
      setLeft(s.left)
      setReady(s.ready)
    })
  }, [])

  const send = async () => {
    const q = text.trim()
    if (!q || busy) return
    setBusy(true)
    setError(null)
    const r = await askIchika({ question: q, step, section, code, error: lastError, output: lastOutput })
    setBusy(false)
    if (r.ok) {
      const next = [...log, { q, a: r.answer }]
      setLog(next)
      setLeft(r.left)
      setText('')
      try {
        localStorage.setItem(KEY(), JSON.stringify(next))
      } catch {}
    } else if (r.reason === 'limit') {
      setLeft(0)
    } else if (r.reason === 'notReady') {
      setReady(false)
    } else {
      setError('うまく聞けなかったみたい。もう一度おしてみてね（回数はへらないよ）')
    }
  }

  const out = left === 0
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(42,36,82,.35)] p-6" onClick={onClose}>
      <div
        className="flex max-h-[86vh] w-full max-w-[620px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(42,36,82,.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 上の帯 */}
        <div className="flex items-center gap-3 border-b border-[#efeafd] px-6 py-4">
          <div className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-full bg-[radial-gradient(closest-side,#ffffff,#d9ecfb)]">
            <Image src={busy ? '/navi/bob_think.webp' : '/navi/bob_smile.webp'} alt="いちか" width={48} height={48} unoptimized />
          </div>
          <div className="flex-1">
            <div className="text-[18px] font-black">いちかに質問</div>
            <div className="text-[13px] font-bold text-[#6d6893]">いま書いているコードを見て、いちかが答えるよ</div>
          </div>
          <span className={`rounded-full px-3 py-1 text-[13px] font-black ${out ? 'bg-[#f0eef7] text-[#8a85ad]' : 'bg-[#fff3d6] text-[#b66a00]'}`}>
            きょう あと {left ?? '…'} / {ASK_PER_DAY} 回
          </span>
          <button onClick={onClose} className="ml-1 rounded-full px-2 text-[20px] font-black text-[#8a85ad] hover:text-[#2a2452]" aria-label="とじる">
            ✕
          </button>
        </div>

        {/* やりとり */}
        <div className="flex min-h-[120px] flex-1 flex-col gap-3 overflow-y-auto bg-[#f8f6ff] px-6 py-5">
          {log.length === 0 && !busy && (
            <div className="rounded-[18px] bg-white px-4 py-3 text-[15px] font-bold leading-relaxed text-[#2a2452] shadow-[0_4px_12px_rgba(42,36,82,.05)]">
              こまったことを、ことばで書いてね。「どこが ちがうの？」みたいに、下のボタンをおしてもいいよ。
            </div>
          )}
          {log.map((x, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="ml-auto max-w-[85%] rounded-[18px] rounded-br-[6px] bg-[#7448f0] px-4 py-2.5 text-[15px] font-bold text-white">{x.q}</div>
              <div className="flex items-end gap-2">
                <Image src="/navi/bob_smile.webp" alt="" width={34} height={34} className="flex-none rounded-full bg-[#e1effb]" unoptimized />
                <div className="max-w-[85%] whitespace-pre-wrap rounded-[18px] rounded-bl-[6px] bg-white px-4 py-3 text-[15px] font-bold leading-relaxed text-[#2a2452] shadow-[0_4px_12px_rgba(42,36,82,.06)]">
                  {x.a}
                </div>
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex items-center gap-2 text-[14px] font-bold text-[#6d6893]">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#a259ff]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#a259ff] [animation-delay:.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#a259ff] [animation-delay:.3s]" />
              いちかが考えているよ…
            </div>
          )}
          {error && <div className="text-[14px] font-bold text-[#c93c3c]">{error}</div>}
        </div>

        {/* 書くところ */}
        <div className="border-t border-[#efeafd] px-6 py-4">
          {!ready ? (
            <p className="text-[15px] font-bold leading-relaxed text-[#6d6893]">
              いちかへの質問は、いま じゅんび中だよ。エラーの黄色い説明や「💡 ヒント」を見て、こまったら先生に聞いてね。
            </p>
          ) : out ? (
            <p className="text-[15px] font-bold leading-relaxed text-[#6d6893]">
              きょうの質問は おしまい。また あした聞いてね。こまったら、エラーの黄色い説明や「💡 ヒント」を見て、先生にも聞いてみよう。
            </p>
          ) : (
            <>
              <div className="mb-2 flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => setText(q)}
                    className="rounded-full bg-[#efe9ff] px-3 py-1 text-[13px] font-bold text-[#7448f0] hover:bg-[#e3d9ff]"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-end gap-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, ASK_MAX_QUESTION))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !e.nativeEvent.isComposing) send()
                  }}
                  rows={2}
                  placeholder="こまったことを書いてね（例：エラーの いみが わからない）"
                  className="min-w-0 flex-1 resize-none rounded-[16px] bg-[#f5f3ff] px-4 py-3 text-[15px] font-bold text-[#2a2452] outline-none ring-[#c9b8ff] placeholder:text-[#b0a8d6] focus:ring-2"
                />
                <button
                  onClick={send}
                  disabled={!text.trim() || busy}
                  className="h-[52px] flex-none whitespace-nowrap rounded-full bg-[#ff8a1f] px-6 text-[16px] font-black text-white shadow-[0_5px_0_#db6500] disabled:bg-[#c9c2ee] disabled:shadow-none"
                >
                  聞く ›
                </button>
              </div>
              <p className="mt-2 text-[12px] font-bold text-[#8a85ad]">1日 {ASK_PER_DAY} 回まで。名前や住所は書かないでね。いちかも まちがえることがあるよ。</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
