// 見出しの判定
import type { NaviSection } from './types'

const norm = (s: string) => s.replace(/\r/g, '').replace(/[ \t]+$/gm, '').trim()

const usesAll = (section: NaviSection, code: string) => !section.mustUse?.some((m) => !code.includes(m))

// 出るはずの行が、出力の中に順番どおりにあるか
function outputMatches(expected: string[], output: string): boolean {
  const lines = norm(output).split('\n').map((l) => l.trim())
  let at = 0
  for (const want of expected) {
    const found = lines.findIndex((l, i) => i >= at && l === want.trim())
    if (found === -1) return false
    at = found + 1
  }
  return true
}

// 1回の実行で、その見出しが合格か
// ・エラーを見る見出し：エラーが出たら合格
// ・結果が決まらない見出し（ランダム・入力・アプリの窓・画像）：使うべき書き方があって、エラーなく動けば合格
// ・ふつうの見出し：使うべき書き方があって、出るはずの行が順番どおりに出れば合格
export function sectionPassed(section: NaviSection, run: { ok: boolean; output: string }, code: string): boolean {
  if (section.expectError) return !run.ok
  if (!usesAll(section, code)) return false
  // 答えが人によってちがう見出し（チャレンジなど）：書き方の形と、出力の1行の形で見る
  if (section.mustMatch && !new RegExp(section.mustMatch, 'm').test(code)) return false
  if (section.outputPattern) {
    const re = new RegExp(section.outputPattern)
    return run.ok && norm(run.output).split('\n').some((l) => re.test(l.trim()))
  }
  if (section.expected.length === 0) return run.ok
  return run.ok && outputMatches(section.expected, run.output)
}

// 画面に出してよい説明（「推測」と書いた文は作る人向けなので外す）
export function studentNote(section: NaviSection): string | undefined {
  if (!section.note) return undefined
  const kept = section.note
    .split('。')
    .map((t) => t.trim())
    .filter((t) => t && !t.includes('推測'))
  return kept.length > 0 ? kept.join('。') + '。' : undefined
}
