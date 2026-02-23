import { loadProgressFromCloud, saveProgressToCloud, ProgressData } from "@/lib/progressSync";

// レッスン構造定義
export const LESSON_STRUCTURE = [
  { unit: 1, name: "print関数", lessons: ["1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7"] },
  { unit: 2, name: "変数", lessons: ["2-1", "2-2", "2-3", "2-4", "2-5", "2-6"] },
  { unit: 3, name: "データ型", lessons: ["3-1", "3-2", "3-3", "3-4"] },
  { unit: 4, name: "条件分岐", lessons: ["4-1", "4-2", "4-3", "4-4", "4-5", "4-6"] },
  { unit: 5, name: "繰り返し", lessons: ["5-1", "5-2", "5-3", "5-4", "5-5", "5-6"] },
  { unit: 6, name: "リスト", lessons: ["6-1", "6-2", "6-3", "6-4", "6-5", "6-6"] },
  { unit: 7, name: "関数の基本", lessons: ["7-1", "7-2", "7-3", "7-4", "7-5", "7-6"] },
  { unit: 8, name: "戻り値と応用", lessons: ["8-1", "8-2", "8-3", "8-4", "8-5", "8-6"] },
  { unit: 9, name: "辞書", lessons: ["9-1", "9-2", "9-3", "9-4", "9-5", "9-6"] },
];

// 全レッスンIDのリスト（順序付き）
export const ALL_LESSON_IDS: string[] = LESSON_STRUCTURE.flatMap((u) => u.lessons);

// 次のレッスンIDを取得
const getNextLessonId = (lessonId: string): string | null => {
  const index = ALL_LESSON_IDS.indexOf(lessonId);
  if (index === -1 || index >= ALL_LESSON_IDS.length - 1) return null;
  return ALL_LESSON_IDS[index + 1];
};

// completedLessonsからvisibleLessonsを自動計算
export const calcVisibleLessons = (completedLessons: string[]): string[] => {
  const visible = new Set<string>(["1-1"]);
  for (const lessonId of completedLessons) {
    visible.add(lessonId);
    const next = getNextLessonId(lessonId);
    if (next) visible.add(next);
  }
  return Array.from(visible);
};

// 生徒の進捗を取得
export const getStudentProgress = async (uid: string): Promise<ProgressData | null> => {
  return await loadProgressFromCloud(uid);
};

// 生徒の進捗を保存（completedLessonsからvisibleLessonsを自動計算）
export const setStudentProgress = async (
  uid: string,
  completedLessons: string[],
  missionProgress: { [lessonId: string]: number }
): Promise<void> => {
  const visibleLessons = calcVisibleLessons(completedLessons);
  await saveProgressToCloud(uid, {
    completedLessons,
    missionProgress,
    visibleLessons,
  });
};
