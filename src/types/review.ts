export interface ReviewItem {
  odaiId: string; // 問題ID（例："1-1-3" = レッスン1-1の問題3）
  lessonId: string; // レッスンID（例："1-1"）
  lessonTitle: string; // レッスン名（表示用）
  correctStreak: number; // 連続正解数（0〜6）
  nextReviewDate: string; // 次の復習日（ISO文字列）
  lastReviewDate: string; // 最後に復習した日（ISO文字列）
  totalReviews: number; // 総復習回数
  totalCorrect: number; // 正解回数
}

export interface ReviewState {
  items: ReviewItem[];
  lastUpdated: string;
}

