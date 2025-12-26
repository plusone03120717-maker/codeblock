import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

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
    if (cloudProgress.visibleLessons) {
      localStorage.setItem("visibleLessons", JSON.stringify(cloudProgress.visibleLessons));
    }
    if (cloudProgress.completedLessons) {
      localStorage.setItem("completedLessons", JSON.stringify(cloudProgress.completedLessons));
    }
    if (cloudProgress.xp !== undefined) {
      localStorage.setItem("xp", cloudProgress.xp.toString());
    }
    if (cloudProgress.level !== undefined) {
      localStorage.setItem("level", cloudProgress.level.toString());
    }
    if (cloudProgress.streak !== undefined) {
      localStorage.setItem("streak", cloudProgress.streak.toString());
    }
    if (cloudProgress.lastStudyDate) {
      localStorage.setItem("lastStudyDate", cloudProgress.lastStudyDate);
    }
    if (cloudProgress.missionProgress) {
      localStorage.setItem("missionProgress", JSON.stringify(cloudProgress.missionProgress));
    }
  }
};

export const getLocalProgress = (): ProgressData => {
  if (typeof window === "undefined") {
    return DEFAULT_PROGRESS;
  }
  
  return {
    visibleLessons: JSON.parse(localStorage.getItem("visibleLessons") || '["1-1"]'),
    completedLessons: JSON.parse(localStorage.getItem("completedLessons") || "[]"),
    currentLesson: localStorage.getItem("currentLesson"),
    xp: parseInt(localStorage.getItem("xp") || "0", 10),
    level: parseInt(localStorage.getItem("level") || "1", 10),
    streak: parseInt(localStorage.getItem("streak") || "0", 10),
    lastStudyDate: localStorage.getItem("lastStudyDate"),
    missionProgress: JSON.parse(localStorage.getItem("missionProgress") || "{}"),
  };
};

export const saveLocalProgressToCloud = async (uid: string): Promise<void> => {
  const localProgress = getLocalProgress();
  await saveProgressToCloud(uid, localProgress);
};

