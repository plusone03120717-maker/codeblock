"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PLAN_PRICES } from "@/types/user";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonNumber: number;
}

export const UpgradeModal = ({ isOpen, onClose, lessonNumber }: UpgradeModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

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
          <div className="border-2 border-purple-500 rounded-xl p-4 bg-purple-50 relative">
            <div className="absolute -top-3 left-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
              おすすめ
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-lg">{PLAN_PRICES.yearly.label}</div>
                <div className="text-sm text-gray-600">月あたり567円</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-purple-600">¥{PLAN_PRICES.yearly.price.toLocaleString()}</div>
                <div className="text-xs text-green-600 font-bold">{PLAN_PRICES.yearly.savings}</div>
              </div>
            </div>
          </div>

          {/* 月額プラン */}
          <div className="border border-gray-300 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-lg">{PLAN_PRICES.monthly.label}</div>
                <div className="text-sm text-gray-600">いつでも解約OK</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">¥{PLAN_PRICES.monthly.price.toLocaleString()}</div>
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
              全9レッスン（350問以上）が学び放題
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

        {/* ボタン */}
        <div className="space-y-3">
          <button
            onClick={() => {
              // TODO: Phase 3でStripe決済に遷移
              alert("決済機能は準備中です");
            }}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            有料プランに登録する
          </button>
          <button
            onClick={onClose}
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

