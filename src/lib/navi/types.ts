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
  note?: string
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
