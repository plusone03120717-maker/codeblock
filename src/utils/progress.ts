// 進捗データの型定義
export interface ProgressData {
  completedLessons: string[];  // "1-1", "1-2" のような文字列形式
  currentLesson: string;       // 現在のレッスンID
  lessonProgress: Record<string, number>;  // レッスンID -> 完了ミッション数
  totalXP: number;
  level: number;
}

// デフォルトの進捗データ
const DEFAULT_PROGRESS: ProgressData = {
  completedLessons: [],
  currentLesson: "1-1",
  lessonProgress: {},
  totalXP: 0,
  level: 1,
};

// localStorage のキー
const PROGRESS_KEY = "codeblock_progress";

// 進捗データを取得
export function getProgress(): ProgressData {
  if (typeof window === "undefined") {
    return DEFAULT_PROGRESS;
  }

  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // デフォルト値とマージして、欠けているフィールドを補完
      const progress: ProgressData = {
        ...DEFAULT_PROGRESS,
        ...parsed,
      };
      // lessonProgressが存在しない場合は初期化
      if (!progress.lessonProgress) {
        progress.lessonProgress = {};
      }
      // completedLessonsが配列でない場合は初期化
      if (!Array.isArray(progress.completedLessons)) {
        progress.completedLessons = [];
      }
      // レベルを再計算（XPベース）
      progress.level = calculateLevel(progress.totalXP);
      return progress;
    }
  } catch (error) {
    console.error("Failed to load progress:", error);
  }
  return DEFAULT_PROGRESS;
}

// 進捗データを保存
export function saveProgress(data: ProgressData): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    // カスタムイベントを発火（同じタブでの変更を通知）
    window.dispatchEvent(new Event("progressUpdated"));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

// レベルを計算（100XPごとに1レベル）
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1;
}

// 次のレベルに必要なXPを取得
export function getXPForNextLevel(): number {
  return 100;
}

// 現在のレベルでのXPを取得
export function getXPInCurrentLevel(totalXP: number): number {
  return totalXP % 100;
}

// レッスンが解放されているかチェック
export function isLessonUnlocked(lessonId: string, completedLessons: string[]): boolean {
  // レッスン1-1は常に解放
  if (lessonId === "1-1") return true;
  
  // 前のレッスンを取得
  const [unitNum, subNum] = lessonId.split("-").map(Number);
  
  // 同じユニット内の前のサブレッスン
  if (subNum > 1) {
    const prevLessonId = `${unitNum}-${subNum - 1}`;
    return completedLessons.includes(prevLessonId);
  }
  
  // 前のユニットの最後のサブレッスン
  if (unitNum > 1) {
    // 前のユニットの最後のサブレッスンを探す（簡易実装：1-3, 2-1など）
    // 実際の実装では、lessons配列から前のユニットの最後のレッスンを取得する必要がある
    const prevUnitLastLesson = `${unitNum - 1}-1`; // 簡易実装
    return completedLessons.includes(prevUnitLastLesson);
  }
  
  return false;
}

// レッスンが完了しているかチェック
export function isLessonCompleted(lessonId: string): boolean {
  const progress = getProgress();
  return progress.completedLessons.includes(lessonId);
}

// レッスンを完了にする
export function addLessonComplete(lessonId: string, xp: number): ProgressData {
  const progress = getProgress();
  
  // 既に完了済みの場合は何もしない
  if (progress.completedLessons.includes(lessonId)) {
    return progress;
  }
  
  // XPを追加
  const newXP = progress.totalXP + xp;
  const newLevel = calculateLevel(newXP);
  
  // 完了リストに追加
  const newCompletedLessons = [...progress.completedLessons, lessonId];
  
  // 進捗データを更新
  const newProgress: ProgressData = {
    ...progress,
    completedLessons: newCompletedLessons,
    totalXP: newXP,
    level: newLevel,
  };
  
  saveProgress(newProgress);
  return newProgress;
}

// ミッションを完了にする
export function completeMission(lessonId: string, missionId: number): {
  xpGained: number;
  newXP: number;
  newLevel: number;
  leveledUp: boolean;
  lessonCompleted: boolean;
} {
  const progress = getProgress();
  
  // 現在のレッスンの進捗を取得
  const currentProgress = progress.lessonProgress[lessonId] || 0;
  
  // 既にこのミッションをクリア済みの場合は何もしない
  if (currentProgress >= missionId) {
    return {
      xpGained: 0,
      newXP: progress.totalXP,
      newLevel: progress.level,
      leveledUp: false,
      lessonCompleted: false,
    };
  }
  
  // ミッション進捗を更新
  const newLessonProgress = {
    ...progress.lessonProgress,
    [lessonId]: Math.max(currentProgress, missionId),
  };
  
  // レッスン完了判定（10ミッション全てクリア）
  const lessonCompleted = newLessonProgress[lessonId] === 10;
  
  // XPを獲得（ミッションごとに5XP、レッスン完了時は一括50XP）
  let xpGained = 0;
  if (lessonCompleted && !progress.completedLessons.includes(lessonId)) {
    // レッスン完了で一括50XP
    xpGained = 50;
  } else if (!lessonCompleted) {
    // ミッションごとに5XP
    xpGained = 5;
  }
  
  const newXP = progress.totalXP + xpGained;
  
  // レッスン完了時は完了リストに追加
  const newCompletedLessons = lessonCompleted
    ? [...progress.completedLessons, lessonId]
    : progress.completedLessons;
  
  // レベルアップ判定（XPベースで計算）
  const oldLevel = progress.level;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;
  
  // 進捗データを保存
  const newProgress: ProgressData = {
    ...progress,
    completedLessons: newCompletedLessons,
    lessonProgress: newLessonProgress,
    totalXP: newXP,
    level: newLevel,
  };
  
  saveProgress(newProgress);
  
  return {
    xpGained,
    newXP,
    newLevel,
    leveledUp,
    lessonCompleted,
  };
}

// レッスンを完了にする（エイリアス）
export function completeLesson(lessonId: string, xp: number = 50): ProgressData {
  return addLessonComplete(lessonId, xp);
}

// 現在のミッションIDを取得
export function getCurrentMission(lessonId: string): number {
  const progress = getProgress();
  return progress.lessonProgress[lessonId] || 1;
}
