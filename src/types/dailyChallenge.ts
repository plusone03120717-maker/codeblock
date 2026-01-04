// デイリーチャレンジの状態
export interface DailyChallengeState {
  date: string;                    // YYYY-MM-DD形式（日本時間基準）
  completed: boolean;              // 今日のチャレンジ完了フラグ
  currentQuestion: number;         // 現在の問題番号（0-2）
  correctCount: number;            // 正解数
  questions: DailyChallengeQuestion[]; // 今日の3問
  startedAt?: string;              // 開始時刻（ISO形式）
  completedAt?: string;            // 完了時刻（ISO形式）
}

// デイリーチャレンジの問題
export interface DailyChallengeQuestion {
  missionId: string;               // 元のミッションID（例: "1-1-3"）
  lessonId: string;                // レッスンID（例: "1-1"）
  unitId: number;                  // ユニット番号
  answered: boolean;               // 回答済みフラグ
  correct?: boolean;               // 正解したかどうか
}

// デイリーチャレンジの統計
export interface DailyChallengeStats {
  currentStreak: number;           // 現在の連続日数
  longestStreak: number;           // 最長連続日数
  totalCompleted: number;          // 累計完了回数
  totalCorrect: number;            // 累計正解数
  lastCompletedDate?: string;      // 最後に完了した日付（YYYY-MM-DD）
  badges: DailyChallengeBadge[];   // 獲得バッジ
}

// バッジの種類
export type DailyChallengeBadgeType = 'streak_7' | 'streak_30';

export interface DailyChallengeBadge {
  type: DailyChallengeBadgeType;
  earnedAt: string;                // 獲得日時（ISO形式）
}

