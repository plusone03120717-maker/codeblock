// 全角チェック：コードの中の、全角の記号・数字・英字・空白を見つける（2026-10-26 依頼主）
// 生徒の質問でいちばん多い「全角で打ってしまった」を、実行する前に知らせる。
// " " や ' ' の中（文字）と、# のあと（コメント）の全角はそのままでよいので見ない
const FULL = /[（）［］｛｝＂”“’‘＝＋－＊／：，．＜＞＃　０-９Ａ-Ｚａ-ｚ]/

export type FullWidthHit = { line: number; col: number; ch: string }

export function findFullWidth(code: string): FullWidthHit | null {
  const lines = code.split('\n')
  for (let r = 0; r < lines.length; r++) {
    const s = lines[r]
    let quote: string | null = null
    for (let c = 0; c < s.length; c++) {
      const ch = s[c]
      if (quote) {
        if (ch === quote) quote = null
        continue
      }
      if (ch === '"' || ch === "'") {
        quote = ch
        continue
      }
      if (ch === '#') break
      if (FULL.test(ch)) return { line: r + 1, col: c + 1, ch }
    }
  }
  return null
}

// 生徒に見せることば（「全角の（」→ 半角にしよう）
export function fullWidthMessage(hit: FullWidthHit): string {
  const name = hit.ch === '　' ? '空白（スペース）' : `「${hit.ch}」`
  return `${hit.line}行目の ${name} が全角になっているよ。キーボードの「半角/全角」キーで「A」にしてから、打ち直そう`
}
