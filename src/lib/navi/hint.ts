// ヒントの3段目：動画のコードと生徒のコードを見くらべて、ちがう行を1つ教える
import type { NaviSection } from './types'

export type CodeHint =
  | { kind: 'missing'; want: string }
  | { kind: 'differs'; line: number; want: string; got: string; tip: string }

const noSpace = (s: string) => s.replace(/\s+/g, '')
const indentOf = (s: string) => s.match(/^\s*/)?.[0].replace(/\t/g, '    ').length ?? 0

// 2つの行がどれだけ似ているか（0〜1）
function similarity(a: string, b: string): number {
  const x = noSpace(a)
  const y = noSpace(b)
  if (!x || !y) return 0
  const dp = Array.from({ length: x.length + 1 }, () => new Array<number>(y.length + 1).fill(0))
  for (let i = 1; i <= x.length; i++)
    for (let j = 1; j <= y.length; j++) dp[i][j] = x[i - 1] === y[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
  return (2 * dp[x.length][y.length]) / (x.length + y.length)
}

// ちがいの理由を、子ども向けのひとことにする
function tipFor(want: string, got: string): string {
  // 動画のコードにない全角の記号（文字の中の日本語はそのままでよい）
  const full = [...got].find((c) => /[（）”“’‘＂＝＋－＊／：，．　０-９Ａ-Ｚａ-ｚ]/.test(c) && !want.includes(c))
  if (full) return `全角の「${full === '　' ? '空白' : full}」が入っているよ。半角にしよう`
  if (noSpace(want) === noSpace(got)) return '字下げ（行のはじめの空白）がちがうよ'
  if (/:\s*$/.test(want) && !/:\s*$/.test(got)) return '行のおわりの「:」をわすれていないかな'
  const count = (s: string, c: string) => s.split(c).length - 1
  for (const [o, c] of [['(', ')'], ['[', ']'], ['"', '"']] as const) {
    if (o === c ? count(got, o) % 2 !== 0 : count(got, o) !== count(got, c)) return `「${o}${c === o ? '' : ` と ${c}`}」の数が合っていないよ`
  }
  return '動画のコードと1文字ずつ見くらべてみよう'
}

export function codeHint(section: NaviSection, studentCode: string): CodeHint | null {
  const mine = studentCode.split('\n')
  for (const want of section.code.split('\n')) {
    if (!want.trim()) continue
    const same = mine.findIndex((l) => noSpace(l) === noSpace(want))
    if (same >= 0) {
      // 中身は同じでも、字下げがちがうと動きが変わる
      if (indentOf(mine[same]) !== indentOf(want))
        return { kind: 'differs', line: same + 1, want: want.trimEnd(), got: mine[same].trimEnd(), tip: tipFor(want, mine[same]) }
      continue
    }
    let best = -1
    let bestScore = 0
    mine.forEach((l, i) => {
      const sc = similarity(want, l)
      if (sc > bestScore) {
        bestScore = sc
        best = i
      }
    })
    if (best >= 0 && bestScore >= 0.6) return { kind: 'differs', line: best + 1, want: want.trimEnd(), got: mine[best].trimEnd(), tip: tipFor(want, mine[best]) }
    return { kind: 'missing', want: want.trimEnd() }
  }
  return null
}
