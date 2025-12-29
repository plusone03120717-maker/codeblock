// 進捗データの型定義
export interface ProgressData {
  totalXP: number
  completedLessons: string[]
  currentStreak: number
  highestStreak: number
}

// レベル定義
export interface LevelInfo {
  level: number
  name: string
  minXP: number
  maxXP: number
}

// レベルテーブル
export const levelTable: LevelInfo[] = [
  { level: 1, name: "ビギナー", minXP: 0, maxXP: 99 },
  { level: 2, name: "ルーキー", minXP: 100, maxXP: 299 },
  { level: 3, name: "チャレンジャー", minXP: 300, maxXP: 599 },
  { level: 4, name: "コーダー", minXP: 600, maxXP: 999 },
  { level: 5, name: "プログラマー", minXP: 1000, maxXP: 1499 },
  { level: 6, name: "エンジニア", minXP: 1500, maxXP: 2099 },
  { level: 7, name: "エキスパート", minXP: 2100, maxXP: 2799 },
  { level: 8, name: "マスター", minXP: 2800, maxXP: 3599 },
  { level: 9, name: "グランドマスター", minXP: 3600, maxXP: 4499 },
  { level: 10, name: "レジェンド", minXP: 4500, maxXP: Infinity },
]

// localStorageのキー
const PROGRESS_KEY = "codeblock-progress"

// 進捗データを取得
export function getProgress(): ProgressData {
  if (typeof window === "undefined") {
    return { totalXP: 0, completedLessons: [], currentStreak: 0, highestStreak: 0 }
  }

  const saved = localStorage.getItem(PROGRESS_KEY)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      return {
        totalXP: data.totalXP || 0,
        completedLessons: data.completedLessons || [],
        currentStreak: data.currentStreak || 0,
        highestStreak: data.highestStreak || 0,
      }
    } catch {
      return { totalXP: 0, completedLessons: [], currentStreak: 0, highestStreak: 0 }
    }
  }
  return { totalXP: 0, completedLessons: [], currentStreak: 0, highestStreak: 0 }
}

// 進捗データを保存
export function saveProgress(data: ProgressData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data))
}

// 現在のレベル情報を取得
export function getLevelInfo(xp: number): LevelInfo {
  for (let i = levelTable.length - 1; i >= 0; i--) {
    if (xp >= levelTable[i].minXP) {
      return levelTable[i]
    }
  }
  return levelTable[0]
}

// 次のレベルまでの進捗を取得（0〜1の値）
export function getLevelProgress(xp: number): number {
  const currentLevel = getLevelInfo(xp)
  if (currentLevel.maxXP === Infinity) return 1

  const xpInLevel = xp - currentLevel.minXP
  const xpNeeded = currentLevel.maxXP - currentLevel.minXP + 1
  return Math.min(xpInLevel / xpNeeded, 1)
}

// 次のレベルまでに必要なXP
export function getXPToNextLevel(xp: number): number {
  const currentLevel = getLevelInfo(xp)
  if (currentLevel.maxXP === Infinity) return 0
  return currentLevel.maxXP - xp + 1
}

// 現在のレベルでのXP（レベル内での進捗）
export function getXPInCurrentLevel(xp: number): number {
  const currentLevel = getLevelInfo(xp)
  return xp - currentLevel.minXP
}

// XPを追加（レベルアップしたかどうかを返す）
export function addXP(amount: number): { newTotal: number; leveledUp: boolean; newLevel: LevelInfo } {
  const progress = getProgress()
  const oldLevel = getLevelInfo(progress.totalXP)
  
  const newTotal = progress.totalXP + amount
  const newLevel = getLevelInfo(newTotal)
  const leveledUp = newLevel.level > oldLevel.level

  saveProgress({
    ...progress,
    totalXP: newTotal,
  })

  return { newTotal, leveledUp, newLevel }
}

// ミッション正解時のXP計算
export function calculateMissionXP(isCorrect: boolean, currentStreak: number): { xp: number; streakBonus: number; newStreak: number } {
  if (!isCorrect) {
    return { xp: 0, streakBonus: 0, newStreak: 0 }
  }

  const baseXP = 10
  const newStreak = currentStreak + 1
  
  // 3問連続正解ごとにボーナス
  let streakBonus = 0
  if (newStreak > 0 && newStreak % 3 === 0) {
    streakBonus = 5 * (newStreak / 3)
  }

  return { xp: baseXP + streakBonus, streakBonus, newStreak }
}

// 連続正解数を更新
export function updateStreak(newStreak: number): void {
  const progress = getProgress()
  saveProgress({
    ...progress,
    currentStreak: newStreak,
    highestStreak: Math.max(progress.highestStreak, newStreak),
  })
}

// 連続正解数をリセット
export function resetStreak(): void {
  const progress = getProgress()
  saveProgress({
    ...progress,
    currentStreak: 0,
  })
}

// レッスン完了時のXP（初回か復習かで変わる）
export function calculateLessonCompleteXP(lessonId: string): { xp: number; isReview: boolean } {
  const progress = getProgress()
  const isReview = progress.completedLessons.includes(lessonId)
  
  return {
    xp: isReview ? 20 : 50,
    isReview,
  }
}

// レッスン完了を記録
export function markLessonComplete(lessonId: string): void {
  const progress = getProgress()
  
  if (!progress.completedLessons.includes(lessonId)) {
    saveProgress({
      ...progress,
      completedLessons: [...progress.completedLessons, lessonId],
    })
  }
}

// レッスンが完了済みかチェック
export function isLessonCompleted(lessonId: string): boolean {
  const progress = getProgress()
  return progress.completedLessons.includes(lessonId)
}

// 進捗をリセット（デバッグ用）
export function resetProgress(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(PROGRESS_KEY)
}

// 最後に開いたミッション情報
export interface LastOpenedMission {
  lessonId: string;
  missionId: number;
  timestamp: number;
}

// 最後に開いたミッションを保存
export const saveLastOpenedMission = (lessonId: string, missionId: number): void => {
  if (typeof window === "undefined") return;
  
  const data: LastOpenedMission = {
    lessonId,
    missionId,
    timestamp: Date.now(),
  };
  
  localStorage.setItem("codeblock_last_opened_mission", JSON.stringify(data));
};

// 最後に開いたミッションを取得
export const getLastOpenedMission = (): LastOpenedMission | null => {
  if (typeof window === "undefined") return null;
  
  const data = localStorage.getItem("codeblock_last_opened_mission");
  if (!data) return null;
  
  try {
    return JSON.parse(data) as LastOpenedMission;
  } catch {
    return null;
  }
};

// 最後に開いたミッションをクリア
export const clearLastOpenedMission = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("codeblock_last_opened_mission");
};
