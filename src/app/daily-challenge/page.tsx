"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DailyChallengeState } from "@/types/dailyChallenge";
import { getMission } from "@/data/missions";
import { getCharacterByUnit } from "@/data/characterProfiles";
import { WordBlock } from "@/types";
import {
  getDailyChallengeState,
  generateNewDailyChallenge,
  answerDailyChallengeQuestion,
} from "@/utils/dailyChallengeStorage";
import { 
  getProgress, 
  getLevelInfo,
  getLevelProgress,
} from "@/utils/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useFurigana } from "@/contexts/FuriganaContext";
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
  if (current.text === "↵") {
    return false;
  }
  if (next.text === "↵") {
    return false;
  }
  if (current.text === "(" || next.text === ")" || next.text === "(") {
    return false;
  }
  if (current.text === ")") {
    return false;
  }
  if (current.text === '"' || next.text === '"') {
    return false;
  }
  if (["=", ">=", ":", "(", ")", '"'].includes(current.text)) {
    return false;
  }
  if (["=", ">=", ":", "(", ")", '"'].includes(next.text)) {
    return false;
  }
  if (current.type === "string" && (next.type === "string" || next.type === "operator")) {
    return false;
  }
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

// APIを呼び出してPythonコードを実行
async function executePythonCode(
  code: string
): Promise<{ output: string | null; error: string | null }> {
  try {
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const isProduction = typeof window !== 'undefined' && (
      window.location.hostname === 'codeblock.jp' || 
      window.location.hostname === 'www.codeblock.jp'
    );
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

export default function DailyChallengePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { furiganaEnabled, toggleFurigana } = useFurigana();
  const [state, setState] = useState<DailyChallengeState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMission, setCurrentMission] = useState<any>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<WordBlock[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [executionResult, setExecutionResult] = useState<ExecutionResult>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [levelInfo, setLevelInfo] = useState(getLevelInfo(0));
  const [levelProgress, setLevelProgress] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const handleCheckRef = useRef<(() => Promise<void>) | undefined>(undefined);

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

  // 初期化
  useEffect(() => {
    if (!loading && user) {
      initializeChallenge();
    }
  }, [loading, user]);

  const initializeChallenge = () => {
    let challengeState = getDailyChallengeState();
    
    if (!challengeState) {
      const progressStr = localStorage.getItem('codeblock-progress');
      const userProgress = progressStr ? JSON.parse(progressStr).completedLessons?.reduce((acc: Record<string, boolean>, id: string) => {
        acc[id] = true;
        return acc;
      }, {}) : null;
      
      challengeState = generateNewDailyChallenge(userProgress);
    }
    
    if (challengeState.completed) {
      router.push('/daily-challenge/complete');
      return;
    }
    
    setState(challengeState);
    loadCurrentMission(challengeState);
    setIsLoading(false);
  };
  
  const loadCurrentMission = (challengeState: DailyChallengeState) => {
    const currentQ = challengeState.questions[challengeState.currentQuestion];
    const parts = currentQ.missionId.split('-');
    const lessonId = `${parts[0]}-${parts[1]}`;
    const missionId = parseInt(parts[2] || parts[1]);
    
    const mission = getMission(lessonId, missionId);
    
    if (!mission) {
      console.error('Mission not found:', currentQ.missionId, 'lessonId:', lessonId, 'missionId:', missionId);
    } else {
      setCurrentMission(mission);
    }
    
    setSelectedBlocks([]);
    setGeneratedCode("");
    setExecutionResult(null);
    setImageError(false);
    setShowNextButton(false);
  };

  useEffect(() => {
    const progress = getProgress();
    setCurrentStreak(progress.currentStreak);
    setTotalXP(progress.totalXP);
    setLevelInfo(getLevelInfo(progress.totalXP));
    setLevelProgress(getLevelProgress(progress.totalXP));
  }, []);

  // ブロックをランダムに並べ替える（重複除去）
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
  }, [currentMission?.availableBlocks]);

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

  // ローディング中または未ログイン時の表示
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-purple-600">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

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

  // リセット
  const reset = () => {
    setSelectedBlocks([]);
    setGeneratedCode("");
    setExecutionResult(null);
    setShowNextButton(false);
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
      let codeToExecute = code;
      if (currentMission?.prefixCode) {
        codeToExecute = currentMission.prefixCode + "\n" + code;
      }
      const { output, error } = await executePythonCode(codeToExecute);
      
      if (error) {
        setExecutionResult({
          success: false,
          error: `エラー: ${error}`,
        });
        playIncorrectSound();
        setIsExecuting(false);
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
        setShowNextButton(true);
      } else {
        setExecutionResult({
          success: false,
          output: actualOutput,
          error: "期待される出力と異なります。もう一度試してみましょう！",
        });
        
        playIncorrectSound();
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

  // 次の問題へ
  const handleNext = () => {
    if (!state || executionResult?.success !== true) return;
    
    const updatedState = answerDailyChallengeQuestion(
      state,
      state.currentQuestion,
      true
    );
    
    setState(updatedState);
    
    if (updatedState.completed) {
      router.push('/daily-challenge/complete');
    } else {
      loadCurrentMission(updatedState);
    }
  };

  // handleCheckをrefに保存
  useEffect(() => {
    handleCheckRef.current = handleCheck;
  }, [handleCheck]);

  // Enterキーで「確認する」または「次へ」を実行
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        
        if (showNextButton) {
          handleNext();
        } else {
          if (!isExecuting) {
            handleCheckRef.current?.();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNextButton, isExecuting]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-blue-800">読み込み中...</div>
      </div>
    );
  }

  if (!state || !currentMission) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">エラー</h2>
            <p className="text-red-700 mb-4">ミッションが見つかりません</p>
            <button
              onClick={() => router.push("/")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full font-bold"
            >
              ← ホームに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = state.questions[state.currentQuestion];
  const character = getCharacterByUnit(currentQ.unitId);
  const progressPercent = ((state.currentQuestion) / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-2 md:p-4">
      <div className="max-w-5xl mx-auto">
        {/* ホームボタン */}
        <div className="mb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors text-base bg-white hover:bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            ホーム
          </Link>
        </div>

        {/* XPとレベル表示（コンパクト版） */}
        <div className="flex items-center justify-between bg-white rounded-xl p-2 shadow border border-yellow-200 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <span className="font-bold text-yellow-600 text-sm">Lv.{levelInfo.level}</span>
            <span className="text-yellow-500 text-sm">{totalXP} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all"
                style={{ width: `${levelProgress * 100}%` }}
              />
            </div>
            {currentStreak > 0 && (
              <span className="text-orange-500 font-bold text-sm">🔥{currentStreak}</span>
            )}
          </div>
        </div>

        {/* 進捗バー（コンパクト版） */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-gray-700">
              🎯 デイリーチャレンジ {state.currentQuestion + 1}/3
            </span>
            <span className="text-xs text-gray-500">
              残り {3 - (state.currentQuestion + 1)} 問
            </span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index < state.currentQuestion
                    ? "bg-green-400"
                    : index === state.currentQuestion
                    ? "bg-purple-400"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ミッション内容（コンパクト版） */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5 mb-3 border-2 border-blue-300">
          <div className="flex items-start gap-4">
            {/* キャラクター */}
            {character && (
              <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-purple-400 shadow-lg overflow-hidden">
                {character.image && !imageError ? (
                  <Image
                    src={character.image}
                    alt={character.name}
                    width={128}
                    height={128}
                    className="object-contain"
                    unoptimized
                    onError={() => {
                      console.error("画像の読み込みエラー:", character.image);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <span className="text-4xl md:text-5xl">🤖</span>
                )}
              </div>
            )}
            
            {/* 説明 */}
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
              {/* 期待される出力 */}
              {!currentMission?.hideExpectedOutput && (
                <div className="bg-gray-800 rounded-lg p-2 mt-3">
                  <p className="text-xs text-gray-400 mb-1"><F reading="きたい">期待</F>される<F reading="しゅつりょく">出力</F>:</p>
                  <pre className="text-green-400 font-mono text-sm">
                    {currentMission.expectedOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 回答エリア */}
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2 text-gray-700">あなたの<F reading="こた">答</F>え</h3>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-4 min-h-[60px]">
            {selectedBlocks.length === 0 ? (
              <p className="text-gray-400 text-center py-2 text-sm"><F reading="たんご">単語</F>を<F reading="えら">選</F>んでください</p>
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

        {/* 単語選択 */}
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2 text-gray-700"><F reading="たんご">単語</F>を<F reading="えら">選</F>んでね</h3>
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

        {/* 固定ボタン分の余白 */}
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
        {/* 実行結果 */}
        {executionResult && (
          <div className="p-3 border-b">
            {executionResult.success ? (
              <div>
                <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-3 flex items-center gap-3">
                  <span className="text-xl">🎉</span>
                  <div className="flex-1">
                    <p className="text-green-800 font-bold text-sm"><FW word="正解" />！</p>
                    <p className="text-green-700 text-xs">出力: {executionResult.output}</p>
                  </div>
                </div>
                {currentMission?.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-blue-800 text-sm">💡 {currentMission.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-3 flex items-center gap-3">
                <span className="text-xl">🤔</span>
                <div className="flex-1">
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
        
        {/* ボタン */}
        <div className="p-3">
          {showNextButton ? (
            // 正解時：「次へ」ボタンを表示
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleNext}
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
                {state.currentQuestion < 2 ? "次へ →" : "🎊 完了！"}
              </button>
            </div>
          ) : (
            // 通常時：「やり直す」と「確認する」ボタンを表示
            <div className="flex justify-center items-center gap-3">
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
              <button
                type="button"
                onClick={handleCheck}
                disabled={isExecuting}
                style={{
                  background: isExecuting ? '#9ca3af' : 'linear-gradient(to right, #a855f7, #6366f1)',
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
                {isExecuting ? <><F reading="じっこう">実行</F><F reading="ちゅう">中</F>...</> : <><FW word="確認" />する</>}
              </button>
              <button
                type="button"
                onClick={toggleFurigana}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  furiganaEnabled
                    ? "text-green-600 bg-green-50"
                    : "text-gray-500 hover:text-green-500"
                }`}
              >
                <span className="text-lg">あ</span>
                <span className="text-xs font-bold">
                  {furiganaEnabled ? "ふりがなON" : "ふりがな"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
