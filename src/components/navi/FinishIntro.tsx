'use client'

// 仕上げ5問（31-N）の入口。Python ナビのホームと同じ見た目で、5問のなかみ・お手本・いちかのひとことを出す（2026-10-26 依頼主）
import Image from 'next/image'
import Link from 'next/link'
import type { Lesson, Mission } from '@/types'
import type { LessonTutorial } from '@/data/tutorials'
import { NaviLessonFrame } from '@/components/navi/NaviLessonFrame'
import { NAVI_STEPS } from '@/data/navi/steps'
import { NaviCode } from '@/components/navi/NaviCode'

// 問題の種類（ならべかえ・まちがいを直す・結果を予想）
function kindOf(m: Mission): { label: string; color: string } {
  if (m.type !== 'quiz') return { label: 'ブロックをならべる', color: '#22b573' }
  if (m.description.includes('どう直す')) return { label: 'まちがいを直す', color: '#ff8a1f' }
  return { label: '結果を予想する', color: '#4f7cff' }
}

type Props = { lesson: Lesson; tutorial?: LessonTutorial; missions: Mission[]; completed: boolean }

export function FinishIntro({ lesson, tutorial, missions, completed }: Props) {
  const slide = tutorial?.slides?.[0]
  const example = slide?.codeExample?.good
  // お手本の「  # …」は説明なので、灰色で分けて見せる
  const [exCode, exNote] = (example ?? '').split(/\s{2,}#\s*/)
  const stepNo = Number(lesson.id.split('-')[1])
  const next = NAVI_STEPS.find((s) => s.step > stepNo && !s.planned)
  return (
    <NaviLessonFrame lessonId={lesson.id}>
      <main className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-6 px-8 pb-10 pt-5">
        {/* 左：5問のなかみと、はじめるボタン */}
        <section className="rounded-[28px] bg-white p-8 shadow-[0_14px_40px_rgba(42,36,82,.08)]">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#efe9ff] px-3 py-1 text-[13px] font-black text-[#7448f0]">{lesson.title}</span>
            {completed && <span className="rounded-full bg-[#e3f7ee] px-3 py-1 text-[13px] font-black text-[#16905a]">✓ クリアずみ</span>}
          </div>
          <h1 className="mt-3 text-[38px] font-black leading-tight tracking-tight">5問で仕上げよう</h1>
          <p className="mt-2 text-[16px] font-bold text-[#6d6893]">{lesson.description}</p>

          <ol className="mt-6 flex flex-col gap-2.5">
            {missions.map((m, i) => {
              const k = kindOf(m)
              return (
                <li key={m.id} className="flex items-center gap-3 rounded-[16px] bg-[#f8f6ff] px-4 py-3">
                  <i className="grid h-8 w-8 flex-none place-items-center rounded-full bg-white text-[15px] font-black not-italic text-[#7448f0] shadow-[inset_0_0_0_2px_#e6e1fa]">
                    {i + 1}
                  </i>
                  <span className="flex-1 text-[16px] font-bold">{m.title}</span>
                  <span className="rounded-full px-2.5 py-0.5 text-[12px] font-black text-white" style={{ background: k.color }}>
                    {k.label}
                  </span>
                </li>
              )
            })}
          </ol>

          <div className="mt-7 flex items-center gap-4">
            <Link
              href={`/lesson/${lesson.id}/editor`}
              className="flex h-[60px] items-center gap-2 whitespace-nowrap rounded-full bg-[#ff8a1f] px-10 text-[19px] font-black text-white shadow-[0_6px_0_#db6500,0_16px_30px_rgba(255,138,31,.3)] transition-transform hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-[0_1px_0_#db6500]"
            >
              はじめる ▶
            </Link>
            <span className="text-[14px] font-bold text-[#6d6893]">わからなくなったら、ヒントを見てね</span>
          </div>
        </section>

        {/* 右：いちかのひとこと・お手本 */}
        <section className="flex flex-col gap-5">
          <div className="relative flex items-end gap-4 rounded-[28px] bg-[radial-gradient(120%_120%_at_20%_10%,#ffffff_0%,#eef6fd_60%,#e1effb_100%)] p-6 shadow-[0_14px_40px_rgba(42,36,82,.08)]">
            <div className="grid h-[150px] w-[150px] flex-none place-items-center overflow-hidden rounded-full bg-[radial-gradient(closest-side,#ffffff,#d9ecfb)] shadow-[inset_0_0_0_6px_rgba(255,255,255,.8)]">
              {tutorial?.characterImage && (
                <Image src={tutorial.characterImage} alt="いちか" width={150} height={150} className="h-full w-full object-cover" unoptimized />
              )}
            </div>
            <div className="relative mb-6 flex-1 rounded-[20px] bg-white px-5 py-4 text-[16px] font-bold leading-[1.8] shadow-[0_10px_24px_rgba(42,36,82,.08)]">
              <span className="absolute -left-2 bottom-5 h-5 w-5 rotate-45 rounded-[3px] bg-white" />
              {slide?.content ?? 'さっきの動画で習ったことを、5問でたしかめよう。'}
            </div>
          </div>

          {example && (
            <div className="overflow-hidden rounded-[22px] bg-[#23203b] shadow-lg">
              <div className="flex items-center gap-2 bg-[#1b1832] px-5 py-3 text-[13px] font-bold text-[#8a85ad]">
                <span className="h-4 w-4 rounded-[5px] bg-[linear-gradient(135deg,#4f7cff_50%,#ffd23f_50%)]" />
                このステップのお手本
              </div>
              <pre className="whitespace-pre-wrap px-5 pt-4 font-mono text-[17px] leading-[1.8] text-[#dcdcf0]"><NaviCode code={exCode} /></pre>
              {exNote && <p className="px-5 pb-4 pt-1 text-[14px] font-bold text-[#8f94a0]"># {exNote}</p>}
              {!exNote && <div className="pb-4" />}
            </div>
          )}

          {/* クリアしたら（メダルと、つぎのステップ） */}
          <div className="flex items-center gap-4 rounded-[22px] bg-white px-5 py-4 shadow-[0_10px_30px_rgba(42,36,82,.06)]">
            <Image src="/navi/clear/medal.webp" alt="" width={52} height={71} className="h-[64px] w-auto flex-none drop-shadow-[0_6px_8px_rgba(160,110,0,.25)]" unoptimized />
            <div className="text-[14px] font-bold leading-relaxed text-[#6d6893]">
              <b className="block text-[16px] font-black text-[#2a2452]">5問クリアで、ステップ{stepNo} クリア！</b>
              {next ? <>つぎは ステップ{next.step}「{next.title}」に進めるよ</> : <>Python ナビにもどって、つぎへ進もう</>}
            </div>
          </div>
          <p className="px-2 text-[13px] font-bold text-[#8a85ad]">
            クイズは えらんで答える問題、ブロックは ならべて ▶ 確認する 問題だよ。まちがえた問題は、さいごにもう一度出るよ。
          </p>
        </section>
      </main>
    </NaviLessonFrame>
  )
}
