import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const usernameToEmail = (username: string): string => {
  return `${username.toLowerCase()}@codeblock.local`;
};

export const registerWithUsername = async (
  userId: string,
  password: string
): Promise<User> => {
  if (userId.length < 3) {
    throw new Error("ユーザーIDは3文字以上にしてください");
  }
  if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
    throw new Error("ユーザーIDは英数字とアンダースコアのみ使用できます");
  }

  const userIdDoc = await getDoc(doc(db, "userIds", userId.toLowerCase()));
  if (userIdDoc.exists()) {
    throw new Error("このユーザーIDは既に使われています");
  }

  const email = usernameToEmail(userId);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 新規ユーザーの初期データ
  const initialUserData = {
    userId: userId,
    displayName: "",
    createdAt: new Date(),
    xp: 0,
    level: 1,
    // 実績関連フィールド
    achievements: [],
    pendingAchievements: [],
    lessonsCompleted: [],
    lessonCompleteCounts: {},
    totalCorrect: 0,
    streakDays: 0,
    lastStudyDate: null,
    consecutiveCorrect: 0,
    maxConsecutiveCorrect: 0,
    noMistakeLessons: [],
    noHintLessons: [],
    fastLessons: [],
    studiedOnWeekend: false,
    studiedEarly: false,
  };
  
  await setDoc(doc(db, "users", user.uid), initialUserData);

  await setDoc(doc(db, "userIds", userId.toLowerCase()), {
    uid: user.uid,
  });

  return user;
};

export const loginWithUsername = async (
  username: string,
  password: string
): Promise<User> => {
  const email = usernameToEmail(username);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // 既存ユーザーの実績関連フィールドをチェック
  await ensureAchievementFields(user.uid);
  
  return user;
};

export const loginWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    // 新規ユーザーの初期データ
    const initialUserData = {
      userId: user.email || "user",
      displayName: user.displayName || "",
      email: user.email,
      contactEmail: user.email || "",
      createdAt: new Date(),
      xp: 0,
      level: 1,
      // 実績関連フィールド
      achievements: [],
      pendingAchievements: [],
      lessonsCompleted: [],
      lessonCompleteCounts: {},
      totalCorrect: 0,
      streakDays: 0,
      lastStudyDate: null,
      consecutiveCorrect: 0,
      maxConsecutiveCorrect: 0,
      noMistakeLessons: [],
      noHintLessons: [],
      fastLessons: [],
      studiedOnWeekend: false,
      studiedEarly: false,
    };
    
    await setDoc(doc(db, "users", user.uid), initialUserData);
  } else {
    // 既存ユーザーの実績関連フィールドをチェック
    await ensureAchievementFields(user.uid);
  }

  return user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const getUserInfo = async (uid: string): Promise<{ userId: string | null; displayName: string | null; contactEmail: string | null }> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const data = userDoc.data();
    return {
      userId: data.userId || null,
      displayName: data.displayName || null,
      contactEmail: data.contactEmail || null,
    };
  }
  return { userId: null, displayName: null, contactEmail: null };
};

export const updateDisplayName = async (
  uid: string,
  newDisplayName: string
): Promise<void> => {
  await setDoc(doc(db, "users", uid), {
    displayName: newDisplayName,
  }, { merge: true });
};

export const updateEmail = async (
  uid: string,
  newEmail: string
): Promise<void> => {
  if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    throw new Error("有効なメールアドレスを入力してください");
  }
  
  await setDoc(doc(db, "users", uid), {
    contactEmail: newEmail,
  }, { merge: true });
};

export const getContactEmailByUserId = async (userId: string): Promise<string | null> => {
  const userIdDoc = await getDoc(doc(db, "userIds", userId.toLowerCase()));
  if (!userIdDoc.exists()) {
    return null;
  }
  
  const uid = userIdDoc.data().uid;
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) {
    return null;
  }
  
  return userDoc.data().contactEmail || null;
};

