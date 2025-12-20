export interface LessonTutorial {
  lessonId: string;
  characterName: string;
  characterEmoji: string;
  characterImage?: string;
  slides?: Array<{
    title: string;
    content: string;
    characterMessage: string;
    codeExample?: {
      good?: string;
      bad?: string;
    };
    image?: string;
  }>;
}

export const tutorials: LessonTutorial[] = [
  {
    lessonId: "1-1",
    characterName: "コーディ",
    characterEmoji: "🐍",
    characterImage: "/images/characters/cody.png",
    slides: [
      {
        title: "print()関数とは？",
        content: "print()は、画面に文字を表示するための命令だ。",
        characterMessage: "よし、一緒にPythonの基本を学ぼう！俺が全力でサポートする！",
      },
      {
        title: "print()の使い方",
        content: "print()の中に、表示したい文字を \" \" で囲んで入れるんだ。\" \" は「クォーテーション」と読むよ。",
        characterMessage: "まずは \"Hello World\" を表示させてみよう！これがプログラミングの第一歩だ！",
        codeExample: {
          good: "print(\"Hello World\")",
        },
      },
      {
        title: "改行について",
        content: "プログラムは1行ずつ書いていくんだ。print()を2回使うと、2つのメッセージを表示できるよ。改行はスペースキーで行うことができる。codeblockの中では、改行ブロックを使う。",
        characterMessage: "↵マークは「改行」を意味する。次の行に移るときに使うんだ！",
        codeExample: {
          good: "print(\"Hello\")\nprint(\"World\")",
        },
        image: "/images/blocks/newline.png",
      },
      {
        title: "改行を忘れるとエラーになる！",
        content: "print()を続けて書くときは、必ず改行を入れよう。同じ行に2つの命令を書くとエラーになってしまうよ。",
        characterMessage: "↵を使って改行するのを忘れないでね！",
        codeExample: {
          bad: "print(\"Hello\")print(\"World\")",
          good: "print(\"Hello\")\nprint(\"World\")",
        },
      },
      {
        title: "さあ、挑戦だ！",
        content: "これから実際にコードを組み立ててもらう。",
        characterMessage: "準備はいいか？腕試しの時間だ！",
      },
    ],
  },
  {
    lessonId: "1-2",
    characterName: "コーディ",
    characterEmoji: "🐍",
    characterImage: "/images/characters/cody.png",
    slides: [
      {
        title: "数字を表示しよう",
        content: "print()は文字だけじゃなく、数字も表示できるんだ。",
        characterMessage: "今度は数字を表示する方法を学ぼう！",
      },
      {
        title: "数字はそのまま書く",
        content: "数字を表示するときは、\" \" で囲まなくていいんだ。そのまま数字を書けばOK！",
        characterMessage: "文字は \" \" が必要だけど、数字はいらないんだ！",
        codeExample: {
          good: "print(123)",
        },
      },
      {
        title: "文字と数字の違い",
        content: "\" \" で囲むと「文字」、囲まないと「数字」として扱われるよ。",
        characterMessage: "\"123\" は文字、123 は数字。見た目は同じでも違うんだ！",
        codeExample: {
          good: "print(\"123\")  # 文字として表示\nprint(123)    # 数字として表示",
        },
      },
      {
        title: "さあ、挑戦だ！",
        content: "数字を表示するミッションに挑戦しよう！",
        characterMessage: "準備はいいか？やってみよう！",
      },
    ],
  },
  {
    lessonId: "1-3",
    characterName: "コーディ",
    characterEmoji: "🐍",
    characterImage: "/images/characters/cody.png",
    slides: [
      {
        title: "四則演算を学ぼう",
        content: "Pythonでは、計算もできるんだ。足し算、引き算、掛け算、割り算をやってみよう！",
        characterMessage: "プログラミングで計算ができるようになるぞ！",
      },
      {
        title: "足し算と引き算",
        content: "+ で足し算、- で引き算ができるよ。",
        characterMessage: "これは算数と同じだね！",
        codeExample: {
          good: "print(5 + 3)  # 結果: 8\nprint(10 - 4) # 結果: 6",
        },
      },
      {
        title: "掛け算と割り算",
        content: "* で掛け算、/ で割り算ができるよ。×や÷ではないから注意！",
        characterMessage: "キーボードにある記号を使うんだ！",
        codeExample: {
          good: "print(4 * 3)  # 結果: 12\nprint(10 / 2) # 結果: 5.0",
        },
      },
      {
        title: "計算の組み合わせ",
        content: "複数の計算を組み合わせることもできるよ。( ) を使って計算の順番を指定できるんだ。",
        characterMessage: "算数で習った計算の順番と同じだ！",
        codeExample: {
          good: "print(2 + 3 * 4)   # 結果: 14\nprint((2 + 3) * 4) # 結果: 20",
        },
      },
      {
        title: "さあ、挑戦だ！",
        content: "四則演算のミッションに挑戦しよう！",
        characterMessage: "計算、できるかな？やってみよう！",
      },
    ],
  },
  {
    lessonId: "2-1",
    characterName: "ボックス",
    characterEmoji: "🤖",
    slides: [
      {
        title: "変数とは？",
        content: "変数は、データを入れておく箱のようなものです。",
        characterMessage: "変数を使うと、データを保存して何度も使えるようになるよ！",
      },
      {
        title: "変数の使い方",
        content: "変数には名前をつけて、= で値を入れます。",
        characterMessage: "例えば、name = \"Yuki\" のように書くんだ。",
        codeExample: {
          good: "name = \"Yuki\"\nprint(name)",
        },
      },
      {
        title: "やってみよう！",
        content: "実際に変数を使ってみましょう。",
        characterMessage: "準備はいい？さあ、始めよう！",
      },
    ],
  },
  {
    lessonId: "3-1",
    characterName: "ウィズ",
    characterEmoji: "🦉",
    slides: [
      {
        title: "条件分岐とは？",
        content: "if文は、条件によって処理を変える命令です。",
        characterMessage: "条件によって違う結果を出せるようになるよ。",
      },
      {
        title: "if文の書き方",
        content: "if 条件: の後にインデント（字下げ）をして処理を書きます。",
        characterMessage: "条件が正しい時だけ、中の処理が実行されるんだ。",
        codeExample: {
          good: "if age >= 10:\n    print(\"10歳以上です\")",
        },
      },
      {
        title: "挑戦してみよう！",
        content: "実際に条件分岐を使ってみましょう。",
        characterMessage: "さあ、やってみよう！",
      },
    ],
  },
];

export function getTutorial(lessonId: string): LessonTutorial | undefined {
  return tutorials.find((t) => t.lessonId === lessonId);
}
