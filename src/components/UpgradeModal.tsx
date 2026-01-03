"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PLAN_PRICES } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { createCheckoutSession, PlanType } from "@/utils/stripe";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonNumber: number;
}

export const UpgradeModal = ({ isOpen, onClose, lessonNumber }: UpgradeModalProps) => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubscribe = async () => {
    if (!user) {
      alert("ログインが必要です");
      return;
    }

    setIsLoading(true);

    try {
      const checkoutUrl = await createCheckoutSession({
        plan: selectedPlan,
        userId: user.uid,
        userEmail: user.email || "",
      });

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert("エラーが発生しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={(e) => {
        // 背景クリックで閉じる（背景のみ）
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl relative"
        style={{ zIndex: 100000 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-gray-800">
            レッスン{lessonNumber}は有料プランで解放！
          </h2>
          <p className="text-gray-600 mt-2">
            有料プランに登録すると、すべてのレッスンが学び放題！
          </p>
        </div>

        {/* プラン選択 */}
        <div className="space-y-3 mb-6">
          {/* 年間プラン（おすすめ） */}
          <div
            onClick={() => setSelectedPlan("yearly")}
            className={`border-2 rounded-xl p-4 relative cursor-pointer transition-all ${
              selectedPlan === "yearly"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            <div className="absolute -top-3 left-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
              おすすめ
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === "yearly" ? "border-purple-500" : "border-gray-300"
                }`}>
                  {selectedPlan === "yearly" && (
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-lg">{PLAN_PRICES.yearly.label}</div>
                  <div className="text-sm text-gray-600">月あたり567円</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-purple-600">
                  ¥{PLAN_PRICES.yearly.price.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 font-bold">
                  {PLAN_PRICES.yearly.savings}
                </div>
              </div>
            </div>
          </div>

          {/* 月額プラン */}
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
              selectedPlan === "monthly"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === "monthly" ? "border-purple-500" : "border-gray-300"
                }`}>
                  {selectedPlan === "monthly" && (
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-lg">{PLAN_PRICES.monthly.label}</div>
                  <div className="text-sm text-gray-600">いつでも解約OK</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">
                  ¥{PLAN_PRICES.monthly.price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">/月</div>
              </div>
            </div>
          </div>
        </div>

        {/* 特典リスト */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="text-sm font-bold text-gray-700 mb-2">有料プランの特典</div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              全9レッスン（500問以上）が学び放題
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              AIヒントが1日10回まで
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              全範囲のスマート復習
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              デイリーチャレンジ
            </li>
          </ul>
        </div>

        {/* 決済方法 */}
        <div className="flex items-center justify-center gap-2 mb-4 text-sm text-gray-500">
          <span>利用可能:</span>
          <span>💳 カード</span>
          <span>📱 Google Pay</span>
          <span>🍎 Apple Pay</span>
        </div>

        {/* ボタン */}
        <div className="space-y-3">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                処理中...
              </>
            ) : (
              `${selectedPlan === "yearly" ? "年間" : "月額"}プランに登録する`
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full text-gray-500 hover:text-gray-700 font-medium py-2"
          >
            あとで
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
};

