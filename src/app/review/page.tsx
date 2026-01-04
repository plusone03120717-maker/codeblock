"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getLesson } from "@/data/lessons";
import { getMission } from "@/data/missions";
import { getTutorial } from "@/data/tutorials";
import { WordBlock } from "@/types";
import {
  getTodayReviewItems,
  updateReviewResult,
  getRetentionRate,
  getRetentionLevel,
} from "@/utils/reviewSystem";
import { addXP } from "@/utils/progress";
import { useAuth } from "@/contexts/AuthContext";
import { F, FW, FuriganaText } from "@/components/Furigana";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { playBlockAddSound, playBlockRemoveSound, playCorrectSound, playIncorrectSound } from "@/utils/sounds";

// スペースを追加すべきか判定
function shouldAddSpace(current: WordBlock, next: WordBlock): boolean {
  if (current.text === "↵") return false;
  if (next.text === "↵") return false;
  if (current.text === "(" || next.text === ")" || next.text === "(") return false;
  if (current.text === ")") return false;
  if (current.text === '"' || next.text === '"') return false;
  if (["=", ">=", ":", "(", ")", '"'].includes(current.text)) return false;
  if (["=", ">=", ":", "(", ")", '"'].includes(next.text)) return false;
  if (current.type === "string" && (next.type === "string" || next.type === "operator")) return false;
  return true;
}

// Pythonコード生成
function generateCode(selectedBlocks: WordBlock[]): string {
  let code = "";
  selectedBlocks.forEach((block, index) => {
    if (block.text === "↵") {
      code += "\n";
    } else if (block.text === "    ") {
      code += "    ";
    } else {
      code += block.text;
    }
    const nextBlock = selectedBlocks[index + 1];
    if (
      nextBlock &&
      !block.text.includes("\n") &&
      !nextBlock.text.includes("\n") &&
      shouldAddSpace(block, nextBlock)
    ) {
      code += " ";
    }
  });
  return code.trim();
}

// コードを正規化する関数
const normalizeCode = (code: string): string => {
  let normalized = code;
  const lines = normalized.split('\n');
  const normalizedLines = lines.map(line => {
    line = line.replace(/^(\s*)(\w+)\s*-=\s*(.+)$/gm, '$1$2 = $2 - $3');
    line = line.replace(/^(\s*)(\w+)\s*\+=\s*(.+)$/gm, '$1$2 = $2 + $3');
    line = line.replace(/^(\s*)(\w+)\s*\*=\s*(.+)$/gm, '$1$2 = $2 * $3');
    line = line.replace(/^(\s*)(\w+)\s*\/=\s*(.+)$/gm, '$1$2 = $2 / $3');
    return line;
  });
  return normalizedLines.join('\n');
};

