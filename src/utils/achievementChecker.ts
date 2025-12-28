import { achievements, Achievement } from "@/data/achievements";

export interface UserStats {
  lessonsCompleted: string[];      // クリアしたレッスンID一覧
  totalCorrect: number;            // 累計正解数
  totalXp: number;                 // 累計XP
  level: number;                   // 現在のレベル
  streakDays: number;              // 連続学習日数
  lessonCompleteCounts: { [lessonId: string]: number };  // レッスンごとのクリア回数
  consecutiveCorrect: number;      // 現在の連続正解数
  maxConsecutiveCorrect: number;   // 最大連続正解数
  noMistakeLessons: string[];      // ノーミスでクリアしたレッスンID
  noHintLessons: string[];         // ヒントなしでクリアしたレッスンID
  fastLessons: string[];           // 3分以内にクリアしたレッスンID
  studiedOnWeekend: boolean;       // 週末に学習したか
  studiedEarly: boolean;           // 朝6時前に学習したか
}

// ユニットごとのレッスン数
const lessonsPerUnit: { [unit: number]: string[] } = {
  1: ["1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7"],
  2: ["2-1", "2-2", "2-3", "2-4", "2-5", "2-6"],
  3: ["3-1", "3-2", "3-3", "3-4"],
  4: ["4-1", "4-2", "4-3", "4-4", "4-5", "4-6"],
  5: ["5-1", "5-2", "5-3", "5-4", "5-5", "5-6"],
  6: ["6-1", "6-2", "6-3", "6-4", "6-5", "6-6"],
  7: ["7-1", "7-2", "7-3", "7-4", "7-5", "7-6"],
  8: ["8-1", "8-2", "8-3", "8-4", "8-5", "8-6"],
  9: ["9-1", "9-2", "9-3", "9-4", "9-5", "9-6"],
};

// クイズレッスン一覧
const quizLessons = ["1-6", "2-6", "3-4", "4-6", "5-6", "6-6", "7-6", "8-6", "9-6"];

// 全レッスン一覧
const allLessons = Object.values(lessonsPerUnit).flat();

// ユニットが完了しているかチェック
const isUnitComplete = (unit: number, lessonsCompleted: string[]): boolean => {
  const unitLessons = lessonsPerUnit[unit];
  return unitLessons.every(lesson => lessonsCompleted.includes(lesson));
};

// 全クイズ完了チェック
const isAllQuizComplete = (lessonsCompleted: string[]): boolean => {
  return quizLessons.every(lesson => lessonsCompleted.includes(lesson));
};

// 全レッスン完了チェック
const isAllLessonsComplete = (lessonsCompleted: string[]): boolean => {
  return allLessons.every(lesson => lessonsCompleted.includes(lesson));
};

// 実績の条件をチェック
export const checkAchievementCondition = (
  achievement: Achievement,
  stats: UserStats
): boolean => {
  const { type, value } = achievement.condition;

  switch (type) {
    case "lessons_completed":
      return stats.lessonsCompleted.length >= (value as number);

    case "unit_complete":
      return isUnitComplete(value as number, stats.lessonsCompleted);

    case "streak_days":
      return stats.streakDays >= (value as number);

    case "total_correct":
      return stats.totalCorrect >= (value as number);

    case "total_xp":
      return stats.totalXp >= (value as number);

    case "level":
      return stats.level >= (value as number);

    case "no_mistake_lesson":
      return stats.noMistakeLessons.length >= (value as number);

    case "fast_lesson":
      return stats.fastLessons.length > 0;

    case "early_study":
      return stats.studiedEarly;

    case "all_lessons_complete":
      return isAllLessonsComplete(stats.lessonsCompleted);

    case "no_hint_lesson":
      return stats.noHintLessons.length >= (value as number);

    case "lesson_repeat":
      return Object.values(stats.lessonCompleteCounts).some(count => count >= (value as number));

    case "consecutive_correct":
      return stats.maxConsecutiveCorrect >= (value as number);

    case "all_quiz_complete":
      return isAllQuizComplete(stats.lessonsCompleted);

    case "weekend_study":
      return stats.studiedOnWeekend;

    default:
      return false;
  }
};

// 新しく解除された実績をチェック
export const checkNewAchievements = (
  stats: UserStats,
  currentAchievements: string[]
): Achievement[] => {
  const newAchievements: Achievement[] = [];

  for (const achievement of achievements) {
    // すでに解除済みならスキップ
    if (currentAchievements.includes(achievement.id)) {
      continue;
    }

    // 条件を満たしているかチェック
    if (checkAchievementCondition(achievement, stats)) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
};

// 現在の時間が朝6時前かチェック
export const isEarlyMorning = (): boolean => {
  const hour = new Date().getHours();
  return hour < 6;
};

// 今日が週末かチェック
export const isWeekend = (): boolean => {
  const day = new Date().getDay();
  return day === 0 || day === 6; // 日曜 or 土曜
};

