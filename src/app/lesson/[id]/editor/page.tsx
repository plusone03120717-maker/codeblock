"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { lessons } from "@/data/lessons";
import { getLessonMissions, getMission } from "@/data/missions";
import { getTutorial } from "@/data/tutorials";
import { WordBlock } from "@/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
function getExpectedCode(lessonId: number): string {
  if (lessonId === 1) return 'print("Hello World")';
  if (lessonId === 2) return 'name = "Yuki"\nprint(name)';
  if (lessonId === 3) return 'if age >= 10:\n    print("10歳以上です")';
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
      className="inline-block relative"
    >
      {/* メインブロック（ドラッグ用） */}
      <div
        {...attributes}
        {...listeners}
        className={`${block.color} text-gray-700 px-5 py-3 rounded-2xl text-lg font-mono shadow-md hover:shadow-lg transition-all border-2 border-white cursor-grab active:cursor-grabbing select-none`}
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
        className="absolute -top-2 -right-2 bg-red-400 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-md hover:shadow-lg transition-all border-2 border-white z-10"
        type="button"
      >
        ×
      </button>
    </div>
  );
}

export default function LessonEditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [currentMissionId, setCurrentMissionId] = useState(1);
  const [selectedBlocks, setSelectedBlocks] = useState<WordBlock[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [executionResult, setExecutionResult] = useState<ExecutionResult>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    params.then((p) => {
      const id = parseInt(p.id, 10);
      if (!isNaN(id)) {
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

  const lesson = lessonId ? lessons.find((l) => l.id === lessonId) : undefined;
  const missions = lessonId ? getLessonMissions(lessonId) : undefined;
  const currentMission = lessonId
    ? getMission(lessonId, currentMissionId)
    : undefined;
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
  };

  // 単語ブロックを削除
  const removeBlock = (index: number) => {
    setSelectedBlocks(selectedBlocks.filter((_, i) => i !== index));
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

      // 出力を比較（改行を正規化）
      const normalizedActual = actualOutput.trim();
      const normalizedExpected = expectedOutput.trim();

      if (normalizedActual === normalizedExpected) {
        // 正解時の表示を更新
        setExecutionResult({
          success: true,
          output: actualOutput,
        });

        // 次のミッションまたはレッスン完了
        if (currentMissionId < (missions?.length || 0)) {
          // 次のミッションへ
          const nextMissionId = currentMissionId + 1;
          setTimeout(() => {
            setCurrentMissionId(nextMissionId);
            setSelectedBlocks([]);
            setExecutionResult(null);
            // 次のミッションIDを保存
            if (lessonId) {
              localStorage.setItem(`lesson-${lessonId}-mission`, nextMissionId.toString());
            }
          }, 2000);
        } else {
          // 全ミッション完了 - 進捗をクリア
          setTimeout(() => {
            if (lessonId) {
              localStorage.removeItem(`lesson-${lessonId}-mission`);
            }
            router.push("/");
          }, 2000);
        }
      } else {
        // 不正解
        setExecutionResult({
          success: false,
          output: actualOutput,
          error: "期待される出力と異なります。もう一度試してみましょう！",
        });
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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* ホームに戻るボタン（左上） */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            ホームに戻る
          </Link>
        </div>

        {/* 進捗バー */}
        <div className="mb-8">
          <Link
            href={`/lesson/${lessonId}`}
            className="inline-block text-blue-600 hover:text-blue-800 mb-4"
          >
            ← レッスン詳細に戻る
          </Link>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-800">
              ミッション {currentMissionId} / {missions.length}
            </h2>
            <span className="text-sm text-gray-600">
              残り {missions.length - currentMissionId} 問
            </span>
          </div>
          <div className="flex gap-1">
            {missions.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-3 rounded-full transition-all ${
                  index < currentMissionId - 1
                    ? "bg-green-400"
                    : index === currentMissionId - 1
                    ? "bg-purple-400"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ミッション内容 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue-200">
          {/* キャラクターとメッセージ */}
          {tutorial && (
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* キャラクター画像 */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-purple-200 relative overflow-hidden">
                  {tutorial.characterImage && !imageError ? (
                    <Image
                      src={tutorial.characterImage}
                      alt={tutorial.characterName}
                      width={128}
                      height={128}
                      className="object-contain"
                      onError={() => {
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <span className="text-5xl md:text-6xl">{tutorial.characterEmoji}</span>
                  )}
                </div>
                <p className="text-center mt-2 font-bold text-gray-700 text-sm">
                  {tutorial.characterName}
                </p>
              </div>
              
              {/* 吹き出し */}
              <div className="flex-1 relative">
                <div className="bg-blue-100 rounded-3xl p-4 md:p-6 shadow-lg border-2 border-blue-200 relative">
                  {/* 三角形（吹き出しの矢印） */}
                  <div className="absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2 hidden md:block">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-blue-100 border-b-8 border-b-transparent"></div>
                  </div>
                  
                  <p className="text-base md:text-lg text-gray-800">
                    {currentMission.description}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <h3 className="text-3xl font-bold text-blue-900 mb-4">
            {currentMission.title}
          </h3>

          <h4 className="text-xl font-bold text-gray-800 mb-3">
            【期待される出力】
          </h4>
          <div className="bg-gray-900 rounded-lg p-4">
            <pre className="text-green-400 font-mono text-lg whitespace-pre-wrap">
              {currentMission.expectedOutput}
            </pre>
          </div>
        </div>

        {/* セクション2: 回答エリア */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">あなたの答え</h3>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 min-h-[150px] shadow-inner">
            {selectedBlocks.length === 0 ? (
              <p className="text-gray-400 text-center py-8 text-lg">
                単語を選んでください
              </p>
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
                  <div className="flex flex-col gap-2">
                    {(() => {
                      // 改行ブロックで分割して行ごとに表示
                      const lines: { blocks: { block: WordBlock; index: number }[] }[] = [];
                      let currentLine: { block: WordBlock; index: number }[] = [];
                      
                      selectedBlocks.forEach((block, index) => {
                        if (block.text === "↵") {
                          // 現在の行を保存
                          if (currentLine.length > 0) {
                            lines.push({ blocks: currentLine });
                            currentLine = [];
                          }
                          // 改行ブロック自体も行として追加
                          lines.push({ blocks: [{ block, index }] });
                        } else {
                          currentLine.push({ block, index });
                        }
                      });
                      
                      // 最後の行を追加
                      if (currentLine.length > 0) {
                        lines.push({ blocks: currentLine });
                      }
                      
                      return lines.map((line, lineIndex) => (
                        <div key={`line-${lineIndex}`} className="flex flex-wrap gap-2 items-center">
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

        {/* セクション3: 単語選択エリア */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            単語を選んでください
          </h3>
          <div className="flex flex-wrap gap-3">
            {availableBlocks.map((block) => (
              <button
                key={block.id}
                type="button"
                onClick={() => selectBlock(block)}
                className={`${block.color} text-gray-700 px-6 py-4 rounded-2xl text-lg font-mono shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-white`}
              >
                {block.text}
              </button>
            ))}
          </div>
        </div>

        {/* 生成されたコードセクション */}
        {generatedCode && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              生成されたコード
            </h3>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 shadow-lg border-2 border-purple-300">
              <pre className="text-green-300 font-mono text-lg overflow-x-auto">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>
        )}

        {/* 実行結果セクション */}
        {executionResult && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">実行結果</h3>
            {executionResult.success ? (
              <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-6">
                <p className="text-green-800 text-2xl font-bold mb-2">
                  ✓ 正解です！🎉
                </p>
                <p className="text-green-700 text-lg">
                  出力: {executionResult.output}
                </p>
                <p className="text-green-600 mt-2">
                  {currentMissionId < missions.length
                    ? "次のミッションに進みます..."
                    : "レッスン完了！ホームに戻ります..."}
                </p>
              </div>
            ) : (
              <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-6">
                <p className="text-red-800 text-2xl font-bold mb-2">
                  もう一度試してみましょう！
                </p>
                {executionResult.output && (
                  <p className="text-red-700 text-lg">
                    あなたの出力: {executionResult.output}
                  </p>
                )}
                {executionResult.error && (
                  <p className="text-red-700">{executionResult.error}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ボタンエリア */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all border-2 border-white"
          >
            やり直す
          </button>
          <button
            type="button"
            onClick={handleCheck}
            disabled={isExecuting}
            className="bg-gradient-to-r from-green-300 to-emerald-400 hover:from-green-400 hover:to-emerald-500 text-white px-12 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-all border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? "実行中..." : "確認する 🎯"}
          </button>
        </div>
      </div>
    </div>
  );
}
