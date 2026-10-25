'use client'

// 1ステップの学習画面：左で動画を見ながら、右のエディターで同じコードを打つ
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { PyEditor, type RunResult } from '@/components/navi/PyEditor'
import { YouTubePlayer, type PlayerHandle } from '@/components/navi/YouTubePlayer'
import { NaviHeader } from '@/components/navi/NaviHeader'
import { EndPopup } from '@/components/navi/EndPopup'
import { getNaviStep } from '@/data/navi/steps'
import { sectionPassed, studentNote } from '@/lib/navi/judge'
import { dueAt, isRequired, pauseTimes, requiredIndexes } from '@/lib/navi/checkpoints'
import { codeHint, type CodeHint } from '@/lib/navi/hint'
import { videoLabel, type NaviSection } from '@/lib/navi/types'
import { friendlyError } from '@/lib/navi/friendlyError'
import { isFinishLesson, naviLessonLabel } from '@/data/navi/finish31'
import {
  codeblockCompleted,
  fmtTime,
  loadNavi,
  nextAction,
  resumeFrom,
  saveNavi,
  stepProgress,
  updateStep,
  type StepProgress,
} from '@/lib/navi/progress'

const XP_PER_SECTION = 20

export function StudyClient({ step: stepNo }: { step: number }) {
  const router = useRouter()
  const step = getNaviStep(stepNo)
  const player = useRef<PlayerHandle>(null)
  const [p, setP] = useState<StepProgress | null>(null)
  const [time, setTime] = useState(0)
  const [startAt, setStartAt] = useState(0)
  const [ending, setEnding] = useState(false)
  const [passedToday, setPassedToday] = useState<number[]>([])
  const ticks = useRef(0) // 再生位置は、0.5秒ごとの知らせ10回（5秒）に1回保存する
  // 見出しの終わりで止めるしくみ
  const [deferred, setDeferred] = useState<number[]>([]) // 「あとでやる」にした見出し（この回だけ）
  const [cp, setCp] = useState<{ mode: 'pause' | 'jump'; at: number } | null>(null) // いま止まっているところ
  const [endCard, setEndCard] = useState(false)
  const [hintOpen, setHintOpen] = useState<number | null>(null) // ヒント2段目：動画のコードを見せている見出し
  const [wrong, setWrong] = useState<{ section: number; hint: CodeHint | null } | null>(null) // ヒント3段目
  const [answer, setAnswer] = useState<{ section: number; ok: boolean; error?: string } | null>(null) // チャレンジの「こたえの例」
  const [toast, setToast] = useState<{ titles: string[]; optional: boolean; all: boolean } | null>(null)
  const lastPlaying = useRef<number | null>(null) // 再生中に最後に見た秒（飛ばしたかを見る）
  const lastTick = useRef<number | null>(null) // 最後に知らされた秒（止まっていても）
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (ms: number, f: () => void) => timers.current.push(setTimeout(f, ms))

  useEffect(() => {
    const state = loadNavi()
    if (state.current !== stepNo) {
      state.current = stepNo
      saveNavi(state)
    }
    const sp = stepProgress(state, stepNo)
    // ブラウザの保存（localStorage）は表示のあとでしか読めないので、ここで1回だけ入れる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setP(sp)
    setTime(sp.videoPos)
    setStartAt(resumeFrom(sp.videoPos))
    // 前に最後まで見ていて、まだの見出しがあるときは「動画おわり」の板から
    const st = getNaviStep(stepNo)
    if (st?.video && sp.videoDone && requiredIndexes(st).some((i) => !sp.passed.includes(i))) setEndCard(true)
  }, [stepNo])

  const save = (patch: Partial<StepProgress>) => {
    const state = updateStep(stepNo, patch)
    setP(stepProgress(state, stepNo))
  }

  // こちらから動画を動かすとき（飛ばしたことにしない）
  const seekTo = (sec: number, play = true) => {
    lastPlaying.current = sec
    player.current?.seek(sec)
    if (play) player.current?.play()
  }

  const remainingRequired = (passed: number[]) => (step ? requiredIndexes(step).filter((i) => !passed.includes(i)) : [])

  const onTime = (sec: number, playing: boolean) => {
    if (!step?.video || !p) return
    setTime(sec)
    const reachedEnd = sec >= step.video.end
    const furthest = Math.max(p.videoPos, sec)
    if (reachedEnd && !p.videoDone) {
      save({ videoPos: furthest, videoDone: true })
    } else if (++ticks.current % 10 === 0 && furthest > p.videoPos) {
      save({ videoPos: furthest })
    }
    // 「動画おわり」の板は、最後に着いたときに1回だけ出す（とじたあと、また出ないように）。
    // その秒で止まる見出しがあるときは、止まったところの案内を出すので、板は重ねない（動画が見えなくなるので）
    const prevTick = lastTick.current
    lastTick.current = sec
    if (
      reachedEnd &&
      prevTick !== null &&
      prevTick < step.video.end &&
      remainingRequired(p.passed).length > 0 &&
      dueAt(step, sec, p.passed, deferred).length === 0
    )
      setEndCard(true)

    if (!playing) return
    const prev = lastPlaying.current
    lastPlaying.current = sec
    if (prev === null) return
    // 止まっているのに YouTube の再生ボタンで進めた → その見出しは「あとでやる」
    if (cp) {
      if (sec > cp.at + 1.5) {
        setDeferred((d) => [...d, ...dueAt(step, cp.at, p.passed, d)])
        setCp(null)
      }
      return
    }
    const crossed = pauseTimes(step).filter((t) => prev < t && t <= sec + 0.01)
    if (crossed.length === 0) return
    if (dueAt(step, sec, p.passed, deferred).length === 0) return
    player.current?.pause()
    setHintOpen(null)
    setCp({ mode: sec - prev > 3 ? 'jump' : 'pause', at: Math.max(...crossed) })
  }

  const onEnded = () => {
    if (p && !p.videoDone) save({ videoDone: true })
    if (p && remainingRequired(p.passed).length > 0) setEndCard(true)
  }

  // いま取り組む見出し：止まっているときはその見出し、動画のあと（作品の回）はまだの見出しの1つ目
  const focusOf = (passed: number[]): number | null => {
    if (!step) return null
    if (cp) return dueAt(step, cp.at, passed, deferred)[0] ?? null
    if (!step.video || p?.videoDone) return remainingRequired(passed)[0] ?? null
    return null
  }

  // どの見出しまで動画が来たか（作品の回は全部）
  const reached = (i: number) => !step?.video || !!p?.videoDone || Math.max(time, p?.videoPos ?? 0) >= step.sections[i].start

  const onRunFinished = (r: RunResult) => {
    if (!step || !p) return
    const code = Object.values(p.files).join('\n')
    const newly: number[] = []
    step.sections.forEach((sec, i) => {
      if (p.passed.includes(i) || !reached(i)) return
      // わざとエラーを出す見出しは、その前の見出しがぜんぶできてから（打ちまちがいのエラーで合格にしない）
      if (sec.expectError && requiredIndexes(step).some((j) => j < i && !p.passed.includes(j))) return
      if (sectionPassed(sec, r, code)) newly.push(i)
    })
    // エラーを見る見出しは、そのあとの見出しが合格したら、見たことにして合格にする（止まらないように）
    const maxPassed = Math.max(-1, ...p.passed, ...newly)
    step.sections.forEach((sec, i) => {
      if (sec.expectError && i < maxPassed && !p.passed.includes(i) && !newly.includes(i)) newly.push(i)
    })
    // チャレンジ：1回実行したら、合っていてもまちがっていても「こたえの例」を見せる
    const target = focusOf(p.passed)
    const challengeOk = newly.find((i) => step.sections[i].challenge)
    if (challengeOk !== undefined) setAnswer({ section: challengeOk, ok: true })
    else if (target !== null && step.sections[target].challenge && reached(target))
      setAnswer({ section: target, ok: false, error: r.error ? friendlyError(r.error) : undefined })
    // 合わなかったとき：いま取り組んでいる見出しの、ちがう行を教える（ヒント3段目。チャレンジはこたえの例を見せるので出さない）
    if (target !== null && !newly.includes(target) && reached(target) && !step.sections[target].expectError && !step.sections[target].challenge) {
      const sec = step.sections[target]
      const guessed = (sec.note ?? '').includes('推測')
      const main = Object.keys(p.files)[0]
      const err = r.error
      setWrong({
        section: target,
        hint: err
          ? { kind: 'error', line: err.file && !err.file.endsWith(main) ? null : err.line, text: friendlyError(err) }
          : guessed
            ? null
            : codeHint(sec, p.files[main] ?? ''),
      })
    }
    if (newly.length > 0) applyPassed(newly, target)
  }

  // 見出しを合格にする（結果が合ったとき・チャレンジで「こたえを見て次へ」を押したとき）
  const applyPassed = (newly: number[], target: number | null, patch: Partial<StepProgress> = {}) => {
    if (!step || !p) return
    {
      const passed = [...p.passed, ...newly]
      save({ passed, ...patch })
      setPassedToday((prev) => [...prev, ...newly])
      if (target !== null && newly.includes(target)) {
        setWrong(null)
        setHintOpen(null)
      }
      const left = remainingRequired(passed)
      setToast({ titles: newly.map((i) => step.sections[i].title), optional: newly.every((i) => !isRequired(step, i)), all: left.length === 0 })
      later(2600, () => setToast(null))
      // 止まっていた見出しがそろったら、動画のつづきへ
      if (cp && dueAt(step, cp.at, passed, deferred).length === 0) {
        const at = cp.at
        later(1600, () => {
          setCp(null)
          if (step.video && at < step.video.end - 1) seekTo(at)
        })
      }
      if (left.length === 0) setEndCard(false)
    }
  }

  if (!step) {
    return (
      <div className="p-10">
        このステップはまだ準備中です。<Link href="/navi" className="text-[#7448f0] underline">ホームへ</Link>
      </div>
    )
  }
  if (!p) return null

  const required = requiredIndexes(step)
  const total = required.length
  const passedCount = required.filter((i) => p.passed.includes(i)).length
  const optionalTotal = step.sections.length - total
  const optionalPassed = step.sections.filter((s, i) => s.optional && p.passed.includes(i)).length
  const nextSection = required.find((i) => !p.passed.includes(i)) ?? -1
  const focus = focusOf(p.passed)
  const videoOk = !step.video || p.videoDone
  const allSections = passedCount === total
  const canGo = videoOk && allSections
  const completed = codeblockCompleted()
  const firstLesson = step.codeblock.find((id) => !completed.includes(id)) ?? step.codeblock[0]
  const showEndCard = !!step.video && endCard && !cp && !allSections
  const initialFiles = Object.keys(p.files).length > 0 ? p.files : { [step.fileName]: `# ${step.title} を見ながら、同じコードを打ってみよう\n` }
  const inputsHint = focus !== null ? step.sections[focus].inputs : nextSection >= 0 ? step.sections[nextSection].inputs : undefined
  const nextNote = focus !== null && reached(focus) ? studentNote(step.sections[focus]) : undefined

  const noteBar =
    focus !== null && nextNote ? (
      <div className="flex-none border-b border-[#3a3462] bg-[#2b2650] px-[18px] py-2 text-[13px] font-bold leading-relaxed text-[#ffe6a8]">
        💡 「{step.sections[focus].title}」：{nextNote}
      </div>
    ) : null

  const mainBanner =
    focus !== null && cp?.mode !== 'jump' ? (
      <div className="flex flex-none items-center gap-2.5 bg-[#ffd23f] px-[18px] py-2.5 text-[15px] font-black text-[#2a2452]">
        👉 「{step.sections[focus].title}」のコードを打って ▶ 実行しよう
        <span className="ml-auto whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-[13px] text-[#8a6400]">あと{total - passedCount}つ</span>
      </div>
    ) : (
      <div className="flex flex-none items-center gap-2.5 bg-[#2b2650] px-[18px] py-2.5 text-sm font-bold text-[#e9e6ff]">
        🎯 動画が止まったら、同じコードを打って<b className="text-[#ffd23f]">同じ結果</b>を出そう
        <span className="ml-auto text-[#b8b3d8]">
          {passedCount} / {total}
        </span>
      </div>
    )
  const banner = (
    <>
      {mainBanner}
      {noteBar}
    </>
  )

  const learnedToday = passedToday.map((i) => step.sections[i].title)
  const action = nextAction(step, p)
  const nextText =
    action.kind === 'video'
      ? `おさらい1問 → 動画の ${fmtTime(resumeFrom(p.videoPos))} から（10秒もどして）つづき。ホームでいちかが案内するよ`
      : action.kind === 'section'
        ? `おさらい1問 → 「${step.sections[action.index].title}」の結果を出すところから。ホームでいちかが案内するよ`
        : action.kind === 'codeblock'
          ? `おさらい1問 → ${naviLessonLabel(action.lessonId)} から。ホームでいちかが案内するよ`
          : 'つぎのステップから。ホームでいちかが案内するよ'

  return (
    <div className="flex h-screen flex-col">
      <NaviHeader step={step.step} unit={step.unit} onEnd={() => setEnding(true)} />
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 px-8 pb-5 pt-[18px]">
        <div className="flex flex-none items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#a259ff,#4f7cff)] py-1.5 pl-2 pr-4 text-white">
              <i className="grid h-6 w-6 place-items-center rounded-full bg-white text-[13px] not-italic text-[#7448f0]">1</i>
              {step.video ? '動画を見ながら打つ' : '作品をつくる'}
            </span>
            <span className="text-[#c9c2ee]">›</span>
            <span className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-2 pr-4 text-[#6d6893] shadow-sm">
              <i className="grid h-6 w-6 place-items-center rounded-full bg-[#f0eef7] text-[13px] not-italic">2</i>
              {step.codeblock.length > 0
                ? step.codeblock.length === 1
                  ? naviLessonLabel(step.codeblock[0])
                  : `CodeBlock ${step.codeblock[0]}〜${step.codeblock[step.codeblock.length - 1]}`
                : step.codeblockPlanned && step.codeblockPlanned.length > 0
                  ? `CodeBlock ${step.codeblockPlanned.join('・')}（準備中）`
                  : '苦手のふくしゅう（できたら）'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-bold text-[#6d6893]">
            <Link href="/navi">‹ ホーム</Link>·<span>ステップ{step.step}</span>·
            <span className="text-[#2a2452]">
              {step.video ? `${videoLabel(step)} ` : ''}
              {step.title}
              {step.video ? `（${fmtTime(step.video.length)}）` : ''}
            </span>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-5">
          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pb-1">
            {step.video ? (
              <div className="relative flex-none overflow-hidden rounded-[22px] bg-[#1d1838] shadow-lg">
                <YouTubePlayer ref={player} videoId={step.video.id} startAt={step.video.start ?? startAt} onTime={onTime} onEnded={onEnded} />
                {showEndCard && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[rgba(21,18,42,.9)] px-6 text-white">
                    <button onClick={() => setEndCard(false)} className="absolute right-3 top-3 rounded-full bg-white/10 px-3 py-1 text-[13px] font-bold text-[#cfcbe8] hover:bg-white/20">
                      ✕ とじる
                    </button>
                    <div className="text-3xl font-black">動画おわり！</div>
                    <div className="text-[15px] font-bold text-[#cfcbe8]">あと {total - passedCount}つ、結果を出したら クリアだよ</div>
                    <div className="flex w-full max-w-[460px] flex-col gap-2">
                      {required
                        .filter((i) => !p.passed.includes(i))
                        .map((i) => (
                          <div key={i} className="flex items-center gap-3 rounded-2xl bg-[#fffbea] px-4 py-2.5 text-[#2a2452]">
                            <span className="flex-1 text-[15px] font-black">「{step.sections[i].title}」</span>
                            <button
                              onClick={() => {
                                setEndCard(false)
                                setDeferred((d) => d.filter((x) => x !== i))
                                seekTo(step.sections[i].start)
                              }}
                              className="whitespace-nowrap rounded-full bg-[#ff8a1f] px-3.5 py-1.5 text-[13.5px] font-black text-white shadow-[0_3px_0_#db6500]"
                            >
                              ▶ ここを見る
                            </button>
                          </div>
                        ))}
                    </div>
                    <div className="text-[13.5px] font-bold text-[#cfcbe8]">わかっているなら、そのまま右のエディターで打って ▶ 実行してもOK</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-none rounded-[22px] bg-white p-5 shadow-sm">
                <div className="text-lg font-black">作品の回</div>
                <div className="mt-1 text-sm font-bold text-[#6d6893]">見本を動かして、自分の数字や言葉に変えてみよう</div>
              </div>
            )}

            {focus === null && toast && !toast.optional && !showEndCard && (
              // 止まっていた見出しをぜんぶクリアしたとき（このあと動画のつづきへ）
              <div className="flex flex-none items-center gap-3 rounded-[18px] bg-[#22b573] px-5 py-3.5 text-white shadow-sm">
                <span className="text-[26px]">✔</span>
                <div className="text-[17px] font-black">
                  {toast.titles.map((t) => `「${t}」`).join('')}クリア！{cp && !toast.all ? ' 動画のつづきを再生するよ' : ''}
                </div>
              </div>
            )}
            {answer && !showEndCard && (
              <AnswerCard
                section={step.sections[answer.section]}
                ok={answer.ok || p.passed.includes(answer.section)}
                revealed={(p.revealed ?? []).includes(answer.section)}
                error={answer.error}
                onNext={() => {
                  const i = answer.section
                  setAnswer(null)
                  if (!p.passed.includes(i)) applyPassed([i], i, { revealed: [...(p.revealed ?? []), i] })
                }}
                onClose={() => setAnswer(null)}
              />
            )}
            {focus !== null && !showEndCard && (
              <CheckpointPanel
                title={step.sections[focus].title}
                mode={cp ? cp.mode : 'todo'}
                hasVideo={!!step.video}
                code={hintOpen === focus ? step.sections[focus].code : null}
                guessed={(step.sections[focus].note ?? '').includes('推測')}
                wrong={wrong?.section === focus ? wrong : null}
                passedTitles={toast && !toast.optional ? toast.titles : null}
                onRewind={() => {
                  if (!step.video) return
                  // 止まっているときは10秒もどす（またここで止まる）。動画のあとは、その見出しの場面から
                  const to = cp ? Math.max(0, cp.at - 10) : step.sections[focus].start
                  setCp(null)
                  setDeferred((d) => d.filter((x) => x !== focus))
                  seekTo(to)
                }}
                onHint={() => setHintOpen(hintOpen === focus ? null : focus)}
                onLater={() => {
                  if (!cp) return
                  // 飛ばしたときは、飛ばした先からそのまま。止まったときは止まった所から
                  const now = player.current?.time() ?? cp.at
                  setDeferred((d) => [...d, ...dueAt(step, Math.max(cp.at, now), p.passed, d)])
                  setCp(null)
                  seekTo(cp.mode === 'jump' ? now : cp.at)
                }}
                onBack={() => {
                  setCp(null)
                  seekTo(step.sections[focus].start)
                }}
              />
            )}

            <div className="grid flex-none gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(step.sections.length, 5)}, minmax(0, 1fr))` }}>
              {step.sections.map((sec, i) => {
                const ok = p.passed.includes(i)
                const isNext = i === focus
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (!step.video) return
                      // 見たい場面へ。その見出しは「あとでやる」をやめて、終わりでまた止まる
                      setCp(null)
                      setEndCard(false)
                      setDeferred((d) => d.filter((x) => x !== i))
                      seekTo(sec.start)
                    }}
                    className={`rounded-[14px] bg-white px-3 py-2 text-left text-[13.5px] font-bold leading-snug shadow-sm ${
                      isNext ? 'shadow-[0_0_0_2px_#ffc21a,0_0_0_6px_#fff6d1]' : ''
                    } ${ok ? 'text-[#9b97b8]' : ''}`}
                  >
                    <span className="flex items-center justify-between gap-1 text-xs text-[#6d6893]">
                      {step.video ? fmtTime(sec.start) : `${i + 1}`}
                      {ok && (p.revealed ?? []).includes(i) ? (
                        <span className="rounded-full bg-[#fff1e3] px-2 text-[11.5px] text-[#a24b00]">こたえを見た</span>
                      ) : ok ? (
                        <span className="rounded-full bg-[#e2f7ec] px-2 text-[11.5px] text-[#11845a]">結果 ✔</span>
                      ) : isNext ? (
                        <span className="rounded-full bg-[#ffd23f] px-2 text-[11.5px] text-[#5c4200]">いまここ</span>
                      ) : sec.optional ? (
                        <span className="rounded-full bg-[#fff6d1] px-2 text-[11.5px] text-[#8a6400]">できたら⭐</span>
                      ) : deferred.includes(i) ? (
                        <span className="rounded-full bg-[#ffe3cc] px-2 text-[11.5px] text-[#a24b00]">あとでやる</span>
                      ) : !reached(i) ? (
                        <span className="rounded-full bg-[#f0eef7] px-2 text-[11.5px] text-[#8a85ad]">動画が来たら判定</span>
                      ) : null}
                    </span>
                    {sec.title}
                  </button>
                )
              })}
            </div>

            <div className="flex-none rounded-[18px] bg-white px-4 py-3 shadow-sm">
              <div className="text-[13px] font-bold tracking-wider text-[#6d6893]">この動画で わかること（見出しの結果が合うと 自動でチェック）</div>
              <ul className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1.5">
                {step.learn.map((l, i) => {
                  const on = passedCount >= Math.ceil(((i + 1) * total) / step.learn.length)
                  return (
                    <li key={l} className="flex items-center gap-2 text-[13.5px] font-bold">
                      <span className={`grid h-5 w-5 flex-none place-items-center rounded-md border-2 text-xs ${on ? 'border-[#22b573] bg-[#22b573] text-white' : 'border-[#e6e1fa]'}`}>
                        {on ? '✔' : ''}
                      </span>
                      {l}
                    </li>
                  )
                })}
              </ul>
              {step.card && (
                <div className="mt-3 rounded-xl bg-[#e8f5fc] px-3 py-2 text-[13px] font-bold leading-relaxed">
                  <b>{step.card.title}</b>　{step.card.body}
                </div>
              )}
            </div>
          </div>

          <div className="min-h-0">
            <PyEditor
              key={step.step}
              initialFiles={initialFiles}
              height="fill"
              banner={banner}
              highlight={focus !== null && cp?.mode !== 'jump'}
              inputsHint={inputsHint}
              markLine={wrong?.hint?.kind === 'differs' || wrong?.hint?.kind === 'error' ? wrong.hint.line : null}
              overlay={toast && <ClearToast titles={toast.titles} optional={toast.optional} all={toast.all} />}
              onFocus={() => player.current?.pause()}
              onFilesChange={(files) => {
                const state = loadNavi()
                state.steps[stepNo] = { ...stepProgress(state, stepNo), files }
                saveNavi(state)
                setP((prev) => (prev ? { ...prev, files } : prev))
                setWrong(null)
              }}
              onRunFinished={onRunFinished}
            />
          </div>
        </div>

        <div className="flex h-[74px] flex-none items-center gap-3.5 rounded-[22px] bg-white pl-[22px] pr-3.5 shadow-sm">
          <span className="mr-1.5 text-[15px] font-black">クリアの じょうけん</span>
          {step.video && (
            <span className={`flex items-center gap-2.5 rounded-full py-2 pl-2.5 pr-4 text-sm font-bold ${videoOk ? 'bg-[#e2f7ec] text-[#0f7a51]' : 'bg-[#f6f5fb]'}`}>
              <i className={`grid h-[26px] w-[26px] place-items-center rounded-full text-[13px] font-black not-italic ${videoOk ? 'bg-[#22b573] text-white' : 'bg-[#e6e2f3] text-[#9893b5]'}`}>
                {videoOk ? '✔' : '1'}
              </i>
              {videoOk ? '動画を最後まで見た' : '動画を最後まで見る'}
              {!videoOk && (
                <span className="text-[#6d6893]">あと {fmtTime(Math.max(0, step.video.end - Math.max(time, p.videoPos)))}</span>
              )}
            </span>
          )}
          <span className={`flex items-center gap-2.5 rounded-full py-2 pl-2.5 pr-4 text-sm font-bold ${allSections ? 'bg-[#e2f7ec] text-[#0f7a51]' : 'bg-[#f6f5fb]'}`}>
            <i className={`grid h-[26px] w-[26px] place-items-center rounded-full text-[13px] font-black not-italic ${allSections ? 'bg-[#22b573] text-white' : 'bg-[#e6e2f3] text-[#9893b5]'}`}>
              {allSections ? '✔' : '2'}
            </i>
            見出しの結果
            <span className="text-[#6d6893]">
              {passedCount} / {total}
              {!allSections && `（あと${total - passedCount}つ）`}
            </span>
          </span>
          {optionalTotal > 0 && (
            <span className="text-[13px] font-bold text-[#8a6400]">
              できたら⭐ {optionalPassed} / {optionalTotal}
            </span>
          )}
          <span className="flex-1" />
          {canGo ? (
            step.codeblock.length > 0 ? (
              <Link
                href={`/lesson/${firstLesson}`}
                onClick={() => save({ done: true })}
                className="flex h-[52px] items-center rounded-full bg-[#ff8a1f] px-6 font-black whitespace-nowrap text-white shadow-[0_5px_0_#db6500]"
              >
                ② {naviLessonLabel(firstLesson)} に進む ›
              </Link>
            ) : (
              <button
                onClick={() => {
                  save({ done: true })
                  const state = loadNavi()
                  state.current = stepNo + 1
                  saveNavi(state)
                  router.push('/navi')
                }}
                className="flex h-[52px] items-center rounded-full bg-[#ff8a1f] px-6 font-black whitespace-nowrap text-white shadow-[0_5px_0_#db6500]"
              >
                ステップ{step.step} クリア！ ホームへ ›
              </button>
            )
          ) : (
            <span className="flex h-[52px] items-center whitespace-nowrap rounded-full bg-[#ebe8f5] px-6 font-black text-[#625d8a]">
              🔒 {!videoOk && !allSections ? '2つそろうと' : 'あと少しで'} {step.codeblock.some(isFinishLesson) ? '仕上げ' : 'CodeBlock'} に進める
            </span>
          )}
        </div>
      </div>

      {ending && (
        <EndPopup
          learned={learnedToday}
          xp={learnedToday.length * XP_PER_SECTION}
          progressLines={[
            ...(step.video ? [p.videoDone ? `${videoLabel(step)} は最後まで見た` : `${videoLabel(step)} は ${fmtTime(p.videoPos)} まで見た`] : []),
            `エディターのコード（${Object.keys(p.files)[0] ?? step.fileName}）`,
            `見出しの結果 ${passedCount} / ${total}`,
          ]}
          nextText={nextText}
          onBack={() => setEnding(false)}
          onEnd={() => {
            const state = loadNavi()
            state.sessions.push({ at: Date.now(), step: stepNo, learned: learnedToday, xp: learnedToday.length * XP_PER_SECTION })
            state.reviewAnswered[stepNo] = false
            saveNavi(state)
            router.push('/navi')
          }}
        />
      )}
    </div>
  )
}

// 止まったところ・動画のあとの案内（動画の下に出す。動画の画面のコードは見えたまま）
// チャレンジの「こたえの例」。合っていたら確かめに、まちがっていたら見くらべて「こたえを見て次へ」で進める
function AnswerCard(props: { section: NaviSection; ok: boolean; revealed: boolean; error?: string; onNext: () => void; onClose: () => void }) {
  const { section, ok, revealed, error } = props
  const btn = 'whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13.5px] font-black'
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    box.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [section, ok])
  return (
    <div
      ref={box}
      className={`mx-1.5 flex flex-none flex-col gap-2.5 rounded-[18px] px-5 py-3.5 ${
        ok ? 'bg-[#eefaf3] shadow-[0_0_0_2px_#5fd39a]' : 'bg-[#fff6ec] shadow-[0_0_0_2px_#ffb27a]'
      }`}
    >
      <div className="text-[16px] font-black leading-snug text-[#2a2452]">
        {ok
          ? revealed
            ? `「${section.title}」は、こたえを見て進んだよ`
            : `✔ 正解！「${section.title}」のこたえの例`
          : `おしい！「${section.title}」のこたえの例と、くらべてみよう`}
      </div>
      {!ok && error && (
        // 前のチャレンジのまちがいが残っていると、ここでエラーになる。どの行かを見せる
        <div className="rounded-xl bg-white px-3.5 py-2 text-[14px] font-bold leading-relaxed text-[#2a2452] shadow-[inset_0_0_0_2px_#ffb27a]">
          <b className="text-[#c93c3c]">エラーが出ているよ。</b>
          {error}
        </div>
      )}
      <div className="rounded-xl bg-[#23203b] px-4 py-3">
        <div className="mb-1 text-[12px] font-bold text-[#b8b3d8]">こたえの例</div>
        <pre className="overflow-x-auto font-mono text-[17px] leading-[1.7] text-[#f4f2ff]">{section.code}</pre>
      </div>
      {section.answerNote && <div className="text-[14px] font-bold leading-relaxed text-[#2a2452]">💡 {section.answerNote}</div>}
      <div className="flex flex-wrap items-center gap-2">
        {ok ? (
          <button onClick={props.onClose} className={`${btn} bg-white text-[#2a2452] shadow-sm`}>
            とじる
          </button>
        ) : (
          <>
            <button onClick={props.onNext} className={`${btn} bg-[#ff8a1f] text-white shadow-[0_3px_0_#db6500]`}>
              こたえを見たので次へ ›
            </button>
            <button onClick={props.onClose} className={`${btn} bg-white text-[#2a2452] shadow-sm`}>
              もう一度やってみる
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function CheckpointPanel(props: {
  title: string
  mode: 'pause' | 'jump' | 'todo'
  hasVideo: boolean
  code: string | null
  guessed: boolean
  wrong: { hint: CodeHint | null } | null
  passedTitles: string[] | null // いまクリアした見出し（緑で出す）
  onRewind: () => void
  onHint: () => void
  onLater: () => void
  onBack: () => void
}) {
  const { title, mode, hasVideo, code, guessed, wrong, passedTitles } = props
  const btn = 'whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13.5px] font-black'
  // 中身が変わったら、案内がまるごと見えるところまで左の列をスクロールする
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    box.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [mode, code, wrong, passedTitles])
  if (passedTitles) {
    return (
      <div ref={box} className="flex flex-none items-center gap-3 rounded-[18px] bg-[#22b573] px-5 py-3.5 text-white shadow-sm">
        <span className="text-[26px]">✔</span>
        <div className="text-[17px] font-black">
          {passedTitles.map((t) => `「${t}」`).join('')}クリア！{mode === 'pause' ? ' 動画のつづきを再生するよ' : ''}
        </div>
      </div>
    )
  }
  if (mode === 'jump') {
    return (
      <div ref={box} className="flex flex-none flex-col gap-2.5 rounded-[18px] bg-[#fff1e3] px-5 py-3.5 shadow-[0_0_0_2px_#ffb27a]">
        <div className="text-[16px] font-black text-[#2a2452]">⏩ 「{title}」を とばしたよ</div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={props.onBack} className={`${btn} bg-[#ff8a1f] text-white shadow-[0_3px_0_#db6500]`}>
            ▶ そこへもどる
          </button>
          <button onClick={props.onLater} className={`${btn} bg-white text-[#6d6893] shadow-sm`}>
            このまま進む（あとでやる）
          </button>
        </div>
      </div>
    )
  }
  return (
    <div ref={box} className="mx-1.5 flex flex-none flex-col gap-2.5 rounded-[18px] bg-[#fffbea] px-5 py-3.5 shadow-[0_0_0_2px_#ffc21a,0_0_0_6px_#fff6d1]">
      <div className="text-[16px] font-black leading-snug text-[#2a2452]">
        {mode === 'pause' ? '⏸ 動画を止めたよ。' : '👉 つぎは '}「{title}」{mode === 'pause' ? 'のコードを右に打って ▶ 実行しよう' : 'の結果を出そう'}
      </div>
      {wrong && (
        <div className="rounded-xl bg-white px-3.5 py-2 text-[14px] font-bold leading-relaxed text-[#2a2452] shadow-[inset_0_0_0_2px_#ffb27a]">
          {wrong.hint?.kind === 'error' ? (
            <>
              <b className="text-[#c93c3c]">エラーが出ているよ。</b>
              {wrong.hint.text}
              {wrong.hint.line ? <span className="text-[#6d6893]">（色のついた行）</span> : null}
            </>
          ) : wrong.hint === null ? (
            <>まだ{hasVideo ? '動画' : '見本'}と同じ結果じゃないみたい。「💡 ヒント」のコードと見くらべてみよう</>
          ) : wrong.hint.kind === 'differs' ? (
            <>
              <b className="text-[#db6500]">{wrong.hint.line}行目</b>がちがうよ：{wrong.hint.tip}
              <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 font-mono text-[13.5px]">
                <span className="text-[#6d6893]">{hasVideo ? '動画' : '見本'}</span>
                <code className="whitespace-pre text-[#11845a]">{wrong.hint.want}</code>
                <span className="text-[#6d6893]">きみ</span>
                <code className="whitespace-pre text-[#c93c3c]">{wrong.hint.got}</code>
              </div>
            </>
          ) : (
            <>
              この行が まだないみたい：<code className="whitespace-pre font-mono text-[#11845a]">{wrong.hint.want}</code>
            </>
          )}
        </div>
      )}
      {code !== null && (
        <div className="rounded-xl bg-[#23203b] px-4 py-3">
          <div className="mb-1 text-[12px] font-bold text-[#b8b3d8]">
            {hasVideo ? '動画のコード' : '見本のコード'}
            {guessed ? '（れい）' : ''}：見ながら右に打とう
          </div>
          <pre className="overflow-x-auto font-mono text-[17px] leading-[1.7] text-[#f4f2ff]">{code}</pre>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {hasVideo && (
          <button onClick={props.onRewind} className={`${btn} bg-white text-[#2a2452] shadow-sm`}>
            {mode === 'pause' ? '↺ 10秒もどして見る' : '▶ この場面を見る'}
          </button>
        )}
        <button onClick={props.onHint} className={`${btn} ${code !== null ? 'bg-[#ffd23f] text-[#5c4200]' : 'bg-white text-[#2a2452] shadow-sm'}`}>
          💡 {code !== null ? 'ヒントをとじる' : hasVideo ? 'ヒント（動画のコード）' : 'ヒント（見本のコード）'}
        </button>
        {mode === 'pause' && (
          <button onClick={props.onLater} className={`${btn} ml-auto text-[#6d6893] hover:bg-white`}>
            あとでやる ›
          </button>
        )}
      </div>
    </div>
  )
}

// 「見出しクリア！」（エディターの上に大きく出す）
function ClearToast({ titles, optional, all }: { titles: string[]; optional: boolean; all: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center">
      <div className={`rounded-[20px] px-7 py-4 text-center text-white shadow-[0_12px_30px_rgba(0,0,0,.35)] ${optional ? 'bg-[#e0a100]' : 'bg-[#22b573]'}`}>
        <div className="text-[24px] font-black">{all ? '🎉 ぜんぶクリア！' : optional ? '⭐ できたら クリア！' : '✔ 見出しクリア！'}</div>
        <div className="mt-1 text-[15px] font-bold">{titles.map((t) => `「${t}」`).join('')}</div>
        {all && <div className="mt-1 text-[14px] font-bold">下の「② … に進む」へ</div>}
      </div>
    </div>
  )
}
