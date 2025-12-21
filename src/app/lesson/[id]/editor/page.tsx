"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { lessons } from "@/data/lessons";
import { getLessonMissions, getMission } from "@/data/missions";
import { getTutorial } from "@/data/tutorials";
import { WordBlock } from "@/types";
import { 
  getProgress, 
  addXP, 
  calculateMissionXP, 
  updateStreak, 
  resetStreak,
  getLevelInfo,
  getLevelProgress
} from "@/utils/progress";
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
import { playBlockAddSound, playBlockRemoveSound } from "@/utils/sounds";

type EditorPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// スペースを追加すべきか判定
function shouldAddSpace(current: WordBlock, next: WordBlock): boolean {
  // 改行ブロックの後にはスペース不要
  if (current.text === "↵") {
    return false;
  }
  // 改行ブロックの前にはスペース不要
  if (next.text === "↵") {
    return false;
  }
  // 括弧や演算子の前後にはスペース不要
  if (current.text === "(" || next.text === ")" || next.text === "(") {
    return false;
  }
  if (current.text === ")") {
    return false;
  }
  // 引用符の前後にはスペース不要
  if (current.text === '"' || next.text === '"') {
    return false;
  }
  // 演算子の前後にはスペース不要
  if (["=", ">=", ":", "(", ")", '"'].includes(current.text)) {
    return false;
  }
  if (["=", ">=", ":", "(", ")", '"'].includes(next.text)) {
    return false;
  }
  // 文字列の後にはスペース不要（次の文字列や演算子が来る場合）
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
      // インデント（4スペース）
      code += "    ";
    } else {
      code += block.text;
    }

    // スペースを追加（特定の条件で）
    // ただし、現在のブロックまたは次のブロックが改行を含む場合は追加しない
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

// 期待されるコードを取得
function getExpectedCode(lessonId: string): string {
  if (lessonId === "1-1") return 'print("Hello World")';
  if (lessonId === "1-2") return 'print(123)';
  if (lessonId === "1-3") return 'print(1 + 2)';
  if (lessonId === "2-1") return 'name = "Yuki"\nprint(name)';
  if (lessonId === "3-1") return 'if age >= 10:\n    print("10歳以上です")';
  return "";
}

