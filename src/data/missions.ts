export interface WordBlock {
  id: string
  text: string
  type: 'keyword' | 'operator' | 'string' | 'number' | 'variable'
  color: string
}

export interface Mission {
  id: number
  title: string
  description: string
  expectedOutput: string
  availableBlocks: WordBlock[]
  hint?: string
}

export interface LessonMissions {
  lessonId: number
  missions: Mission[]
}

export const lessonMissions: LessonMissions[] = [
  {
    lessonId: 1,
    missions: [
      {
        id: 1,
        title: 'Hello Worldを表示しよう',
        description: '用意されたブロックをクリックするだけ！',
        expectedOutput: 'Hello World',
        availableBlocks: [
          { id: 'complete', text: 'print("Hello World")', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
        ],
      },
      {
        id: 2,
        title: 'printと文字列を組み合わせよう',
        description: '2つのブロックを順番に並べてみよう',
        expectedOutput: 'Hello World',
        availableBlocks: [
          { id: 'print', text: 'print', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
          { id: 'args', text: '("Hello World")', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
        ],
      },
      {
        id: 3,
        title: '括弧を分けてみよう',
        description: '開き括弧と閉じ括弧を別々のブロックにしてみよう',
        expectedOutput: 'Hello World',
        availableBlocks: [
          { id: 'print', text: 'print', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
          { id: 'lparen', text: '(', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'string', text: '"Hello World"', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'rparen', text: ')', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
        ],
      },
      {
        id: 4,
        title: 'クォートを分けよう',
        description: '文字列を囲むダブルクォート " を別のブロックにしてみよう',
        expectedOutput: 'Hello World',
        availableBlocks: [
          { id: 'print', text: 'print', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
          { id: 'lparen', text: '(', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'quote1', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'text', text: 'Hello World', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'quote2', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'rparen', text: ')', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
        ],
      },
      {
        id: 5,
        title: '単語を分けてみよう',
        description: 'Hello と World を別々のブロックにしてみよう',
        expectedOutput: 'Hello World',
        availableBlocks: [
          { id: 'print', text: 'print', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
          { id: 'lparen', text: '(', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'quote1', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'hello', text: 'Hello', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'space', text: ' ', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'world', text: 'World', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'quote2', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'rparen', text: ')', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
        ],
      },
      {
        id: 6,
        title: '別の文字列を作ろう',
        description: '今度は "Python Programming" を作ってみよう',
        expectedOutput: 'Python Programming',
        availableBlocks: [
          { id: 'print', text: 'print', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
          { id: 'lparen', text: '(', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'quote1', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'python', text: 'Python', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'space', text: ' ', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'programming', text: 'Programming', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'quote2', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'rparen', text: ')', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
        ],
      },
      {
        id: 7,
        title: '2行表示しよう',
        description: '改行ブロック（↵）を使って2行に分けて表示しよう',
        expectedOutput: 'Hello\nWorld',
        availableBlocks: [
          { id: 'print', text: 'print', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
          { id: 'lparen', text: '(', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'quote', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'hello', text: 'Hello', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'world', text: 'World', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'rparen', text: ')', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'newline', text: '↵', type: 'operator', color: 'bg-pink-200 hover:bg-pink-300' },
        ],
      },
      {
        id: 8,
        title: '3つの単語を組み合わせよう',
        description: '"I love Python" を作ってみよう',
        expectedOutput: 'I love Python',
        availableBlocks: [
          { id: 'print', text: 'print', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
          { id: 'lparen', text: '(', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'quote1', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'i', text: 'I', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'space1', text: ' ', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'love', text: 'love', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'space2', text: ' ', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'python', text: 'Python', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'quote2', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'rparen', text: ')', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
        ],
      },
      {
        id: 9,
        title: '記号を含む文字列を作ろう',
        description: '"Hello, World!" を作ってみよう（カンマと感嘆符を使うよ）',
        expectedOutput: 'Hello, World!',
        availableBlocks: [
          { id: 'print', text: 'print', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
          { id: 'lparen', text: '(', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'quote1', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'hello', text: 'Hello', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'comma', text: ',', type: 'string', color: 'bg-yellow-200 hover:bg-yellow-300' },
          { id: 'space', text: ' ', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'world', text: 'World', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'exclaim', text: '!', type: 'string', color: 'bg-yellow-200 hover:bg-yellow-300' },
          { id: 'quote2', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'rparen', text: ')', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
        ],
      },
      {
        id: 10,
        title: '総合問題：長い文章を作ろう',
        description: '"Welcome to Python Programming!" を完成させよう',
        expectedOutput: 'Welcome to Python Programming!',
        availableBlocks: [
          { id: 'print', text: 'print', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
          { id: 'lparen', text: '(', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'quote1', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'welcome', text: 'Welcome', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'space1', text: ' ', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'to', text: 'to', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'space2', text: ' ', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'python', text: 'Python', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'space3', text: ' ', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'programming', text: 'Programming', type: 'string', color: 'bg-green-200 hover:bg-green-300' },
          { id: 'exclaim', text: '!', type: 'string', color: 'bg-yellow-200 hover:bg-yellow-300' },
          { id: 'quote2', text: '"', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
          { id: 'rparen', text: ')', type: 'operator', color: 'bg-gray-200 hover:bg-gray-300' },
        ],
      },
    ],
  },
  {
    lessonId: 2,
    missions: [
      {
        id: 1,
        title: '変数を使ってみよう',
        description: 'name = "Yuki" を作ってみよう',
        expectedOutput: 'Yuki',
        availableBlocks: [
          { id: 'name-yuki', text: 'name = "Yuki"\nprint(name)', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
        ],
      },
    ],
  },
  {
    lessonId: 3,
    missions: [
      {
        id: 1,
        title: 'if文を使ってみよう',
        description: '年齢が10歳以上かチェックしよう',
        expectedOutput: '10歳以上です',
        availableBlocks: [
          { id: 'if-age', text: 'age = 15\nif age >= 10:\n    print("10歳以上です")', type: 'keyword', color: 'bg-blue-200 hover:bg-blue-300' },
        ],
      },
    ],
  },
]

export function getLessonMissions(lessonId: number): Mission[] | undefined {
  return lessonMissions.find(lm => lm.lessonId === lessonId)?.missions
}

export function getMission(lessonId: number, missionId: number): Mission | undefined {
  const missions = getLessonMissions(lessonId)
  return missions?.find(m => m.id === missionId)
}
