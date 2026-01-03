"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserInfo } from "@/lib/auth";
import { syncProgressOnLogin } from "@/lib/progressSync";
import { UserProfile, SubscriptionPlan } from "@/types/user";
import { getUserProfile, createUserProfile, isPremiumPlan, canAccessLesson as checkLessonAccess } from "@/utils/subscription";

interface AuthContextType {
  user: User | null;
  userId: string | null;
  displayName: string | null;
  contactEmail: string | null;
  loading: boolean;
  progressLoaded: boolean;
  userProfile: UserProfile | null;
  isPremium: boolean;
  canAccessLesson: (lessonNumber: number) => boolean;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  displayName: null,
  contactEmail: null,
  loading: true,
  progressLoaded: false,
  userProfile: null,
  isPremium: false,
  canAccessLesson: () => false,
  refreshUserInfo: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const refreshUserInfo = async () => {
    if (user) {
      const info = await getUserInfo(user.uid);
      setUserId(info.userId);
      setDisplayName(info.displayName);
      setContactEmail(info.contactEmail);
      
      // UserProfileも更新
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setProgressLoaded(false);
      
      if (user) {
        const info = await getUserInfo(user.uid);
        setUserId(info.userId);
        setDisplayName(info.displayName);
        setContactEmail(info.contactEmail);
        
        // Firestoreからプロファイルを取得
        let profile = await getUserProfile(user.uid);
        
        // プロファイルがなければ作成
        if (!profile) {
          profile = await createUserProfile(
            user.uid,
            user.email || info.contactEmail || "",
            info.displayName || ""
          );
        }
        
        setUserProfile(profile);
        await syncProgressOnLogin(user.uid);
        setProgressLoaded(true);
      } else {
        setUserId(null);
        setDisplayName(null);
        setContactEmail(null);
        setUserProfile(null);
        setProgressLoaded(true);
        // ログアウト時にフリガナをオフにする
        if (typeof window !== "undefined") {
          localStorage.setItem("furigana-enabled", "false");
          // カスタムイベントを発火してFuriganaContextに通知
          window.dispatchEvent(new Event("furigana-changed"));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ヘルパー関数
  const isPremium = userProfile ? isPremiumPlan(userProfile.subscription.plan) : false;

  const canAccessLesson = (lessonNumber: number): boolean => {
    if (!userProfile) return lessonNumber <= 3; // 未ログインは無料範囲のみ
    return checkLessonAccess(userProfile.subscription.plan, lessonNumber);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        userId, 
        displayName, 
        contactEmail, 
        loading, 
        progressLoaded, 
        userProfile,
        isPremium,
        canAccessLesson,
        refreshUserInfo 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

