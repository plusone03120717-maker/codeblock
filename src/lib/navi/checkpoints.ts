// 見出しの終わりで動画を止める（チェックポイント）の決まり。
// ・止める所は「次の見出しが始まる所」。最後の見出しは「最後まで見た」にする秒（video.end）。pauseAt があればその秒
// ・「できたら⭐」の見出しでは止めない。クリアの条件にも入れない
// ・止める所どうしが近いとき（12秒より近い）は、あとの方の1回にまとめる
import type { NaviStep } from './types'

const MERGE_SEC = 12

export const isRequired = (step: NaviStep, i: number) => !step.sections[i].optional

export const requiredIndexes = (step: NaviStep) => step.sections.map((_, i) => i).filter((i) => isRequired(step, i))

// その見出しのコードが動画で打ち終わる秒
export function pauseAtOf(step: NaviStep, i: number): number {
  if (step.sections[i].pauseAt !== undefined) return step.sections[i].pauseAt as number
  const next = step.sections[i + 1]
  return next ? next.start : (step.video?.end ?? Infinity)
}

// 動画を止める秒（ならべて、近いものはまとめたもの）
export function pauseTimes(step: NaviStep): number[] {
  if (!step.video) return []
  const times = [...new Set(requiredIndexes(step).map((i) => pauseAtOf(step, i)))].sort((a, b) => a - b)
  return times.filter((t, k) => k === times.length - 1 || times[k + 1] - t >= MERGE_SEC)
}

// その秒までに結果を出しておく見出し（まだで、「あとでやる」にしていないもの）
export function dueAt(step: NaviStep, t: number, passed: number[], deferred: number[]): number[] {
  return requiredIndexes(step).filter((i) => pauseAtOf(step, i) <= t + 0.01 && !passed.includes(i) && !deferred.includes(i))
}
