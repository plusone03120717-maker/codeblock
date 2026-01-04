import { DailyChallengeQuestion } from '@/types/dailyChallenge';
import { getLessonMissions } from '@/data/missions';

/**
 * 日本時間で今日の日付を取得（午前6時リセット基準）
 * 午前6時より前なら前日の日付を返す
 */
export function getTodayDateJST(): string {
  // #region agent log
  const now = new Date();
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeUtils.ts:9',message:'getTodayDateJST entry',data:{utcNow:now.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  // 日本時間に変換
  const jstTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeUtils.ts:13',message:'JST time calculated',data:{jstHours:jstTime.getHours(),jstMinutes:jstTime.getMinutes(),isBefore6AM:jstTime.getHours()<6},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  // 午前6時より前なら前日扱い
  if (jstTime.getHours() < 6) {
    jstTime.setDate(jstTime.getDate() - 1);
  }
  
  // YYYY-MM-DD形式で返す
  const year = jstTime.getFullYear();
  const month = String(jstTime.getMonth() + 1).padStart(2, '0');
  const day = String(jstTime.getDate()).padStart(2, '0');
  
  const result = `${year}-${month}-${day}`;
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeUtils.ts:24',message:'getTodayDateJST result',data:{resultDate:result,year,month,day},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  return result;
}

/**
 * 次のリセット時刻（午前6時JST）までの残り時間を計算
 */
export function getTimeUntilReset(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const jstTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  
  // 次の午前6時を計算
  const nextReset = new Date(jstTime);
  nextReset.setHours(6, 0, 0, 0);
  
  // 現在が6時以降なら翌日の6時
  if (jstTime.getHours() >= 6) {
    nextReset.setDate(nextReset.getDate() + 1);
  }
  
  // 残り時間を計算（ミリ秒）
  const diffMs = nextReset.getTime() - jstTime.getTime();
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
}

/**
 * ユーザーの進捗に基づいて出題可能なユニット番号の配列を返す
 * @param userProgress - localStorageから取得した進捗データ（レッスンIDをキーとしたオブジェクト）
 */
export function getAvailableUnits(userProgress: Record<string, boolean> | null): number[] {
  // 進捗がない場合はUnit 1のみ
  if (!userProgress) {
    return [1];
  }
  
  const availableUnits: number[] = [1]; // Unit 1は常に含める
  
  // クリア済みレッスンからユニット番号を抽出
  // レッスンIDは "1-1", "1-2", "2-1" などの形式
  Object.keys(userProgress).forEach(lessonId => {
    if (userProgress[lessonId]) {
      const unitId = parseInt(lessonId.split('-')[0]);
      if (!availableUnits.includes(unitId) && unitId <= 6) {
        availableUnits.push(unitId);
      }
    }
  });
  
  return availableUnits.sort((a, b) => a - b);
}

/**
 * 利用可能なユニットから3問をランダムに選出
 * 可能な限り異なるユニットから出題する
 */
export function selectDailyQuestions(availableUnits: number[]): DailyChallengeQuestion[] {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeUtils.ts:82',message:'selectDailyQuestions entry',data:{availableUnits},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  const selectedQuestions: DailyChallengeQuestion[] = [];
  const usedMissionIds: Set<string> = new Set();
  
  // シャッフル関数
  const shuffle = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // ユニットをシャッフルしてバランスよく出題
  const shuffledUnits = shuffle(availableUnits);
  
  // 全てのレッスンとミッションを収集
  const allMissions: Array<{ lessonId: string; missionId: number; unitId: number }> = [];
  
  for (const unitId of availableUnits) {
    // レッスンIDのパターンを作成（例: "1-1", "1-2", "2-1" など）
    // Unit 1の場合は "1-1" から "1-10" 程度を想定
    // Unit 2の場合は "2-1" から "2-10" 程度を想定
    for (let subNumber = 1; subNumber <= 20; subNumber++) {
      const lessonId = `${unitId}-${subNumber}`;
      const missions = getLessonMissions(lessonId);
      
      if (missions) {
        missions.forEach(mission => {
          allMissions.push({
            lessonId,
            missionId: mission.id,
            unitId,
          });
        });
      }
    }
  }
  
  // 3問選出
  for (let i = 0; i < 3; i++) {
    // ユニットを順番に選択（ユニット数が3未満ならループ）
    const targetUnit = shuffledUnits[i % shuffledUnits.length];
    
    // 該当ユニットのミッションを取得
    const unitMissions = allMissions.filter(
      m => m.unitId === targetUnit && !usedMissionIds.has(`${m.lessonId}-${m.missionId}`)
    );
    
    if (unitMissions.length > 0) {
      // ランダムに1問選択
      const randomIndex = Math.floor(Math.random() * unitMissions.length);
      const mission = unitMissions[randomIndex];
      const missionIdString = `${mission.lessonId}-${mission.missionId}`;
      
      selectedQuestions.push({
        missionId: missionIdString,
        lessonId: mission.lessonId,
        unitId: mission.unitId,
        answered: false,
      });
      
      usedMissionIds.add(missionIdString);
    }
  }
  
  // 3問に満たない場合（ユニットが少ない場合）、残りを埋める
  while (selectedQuestions.length < 3) {
    const remainingMissions = allMissions.filter(
      m => !usedMissionIds.has(`${m.lessonId}-${m.missionId}`)
    );
    
    if (remainingMissions.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * remainingMissions.length);
    const mission = remainingMissions[randomIndex];
    const missionIdString = `${mission.lessonId}-${mission.missionId}`;
    
    selectedQuestions.push({
      missionId: missionIdString,
      lessonId: mission.lessonId,
      unitId: mission.unitId,
      answered: false,
    });
    
    usedMissionIds.add(missionIdString);
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dailyChallengeUtils.ts:189',message:'selectDailyQuestions result',data:{questionCount:selectedQuestions.length,questionIds:selectedQuestions.map(q=>q.missionId),questions:selectedQuestions.map(q=>({missionId:q.missionId,lessonId:q.lessonId,unitId:q.unitId}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  return selectedQuestions;
}

/**
 * 前日の日付を取得（連続日数チェック用）
 */
export function getYesterdayDateJST(): string {
  const now = new Date();
  // 日本時間に変換
  const jstTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  
  // 午前6時より前なら前日扱い
  if (jstTime.getHours() < 6) {
    jstTime.setDate(jstTime.getDate() - 1);
  }
  
  // さらに1日前にする（前日）
  jstTime.setDate(jstTime.getDate() - 1);
  
  // YYYY-MM-DD形式で返す
  const year = jstTime.getFullYear();
  const month = String(jstTime.getMonth() + 1).padStart(2, '0');
  const day = String(jstTime.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

