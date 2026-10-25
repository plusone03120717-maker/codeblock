// Python ナビ（新しいコース）の「仕上げ」31-1〜。31-N はステップ N の仕上げ。
// 動画で習ったことだけを5問で確かめる（今までの 10問のレッスンのかわり。2026-10-25 依頼主と決定）。
// 形は「結果を予想」「まちがいを直す」「ならべかえ」をまぜる。選択肢はならびかえされないので、正解の位置は問題ごとに変える。自分で打つ練習はナビのエディターでやる。
// 今までの生徒のレッスン一覧には出さない（getLesson などで見つかるだけ）。答えは Python で動かして確かめてある。
import type { Lesson, Mission, WordBlock } from "@/types";
import type { LessonTutorial } from "@/data/tutorials";

const B = {
  print: { id: "print", text: "print", type: "function", color: "bg-yellow-200" },
  lp: { id: "lparen", text: "(", type: "bracket", color: "bg-gray-200" },
  rp: { id: "rparen", text: ")", type: "bracket", color: "bg-gray-200" },
  comma: { id: "comma", text: ",", type: "separator", color: "bg-purple-200" },
} satisfies Record<string, WordBlock>;
const num = (n: string): WordBlock => ({ id: `n${n}`, text: n, type: "number", color: "bg-yellow-100" });
const op = (o: string, id: string): WordBlock => ({ id, text: o, type: "operator", color: "bg-orange-200" });
const str = (s: string, id: string): WordBlock => ({ id, text: `"${s}"`, type: "string", color: "bg-green-200" });

export const finishLessons: Lesson[] = [
  {
    id: "31-1",
    unitNumber: 31,
    subNumber: 1,
    title: "ステップ1の仕上げ",
    description: "print・計算・\" \"・カンマ・エラーを、5問でたしかめよう",
    difficulty: "かんたん",
  },
];

export const finishMissions: Record<string, Mission[]> = {
  "31-1": [
    {
      id: 1,
      type: "quiz",
      title: "結果を予想しよう",
      description: "このコードを実行すると、何が出る？",
      codeToRead: "print(2 + 3)",
      choices: ["2 + 3", "5", "エラーになる"],
      correctAnswer: 1,
      expectedOutput: "5",
      hint: "\" \" でかこんであるかな？",
      explanation: "\" \" でかこんでいないので、コンピューターが計算して 5 を出すよ。",
      availableBlocks: [],
    },
    {
      id: 2,
      type: "quiz",
      title: "カンマのときは？",
      description: "このコードを実行すると、何が出る？",
      codeToRead: "print(\"おかしは\", 3 * 4)",
      choices: ["おかしは 3 * 4", "おかしは12", "おかしは 12", "エラーになる"],
      correctAnswer: 2,
      expectedOutput: "おかしは 12",
      hint: "3 * 4 は \" \" の外。カンマのところには何が入るかな？",
      explanation: "3 * 4 は計算されて 12。カンマでならべると、あいだにスペースが1つ入るよ。",
      availableBlocks: [],
    },
    {
      id: 3,
      type: "quiz",
      title: "エラーを直そう",
      description: "実行したら「SyntaxError: '(' was never closed」と出た。どう直す？",
      codeToRead: "print(\"こんにちは\"",
      choices: ["さいごに ) を足す", "さいごに \" を足す", "print を Print にする"],
      correctAnswer: 0,
      expectedOutput: "さいごに ) を足す",
      hint: "was never closed は「とじていない」という意味だよ。",
      explanation: "( と ) は2つでセット。とじかっこ ) が足りないと、このエラーが出るよ。",
      availableBlocks: [],
    },
    {
      id: 4,
      title: "3 × 4 を計算しよう",
      description: "3 × 4 の答えを表示しよう。かけ算の記号に気をつけてね！",
      expectedOutput: "12",
      correctCode: "print(3 * 4)",
      rules: [{ requires: ["*"], message: "かけ算は × ではなく、アスタリスク * で書くよ！" }],
      availableBlocks: [B.print, B.lp, B.rp, num("3"), num("4"), op("*", "times"), op("×", "batsu")],
    },
    {
      id: 5,
      title: "「こたえは 6」と出そう",
      description: "カンマで、文字と計算の答えをならべよう。6 は 1 + 5 の計算で出してね！",
      expectedOutput: "こたえは 6",
      correctCode: "print(\"こたえは\", 1 + 5)",
      rules: [
        { forbids: ["\"1 + 5\""], message: "\" \" でかこむと、計算されずに文字のまま出るよ！" },
        { requires: [","], message: "カンマ（,）で、文字と答えをならべよう！" },
        { requires: ["1 + 5"], message: "6 は、1 + 5 の計算で出そう！" },
      ],
      availableBlocks: [B.print, B.lp, B.rp, str("こたえは", "kotae"), B.comma, num("1"), op("+", "plus"), num("5"), str("1 + 5", "q15")],
    },
  ],
};

export const finishTutorials: LessonTutorial[] = [
  {
    lessonId: "31-1",
    characterName: "いちか",
    characterEmoji: "🙂",
    characterImage: "/navi/bob_smile.webp",
    slides: [
      {
        title: "5問で仕上げよう",
        content: "動画 #2 で習ったことを、5問でたしかめます。結果を予想する問題・エラーを直す問題・ブロックをならべる問題があります。",
        characterMessage: "わからなくなったら、ヒントを見てね。",
        codeExample: {
          good: "print(\"みかんは\", 4 + 4)  # みかんは 8",
        },
      },
    ],
  },
];

// ナビの画面での呼び名。仕上げは「仕上げ5問」、ほかは今までどおり「CodeBlock 1-1」
export const isFinishLesson = (id: string) => id.startsWith("31-");
export const naviLessonLabel = (id: string) => (isFinishLesson(id) ? "仕上げ5問" : `CodeBlock ${id}`);
