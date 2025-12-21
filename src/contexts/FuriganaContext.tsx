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
    const saved = localStorage.getItem("furigana-enabled");
    if (saved === "true") {
      setFuriganaEnabled(true);
    }
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
