// 進捗データの型定義
export interface ProgressData {
  totalXP: number
  completedLessons: number[]
}

// localStorageのキー
const PROGRESS_KEY = 'codeblock-progress'

// 進捗データを取得
export function getProgress(): ProgressData {
  if (typeof window === 'undefined') {
    return { totalXP: 0, completedLessons: [] }
  }
  
  const saved = localStorage.getItem(PROGRESS_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return { totalXP: 0, completedLessons: [] }
    }
  }
  return { totalXP: 0, completedLessons: [] }
}

// 進捗データを保存
export function saveProgress(data: ProgressData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data))
}

// レッスン完了時にXPを追加
export function addLessonComplete(lessonId: number, xp: number): ProgressData {
  const progress = getProgress()
  
  // 既に完了済みのレッスンはスキップ
  if (progress.completedLessons.includes(lessonId)) {
    return progress
  }
  
  const newProgress: ProgressData = {
    totalXP: progress.totalXP + xp,
    completedLessons: [...progress.completedLessons, lessonId]
  }
  
  saveProgress(newProgress)
  return newProgress
}

// レッスンが完了済みかチェック
export function isLessonCompleted(lessonId: number): boolean {
  const progress = getProgress()
  return progress.completedLessons.includes(lessonId)
}

// 進捗をリセット（デバッグ用）
export function resetProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(PROGRESS_KEY)
}
