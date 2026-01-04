import {
  DailyChallengeState,
  DailyChallengeStats,
  DailyChallengeBadge,
} from '@/types/dailyChallenge';
import {
  getTodayDateJST,
  getYesterdayDateJST,
  getAvailableUnits,
  selectDailyQuestions,
} from './dailyChallengeUtils';

const DAILY_CHALLENGE_STATE_KEY = 'codeblock_daily_challenge_state';
const DAILY_CHALLENGE_STATS_KEY = 'codeblock_daily_challenge_stats';

/**
 * 今日のチャレンジ状態を取得
 * 日付が今日でなければnullを返す（新しいチャレンジが必要）
 */
export function getDailyChallengeState(): DailyChallengeState | null {
  if (typeof window === 'undefined') return null;
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeStorage.ts:20',message:'getDailyChallengeState entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  const stored = localStorage.getItem(DAILY_CHALLENGE_STATE_KEY);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeStorage.ts:24',message:'localStorage read',data:{hasStored:!!stored,storedLength:stored?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  if (!stored) return null;
  
  try {
    const state: DailyChallengeState = JSON.parse(stored);
    const today = getTodayDateJST();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeStorage.ts:32',message:'date comparison',data:{stateDate:state.date,todayDate:today,matches:state.date===today},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C'})}).catch(()=>{});
    // #endregion
    
    // 日付が今日でなければnull（新しいチャレンジが必要）
    if (state.date !== today) {
      return null;
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeStorage.ts:39',message:'getDailyChallengeState returning state',data:{completed:state.completed,currentQuestion:state.currentQuestion,questionCount:state.questions.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    return state;
  } catch (e) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeStorage.ts:44',message:'JSON parse error',data:{error:String(e)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return null;
  }
}

/**
 * チャレンジ状態を保存
 */
export function saveDailyChallengeState(state: DailyChallengeState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DAILY_CHALLENGE_STATE_KEY, JSON.stringify(state));
}

/**
 * 統計情報を取得（なければ初期値を返す）
 */
export function getDailyChallengeStats(): DailyChallengeStats {
  if (typeof window === 'undefined') {
    return getInitialStats();
  }
  
  const stored = localStorage.getItem(DAILY_CHALLENGE_STATS_KEY);
  if (!stored) {
    return getInitialStats();
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return getInitialStats();
  }
}

/**
 * 統計情報の初期値
 */
function getInitialStats(): DailyChallengeStats {
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalCompleted: 0,
    totalCorrect: 0,
    lastCompletedDate: undefined,
    badges: [],
  };
}

/**
 * 統計情報を保存
 */
function saveDailyChallengeStats(stats: DailyChallengeStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DAILY_CHALLENGE_STATS_KEY, JSON.stringify(stats));
}

/**
 * チャレンジ完了時に統計情報を更新
 * @returns 更新後の統計と新規獲得バッジ
 */
export function updateDailyChallengeStats(
  correctCount: number,
  date: string
): { stats: DailyChallengeStats; newBadges: DailyChallengeBadge[] } {
  const stats = getDailyChallengeStats();
  const yesterday = getYesterdayDateJST();
  const newBadges: DailyChallengeBadge[] = [];
  
  // 連続日数の計算
  if (stats.lastCompletedDate === yesterday) {
    // 前日に完了していれば連続日数+1
    stats.currentStreak += 1;
  } else if (stats.lastCompletedDate === date) {
    // 今日すでに完了済みなら何もしない
  } else {
    // それ以外はリセットして1から
    stats.currentStreak = 1;
  }
  
  // 最長連続日数の更新
  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }
  
  // 累計の更新
  stats.totalCompleted += 1;
  stats.totalCorrect += correctCount;
  stats.lastCompletedDate = date;
  
  // バッジの判定
  const hasBadge = (type: string) => stats.badges.some(b => b.type === type);
  
  // 7日連続バッジ
  if (stats.currentStreak >= 7 && !hasBadge('streak_7')) {
    const badge: DailyChallengeBadge = {
      type: 'streak_7',
      earnedAt: new Date().toISOString(),
    };
    stats.badges.push(badge);
    newBadges.push(badge);
  }
  
  // 30日連続バッジ
  if (stats.currentStreak >= 30 && !hasBadge('streak_30')) {
    const badge: DailyChallengeBadge = {
      type: 'streak_30',
      earnedAt: new Date().toISOString(),
    };
    stats.badges.push(badge);
    newBadges.push(badge);
  }
  
  // 保存
  saveDailyChallengeStats(stats);
  
  return { stats, newBadges };
}