export const sendPasswordReset = async (userId: string): Promise<string> => {
  const userIdDoc = await getDoc(doc(db, "userIds", userId.toLowerCase()));
  if (!userIdDoc.exists()) {
    throw new Error("このユーザーIDは存在しません");
  }
  
  const uid = userIdDoc.data().uid;
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) {
    throw new Error("ユーザー情報が見つかりません");
  }
  
  const contactEmail = userDoc.data().contactEmail;
  if (!contactEmail) {
    throw new Error("メールアドレスが設定されていません。先生に相談してください。");
  }
  
  const resetToken = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  
  await setDoc(doc(db, "passwordResets", uid), {
    token: resetToken,
    expiresAt: expiresAt,
    createdAt: new Date(),
  });
  
  return contactEmail;
};

export const verifyResetToken = async (userId: string, token: string): Promise<string | null> => {
  const userIdDoc = await getDoc(doc(db, "userIds", userId.toLowerCase()));
  if (!userIdDoc.exists()) {
    return null;
  }
  
  const uid = userIdDoc.data().uid;
  const resetDoc = await getDoc(doc(db, "passwordResets", uid));
  
  if (!resetDoc.exists()) {
    return null;
  }
  
  const data = resetDoc.data();
  const expiresAt = data.expiresAt instanceof Timestamp 
    ? data.expiresAt.toDate() 
    : (data.expiresAt as Date);
  
  if (new Date() > expiresAt) {
    return null;
  }
  
  if (data.token !== token.toUpperCase()) {
    return null;
  }
  
  return uid;
};

export const resetPassword = async (userId: string, token: string, newPassword: string): Promise<void> => {
  if (newPassword.length < 6) {
    throw new Error("パスワードは6文字以上にしてください");
  }
  
  const uid = await verifyResetToken(userId, token);
  if (!uid) {
    throw new Error("リセットコードが無効または期限切れです");
  }
  
  const dummyEmail = usernameToEmail(userId);
  
  await deleteDoc(doc(db, "passwordResets", uid));
  
  throw new Error("パスワードの変更にはFirebase Admin SDKが必要です。先生に新しいパスワードを設定してもらってください。");
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("ログインしていません");
  }
  
  if (newPassword.length < 6) {
    throw new Error("新しいパスワードは6文字以上にしてください");
  }
  
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
  try {
    await reauthenticateWithCredential(user, credential);
  } catch (error: any) {
    if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      throw new Error("現在のパスワードが間違っています");
    }
    throw error;
  }
  
  await updatePassword(user, newPassword);
};

export const isGoogleUser = (): boolean => {
  const user = auth.currentUser;
  if (!user) return false;
  
  return user.providerData.some(provider => provider.providerId === "google.com");
};

// 既存ユーザーの実績関連フィールドを確保する関数
const ensureAchievementFields = async (uid: string): Promise<void> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // 実績関連フィールドがなければ追加
      const updates: any = {};
      
      if (!userData.achievements) updates.achievements = [];
      if (!userData.pendingAchievements) updates.pendingAchievements = [];
      if (!userData.lessonsCompleted) updates.lessonsCompleted = [];
      if (!userData.lessonCompleteCounts) updates.lessonCompleteCounts = {};
      if (userData.totalCorrect === undefined) updates.totalCorrect = 0;
      if (userData.streakDays === undefined) updates.streakDays = 0;
      if (!userData.lastStudyDate) updates.lastStudyDate = null;
      if (userData.consecutiveCorrect === undefined) updates.consecutiveCorrect = 0;
      if (userData.maxConsecutiveCorrect === undefined) updates.maxConsecutiveCorrect = 0;
      if (!userData.noMistakeLessons) updates.noMistakeLessons = [];
      if (!userData.noHintLessons) updates.noHintLessons = [];
      if (!userData.fastLessons) updates.fastLessons = [];
      if (userData.studiedOnWeekend === undefined) updates.studiedOnWeekend = false;
      if (userData.studiedEarly === undefined) updates.studiedEarly = false;
      if (userData.xp === undefined) updates.xp = 0;
      if (userData.level === undefined) updates.level = 1;
      
      // 更新が必要なフィールドがあれば更新
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, "users", uid), updates);
      }
    }
  } catch (error) {
    console.error("Failed to ensure achievement fields:", error);
  }
};

