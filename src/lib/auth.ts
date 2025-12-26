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
  username: string,
  password: string
): Promise<User> => {
  if (username.length < 3) {
    throw new Error("ユーザー名は3文字以上にしてください");
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error("ユーザー名は英数字とアンダースコアのみ使用できます");
  }

  const usernameDoc = await getDoc(doc(db, "usernames", username.toLowerCase()));
  if (usernameDoc.exists()) {
    throw new Error("このユーザー名は既に使われています");
  }

  const email = usernameToEmail(username);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    username: username,
    displayName: username,
    createdAt: new Date(),
  });

  await setDoc(doc(db, "usernames", username.toLowerCase()), {
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
      username: user.displayName || "ユーザー",
      displayName: user.displayName || "ユーザー",
      email: user.email,
      createdAt: new Date(),
    });
  }

  return user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const getUsername = async (uid: string): Promise<string | null> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data().username;
  }
  return null;
};

