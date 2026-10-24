'use client'

// アプリの窓：Python の tkinter の代わり（public/py/tkinter_shim.py）が送ってくる部品の木を、HTML で表示する
import { useState, type CSSProperties, type ReactNode } from 'react'

export type TkNode = {
  id: number
  kind: string
  text: string
  fg?: string | null
  bg?: string | null
  font?: { size: number | null; bold: boolean } | null
  width?: number | string | null
  height?: number | string | null
  padx?: number | null
  pady?: number | null
  state?: string | null
  image?: string | null
  value?: string
  checked?: boolean
  layout?: Record<string, unknown> | null
  children: TkNode[]
  title?: string
  geometry?: string | null
}

type TkEvent = { kind: 'click' | 'entry' | 'key'; id: number; value?: string; key?: string }

type Props = {
  tree: TkNode | null
  message: { title: string; text: string } | null
  onCloseMessage: () => void
  onEvent: (ev: TkEvent) => void
}

const px = (v: unknown) => (typeof v === 'number' ? `${v}px` : undefined)

function boxStyle(n: TkNode): CSSProperties {
  const s: CSSProperties = {}
  if (n.fg) s.color = n.fg
  if (n.bg) s.backgroundColor = n.bg
  if (n.font?.size) s.fontSize = `${Math.round(n.font.size * 1.33)}px`
  if (n.font?.bold) s.fontWeight = 700
  const lay = n.layout ?? {}
  const padx = lay.padx ?? n.padx
  const pady = lay.pady ?? n.pady
  if (typeof padx === 'number') s.marginLeft = s.marginRight = padx
  if (typeof pady === 'number') s.marginTop = s.marginBottom = pady
  return s
}

function Widget({ n, onEvent }: { n: TkNode; onEvent: Props['onEvent'] }) {
  const [draft, setDraft] = useState<string | null>(null)
  const s = boxStyle(n)
  const lay = n.layout ?? {}
  if (lay.fill === 'x' || lay.fill === 'both') s.alignSelf = 'stretch'
  if (lay.expand) s.flexGrow = 1
  if (lay.type === 'grid') {
    s.gridRow = Number(lay.row ?? 0) + 1
    s.gridColumn = Number(lay.column ?? 0) + 1
    if (lay.columnspan) s.gridColumn = `${Number(lay.column ?? 0) + 1} / span ${lay.columnspan}`
  }
  const charW = (w: unknown) => (typeof w === 'number' ? `${w * 0.62}em` : undefined)

  switch (n.kind) {
    case 'label':
      // 画像は Python で作った data URL なので next/image は使わない
      // eslint-disable-next-line @next/next/no-img-element
      if (n.image) return <img src={n.image} alt="" style={{ ...s, maxWidth: '100%' }} />
      return (
        <div style={{ ...s, width: charW(n.width), whiteSpace: 'pre-wrap', textAlign: 'center' }} className="px-1 py-[2px]">
          {n.text}
        </div>
      )
    case 'button':
      return (
        <button
          style={{ ...s, width: charW(n.width) }}
          disabled={n.state === 'disabled'}
          onClick={() => onEvent({ kind: 'click', id: n.id })}
          className="rounded-[3px] border border-[#adadad] bg-[#e9e9e9] px-5 py-1 text-[15px] text-[#111] hover:bg-[#dcdcdc] active:bg-[#cfcfcf] disabled:text-[#999]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {n.image ? <img src={n.image} alt="" /> : n.text}
        </button>
      )
    case 'entry':
    case 'text': {
      const Tag = n.kind === 'text' ? 'textarea' : 'input'
      return (
        <Tag
          value={draft ?? n.value ?? ''}
          onChange={(e: { target: { value: string } }) => {
            setDraft(e.target.value)
            onEvent({ kind: 'entry', id: n.id, value: e.target.value })
          }}
          onBlur={() => setDraft(null)}
          onKeyDown={(e: { key: string; nativeEvent: KeyboardEvent }) => {
            if (!e.nativeEvent.isComposing) onEvent({ kind: 'key', id: n.id, key: e.key })
          }}
          style={{ ...s, width: charW(n.width) ?? '14em' }}
          className="rounded-[2px] border border-[#7a7a7a] bg-white px-1 py-[2px] text-[15px] text-[#111] outline-none focus:border-[#4f7cff]"
        />
      )
    }
    case 'check':
    case 'radio':
      return (
        <label style={s} className="flex cursor-pointer items-center gap-1 text-[15px]">
          <input type={n.kind === 'check' ? 'checkbox' : 'radio'} checked={!!n.checked} onChange={() => onEvent({ kind: 'click', id: n.id })} />
          {n.text}
        </label>
      )
    case 'frame':
      return <Container n={n} onEvent={onEvent} style={{ ...s, width: px(n.width), height: px(n.height) }} />
    default:
      return null
  }
}

