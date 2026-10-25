// Python ナビ（新しいコース）のカリキュラムの形

export type NaviSection = {
  title: string
  // 動画のその場面が始まる秒（作品の回は 0）
  start: number
  // その見出しで動画が打つコード（見くらべ・ヒント用）
  code: string
  // 実行したとき出力に出るはずの行
  expected: string[]
  // コードにふくまれているべき文字（結果だけ合わせるのを防ぐ）
  mustUse?: string[]
  // input() に入れる値
  inputs?: string[]
  // 生徒向けの説明（「エラーを見る場面」など）。「推測」と書いた文は作る人向けなので画面に出さない
  note?: string
  // わざとエラーを出して確かめる見出し（エラーが出たら合格）
  expectError?: boolean
  // 「できたら⭐」の見出し（わざとエラーを出す・動画にない練習）。動画は止まらず、クリアの条件にも入らない
  optional?: boolean
  // 動画を止める秒（ふつうは次の見出しの始まり。チャレンジのように、説明を聞きおわってから止めたいとき）
  pauseAt?: number
  // コードに合っているべき形（正規表現）。答えが人によってちがう見出し（自分の名前など）で使う
  mustMatch?: string
  // 出力のどれか1行が合っているべき形（正規表現）。expected のかわりに使う
  outputPattern?: string
  // チャレンジ：1回実行したら、合っていてもまちがっていても「こたえの例」（code）を見せる。
  // まちがっていても「こたえを見て次へ」で進める（2026-10-25 依頼主）
  challenge?: boolean
  // こたえの例といっしょに出す、ひとことの説明
  answerNote?: string
}

export type NaviVideo = {
  no: string
  id: string
  length: number
  start?: number
  // 「最後まで見た」にする秒（最後の教室のお知らせの手前）
  end: number
  skips?: { from: number; to: number; label: string }[]
}

export type NaviStep = {
  step: number
  unit: number
  title: string
  video: NaviVideo | null
  fileName: string
  sections: NaviSection[]
  learn: string[]
  codeblock: string[]
  // まだ CodeBlock にない、これから作るレッスン（準備中として見せる）
  codeblockPlanned?: string[]
  card?: { title: string; body: string }
  // おさらい1問（つぎの回のはじめ）。分けたステップの前の部分などは無い
  review?: { question: string; choices: string[]; answer: number }
  appWindow?: boolean
  // 準備中（動画がまだ）。生徒はとばして次のステップへ進む。動画ができたら中身を入れて外す
  planned?: boolean
  // エディターの最初のコード（前の動画を分けたステップで、前の部分のコードの続きを打つとき）
  starter?: string
}

// 動画の番号はステップの順（動画①・動画⑦…。サムネイルの「Python ①」と同じ）。前のシリーズの #2〜#21 は出さない
// 丸数字は ①〜⑳・㉑〜㉟・㊱〜㊿。51 からは「動画51」
const circled = (n: number) =>
  n >= 1 && n <= 20 ? String.fromCodePoint(0x2460 + n - 1) : n <= 35 ? String.fromCodePoint(0x3251 + n - 21) : n <= 50 ? String.fromCodePoint(0x32b1 + n - 36) : String(n)
export const videoLabel = (step: NaviStep) => `動画${circled(step.step)}`
// 動画の中の秒を、そのステップで見る部分の中の秒にする（前の動画を分けたステップは、途中から始まるので）
export const inStep = (step: NaviStep, sec: number) => Math.max(0, sec - (step.video?.start ?? 0))

export const UNIT_NAMES: Record<number, string> = {
  1: 'はじめての Python',
  2: 'もしも',
  3: 'リストとランダム',
  4: 'くりかえし',
  5: '関数',
  6: 'アプリの窓',
}
