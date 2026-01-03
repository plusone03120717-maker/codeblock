"use client";

import Link from "next/link";

export default function SubscriptionCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
        <div className="text-6xl mb-4">🤔</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          登録をキャンセルしました
        </h1>
        <p className="text-gray-600 mb-6">
          またいつでも有料プランに登録できます。<br />
          無料レッスンを続けることもできますよ！
        </p>
        
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

