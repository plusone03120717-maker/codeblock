export interface Lesson {
  id: string           // "1-1", "1-2" のような形式
  unitNumber: number   // ユニット番号（1, 2, 3...）
  subNumber: number    // サブ番号（1, 2, 3...）
  title: string
  description: string
  difficulty: "かんたん" | "ふつう" | "むずかしい"
}

export const lessons: Lesson[] = [
  {
    id: "1-1",
    unitNumber: 1,
    subNumber: 1,
    title: "文字列を表示しよう",
    description: "print()を使って文字を画面に表示する方法を学ぼう",
    difficulty: "かんたん",
  },
  {
    id: "1-2",
    unitNumber: 1,
    subNumber: 2,
    title: "数字を表示しよう",
    description: "print()を使って数字を表示する方法を学ぼう",
    difficulty: "かんたん",
  },
  {
    id: "1-3",
    unitNumber: 1,
    subNumber: 3,
    title: "四則演算を学ぼう",
    description: "足し算、引き算、掛け算、割り算をやってみよう",
    difficulty: "かんたん",
  },
  {
    id: "1-4",
    unitNumber: 1,
    subNumber: 4,
    title: "文字列をつなげよう",
    description: "「+」を使って文字列を連結する方法を学ぼう",
    difficulty: "かんたん",
  },
  {
    id: "1-5",
    unitNumber: 1,
    subNumber: 5,
    title: "余りを計算しよう",
    description: "「%」を使って割り算の余りを求める方法を学ぼう",
    difficulty: "ふつう",
  },
  {
    id: "1-6",
    unitNumber: 1,
    subNumber: 6,
    title: "複数の値を表示しよう",
    description: "print()で複数の値をまとめて表示する方法を学ぼう",
    difficulty: "ふつう",
  },
  {
    id: "2-1",
    unitNumber: 2,
    subNumber: 1,
    title: "変数に名前をつけよう",
    description: "データを入れる「箱」に名前をつける方法を学ぼう",
    difficulty: "かんたん",
  },
  {
    id: "2-2",
    unitNumber: 2,
    subNumber: 2,
    title: "変数を表示しよう",
    description: "変数の中身をprint()で表示する方法を学ぼう",
    difficulty: "かんたん",
  },
  {
    id: "2-3",
    unitNumber: 2,
    subNumber: 3,
    title: "変数を計算に使おう",
    description: "数字を変数に入れて計算してみよう",
    difficulty: "かんたん",
  },
  {
    id: "2-4",
    unitNumber: 2,
    subNumber: 4,
    title: "変数の中身を変えよう",
    description: "変数の値を上書きする方法を学ぼう",
    difficulty: "ふつう",
  },
  {
    id: "2-5",
    unitNumber: 2,
    subNumber: 5,
    title: "変数同士を組み合わせよう",
    description: "複数の変数を使って計算や連結をしてみよう",
    difficulty: "ふつう",
  },
  {
    id: "2-6",
    unitNumber: 2,
    subNumber: 6,
    title: "変数クイズに挑戦！",
    description: "コードを読んで出力を予測しよう",
    difficulty: "ふつう",
  },
  {
    id: "3-1",
    unitNumber: 3,
    subNumber: 1,
    title: "条件分岐を学ぼう",
    description: "if文を使って条件によって処理を変える方法を学ぼう",
    difficulty: "むずかしい",
  },
]

// レッスンIDでレッスンを取得
export function getLesson(id: string): Lesson | undefined {
  return lessons.find(l => l.id === id)
}

// 次のレッスンを取得
export function getNextLesson(currentId: string): Lesson | undefined {
  const currentIndex = lessons.findIndex(l => l.id === currentId)
  if (currentIndex === -1 || currentIndex === lessons.length - 1) {
    return undefined
  }
  return lessons[currentIndex + 1]
}
