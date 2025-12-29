"use client";

import { useEffect, useState } from "react";
import { getProgress, getXPToNextLevel, getXPInCurrentLevel, getLevelInfo } from "@/utils/progress";

export default function PlayerStats() {
  const [progress, setProgress] = useState<{
    level: number;
    totalXP: number;
  } | null>(null);

  useEffect(() => {
    const loadProgress = () => {
      const data = getProgress();
      const levelInfo = getLevelInfo(data.totalXP);
      setProgress({
        level: levelInfo.level,
        totalXP: data.totalXP,
      });
    };

    loadProgress();

    // ストレージイベントをリッスン（他のタブでの変更を検知）
    window.addEventListener("storage", loadProgress);
    
    // カスタムイベントをリッスン（同じタブでの変更を検知）
    window.addEventListener("progressUpdated", loadProgress);

    return () => {
      window.removeEventListener("storage", loadProgress);
      window.removeEventListener("progressUpdated", loadProgress);
    };
  }, []);

  if (!progress) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
        <div className="text-sm">読み込み中...</div>
      </div>
    );
  }

  const { level, totalXP } = progress;
  const xpForNextLevel = getXPToNextLevel(totalXP);
  const xpInCurrentLevel = getXPInCurrentLevel(totalXP);
  const progressPercent = Math.min((xpInCurrentLevel / xpForNextLevel) * 100, 100);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
            Lv.{level}
          </div>
          <div>
            <div className="text-sm font-semibold">経験値</div>
            <div className="text-xs opacity-90">
              {xpInCurrentLevel} / {xpForNextLevel} XP
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-3 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}














