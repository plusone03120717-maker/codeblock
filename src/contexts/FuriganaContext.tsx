"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FuriganaContextType {
  furiganaEnabled: boolean;
  toggleFurigana: () => void;
}

const FuriganaContext = createContext<FuriganaContextType | undefined>(undefined);

export function FuriganaProvider({ children }: { children: ReactNode }) {
  const [furiganaEnabled, setFuriganaEnabled] = useState(false);

  // localStorageから初期値を読み込み
  useEffect(() => {
    const loadFuriganaState = () => {
      const saved = localStorage.getItem("furigana-enabled");
      setFuriganaEnabled(saved === "true");
    };
    
    loadFuriganaState();
    
    // localStorageの変更を監視（別タブでの変更を検知）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "furigana-enabled") {
        loadFuriganaState();
      }
    };
    
    // カスタムイベントで同じタブ内での変更も検知
    const handleFuriganaChange = () => {
      loadFuriganaState();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("furigana-changed", handleFuriganaChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("furigana-changed", handleFuriganaChange);
    };
  }, []);

  const toggleFurigana = () => {
    setFuriganaEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem("furigana-enabled", String(newValue));
      return newValue;
    });
  };

  return (
    <FuriganaContext.Provider value={{ furiganaEnabled, toggleFurigana }}>
      {children}
    </FuriganaContext.Provider>
  );
}

export function useFurigana() {
  const context = useContext(FuriganaContext);
  if (context === undefined) {
    throw new Error("useFurigana must be used within a FuriganaProvider");
  }
  return context;
}







