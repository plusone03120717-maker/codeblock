import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
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

  await setDoc(doc(db, "users", user.uid), {
    userId: userId,
    displayName: "",
    createdAt: new Date(),
  });

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
  return userCredential.user;
};

export const loginWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      userId: user.email || "user",
      displayName: user.displayName || "",
      email: user.email,
      createdAt: new Date(),
    });
  }

  return user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const getUserInfo = async (uid: string): Promise<{ userId: string | null; displayName: string | null }> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const data = userDoc.data();
    return {
      userId: data.userId || null,
      displayName: data.displayName || null,
    };
  }
  return { userId: null, displayName: null };
};

export const updateDisplayName = async (
  uid: string,
  newDisplayName: string
): Promise<void> => {
  await setDoc(doc(db, "users", uid), {
    displayName: newDisplayName,
  }, { merge: true });
};

