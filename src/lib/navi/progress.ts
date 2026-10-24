// Python ナビの進み具合。
// 今はブラウザ（localStorage）に保存する。Supabase に移したら、この中身だけを差しかえる。
import type { NaviStep } from './types'

export type StepProgress = {
  videoPos: number // 動画をどこまで見たか（秒）
  videoDone: boolean // 最後まで見たか
  passed: number[] // 結果が合った見出しの番号
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
}

const KEY = 'codeblock_navi_progress'

const empty = (): NaviState => ({ current: 1, steps: {}, sessions: [], reviewAnswered: {} })

export function loadNavi(): NaviState {
  if (typeof window === 'undefined') return empty()
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty()
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
  const sectionsLeft = step.sections.map((_, i) => i).filter((i) => !p.passed.includes(i))
  if (step.video && !p.videoDone) return { kind: 'video', from: p.videoPos }
  if (sectionsLeft.length > 0) return { kind: 'section', index: sectionsLeft[0] }
  const completed = codeblockCompleted()
  const lesson = step.codeblock.find((id) => !completed.includes(id))
  if (lesson) return { kind: 'codeblock', lessonId: lesson, mission: codeblockMissionDone(lesson) }
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
    state.current = step.step + 1
    saveNavi(state)
  }
  return { next }
}
