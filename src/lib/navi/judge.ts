// 見出しの判定：出力に出るはずの行が順番どおりにあり、使うべき書き方がコードにあれば合格
import type { NaviSection } from './types'

const norm = (s: string) => s.replace(/\r/g, '').replace(/[ \t]+$/gm, '').trim()

export function sectionPassed(section: NaviSection, output: string, code: string): boolean {
  if (section.mustUse?.some((m) => !code.includes(m))) return false
  if (section.expected.length === 0) return false
  const lines = norm(output).split('\n').map((l) => l.trim())
  let at = 0
  for (const want of section.expected) {
    const w = want.trim()
    const found = lines.findIndex((l, i) => i >= at && l === w)
    if (found === -1) return false
    at = found + 1
  }
  return true
}

// 窓の回・エラーを見せる回など、出力では判定できない見出し
export const judgeByRunOnly = (section: NaviSection) => section.expected.length === 0
