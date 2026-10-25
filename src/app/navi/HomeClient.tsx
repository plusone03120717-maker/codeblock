'use client'

// Python ナビのホーム：ナビ（VTuber）が「前回のつづき」と、つぎにやること1つを案内する
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NaviHeader } from '@/components/navi/NaviHeader'
import { NAVI_STEPS, getNaviStep } from '@/data/navi/steps'
import { UNIT_NAMES, type NaviStep } from '@/lib/navi/types'
import {
  codeblockCompleted,
  fmtTime,
  loadNavi,
  nextAction,
  resumeFrom,
  saveNavi,
  stepProgress,
  type NaviState,
  type NextAction,
} from '@/lib/navi/progress'
import { useAuth } from '@/contexts/AuthContext'
import { useNaviVoice } from '@/components/navi/useNaviVoice'
import { FIRST_TIME_SPEECH, REVIEW_RIGHT_SPEECH, REVIEW_WRONG_SPEECH, returnSpeech } from '@/lib/navi/speech'

// ステップの数（単元ごと）：本編 U1〜U6
const UNIT_STEPS: Record<number, number[]> = { 1: [1, 2, 3, 4, 5, 6], 2: [7, 8, 9], 3: [10, 11, 12], 4: [13, 14, 15, 16], 5: [17, 18, 19, 20], 6: [21, 22, 23, 24, 25] }

function actionTitle(step: NaviStep, a: NextAction): string {
  if (a.kind === 'video') return a.from > 0 ? `動画 ${step.video?.no} を ${fmtTime(resumeFrom(a.from))} から` : `動画 ${step.video?.no} を見ながら打とう`
  if (a.kind === 'section') return `「${step.sections[a.index].title}」の結果を出そう`
  if (a.kind === 'codeblock') return a.mission > 0 ? `CodeBlock ${a.lessonId} の ${a.mission + 1}問目から` : `CodeBlock ${a.lessonId} をやろう`
  return 'つぎのステップへ'
}

function actionHref(step: NaviStep, a: NextAction): string {
  if (a.kind === 'codeblock') return a.mission > 0 ? `/lesson/${a.lessonId}/editor` : `/lesson/${a.lessonId}`
  if (a.kind === 'next-step') return `/navi/step/${step.step + 1}`
  return `/navi/step/${step.step}`
}

// いまのステップ・つぎにやること・はじめてか・おさらいがあるか
function derive(state: NaviState) {
  // ステップのデータがまだ無いときは、ある最初のステップへ
  const step = getNaviStep(state.current) ?? NAVI_STEPS[0]
  const p = stepProgress(state, step.step)
  const action = nextAction(step, p)
  const firstTime = state.sessions.length === 0 && p.videoPos === 0 && p.passed.length === 0
  const last = state.sessions[state.sessions.length - 1]
  const lastStep = last ? getNaviStep(last.step) : undefined
  const needReview = !!lastStep && state.reviewAnswered[last.step] === false
  return { step, p, action, firstTime, lastStep, needReview }
}

