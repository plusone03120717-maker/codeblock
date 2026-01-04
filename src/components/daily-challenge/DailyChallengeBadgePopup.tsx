'use client';

import { DailyChallengeBadgeType } from '@/types/dailyChallenge';
import { F } from '@/components/Furigana';

interface DailyChallengeBadgePopupProps {
  badgeType: DailyChallengeBadgeType;
  onClose: () => void;
}

export function DailyChallengeBadgePopup({ badgeType, onClose }: DailyChallengeBadgePopupProps) {
  const badgeInfo = {
    streak_7: {
      icon: '🔥',
      title: '7日連続達成！',
      description: '1週間がんばったね！',
      xpBonus: 100,
    },
    streak_30: {
      icon: '⭐',
      title: '30日連続達成！',
      description: 'すごい！1ヶ月続けたね！',
      xpBonus: 500,
    },
  };
  
  const info = badgeInfo[badgeType];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center animate-bounce-in">
        {/* バッジアイコン（大きく表示） */}
        <div className="text-8xl mb-4">{info.icon}</div>
        
        {/* タイトル */}
        <h2 className="text-2xl font-bold mb-2">
          🎉 バッジ<F reading="かくとく">獲得</F>！
        </h2>
        
        {/* バッジ名 */}
        <p className="text-xl font-bold text-yellow-600 mb-2">
          {badgeType === 'streak_7' ? (
            <>
              <F reading="なのか">7日</F>
              <F reading="れんぞく">連続</F>
              <F reading="たっせい">達成</F>！
            </>
          ) : (
            <>
              <F reading="さんじゅうにち">30日</F>
              <F reading="れんぞく">連続</F>
              <F reading="たっせい">達成</F>！
            </>
          )}
        </p>
        
        {/* 説明 */}
        <p className="text-gray-600 mb-4">{info.description}</p>
        
        {/* ボーナスXP */}
        <p className="text-lg font-bold text-green-600 mb-6">
          +{info.xpBonus} XP ゲット！
        </p>
        
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full text-lg transition-colors"
        >
          やったー！
        </button>
      </div>
    </div>
  );
}

