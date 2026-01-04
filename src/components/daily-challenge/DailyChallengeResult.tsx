'use client';

import { DailyChallengeState, DailyChallengeStats, DailyChallengeBadge } from '@/types/dailyChallenge';
import { XPBreakdown } from '@/utils/progress';
import { F } from '@/components/Furigana';

interface DailyChallengeResultProps {
  state: DailyChallengeState;
  stats: DailyChallengeStats;
  xpBreakdown: XPBreakdown;
  totalXP: number;
  onGoHome: () => void;
}

export function DailyChallengeResult({
  state,
  stats,
  xpBreakdown,
  totalXP,
  onGoHome,
}: DailyChallengeResultProps) {
  const isPerfect = state.correctCount === 3;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* 結果アイコン */}
        <div className="text-6xl mb-4">
          {isPerfect ? '🎉' : state.correctCount >= 2 ? '😊' : '💪'}
        </div>
        
        {/* タイトル */}
        <h1 className="text-2xl font-bold mb-6">
          {isPerfect ? (
            <><F reading="かんぺき">完璧</F>！</>
          ) : (
            <>チャレンジ<F reading="かんりょう">完了</F>！</>
          )}
        </h1>
        
        {/* 正解数 */}
        <div className="text-4xl font-bold mb-6">
          <span className="text-blue-600">{state.correctCount}</span>
          <span className="text-gray-400">/3</span>
          <span className="text-lg ml-2">
            <F reading="もん">問</F>
            <F reading="せいかい">正解</F>
          </span>
        </div>
        
        {/* XP内訳 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <h3 className="font-bold mb-2">
            <F reading="かくとく">獲得</F>XP
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span><F reading="せいかい">正解</F>ボーナス</span>
              <span>+{xpBreakdown.correct} XP</span>
            </div>
            <div className="flex justify-between">
              <span><F reading="かんりょう">完了</F>ボーナス</span>
              <span>+{xpBreakdown.completion} XP</span>
            </div>
            {xpBreakdown.perfect > 0 && (
              <div className="flex justify-between text-yellow-600">
                <span>
                  <F reading="ぜんもん">全問</F>
                  <F reading="せいかい">正解</F>！
                </span>
                <span>+{xpBreakdown.perfect} XP</span>
              </div>
            )}
            {xpBreakdown.streak7 > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>
                  🔥 7<F reading="にち">日</F>
                  <F reading="れんぞく">連続</F>！
                </span>
                <span>+{xpBreakdown.streak7} XP</span>
              </div>
            )}
            {xpBreakdown.streak30 > 0 && (
              <div className="flex justify-between text-purple-600">
                <span>
                  ⭐ 30<F reading="にち">日</F>
                  <F reading="れんぞく">連続</F>！
                </span>
                <span>+{xpBreakdown.streak30} XP</span>
              </div>
            )}
            <div className="border-t pt-1 mt-2 flex justify-between font-bold">
              <span><F reading="ごうけい">合計</F></span>
              <span className="text-green-600">+{totalXP} XP</span>
            </div>
          </div>
        </div>
        
        {/* 連続日数 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-2xl">🔥</span>
          <span className="text-lg">
            <F reading="れんぞく">連続</F>
            <span className="font-bold text-orange-600 mx-1">{stats.currentStreak}</span>
            <F reading="にち">日</F>
          </span>
        </div>
        
        {/* ホームに戻るボタン */}
        <button
          onClick={onGoHome}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg w-full transition-colors"
        >
          ホームに<F reading="もど">戻</F>る
        </button>
      </div>
    </div>
  );
}