export function HomeClient() {
  const router = useRouter()
  const { user } = useAuth()
  const [state, setState] = useState<NaviState | null>(null)
  const [review, setReview] = useState<{ step: NaviStep; picked: number | null } | null>(null)
  const voice = useNaviVoice()

  useEffect(() => {
    // ブラウザの保存（localStorage）は表示のあとでしか読めないので、ここで1回だけ入れる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadNavi())
  }, [])

  // ナビが声で言う文（吹き出しと同じ中身を、読みまちがえない書き方にしたもの）
  const d = state ? derive(state) : null
  const speech = !d ? '' : d.firstTime ? FIRST_TIME_SPEECH : returnSpeech(d.step, d.action, d.p.videoPos, d.needReview)

  // ホームを開いたら、ナビが話す（声オフのときは話さない。オンにもどしたら、もう一度話す）
  const { ready: voiceReady, off: voiceOff, speak } = voice
  useEffect(() => {
    if (speech && voiceReady && !voiceOff) speak(speech)
  }, [speech, voiceReady, voiceOff, speak])

  if (!state || !d) return null

  const { step, p, action, firstTime, lastStep, needReview } = d
  const name = user?.displayName ?? ''
  const completed = codeblockCompleted()

  const bubble = firstTime ? (
    <>
      はじめまして{name && `、${name}さん`}！ ナビだよ。
      <br />
      プログラミングは、コンピューターへの<em className="not-italic text-[#7448f0]">命令を文字で書くこと</em>。
      <br />
      Python は AI などでも使われていて、短く書けるのがいいところ。Scratch のブロックが文字になったと思ってね。
      <br />
      「はじめる」を押してみよう！
    </>
  ) : (
    <>
      おかえり{name && `、${name}さん`}！
      <br />
      {action.kind === 'video' && action.from > 0 && step.video ? (
        <>
          前回は <em className="not-italic text-[#7448f0]">動画 {step.video.no}</em> の{' '}
          <mark className="bg-[linear-gradient(transparent_60%,#ffd23f_60%)]">{fmtTime(p.videoPos)}</mark> でおわりにしたね。
        </>
      ) : (
        <>前回のつづきから始めよう。</>
      )}
      <br />
      {needReview && <b>おさらい1問</b>}
      {needReview ? 'のあと、' : ''}
      <b>{actionTitle(step, action)}</b>！<br />
      「はじめる」を押してね。
    </>
  )

  const start = () => {
    voice.stop()
    if (needReview && lastStep) setReview({ step: lastStep, picked: null })
    else router.push(actionHref(step, action))
  }

  const sectionsLeft = step.sections.filter((_, i) => !p.passed.includes(i))
  const after: string[] = []
  if (action.kind === 'video' && sectionsLeft.length > 0) after.push(`「${sectionsLeft[sectionsLeft.length - 1].title}」までの結果を出す`)
  const lessonsLeft = step.codeblock.filter((id) => !completed.includes(id))
  if (action.kind !== 'codeblock' && lessonsLeft.length > 0) after.push(`CodeBlock ${lessonsLeft.join('・')}`)
  after.push(`ステップ${step.step + 1} へ`)

  return (
    <div className="flex h-screen flex-col">
      <NaviHeader step={step.step} unit={step.unit} name={name} />
      <div className="grid min-h-0 flex-1 grid-cols-[440px_1fr] gap-6 px-8 py-6">
        <section className="relative flex flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#d6eefb_0%,#eef7fd_70%,#fff_100%)] p-[22px] shadow-sm">
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white py-1 pl-1.5 pr-3.5 text-sm font-black shadow-sm">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ffd23f] text-[15px] font-black text-[#8a6400]">+</span>ナビ
            </span>
            {!voice.unavailable && <VoiceControls voice={voice} />}
          </div>
          {/* 話しているあいだは「ふつう」と「話す」を声の大きさで切りかえる（目の形が同じ2枚）。3枚とも先に読みこんでおく */}
          {(['smile', 'normal', 'talk'] as const).map((face) => {
            const show = voice.speaking ? (voice.mouthOpen ? 'talk' : 'normal') : 'smile'
            return (
              <Image
                key={face}
                src={`/navi/bob_${face}.webp`}
                alt={face === 'smile' ? 'ナビ' : ''}
                width={520}
                height={520}
                unoptimized
                priority
                className={`pointer-events-none absolute left-1/2 top-10 w-[520px] max-w-none -translate-x-1/2 ${show === face ? 'opacity-100' : 'opacity-0'}`}
              />
            )
          })}
          <div className="absolute inset-x-0 bottom-0 z-[1] h-[330px] bg-[linear-gradient(transparent,rgba(255,255,255,.95)_45%)]" />
          <div className="relative z-10 mt-auto rounded-[20px] bg-white px-5 py-4 text-base font-bold leading-[1.75] shadow-sm">{bubble}</div>
        </section>

        <main className="flex min-w-0 flex-col gap-5">
          <div className="flex items-end justify-between">
            <h1 className="text-[30px] font-black leading-tight">今日やること</h1>
            <span className="rounded-full bg-white px-[18px] py-2 text-sm font-bold shadow-sm">
              単元：<b className="text-[#7448f0]">{UNIT_NAMES[step.unit]}</b>
            </span>
          </div>

          <section className="rounded-[22px] bg-white px-7 pb-6 pt-6 shadow-sm">
            <div className="flex items-center gap-3">
              <h2 className="text-[19px] font-black">
                ステップ{step.step}　{step.title}
              </h2>
              {!firstTime && <span className="rounded-full bg-[#ffd23f] px-3 py-0.5 text-[13px] font-bold text-[#5c4200]">前回のつづき</span>}
              <span className="ml-auto text-[13px] font-bold text-[#6d6893]">おわるときは「🏁 今日はおわる」を押してね。次はそこからつづくよ</span>
            </div>
            <div className="mt-4 grid grid-cols-[1.5fr_1fr] gap-[18px]">
              <div className="flex flex-col gap-3 rounded-[20px] border-2 border-[#ffc21a] px-[22px] py-[18px] shadow-[0_0_0_6px_#fff6d1]">
                <div className="text-[13px] font-black tracking-widest text-[#8a6400]">
                  <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-[#ffd23f] text-[13px] text-[#5c4200]">1</span>つぎにやること
                </div>
                <div className="text-[21px] font-black leading-snug">
                  {needReview ? 'おさらい1問 → ' : ''}
                  {actionTitle(step, action)}
                </div>
                {step.video && (
                  <Bar label="動画" value={p.videoDone ? 1 : p.videoPos / step.video.end} text={p.videoDone ? '最後まで見た' : `${fmtTime(p.videoPos)} / ${fmtTime(step.video.length)}`} color="#ff8a1f" />
                )}
                <Bar label="見出しの結果" value={p.passed.length / step.sections.length} text={`${p.passed.length} / ${step.sections.length}`} color="#22b573" />
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="text-[13.5px] font-bold text-[#6d6893]">
                    エディターに打ったコードも、
                    <br />
                    そのまま残っているよ{action.kind === 'video' && p.videoPos > 0 ? '（10秒もどして再生）' : ''}
                  </span>
                  <button onClick={start} className="h-14 flex-none whitespace-nowrap rounded-full bg-[#ff8a1f] px-7 text-[17px] font-black text-white shadow-[0_5px_0_#db6500]">
                    はじめる ▶
                  </button>
                </div>
              </div>
              <div className="rounded-[20px] bg-[#faf9fe] px-5 py-[18px]">
                {lastStep && lastStep.learn.length > 0 && (
                  <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-[13px] font-bold text-[#6d6893]">前回わかったこと</span>
                    {lastStep.learn.slice(0, 3).map((l) => (
                      <span key={l} className="rounded-full bg-[#e2f7ec] px-2.5 py-0.5 text-[13px] font-bold text-[#11845a]">
                        ✔ {l}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mb-2 text-[13px] font-bold text-[#6d6893]">そのあとは</div>
                <ol className="flex flex-col gap-3">
                  {after.map((t, i) => (
                    <li key={t} className="flex items-start gap-3 text-[15px] font-black leading-snug">
                      <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-[#e6e2f3] text-[13px] text-[#6d6893]">
                        {i === after.length - 1 ? '→' : i + 2}
                      </span>
                      {t}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="rounded-[22px] bg-white px-7 py-6 shadow-sm">
            <div className="flex items-center">
              <h2 className="text-[19px] font-black">一本道</h2>
              <div className="ml-auto flex gap-4 text-[12.5px] font-bold text-[#6d6893]">
                <span>🟩 クリア</span>
                <span>🟨 いまここ</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              {Object.entries(UNIT_STEPS).map(([u, steps]) => (
                <div key={u} className="flex gap-1" style={{ flex: steps.length }}>
                  {steps.map((s) => {
                    const sp = stepProgress(state, s)
                    const cls = sp.done ? 'bg-[#22b573]' : s === step.step ? 'bg-[#ffd23f] shadow-[0_0_0_3px_#fff0b3]' : 'bg-[#ece9f6]'
                    return <span key={s} title={`ステップ${s}`} className={`h-3.5 flex-1 rounded ${cls}`} />
                  })}
                </div>
              ))}
              <span className="flex-none text-xs font-bold text-[#6d6893]">… つづく</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(UNIT_NAMES).map(([u, n]) => (
                <span
                  key={u}
                  className={`rounded-full px-3 py-0.5 text-[13.5px] font-bold ${Number(u) === step.unit ? 'bg-[#ffd23f] text-[#5c4200]' : 'bg-[#f7f6fc] text-[#6d6893]'}`}
                >
                  {u} {n}
                </span>
              ))}
              <span className="rounded-full bg-[#f7f6fc] px-3 py-0.5 text-[13.5px] font-bold text-[#6d6893]">7〜12 つづき</span>
              <span className="rounded-full bg-[#fff6d1] px-3 py-0.5 text-[13.5px] font-bold text-[#8a6400]">★ 作品の月（ずっと）</span>
            </div>
          </section>
        </main>
      </div>

      {review && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(42,36,82,.55)]">
          <div className="w-[520px] rounded-[28px] bg-white px-8 py-7 shadow-xl">
            <div className="text-[13px] font-black tracking-widest text-[#8a6400]">前回のおさらい（1問）</div>
            <div className="mt-2 text-[20px] font-black">{review.step.review.question}</div>
            <div className="mt-4 flex flex-col gap-2">
              {review.step.review.choices.map((c, i) => {
                const picked = review.picked !== null
                const right = i === review.step.review.answer
                const cls = !picked
                  ? 'bg-[#f7f6fc] hover:bg-[#efe9ff]'
                  : right
                    ? 'bg-[#e2f7ec] text-[#0f7a51] shadow-[inset_0_0_0_2px_#22b573]'
                    : i === review.picked
                      ? 'bg-[#fde9e9] text-[#c93c3c]'
                      : 'bg-[#f7f6fc] text-[#9b97b8]'
                return (
                  <button
                    key={c}
                    disabled={picked}
                    onClick={() => {
                      setReview({ ...review, picked: i })
                      if (!voice.off) speak(i === review.step.review.answer ? REVIEW_RIGHT_SPEECH : REVIEW_WRONG_SPEECH)
                    }} className={`rounded-2xl px-4 py-3 text-left text-[16px] font-bold ${cls}`}>
                    {picked && right ? '✔ ' : ''}
                    {c}
                  </button>
                )
              })}
            </div>
            {review.picked !== null && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[15px] font-black">{review.picked === review.step.review.answer ? 'せいかい！ よく覚えていたね' : 'おしい！ 正しいのは ✔ の答えだよ'}</span>
                <button
                  onClick={() => {
                    const s = loadNavi()
                    s.reviewAnswered[review.step.step] = true
                    saveNavi(s)
                    router.push(actionHref(step, action))
                  }}
                  className="h-12 rounded-full bg-[#ff8a1f] px-6 font-black text-white shadow-[0_5px_0_#db6500]"
                >
                  つづきへ ▶
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// 声のボタン：「もう一度きく／とめる」と「声 オン／オフ」。
// ブラウザが自動で鳴らすのを止めたときは、「ナビの声をきく」を目立たせる
function VoiceControls({ voice }: { voice: ReturnType<typeof useNaviVoice> }) {
  const pill = 'inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-black shadow-sm'
  return (
    <div className="flex items-center gap-2">
      {!voice.off &&
        (voice.blocked ? (
          <button onClick={voice.replay} className={`${pill} animate-pulse bg-[#ff8a1f] text-white`}>
            🔊 ナビの声をきく
          </button>
        ) : voice.speaking ? (
          <button onClick={voice.stop} className={`${pill} bg-white text-[#2a2452]`}>
            ■ とめる
          </button>
        ) : (
          <button onClick={voice.replay} className={`${pill} bg-white text-[#2a2452]`}>
            🔊 もう一度きく
          </button>
        ))}
      <button
        onClick={voice.toggleOff}
        aria-pressed={!voice.off}
        className={`${pill} ${voice.off ? 'bg-white/70 text-[#6d6893]' : 'bg-white text-[#2a2452]'}`}
      >
        声 <span className={`rounded-full px-2 py-px text-[12px] ${voice.off ? 'bg-[#ece9f6] text-[#6d6893]' : 'bg-[#22b573] text-white'}`}>{voice.off ? 'オフ' : 'オン'}</span>
      </button>
    </div>
  )
}

function Bar({ label, value, text, color }: { label: string; value: number; text: string; color: string }) {
  return (
    <div className="grid grid-cols-[96px_1fr_100px] items-center gap-2.5">
      <span className="text-[13px] font-bold text-[#6d6893]">{label}</span>
      <span className="h-2.5 overflow-hidden rounded-full bg-[#ece9f6]">
        <i className="block h-full rounded-full" style={{ width: `${Math.min(100, Math.round(value * 100))}%`, background: color }} />
      </span>
      <span className="text-right text-sm font-bold text-[#6d6893]">{text}</span>
    </div>
  )
}

