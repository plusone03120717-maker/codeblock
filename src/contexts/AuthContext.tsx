"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUsername } from "@/lib/auth";
import { syncProgressOnLogin } from "@/lib/progressSync";

interface AuthContextType {
  user: User | null;
  username: string | null;
  loading: boolean;
  progressLoaded: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  username: null,
  loading: true,
  progressLoaded: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setProgressLoaded(false);
      
      if (user) {
        const name = await getUsername(user.uid);
        setUsername(name);
        await syncProgressOnLogin(user.uid);
        setProgressLoaded(true);
      } else {
        setUsername(null);
        setProgressLoaded(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, username, loading, progressLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

