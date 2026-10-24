'use client'

// 1ステップの学習画面：左で動画を見ながら、右のエディターで同じコードを打つ
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PyEditor, type RunResult } from '@/components/navi/PyEditor'
import { YouTubePlayer, type PlayerHandle } from '@/components/navi/YouTubePlayer'
import { NaviHeader } from '@/components/navi/NaviHeader'
import { EndPopup } from '@/components/navi/EndPopup'
import { getNaviStep } from '@/data/navi/steps'
import { judgeByRunOnly, sectionPassed } from '@/lib/navi/judge'
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
  const lastSaved = useRef(0)

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
  }, [stepNo])

  const save = (patch: Partial<StepProgress>) => {
    const state = updateStep(stepNo, patch)
    setP(stepProgress(state, stepNo))
  }

  const onTime = (sec: number) => {
    if (!step?.video || !p) return
    setTime(sec)
    const reachedEnd = sec >= step.video.end
    const furthest = Math.max(p.videoPos, sec)
    if (reachedEnd && !p.videoDone) {
      save({ videoPos: furthest, videoDone: true })
    } else if (Date.now() - lastSaved.current > 5000 && furthest > p.videoPos) {
      lastSaved.current = Date.now()
      save({ videoPos: furthest })
    }
  }

  const onEnded = () => {
    if (p && !p.videoDone) save({ videoDone: true })
  }

  // どの見出しまで動画が来たか（作品の回は全部）
  const reached = useCallback(
    (i: number) => !step?.video || !!p?.videoDone || Math.max(time, p?.videoPos ?? 0) >= step.sections[i].start,
    [p, step, time],
  )

  const onRunFinished = (r: RunResult) => {
    if (!step || !p) return
    const code = Object.values(p.files).join('\n')
    const newly: number[] = []
    step.sections.forEach((sec, i) => {
      if (p.passed.includes(i) || !reached(i)) return
      const ok = judgeByRunOnly(sec) ? r.ok : sectionPassed(sec, r.output, code)
      if (ok) newly.push(i)
    })
    if (newly.length > 0) {
      save({ passed: [...p.passed, ...newly] })
      setPassedToday((prev) => [...prev, ...newly])
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

  const total = step.sections.length
  const passedCount = p.passed.length
  const nextSection = step.sections.findIndex((_, i) => !p.passed.includes(i))
  const videoOk = !step.video || p.videoDone
  const allSections = passedCount === total
  const canGo = videoOk && allSections
  const completed = codeblockCompleted()
  const firstLesson = step.codeblock.find((id) => !completed.includes(id)) ?? step.codeblock[0]
  const showEndCard = !!step.video && p.videoDone && !allSections
  const initialFiles = Object.keys(p.files).length > 0 ? p.files : { [step.fileName]: `# ${step.title} を見ながら、同じコードを打ってみよう\n` }
  const inputsHint = nextSection >= 0 ? step.sections[nextSection].inputs : undefined

  const banner =
    showEndCard && nextSection >= 0 ? (
      <div className="flex flex-none items-center gap-2.5 bg-[#ffd23f] px-[18px] py-2.5 text-[15px] font-black text-[#2a2452]">
        👉 つぎは「{step.sections[nextSection].title}」の結果を出そう
        <span className="ml-auto whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-[13px] text-[#8a6400]">あと{total - passedCount}つ</span>
      </div>
    ) : (
      <div className="flex flex-none items-center gap-2.5 bg-[#2b2650] px-[18px] py-2.5 text-sm font-bold text-[#e9e6ff]">
        🎯 見出しごとに、動画と<b className="text-[#ffd23f]">同じ結果</b>を出そう
        <span className="ml-auto text-[#b8b3d8]">
          {passedCount} / {total}
        </span>
      </div>
    )

  const learnedToday = passedToday.map((i) => step.sections[i].title)
  const action = nextAction(step, p)
  const nextText =
    action.kind === 'video'
      ? `おさらい1問 → 動画の ${fmtTime(resumeFrom(p.videoPos))} から（10秒もどして）つづき。ホームでナビが案内するよ`
      : action.kind === 'section'
        ? `おさらい1問 → 「${step.sections[action.index].title}」の結果を出すところから。ホームでナビが案内するよ`
        : action.kind === 'codeblock'
          ? `おさらい1問 → CodeBlock ${action.lessonId} から。ホームでナビが案内するよ`
          : 'つぎのステップから。ホームでナビが案内するよ'

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
              {step.codeblock.length > 0 ? `CodeBlock ${step.codeblock[0]}〜${step.codeblock[step.codeblock.length - 1]}` : 'チャレンジ（できたら）'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-bold text-[#6d6893]">
            <Link href="/navi">‹ ホーム</Link>·<span>ステップ{step.step}</span>·
            <span className="text-[#2a2452]">
              {step.title}
              {step.video ? `（${fmtTime(step.video.length)}）` : ''}
            </span>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-5">
          <div className="flex min-h-0 flex-col gap-3">
            {step.video ? (
              <div className="relative flex-none overflow-hidden rounded-[22px] bg-[#1d1838] shadow-lg">
                <YouTubePlayer ref={player} videoId={step.video.id} startAt={step.video.start ?? startAt} onTime={onTime} onEnded={onEnded} />
                {showEndCard && nextSection >= 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[rgba(21,18,42,.86)] text-white">
                    <div className="text-3xl font-black">動画おわり！</div>
                    <div className="text-[15px] font-bold text-[#cfcbe8]">
                      見出し{total}つのうち {passedCount}つの結果が出ているよ
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-[#fffbea] px-5 py-3.5 text-[17px] font-black text-[#2a2452] shadow-[0_0_0_5px_rgba(255,210,63,.35)]">
                      <span className="rounded-full bg-[#ffd23f] px-2.5 py-0.5 text-xs text-[#5c4200]">つぎ</span>
                      右のエディターで「{step.sections[nextSection].title}」のコードを打とう
                      <b className="text-[22px] text-[#db6500]">→</b>
                    </div>
                    <button
                      onClick={() => {
                        player.current?.seek(step.sections[nextSection].start)
                        player.current?.play()
                        save({ videoDone: true })
                      }}
                      className="rounded-full bg-white/10 px-3.5 py-1.5 text-[13.5px] font-bold text-[#cfcbe8]"
                    >
                      ↺ {fmtTime(step.sections[nextSection].start)} からもう一度見る
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-none rounded-[22px] bg-white p-5 shadow-sm">
                <div className="text-lg font-black">作品の回</div>
                <div className="mt-1 text-sm font-bold text-[#6d6893]">見本を動かして、自分の数字や言葉に変えてみよう</div>
              </div>
            )}

            <div className="grid flex-none grid-cols-4 gap-2">
              {step.sections.map((sec, i) => {
                const ok = p.passed.includes(i)
                const isNext = i === nextSection
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (step.video) {
                        player.current?.seek(sec.start)
                        player.current?.play()
                      }
                    }}
                    className={`rounded-[14px] bg-white px-3 py-2 text-left text-[13.5px] font-bold leading-snug shadow-sm ${
                      isNext && showEndCard ? 'shadow-[0_0_0_2px_#ffc21a,0_0_0_6px_#fff6d1]' : ''
                    } ${ok ? 'text-[#9b97b8]' : ''}`}
                  >
                    <span className="flex items-center justify-between text-xs text-[#6d6893]">
                      {step.video ? fmtTime(sec.start) : `${i + 1}`}
                      {ok ? (
                        <span className="rounded-full bg-[#e2f7ec] px-2 text-[11.5px] text-[#11845a]">結果 ✔</span>
                      ) : isNext && showEndCard ? (
                        <span className="rounded-full bg-[#ffd23f] px-2 text-[11.5px] text-[#5c4200]">つぎはここ</span>
                      ) : !reached(i) ? (
                        <span className="rounded-full bg-[#f0eef7] px-2 text-[11.5px] text-[#8a85ad]">動画が来たら判定</span>
                      ) : null}
                    </span>
                    {sec.title}
                  </button>
                )
              })}
            </div>

            <div className="min-h-0 flex-1 overflow-auto rounded-[18px] bg-white px-4 py-3 shadow-sm">
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
              highlight={showEndCard}
              inputsHint={inputsHint}
              onFocus={() => player.current?.pause()}
              onFilesChange={(files) => {
                const state = loadNavi()
                state.steps[stepNo] = { ...stepProgress(state, stepNo), files }
                saveNavi(state)
                setP((prev) => (prev ? { ...prev, files } : prev))
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
          <span className="flex-1" />
          {canGo ? (
            step.codeblock.length > 0 ? (
              <Link
                href={`/lesson/${firstLesson}`}
                onClick={() => save({ done: true })}
                className="flex h-[52px] items-center rounded-full bg-[#ff8a1f] px-6 font-black whitespace-nowrap text-white shadow-[0_5px_0_#db6500]"
              >
                ② CodeBlock {firstLesson} に進む ›
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
              🔒 {!videoOk && !allSections ? '2つそろうと' : 'あと少しで'} CodeBlock に進める
            </span>
          )}
        </div>
      </div>

      {ending && (
        <EndPopup
          learned={learnedToday}
          xp={learnedToday.length * XP_PER_SECTION}
          progressLines={[
            ...(step.video ? [p.videoDone ? `動画 ${step.video.no} は最後まで見た` : `動画 ${step.video.no} は ${fmtTime(p.videoPos)} まで見た`] : []),
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
