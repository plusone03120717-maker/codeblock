// Python ナビの生徒の「いま」と「苦手」を、先生の管理画面に送る（Firestore・本人のログインで書く）。
// ・users/{uid}/naviLive/now：いま何をしているか（いまの教室）
// ・users/{uid}/naviWeak/s{ステップ}：見出しごとのまちがい・巻きもどし・ヒント・エラーの種類（苦手）
// ・users/{uid}/naviWeak/cb-{レッスン}：CodeBlock の問題ごとのまちがい（苦手）
// 送れなくても学習は止めない（エラーは捨てる）。進み具合そのものは今までどおりブラウザ（progress.ts）
import { doc, increment, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { errorKind, type PyError } from './friendlyError'

export type HintKind = 'rewind' | 'code' | 'diff'

export type NaviLive = {
  step: number
  where: 'home' | 'video' | 'section' | 'codeblock' | 'ended'
  videoSec?: number
  section?: number | null // いま取り組んでいる見出しの番号
  lessonId?: string
  mission?: number
  lastError?: string | null // やさしい説明にしたエラー
  fails: number // いまの見出し（問題）で、合わなかった実行の回数
  hints: HintKind[] // いまの見出しで使ったヒント（10秒もどす・動画のコード・ちがう行）
}

// 「止まっている」は、実行・入力・動画の再生が3分ない（先生の画面で数える）
export const IDLE_MS = 3 * 60 * 1000
// 授業中とみなす長さ（最後の知らせからこれより前の生徒は「きょうはまだ／おわった」）
export const CLASS_MS = 90 * 60 * 1000

let cur: NaviLive | null = null
let lastActiveWrite = 0

const uid = () => auth.currentUser?.uid ?? null

const write = (path: string[], data: Record<string, unknown>) => {
  const u = uid()
  if (!u) return
  setDoc(doc(db, 'users', u, ...path), data, { merge: true }).catch(() => {})
}

const sendLive = (patch: Record<string, unknown> = {}, active = true) => {
  if (!cur) return
  write(['naviLive', 'now'], {
    ...cur,
    ...patch,
    updatedAt: serverTimestamp(),
    ...(active ? { activeAt: serverTimestamp() } : {}),
  })
}

// 画面がかわったとき・見出し（問題）がかわったとき。見出しがかわったら、まちがいとヒントの数はゼロから
export function liveSet(next: Omit<NaviLive, 'fails' | 'hints' | 'lastError'>) {
  const same =
    cur &&
    cur.step === next.step &&
    cur.where === next.where &&
    (cur.section ?? null) === (next.section ?? null) &&
    cur.lessonId === next.lessonId &&
    cur.mission === next.mission
  if (same) return
  const keep = cur && cur.step === next.step && (cur.section ?? null) === (next.section ?? null) && cur.mission === next.mission
  cur = { ...next, fails: keep ? cur!.fails : 0, hints: keep ? cur!.hints : [], lastError: keep ? cur!.lastError : null }
  lastActiveWrite = Date.now()
  sendLive()
}

// 動画の再生・エディターへの入力。書きすぎないように30秒に1回
export function liveActive(videoSec?: number) {
  if (!cur) return
  if (videoSec !== undefined) cur.videoSec = Math.floor(videoSec)
  if (Date.now() - lastActiveWrite < 30_000) return
  lastActiveWrite = Date.now()
  sendLive()
}

// 実行した（エディター）・答えた（CodeBlock）
export function liveRun(ok: boolean, error?: string | null) {
  if (!cur) return
  if (!ok) cur.fails += 1
  cur.lastError = ok ? null : (error ?? cur.lastError ?? null)
  lastActiveWrite = Date.now()
  sendLive()
}

export function liveHint(kind: HintKind) {
  if (!cur || cur.hints.includes(kind)) return
  cur.hints = [...cur.hints, kind]
  lastActiveWrite = Date.now()
  sendLive()
}

// 「今日はおわる」
export function liveEnd() {
  if (!cur) return
  cur = { ...cur, where: 'ended' }
  sendLive()
  cur = null
}

// ── 苦手（ステップの見出しごと） ──
type SectionCount = 'fails' | 'rewinds' | 'hints' | 'revealed'

export function weakSection(step: number, section: number, what: SectionCount) {
  write(['naviWeak', `s${step}`], { step, sections: { [section]: { [what]: increment(1) } }, updatedAt: serverTimestamp() })
}

export function weakError(step: number, section: number | null, err: PyError) {
  const kind = errorKind(err)
  write(['naviWeak', `s${step}`], {
    step,
    errors: { [kind]: increment(1) },
    ...(section !== null ? { sections: { [section]: { fails: increment(1) } } } : {}),
    updatedAt: serverTimestamp(),
  })
}

// ── 苦手（CodeBlock の問題ごと） ──
export function weakMission(lessonId: string, mission: number) {
  write(['naviWeak', `cb-${lessonId}`], { lessonId, missions: { [mission]: increment(1) }, updatedAt: serverTimestamp() })
}
