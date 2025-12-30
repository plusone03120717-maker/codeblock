"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getReviewCount, getOverallRetentionRate, getReviewStats } from "@/utils/reviewSystem";
import { F } from "@/components/Furigana";

// 円形プログレスコンポーネント
function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = () => {
    if (percentage >= 100) return '#FFD700';
    if (percentage >= 61) return '#22C55E';
    if (percentage >= 31) return '#EAB308';
    return '#EF4444';
  };

  return (
    <div className="relative w-16 h-16">
      <svg className="w-16 h-16 transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke={getColor()}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{percentage}%</span>
      </div>
    </div>
  );
}

// 統計バッジコンポーネント
function StatBadge({ 
  emoji, 
  count, 
  label, 
  bgColor 
}: { 
  emoji: string; 
  count: number; 
  label: React.ReactNode; 
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg px-2 py-1 text-center min-w-[50px]`}>
      <div className="text-sm">{emoji}</div>
      <div className="text-sm font-bold">{count}</div>
      <div className="text-[10px] leading-tight">{label}</div>
    </div>
  );
}

export default function ReviewSection() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [retentionRate, setRetentionRate] = useState(100);
  const [stats, setStats] = useState({ 
    masteredCount: 0, 
    learnedCount: 0, 
    learningCount: 0 
  });

  useEffect(() => {
    setMounted(true);
    const updateReviewInfo = () => {
      const count = getReviewCount();
      const rate = getOverallRetentionRate();
      const reviewStats = getReviewStats();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ReviewSection.tsx:12',message:'updateReviewInfo',data:{reviewCount:count,retentionRate:rate},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      setReviewCount(count);
      setRetentionRate(rate);
      setStats({
        masteredCount: reviewStats.masteredCount,
        learnedCount: reviewStats.learnedCount,
        learningCount: reviewStats.learningCount,
      });
    };

    updateReviewInfo();
    // 定期的に更新（1分ごと）
    const interval = setInterval(updateReviewInfo, 60000);
    return () => clearInterval(interval);
  }, []);

  const { masteredCount, learnedCount, learningCount } = stats;

  // サーバーサイドレンダリング時の対応
  if (!mounted) {
    return null;
  }

  if (reviewCount > 0) {
    // 復習がある場合
    return (
      <div className="bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl shadow-lg p-4 mb-4">
        {/* キャラクターメッセージ */}
        <div className="flex items-center gap-2 mb-2">
          <img 
            src="/images/characters/memory.png" 
            alt="メモリー" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="bg-white rounded-xl px-2 py-0.5 shadow-sm">
            <span className="text-xs">
              <F reading="ふくしゅう">復習</F>の<F reading="じかん">時間</F>だよ！
            </span>
          </div>
        </div>

        {/* 円形プログレスと統計 */}
        <div className="flex items-center justify-between mb-2">
          <CircularProgress percentage={retentionRate} />
          
          <div className="flex gap-1">
            <StatBadge 
              emoji="⭐" 
              count={masteredCount} 
              label="マスター" 
              bgColor="bg-purple-100" 
            />
            <StatBadge 
              emoji="🟢" 
              count={learnedCount} 
              label={<><F reading="ていちゃくず">定着済</F>み</>} 
              bgColor="bg-green-100" 
            />
            <StatBadge 
              emoji="🟡" 
              count={learningCount} 
              label={<F reading="がくしゅうちゅう">学習中</F>} 
              bgColor="bg-yellow-100" 
            />
          </div>
        </div>

        {/* 復習ボタン */}
        <button
          onClick={() => router.push('/review')}
          className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all transform hover:scale-[1.02] text-sm"
        >
          🔄 {reviewCount}<F reading="もん">問</F>を<F reading="ふくしゅう">復習</F>する
        </button>
      </div>
    );
  } else {
    // 復習がない場合
    return (
      <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl shadow-lg p-4 mb-4">
        {/* 上部: キャラクターと完了メッセージを横並び */}
        <div className="flex items-center gap-2 mb-2">
          <img 
            src="/images/characters/memory.png" 
            alt="メモリー" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="bg-white rounded-xl px-2 py-0.5 shadow-sm">
            <span className="text-xs">
              <F reading="きょう">今日</F>もがんばったね！
            </span>
          </div>
          <div className="ml-auto text-green-800 font-bold text-sm">
            <F reading="ふくしゅう">復習</F><F reading="かんりょう">完了</F>！
          </div>
        </div>

        {/* 下部: プログレスと統計を横並び */}
        <div className="flex items-center justify-between">
          <CircularProgress percentage={retentionRate} />
          
          <div className="flex gap-1">
            <StatBadge 
              emoji="⭐" 
              count={masteredCount} 
              label="マスター" 
              bgColor="bg-purple-100" 
            />
            <StatBadge 
              emoji="🟢" 
              count={learnedCount} 
              label={<><F reading="ていちゃくず">定着済</F>み</>} 
              bgColor="bg-green-100" 
            />
            <StatBadge 
              emoji="🟡" 
              count={learningCount} 
              label={<F reading="がくしゅうちゅう">学習中</F>} 
              bgColor="bg-yellow-100" 
            />
          </div>
        </div>
      </div>
    );
  }
}
