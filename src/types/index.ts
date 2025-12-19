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
  type: "keyword" | "operator" | "string" | "number" | "variable";
  color: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  expectedOutput: string;
  availableBlocks: WordBlock[];
}

