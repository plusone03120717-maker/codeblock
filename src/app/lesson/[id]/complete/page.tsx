'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { lessons } from '@/data/lessons'

export default function LessonCompletePage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = Number(params.id)
  
  const currentLesson = lessons.find(l => l.id === lessonId)
  const nextLesson = lessons.find(l => l.id === lessonId + 1)
  
  const [xp, setXp] = useState(0)
  const [showStats, setShowStats] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  
  // XPカウントアップアニメーション
  useEffect(() => {
    const duration = 1500 // 1.5秒
    const steps = 60
    const increment = 100 / steps
    const stepDuration = duration / steps
    
    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setXp(Math.min(100, Math.round(increment * currentStep)))
      
      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepDuration)
    
    return () => clearInterval(timer)
  }, [])
  
  // 統計とボタンのフェードイン
  useEffect(() => {
    const statsTimer = setTimeout(() => setShowStats(true), 1000)
    const buttonsTimer = setTimeout(() => setShowButtons(true), 2000)
    
    return () => {
      clearTimeout(statsTimer)
      clearTimeout(buttonsTimer)
    }
  }, [])
  
  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-100 to-blue-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">エラー</h2>
            <p className="text-red-700 mb-4">レッスンが見つかりません</p>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full font-bold"
            >
              ← ホームに戻る
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // 紙吹雪の生成
  const confetti = Array.from({ length: 50 }, (_, i) => {
    const colors = ['#FFB6C1', '#98FB98', '#87CEEB', '#FFD700', '#DDA0DD', '#00CED1']
    const shapes = ['circle', 'square']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    const left = Math.random() * 100
    const delay = Math.random() * 2
    const duration = 3 + Math.random() * 2
    const size = 8 + Math.random() * 8
    
    return {
      id: i,
      color,
      shape,
      left,
      delay,
      duration,
      size,
    }
  })
  
  return (
    <>
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        
        .bounce-animation {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .confetti {
          position: fixed;
          top: -10px;
          animation: fall linear forwards;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-100 to-blue-100 p-8 relative overflow-hidden">
        {/* 紙吹雪 */}
        {confetti.map((item) => (
          <div
            key={item.id}
            className="confetti"
            style={{
              left: `${item.left}%`,
              width: `${item.size}px`,
              height: `${item.size}px`,
              backgroundColor: item.color,
              borderRadius: item.shape === 'circle' ? '50%' : '0',
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
            }}
          />
        ))}
        
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* XPカウントアップ */}
          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-yellow-500 bounce-animation">
              +{xp} XP
            </div>
          </div>
          
          {/* コーディのお祝い */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6 bounce-animation">
              🐍
            </div>
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              レッスン<ruby>完了<rt>かんりょう</rt></ruby>！
            </h1>
            <p className="text-3xl text-gray-700">
              すごい！「{currentLesson.title}」を<ruby>完了<rt>かんりょう</rt></ruby>したよ！
            </p>
          </div>
          
          {/* クリア統計 */}
          <div
            className={`bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-3xl shadow-xl p-8 mb-8 border-2 border-white ${
              showStats ? 'fade-in' : 'opacity-0'
            }`}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              <ruby>統計<rt>とうけい</rt></ruby>
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-2xl font-bold text-green-600">
                  クリア: 10/10
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-yellow-600">
                  <ruby>正解率<rt>せいかいりつ</rt></ruby>: 100%
                </div>
              </div>
            </div>
          </div>
          
          {/* ボタン */}
          <div
            className={`flex gap-4 ${showButtons ? 'fade-in' : 'opacity-0'}`}
          >
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all border-4 border-purple-300"
            >
              🏠 ホームに<ruby>戻<rt>もど</rt></ruby>る
            </button>
            
            {nextLesson && (
              <button
                onClick={() => router.push(`/lesson/${nextLesson.id}`)}
                className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all border-2 border-white"
              >
                <ruby>次<rt>つぎ</rt></ruby>のレッスンへ →
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
