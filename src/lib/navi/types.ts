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
  review: { question: string; choices: string[]; answer: number }
  appWindow?: boolean
}

export const UNIT_NAMES: Record<number, string> = {
  1: 'はじめての Python',
  2: 'もしも',
  3: 'リストとランダム',
  4: 'くりかえし',
  5: '関数',
  6: 'アプリの窓',
}
