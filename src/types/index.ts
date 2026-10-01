export interface Block {
  id: string;
  type: "print" | "variable" | "if" | "newline";
  label: string;
  params: Record<string, any>;
  pythonCode: string;
}

export interface Lesson {
  id: string;
  unitNumber: number;
  subNumber: number;
  title: string;
  description: string;
  difficulty: "かんたん" | "ふつう" | "むずかしい";
  expectedOutput?: string; // オプショナルに変更（後方互換性のため）
}

export interface WordBlock {
  id: string;
  text: string;
  type: "string" | "number" | "function" | "variable" | "keyword" | "operator" | "indent" | "bracket" | "newline" | "quote" | "text" | "print" | "if" | "comparison" | "boolean" | "colon" | "list" | "dict" | "comma" | "equals" | "return" | "def" | "param" | "loop" | "range" | "index" | "separator";
  color: string;
}

/**
 * 解答コードが満たすべき条件。
 * 出力が一致していても、このレッスンで学ぶ文法を使っていなければ不正解にする。
 */
export interface CodeRule {
  /** すべて含まれている必要がある文字列 */
  requires?: string[];
  /** 含まれていてはいけない文字列 */
  forbids?: string[];
  /** どれか1つが含まれていればよい文字列 */
  requiresAny?: string[];
  /** マッチする必要がある正規表現（文字列で記述する） */
  requiresPattern?: string;
  /** 条件を満たさなかったときに子どもに見せるメッセージ */
  message: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  expectedOutput: string;
  availableBlocks: WordBlock[];
  // 選択式問題用（オプション）
  type?: "blocks" | "quiz";
  codeToRead?: string;
  choices?: string[];
  correctAnswer?: number;
  // 期待出力を隠すフラグ（オプション）
  hideExpectedOutput?: boolean;
  // 正解時の説明（オプション）
  explanation?: string;
  // 不正解時に見せるヒント（選択式で使う）
  hint?: string;
  // 正解コード（厳密なチェック用・行き詰まったときの提示用）
  correctCode?: string;
  // ユーザーのコードの前に自動で追加されるコード
  prefixCode?: string;
  // prefixCode の見出し（省略時は中身から自動判定）
  prefixLabel?: string;
  // このミッション固有の構造チェック（レッスン既定のルールより優先される）
  rules?: CodeRule[];
}

// デイリーチャレンジ関連の型定義をエクスポート
export type {
  DailyChallengeState,
  DailyChallengeQuestion,
  DailyChallengeStats,
  DailyChallengeBadge,
  DailyChallengeBadgeType,
} from './dailyChallenge';

