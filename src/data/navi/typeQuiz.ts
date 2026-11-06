// データ型のミニテストの問題（ステップ9のあと、ホームで1回3問・2026-11-06 依頼主）。
// 1回に「型を当てる」「結果を当てる」「直し方をえらぶ」から1問ずつ。choices の 0番が正解（出すときにならべかえる）
export type TypeQuizQuestion = {
  question: string
  code?: string
  choices: string[]
  explain: string
}

export const TYPE_QUIZ: TypeQuizQuestion[][] = [
  // ① 型を当てる
  [
    { question: '出るのは？', code: 'print(type(25))', choices: ["<class 'int'>", "<class 'str'>", "<class 'float'>"], explain: '25 は点のない数なので、整数（int）だよ。' },
    { question: '出るのは？', code: 'print(type("25"))', choices: ["<class 'str'>", "<class 'int'>", "<class 'float'>"], explain: '" " でかこむと、数に見えても文字（str）になるよ。' },
    { question: '出るのは？', code: 'print(type(0.5))', choices: ["<class 'float'>", "<class 'int'>", "<class 'str'>"], explain: '点のある数は、小数（float）だよ。' },
    { question: '出るのは？', code: 'print(type(True))', choices: ["<class 'bool'>", "<class 'str'>", "<class 'int'>"], explain: 'True と False は bool。" " でかこまないよ。' },
    {
      question: '「10」と入れたとき、出るのは？',
      code: 'toshi = input("なんさい？")\nprint(type(toshi))',
      choices: ["<class 'str'>", "<class 'int'>", "<class 'float'>"],
      explain: 'input の答えは、数を入れても文字（str）だよ。',
    },
  ],
  // ② 結果を当てる（エラーもある）
  [
    { question: '出るのは？', code: 'print("3" + "4")', choices: ['34', '7', 'エラーになる'], explain: '文字どうしの + は、つなぐこと。「3」と「4」がならんで 34 だよ。' },
    { question: '出るのは？', code: 'print(3 + 4)', choices: ['7', '34', 'エラーになる'], explain: '数どうしの + は、たし算だよ。' },
    { question: '出るのは？', code: 'print("3" + 4)', choices: ['エラーになる', '7', '34'], explain: '文字と数は + でつなげないので、TypeError になるよ。' },
    { question: '出るのは？', code: 'print(int("3") + 4)', choices: ['7', '34', 'エラーになる'], explain: 'int( ) で「3」が数の 3 になるので、3 + 4 で 7 だよ。' },
    { question: '出るのは？', code: 'print(7 / 2)', choices: ['3.5', '3', 'エラーになる'], explain: '/ のわり算の答えは、小数（float）になるよ。' },
  ],
  // ③ 直し方をえらぶ
  [
    {
      question: '「TypeError」と出た。どう直す？',
      code: 'toshi = input("なんさい？")\nprint(toshi + 1)',
      choices: ['1行目を toshi = int(input("なんさい？")) にする', '1 を "1" にする', 'print を input にする'],
      explain: 'input の答えは文字なので、int( ) で数にしてから計算しよう。',
    },
    {
      question: '「TypeError」と出た。どう直す？',
      code: 'ten = 80\nprint("点数は" + ten + "点")',
      choices: ['ten を str(ten) にする', 'ten を "ten" にする', '80 を 80.0 にする'],
      explain: '数の 80 を str( ) で文字にすると、+ でつなげるよ。',
    },
    {
      question: '「2.5」と入れたら「2.52.5」と出た。5 にしたい。どう直す？',
      code: 'nagasa = input("長さは？")\nprint(nagasa * 2)',
      choices: ['1行目を nagasa = float(input("長さは？")) にする', '1行目を nagasa = int(input("長さは？")) にする', '2 を "2" にする'],
      explain: '文字 × 数 はくりかえし。2.5 のような小数は float( ) で数にしよう（int( ) だとエラー）。',
    },
    { question: '「5」を整数（int）にする書き方は？', choices: ['int("5")', 'str(5)', 'float("5")'], explain: 'int( ) で整数、float( ) で小数、str( ) で文字にかわるよ。' },
    { question: '数の 10 を文字（str）にする書き方は？', choices: ['str(10)', 'int(10)', '"str(10)"'], explain: 'str( ) で文字になるよ。" " でかこむと、str(10) という文字そのものになってしまうよ。' },
  ],
]

// count 回目（0から）に出す3問。回ごとに入れかえる
export function typeQuizSet(count: number): TypeQuizQuestion[] {
  return TYPE_QUIZ.map((kind, k) => kind[(count + k * 2) % kind.length])
}