/**
 * 新しいデイリーチャレンジを生成
 * @param userProgress - ユーザーのレッスン進捗（localStorageから取得）
 */
export function generateNewDailyChallenge(
  userProgress: Record<string, boolean> | null
): DailyChallengeState {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeStorage.ts:142',message:'generateNewDailyChallenge entry',data:{userProgressKeys:userProgress?Object.keys(userProgress):null,userProgressCount:userProgress?Object.keys(userProgress).length:0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  const today = getTodayDateJST();
  const availableUnits = getAvailableUnits(userProgress);
  const questions = selectDailyQuestions(availableUnits);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeStorage.ts:147',message:'before state creation',data:{today,availableUnits,questionCount:questions.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D,E'})}).catch(()=>{});
  // #endregion
  
  const state: DailyChallengeState = {
    date: today,
    completed: false,
    currentQuestion: 0,
    correctCount: 0,
    questions,
    startedAt: new Date().toISOString(),
  };
  
  saveDailyChallengeState(state);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeStorage.ts:160',message:'generateNewDailyChallenge result',data:{stateDate:state.date,questionCount:state.questions.length,missionIds:state.questions.map(q=>q.missionId)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  return state;
}

/**
 * 問題に回答した後の状態更新
 */
export function answerDailyChallengeQuestion(
  state: DailyChallengeState,
  questionIndex: number,
  isCorrect: boolean
): DailyChallengeState {
  const updatedState = { ...state };
  updatedState.questions = [...state.questions];
  updatedState.questions[questionIndex] = {
    ...state.questions[questionIndex],
    answered: true,
    correct: isCorrect,
  };
  
  if (isCorrect) {
    updatedState.correctCount += 1;
  }
  
  // 次の問題へ or 完了
  if (questionIndex < 2) {
    updatedState.currentQuestion = questionIndex + 1;
  } else {
    updatedState.completed = true;
    updatedState.completedAt = new Date().toISOString();
  }
  
  saveDailyChallengeState(updatedState);
  return updatedState;
}

/**
 * デイリーチャレンジの状態をリセット（デバッグ用）
 */
export function resetDailyChallengeState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DAILY_CHALLENGE_STATE_KEY);
}

/**
 * デイリーチャレンジの統計をリセット（デバッグ用）
 */
export function resetDailyChallengeStats(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DAILY_CHALLENGE_STATS_KEY);
}

/**
 * 連続日数を手動設定（デバッグ用）
 */
export function setDebugStreak(streak: number): void {
  const stats = getDailyChallengeStats();
  stats.currentStreak = streak;
  stats.lastCompletedDate = getYesterdayDateJST(); // 今日完了できるように前日設定
  saveDailyChallengeStats(stats);
}

/**
 * 特定の日付でチャレンジ完了をシミュレート（デバッグ用）
 */
export function simulateCompletedChallenge(
  date: string,
  correctCount: number = 3
): void {
  const state: DailyChallengeState = {
    date,
    completed: true,
    currentQuestion: 3,
    correctCount,
    questions: [],
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };
  saveDailyChallengeState(state);
}

/**
 * 全デイリーチャレンジデータをエクスポート（デバッグ用）
 */
export function exportDailyChallengeData(): string {
  const state = getDailyChallengeState();
  const stats = getDailyChallengeStats();
  return JSON.stringify({ state, stats }, null, 2);
}

/**
 * デイリーチャレンジデータをインポート（デバッグ用）
 */
export function importDailyChallengeData(jsonString: string): boolean {
  try {
    const { state, stats } = JSON.parse(jsonString);
    if (state) {
      localStorage.setItem(DAILY_CHALLENGE_STATE_KEY, JSON.stringify(state));
    }
    if (stats) {
      localStorage.setItem(DAILY_CHALLENGE_STATS_KEY, JSON.stringify(stats));
    }
    return true;
  } catch {
    return false;
  }
}