// APIを呼び出してPythonコードを実行
async function executePythonCode(
  code: string
): Promise<{ output: string | null; error: string | null }> {
  try {
    // 環境変数の値を確認（ビルド時に埋め込まれる値）
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
    // 本番環境の判定（codeblock.jpでアクセスしている場合）
    const isProduction = typeof window !== 'undefined' && (
      window.location.hostname === 'codeblock.jp' || 
      window.location.hostname === 'www.codeblock.jp'
    );
    // API URLの決定: 環境変数がある場合はそれを使い、なければ本番環境では固定値、ローカルではlocalhost
    const API_URL = envApiUrl || (isProduction ? "https://codeblock-api.onrender.com" : "http://localhost:8000");
    const response = await fetch(`${API_URL}/api/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      output: data.output || null,
      error: data.error || null,
    };
  } catch (error) {
    return {
      output: null,
      error:
        error instanceof Error
          ? error.message
          : "実行中にエラーが発生しました",
    };
  }
}

type ExecutionResult = {
  success?: boolean;
  output?: string;
  error?: string;
} | null;

interface DraggableBlockProps {
  block: WordBlock;
  index: number;
  onRemove: (index: number) => void;
}

function DraggableBlock({ block, index, onRemove }: DraggableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `block-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="inline-block relative touch-none group"
    >
      <div
        {...attributes}
        {...listeners}
        className={`${block.color} text-gray-700 px-3 py-2 rounded-xl text-sm font-mono shadow-md hover:shadow-lg transition-all border-2 border-white cursor-grab active:cursor-grabbing select-none ${
          block.text === "    " ? "bg-gray-300 border-gray-400" : ""
        }`}
      >
        {block.text === "    " ? "→" : block.text}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute -top-1 -right-1 bg-red-400 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md hover:shadow-lg transition-all border-2 border-white z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        type="button"
      >
        ×
      </button>
    </div>
  );
}

export default function ReviewPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [reviewItems, setReviewItems] = useState(
    getTodayReviewItems()
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBlocks, setSelectedBlocks] = useState<WordBlock[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [executionResult, setExecutionResult] = useState<ExecutionResult>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [retentionUpgrades, setRetentionUpgrades] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 未ログイン時はログインページへリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // reviewItemsが更新されたときにcurrentIndexをリセット
  useEffect(() => {
    if (reviewItems.length > 0 && currentIndex >= reviewItems.length) {
      setCurrentIndex(0);
    }
  }, [reviewItems.length, currentIndex]);

  // 復習開始時にXPと定着度アップカウントをリセット
  useEffect(() => {
    setEarnedXP(0);
    setRetentionUpgrades(0);
  }, []);

  // 現在の復習アイテム
  const currentReviewItem = reviewItems[currentIndex];
  
  // 現在のミッションを取得
  const currentMission = useMemo(() => {
    if (!currentReviewItem) return undefined;
    
    // odaiIdの形式: "1-1-3" (lessonId-missionIndex)
    const parts = currentReviewItem.odaiId.split('-');
    const missionIndexStr = parts.pop();
    const lessonId = parts.join('-');
    const missionIndex = parseInt(missionIndexStr || '0', 10);
    
    // デバッグ用ログ
    console.log('currentItem:', currentReviewItem);
    console.log('lessonId:', lessonId);
    console.log('missionIndex:', missionIndex);
    
    const mission = getMission(lessonId, missionIndex);
    console.log('mission:', mission);
    
    return mission;
  }, [currentReviewItem]);

  const lesson = currentReviewItem
    ? getLesson(currentReviewItem.lessonId)
    : undefined;
  const tutorial = currentReviewItem
    ? getTutorial(currentReviewItem.lessonId)
    : undefined;

  // ブロックをランダムに並べ替える
  const availableBlocks = useMemo(() => {
    if (!currentMission?.availableBlocks) return [];
    
    const uniqueBlocks: WordBlock[] = [];
    const seenTexts = new Set<string>();
    
    for (const block of currentMission.availableBlocks) {
      if (!seenTexts.has(block.text)) {
        seenTexts.add(block.text);
        uniqueBlocks.push(block);
      }
    }
    
    const shuffled = [...uniqueBlocks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [currentMission?.availableBlocks, currentIndex]);

  // ミッション変更時にリセット
  useEffect(() => {
    setSelectedBlocks([]);
    setGeneratedCode("");
    setExecutionResult(null);
    setSelectedChoice(null);
    setShowNextButton(false);
  }, [currentIndex]);

  // 定着度が上がったかチェック（更新前のstreakと更新後のstreakを比較）
  const checkRetentionUpgrade = (beforeStreak: number, afterStreak: number): boolean => {
    if (beforeStreak === afterStreak) return false;
    
    // レベルが上がったかチェック
    const getLevel = (streak: number) => {
      if (streak === 0) return 'new';
      if (streak <= 2) return 'learning';
      if (streak <= 4) return 'reviewing';
      if (streak === 5) return 'learned';
      return 'mastered';
    };
    
    const beforeLevel = getLevel(beforeStreak);
    const afterLevel = getLevel(afterStreak);
    
    // レベルが上がった場合のみtrue
    const levelOrder = ['new', 'learning', 'reviewing', 'learned', 'mastered'];
    const beforeIndex = levelOrder.indexOf(beforeLevel);
    const afterIndex = levelOrder.indexOf(afterLevel);
    
    return afterIndex > beforeIndex;
  };

  // 問題が見つからない場合、次の問題にスキップ
  useEffect(() => {
    if (currentReviewItem && !currentMission && reviewItems.length > 0) {
      console.warn('Mission not found for odaiId:', currentReviewItem.odaiId, '- skipping to next');
      // 次の問題にスキップ
      if (currentIndex + 1 < reviewItems.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // 最後の問題の場合、完了画面を表示
        setShowCompletionScreen(true);
      }
    }
  }, [currentReviewItem, currentMission, currentIndex, reviewItems.length]);

  // 単語ブロックを選択
  const selectBlock = (block: WordBlock) => {
    const newBlock: WordBlock = {
      ...block,
      id: `${block.id}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    };
    setSelectedBlocks([...selectedBlocks, newBlock]);
    playBlockAddSound();
  };

  // 単語ブロックを削除
  const removeBlock = (index: number) => {
    setSelectedBlocks(selectedBlocks.filter((_, i) => i !== index));
    playBlockRemoveSound();
  };

  // ドラッグ終了ハンドラ
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelectedBlocks((blocks) => {
        const oldIndex = blocks.findIndex((_, i) => `block-${i}` === active.id);
        const newIndex = blocks.findIndex((_, i) => `block-${i}` === over.id);
        return arrayMove(blocks, oldIndex, newIndex);
      });
    }
  };

  // 表示用に行ごとにブロックをグループ化
  const blockLines = useMemo(() => {
    const lines: { blocks: { block: WordBlock; index: number }[] }[] = [];
    let currentLine: { block: WordBlock; index: number }[] = [];
    
    selectedBlocks.forEach((block, index) => {
      if (block.text === "↵") {
        currentLine.push({ block, index });
        lines.push({ blocks: currentLine });
        currentLine = [];
      } else {
        currentLine.push({ block, index });
      }
    });
    
    if (currentLine.length > 0) {
      lines.push({ blocks: currentLine });
    }
    
    return lines;
  }, [selectedBlocks]);

  // リセット
  const reset = () => {
    setSelectedBlocks([]);
    setGeneratedCode("");
    setExecutionResult(null);
    setShowNextButton(false);
  };

  // 選択式問題の判定
  const handleQuizAnswer = (choiceIndex: number) => {
    if (!currentMission || executionResult) return;
    
    setSelectedChoice(choiceIndex);
    const isCorrect = choiceIndex === currentMission.correctAnswer;
    
    if (isCorrect) {
      setExecutionResult({
        success: true,
        output: currentMission.expectedOutput,
      });
      playCorrectSound();
      
      // 復習結果を更新
      if (currentReviewItem) {
        const beforeStreak = currentReviewItem.correctStreak;
        updateReviewResult(currentReviewItem.odaiId, true);
        
        // 更新後のstreakを取得（正解したので+1）
        const afterStreak = beforeStreak + 1;
        
        // 定着度が上がったかチェック
        if (checkRetentionUpgrade(beforeStreak, afterStreak)) {
          setRetentionUpgrades(prev => prev + 1);
        }
        
        // XPを付与（1問5XP）
        addXP(5);
        setEarnedXP(prev => prev + 5);
        setCorrectCount(prev => prev + 1);
      }
      
      setShowNextButton(true);
    } else {
      setExecutionResult({
        success: false,
        output: currentMission.choices?.[choiceIndex] || "",
        error: "残念！もう一度考えてみよう！",
      });
      playIncorrectSound();
      
      // 復習結果を更新
      if (currentReviewItem) {
        updateReviewResult(currentReviewItem.odaiId, false);
      }
      
      setTimeout(() => {
        setExecutionResult(null);
        setSelectedChoice(null);
      }, 2000);
    }
  };

  // 確認ボタンの処理
  const handleCheck = async () => {
    if (selectedBlocks.length === 0) {
      setExecutionResult({
        success: false,
        error: "単語を選んでください。",
      });
      return;
    }

    setIsExecuting(true);
    const code = generateCode(selectedBlocks);
    setGeneratedCode(code);

    try {
      const normalizedCode = normalizeCode(code);
      let codeToExecute = normalizedCode;
      if (currentMission?.prefixCode) {
        codeToExecute = currentMission.prefixCode + "\n" + normalizedCode;
      }
      const { output, error } = await executePythonCode(codeToExecute);
      
      if (error) {
        setExecutionResult({
          success: false,
          error: `エラー: ${error}`,
        });
        setIsExecuting(false);
        playIncorrectSound();
        return;
      }

      const actualOutput = output || "";
      const expectedOutput = currentMission?.expectedOutput || "";
      const normalizedActual = actualOutput.trim();
      const normalizedExpected = expectedOutput.trim();
      const outputMatches = normalizedActual === normalizedExpected;

      if (outputMatches) {
        setExecutionResult({
          success: true,
          output: actualOutput,
        });
        playCorrectSound();
        
        // 復習結果を更新
        if (currentReviewItem) {
          const beforeStreak = currentReviewItem.correctStreak;
          updateReviewResult(currentReviewItem.odaiId, true);
          
          // 更新後のstreakを取得（正解したので+1）
          const afterStreak = beforeStreak + 1;
          
          // 定着度が上がったかチェック
          if (checkRetentionUpgrade(beforeStreak, afterStreak)) {
            setRetentionUpgrades(prev => prev + 1);
          }
          
          // XPを付与（1問5XP）
          addXP(5);
          setEarnedXP(prev => prev + 5);
          setCorrectCount(prev => prev + 1);
        }
        
        setShowNextButton(true);
      } else {
        setExecutionResult({
          success: false,
          output: actualOutput,
          error: "期待される出力と異なります。もう一度試してみましょう！",
        });
        playIncorrectSound();
        
        // 復習結果を更新
        if (currentReviewItem) {
          updateReviewResult(currentReviewItem.odaiId, false);
        }
      }
    } catch (error) {
      setExecutionResult({
        success: false,
        error: `実行中にエラーが発生しました: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`,
      });
      playIncorrectSound();
    } finally {
      setIsExecuting(false);
    }
  };

  // 次の問題へ進む
  const goToNext = () => {
    setCompletedCount(prev => prev + 1);
    
    if (currentIndex + 1 < reviewItems.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 全問完了ボーナス（+10XP）
      addXP(10);
      setEarnedXP(prev => prev + 10);
      setShowCompletionScreen(true);
    }
  };

  // ローディング中または未ログイン時の表示
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-purple-600">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  // 復習アイテムがない場合
  if (reviewItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              ✅ <FW word="復習" /><FW word="完了" />！
            </h2>
            <p className="text-green-700 mb-6">
              今日の復習はありません。お疲れ様でした！
            </p>
            <Link
              href="/"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 完了画面
  if (showCompletionScreen) {
    const accuracy = reviewItems.length > 0
      ? Math.round((correctCount / reviewItems.length) * 100)
      : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-purple-500 rounded-2xl p-8 text-center shadow-lg">
            <h2 className="text-3xl font-bold text-purple-800 mb-4">
              🎉 <FW word="復習" /><FW word="完了" />！
            </h2>
            <div className="space-y-4 mb-6">
              <p className="text-xl text-gray-700">
                <FW word="正解" />数: <span className="font-bold text-green-600">{correctCount}</span> / {reviewItems.length}
              </p>
              <p className="text-xl text-gray-700">
                <FW word="正解" />率: <span className="font-bold text-blue-600">{accuracy}%</span>
              </p>
              <p className="text-xl text-gray-700">
                獲得XP: <span className="font-bold text-yellow-600">+{earnedXP} XP</span>
              </p>
              {retentionUpgrades > 0 && (
                <p className="text-lg text-purple-600 font-bold">
                  ✨ {retentionUpgrades}問が定着度アップ！
                </p>
              )}
            </div>
            <Link
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-full transition-colors text-lg"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 問題が見つからない場合のエラー表示
  if (currentReviewItem && !currentMission) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              ⚠️ エラー
            </h2>
            <p className="text-red-700 mb-6">
              問題が見つかりませんでした（odaiId: {currentReviewItem.odaiId}）
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  if (currentIndex + 1 < reviewItems.length) {
                    setCurrentIndex(currentIndex + 1);
                  } else {
                    setShowCompletionScreen(true);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-full transition-colors"
              >
                次の問題へ
              </button>
              <Link
                href="/"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-full transition-colors"
              >
                ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentReviewItem || !currentMission || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-purple-600">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  const retentionRate = getRetentionRate(currentReviewItem);
  const retentionLevel = getRetentionLevel(currentReviewItem);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-2 md:p-4">
      <div className="max-w-5xl mx-auto">
        {/* ホームに戻るリンク */}
        <div className="mb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 font-semibold transition-colors text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            ホーム
          </Link>
        </div>

        {/* プログレスバー */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-gray-700">
              復習 {currentIndex + 1}/{reviewItems.length}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-full border-2 ${
                retentionLevel.color === 'red' ? 'bg-red-100 border-red-300 text-red-700' :
                retentionLevel.color === 'orange' ? 'bg-orange-100 border-orange-300 text-orange-700' :
                retentionLevel.color === 'yellow' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' :
                retentionLevel.color === 'green' ? 'bg-green-100 border-green-300 text-green-700' :
                'bg-purple-100 border-purple-300 text-purple-700'
              }`}>
                {retentionLevel.emoji} {retentionLevel.label}
              </span>
              <span className="text-xs text-gray-500">
                定着度: {retentionRate}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / reviewItems.length) * 100}%` }}
            />
          </div>
        </div>

        {/* ミッション内容 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5 mb-3 border-2 border-blue-300">
          <div className="flex items-start gap-4">
            {tutorial && (
              <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-purple-400 shadow-lg overflow-hidden">
                {tutorial.characterImage && !imageError ? (
                  <Image
                    src={tutorial.characterImage}
                    alt={tutorial.characterName}
                    width={128}
                    height={128}
                    className="object-contain"
                    unoptimized
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-4xl md:text-5xl">{tutorial.characterEmoji}</span>
                )}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base text-gray-700 mb-2 leading-relaxed">
                <FuriganaText text={currentMission.description} />
              </p>
              {currentMission?.prefixCode && (
                <div className="bg-gray-700 rounded-lg p-2 mt-3">
                  <p className="text-xs text-gray-400 mb-1">変数の設定（自動で入力されます）:</p>
                  <pre className="text-yellow-400 font-mono text-sm">{currentMission.prefixCode}</pre>
                </div>
              )}
              {currentMission?.type !== "quiz" && !currentMission?.hideExpectedOutput && (
                <div className="bg-gray-800 rounded-lg p-2 mt-3">
                  <p className="text-xs text-gray-400 mb-1">期待される出力:</p>
                  <pre className="text-green-400 font-mono text-sm">
                    {currentMission.expectedOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 回答エリア */}
        {currentMission?.type === "quiz" ? (
          <div className="mb-4">
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {currentMission.codeToRead}
              </pre>
            </div>
            <h3 className="text-sm font-bold mb-2 text-gray-700">選択肢から選んでね</h3>
            <div className="grid grid-cols-2 gap-2">
              {currentMission.choices?.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  disabled={executionResult !== null}
                  className={`p-3 rounded-xl font-bold text-left transition-all border-2 ${
                    selectedChoice === index
                      ? executionResult?.success
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-red-100 border-red-500 text-red-700"
                      : "bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50"
                  } ${executionResult !== null ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span className="text-purple-500 mr-2">{String.fromCharCode(65 + index)}.</span>
                  {choice}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-bold mb-2 text-gray-700">あなたの答え</h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-4 min-h-[60px]">
                {selectedBlocks.length === 0 ? (
                  <p className="text-gray-400 text-center py-2 text-sm">単語を選んでください</p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={selectedBlocks.map((_, i) => `block-${i}`)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-1">
                        {blockLines.map((line, lineIndex) => (
                          <div key={`line-${lineIndex}`} className="flex flex-wrap gap-1 items-center min-h-[36px]">
                            {line.blocks.map(({ block, index }) => (
                              <DraggableBlock
                                key={`block-${index}`}
                                block={block}
                                index={index}
                                onRemove={removeBlock}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-bold mb-2 text-gray-700">単語を選んでね</h3>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4">
                <div className="flex flex-wrap gap-2">
                  {availableBlocks.map((block) => (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => selectBlock(block)}
                      className={`${block.color} text-gray-700 px-3 py-2 rounded-xl text-sm font-mono shadow hover:shadow-md hover:scale-105 transition-all border border-white`}
                    >
                      {block.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="h-40"></div>
      </div>

      {/* ボタンと結果表示（画面下部に固定） */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: 'white',
          borderTop: '2px solid #e5e7eb',
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {executionResult && (
          <div className="p-3 border-b">
            {executionResult.success ? (
              <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-3 flex items-center gap-3">
                <span className="text-xl">🎉</span>
                <div className="flex-1">
                  <p className="text-green-800 font-bold text-sm">正解！</p>
                  <p className="text-green-700 text-xs">出力: {executionResult.output}</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-3 flex items-center gap-3">
                <span className="text-xl">🤔</span>
                <div>
                  <p className="text-red-800 font-bold text-sm">もう一度！</p>
                  {executionResult.error && (
                    <p className="text-red-700 text-xs font-bold">{executionResult.error}</p>
                  )}
                  {executionResult.output && (
                    <p className="text-red-700 text-xs">出力: {executionResult.output}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="p-3">
          {showNextButton ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={goToNext}
                style={{
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  color: 'white',
                  padding: '14px 32px',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  border: '2px solid white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  width: '100%',
                  maxWidth: '300px',
                }}
              >
                {currentIndex + 1 < reviewItems.length ? "次へ →" : "🎊 完了！"}
              </button>
            </div>
          ) : (
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                style={{
                  background: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
                  color: '#374151',
                  padding: '12px 20px',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  border: '2px solid white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                やり直す
              </button>
              {currentMission?.type === "quiz" ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentMission && selectedChoice !== null) {
                      handleQuizAnswer(selectedChoice);
                    }
                  }}
                  disabled={isExecuting || selectedChoice === null || executionResult !== null}
                  style={{
                    background: (isExecuting || selectedChoice === null || executionResult !== null) ? '#9ca3af' : 'linear-gradient(to right, #86efac, #34d399)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    border: '2px solid white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    opacity: (isExecuting || selectedChoice === null || executionResult !== null) ? 0.5 : 1,
                  }}
                >
                  {isExecuting ? "実行中..." : "確認する 🎯"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={isExecuting}
                  style={{
                    background: isExecuting ? '#9ca3af' : 'linear-gradient(to right, #86efac, #34d399)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    border: '2px solid white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    opacity: isExecuting ? 0.5 : 1,
                  }}
                >
                  {isExecuting ? "実行中..." : "確認する 🎯"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

