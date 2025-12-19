import { Mission, WordBlock } from "@/types";

// ミッションデータをレッスンIDで管理
const missionsByLesson: Record<string, Mission[]> = {
  "1-1": [
    {
      id: 1,
      title: "Hello Worldを表示しよう",
      description: "print()を使って、\"Hello World\" を表示してみよう！",
      expectedOutput: "Hello World",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "hello", text: '"Hello World"', type: "string", color: "bg-green-200 hover:bg-green-300" },
      ],
    },
    {
      id: 2,
      title: "文字列を表示しよう",
      description: "print()を使って、好きな文字列を表示してみよう！",
      expectedOutput: "Python",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "python", text: '"Python"', type: "string", color: "bg-green-200 hover:bg-green-300" },
      ],
    },
    {
      id: 3,
      title: "複数の文字列を表示しよう",
      description: "print()を2回使って、2つのメッセージを表示してみよう！",
      expectedOutput: "Hello\nWorld",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "hello", text: '"Hello"', type: "string", color: "bg-green-200 hover:bg-green-300" },
        { id: "world", text: '"World"', type: "string", color: "bg-green-200 hover:bg-green-300" },
        { id: "newline", text: "↵", type: "operator", color: "bg-pink-200 hover:bg-pink-300" },
      ],
    },
  ],
  "1-2": [
    {
      id: 1,
      title: "数字を表示しよう",
      description: "print()を使って、数字の 42 を表示してみよう！",
      expectedOutput: "42",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "num42", text: "42", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
      ],
    },
    {
      id: 2,
      title: "100を表示しよう",
      description: "数字の 100 を表示してみよう！",
      expectedOutput: "100",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "num100", text: "100", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
      ],
    },
    {
      id: 3,
      title: "文字と数字の違い",
      description: "数字の 7 を表示してみよう！（\" \" なしで）",
      expectedOutput: "7",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "num7", text: "7", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "str7", text: '"7"', type: "string", color: "bg-green-200 hover:bg-green-300" },
      ],
    },
  ],
  "1-3": [
    {
      id: 1,
      title: "足し算をしよう",
      description: "3 + 5 の計算結果を表示してみよう！",
      expectedOutput: "8",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "num3", text: "3", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "num5", text: "5", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "plus", text: "+", type: "operator", color: "bg-orange-200 hover:bg-orange-300" },
      ],
    },
    {
      id: 2,
      title: "引き算をしよう",
      description: "10 - 4 の計算結果を表示してみよう！",
      expectedOutput: "6",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "num10", text: "10", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "num4", text: "4", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "minus", text: "-", type: "operator", color: "bg-orange-200 hover:bg-orange-300" },
      ],
    },
    {
      id: 3,
      title: "掛け算をしよう",
      description: "6 * 7 の計算結果を表示してみよう！",
      expectedOutput: "42",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "num6", text: "6", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "num7", text: "7", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "multi", text: "*", type: "operator", color: "bg-orange-200 hover:bg-orange-300" },
      ],
    },
    {
      id: 4,
      title: "割り算をしよう",
      description: "20 / 4 の計算結果を表示してみよう！",
      expectedOutput: "5.0",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "num20", text: "20", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "num4", text: "4", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "div", text: "/", type: "operator", color: "bg-orange-200 hover:bg-orange-300" },
      ],
    },
    {
      id: 5,
      title: "組み合わせ計算",
      description: "(2 + 3) * 4 の計算結果を表示してみよう！",
      expectedOutput: "20",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen1", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "lparen2", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen1", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen2", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "num2", text: "2", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "num3", text: "3", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "num4", text: "4", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "plus", text: "+", type: "operator", color: "bg-orange-200 hover:bg-orange-300" },
        { id: "multi", text: "*", type: "operator", color: "bg-orange-200 hover:bg-orange-300" },
      ],
    },
  ],
  "2-1": [
    {
      id: 1,
      title: "変数に値を保存しよう",
      description: "nameという変数に\"Yuki\"を保存して、表示してみよう！",
      expectedOutput: "Yuki",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "name", text: "name", type: "variable", color: "bg-purple-200 hover:bg-purple-300" },
        { id: "equals", text: "=", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "yuki", text: '"Yuki"', type: "string", color: "bg-green-200 hover:bg-green-300" },
        { id: "newline", text: "↵", type: "operator", color: "bg-pink-200 hover:bg-pink-300" },
      ],
    },
    {
      id: 2,
      title: "変数を使って計算しよう",
      description: "ageという変数に10を保存して、表示してみよう！",
      expectedOutput: "10",
      availableBlocks: [
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "age", text: "age", type: "variable", color: "bg-purple-200 hover:bg-purple-300" },
        { id: "equals", text: "=", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "num10", text: "10", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "newline", text: "↵", type: "operator", color: "bg-pink-200 hover:bg-pink-300" },
      ],
    },
  ],
  "3-1": [
    {
      id: 1,
      title: "条件分岐を使おう",
      description: "ageが10以上なら\"10歳以上です\"を表示してみよう！",
      expectedOutput: "10歳以上です",
      availableBlocks: [
        { id: "if", text: "if", type: "keyword", color: "bg-orange-200 hover:bg-orange-300" },
        { id: "age", text: "age", type: "variable", color: "bg-purple-200 hover:bg-purple-300" },
        { id: "gte", text: ">=", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "ten", text: "10", type: "number", color: "bg-yellow-200 hover:bg-yellow-300" },
        { id: "colon", text: ":", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "print", text: "print", type: "keyword", color: "bg-blue-200 hover:bg-blue-300" },
        { id: "lparen", text: "(", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "rparen", text: ")", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "msg", text: '"10歳以上です"', type: "string", color: "bg-green-200 hover:bg-green-300" },
        { id: "indent", text: "    ", type: "operator", color: "bg-gray-200 hover:bg-gray-300" },
        { id: "newline", text: "↵", type: "operator", color: "bg-pink-200 hover:bg-pink-300" },
      ],
    },
  ],
};

// レッスンのミッション一覧を取得
export function getLessonMissions(lessonId: string): Mission[] | undefined {
  return missionsByLesson[lessonId];
}

// 特定のミッションを取得
export function getMission(lessonId: string, missionId: number): Mission | undefined {
  const missions = missionsByLesson[lessonId];
  if (!missions) return undefined;
  return missions.find((m) => m.id === missionId);
}
