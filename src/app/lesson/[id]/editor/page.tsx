"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { lessons, getLesson } from "@/data/lessons";
import { getLessonMissions, getMission } from "@/data/missions";
import { getTutorial } from "@/data/tutorials";
import { characterProfiles, getCharacterByUnit } from "@/data/characterProfiles";
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
import { useAuth } from "@/contexts/AuthContext";
import { useFurigana } from "@/contexts/FuriganaContext";
import { saveLocalProgressToCloud } from "@/lib/progressSync";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { achievements } from "@/data/achievements";
import { checkNewAchievements, UserStats, isWeekend, isEarlyMorning } from "@/utils/achievementChecker";
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
import { addToReviewList } from "@/utils/reviewSystem";
import { generateCode, normalizeCode } from "@/utils/codeGen";
import { checkAnswer } from "@/utils/answerCheck";
import { MissionInfo, GeneratedCode, AnswerExample } from "@/components/MissionInfo";

// ヒント回数管理用の定数と関数
const DAILY_HINT_KEY = "codeblock_daily_hints";

interface DailyHintData {
  date: string; // YYYY-MM-DD形式
  count: number;
}

// 今日の日付を取得（YYYY-MM-DD形式）
const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// 1日のヒント使用状況を取得
const getDailyHintData = (): DailyHintData => {
  if (typeof window === 'undefined') return { date: getTodayString(), count: 0 };
  
  const stored = localStorage.getItem(DAILY_HINT_KEY);
  if (!stored) {
    return { date: getTodayString(), count: 0 };
  }
  
  const data: DailyHintData = JSON.parse(stored);
  
  // 日付が変わっていたらリセット
  if (data.date !== getTodayString()) {
    return { date: getTodayString(), count: 0 };
  }
  
  return data;
};

// ヒント使用回数を増やす
const incrementDailyHintCount = (): void => {
  const data = getDailyHintData();
  data.count += 1;
  data.date = getTodayString();
  localStorage.setItem(DAILY_HINT_KEY, JSON.stringify(data));
};

// 残りヒント回数を取得（isPremiumを引数として受け取る）
const getRemainingHints = (isPremium: boolean): number => {
  const data = getDailyHintData();
  const maxHints = isPremium ? 10 : 3;
  return Math.max(0, maxHints - data.count);
};

// ヒントが使用可能かチェック（isPremiumを引数として受け取る）
const canUseHint = (isPremium: boolean): boolean => {
  const maxHints = isPremium ? 10 : 3;
  const data = getDailyHintData();
  return data.count < maxHints;
};

