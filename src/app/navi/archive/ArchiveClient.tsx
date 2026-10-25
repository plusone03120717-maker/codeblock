'use client'

// 動画アーカイブ：見終わったあとも、ステップの動画をえらんで、もう一度見られる（2026-10-25 依頼主）
// ・いまのステップまでの動画を見られる。先のステップは 🔒（そのステップまで進むと見られる）
// ・ここで見ても、ステップの進み具合（どこまで見たか・見出しのチェック）は変えない。動画は途中で止まらない
import { useEffect, useRef, useState } from 'react'
import { NaviHeader } from '@/components/navi/NaviHeader'
import { YouTubePlayer, type PlayerHandle } from '@/components/navi/YouTubePlayer'
import { NAVI_STEPS, getNaviStep } from '@/data/navi/steps'
import { UNIT_NAMES, type NaviStep } from '@/lib/navi/types'
import { fmtTime, loadNavi, stepProgress, type NaviState } from '@/lib/navi/progress'

const VIDEO_STEPS = NAVI_STEPS.filter((s) => s.video)

// 題名の「#2 」は札で出すので、ここでは外す
const titleOf = (s: NaviStep) => s.title.replace(/^#[\d.]+\s*/, '')
const thumbOf = (s: NaviStep) => `/navi/thumbs/step-${String(s.step).padStart(2, '0')}.jpg`

export function ArchiveClient() {
  const [state, setState] = useState<NaviState | null>(null)
  const [open, setOpen] = useState<NaviStep | null>(null)

  useEffect(() => {
    // ブラウザの保存（localStorage）は表示のあとでしか読めないので、ここで1回だけ入れる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadNavi())
  }, [])

  if (!state) return null
  const current = getNaviStep(state.current) ?? NAVI_STEPS[0]
  const units = [...new Set(VIDEO_STEPS.map((s) => s.unit))]

  return (
    <div className="flex h-screen flex-col">
      <NaviHeader step={current.step} unit={current.unit} active="archive" />
      <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-10 pt-6">
        <div className="mb-5 flex items-end gap-4">
          <h1 className="text-[26px] font-black">動画アーカイブ</h1>
          <p className="pb-1 text-[15px] font-bold text-[#6d6893]">見た動画を、もう一度見られるよ。カードを押してね</p>
        </div>
        {units.map((u) => (
          <section key={u} className="mb-7">
            <h2 className="mb-3 text-[15px] font-black text-[#7448f0]">
              Lv.{u}　{UNIT_NAMES[u]}
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {VIDEO_STEPS.filter((s) => s.unit === u).map((s) => (
                <VideoCard key={s.step} step={s} state={state} locked={s.step > state.current} onOpen={() => setOpen(s)} />
              ))}
            </div>
          </section>
        ))}
      </div>
      {open && <Player step={open} onClose={() => setOpen(null)} />}
    </div>
  )
}

function VideoCard({ step, state, locked, onOpen }: { step: NaviStep; state: NaviState; locked: boolean; onOpen: () => void }) {
  const p = stepProgress(state, step.step)
  const status = locked
    ? { text: `🔒 ステップ${step.step} で見られるよ`, cls: 'bg-[#ebe8f5] text-[#625d8a]' }
    : p.videoDone
      ? { text: '✔ 見た', cls: 'bg-[#e3f7ec] text-[#178a52]' }
      : p.videoPos > 0
        ? { text: `▶ ${fmtTime(p.videoPos)} まで`, cls: 'bg-[#fff3d6] text-[#8a6400]' }
        : { text: 'まだ見ていない', cls: 'bg-[#f0eef7] text-[#6d6893]' }
  return (
    <button
      onClick={onOpen}
      disabled={locked}
      className={`group flex flex-col overflow-hidden rounded-[20px] bg-white text-left shadow-sm transition ${
        locked ? 'cursor-not-allowed opacity-55' : 'hover:-translate-y-0.5 hover:shadow-md'
      }`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[#eaf6ff]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbOf(step)} alt="" className={`h-full w-full object-cover ${locked ? 'grayscale' : ''}`} />
        {!locked && (
          <span className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[rgba(21,18,42,.75)] text-2xl text-white">▶</span>
          </span>
        )}
        {step.video && (
          <span className="absolute bottom-2 right-2 rounded-md bg-[rgba(21,18,42,.8)] px-1.5 py-0.5 text-[12px] font-bold text-white">
            {fmtTime(step.video.length)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
        <div className="text-[13px] font-black text-[#7448f0]">
          ステップ{step.step}・動画 {step.video?.no}
        </div>
        <div className="text-[16px] font-black leading-snug">{titleOf(step)}</div>
        <span className={`mt-auto self-start rounded-full px-3 py-1 text-[12.5px] font-black ${status.cls}`}>{status.text}</span>
      </div>
    </button>
  )
}

function Player({ step, onClose }: { step: NaviStep; onClose: () => void }) {
  const player = useRef<PlayerHandle>(null)
  const [time, setTime] = useState(0)
  // 見出しの場面（いちばん上に「はじめから」）
  const chapters = [{ title: 'はじめから', start: 0 }, ...step.sections.filter((s) => s.start > 0)]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!step.video) return null
  // いま見ている見出し（始まりの秒をこえた最後のもの）
  const now = chapters.reduce((k, c, i) => (time >= c.start - 0.5 ? i : k), -1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(21,18,42,.72)] p-8" onClick={onClose}>
      <div className="flex max-h-full w-full max-w-[1280px] gap-5 rounded-[24px] bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex min-w-[520px] flex-1 flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap rounded-full bg-[#ffd23f] px-3 py-1 text-[13px] font-black text-[#5c4300]">
              ステップ{step.step}・動画 {step.video.no}
            </span>
            <span className="truncate text-[18px] font-black">{titleOf(step)}</span>
          </div>
          <div className="overflow-hidden rounded-[16px]">
            <YouTubePlayer ref={player} videoId={step.video.id} startAt={step.video.start ?? 0} onTime={(t) => setTime(t)} onEnded={() => {}} />
          </div>
        </div>
        <div className="flex w-[280px] flex-none flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[15px] font-black">見出し</span>
            <button onClick={onClose} className="rounded-full bg-[#f0eef7] px-3.5 py-1.5 text-[13px] font-black text-[#6d6893] hover:bg-[#e6e1fa]">
              ✕ とじる
            </button>
          </div>
          <p className="mb-2 text-[12.5px] font-bold text-[#8a85ad]">押すと、その場面から見られるよ</p>
          <div className="flex min-h-0 flex-col gap-1.5 overflow-y-auto">
            {chapters.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  player.current?.seek(c.start)
                  player.current?.play()
                }}
                className={`flex items-center gap-2.5 rounded-[12px] px-3 py-2 text-left text-[14px] font-bold ${
                  i === now ? 'bg-[#efe9ff] text-[#7448f0]' : 'hover:bg-[#f5f3ff]'
                }`}
              >
                <span className="w-11 flex-none font-black tabular-nums text-[#8a85ad]">{fmtTime(c.start)}</span>
                <span className="leading-snug">{c.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
