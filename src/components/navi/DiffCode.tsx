// 1文字くらべ：動画（見本）の行と、生徒の行の、最初にちがう1文字に色をつける（2026-10-26 依頼主）
// 全角の（ と 半角の ( のように、見ただけではわかりにくいちがいも、どの字かがわかるように

// 最初にちがう文字の位置（同じなら -1）
export function firstDiff(a: string, b: string): number {
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i
  return a.length === b.length ? -1 : n
}

function Mark({ text, at, color }: { text: string; at: number; color: string }) {
  if (at < 0) return <>{text}</>
  const ch = text[at]
  return (
    <>
      {text.slice(0, at)}
      <span className="rounded-[4px] px-[1px] font-black text-white" style={{ background: color }}>
        {ch === undefined ? '␣' : ch === ' ' ? '·' : ch === '　' ? '□' : ch}
      </span>
      {text.slice(at + 1)}
    </>
  )
}

export function DiffCode({ want, got, wantLabel }: { want: string; got: string; wantLabel: string }) {
  const at = firstDiff(want, got)
  return (
    <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 font-mono text-[13.5px]">
      <span className="text-[#6d6893]">{wantLabel}</span>
      <code className="whitespace-pre text-[#11845a]">
        <Mark text={want} at={at} color="#22b573" />
      </code>
      <span className="text-[#6d6893]">きみ</span>
      <code className="whitespace-pre text-[#c93c3c]">
        <Mark text={got} at={at} color="#ef5a5a" />
      </code>
      {at >= 0 && (
        <>
          <span />
          <span className="font-sans text-[12px] font-bold text-[#db6500]">
            ↑ {at + 1}文字目から、ちがっているよ
          </span>
        </>
      )}
    </div>
  )
}
