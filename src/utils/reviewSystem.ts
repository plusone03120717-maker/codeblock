import { ReviewItem, ReviewState } from "@/types/review";

const STORAGE_KEY = 'codeblock-review-items';
const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60]; // 復習間隔（日数）

/**
 * localStorageから復習データを取得
 */
export function getReviewState(): ReviewState {
  if (typeof window === "undefined") {
    return { items: [], lastUpdated: new Date().toISOString() };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { items: [], lastUpdated: new Date().toISOString() };
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse review state:", error);
    return { items: [], lastUpdated: new Date().toISOString() };
  }
}

/**
 * localStorageに復習データを保存
 */
export function saveReviewState(state: ReviewState): void {
  if (typeof window === "undefined") return;

  try {
    const updatedState: ReviewState = {
      ...state,
      lastUpdated: new Date().toISOString(),
    };
    const jsonData = JSON.stringify(updatedState);
    localStorage.setItem(STORAGE_KEY, jsonData);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'reviewSystem.ts:38',message:'saveReviewState success',data:{itemsCount:updatedState.items.length,storageKey:STORAGE_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'reviewSystem.ts:40',message:'saveReviewState error',data:{error:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.error("Failed to save review state:", error);
  }
}

/**
 * 問題を復習リストに追加
 */
export function addToReviewList(
  lessonId: string,
  odaiIndex: number,
  lessonTitle: string
): void {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'reviewSystem.ts:47',message:'addToReviewList called',data:{lessonId,odaiIndex,lessonTitle},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  const state = getReviewState();
  const odaiId = `${lessonId}-${odaiIndex}`;

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'reviewSystem.ts:53',message:'odaiId generated',data:{odaiId,existingItemsCount:state.items.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  // 既に存在するかチェック
  const existingIndex = state.items.findIndex((item) => item.odaiId === odaiId);
  
  if (existingIndex >= 0) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'reviewSystem.ts:59',message:'item already exists, skipping',data:{odaiId,existingIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // 既に存在する場合は何もしない（重複追加を防ぐ）
    return;
  }

  // 新しい復習アイテムを作成
  const now = new Date();
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + REVIEW_INTERVALS[0]); // 1日後

  const newItem: ReviewItem = {
    odaiId,
    lessonId,
    lessonTitle,
    correctStreak: 0,
    nextReviewDate: nextReviewDate.toISOString(),
    lastReviewDate: now.toISOString(),
    totalReviews: 0,
    totalCorrect: 0,
  };

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'reviewSystem.ts:78',message:'new item created',data:{newItem},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  state.items.push(newItem);
  saveReviewState(state);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'reviewSystem.ts:81',message:'saveReviewState called',data:{itemsCount:state.items.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
}

/**
 * 今日復習すべき問題を取得
 */
export function getTodayReviewItems(): ReviewItem[] {
  const state = getReviewState();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = state.items.filter((item) => {
    const nextReview = new Date(item.nextReviewDate);
    nextReview.setHours(0, 0, 0, 0);
    const shouldReview = nextReview <= today;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'reviewSystem.ts:94',message:'checking review item',data:{odaiId:item.odaiId,nextReviewDate:item.nextReviewDate,nextReview:nextReview.toISOString(),today:today.toISOString(),shouldReview},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    return shouldReview;
  });
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'reviewSystem.ts:96',message:'getTodayReviewItems result',data:{totalItems:state.items.length,filteredCount:filtered.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  return filtered;
}

/**
 * 復習待ちの問題数を取得
 */
export function getReviewCount(): number {
  return getTodayReviewItems().length;
}

/**
 * 復習結果を更新
 */
export function updateReviewResult(odaiId: string, isCorrect: boolean): void {
  const state = getReviewState();
  const itemIndex = state.items.findIndex((item) => item.odaiId === odaiId);

  if (itemIndex < 0) {
    console.warn(`Review item not found: ${odaiId}`);
    return;
  }

  const item = state.items[itemIndex];
  const now = new Date();

  // 統計を更新
  item.totalReviews++;
  if (isCorrect) {
    item.totalCorrect++;
    item.correctStreak++;
  } else {
    item.correctStreak = 0; // 不正解でリセット
  }

  // 次の復習日を計算
  const streakIndex = Math.min(item.correctStreak, REVIEW_INTERVALS.length - 1);
  const intervalDays = REVIEW_INTERVALS[streakIndex];
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

  item.nextReviewDate = nextReviewDate.toISOString();
  item.lastReviewDate = now.toISOString();

  state.items[itemIndex] = item;
  saveReviewState(state);
}

/**
 * 6回連続正解でマスター判定
 */
export function isMastered(item: ReviewItem): boolean {
  return item.correctStreak >= 6;
}

/**
 * 定着度を計算（0〜100%）
 */
export function getRetentionRate(item: ReviewItem): number {
  if (item.totalReviews === 0) return 0;
  return Math.round((item.totalCorrect / item.totalReviews) * 100);
}

/**
 * 全体の定着度を計算
 */
export function getOverallRetentionRate(): number {
  const state = getReviewState();
  if (state.items.length === 0) return 100;

  let totalCorrect = 0;
  let totalReviews = 0;

  state.items.forEach((item) => {
    totalCorrect += item.totalCorrect;
    totalReviews += item.totalReviews;
  });

  if (totalReviews === 0) return 100;
  return Math.round((totalCorrect / totalReviews) * 100);
}

/**
 * 復習データをリセット（デバッグ用）
 */
export function resetReviewData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

