import { DailyChallengeQuestion } from '@/types/dailyChallenge';
import { getLessonMissions } from '@/data/missions';

/**
 * 日本時間で今日の日付を取得（午前6時リセット基準）
 * 午前6時より前なら前日の日付を返す
 */
export function getTodayDateJST(): string {
  const now = new Date();

  // 日本時間に変換
  const jstTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  
  
  // 午前6時より前なら前日扱い
  if (jstTime.getHours() < 6) {
    jstTime.setDate(jstTime.getDate() - 1);
  }
  
  // YYYY-MM-DD形式で返す
  const year = jstTime.getFullYear();
  const month = String(jstTime.getMonth() + 1).padStart(2, '0');
  const day = String(jstTime.getDate()).padStart(2, '0');
  
  const result = `${year}-${month}-${day}`;
  
  
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
  // （以前は unitId <= 6 の上限があり、ユニット7〜9を学び終えても出題されなかった）
  Object.keys(userProgress).forEach(lessonId => {
    if (userProgress[lessonId]) {
      const unitId = parseInt(lessonId.split('-')[0]);
      if (!Number.isNaN(unitId) && !availableUnits.includes(unitId)) {
        availableUnits.push(unitId);
      }
    }
  });

  return availableUnits.sort((a, b) => a - b);
}

/** クリア済みのレッスンIDの集合を返す（未習の問題を出題しないために使う） */
export function getClearedLessonIds(
  userProgress: Record<string, boolean> | null
): Set<string> {
  const cleared = new Set<string>();
  if (!userProgress) return cleared;
  Object.keys(userProgress).forEach(lessonId => {
    if (userProgress[lessonId]) cleared.add(lessonId);
  });
  return cleared;
}

/**
 * 利用可能なユニットから3問をランダムに選出
 * 可能な限り異なるユニットから出題する
 */
export function selectDailyQuestions(
  availableUnits: number[],
  clearedLessonIds?: Set<string>
): DailyChallengeQuestion[] {
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
    for (let subNumber = 1; subNumber <= 20; subNumber++) {
      const lessonId = `${unitId}-${subNumber}`;

      // まだ習っていないレッスンからは出題しない
      // （ユニット1は入門なので、進捗が無いときでも出せるように例外扱い）
      if (clearedLessonIds && clearedLessonIds.size > 0) {
        if (!clearedLessonIds.has(lessonId) && unitId !== 1) continue;
      }

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

  // 候補が1問も無い場合は、ユニット1の全ミッションにフォールバックする
  if (allMissions.length === 0) {
    for (let subNumber = 1; subNumber <= 20; subNumber++) {
      const lessonId = `1-${subNumber}`;
      const missions = getLessonMissions(lessonId);
      if (missions) {
        missions.forEach(mission => {
          allMissions.push({ lessonId, missionId: mission.id, unitId: 1 });
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

