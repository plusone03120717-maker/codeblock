// Python ナビ（新しいコース）の本編のステップ（1〜25）。
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
export const lastNaviStep = () => Math.max(...NAVI_STEPS.map((s) => s.step))
