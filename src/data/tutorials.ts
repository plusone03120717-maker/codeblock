export interface TutorialSlide {
  title: string
  content: string
  characterMessage: string
}

export interface LessonTutorial {
  lessonId: number
  characterName: string
  characterEmoji: string
  characterImage?: string
  slides: TutorialSlide[]
}

export const tutorials: LessonTutorial[] = [
  {
    lessonId: 1,
    characterName: 'コーディ（Cody）',
    characterEmoji: '🐍',
    slides: [
      {
        title: 'print()関数とは？',
        content: 'print()は、画面に文字を表示するための命令だ。',
        characterMessage: 'よし、一緒にPythonの基本を学ぼう！俺が全力でサポートする！',
      },
      {
        title: 'print()の使い方',
        content: 'print()の中に、表示したい文字を " " で囲んで入れるんだ。',
        characterMessage: 'まずは "Hello World" を表示させてみよう！これがプログラミングの第一歩だ！',
      },
      {
        title: 'さあ、挑戦だ！',
        content: 'これから実際にコードを組み立ててもらう。',
        characterMessage: '準備はいいか？腕試しの時間だ！',
      },
    ],
  },
  {
    lessonId: 2,
    characterName: 'ボックス',
    characterEmoji: '🤖',
    slides: [
      {
        title: '変数とは？',
        content: '変数は、データを入れておく箱のようなものです。',
        characterMessage: '変数を使うと、データを保存して何度も使えるようになるよ！',
      },
      {
        title: '変数の使い方',
        content: '変数には名前をつけて、= で値を入れます。',
        characterMessage: '例えば、name = "Yuki" のように書くんだ。',
      },
      {
        title: 'やってみよう！',
        content: '実際に変数を使ってみましょう。',
        characterMessage: '準備はいい？さあ、始めよう！',
      },
    ],
  },
  {
    lessonId: 3,
    characterName: 'ウィズ',
    characterEmoji: '🦉',
    slides: [
      {
        title: '条件分岐とは？',
        content: 'if文は、条件によって処理を変える命令です。',
        characterMessage: '条件によって違う結果を出せるようになるよ。',
      },
      {
        title: 'if文の書き方',
        content: 'if 条件: の後にインデント（字下げ）をして処理を書きます。',
        characterMessage: '条件が正しい時だけ、中の処理が実行されるんだ。',
      },
      {
        title: '挑戦してみよう！',
        content: '実際に条件分岐を使ってみましょう。',
        characterMessage: 'さあ、やってみよう！',
      },
    ],
  },
]

export function getTutorial(lessonId: number): LessonTutorial | undefined {
  return tutorials.find(t => t.lessonId === lessonId)
}
