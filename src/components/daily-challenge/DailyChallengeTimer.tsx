'use client';

import { useState, useEffect } from 'react';
import { getTimeUntilReset } from '@/utils/dailyChallengeUtils';
import { F } from '@/components/Furigana';

export function DailyChallengeTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset());
  
  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getTimeUntilReset();
      setTimeLeft(newTime);
      
      // リセット時間になったらページをリロード
      if (newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
        window.location.reload();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 時間をゼロ埋めでフォーマット
  const formatTime = (n: number) => String(n).padStart(2, '0');
  
  return (
    <div className="text-sm bg-white/20 px-3 py-2 rounded-lg inline-block">
      <F reading="つぎ">次</F>の<F reading="ちょうせん">挑戦</F>まで：
      <span className="font-mono font-bold ml-2">
        {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
      </span>
    </div>
  );
}