type EditorPageProps = {
  params: Promise<{
    id: string;
  }>;
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
      {/* メインブロック（ドラッグ用） */}
      <div
        {...attributes}
        {...listeners}
        className={`${block.color} text-gray-700 px-3 py-2 rounded-xl text-sm font-mono shadow-md hover:shadow-lg transition-all border-2 border-white cursor-grab active:cursor-grabbing select-none ${
          block.text === "    " ? "bg-gray-300 border-gray-400" : ""
        }`}
        style={block.text === "==" ? { letterSpacing: "0.15em" } : undefined}
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
  const { user, loading, canAccessLesson, isPremium } = useAuth();
  const { furiganaEnabled, toggleFurigana } = useFurigana();
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
  // 選択式で誤答したときのフィードバック
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  // 3回間違えたら正解例を見せる
  const [showAnswerExample, setShowAnswerExample] = useState(false);
  const handleCheckRef = useRef<(() => Promise<void>) | undefined>(undefined);
  const goToNextMissionRef = useRef<(() => void) | undefined>(undefined);
  
  // ヒント機能の状態
  const [wrongCount, setWrongCount] = useState(0);
  const [hintShown, setHintShown] = useState(false);
  const hintShownRef = useRef(false); // 最新のhintShown値を保持するref
  const [showHintModal, setShowHintModal] = useState(false);
  const [hintMessage, setHintMessage] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [totalHintCountInLesson, setTotalHintCountInLesson] = useState(0); // レッスン全体のヒント使用回数（実績チェック用）
  const [totalWrongInLesson, setTotalWrongInLesson] = useState(0);
  const [lessonStartTime] = useState(Date.now()); // レッスン開始時刻
  const [remainingHints, setRemainingHints] = useState<number>(isPremium ? 10 : 3);

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

  // アクセス制御
  useEffect(() => {
    if (loading || !lessonId) return;
    
    const lesson = getLesson(lessonId);
    if (!lesson) return;
    
    if (!canAccessLesson(lesson.unitNumber)) {
      router.push("/");
    }
  }, [lessonId, canAccessLesson, loading, router]);

  useEffect(() => {
    params.then((p) => {
      const id = p.id;
      if (id) {
        setLessonId(id);
        
        // ミッション進捗を読み込む（missionProgress_{lessonId}）
        const progressKey = `missionProgress_${id}`;
        const savedProgress = parseInt(localStorage.getItem(progressKey) || "0", 10);
        
        // ミッションIDが有効かチェック
        const missions = getLessonMissions(id);
        let missionId = 1;
        
        if (missions) {
          const maxMissionId = missions.length;
          
          // デバッグパネルから指定されたミッション番号をチェック（lesson-{lessonId}-mission）
          const debugMissionKey = `lesson-${id}-mission`;
          const debugMission = localStorage.getItem(debugMissionKey);
          
          // 途中進捗をチェック（lesson-{lessonId}-progress）
          const savedProgressKey = `lesson-${id}-progress`;
          const savedMissionProgress = localStorage.getItem(savedProgressKey);
          
          // デバッグパネルで指定されたミッション番号を優先
          if (debugMission) {
            const debugMissionNum = parseInt(debugMission, 10);
            if (!isNaN(debugMissionNum) && debugMissionNum > 0 && debugMissionNum <= maxMissionId) {
              missionId = debugMissionNum;
            }
          } else if (savedMissionProgress) {
            const savedMission = parseInt(savedMissionProgress, 10);
            // 保存されたミッション番号が有効な範囲内かチェック
            if (savedMission > 0 && savedMission <= maxMissionId) {
              missionId = savedMission;
            }
          } else {
            // 途中進捗がない場合、既存の進捗ロジックを使用
            // 保存された進捗から次の問題を開始（進捗は0-indexed、missionIdは1-indexed）
            // savedProgress = 3 の場合、4問目（missionId = 4）から開始
            if (savedProgress > 0 && savedProgress < maxMissionId) {
              missionId = savedProgress + 1;
            } else if (savedProgress >= maxMissionId) {
              // 全問クリア済みの場合は最初から
              missionId = 1;
            } else {
              missionId = 1;
            }
          }
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
    
    // 残りヒント回数を初期化
    setRemainingHints(getRemainingHints(isPremium));
  }, [isPremium]);

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

  // 並べたブロックから生成される実際のPythonコード（入力に合わせて随時更新）
  const livePythonCode = useMemo(() => generateCode(selectedBlocks), [selectedBlocks]);

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
    
    // 改行ブロックを追加した場合、インデントブロックが利用可能な場合（if文、for文、while文、def文など）
    if (newBlock.text === "↵") {
      const indentBlock = getIndentBlock();
      // インデントブロックが利用可能な場合のみ自動インデントを有効化
      // レッスン4, 5, 6, 7, 8, 9で有効（9はif文と組み合わせる問題でインデントを使う）
      if (indentBlock && lessonId && (
        lessonId.startsWith("4-") ||
        lessonId.startsWith("5-") ||
        lessonId.startsWith("6-") ||
        lessonId.startsWith("7-") ||
        lessonId.startsWith("8-") ||
        lessonId.startsWith("9-")
      )) {
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
    setQuizFeedback(null);
    setShowAnswerExample(false);

    // ヒント機能の状態をリセット（各問題ごとに1回ヒントを表示できるようにする）
    setWrongCount(0);
    setHintShown(false);
    hintShownRef.current = false; // refもリセット
    setHintMessage("");
    setShowHintModal(false);
    
    // 残りヒント回数を更新
    setRemainingHints(getRemainingHints(isPremium));
    
    // ミッションIDをローカルストレージに保存
    if (lessonId) {
      localStorage.setItem(`lesson-${lessonId}-mission`, currentMissionId.toString());
    }
  }, [currentMissionId, lessonId, currentMission?.id]);

  // 実績チェック用のユーザー統計を構築
  const checkAndSaveAchievements = async () => {
    if (!user || !lessonId) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return;

      const userData = userDoc.data();
      
      // 現在の実績一覧
      const currentAchievements: string[] = userData.achievements || [];
      const pendingAchievements: string[] = userData.pendingAchievements || [];
      
      // クリア済みレッスン一覧を更新
      const lessonsCompleted: string[] = userData.lessonsCompleted || [];
      if (!lessonsCompleted.includes(lessonId)) {
        lessonsCompleted.push(lessonId);
      }
      
      // レッスンクリア回数を更新
      const lessonCompleteCounts: { [key: string]: number } = userData.lessonCompleteCounts || {};
      lessonCompleteCounts[lessonId] = (lessonCompleteCounts[lessonId] || 0) + 1;
      
      // ノーミスクリアのチェック（totalWrongInLesson === 0）
      const noMistakeLessons: string[] = userData.noMistakeLessons || [];
      if (totalWrongInLesson === 0 && !noMistakeLessons.includes(lessonId)) {
        noMistakeLessons.push(lessonId);
      }
      
      // ヒントなしクリアのチェック
      const noHintLessons: string[] = userData.noHintLessons || [];
      if (totalHintCountInLesson === 0 && !noHintLessons.includes(lessonId)) {
        noHintLessons.push(lessonId);
      }
      
      // 3分以内クリアのチェック
      const fastLessons: string[] = userData.fastLessons || [];
      const lessonDuration = Math.floor((Date.now() - lessonStartTime) / 1000); // 秒
      if (lessonDuration < 180 && !fastLessons.includes(lessonId)) {
        fastLessons.push(lessonId);
      }
      
      // 週末・早朝チェック
      const studiedOnWeekend = userData.studiedOnWeekend || isWeekend();
      const studiedEarly = userData.studiedEarly || isEarlyMorning();
      
      // 連続正解の取得（既に各問題で更新されているので、そのまま使用）
      const consecutiveCorrect = userData.consecutiveCorrect || 0;
      const maxConsecutiveCorrect = userData.maxConsecutiveCorrect || 0;
      
      // ユーザー統計を構築
      const stats: UserStats = {
        lessonsCompleted,
        totalCorrect: (userData.totalCorrect || 0) + 1,
        totalXp: userData.xp || 0,
        level: userData.level || 1,
        streakDays: userData.streakDays || 0,
        lessonCompleteCounts,
        consecutiveCorrect: consecutiveCorrect,
        maxConsecutiveCorrect: maxConsecutiveCorrect,
        noMistakeLessons,
        noHintLessons,
        fastLessons,
        studiedOnWeekend,
        studiedEarly
      };
      
      // 新しくゲットされたバッジをチェック
      const alreadyUnlocked = [...currentAchievements, ...pendingAchievements];
      const newlyUnlocked = checkNewAchievements(stats, alreadyUnlocked);
      
      // 新しい実績があれば pendingAchievements に追加
      const newPending = [...pendingAchievements, ...newlyUnlocked.map(a => a.id)];
      
      // Firestoreに保存
      await updateDoc(doc(db, "users", user.uid), {
        lessonsCompleted,
        lessonCompleteCounts,
        noMistakeLessons,
        noHintLessons,
        fastLessons,
        studiedOnWeekend,
        studiedEarly,
        pendingAchievements: newPending
      });
      
    } catch (error) {
      console.error("Failed to check achievements:", error);
    }
  };

  // 次の問題へ進む処理（共通関数）
  const goToNextMission = useCallback(() => {
    setExecutionResult(null);
    setSelectedBlocks([]);
    setSelectedChoice(null);
    setShowNextButton(false);
    
    if (isRetryMode) {
      // 再出題モード
      if (retryIndex + 1 < wrongMissionIds.length) {
        // 次の間違えた問題へ
        setRetryIndex(retryIndex + 1);
      } else {
        // 全ての再出題が完了 → 完了画面へ
        if (lessonId) {
          localStorage.removeItem(`lesson-${lessonId}-mission`);
          // レッスン完了時に途中進捗をクリア
          localStorage.removeItem(`lesson-${lessonId}-progress`);
        }
        // クラウドに進捗を保存
        if (user) {
          saveLocalProgressToCloud(user.uid);
          // 実績チェック
          checkAndSaveAchievements();
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
        // 全問終了 - wrongMissionIdsを直接確認
        if (wrongMissionIds.length > 0) {
          // 間違えた問題がある → 再出題モードへ
          setIsRetryMode(true);
          setRetryIndex(0);
        } else {
          // 全問正解 → 完了画面へ
          if (lessonId) {
            localStorage.removeItem(`lesson-${lessonId}-mission`);
            // レッスン完了時に途中進捗をクリア
            localStorage.removeItem(`lesson-${lessonId}-progress`);
          }
          // クラウドに進捗を保存
          if (user) {
            saveLocalProgressToCloud(user.uid);
            // 実績チェック
            checkAndSaveAchievements();
          }
          router.push(`/lesson/${lessonId}/complete`);
        }
      }
    }
  }, [isRetryMode, retryIndex, wrongMissionIds, lessonId, user, router, currentMissionId, missions?.length]);

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

      // 連続正解を更新（Firestoreに保存）
      if (user) {
        getDoc(doc(db, "users", user.uid)).then(userDoc => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const newConsecutiveCorrect = (userData.consecutiveCorrect || 0) + 1;
            const newMaxConsecutiveCorrect = Math.max(newConsecutiveCorrect, userData.maxConsecutiveCorrect || 0);
            
            updateDoc(doc(db, "users", user.uid), {
              consecutiveCorrect: newConsecutiveCorrect,
              maxConsecutiveCorrect: newMaxConsecutiveCorrect
            }).catch(error => {
              console.error("Failed to update consecutive correct:", error);
            });
          }
        });
      }

      // 進捗保存とXP付与（再出題モードでなければ）
      if (!isRetryMode && lessonId) {
        const progressKey = `missionProgress_${lessonId}`;
        const savedProgress = parseInt(localStorage.getItem(progressKey) || "0", 10);
        // currentMissionIdは1-indexed、進捗は0-indexedで保存
        const currentMissionIndex = currentMissionId - 1;
        
        // まだクリアしていない問題の場合のみXPを付与
        if (currentMissionIndex >= savedProgress) {
          // XPを付与（1問あたり10XP）
          const { newTotal, leveledUp, newLevel } = addXP(10);
          setTotalXP(newTotal);
          setLevelInfo(newLevel);
          setLevelProgress(getLevelProgress(newTotal));
          setEarnedXP(10);
          setStreakBonus(0);
          setShowXPAnimation(true);
          
          // アニメーション後にリセット
          setTimeout(() => {
            setShowXPAnimation(false);
            setEarnedXP(null);
            setStreakBonus(0);
          }, 1500);
        }
        
        // 進捗を保存（現在のミッションIDを保存）
        // currentMissionId = 3 の場合、進捗は 2（3問目までクリア済み）を保存
        const newProgress = Math.max(savedProgress, currentMissionIndex + 1);
        localStorage.setItem(progressKey, newProgress.toString());
        
        // 途中進捗を保存（lesson-{lessonId}-progress）
        const nextMission = currentMissionId + 1;
        const missions = getLessonMissions(lessonId);
        
        // 次のミッションがある場合は進捗を保存
        if (missions && nextMission <= missions.length) {
          localStorage.setItem(`lesson-${lessonId}-progress`, nextMission.toString());
        } else {
          // 最後のミッションをクリアした場合は進捗をクリア
          localStorage.removeItem(`lesson-${lessonId}-progress`);
        }
        
        // クラウドに進捗を保存
        if (user) {
          saveLocalProgressToCloud(user.uid);
        }
        
        // 復習リストに追加
        if (lesson) {
          addToReviewList(lessonId, currentMissionId, lesson.title);
        }
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
      
      // 不正解回数をカウント
      setWrongCount(prev => {
        const newCount = prev + 1;
        // 3回間違えたら正解例を見せる（ヒントを使い切っても手詰まりにならないように）
        if (newCount >= 3) setShowAnswerExample(true);
        
        if (newCount >= 3 && !hintShownRef.current) {
          hintShownRef.current = true; // refを先に更新
          setHintShown(true);
          
          if (canUseHint(isPremium)) {
            fetchHint(); // 自動でヒントを取得
            setTotalHintCountInLesson(prev => prev + 1);
          } else {
            setHintMessage(isPremium 
              ? "今日のヒントは使い切りました。明日また挑戦してね！"
              : "今日のヒントは使い切りました（無料プラン: 1日3回まで）。有料プランなら1日10回まで使えます！");
            setShowHintModal(true);
          }
        }
        return newCount;
      });
      
      // レッスン全体の間違い回数をカウント
      setTotalWrongInLesson(prev => prev + 1);
      
      setCurrentStreak(0);
      resetStreak();
      
      // 連続正解をリセット（Firestoreに保存）
      if (user) {
        updateDoc(doc(db, "users", user.uid), {
          consecutiveCorrect: 0
        }).catch(error => {
          console.error("Failed to reset consecutive correct:", error);
        });
      }
      
      // 不正解のときこそ説明が要る。自動で消さず、読んでから自分で次に進んでもらう
      setQuizFeedback(
        currentMission.hint ||
          currentMission.explanation ||
          "コードを上から1行ずつ読んで、変数の中身がどう変わるか追いかけてみよう！"
      );
    }
  };

  // 選択式でもう一度考える
  const retryQuiz = () => {
    setExecutionResult(null);
    setSelectedChoice(null);
    setQuizFeedback(null);
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
        playIncorrectSound(); // 不正解音を再生
        
        // エラー時も不正解としてカウント
        setWrongCount(prev => {
          const newCount = prev + 1;
          // 3回間違えたら正解例を見せる（ヒントを使い切っても手詰まりにならないように）
          if (newCount >= 3) setShowAnswerExample(true);
          
          if (newCount >= 3 && !hintShownRef.current) {
            
            hintShownRef.current = true;
            setHintShown(true);
            
            if (canUseHint(isPremium)) {
              fetchHint();
              setTotalHintCountInLesson(prev => prev + 1);
            } else {
              setHintMessage(isPremium 
                ? "今日のヒントは使い切りました。明日また挑戦してね！"
                : "今日のヒントは使い切りました（無料プラン: 1日3回まで）。有料プランなら1日10回まで使えます！");
              setShowHintModal(true);
            }
          }
          return newCount;
        });
        
        // レッスン全体の間違い回数をカウント
        setTotalWrongInLesson(prev => prev + 1);
        
        setCurrentStreak(0);
        resetStreak();
        
        setIsExecuting(false);
        return;
      }

      const actualOutput = output || "";

      // 出力一致とコード構造を、3画面共通のロジックでまとめて判定する
      const result = currentMission
        ? checkAnswer(lessonId || "", currentMission, code, actualOutput)
        : { correct: false, message: "問題を読み込めませんでした。" };
      const outputMatches = result.correct;
      const codeIsValid = result.correct;
      const codeErrorMessage = result.message || "";

      // 両方の条件を満たした場合のみ正解
      if (outputMatches && codeIsValid) {
        
        // 正解時の表示を更新
        setExecutionResult({
          success: true,
          output: actualOutput,
        });

        playCorrectSound(); // 正解音を再生

        // 連続正解を更新（Firestoreに保存）
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const newConsecutiveCorrect = (userData.consecutiveCorrect || 0) + 1;
            const newMaxConsecutiveCorrect = Math.max(newConsecutiveCorrect, userData.maxConsecutiveCorrect || 0);
            
            await updateDoc(doc(db, "users", user.uid), {
              consecutiveCorrect: newConsecutiveCorrect,
              maxConsecutiveCorrect: newMaxConsecutiveCorrect
            }).catch(error => {
              console.error("Failed to update consecutive correct:", error);
            });
          }
        }

        // 進捗保存とXP付与（再出題モードでなければ）
        if (!isRetryMode && lessonId) {
          const progressKey = `missionProgress_${lessonId}`;
          const savedProgress = parseInt(localStorage.getItem(progressKey) || "0", 10);
          // currentMissionIdは1-indexed、進捗は0-indexedで保存
          const currentMissionIndex = currentMissionId - 1;
          
          // まだクリアしていない問題の場合のみXPを付与
          if (currentMissionIndex >= savedProgress) {
            // XPを付与（1問あたり10XP）
            const { newTotal, leveledUp, newLevel } = addXP(10);
            setTotalXP(newTotal);
            setLevelInfo(newLevel);
            setLevelProgress(getLevelProgress(newTotal));
            setEarnedXP(10);
            setStreakBonus(0);
            setShowXPAnimation(true);
            
            // アニメーション後にリセット
            setTimeout(() => {
              setShowXPAnimation(false);
              setEarnedXP(null);
              setStreakBonus(0);
            }, 1500);
          }
          
          // 進捗を保存（現在のミッションIDを保存）
          // currentMissionId = 3 の場合、進捗は 2（3問目までクリア済み）を保存
          const newProgress = Math.max(savedProgress, currentMissionIndex + 1);
          localStorage.setItem(progressKey, newProgress.toString());
          
          // 途中進捗を保存（lesson-{lessonId}-progress）
          const nextMission = currentMissionId + 1;
          const missions = getLessonMissions(lessonId);
          
          // 次のミッションがある場合は進捗を保存
          if (missions && nextMission <= missions.length) {
            localStorage.setItem(`lesson-${lessonId}-progress`, nextMission.toString());
          } else {
            // 最後のミッションをクリアした場合は進捗をクリア
            localStorage.removeItem(`lesson-${lessonId}-progress`);
          }
          
          // クラウドに進捗を保存
          if (user) {
            saveLocalProgressToCloud(user.uid);
          }
          
        // 復習リストに追加
        if (lesson) {
          addToReviewList(lessonId, currentMissionId, lesson.title);
        }
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
        
        // 不正解回数をカウント
        setWrongCount(prev => {
          const newCount = prev + 1;
          // 3回間違えたら正解例を見せる（ヒントを使い切っても手詰まりにならないように）
          if (newCount >= 3) setShowAnswerExample(true);
          
          if (newCount >= 3 && !hintShownRef.current) {
            hintShownRef.current = true; // refを先に更新
            setHintShown(true);
            
            if (canUseHint(isPremium)) {
              fetchHint(); // 自動でヒントを取得
              setTotalHintCountInLesson(prev => prev + 1);
            } else {
              setHintMessage("今日のヒントは使い切りました。明日また挑戦してね！");
              setShowHintModal(true);
            }
          }
          return newCount;
        });
        
        // レッスン全体の間違い回数をカウント
        setTotalWrongInLesson(prev => prev + 1);
        
        setCurrentStreak(0);
        resetStreak();
        
        // 連続正解をリセット（Firestoreに保存）
        if (user) {
          updateDoc(doc(db, "users", user.uid), {
            consecutiveCorrect: 0
          }).catch(error => {
            console.error("Failed to reset consecutive correct:", error);
          });
        }
      }
    } catch (error) {
      setExecutionResult({
        success: false,
        error: `実行中にエラーが発生しました: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`,
      });
      playIncorrectSound(); // エラー時も不正解音を再生
      
      // エラー時も不正解としてカウント
      setWrongCount(prev => {
        const newCount = prev + 1;
        // 3回間違えたら正解例を見せる（ヒントを使い切っても手詰まりにならないように）
        if (newCount >= 3) setShowAnswerExample(true);
        
        if (newCount >= 3 && !hintShownRef.current) {
          hintShownRef.current = true;
          setHintShown(true);
          
          if (canUseHint(isPremium)) {
            fetchHint();
            setTotalHintCountInLesson(prev => prev + 1);
          } else {
            setHintMessage("今日のヒントは使い切りました。明日また挑戦してね！");
            setShowHintModal(true);
          }
        }
        return newCount;
      });
      
      // レッスン全体の間違い回数をカウント
      setTotalWrongInLesson(prev => prev + 1);
      
      setCurrentStreak(0);
      resetStreak();
    } finally {
      setIsExecuting(false);
    }
  };

  // ヒント取得関数
  const fetchHint = async () => {
    // 1日の上限チェック
    if (!canUseHint(isPremium)) {
      setHintMessage(isPremium 
        ? "今日のヒントは使い切りました。明日また挑戦してね！"
        : "今日のヒントは使い切りました（無料プラン: 1日3回まで）。有料プランなら1日10回まで使えます！");
      setShowHintModal(true);
      return;
    }
    
    setHintLoading(true);
    
    const mission = currentMission;
    const unitNumber = lesson?.unitNumber || 1;
    
    // キャラクタープロファイルを取得
    const characterProfile = getCharacterByUnit(unitNumber);
    
    if (!characterProfile) {
      setHintMessage("ヒントを取得できませんでした。");
      setShowHintModal(true);
      setHintLoading(false);
      return;
    }
    
    // ユーザーの回答を取得（コード形式または選択式の場合は選択した選択肢）
    const userAnswer = currentMission?.type === "quiz" 
      ? (selectedChoice !== null ? currentMission.choices?.[selectedChoice] || "" : "")
      : (selectedBlocks.length > 0 ? generateCode(selectedBlocks) : "");
    
    // 問題文を取得（questionプロパティがあればそれを使い、なければdescriptionを使う）
    const question = (mission as any)?.question 
      ? (typeof (mission as any).question === "string" 
          ? (mission as any).question 
          : (mission as any).question.ja)
      : mission?.description || "";
    
    // 正解を取得（blanksプロパティがあればそれを使い、なければexpectedOutputを使う）
    const expectedAnswer = (mission as any)?.blanks 
      ? (mission as any).blanks.join(", ")
      : mission?.expectedOutput || "";
    
    // コードを取得（codeプロパティがあればそれを使い、選択式問題の場合はcodeToReadを使う）
    const code = (mission as any)?.code 
      ? (Array.isArray((mission as any).code) 
          ? (mission as any).code.join("\n")
          : (mission as any).code)
      : (mission?.type === "quiz" && (mission as any)?.codeToRead)
      ? (mission as any).codeToRead
      : "";
    
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
      
      const requestBody = {
        character_id: characterProfile.id,
        character_name: characterProfile.name,
        personality: characterProfile.personality,
        speech_style: characterProfile.speechStyle,
        hint_style: characterProfile.hintStyle,
        catchphrases: characterProfile.catchphrases,
        question: question,
        code: code,
        user_answer: userAnswer,
        expected_answer: expectedAnswer
      };
      const requestUrl = `${API_URL}/api/hint`;
      
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      // HTTPエラーのチェックを追加
      if (!response.ok) {
        const errorText = await response.text();
        console.error("APIエラー:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHintMessage(data.hint || "ごめんね、エラーが起きちゃった。もう一度挑戦してみてね！");
      setShowHintModal(true);
      
      // ヒント使用回数を増やす
      incrementDailyHintCount();
      setRemainingHints(getRemainingHints(isPremium));
      
    } catch (error) {
      console.error("ヒント取得エラー:", error);
      setHintMessage("ごめんね、エラーが起きちゃった。もう一度挑戦してみてね！");
      setShowHintModal(true);
    } finally {
      setHintLoading(false);
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

  // ローディング中または未ログイン時の表示
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-purple-600">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

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
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5 mb-3 border-2 border-blue-300">
          <div className="flex items-start gap-4">
            {/* キャラクター */}
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
                    onError={() => {
                      console.error("画像の読み込みエラー:", tutorial.characterImage);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <span className="text-4xl md:text-5xl">{tutorial.characterEmoji}</span>
                )}
              </div>
            )}
            
            {/* 説明・前提コード・期待される出力 */}
            <MissionInfo mission={currentMission} />
          </div>
        </div>

        {/* 回答エリア - 問題タイプによって分岐 */}
        {currentMission?.type === "quiz" ? (
          // 選択式問題のUI
          <div className="mb-4">
            {/* コード表示 */}
            {currentMission.codeToRead && (
              <div className="bg-gray-900 rounded-xl p-4 mb-4">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{currentMission.codeToRead}</pre>
              </div>
            )}

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

            {/* 誤答時のフィードバック（一番学べる瞬間に何も出ないのを防ぐ） */}
            {quizFeedback && executionResult?.success === false && (
              <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
                <p className="text-amber-900 font-bold text-sm mb-1">
                  🤔 おしい！ここを<F reading="かんが">考</F>えてみよう
                </p>
                <p className="text-amber-800 text-sm leading-relaxed">{quizFeedback}</p>
                <button
                  type="button"
                  onClick={retryQuiz}
                  className="mt-3 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-5 rounded-full text-sm transition-all"
                >
                  もう<F reading="いちど">一度</F><F reading="こた">答</F>える
                </button>
              </div>
            )}

            {/* 正解時の解説 */}
            {executionResult?.success && currentMission?.explanation && (
              <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <p className="text-blue-800 text-sm leading-relaxed">💡 {currentMission.explanation}</p>
              </div>
            )}
          </div>
        ) : (
          // 従来のブロック形式のUI
          <>
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
                      style={block.text === "==" ? { letterSpacing: "0.15em" } : undefined}
                    >
                      {block.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 組み立てたPythonコード（ブロックと本物のコードを結びつける） */}
            <GeneratedCode code={livePythonCode} />

            {/* 3回間違えたら正解例を見せる */}
            {showAnswerExample && currentMission?.correctCode && (
              <AnswerExample code={currentMission.correctCode} />
            )}
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
                    {/* ヒント取得中の表示 */}
                    {wrongCount >= 3 && hintLoading && canUseHint(isPremium) && (
                      <div className="flex items-center gap-2 text-purple-600 mt-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                        <span className="text-xs">{tutorial?.characterName || "キャラクター"}がヒントを考えているよ...</span>
                      </div>
                    )}
                    {wrongCount >= 3 && !hintShown && !canUseHint(isPremium) && (
                      <div className="text-orange-600 text-sm mt-2">
                        {isPremium 
                          ? "今日のヒントは使い切りました（明日リセット）"
                          : "今日のヒントは使い切りました（無料プラン: 1日3回まで）"}
                      </div>
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
                      return retryIndex + 1 < wrongMissionIds.length ? "次へ →" : "🎊 完了！";
                    } else {
                      if (currentMissionId < (missions?.length || 0)) {
                        return "次へ →";
                      } else {
                        // 全問終了の場合
                        return wrongMissionIds.length > 0 ? "次へ →" : "🎊 完了！";
                      }
                    }
                  })()}
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
                <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-4 flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-green-800 font-bold"><FW word="正解" />！</p>
                    <p className="text-green-700 text-sm">答えは「{executionResult.output}」</p>
                  </div>
                </div>
                {currentMission?.explanation && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
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
                        return retryIndex + 1 < wrongMissionIds.length ? "次へ →" : "🎊 完了！";
                      } else {
                        if (currentMissionId < (missions?.length || 0)) {
                          return "次へ →";
                        } else {
                          // 全問終了の場合
                          return wrongMissionIds.length > 0 ? "次へ →" : "🎊 完了！";
                        }
                      }
                    })()}
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-4 flex items-center gap-3 mb-3">
                  <span className="text-2xl">🤔</span>
                  <div className="flex-1">
                    <p className="text-red-800 font-bold">もう一度！</p>
                    <p className="text-red-700 text-sm">{executionResult.error}</p>
                    {/* ヒント取得中の表示 */}
                    {wrongCount >= 3 && hintLoading && canUseHint(isPremium) && (
                      <div className="flex items-center gap-2 text-purple-600 mt-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                        <span className="text-xs">{tutorial?.characterName || "キャラクター"}がヒントを考えているよ...</span>
                      </div>
                    )}
                    {wrongCount >= 3 && !hintShown && !canUseHint(isPremium) && (
                      <div className="text-orange-600 text-sm mt-2">
                        {isPremium 
                          ? "今日のヒントは使い切りました（明日リセット）"
                          : "今日のヒントは使い切りました（無料プラン: 1日3回まで）"}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* ヒントモーダル */}
      {showHintModal && (() => {
        const characterProfile = getCharacterByUnit(lesson?.unitNumber || 1);
        if (!characterProfile) return null;
        
        return (
          <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              {/* キャラクター画像と名前 */}
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={characterProfile.image} 
                  alt={characterProfile.name}
                  className="w-16 h-16 object-contain"
                />
                <div className="font-bold text-lg text-purple-600">
                  {characterProfile.name}からのヒント
                </div>
              </div>
              
              {/* ヒントメッセージ */}
              {hintLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="bg-purple-50 rounded-xl p-4 mb-4">
                  <p className="text-gray-700">{hintMessage}</p>
                </div>
              )}
              
              {/* 残りヒント回数の表示 */}
              {!hintLoading && (
                <p className="text-sm text-gray-500 text-center mb-4">
                  今日の残りヒント: {remainingHints}回 / {isPremium ? 10 : 3}回
                </p>
              )}
              
              {/* 無料ユーザーへのアップグレード促進 */}
              {!hintLoading && !isPremium && remainingHints === 0 && (
                <div className="text-center mt-4">
                  <p className="text-sm text-purple-600 mb-2">
                    有料プランなら1日10回までヒントが使えます！
                  </p>
                  <button
                    onClick={() => {
                      setShowHintModal(false);
                      // UpgradeModalを表示する処理があれば追加
                    }}
                    className="text-sm text-purple-500 underline"
                  >
                    プランを見る
                  </button>
                </div>
              )}
              
              {/* 閉じるボタン */}
              <button
                onClick={() => setShowHintModal(false)}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                わかった！
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
