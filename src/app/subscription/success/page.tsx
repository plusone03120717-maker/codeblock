"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { upgradeToPremium } from "@/utils/subscription";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") as "monthly" | "yearly" | null;
  const { user, refreshUserProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateSubscription = async () => {
      if (!user || !plan) {
        setIsUpdating(false);
        return;
      }

      try {
        // Firestoreのユーザープランを更新
        await upgradeToPremium(user.uid, plan);
        
        // AuthContextのユーザープロファイルを再取得
        if (refreshUserProfile) {
          await refreshUserProfile();
        }
        
        setIsUpdating(false);
      } catch (err) {
        console.error("Failed to update subscription:", err);
        setError("プランの更新中にエラーが発生しました。サポートにお問い合わせください。");
        setIsUpdating(false);
      }
    };

    updateSubscription();
  }, [user, plan, refreshUserProfile]);

  if (isUpdating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">プランを更新しています...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">エラーが発生しました</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          登録完了！
        </h1>
        <p className="text-gray-600 mb-6">
          {plan === "yearly" ? "年間" : "月額"}プランへの登録が完了しました。<br />
          すべてのレッスンが解放されました！
        </p>
        
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <div className="text-sm text-gray-700">
            <p className="font-bold mb-2">解放された機能</p>
            <ul className="space-y-1 text-left">
              <li>✅ 全9レッスン（500問以上）</li>
              <li>✅ AIヒント 1日10回</li>
              <li>✅ 全範囲のスマート復習</li>
              <li>✅ デイリーチャレンジ</li>
            </ul>
          </div>
        </div>
        
        <Link
          href="/"
          className="inline-block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          学習を始める
        </Link>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

