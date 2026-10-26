'use client'

// Python ナビから来た「仕上げ5問」（31-N）の画面のわく。ナビと同じヘッダー・書体・色で、
// 「1 動画を見ながら打つ ✓ › 2 仕上げ5問」の帯で、ステップの学習画面とつながって見えるようにする（2026-10-26 依頼主）。
// 今までの CodeBlock のレッスン（1-1 など）には使わない（まだ使っている生徒がいるので、見た目を変えない）
import Link from 'next/link'
import { Zen_Maru_Gothic } from 'next/font/google'
import { useEffect, type ReactNode } from 'react'
import { NaviHeader } from '@/components/navi/NaviHeader'
import { getNaviStep } from '@/data/navi/steps'
import type { LessonSkin } from '@/components/navi/lessonSkin'

const maru = Zen_Maru_Gothic({ weight: ['500', '700', '900'], subsets: ['latin'], display: 'swap' })

export function NaviLessonFrame({ lessonId, children }: { lessonId: string; children: ReactNode }) {
  const stepNo = Number(lessonId.split('-')[1])
  const step = getNaviStep(stepNo)

  // ブラウザのタブの名前も「Python ナビ」に
  useEffect(() => {
    document.title = `ステップ${stepNo}の仕上げ - Python ナビ`
  }, [stepNo])

  return (
    <div className={`${maru.className} min-h-screen bg-[#f5f3ff] text-[#2a2452]`}>
      <NaviHeader step={stepNo} unit={step?.unit ?? 1} />
      <div className="mx-auto max-w-[1180px] px-8 pt-[18px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Link
              href={`/navi/step/${stepNo}`}
              className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-2 pr-4 text-[#6d6893] shadow-sm hover:text-[#2a2452]"
            >
              <i className="grid h-6 w-6 place-items-center rounded-full bg-[#22b573] text-[12px] not-italic text-white">✓</i>
              {step?.video ? '動画を見ながら打つ' : '作品をつくる'}
            </Link>
            <span className="text-[#c9c2ee]">›</span>
            <span className="flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#a259ff,#4f7cff)] py-1.5 pl-2 pr-4 text-white">
              <i className="grid h-6 w-6 place-items-center rounded-full bg-white text-[13px] not-italic text-[#7448f0]">2</i>
              仕上げ5問
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-bold text-[#6d6893]">
            <Link href="/navi">‹ ホーム</Link>·<span>ステップ{stepNo}</span>·<span className="text-[#2a2452]">{step?.title}</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

// レッスンの問題の画面の外がわ：仕上げ5問はナビのわく、今までのレッスンは前のままの背景
export function LessonRoot({ skin, lessonId, children }: { skin: LessonSkin; lessonId: string; children: ReactNode }) {
  if (!skin.navi) return <div className={skin.root}>{children}</div>
  return (
    <NaviLessonFrame lessonId={lessonId}>
      <div className={skin.root}>{children}</div>
    </NaviLessonFrame>
  )
}
