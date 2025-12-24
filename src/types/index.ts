export interface Block {
  id: string;
  type: "print" | "variable" | "if";
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
  type: "keyword" | "operator" | "string" | "number" | "variable" | "indent";
  color: string;
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
  // 正解コード（厳密なチェック用）
  correctCode?: string;
  // ユーザーのコードの前に自動で追加されるコード
  prefixCode?: string;
}

