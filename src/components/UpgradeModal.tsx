"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-gray-800">
            レッスン{lessonNumber}は有料プランで解放！
          </h2>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6 text-center">
          <p className="text-yellow-800 font-bold text-lg mb-2">
            現在、有料プランへの移行ができません
          </p>
          <p className="text-yellow-700 text-sm">
            準備が整い次第、お知らせいたします。それまでは無料レッスンをお楽しみください。
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            無料レッスンに戻る
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

