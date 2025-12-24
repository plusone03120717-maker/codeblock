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
    title: "文字列を繰り返そう",
    description: "「*」を使って文字列を繰り返す方法を学ぼう",
    difficulty: "かんたん",
  },
  {
    id: "1-6",
    unitNumber: 1,
    subNumber: 6,
    title: "余りを計算しよう",
    description: "「%」を使って割り算の余りを求める方法を学ぼう",
    difficulty: "ふつう",
  },
  {
    id: "1-7",
    unitNumber: 1,
    subNumber: 7,
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
    title: "データ型を知ろう",
    description: "文字列・数値・真偽値の違いを学ぼう",
    difficulty: "ふつう",
  },
  {
    id: "3-2",
    unitNumber: 3,
    subNumber: 2,
    title: "型を調べよう",
    description: "type()を使ってデータの型を確認しよう",
    difficulty: "ふつう",
  },
  {
    id: "3-3",
    unitNumber: 3,
    subNumber: 3,
    title: "型を変換しよう",
    description: "int()やstr()を使って型を変換しよう",
    difficulty: "ふつう",
  },
  {
    id: "3-4",
    unitNumber: 3,
    subNumber: 4,
    title: "データ型クイズ！",
    description: "コードを読んで型を予測しよう",
    difficulty: "ふつう",
  },
  {
    id: "4-1",
    unitNumber: 4,
    subNumber: 1,
    title: "条件分岐を知ろう",
    description: "if文の基本を学ぼう",
    difficulty: "ふつう",
  },
  {
    id: "4-2",
    unitNumber: 4,
    subNumber: 2,
    title: "比較演算子を使おう",
    description: "2つの値を比べてみよう",
    difficulty: "ふつう",
  },
  {
    id: "4-3",
    unitNumber: 4,
    subNumber: 3,
    title: "elseを使おう",
    description: "条件がFalseの時の処理を書こう",
    difficulty: "ふつう",
  },
  {
    id: "4-4",
    unitNumber: 4,
    subNumber: 4,
    title: "elifを使おう",
    description: "複数の条件で分岐しよう",
    difficulty: "ふつう",
  },
  {
    id: "4-5",
    unitNumber: 4,
    subNumber: 5,
    title: "論理演算子を使おう",
    description: "and, or, notで条件を組み合わせよう",
    difficulty: "ふつう",
  },
  {
    id: "4-6",
    unitNumber: 4,
    subNumber: 6,
    title: "条件分岐クイズ！",
    description: "コードを読んで出力を予測しよう",
    difficulty: "ふつう",
  },
  {
    id: "5-1",
    unitNumber: 5,
    subNumber: 1,
    title: "繰り返しを知ろう",
    description: "for文とrange()の基本を学ぼう",
    difficulty: "かんたん",
  },
  {
    id: "5-2",
    unitNumber: 5,
    subNumber: 2,
    title: "何回繰り返す？",
    description: "range()の数字を変えてみよう",
    difficulty: "かんたん",
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
