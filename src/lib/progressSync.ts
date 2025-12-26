import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getLevelInfo } from "@/utils/progress";

export interface ProgressData {
  visibleLessons: string[];
  completedLessons: string[];
  currentLesson: string | null;
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  missionProgress: { [lessonId: string]: number };
}

const DEFAULT_PROGRESS: ProgressData = {
  visibleLessons: ["1-1"],
  completedLessons: [],
  currentLesson: null,
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  missionProgress: {},
};

export const saveProgressToCloud = async (
  uid: string,
  progress: Partial<ProgressData>
): Promise<void> => {
  try {
    const progressRef = doc(db, "users", uid, "data", "progress");
    await setDoc(progressRef, progress, { merge: true });
  } catch (error) {
    console.error("進捗の保存に失敗しました:", error);
  }
};

export const loadProgressFromCloud = async (
  uid: string
): Promise<ProgressData | null> => {
  try {
    const progressRef = doc(db, "users", uid, "data", "progress");
    const progressDoc = await getDoc(progressRef);
    if (progressDoc.exists()) {
      return progressDoc.data() as ProgressData;
    }
    return null;
  } catch (error) {
    console.error("進捗の読み込みに失敗しました:", error);
    return null;
  }
};

export const syncProgressOnLogin = async (uid: string): Promise<void> => {
  const cloudProgress = await loadProgressFromCloud(uid);
  
  if (cloudProgress) {
    // codeblock-progress形式で保存
    const localProgress = {
      totalXP: cloudProgress.xp || 0,
      completedLessons: cloudProgress.completedLessons || [],
      currentStreak: cloudProgress.streak || 0,
      highestStreak: cloudProgress.streak || 0,
      visibleLessons: cloudProgress.visibleLessons || ["1-1"],
      level: cloudProgress.level || 1,
      lastStudyDate: cloudProgress.lastStudyDate || null,
    };
    localStorage.setItem("codeblock-progress", JSON.stringify(localProgress));
    
    // missionProgressを個別に保存
    if (cloudProgress.missionProgress) {
      Object.entries(cloudProgress.missionProgress).forEach(([lessonId, progress]) => {
        localStorage.setItem(`missionProgress_${lessonId}`, progress.toString());
      });
    }
  }
};

export const getLocalProgress = (): ProgressData => {
  if (typeof window === "undefined") {
    return DEFAULT_PROGRESS;
  }
  
  // codeblock-progressから読み込む
  const progressJson = localStorage.getItem("codeblock-progress");
  const progress = progressJson ? JSON.parse(progressJson) : {};
  
  // missionProgressを収集（missionProgress_で始まるキーをすべて取得）
  const missionProgress: { [key: string]: number } = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("missionProgress_")) {
      const lessonId = key.replace("missionProgress_", "");
      const value = localStorage.getItem(key);
      if (value) {
        missionProgress[lessonId] = parseInt(value, 10);
      }
    }
  }
  
  // レベル情報を計算（totalXPから）
  const totalXP = progress.totalXP || 0;
  const levelInfo = getLevelInfo(totalXP);
  
  return {
    visibleLessons: progress.visibleLessons || ["1-1"],
    completedLessons: progress.completedLessons || [],
    currentLesson: progress.currentLesson || null,
    xp: totalXP,
    level: levelInfo.level,
    streak: progress.currentStreak || 0,
    lastStudyDate: progress.lastStudyDate || null,
    missionProgress: missionProgress,
  };
};

export const saveLocalProgressToCloud = async (uid: string): Promise<void> => {
  const localProgress = getLocalProgress();
  await saveProgressToCloud(uid, localProgress);
};

