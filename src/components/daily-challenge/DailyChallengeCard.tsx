'use client';

import { useRouter } from 'next/navigation';
import { DailyChallengeState, DailyChallengeStats } from '@/types/dailyChallenge';
import { F } from '@/components/Furigana';
import { DailyChallengeTimer } from './DailyChallengeTimer';

interface DailyChallengeCardProps {
  state: DailyChallengeState | null;
  stats: DailyChallengeStats;
  onStart: () => void;
}

export function DailyChallengeCard({ state, stats, onStart }: DailyChallengeCardProps) {
  const router = useRouter();
  
  // 表示パターンを判定
  const isCompleted = state?.completed ?? false;
  const isInProgress = state && !state.completed && state.currentQuestion > 0;
  const isNotStarted = !state || (!isCompleted && !isInProgress);
  
  // 背景グラデーションを決定（ランディングページのヘッダーと同じ色）
  const bgGradient = 'from-purple-500 to-blue-600';
  
  return (
    <div className={`rounded-2xl shadow-lg p-6 bg-gradient-to-r ${bgGradient} text-white`}>
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          🎯 今日の<F reading="ちょうせん">挑戦</F>
        </h2>
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
            <span>🔥</span>
            <span className="font-bold">
              {stats.currentStreak}
              <F reading="にち">日</F>
              <F reading="れんぞく">連続</F>
            </span>
          </div>
        )}
      </div>
      
      {/* メインコンテンツ */}
      {isNotStarted && (
        // 未挑戦状態
        <div className="space-y-4">
          <p className="text-lg">
            3<F reading="もん">問</F>の<F reading="もんだい">問題</F>に<F reading="ちょうせん">挑戦</F>しよう！
          </p>
          <button
            onClick={onStart}
            className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-full text-lg transition-colors"
          >
            <F reading="ちょうせん">挑戦</F>する！
          </button>
        </div>
      )}
      
      {isInProgress && (
        // 挑戦中状態
        <div className="space-y-4">
          <p className="text-lg">
            {state.currentQuestion}/3 <F reading="もん">問</F>
            <F reading="かんりょう">完了</F>
          </p>
          <button
            onClick={() => router.push('/daily-challenge')}
            className="bg-white hover:bg-gray-100 text-orange-600 font-bold py-3 px-6 rounded-full text-lg transition-colors"
          >
            <F reading="つづ">続</F>きから
          </button>
        </div>
      )}
      
      {isCompleted && (
        // 完了状態
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span className="text-lg">
              今日は<F reading="かんりょう">完了</F>！
            </span>
          </div>
          <DailyChallengeTimer />
        </div>
      )}
    </div>
  );
}