// APIを呼び出してPythonコードを実行
async function executePythonCode(
  code: string
): Promise<{ output: string | null; error: string | null }> {
  try {
    const response = await fetch("http://localhost:8000/api/execute", {
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
      className="inline-block relative touch-none"
    >
      {/* メインブロック（ドラッグ用） */}
      <div
        {...attributes}
        {...listeners}
        className={`${block.color} text-gray-700 px-3 py-2 rounded-xl text-sm font-mono shadow-md hover:shadow-lg transition-all border-2 border-white cursor-grab active:cursor-grabbing select-none`}
      >
        {block.text}
      </div>
      
      {/* 削除ボタン */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute -top-1 -right-1 bg-red-400 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md hover:shadow-lg transition-all border-2 border-white z-10"
        type="button"
      >
        ×
      </button>
    </div>
  );
}

export default function LessonEditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [currentMissionId, setCurrentMissionId] = useState(1);
  const [selectedBlocks, setSelectedBlocks] = useState<WordBlock[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [executionResult, setExecutionResult] = useState<ExecutionResult>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [earnedXP, setEarnedXP] = useState<number | null>(null);
  const [streakBonus, setStreakBonus] = useState(0);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [levelInfo, setLevelInfo] = useState(getLevelInfo(0));
  const [levelProgress, setLevelProgress] = useState(0);
  const [wrongMissionIds, setWrongMissionIds] = useState<number[]>([]);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [retryIndex, setRetryIndex] = useState(0);
  const wrongMissionIdsRef = useRef<number[]>([]);

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

  useEffect(() => {
    params.then((p) => {
      const id = p.id;
      if (id) {
        setLessonId(id);
        
        // ローカルストレージから保存されたミッションIDを読み込む
        const savedMissionId = localStorage.getItem(`lesson-${id}-mission`);
        let missionId = savedMissionId ? parseInt(savedMissionId, 10) : 1;
        
        // ミッションIDが有効かチェック
        const missions = getLessonMissions(id);
        if (missions) {
          const maxMissionId = missions.length;
          if (missionId < 1 || missionId > maxMissionId) {
            missionId = 1;
          }
        } else {
          missionId = 1;
        }
        
        setCurrentMissionId(missionId);
        setSelectedBlocks([]);
        setExecutionResult(null);
        setImageError(false);
      }
    });
  }, [params]);

  useEffect(() => {
    const progress = getProgress();
    setCurrentStreak(progress.currentStreak);
    setTotalXP(progress.totalXP);
    setLevelInfo(getLevelInfo(progress.totalXP));
    setLevelProgress(getLevelProgress(progress.totalXP));
  }, []);

  useEffect(() => {
    wrongMissionIdsRef.current = wrongMissionIds;
  }, [wrongMissionIds]);

  const lesson = lessonId ? lessons.find((l) => l.id === lessonId) : undefined;
  const missions = lessonId ? getLessonMissions(lessonId) : undefined;
  
  // 現在のミッションを取得
  const currentMission = useMemo(() => {
    if (!missions) return undefined;
    
    if (isRetryMode) {
      // 再出題モード：間違えた問題から出題
      const retryMissionId = wrongMissionIds[retryIndex];
      return missions.find(m => m.id === retryMissionId) || undefined;
    } else {
      // 通常モード：順番に出題
      return missions.find(m => m.id === currentMissionId) || undefined;
    }
  }, [missions, currentMissionId, isRetryMode, wrongMissionIds, retryIndex]);
  
  const tutorial = lessonId ? getTutorial(lessonId) : undefined;
  
  // ブロックをランダムに並べ替える
  const availableBlocks = useMemo(() => {
    if (!currentMission?.availableBlocks) return [];
    // 配列をコピーしてランダムに並べ替え
    const shuffled = [...currentMission.availableBlocks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [currentMission?.availableBlocks, currentMissionId]);

  // 単語ブロックを選択
  const selectBlock = (block: WordBlock) => {
    setSelectedBlocks([...selectedBlocks, block]);
    playBlockAddSound(); // ブロック配置時のSE
  };

  // 単語ブロックを削除
  const removeBlock = (index: number) => {
    setSelectedBlocks(selectedBlocks.filter((_, i) => i !== index));
    playBlockRemoveSound(); // ブロック削除時のSE
  };

  // ドラッグ終了時のハンドラ
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
  };

  // ミッション変更時にリセットと保存
  useEffect(() => {
    setSelectedBlocks([]);
    setGeneratedCode("");
    setExecutionResult(null);
    
    // ミッションIDをローカルストレージに保存
    if (lessonId) {
      localStorage.setItem(`lesson-${lessonId}-mission`, currentMissionId.toString());
    }
  }, [currentMissionId, lessonId]);

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
      const { output, error } = await executePythonCode(code);
      if (error) {
        setExecutionResult({
          success: false,
          error: `エラー: ${error}`,
        });
        setIsExecuting(false);
        return;
      }

      const actualOutput = output || "";
      const expectedOutput = currentMission?.expectedOutput || "";

      // スペースを保持したまま、前後の空白と末尾の改行のみ除去
      const normalizedActual = actualOutput.trim();
      const normalizedExpected = expectedOutput.trim();

      // 出力結果の比較
      const outputMatches = normalizedActual === normalizedExpected;

      // レッスン1-4（文字列連結）の場合、「+」を使っているかもチェック
      let codeIsValid = true;
      if (lessonId === "1-4") {
        // 生成されたコードに「+」が含まれているか確認
        if (!code.includes("+")) {
          codeIsValid = false;
        }
      }

      // 両方の条件を満たした場合のみ正解
      if (outputMatches && codeIsValid) {
        // 正解時の表示を更新
        setExecutionResult({
          success: true,
          output: actualOutput,
        });

        // XP計算（再出題モードでなければXPを加算）
        if (!isRetryMode) {
          const { xp, streakBonus: bonus, newStreak } = calculateMissionXP(true, currentStreak);
          setCurrentStreak(newStreak);
          setEarnedXP(xp);
          setStreakBonus(bonus);
          setShowXPAnimation(true);
          updateStreak(newStreak);

          // XPを加算
          const { newTotal, leveledUp, newLevel } = addXP(xp);
          setTotalXP(newTotal);
          setLevelInfo(newLevel);
          setLevelProgress(getLevelProgress(newTotal));

          // アニメーション後にリセット
          setTimeout(() => {
            setShowXPAnimation(false);
            setEarnedXP(null);
            setStreakBonus(0);
          }, 1500);
        }

        // 次の問題へ進む処理
        setTimeout(() => {
          setExecutionResult(null);
          setSelectedBlocks([]);
          
          if (isRetryMode) {
            // 再出題モード
            if (retryIndex + 1 < wrongMissionIdsRef.current.length) {
              // 次の間違えた問題へ
              setRetryIndex(retryIndex + 1);
            } else {
              // 全ての再出題が完了 → 完了画面へ
              if (lessonId) {
                localStorage.removeItem(`lesson-${lessonId}-mission`);
              }
              router.push(`/lesson/${lessonId}/complete`);
            }
          } else {
            // 通常モード
            if (currentMissionId < (missions?.length || 0)) {
              // 次の問題へ
              const nextMissionId = currentMissionId + 1;
              setCurrentMissionId(nextMissionId);
              // 次のミッションIDを保存
              if (lessonId) {
                localStorage.setItem(`lesson-${lessonId}-mission`, nextMissionId.toString());
              }
            } else {
              // 全問終了 - 少し待ってから最新のwrongMissionIdsを確認
              setTimeout(() => {
                if (wrongMissionIdsRef.current.length > 0) {
                  // 間違えた問題がある → 再出題モードへ
                  setIsRetryMode(true);
                  setRetryIndex(0);
                } else {
                  // 全問正解 → 完了画面へ
                  if (lessonId) {
                    localStorage.removeItem(`lesson-${lessonId}-mission`);
                  }
                  router.push(`/lesson/${lessonId}/complete`);
                }
              }, 100);
            }
          }
        }, 2000);
      } else {
        // 不正解
        let errorMessage = "期待される出力と異なります。もう一度試してみましょう！";
        if (!codeIsValid) {
          errorMessage = "「+」を使って文字列をつなげてね！";
        }
        setExecutionResult({
          success: false,
          output: actualOutput,
          error: errorMessage,
        });
        
        // 間違えた問題を記録（まだ記録されていなければ、通常モードのみ）
        if (!isRetryMode && currentMission && !wrongMissionIds.includes(currentMission.id)) {
          setWrongMissionIds(prev => [...prev, currentMission.id]);
        }
        
        setCurrentStreak(0);
        resetStreak();
      }
    } catch (error) {
      setExecutionResult({
        success: false,
        error: `実行中にエラーが発生しました: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!lessonId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-blue-800">読み込み中...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">エラー</h2>
            <p className="text-red-700 mb-4">
              レッスンが見つかりません（ID: {lessonId}）
            </p>
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

  if (!missions || !currentMission) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-2 md:p-4">
      {showXPAnimation && earnedXP !== null && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div className="bg-yellow-400 text-white px-6 py-3 rounded-full text-2xl font-bold shadow-lg">
            +{earnedXP} XP
            {streakBonus > 0 && (
              <span className="ml-2 text-green-200">(+{streakBonus}ボーナス)</span>
            )}
          </div>
        </div>
      )}
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

        {/* XPとレベル表示（コンパクト版） */}
        <div className="flex items-center justify-between bg-white rounded-xl p-2 shadow border border-yellow-200 mb-2">
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
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            {isRetryMode ? (
              <>
                <span className="text-sm font-bold text-orange-600">
                  🔄 <FW word="復習" /> {retryIndex + 1}/{wrongMissionIds.length}
                </span>
                <span className="text-xs text-orange-500">間違えた問題をもう一度！</span>
              </>
            ) : (
              <>
                <span className="text-sm font-bold text-gray-700">
                  ミッション {currentMissionId}/{missions?.length || 0}
                </span>
                <span className="text-xs text-gray-500">
                  残り {(missions?.length || 0) - currentMissionId} 問
                </span>
              </>
            )}
          </div>
          <div className="flex gap-1">
            {isRetryMode ? (
              // 再出題モードの進捗バー
              wrongMissionIds.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full ${
                    index < retryIndex
                      ? "bg-green-400"
                      : index === retryIndex
                      ? "bg-orange-400"
                      : "bg-gray-300"
                  }`}
                />
              ))
            ) : (
              // 通常モードの進捗バー
              missions?.map((mission, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full ${
                    index < currentMissionId - 1
                      ? wrongMissionIds.includes(mission.id)
                        ? "bg-orange-400"
                        : "bg-green-400"
                      : index === currentMissionId - 1
                      ? "bg-purple-400"
                      : "bg-gray-300"
                  }`}
                />
              ))
            )}
          </div>
        </div>

        {/* ミッション内容（コンパクト版） */}
        <div className="bg-white rounded-xl shadow p-3 mb-2 border border-blue-200">
          <div className="flex items-start gap-3">
            {/* キャラクター（小さく） */}
            {tutorial && (
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                {tutorial.characterImage && !imageError ? (
                  <Image
                    src={tutorial.characterImage}
                    alt={tutorial.characterName}
                    width={96}
                    height={96}
                    className="object-contain"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-4xl">{tutorial.characterEmoji}</span>
                )}
              </div>
            )}
            
            {/* 説明 */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 mb-1"><FuriganaText text={currentMission.description} /></p>
              <div className="bg-gray-800 rounded-lg p-2">
                <p className="text-xs text-gray-400 mb-1"><F reading="きたい">期待</F>される<F reading="しゅつりょく">出力</F>:</p>
                <pre className="text-green-400 font-mono text-sm">{currentMission.expectedOutput}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* 回答エリア */}
        <div className="mb-3">
          <h3 className="text-sm font-bold mb-1 text-gray-700">あなたの<F reading="こた">答</F>え</h3>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-3 min-h-[60px]">
            {selectedBlocks.length === 0 ? (
              <p className="text-gray-400 text-center py-2 text-sm"><F reading="たんご">単語</F>を<F reading="えら">選</F>んでください</p>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={selectedBlocks.map((_, i) => `block-${i}`)} strategy={horizontalListSortingStrategy}>
                  <div className="flex flex-col gap-1">
                    {(() => {
                      const lines: { blocks: { block: typeof selectedBlocks[0]; index: number }[] }[] = [];
                      let currentLine: { block: typeof selectedBlocks[0]; index: number }[] = [];
                      
                      selectedBlocks.forEach((block, index) => {
                        if (block.text === "↵") {
                          if (currentLine.length > 0) {
                            lines.push({ blocks: currentLine });
                            currentLine = [];
                          }
                          lines.push({ blocks: [{ block, index }] });
                        } else {
                          currentLine.push({ block, index });
                        }
                      });
                      
                      if (currentLine.length > 0) {
                        lines.push({ blocks: currentLine });
                      }
                      
                      return lines.map((line, lineIndex) => (
                        <div key={`line-${lineIndex}`} className="flex flex-wrap gap-1 items-center">
                          {line.blocks.map(({ block, index }) => (
                            <DraggableBlock
                              key={`block-${index}`}
                              block={block}
                              index={index}
                              onRemove={removeBlock}
                            />
                          ))}
                        </div>
                      ));
                    })()}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* 単語選択 */}
        <div className="mb-3">
          <h3 className="text-sm font-bold mb-1 text-gray-700"><F reading="たんご">単語</F>を<F reading="えら">選</F>んでね</h3>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3">
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
          <div className="p-2 border-b">
            {executionResult.success ? (
              <div className="bg-green-100 border-2 border-green-500 rounded-xl p-2 flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <div className="flex-1">
                  <p className="text-green-800 font-bold text-sm"><FW word="正解" />！</p>
                  <p className="text-green-700 text-xs">出力: {executionResult.output}</p>
                </div>
                <p className="text-green-600 font-bold text-xs">
                  {currentMissionId < (missions?.length || 0) ? "次へ..." : <>🎊 <FW word="完了" />！</>}
                </p>
              </div>
            ) : (
              <div className="bg-red-100 border-2 border-red-500 rounded-xl p-2 flex items-center gap-2">
                <span className="text-xl">🤔</span>
                <div>
                  <p className="text-red-800 font-bold text-sm">もう一度！</p>
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
              {isExecuting ? <><F reading="じっこう">実行</F><F reading="ちゅう">中</F>...</> : <><FW word="確認" />する 🎯</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
