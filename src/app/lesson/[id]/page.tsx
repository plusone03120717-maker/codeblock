'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { lessons } from '@/data/lessons'
import { getTutorial } from '@/data/tutorials'
import { isLessonCompleted } from '@/utils/progress'

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = Number(params.id)
  
  const lesson = lessons.find(l => l.id === lessonId)
  const tutorial = getTutorial(lessonId)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  
  useEffect(() => {
    if (lessonId) {
      setIsCompleted(isLessonCompleted(lessonId))
    }
  }, [lessonId])
  
  if (!lesson || !tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">エラー</h2>
            <p className="text-red-700 mb-4">レッスンまたはチュートリアルが見つかりません</p>
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
  
  const slide = tutorial.slides[currentSlide]
  const isLastSlide = currentSlide === tutorial.slides.length - 1
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* キャラクターとメッセージ */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          
          {/* キャラクター画像 */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-purple-200 relative overflow-hidden">
              {tutorial.characterImage && !imageError ? (
                <Image
                  src={tutorial.characterImage}
                  alt={tutorial.characterName}
                  width={128}
                  height={128}
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-7xl">{tutorial.characterEmoji}</span>
              )}
            </div>
            <p className="text-center mt-2 font-bold text-gray-700">
              {tutorial.characterName}
            </p>
          </div>
          
          {/* 吹き出し */}
          <div className="flex-1 relative">
            <div className="bg-blue-100 rounded-3xl p-6 shadow-lg border-2 border-blue-200 relative">
              <div className="absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2 hidden md:block">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-blue-100 border-b-8 border-b-transparent"></div>
              </div>
              
              <p className="text-lg text-gray-800">
                {slide.characterMessage}
              </p>
            </div>
          </div>
        </div>
        
        {/* スライド内容 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {slide.title}
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            {slide.content}
          </p>
          {slide.codeExample && (
            <div className="mt-4 space-y-3">
              {slide.codeExample.bad && (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                  <div className="text-red-600 font-bold text-sm mb-2">❌ ダメな例</div>
                  <pre className="bg-red-100 rounded-lg p-3 text-red-800 font-mono text-sm overflow-x-auto">
                    {slide.codeExample.bad}
                  </pre>
                </div>
              )}
              {slide.codeExample.good && (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                  <div className="text-green-600 font-bold text-sm mb-2">✅ 正しい例</div>
                  <pre className="bg-green-100 rounded-lg p-3 text-green-800 font-mono text-sm overflow-x-auto">
                    {slide.codeExample.good}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* スライドインジケーターとナビゲーション */}
        <div className="flex items-center justify-between mb-8">
          {/* 前へボタン */}
          {currentSlide > 0 && (
            <button
              onClick={() => setCurrentSlide(currentSlide - 1)}
              className="bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all text-lg"
            >
              ← 前へ
            </button>
          )}
          
          {/* 空のスペーサー（前へボタンがない時） */}
          {currentSlide === 0 && <div></div>}
          
          {/* スライドインジケーター */}
          <div className="flex gap-2">
            {tutorial.slides.map((_, index) => (
              <div
                key={index}
                className={`h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-purple-500'
                    : 'w-3 bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          {/* 次へボタン */}
          {!isLastSlide && (
            <button
              onClick={() => setCurrentSlide(currentSlide + 1)}
              className="bg-gradient-to-r from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all text-lg"
            >
              次へ →
            </button>
          )}
          
          {/* 空のスペーサー（次へボタンがない時） */}
          {isLastSlide && <div></div>}
        </div>
        
        {/* ボタンエリア */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-white"
          >
            ← ホームに戻る
          </button>
          
          {isCompleted ? (
            <button
              onClick={() => router.push(`/lesson/${lessonId}/editor`)}
              className="flex-1 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white px-12 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all border-2 border-white"
            >
              🔄 復習する
            </button>
          ) : (
            <button
              onClick={() => router.push(`/lesson/${lessonId}/editor`)}
              className="flex-1 bg-gradient-to-r from-green-300 to-emerald-400 hover:from-green-400 hover:to-emerald-500 text-white px-12 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all border-2 border-white"
            >
              ミッション開始！ 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
