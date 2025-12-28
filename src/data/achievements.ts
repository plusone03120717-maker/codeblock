export interface Achievement {
  id: string;
  name: { ja: string; en: string };
  description: { ja: string; en: string };
  icon: string;
  category: "progress" | "streak" | "correct" | "xp" | "challenge";
  condition: {
    type: string;
    value: number | string;
  };
}

export const achievements: Achievement[] = [
  // ①学習進捗（10個）
  {
    id: "first-lesson",
    name: { ja: "はじめの一歩", en: "First Step" },
    description: { ja: "初めてレッスンをクリア", en: "Complete your first lesson" },
    icon: "🌱",
    category: "progress",
    condition: { type: "lessons_completed", value: 1 }
  },
  {
    id: "unit1-complete",
    name: { ja: "print見習い", en: "Print Apprentice" },
    description: { ja: "ユニット1を全てクリア", en: "Complete all of Unit 1" },
    icon: "🎓",
    category: "progress",
    condition: { type: "unit_complete", value: 1 }
  },
  {
    id: "unit2-complete",
    name: { ja: "変数マスター", en: "Variable Master" },
    description: { ja: "ユニット2を全てクリア", en: "Complete all of Unit 2" },
    icon: "📦",
    category: "progress",
    condition: { type: "unit_complete", value: 2 }
  },
  {
    id: "unit3-complete",
    name: { ja: "データ博士", en: "Data Doctor" },
    description: { ja: "ユニット3を全てクリア", en: "Complete all of Unit 3" },
    icon: "🔢",
    category: "progress",
    condition: { type: "unit_complete", value: 3 }
  },
  {
    id: "unit4-complete",
    name: { ja: "分岐の達人", en: "Branching Expert" },
    description: { ja: "ユニット4を全てクリア", en: "Complete all of Unit 4" },
    icon: "🔀",
    category: "progress",
    condition: { type: "unit_complete", value: 4 }
  },
  {
    id: "unit5-complete",
    name: { ja: "ループマスター", en: "Loop Master" },
    description: { ja: "ユニット5を全てクリア", en: "Complete all of Unit 5" },
    icon: "🔄",
    category: "progress",
    condition: { type: "unit_complete", value: 5 }
  },
  {
    id: "unit6-complete",
    name: { ja: "リスト職人", en: "List Craftsman" },
    description: { ja: "ユニット6を全てクリア", en: "Complete all of Unit 6" },
    icon: "📋",
    category: "progress",
    condition: { type: "unit_complete", value: 6 }
  },
  {
    id: "unit7-complete",
    name: { ja: "関数使い", en: "Function User" },
    description: { ja: "ユニット7を全てクリア", en: "Complete all of Unit 7" },
    icon: "⚙️",
    category: "progress",
    condition: { type: "unit_complete", value: 7 }
  },
  {
    id: "unit8-complete",
    name: { ja: "戻り値の魔術師", en: "Return Value Wizard" },
    description: { ja: "ユニット8を全てクリア", en: "Complete all of Unit 8" },
    icon: "🎁",
    category: "progress",
    condition: { type: "unit_complete", value: 8 }
  },
  {
    id: "unit9-complete",
    name: { ja: "辞書マニア", en: "Dictionary Maniac" },
    description: { ja: "ユニット9を全てクリア", en: "Complete all of Unit 9" },
    icon: "📚",
    category: "progress",
    condition: { type: "unit_complete", value: 9 }
  },

  // ②連続学習（5個）
  {
    id: "streak-3",
    name: { ja: "やる気の炎", en: "Spark of Motivation" },
    description: { ja: "3日連続学習", en: "Study 3 days in a row" },
    icon: "🔥",
    category: "streak",
    condition: { type: "streak_days", value: 3 }
  },
  {
    id: "streak-7",
    name: { ja: "燃える学習者", en: "Burning Learner" },
    description: { ja: "7日連続学習", en: "Study 7 days in a row" },
    icon: "🔥🔥",
    category: "streak",
    condition: { type: "streak_days", value: 7 }
  },
  {
    id: "streak-14",
    name: { ja: "情熱の炎", en: "Flame of Passion" },
    description: { ja: "14日連続学習", en: "Study 14 days in a row" },
    icon: "🔥🔥🔥",
    category: "streak",
    condition: { type: "streak_days", value: 14 }
  },
  {
    id: "streak-30",
    name: { ja: "継続は力なり", en: "Persistence Pays" },
    description: { ja: "30日連続学習", en: "Study 30 days in a row" },
    icon: "⭐",
    category: "streak",
    condition: { type: "streak_days", value: 30 }
  },
  {
    id: "streak-100",
    name: { ja: "学習の鬼", en: "Study Demon" },
    description: { ja: "100日連続学習", en: "Study 100 days in a row" },
    icon: "💎",
    category: "streak",
    condition: { type: "streak_days", value: 100 }
  },

  // ③正解数（5個）
  {
    id: "correct-1",
    name: { ja: "初正解", en: "First Correct" },
    description: { ja: "1問正解", en: "Answer 1 question correctly" },
    icon: "✅",
    category: "correct",
    condition: { type: "total_correct", value: 1 }
  },
  {
    id: "correct-10",
    name: { ja: "10問クリア", en: "10 Questions Clear" },
    description: { ja: "10問正解", en: "Answer 10 questions correctly" },
    icon: "🎯",
    category: "correct",
    condition: { type: "total_correct", value: 10 }
  },
  {
    id: "correct-50",
    name: { ja: "50問クリア", en: "50 Questions Clear" },
    description: { ja: "50問正解", en: "Answer 50 questions correctly" },
    icon: "🏅",
    category: "correct",
    condition: { type: "total_correct", value: 50 }
  },
  {
    id: "correct-100",
    name: { ja: "100問クリア", en: "100 Questions Clear" },
    description: { ja: "100問正解", en: "Answer 100 questions correctly" },
    icon: "🥇",
    category: "correct",
    condition: { type: "total_correct", value: 100 }
  },
  {
    id: "correct-500",
    name: { ja: "500問クリア", en: "500 Questions Clear" },
    description: { ja: "500問正解", en: "Answer 500 questions correctly" },
    icon: "👑",
    category: "correct",
    condition: { type: "total_correct", value: 500 }
  },

  // ④XP・レベル（5個）
  {
    id: "xp-100",
    name: { ja: "XPゲッター", en: "XP Getter" },
    description: { ja: "XP 100達成", en: "Earn 100 XP" },
    icon: "⚡",
    category: "xp",
    condition: { type: "total_xp", value: 100 }
  },
  {
    id: "xp-500",
    name: { ja: "XPハンター", en: "XP Hunter" },
    description: { ja: "XP 500達成", en: "Earn 500 XP" },
    icon: "💫",
    category: "xp",
    condition: { type: "total_xp", value: 500 }
  },
  {
    id: "xp-1000",
    name: { ja: "XPマスター", en: "XP Master" },
    description: { ja: "XP 1000達成", en: "Earn 1000 XP" },
    icon: "🌟",
    category: "xp",
    condition: { type: "total_xp", value: 1000 }
  },
  {
    id: "level-5",
    name: { ja: "レベル5", en: "Level 5" },
    description: { ja: "レベル5到達", en: "Reach Level 5" },
    icon: "🚀",
    category: "xp",
    condition: { type: "level", value: 5 }
  },
  {
    id: "level-10",
    name: { ja: "レベル10", en: "Level 10" },
    description: { ja: "レベル10到達", en: "Reach Level 10" },
    icon: "🏆",
    category: "xp",
    condition: { type: "level", value: 10 }
  },

  // ⑤チャレンジ（9個）
  {
    id: "perfect-lesson",
    name: { ja: "パーフェクト", en: "Perfect" },
    description: { ja: "1レッスンをノーミスクリア", en: "Complete a lesson with no mistakes" },
    icon: "💯",
    category: "challenge",
    condition: { type: "no_mistake_lesson", value: 1 }
  },
  {
    id: "speed-star",
    name: { ja: "スピードスター", en: "Speed Star" },
    description: { ja: "1レッスンを3分以内にクリア", en: "Complete a lesson in under 3 minutes" },
    icon: "🎖️",
    category: "challenge",
    condition: { type: "fast_lesson", value: 180 }
  },
  {
    id: "early-bird",
    name: { ja: "朝活プログラマー", en: "Early Bird Programmer" },
    description: { ja: "朝6時前に学習", en: "Study before 6 AM" },
    icon: "🌅",
    category: "challenge",
    condition: { type: "early_study", value: 6 }
  },
  {
    id: "all-complete",
    name: { ja: "コンプリート", en: "Complete" },
    description: { ja: "全レッスンをクリア", en: "Complete all lessons" },
    icon: "🏅",
    category: "challenge",
    condition: { type: "all_lessons_complete", value: 1 }
  },
  {
    id: "no-hint",
    name: { ja: "ヒント不要", en: "No Hints Needed" },
    description: { ja: "ヒントを使わずに1レッスンクリア", en: "Complete a lesson without using hints" },
    icon: "🧠",
    category: "challenge",
    condition: { type: "no_hint_lesson", value: 1 }
  },
  {
    id: "review-master",
    name: { ja: "復習の達人", en: "Review Master" },
    description: { ja: "同じレッスンを3回クリア", en: "Complete the same lesson 3 times" },
    icon: "🔁",
    category: "challenge",
    condition: { type: "lesson_repeat", value: 3 }
  },
  {
    id: "combo-10",
    name: { ja: "連続正解", en: "Combo" },
    description: { ja: "10問連続で正解", en: "Answer 10 questions correctly in a row" },
    icon: "🎯",
    category: "challenge",
    condition: { type: "consecutive_correct", value: 10 }
  },
  {
    id: "quiz-king",
    name: { ja: "クイズ王", en: "Quiz King" },
    description: { ja: "全クイズレッスンをクリア", en: "Complete all quiz lessons" },
    icon: "📝",
    category: "challenge",
    condition: { type: "all_quiz_complete", value: 1 }
  },
  {
    id: "weekend-coder",
    name: { ja: "週末プログラマー", en: "Weekend Programmer" },
    description: { ja: "土日に学習", en: "Study on a weekend" },
    icon: "🗓️",
    category: "challenge",
    condition: { type: "weekend_study", value: 1 }
  }
];

// カテゴリ名の多言語対応
export const categoryNames: { [key: string]: { ja: string; en: string } } = {
  progress: { ja: "学習進捗", en: "Progress" },
  streak: { ja: "連続学習", en: "Streak" },
  correct: { ja: "正解数", en: "Correct Answers" },
  xp: { ja: "XP・レベル", en: "XP & Level" },
  challenge: { ja: "チャレンジ", en: "Challenge" }
};

