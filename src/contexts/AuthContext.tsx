"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserInfo } from "@/lib/auth";
import { syncProgressOnLogin } from "@/lib/progressSync";

interface AuthContextType {
  user: User | null;
  userId: string | null;
  displayName: string | null;
  loading: boolean;
  progressLoaded: boolean;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  displayName: null,
  loading: true,
  progressLoaded: false,
  refreshUserInfo: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const refreshUserInfo = async () => {
    if (user) {
      const info = await getUserInfo(user.uid);
      setUserId(info.userId);
      setDisplayName(info.displayName);
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
        await syncProgressOnLogin(user.uid);
        setProgressLoaded(true);
      } else {
        setUserId(null);
        setDisplayName(null);
        setProgressLoaded(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userId, displayName, loading, progressLoaded, refreshUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

