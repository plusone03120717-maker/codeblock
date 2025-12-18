export interface TutorialSlide {
  title: string;
  content: string;
  characterMessage: string;
}

export interface Tutorial {
  lessonId: number;
  characterName: string;
  characterEmoji: string;
  characterImage?: string;
  slides: TutorialSlide[];
}

const tutorials: Tutorial[] = [
  {
    lessonId: 1,
    characterName: "コーディー",
    characterEmoji: "🐍",
    slides: [
      {
        title: "print関数を学ぼう",
        content: "print関数は、Pythonで文字列や変数の値を画面に表示するための関数です。\n\n使い方は簡単です：\nprint(\"表示したい文字列\")\n\nこれで、画面に文字列が表示されます。",
        characterMessage: "print関数を使って、文字列を画面に表示してみましょう！"
      },
      {
        title: "print関数の使い方",
        content: "print関数は、括弧の中に表示したい内容を書きます。\n\n文字列を表示する場合は、引用符（\"）で囲みます。\n\n例：\nprint(\"Hello World\")\n\nこれで「Hello World」が画面に表示されます。",
        characterMessage: "引用符で囲むのを忘れないでね！"
      }
    ]
  },
  {
    lessonId: 2,
    characterName: "コーディー",
    characterEmoji: "🐍",
    slides: [
      {
        title: "変数を使ってみよう",
        content: "変数は、値を保存しておく箱のようなものです。\n\n変数を作るには、変数名 = 値 と書きます。\n\n例：\nname = \"Yuki\"\n\nこれで、nameという変数に「Yuki」という文字列が保存されます。",
        characterMessage: "変数を使うと、値を再利用できるようになるよ！"
      },
      {
        title: "変数の使い方",
        content: "変数に保存した値は、後で使うことができます。\n\n例：\nname = \"Yuki\"\nprint(name)\n\nこれで、変数nameに保存された「Yuki」が表示されます。",
        characterMessage: "変数を使うと、コードが分かりやすくなるね！"
      }
    ]
  },
  {
    lessonId: 3,
    characterName: "コーディー",
    characterEmoji: "🐍",
    slides: [
      {
        title: "if文で条件分岐",
        content: "if文は、条件に応じて処理を分けるための構文です。\n\n使い方：\nif 条件:\n    処理\n\n条件が真（True）のときだけ、処理が実行されます。",
        characterMessage: "if文を使うと、条件によって処理を変えられるよ！"
      },
      {
        title: "if文の例",
        content: "例を見てみましょう：\n\nif age >= 10:\n    print(\"10歳以上です\")\n\nageが10以上のときだけ、「10歳以上です」が表示されます。\n\n注意：処理の前には4つのスペース（インデント）が必要です。",
        characterMessage: "インデントを忘れないでね！"
      }
    ]
  },
];

export function getTutorial(lessonId: number): Tutorial | undefined {
  return tutorials.find((t) => t.lessonId === lessonId);
}
