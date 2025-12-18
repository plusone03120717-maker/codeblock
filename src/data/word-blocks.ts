import { WordBlock } from "@/types";

export const lesson1Blocks: WordBlock[] = [
  { 
    id: "print", 
    text: "print", 
    type: "keyword", 
    color: "bg-blue-200 hover:bg-blue-300" 
  },
  { 
    id: "lparen", 
    text: "(", 
    type: "operator", 
    color: "bg-gray-200 hover:bg-gray-300" 
  },
  { 
    id: "rparen", 
    text: ")", 
    type: "operator", 
    color: "bg-gray-200 hover:bg-gray-300" 
  },
  {
    id: "hello",
    text: '"Hello World"',
    type: "string",
    color: "bg-green-200 hover:bg-green-300",
  },
  { 
    id: "newline", 
    text: "↵", 
    type: "operator", 
    color: "bg-pink-200 hover:bg-pink-300" 
  },
];

export const lesson2Blocks: WordBlock[] = [
  { 
    id: "print", 
    text: "print", 
    type: "keyword", 
    color: "bg-blue-200 hover:bg-blue-300" 
  },
  { 
    id: "lparen", 
    text: "(", 
    type: "operator", 
    color: "bg-gray-200 hover:bg-gray-300" 
  },
  { 
    id: "rparen", 
    text: ")", 
    type: "operator", 
    color: "bg-gray-200 hover:bg-gray-300" 
  },
  { 
    id: "name", 
    text: "name", 
    type: "variable", 
    color: "bg-purple-200 hover:bg-purple-300" 
  },
  { 
    id: "equals", 
    text: "=", 
    type: "operator", 
    color: "bg-gray-200 hover:bg-gray-300" 
  },
  { 
    id: "yuki", 
    text: '"Yuki"', 
    type: "string", 
    color: "bg-green-200 hover:bg-green-300" 
  },
  { 
    id: "newline", 
    text: "↵", 
    type: "operator", 
    color: "bg-pink-200 hover:bg-pink-300" 
  },
];

export const lesson3Blocks: WordBlock[] = [
  { 
    id: "if", 
    text: "if", 
    type: "keyword", 
    color: "bg-orange-200 hover:bg-orange-300" 
  },
  { 
    id: "age", 
    text: "age", 
    type: "variable", 
    color: "bg-purple-200 hover:bg-purple-300" 
  },
  { 
    id: "gte", 
    text: ">=", 
    type: "operator", 
    color: "bg-gray-200 hover:bg-gray-300" 
  },
  { 
    id: "ten", 
    text: "10", 
    type: "number", 
    color: "bg-yellow-200 hover:bg-yellow-300" 
  },
  { 
    id: "colon", 
    text: ":", 
    type: "operator", 
    color: "bg-gray-200 hover:bg-gray-300" 
  },
  { 
    id: "print", 
    text: "print", 
    type: "keyword", 
    color: "bg-blue-200 hover:bg-blue-300" 
  },
  { 
    id: "lparen", 
    text: "(", 
    type: "operator", 
    color: "bg-gray-200 hover:bg-gray-300" 
  },
  { 
    id: "rparen", 
    text: ")", 
    type: "operator", 
    color: "bg-gray-200 hover:bg-gray-300" 
  },
  {
    id: "msg",
    text: '"10歳以上です"',
    type: "string",
    color: "bg-green-200 hover:bg-green-300",
  },
  { 
    id: "indent", 
    text: "    ", 
    type: "operator", 
    color: "bg-gray-200 hover:bg-gray-300" 
  },
  { 
    id: "newline", 
    text: "↵", 
    type: "operator", 
    color: "bg-pink-200 hover:bg-pink-300" 
  },
];

export function getLessonBlocks(lessonId: string): WordBlock[] {
  // レッスンIDからmainLessonIdを取得
  const id = parseInt(lessonId, 10);
  if (id === 1) return lesson1Blocks;
  if (id === 2) return lesson2Blocks;
  if (id === 3) return lesson3Blocks;
  return [];
}



