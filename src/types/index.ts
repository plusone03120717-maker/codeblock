export interface Block {
  id: string;
  type: "print" | "variable" | "if";
  label: string;
  params: Record<string, any>;
  pythonCode: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  expectedOutput: string;
}

