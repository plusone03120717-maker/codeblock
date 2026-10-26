// コードを、Python ナビのエディターと同じ色で出す（PyEditor の codeColors と同じ色）。仕上げ5問の画面で使う
const KEYWORDS = new Set(['if', 'elif', 'else', 'for', 'in', 'while', 'def', 'return', 'import', 'from', 'as', 'and', 'or', 'not', 'True', 'False', 'None', 'break', 'continue'])
const TOKEN = /("[^"\n]*"?|'[^'\n]*'?)|(#.*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/

export function NaviCode({ code }: { code: string }) {
  const out: React.ReactNode[] = []
  let m: RegExpExecArray | null
  let i = 0
  const re = new RegExp(TOKEN.source, 'g')
  while ((m = re.exec(code))) {
    const [t, str, comment, num, word] = m
    let color: string | undefined
    if (str) color = '#98c379'
    else if (comment) color = '#8f94a0'
    else if (num) color = '#d19a66'
    else if (word) {
      const next = code.slice(re.lastIndex).match(/^\s*\(/)
      color = KEYWORDS.has(word) ? '#c678dd' : next ? '#61afef' : '#e5c07b'
    }
    out.push(
      color ? (
        <span key={i++} style={{ color, fontStyle: comment ? 'italic' : undefined }}>
          {t}
        </span>
      ) : (
        t
      ),
    )
  }
  return <>{out}</>
}
