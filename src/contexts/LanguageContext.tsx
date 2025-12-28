"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  language: "ja" | "en";
  setLanguage: (lang: "ja" | "en") => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<"ja" | "en">("ja");

  // localStorageから言語設定を読み込み
  useEffect(() => {
    const saved = localStorage.getItem("codeblock-language");
    if (saved === "en" || saved === "ja") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: "ja" | "en") => {
    setLanguageState(lang);
    localStorage.setItem("codeblock-language", lang);
  };

  const t = (key: string): string => {
    // 簡単な翻訳テーブル
    const translations: Record<string, Record<string, string>> = {
      "common.login": { ja: "ログイン", en: "Login" },
      "common.signUp": { ja: "新規登録", en: "Sign Up" },
      "common.loading": { ja: "読み込み中...", en: "Loading..." },
    };
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

