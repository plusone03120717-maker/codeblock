// アプリ設定の型定義
export interface AppSettings {
  soundEnabled: boolean; // 効果音のON/OFF
}

// デフォルト設定
const defaultSettings: AppSettings = {
  soundEnabled: true,
};

// 設定を取得
export const getSettings = (): AppSettings => {
  if (typeof window === "undefined") return defaultSettings;
  
  const data = localStorage.getItem("codeblock_settings");
  if (!data) return defaultSettings;
  
  try {
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch {
    return defaultSettings;
  }
};

// 設定を保存
export const saveSettings = (settings: Partial<AppSettings>): void => {
  if (typeof window === "undefined") return;
  
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...settings };
  localStorage.setItem("codeblock_settings", JSON.stringify(newSettings));
};

// 効果音が有効かどうかを取得
export const isSoundEnabled = (): boolean => {
  return getSettings().soundEnabled;
};

// 効果音のON/OFFを設定
export const setSoundEnabled = (enabled: boolean): void => {
  saveSettings({ soundEnabled: enabled });
};

