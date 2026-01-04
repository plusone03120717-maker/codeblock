'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DailyChallengeState, DailyChallengeStats, DailyChallengeBadge } from '@/types/dailyChallenge';
import {
  getDailyChallengeState,
  getDailyChallengeStats,
  updateDailyChallengeStats,
} from '@/utils/dailyChallengeStorage';
import { calculateDailyChallengeXP, XPBreakdown, addXP } from '@/utils/progress';
import { DailyChallengeResult, DailyChallengeBadgePopup } from '@/components/daily-challenge';

export default function DailyChallengeCompletePage() {
  const router = useRouter();
  const [state, setState] = useState<DailyChallengeState | null>(null);
  const [stats, setStats] = useState<DailyChallengeStats | null>(null);
  const [xpBreakdown, setXpBreakdown] = useState<XPBreakdown | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [newBadges, setNewBadges] = useState<DailyChallengeBadge[]>([]);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [isProcessed, setIsProcessed] = useState(false);
  
  useEffect(() => {
    const challengeState = getDailyChallengeState();
    
    if (!challengeState || !challengeState.completed) {
      router.push('/daily-challenge');
      return;
    }
    
    setState(challengeState);
    
    const processedKey = `daily_challenge_processed_${challengeState.date}`;
    const alreadyProcessed = localStorage.getItem(processedKey);
    
    if (!alreadyProcessed) {
      const { stats: updatedStats, newBadges: earnedBadges } = updateDailyChallengeStats(
        challengeState.correctCount,
        challengeState.date
      );
      
      setStats(updatedStats);
      setNewBadges(earnedBadges);
      
      const isNewStreak7 = earnedBadges.some(b => b.type === 'streak_7');
      const isNewStreak30 = earnedBadges.some(b => b.type === 'streak_30');
      const { total, breakdown } = calculateDailyChallengeXP(
        challengeState.correctCount,
        isNewStreak7,
        isNewStreak30
      );
      
      setXpBreakdown(breakdown);
      setTotalXP(total);
      
      addXP(total);
      
      localStorage.setItem(processedKey, 'true');
      
      if (earnedBadges.length > 0) {
        setShowBadgePopup(true);
      }
    } else {
      const currentStats = getDailyChallengeStats();
      setStats(currentStats);
      
      const { total, breakdown } = calculateDailyChallengeXP(
        challengeState.correctCount,
        false,
        false
      );
      setXpBreakdown(breakdown);
      setTotalXP(total);
    }
    
    setIsProcessed(true);
  }, [router]);
  
  const handleCloseBadgePopup = () => {
    if (currentBadgeIndex < newBadges.length - 1) {
      setCurrentBadgeIndex(currentBadgeIndex + 1);
    } else {
      setShowBadgePopup(false);
    }
  };
  
  const handleGoHome = () => {
    router.push('/');
  };
  
  if (!isProcessed || !state || !stats || !xpBreakdown) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }
  
  return (
    <>
      <DailyChallengeResult
        state={state}
        stats={stats}
        xpBreakdown={xpBreakdown}
        totalXP={totalXP}
        onGoHome={handleGoHome}
      />
      
      {showBadgePopup && newBadges[currentBadgeIndex] && (
        <DailyChallengeBadgePopup
          badgeType={newBadges[currentBadgeIndex].type}
          onClose={handleCloseBadgePopup}
        />
      )}
    </>
  );
}