// pack は「上から順に」、side=left/right が続くところは横にならべる。grid はマス目
function Container({ n, onEvent, style }: { n: TkNode; onEvent: Props['onEvent']; style?: CSSProperties }) {
  const kids = n.children
  if (kids.some((c) => c.layout?.type === 'grid')) {
    return (
      <div style={{ ...style, display: 'grid', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
        {kids.map((c) => (
          <Widget key={c.id} n={c} onEvent={onEvent} />
        ))}
      </div>
    )
  }
  const rows: { side: 'row' | 'col'; items: TkNode[] }[] = []
  for (const c of kids) {
    const side = c.layout?.side === 'left' || c.layout?.side === 'right' ? 'row' : 'col'
    const last = rows[rows.length - 1]
    if (side === 'row' && last?.side === 'row') last.items.push(c)
    else rows.push({ side, items: [c] })
  }
  const out: ReactNode[] = rows.map((r, i) =>
    r.side === 'row' ? (
      <div key={i} className="flex items-center justify-center gap-1">
        {r.items.map((c) => (
          <Widget key={c.id} n={c} onEvent={onEvent} />
        ))}
      </div>
    ) : (
      <Widget key={r.items[0].id} n={r.items[0]} onEvent={onEvent} />
    ),
  )
  return (
    <div style={style} className="flex flex-col items-center gap-1">
      {out}
    </div>
  )
}

export function AppWindow({ tree, message, onCloseMessage, onEvent }: Props) {
  if (!tree) return null
  const [gw, gh] = (tree.geometry ?? '').split(/[x+]/).map(Number)
  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex h-[38px] flex-none items-center gap-4 border-b border-[#241f40] px-4 text-[13px] font-bold text-[#8a85ad]">
        <b className="-mb-[10px] border-b-2 border-[#ffd23f] pb-2 text-white">アプリの窓</b>
        <span>tkinter のかわり</span>
      </div>
      <div className="relative grid min-h-0 flex-1 place-items-start justify-center overflow-auto bg-[#1a1631] bg-[radial-gradient(#2c2650_1px,transparent_1px)] bg-[length:16px_16px] p-4">
        <div
          className="max-w-full overflow-hidden rounded-xl bg-[#f3f3f3] shadow-[0_18px_40px_rgba(0,0,0,.45)]"
          style={{ width: gw ? Math.min(gw, 560) : 320, minHeight: gh ? Math.min(gh, 260) : undefined }}
        >
          <div className="flex h-8 items-center gap-2 border-b border-[#e5e5e5] bg-white px-3 text-[13px] font-bold text-[#333]">
            <span className="h-[15px] w-[15px] rounded bg-[linear-gradient(135deg,#4f7cff_50%,#ffd23f_50%)]" />
            {tree.title}
            <span className="flex-1" />
            <span className="w-6 text-center text-[#888]">—</span>
            <span className="w-6 text-center text-[#888]">□</span>
            <span className="w-6 text-center text-[#888]">✕</span>
          </div>
          <Container n={tree} onEvent={onEvent} style={{ backgroundColor: tree.bg ?? undefined, padding: '16px 14px' }} />
        </div>
        {message && (
          <div className="absolute inset-0 grid place-items-center bg-black/30">
            <div className="w-[280px] rounded-lg bg-white p-4 text-[#222] shadow-xl">
              <div className="mb-2 text-sm font-bold">{message.title}</div>
              <div className="mb-4 whitespace-pre-wrap text-[15px]">{message.text}</div>
              <button onClick={onCloseMessage} className="float-right rounded border border-[#adadad] bg-[#e9e9e9] px-5 py-1 text-sm">
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
