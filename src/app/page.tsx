'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { lessons } from '@/data/lessons'
import { getProgress, isLessonCompleted } from '@/utils/progress'

export default function Home() {
  const [totalXP, setTotalXP] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  
  useEffect(() => {
    const progress = getProgress()
    setTotalXP(progress.totalXP)
    setCompletedLessons(progress.completedLessons)
  }, [])
  // カラーパレット（レッスン数が増えても自動的に循環）
  const colorPalette = [
    {
      // 紫系
      border: 'border-purple-200 hover:border-purple-400',
      badge: 'bg-gradient-to-br from-purple-400 to-purple-500',
      button: 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700',
    },
    {
      // ピンク系
      border: 'border-pink-200 hover:border-pink-400',
      badge: 'bg-gradient-to-br from-pink-400 to-pink-500',
      button: 'bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700',
    },
    {
      // 青系
      border: 'border-blue-200 hover:border-blue-400',
      badge: 'bg-gradient-to-br from-blue-400 to-blue-500',
      button: 'bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700',
    },
    {
      // 緑系（レッスン4以降用）
      border: 'border-green-200 hover:border-green-400',
      badge: 'bg-gradient-to-br from-green-400 to-green-500',
      button: 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700',
    },
    {
      // オレンジ系（レッスン5以降用）
      border: 'border-orange-200 hover:border-orange-400',
      badge: 'bg-gradient-to-br from-orange-400 to-orange-500',
      button: 'bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700',
    },
    {
      // 水色系（レッスン6以降用）
      border: 'border-cyan-200 hover:border-cyan-400',
      badge: 'bg-gradient-to-br from-cyan-400 to-cyan-500',
      button: 'bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700',
    },
  ]
  
  // レッスンIDから色を取得（IDが6を超えても循環）
  const getColorForLesson = (lessonId: number) => {
    return colorPalette[(lessonId - 1) % colorPalette.length]
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            CodeBlock - Python学習
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            ブロックを組み立てながら、Pythonプログラムの考え方を楽しく学びましょう 🐍
          </p>
          <div className="flex items-center justify-center gap-2 bg-yellow-100 px-4 py-2 rounded-full shadow inline-block">
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-bold text-yellow-600">{totalXP} XP</span>
          </div>
        </div>
        
        {/* レッスン一覧 */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">レッスン一覧</h2>
          <p className="text-xl text-gray-600">
            まずはレッスン1から順番に、少しずつレベルアップしていきましょう 📚
          </p>
        </div>
        
        {/* レッスンカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson) => {
            const difficultyText = lesson.difficulty === 'easy' ? 'やさしい' : lesson.difficulty === 'medium' ? 'ふつう' : '難しい'
            const colors = getColorForLesson(lesson.id)
            
            return (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                <div className={`relative bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-4 ${colors.border}`}>
                  
                  {/* 完了バッジ */}
                  {completedLessons.includes(lesson.id) && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
                      ✓ 完了
                    </div>
                  )}
                  
                  {/* ヘッダー */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${colors.badge} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {lesson.id}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        レッスン {lesson.id}
                      </h3>
                    </div>
                  </div>
                  
                  {/* 難易度バッジ */}
                  <div className="mb-4">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                      lesson.difficulty === 'easy' 
                        ? 'bg-green-200 text-green-800' 
                        : lesson.difficulty === 'medium'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {difficultyText}
                    </span>
                  </div>
                  
                  {/* タイトル */}
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    {lesson.title}
                  </h4>
                  
                  {/* 説明 */}
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {lesson.description}
                  </p>
                  
                  {/* 開始ボタン */}
                  {completedLessons.includes(lesson.id) ? (
                    <button className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-xl border-2 border-white">
                      🔄 復習する
                    </button>
                  ) : (
                    <button className={`w-full ${colors.button} text-white px-8 py-4 rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-xl border-2 border-white`}>
                      開始 →
                    </button>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
        
        {/* フッター */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-lg">
            全{lessons.length}レッスンで、Pythonの基礎をマスターしよう！✨
          </p>
        </div>
      </div>
    </div>
  )
}
