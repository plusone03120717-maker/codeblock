// Python ナビの進み具合。
// 今はブラウザ（localStorage）に保存する。Supabase に移したら、この中身だけを差しかえる。
import type { NaviStep } from './types'
import { getLessonMissions } from '@/data/missions'

export type StepProgress = {
  videoPos: number // 動画をどこまで見たか（秒）
  videoDone: boolean // 最後まで見たか
  passed: number[] // 結果が合った見出しの番号（チャレンジで「こたえを見て次へ」にしたものも入る）
  revealed?: number[] // チャレンジで、こたえを見て次へ進んだ見出し（自分で正解したものとは分けて残す）
  files: Record<string, string> // エディターのコード
  done: boolean // ステップをクリアしたか
}

export type SessionLog = {
  at: number
  step: number
  learned: string[] // 今日チェックが入った「わかること」
  xp: number
}

export type NaviState = {
  current: number // いまのステップ
  steps: Record<number, StepProgress>
  sessions: SessionLog[]
  reviewAnswered: Record<number, boolean> // おさらい1問に答えたか（次の回のはじめ）
  skipped?: number[] // 準備中だったのでとばしたステップ（動画ができたら、もどってやる）
  v?: number // 記録の版。2＝55ステップ（2026-10-25 に25ステップから組みかえ）
}

// 25ステップのころの記録を、55ステップの番号に直す（分けたステップは前の部分へ）。
// ステップ1はそのまま。ほかは見出しの番号が変わったので、進み具合は消して、いまのステップの番号だけ直す
const OLD_TO_NEW: Record<number, number> = {
  1: 1, 2: 4, 3: 8, 4: 9, 5: 10, 6: 11, 7: 13, 8: 15, 9: 17, 10: 21, 11: 24, 12: 26, 13: 30,
  14: 34, 15: 36, 16: 38, 17: 40, 18: 41, 19: 43, 20: 45, 21: 47, 22: 50, 23: 51, 24: 52, 25: 54,
}
function migrate(state: NaviState): NaviState {
  if (state.v === 2) return state
  const map = (n: number) => OLD_TO_NEW[n] ?? n
  return {
    current: map(state.current),
    steps: state.steps[1] ? { 1: state.steps[1] } : {},
    sessions: state.sessions.map((s) => ({ ...s, step: map(s.step) })),
    reviewAnswered: Object.fromEntries(Object.entries(state.reviewAnswered).map(([k, v]) => [map(Number(k)), v])),
    v: 2,
  }
}

const KEY = 'codeblock_navi_progress'

const empty = (): NaviState => ({ current: 1, steps: {}, sessions: [], reviewAnswered: {}, v: 2 })

export function loadNavi(): NaviState {
  if (typeof window === 'undefined') return empty()
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? migrate({ ...empty(), v: undefined, ...JSON.parse(raw) }) : empty()
  } catch {
    return empty()
  }
}

export function saveNavi(state: NaviState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function stepProgress(state: NaviState, step: number): StepProgress {
  return state.steps[step] ?? { videoPos: 0, videoDone: false, passed: [], files: {}, done: false }
}

export function updateStep(step: number, patch: Partial<StepProgress>): NaviState {
  const state = loadNavi()
  state.steps[step] = { ...stepProgress(state, step), ...patch }
  saveNavi(state)
  return state
}

// CodeBlock の記録（今のアプリのもの）を読む
export function codeblockCompleted(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('codeblock-progress')
    return raw ? (JSON.parse(raw).completedLessons ?? []) : []
  } catch {
    return []
  }
}

export function codeblockMissionDone(lessonId: string): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(`missionProgress_${lessonId}`) || '0', 10)
}

export type NextAction =
  | { kind: 'video'; from: number }
  | { kind: 'section'; index: number }
  | { kind: 'codeblock'; lessonId: string; mission: number }
  | { kind: 'next-step' }

// いまのステップで「つぎにやること」
export function nextAction(step: NaviStep, p: StepProgress): NextAction {
  // 「できたら⭐」の見出しは数えない
  const sectionsLeft = step.sections.map((_, i) => i).filter((i) => !step.sections[i].optional && !p.passed.includes(i))
  if (step.video && !p.videoDone) return { kind: 'video', from: p.videoPos }
  if (sectionsLeft.length > 0) return { kind: 'section', index: sectionsLeft[0] }
  const completed = codeblockCompleted()
  const lesson = step.codeblock.find((id) => !completed.includes(id))
  // 問題の数をこえた記録（終わったのに完了が入っていないなど）は、はじめからにする
  if (lesson) {
    const done = codeblockMissionDone(lesson)
    return { kind: 'codeblock', lessonId: lesson, mission: done >= (getLessonMissions(lesson)?.length ?? Infinity) ? 0 : done }
  }
  return { kind: 'next-step' }
}

// 動画は10秒もどして再生する（話の途中から始まらないように）
export const resumeFrom = (pos: number) => Math.max(0, Math.floor(pos) - 10)

export const fmtTime = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`

// CodeBlock のレッスンを終えたとき（完了画面から呼ぶ）。
// ナビで進めている生徒で、いまのステップのレッスンなら、つぎのレッスン（なければ null）を返す。
// ナビを使っていない生徒（今までのコース）には null を返し、完了画面は今までどおり。
export function naviAfterLesson(lessonId: string, steps: NaviStep[]): { next: string | null } | null {
  if (typeof window === 'undefined' || !localStorage.getItem(KEY)) return null
  const state = loadNavi()
  const step = steps.find((s) => s.step === state.current)
  if (!step || !step.codeblock.includes(lessonId)) return null
  const completed = codeblockCompleted()
  const next = step.codeblock.find((id) => id !== lessonId && !completed.includes(id)) ?? null
  if (!next) {
    state.steps[step.step] = { ...stepProgress(state, step.step), done: true }
    // 準備中のステップはとばす（とばしたステップは覚えておき、動画ができたらもどる）
    state.current = steps.find((s) => s.step > step.step && !s.planned)?.step ?? step.step + 1
    const jumped = steps.filter((s) => s.step > step.step && s.step < state.current).map((s) => s.step)
    if (jumped.length > 0) state.skipped = [...new Set([...(state.skipped ?? []), ...jumped])]
    saveNavi(state)
  }
  return { next }
}

// 準備中でとばしたステップの動画ができたら、そのステップにもどす（2026-10-26 ステップ7を足したときに、
// ステップ6を終えた生徒が 8 に進んだままになっていたため）。もどしたら true。
// とばした記録がない前の生徒は「前のステップは終えたのに、このステップはまだ」の所を、とばしたステップとみなす
// （ステップ1だけを終えた、25ステップのころからの組みかえの記録は対象にしない）
export function catchUpSkipped(state: NaviState, steps: NaviStep[]): boolean {
  const back = steps.find(
    (s) =>
      !s.planned &&
      s.step < state.current &&
      !stepProgress(state, s.step).done &&
      ((state.skipped ?? []).includes(s.step) || (s.step >= 3 && stepProgress(state, s.step - 1).done)),
  )
  if (!back) return false
  state.current = back.step
  return true
}
