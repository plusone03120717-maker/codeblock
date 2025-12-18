export interface Lesson {
  id: number
  title: string
  description: string
  expectedOutput: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'print関数を学ぼう',
    description: 'print関数を使って、文字列を画面に表示する方法を学びます。',
    expectedOutput: 'Hello World',
    difficulty: 'easy',
  },
  {
    id: 2,
    title: '変数を使ってみよう',
    description: '変数を使って、値を保存したり、再利用したりする方法を学びます。',
    expectedOutput: 'Yuki',
    difficulty: 'easy',
  },
  {
    id: 3,
    title: 'if文で条件分岐',
    description: 'if文を使って、条件に応じて処理を分ける方法を学びます。',
    expectedOutput: '10歳以上です',
    difficulty: 'medium',
  },
]


