// Python ナビ（新しいコース）の本編のステップ（1〜55・2026-10-25 に25から組みかえ）。
// 新しい動画ができるまでは、前の動画を見出しのところで分けて使う。中身のないステップは planned（準備中）で、生徒はとばす。
// 中身は授業動画の字幕から作り、見出しの「出るはずの結果」は Python で動かして確かめてある。
// カリキュラムは Obsidian の「Pythonコース_新しいカリキュラム（案 2026-10-24）」。
import type { NaviStep } from '@/lib/navi/types'
import { getLesson } from '@/data/lessons'
import data from './steps.json'

// CodeBlock にまだないレッスン（新しいコース用に作る 21-1〜21-5 など）は、できるまで飛ばす
export const NAVI_STEPS: NaviStep[] = (data as NaviStep[]).map((s) => ({
  ...s,
  codeblock: s.codeblock.filter((id) => !!getLesson(id)),
  codeblockPlanned: s.codeblock.filter((id) => !getLesson(id)),
}))

export const getNaviStep = (n: number) => NAVI_STEPS.find((s) => s.step === n)
const READY = NAVI_STEPS.filter((s) => !s.planned).map((s) => s.step)
// n より後の、準備できているステップ（なければ null）
export const nextReadyStep = (n: number): number | null => READY.find((s) => s > n) ?? null
// n より前の、準備できているステップ（なければ null）
export const prevReadyStep = (n: number): number | null => [...READY].reverse().find((s) => s < n) ?? null
// いまのステップが準備中なら、次の準備できているステップにする
export const readyStep = (n: number): number => (READY.includes(n) ? n : (nextReadyStep(n) ?? READY[READY.length - 1]))
export const lastNaviStep = () => Math.max(...NAVI_STEPS.map((s) => s.step))
