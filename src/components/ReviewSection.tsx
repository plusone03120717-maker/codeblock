"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTodayReviewItems, getOverallRetentionRate, getReviewStats } from "@/utils/reviewSystem";

export default function ReviewSection() {
  const [reviewCount, setReviewCount] = useState(0);
  const [retentionRate, setRetentionRate] = useState(100);
  const [masteredCount, setMasteredCount] = useState(0);
  const [learningCount, setLearningCount] = useState(0);

  useEffect(() => {
    const updateReviewInfo = () => {
      const items = getTodayReviewItems();
      const count = items.length;
      const rate = getOverallRetentionRate();
      const stats = getReviewStats();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5177b56d-da0c-4bea-ba85-d7fa6767810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ReviewSection.tsx:12',message:'updateReviewInfo',data:{reviewCount:count,retentionRate:rate,itemsCount:items.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      setReviewCount(count);
      setRetentionRate(rate);
      setMasteredCount(stats.masteredCount);
      setLearningCount(stats.learningCount);
    };

    updateReviewInfo();
    // 定期的に更新（1分ごと）
    const interval = setInterval(updateReviewInfo, 60000);
    return () => clearInterval(interval);
  }, []);

  if (reviewCount > 0) {
    // 復習がある場合
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2">
            🔄 今日の復習
          </h3>
          <Link
            href="/review"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-full transition-colors text-sm"
          >
            復習する
          </Link>
        </div>
        <p className="text-amber-700 text-sm mb-3">
          {reviewCount}問の復習があります
        </p>
        {/* 統計情報 */}
        <div className="flex gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1 text-purple-700">
            <span>⭐</span>
            <span className="font-bold">{masteredCount}</span>
            <span>問</span>
          </div>
          <div className="flex items-center gap-1 text-orange-700">
            <span>📚</span>
            <span className="font-bold">{learningCount}</span>
            <span>問</span>
          </div>
        </div>
        {/* 全体の定着度プログレスバー */}
        <div>
          <div className="flex justify-between text-xs text-amber-600 mb-1">
            <span>全体の定着度</span>
            <span>{retentionRate}%</span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all"
              style={{ width: `${retentionRate}%` }}
            />
          </div>
        </div>
      </div>
    );
  } else {
    // 復習がない場合
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
            ✅ 復習完了！
          </h3>
        </div>
        <p className="text-green-700 text-sm mb-3">
          今日の復習はありません。お疲れ様でした！
        </p>
        {/* 統計情報 */}
        <div className="flex gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1 text-purple-700">
            <span>⭐</span>
            <span className="font-bold">{masteredCount}</span>
            <span>問</span>
          </div>
          <div className="flex items-center gap-1 text-orange-700">
            <span>📚</span>
            <span className="font-bold">{learningCount}</span>
            <span>問</span>
          </div>
        </div>
        {/* 全体の定着度プログレスバー */}
        <div>
          <div className="flex justify-between text-xs text-green-600 mb-1">
            <span>全体の定着度</span>
            <span>{retentionRate}%</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${retentionRate}%` }}
            />
          </div>
        </div>
      </div>
    );
  }
}

