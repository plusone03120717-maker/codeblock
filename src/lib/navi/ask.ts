// いちかに質問（/api/navi-ask）の決まりと、画面から呼ぶ関数（2026-10-26 依頼主：1人1日3回まで・文字だけ）
import { auth } from '@/lib/firebase'

export { ASK_PER_DAY, ASK_MAX_QUESTION } from './askRules'

export type AskStatus = { left: number; ready: boolean }

async function token(): Promise<string | null> {
  return (await auth.currentUser?.getIdToken().catch(() => null)) ?? null
}

// きょう、あと何回質問できるか（ready=false：まだ使えない＝API キーの設定がない）
export async function askStatus(): Promise<AskStatus | null> {
  const t = await token()
  if (!t) return null
  const res = await fetch('/api/navi-ask', { headers: { Authorization: `Bearer ${t}` } }).catch(() => null)
  if (!res?.ok) return null
  return (await res.json()) as AskStatus
}

export type AskResult = { ok: true; answer: string; left: number } | { ok: false; reason: 'limit' | 'notReady' | 'error' }

export async function askIchika(q: { question: string; step: number; section: number | null; code: string; error?: string; output?: string }): Promise<AskResult> {
  const t = await token()
  if (!t) return { ok: false, reason: 'error' }
  const res = await fetch('/api/navi-ask', {
    method: 'POST',
    headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(q),
  }).catch(() => null)
  if (!res) return { ok: false, reason: 'error' }
  if (res.status === 429) return { ok: false, reason: 'limit' }
  if (res.status === 503) return { ok: false, reason: 'notReady' }
  if (!res.ok) return { ok: false, reason: 'error' }
  const data = (await res.json()) as { answer: string; left: number }
  return { ok: true, answer: data.answer, left: data.left }
}
