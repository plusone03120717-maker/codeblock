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
  getLevelProgress,
  saveLastOpenedMission
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
import { playBlockAddSound, playBlockRemoveSound, playCorrectSound, playIncorrectSound } from "@/utils/sounds";

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

// コードを正規化する関数（省略形を展開形に変換して比較できるようにする）
const normalizeCode = (code: string): string => {
  let normalized = code;
  
  // 各行を処理
  const lines = normalized.split('\n');
  const normalizedLines = lines.map(line => {
    // -= の変換: variable -= value → variable = variable - value
    // 例: count -= 1 → count = count - 1
    line = line.replace(/^(\s*)(\w+)\s*-=\s*(.+)$/gm, '$1$2 = $2 - $3');
    
    // += の変換: variable += value → variable = variable + value
    // 例: total += i → total = total + i
    line = line.replace(/^(\s*)(\w+)\s*\+=\s*(.+)$/gm, '$1$2 = $2 + $3');
    
    // *= の変換: variable *= value → variable = variable * value
    line = line.replace(/^(\s*)(\w+)\s*\*=\s*(.+)$/gm, '$1$2 = $2 * $3');
    
    // /= の変換: variable /= value → variable = variable / value
    line = line.replace(/^(\s*)(\w+)\s*\/=\s*(.+)$/gm, '$1$2 = $2 / $3');
    
    return line;
  });
  
  return normalizedLines.join('\n');
};

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
      className="inline-block relative touch-none group"
    >
      {/* メインブロック（ドラッグ用） */}
      <div
        {...attributes}
        {...listeners}
        className={`${block.color} text-gray-700 px-3 py-2 rounded-xl text-sm font-mono shadow-md hover:shadow-lg transition-all border-2 border-white cursor-grab active:cursor-grabbing select-none ${
          block.text === "    " ? "bg-gray-300 border-gray-400" : ""
        }`}
      >
        {block.text === "    " ? "→" : block.text}
      </div>
      
      {/* 削除ボタン（スマホは常に表示、PCはホバー時のみ表示） */}
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
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const handleCheckRef = useRef<(() => Promise<void>) | undefined>(undefined);
  const goToNextMissionRef = useRef<(() => void) | undefined>(undefined);

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

  // 最後に開いたミッション情報を保存
  useEffect(() => {
    if (lessonId && currentMissionId !== undefined) {
      saveLastOpenedMission(lessonId, currentMissionId);
    }
  }, [lessonId, currentMissionId]);

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

  // チュートリアルが変わったときにも画像エラーをリセット
  useEffect(() => {
    setImageError(false);
  }, [tutorial]);
  
  // ブロックをランダムに並べ替える（重複除去）
  const availableBlocks = useMemo(() => {
    if (!currentMission?.availableBlocks) return [];
    
    // 重複を除去（同じtextを持つブロックは1つだけ残す）
    const uniqueBlocks: WordBlock[] = [];
    const seenTexts = new Set<string>();
    
    for (const block of currentMission.availableBlocks) {
      if (!seenTexts.has(block.text)) {
        seenTexts.add(block.text);
        uniqueBlocks.push(block);
      }
    }
    
    // 配列をランダムに並べ替え
    const shuffled = [...uniqueBlocks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [currentMission?.availableBlocks, currentMissionId]);

  // 現在のインデントレベルを計算する関数
  const getCurrentIndentLevel = (blocks: WordBlock[]): number => {
    if (blocks.length === 0) return 0;
    
    // 最後の改行以降のインデント数を数える
    let lastNewlineIndex = -1;
    for (let i = blocks.length - 1; i >= 0; i--) {
      if (blocks[i].text === "↵") {
        lastNewlineIndex = i;
        break;
      }
    }
    
    // 最後の改行以降のインデント数
    let currentIndent = 0;
    if (lastNewlineIndex >= 0) {
      for (let i = lastNewlineIndex + 1; i < blocks.length; i++) {
        if (blocks[i].text === "    ") {
          currentIndent++;
        } else {
          break; // インデント以外のブロックが来たら終了
        }
      }
    }
    
    // 最後のブロックが「:」なら+1（新しいネストレベル）
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock?.text === ":") {
      currentIndent++;
    }
    
    return currentIndent;
  };

  // インデントブロックを取得（利用可能な場合）
  const getIndentBlock = (): WordBlock | null => {
    if (!availableBlocks) return null;
    return availableBlocks.find(block => block.text === "    ") || null;
  };

  // 単語ブロックを選択
  const selectBlock = (block: WordBlock) => {
    // ブロックのコピーを作成（新しいIDを付与）
    const newBlock: WordBlock = {
      ...block,
      id: `${block.id}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    };
    
    let newBlocks = [...selectedBlocks, newBlock];
    
    // 改行ブロックを追加した場合、インデントブロックが利用可能な場合（if文、for文、while文など）
    if (newBlock.text === "↵") {
      const indentBlock = getIndentBlock();
      // インデントブロックが利用可能な場合のみ自動インデントを有効化
      if (indentBlock) {
        // 現在のインデントレベルを計算
        const indentLevel = getCurrentIndentLevel(selectedBlocks);
        
        // インデントレベル分のインデントブロックを追加
        if (indentLevel > 0) {
          for (let i = 0; i < indentLevel; i++) {
            const newIndentBlock: WordBlock = {
              ...indentBlock,
              id: `${indentBlock.id}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}-${i}`,
            };
            newBlocks.push(newIndentBlock);
          }
        }
      }
    }
    
    setSelectedBlocks(newBlocks);
    playBlockAddSound(); // ブロック配置時のSE
  };

  // 単語ブロックを削除
  const removeBlock = (index: number) => {
    setSelectedBlocks(selectedBlocks.filter((_, i) => i !== index));
    playBlockRemoveSound(); // ブロック削除時のSE
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

  // ミッション変更時にリセットと保存
  useEffect(() => {
    setSelectedBlocks([]);
    setGeneratedCode("");
    setExecutionResult(null);
    setSelectedChoice(null);
    setShowNextButton(false);
    
    // ミッションIDをローカルストレージに保存
    if (lessonId) {
      localStorage.setItem(`lesson-${lessonId}-mission`, currentMissionId.toString());
    }
  }, [currentMissionId, lessonId]);

  // 次の問題へ進む処理（共通関数）
  const goToNextMission = () => {
    setExecutionResult(null);
    setSelectedBlocks([]);
    setSelectedChoice(null);
    setShowNextButton(false);
    
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

      playCorrectSound(); // 正解音を再生

      // XP計算（再出題モードでなければXPを加算）
      if (!isRetryMode) {
        const { xp, streakBonus: bonus, newStreak } = calculateMissionXP(true, currentStreak);
        setCurrentStreak(newStreak);
        setEarnedXP(xp);
        setStreakBonus(bonus);
        setShowXPAnimation(true);
        updateStreak(newStreak);

        const { newTotal, leveledUp, newLevel } = addXP(xp);
        setTotalXP(newTotal);
        setLevelInfo(newLevel);
        setLevelProgress(getLevelProgress(newTotal));

        setTimeout(() => {
          setShowXPAnimation(false);
          setEarnedXP(null);
          setStreakBonus(0);
        }, 1500);
      }

      // 「次へ」ボタンを表示
      setShowNextButton(true);
    } else {
      setExecutionResult({
        success: false,
        output: currentMission.choices?.[choiceIndex] || "",
        error: "残念！もう一度考えてみよう！",
      });
      
      playIncorrectSound(); // 不正解音を再生
      
      // 間違えた問題を記録
      if (!isRetryMode && currentMission && !wrongMissionIds.includes(currentMission.id)) {
        setWrongMissionIds(prev => [...prev, currentMission.id]);
      }
      
      setCurrentStreak(0);
      resetStreak();
      
      // 不正解の場合、少し待ってからリセット
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
      // コードを正規化（省略形を展開形に変換）
      // 注: Pythonは += や -= を正しく解釈するため、実際には正規化は不要ですが、
      // 将来的にコード比較が必要になった場合に備えて正規化を適用
      const normalizedCode = normalizeCode(code);
      
      // コード実行前にprefixCodeを追加
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
        playIncorrectSound(); // 不正解音を再生
        return;
      }

      const actualOutput = output || "";
      const expectedOutput = currentMission?.expectedOutput || "";

      // スペースを保持したまま、前後の空白と末尾の改行のみ除去
      const normalizedActual = actualOutput.trim();
      const normalizedExpected = expectedOutput.trim();

      // 出力結果の比較
      const outputMatches = normalizedActual === normalizedExpected;

      // 特定レッスンでの追加チェック
      let codeIsValid = true;
      let codeErrorMessage = "";

      // レッスン3-1（データ型を知ろう）の場合、正しいデータ型を使っているかチェック
      if (lessonId === "3-1") {
        const missionId = currentMission?.id;
        
        // 問2: 整数42を表示（"42"を使っていたら不正解）
        if (missionId === 2) {
          if (code.includes('"42"') || code.includes("'42'")) {
            codeIsValid = false;
            codeErrorMessage = "整数（int型）の 42 を使ってね！「\"42\"」は文字列だよ！";
          }
        }
        
        // 問3: 真偽値Trueを表示（"True"を使っていたら不正解）
        if (missionId === 3) {
          if (code.includes('"True"') || code.includes("'True'")) {
            codeIsValid = false;
            codeErrorMessage = "真偽値（bool型）の True を使ってね！「\"True\"」は文字列だよ！";
          }
        }
        
        // 問4: 真偽値Falseを表示（"False"を使っていたら不正解）
        if (missionId === 4) {
          if (code.includes('"False"') || code.includes("'False'")) {
            codeIsValid = false;
            codeErrorMessage = "真偽値（bool型）の False を使ってね！「\"False\"」は文字列だよ！";
          }
        }
        
        // 問5: 小数3.14を表示（"3.14"を使っていたら不正解）
        if (missionId === 5) {
          if (code.includes('"3.14"') || code.includes("'3.14'")) {
            codeIsValid = false;
            codeErrorMessage = "小数（float型）の 3.14 を使ってね！「\"3.14\"」は文字列だよ！";
          }
        }
        
        // 問6: 整数100を表示（"100"を使っていたら不正解）
        if (missionId === 6) {
          if (code.includes('"100"') || code.includes("'100'")) {
            codeIsValid = false;
            codeErrorMessage = "整数（int型）の 100 を使ってね！「\"100\"」は文字列だよ！";
          }
        }
      }

      // レッスン3-2（型を調べよう）の場合、type()を使っているかチェック
      if (lessonId === "3-2") {
        if (!code.includes("type(")) {
          codeIsValid = false;
          codeErrorMessage = "type()を使ってデータの型を調べてね！";
        }
      }

      // レッスン3-3（型を変換しよう）の場合、int()/str()/float()のいずれかを使っているかチェック
      if (lessonId === "3-3") {
        // print()を除外してからチェック（"print(" の中に "int(" が含まれるため）
        const codeForCheck = code.replace(/print\s*\(/g, "___PRINT___(");
        console.log("=== レッスン3-3チェック開始 ===");
        console.log("生成されたコード:", code);
        console.log("チェック用コード:", codeForCheck);
        
        const hasIntConversion = codeForCheck.includes("int(");
        const hasStrConversion = codeForCheck.includes("str(");
        const hasFloatConversion = codeForCheck.includes("float(");
        console.log("int()あり:", hasIntConversion, "str()あり:", hasStrConversion, "float()あり:", hasFloatConversion);
        
        if (!hasIntConversion && !hasStrConversion && !hasFloatConversion) {
          console.log("型変換関数なし → 不正解にする");
          codeIsValid = false;
          codeErrorMessage = "int()、str()、float()のどれかを使って型を変換してね！";
        } else {
          console.log("型変換関数あり → OK");
        }
      }

      // レッスン4-1（条件分岐を知ろう）の場合、if文を使っているかチェック
      if (lessonId === "4-1") {
        if (!code.includes("if ")) {
          codeIsValid = false;
          codeErrorMessage = "if文を使って条件分岐を書こう";
        }
      }

      // レッスン4-2（比較演算子を使おう）の場合、比較演算子を使っているかチェック
      if (lessonId === "4-2") {
        // 比較演算子のリスト（<= や >= を先にチェックするため、長いものから順に）
        const comparisonOperators = ["!=", "<=", ">=", "==", "<", ">"];
        const hasComparisonOperator = comparisonOperators.some(op => code.includes(op));
        
        if (!hasComparisonOperator) {
          codeIsValid = false;
          // 「=」が含まれているが「==」ではない場合のメッセージ
          if (code.includes("=") && !code.includes("==")) {
            codeErrorMessage = "「=」ではなく「==」を使って比較しよう！「=」は代入、「==」は比較だよ";
          } else {
            codeErrorMessage = "比較演算子（==, !=, <, >, <=, >=）を使って条件を書こう";
          }
        }
      }

      // レッスン4-4（elifを使おう）の場合、elif, elseを使っているかチェック
      if (lessonId === "4-4") {
        const hasElif = code.includes("elif ");
        const hasElse = code.includes("else:");
        
        if (!hasElif) {
          codeIsValid = false;
          codeErrorMessage = "elifを使って複数の条件を書こう";
        } else if (!hasElse) {
          codeIsValid = false;
          codeErrorMessage = "elseを使ってどれにも当てはまらない場合を書こう";
        } else if (currentMission?.correctCode) {
          // 正解コードが定義されている場合、構造をチェック
          const normalizeCode = (codeStr: string) => {
            return codeStr
              .replace(/\s+/g, " ")
              .replace(/\s*:\s*/g, ":")
              .replace(/\s*\(\s*/g, "(")
              .replace(/\s*\)\s*/g, ")")
              .trim();
          };
          
          const normalizedUserCode = normalizeCode(code);
          const normalizedCorrectCode = normalizeCode(currentMission.correctCode);
          
          // 完全一致チェック
          if (normalizedUserCode !== normalizedCorrectCode) {
            // if/elif/elseの構造を抽出してチェック
            const extractIfElifElseStructure = (codeStr: string) => {
              const structure: Array<{ type: "if" | "elif" | "else"; condition: string | null; print: string }> = [];
              
              // if文を抽出
              const ifMatch = codeStr.match(/if\s+(.+?):/);
              if (ifMatch) {
                const condition = ifMatch[1].trim().replace(/\s+/g, " ");
                const printMatch = codeStr.substring(ifMatch.index || 0).match(/print\s*\(\s*"([^"]+)"\s*\)/);
                structure.push({
                  type: "if",
                  condition: condition,
                  print: printMatch ? printMatch[1] : ""
                });
              }
              
              // elif文を抽出
              const elifMatches = Array.from(codeStr.matchAll(/elif\s+(.+?):/g));
              for (const match of elifMatches) {
                const condition = match[1].trim().replace(/\s+/g, " ");
                const printMatch = codeStr.substring(match.index || 0).match(/print\s*\(\s*"([^"]+)"\s*\)/);
                structure.push({
                  type: "elif",
                  condition: condition,
                  print: printMatch ? printMatch[1] : ""
                });
              }
              
              // else文を抽出
              const elseMatch = codeStr.match(/else\s*:/);
              if (elseMatch) {
                const printMatch = codeStr.substring(elseMatch.index || 0).match(/print\s*\(\s*"([^"]+)"\s*\)/);
                structure.push({
                  type: "else",
                  condition: null,
                  print: printMatch ? printMatch[1] : ""
                });
              }
              
              return structure;
            };
            
            const userStructure = extractIfElifElseStructure(code);
            const correctStructure = extractIfElifElseStructure(currentMission.correctCode);
            
            // 構造の数が一致しているか
            if (userStructure.length !== correctStructure.length) {
              codeIsValid = false;
              codeErrorMessage = "elifとelseの構造が正しくありません。もう一度確認してね！";
            } else {
              // 各ブロックをチェック
              for (let i = 0; i < correctStructure.length; i++) {
                const correct = correctStructure[i];
                const user = userStructure[i];
                
                // タイプが一致しているか
                if (correct.type !== user.type) {
                  codeIsValid = false;
                  codeErrorMessage = `正しい順序でelifとelseを使ってね！`;
                  break;
                }
                
                // 条件が一致しているか（ifとelifの場合）
                if (correct.condition && user.condition) {
                  if (correct.condition !== user.condition) {
                    codeIsValid = false;
                    codeErrorMessage = `条件式が正しくありません。「${correct.condition}」を使ってね！`;
                    break;
                  }
                }
                
                // 出力文字列が一致しているか
                if (correct.print && user.print) {
                  if (correct.print !== user.print) {
                    codeIsValid = false;
                    codeErrorMessage = `出力する文字列が正しくありません。「${correct.print}」を出力してね！`;
                    break;
                  }
                }
              }
            }
          }
        }
      }

      // レッスン4-5（論理演算子を使おう）の場合、and, or, notのいずれかを使っているかチェック
      if (lessonId === "4-5") {
        const hasAnd = code.includes(" and ");
        const hasOr = code.includes(" or ");
        const hasNot = code.includes("not ");
        
        if (!hasAnd && !hasOr && !hasNot) {
          codeIsValid = false;
          codeErrorMessage = "論理演算子（and, or, not）を使って条件を組み合わせよう";
        } else if (currentMission?.correctCode) {
          // 正解コードが定義されている場合、より厳密なチェック
          const normalizeCode = (codeStr: string) => {
            return codeStr
              .replace(/\s+/g, " ")
              .replace(/\s*:\s*/g, ":")
              .replace(/\s*\(\s*/g, "(")
              .replace(/\s*\)\s*/g, ")")
              .trim();
          };
          
          const normalizedUserCode = normalizeCode(code);
          const normalizedCorrectCode = normalizeCode(currentMission.correctCode);
          
          if (normalizedUserCode !== normalizedCorrectCode) {
            const extractCondition = (codeStr: string) => {
              const match = codeStr.match(/if\s+(.+?):/);
              if (!match) return null;
              const condition = match[1].trim();
              
              // and, or, notを検出
              const parts = condition.split(/\s+(and|or)\s+/);
              const hasNotOp = condition.includes("not ");
              
              return {
                op: parts.find(p => p === "and" || p === "or") || (hasNotOp ? "not" : null),
                conditions: parts.filter((_, i) => i % 2 === 0).map(c => c.trim().replace(/^not\s+/, "")).sort()
              };
            };
            
            const userCond = extractCondition(code);
            const correctCond = extractCondition(currentMission.correctCode);
            
            if (userCond && correctCond) {
              if (userCond.op !== correctCond.op) {
                codeIsValid = false;
                const expectedOp = correctCond.op === "and" ? "and" : correctCond.op === "or" ? "or" : "not";
                codeErrorMessage = `正しい論理演算子（${expectedOp}）を使ってね！`;
              } else if (userCond.conditions.join("|") !== correctCond.conditions.join("|")) {
                codeIsValid = false;
                codeErrorMessage = "条件式が正しくありません。もう一度確認してね！";
              }
            } else {
              codeIsValid = false;
              codeErrorMessage = "if文の構造が正しくありません。もう一度確認してね！";
            }
          }
        }
      }

      // レッスン1-4（文字列連結）の場合、「+」を使っているかチェック
      if (lessonId === "1-4") {
        if (!code.includes("+")) {
          codeIsValid = false;
          codeErrorMessage = "「+」を使って文字列をつなげてね！";
        }
      }

      // レッスン1-5（文字列を繰り返そう）の場合、文字列 * 数字のパターンを使っているかチェック
      if (lessonId === "1-5") {
        // 文字列（"..."または'...'）の後に * が来て、その後に数字が来るパターンをチェック
        const hasStringMultiplyPattern = /["'][^"']*["']\s*\*\s*\d+/.test(code) || /\d+\s*\*\s*["'][^"']*["']/.test(code);
        if (!hasStringMultiplyPattern) {
          codeIsValid = false;
          codeErrorMessage = "文字列と「*」と数字を使って文字列を繰り返してね！例: \"Hi\" * 3";
        }
      }

      // レッスン5-1（繰り返しを知ろう）の場合、for文とrange()を使っているかチェック
      if (lessonId === "5-1") {
        const hasFor = code.includes("for ");
        const hasRange = code.includes("range(");
        
        if (!hasFor) {
          codeIsValid = false;
          codeErrorMessage = "for文を使って繰り返しを書こう！";
        } else if (!hasRange) {
          codeIsValid = false;
          codeErrorMessage = "range()を使って繰り返す回数を指定しよう！";
        }
      }

      // レッスン5-5（while文を使おう）の場合、while文を使っているかチェック
      if (lessonId === "5-5") {
        const hasWhile = code.includes("while ");
        
        if (!hasWhile) {
          codeIsValid = false;
          codeErrorMessage = "while文を使って繰り返しを書こう！";
        }
      }

      // レッスン2（変数）の場合、変数を定義してprint内で使っているかチェック
      if (lessonId?.startsWith("2-")) {
        if (!code.includes("=")) {
          codeIsValid = false;
          codeErrorMessage = "変数を使って値を入れてね！「=」を使おう！";
        } else {
          // レッスン2-4（変数の上書き）の場合、=が2回以上使われているかチェック
          if (lessonId === "2-4") {
            const equalsCount = (code.match(/=/g) || []).length;
            if (equalsCount < 2) {
              codeIsValid = false;
              codeErrorMessage = "変数に値を入れた後、もう一度値を入れ直してね！";
            }
          }

          // レッスン2-5（変数同士を組み合わせよう）の場合、=が2回以上使われているかチェック
          if (lessonId === "2-5") {
            const equalsCount = (code.match(/=/g) || []).length;
            if (equalsCount < 2) {
              codeIsValid = false;
              codeErrorMessage = "2つ以上の変数を作って組み合わせてね！";
            }
          }
          
          // 変数名を抽出（= の前にある単語）
          if (codeIsValid) {
            const variableMatch = code.match(/(\w+)\s*=/);
            if (variableMatch) {
              const variableName = variableMatch[1];
              // print()内で変数が使用されているかチェック
              // print(変数名) の形式をチェック（文字列内は除外）
              const printMatches = code.matchAll(/print\s*\([^)]*\)/g);
              let variableUsedInPrint = false;
              for (const printMatch of printMatches) {
                const printContent = printMatch[0];
                // 文字列（"..." または '...'）を除去してから変数名をチェック
                const withoutStrings = printContent.replace(/["'][^"']*["']/g, '');
                if (withoutStrings.includes(variableName)) {
                  variableUsedInPrint = true;
                  break;
                }
              }
              if (!variableUsedInPrint) {
                codeIsValid = false;
                codeErrorMessage = "変数をprint()内で使ってね！";
              }
            }
          }
        }
      }

      // 両方の条件を満たした場合のみ正解
      if (outputMatches && codeIsValid) {
        // 正解時の表示を更新
        setExecutionResult({
          success: true,
          output: actualOutput,
        });

        playCorrectSound(); // 正解音を再生

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

        // 「次へ」ボタンを表示
        setShowNextButton(true);
      } else {
        // 不正解
        let errorMessage = "期待される出力と異なります。もう一度試してみましょう！";
        if (!codeIsValid && codeErrorMessage) {
          errorMessage = codeErrorMessage;
        }
        setExecutionResult({
          success: false,
          output: actualOutput,
          error: errorMessage,
        });
        
        playIncorrectSound(); // 不正解音を再生
        
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
      playIncorrectSound(); // エラー時も不正解音を再生
    } finally {
      setIsExecuting(false);
    }
  };

  // handleCheckとgoToNextMissionをrefに保存
  useEffect(() => {
    handleCheckRef.current = handleCheck;
  }, [handleCheck]);

  useEffect(() => {
    goToNextMissionRef.current = goToNextMission;
  }, [goToNextMission]);

  // Enterキーで「確認する」または「次へ」を実行
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 入力フィールド（input, textarea）内でのEnterキーは無視
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        
        // 現在のフォーカスを外す
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        
        if (showNextButton) {
          // 「次へ」ボタンが表示されている場合は次の問題へ
          goToNextMissionRef.current?.();
        } else {
          // それ以外は「確認する」を実行（ただし、選択式問題の場合は実行しない）
          if (currentMission?.type !== "quiz" && !isExecuting) {
            handleCheckRef.current?.();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNextButton, currentMission?.type, isExecuting]);

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
                    unoptimized
                    onError={() => {
                      console.error("画像の読み込みエラー:", tutorial.characterImage);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <span className="text-4xl">{tutorial.characterEmoji}</span>
                )}
              </div>
            )}
            
            {/* 説明 */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 mb-1"><FuriganaText text={currentMission.description} /></p>
              {currentMission?.prefixCode && (
                <div className="bg-gray-700 rounded-lg p-2 mt-2">
                  <p className="text-xs text-gray-400 mb-1">変数の設定（自動で入力されます）:</p>
                  <pre className="text-yellow-400 font-mono text-sm">{currentMission.prefixCode}</pre>
                </div>
              )}
              {/* 期待される出力 - クイズ形式以外の場合のみ表示 */}
              {currentMission?.type !== "quiz" && !currentMission?.hideExpectedOutput && (
                <div className="bg-gray-800 rounded-lg p-2 mt-2">
                  <p className="text-xs text-gray-400 mb-1"><F reading="きたい">期待</F>される<F reading="しゅつりょく">出力</F>:</p>
                  <pre className="text-green-400 font-mono text-sm">
                    {currentMission.expectedOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 回答エリア - 問題タイプによって分岐 */}
        {currentMission?.type === "quiz" ? (
          // 選択式問題のUI
          <div className="mb-3">
            {/* コード表示 */}
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{currentMission.codeToRead}</pre>
            </div>
            
            {/* 選択肢 */}
            <h3 className="text-sm font-bold mb-2 text-gray-700"><F reading="せんたくし">選択肢</F>から<F reading="えら">選</F>んでね</h3>
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
          // 従来のブロック形式のUI
          <>
            {/* 回答エリア */}
            <div className="mb-3">
              <h3 className="text-sm font-bold mb-1 text-gray-700">あなたの<F reading="こた">答</F>え</h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-3 min-h-[60px]">
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
          </>
        )}

        {/* 固定ボタン分の余白 - 選択式でない場合のみ */}
        {currentMission?.type !== "quiz" && (
          <div className="h-40"></div>
        )}
      </div>

      {/* ボタンと結果表示（画面下部に固定）- 選択式でない場合のみ表示 */}
      {currentMission?.type !== "quiz" && (
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
                <div>
                  <div className="bg-green-100 border-2 border-green-500 rounded-xl p-2 flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    <div className="flex-1">
                      <p className="text-green-800 font-bold text-sm"><FW word="正解" />！</p>
                      <p className="text-green-700 text-xs">出力: {executionResult.output}</p>
                    </div>
                  </div>
                  {currentMission?.explanation && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">💡 {currentMission.explanation}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-100 border-2 border-red-500 rounded-xl p-2 flex items-center gap-2">
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
          
          {/* ボタン */}
          <div className="p-3">
            {showNextButton ? (
              // 正解時：「次へ」ボタンを表示
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={goToNextMission}
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
                  {(() => {
                    if (isRetryMode) {
                      return retryIndex + 1 < wrongMissionIdsRef.current.length ? "次へ →" : "🎊 完了！";
                    } else {
                      if (currentMissionId < (missions?.length || 0)) {
                        return "次へ →";
                      } else {
                        // 全問終了の場合
                        return wrongMissionIdsRef.current.length > 0 ? "次へ →" : "🎊 完了！";
                      }
                    }
                  })()}
                </button>
              </div>
            ) : (
              // 通常時：「やり直す」と「確認する」ボタンを表示
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
            )}
          </div>
        </div>
      )}

      {/* 選択式問題の結果表示 */}
      {currentMission?.type === "quiz" && executionResult && (
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
          <div className="p-3">
            {executionResult.success ? (
              <>
                <div className="bg-green-100 border-2 border-green-500 rounded-xl p-3 flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-green-800 font-bold"><FW word="正解" />！</p>
                    <p className="text-green-700 text-sm">答えは「{executionResult.output}」</p>
                  </div>
                </div>
                {currentMission?.explanation && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">💡 {currentMission.explanation}</p>
                  </div>
                )}
                {showNextButton && (
                  <button
                    type="button"
                    onClick={goToNextMission}
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
                    }}
                  >
                    {(() => {
                      if (isRetryMode) {
                        return retryIndex + 1 < wrongMissionIdsRef.current.length ? "次へ →" : "🎊 完了！";
                      } else {
                        if (currentMissionId < (missions?.length || 0)) {
                          return "次へ →";
                        } else {
                          // 全問終了の場合
                          return wrongMissionIdsRef.current.length > 0 ? "次へ →" : "🎊 完了！";
                        }
                      }
                    })()}
                  </button>
                )}
              </>
            ) : (
              <div className="bg-red-100 border-2 border-red-500 rounded-xl p-3 flex items-center gap-2">
                <span className="text-2xl">🤔</span>
                <div>
                  <p className="text-red-800 font-bold">もう一度！</p>
                  <p className="text-red-700 text-sm">{executionResult.error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
