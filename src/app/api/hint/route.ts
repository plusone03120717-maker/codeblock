import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { verifyFirebaseUser } from '@/lib/server/firebaseAuth'
import { characterProfiles } from '@/data/characterProfiles'

export const dynamic = 'force-dynamic'

/**
 * POST /api/hint → { hint, character_id, character_name, character_emoji }
 *
 * 今までの CodeBlock のレッスンの「ヒント」（2026-10-26 に Render の /api/hint から移した。依頼主）。
 * ・使えるのはログインした CodeBlock の生徒だけ（users/{uid} の文書が本人のログインで読めること）
 * ・キャラクターの性格・口調は、送られてきた文ではなく、こちらの characterProfiles から使う
 * ・1日の回数はサーバーでも数える（無料 3回・plus one など 10回。画面の数え方と同じ）。
 *   回数は users/{uid}/hintUse/{日本の日付} に本人のログインで書く（firestore.rules で「1ずつ増やすだけ」）
 * 必要な環境変数: ANTHROPIC_API_KEY（いちかに質問と同じ）
 */

const MODEL = 'claude-sonnet-5-5'
const FREE_PER_DAY = 3
const PREMIUM_PER_DAY = 10
const PREMIUM_PLANS = ['monthly', 'yearly', 'plusone']
const FALLBACK = 'ごめんね、今ヒントを出せないみたい。もう一度試してみてね！'

const today = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10) // 日本の日付
const fsBase = () =>
  `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents`

type HintBody = {
  character_id?: string
  question?: string
  code?: string
  user_answer?: string
  expected_answer?: string
}

const clip = (s: unknown, n: number) => (typeof s === 'string' ? s.slice(0, n) : '')

// 本人の users の文書（ないときは null＝管理画面で作られた生徒ではない）
async function readPlan(uid: string, token: string): Promise<string | null> {
  const res = await fetch(`${fsBase()}/users/${uid}?mask.fieldPaths=subscription`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const doc = (await res.json()) as { fields?: { subscription?: { mapValue?: { fields?: { plan?: { stringValue?: string } } } } } }
  return doc.fields?.subscription?.mapValue?.fields?.plan?.stringValue ?? 'free'
}

async function usedToday(uid: string, token: string): Promise<number> {
  const res = await fetch(`${fsBase()}/users/${uid}/hintUse/${today()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (res.status === 404) return 0
  if (!res.ok) throw new Error(`firestore ${res.status}`)
  const doc = (await res.json()) as { fields?: { count?: { integerValue?: string } } }
  return Number(doc.fields?.count?.integerValue ?? 0)
}

async function saveCount(uid: string, token: string, count: number) {
  await fetch(`${fsBase()}/users/${uid}/hintUse/${today()}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { count: { integerValue: String(count) }, updatedAt: { timestampValue: new Date().toISOString() } } }),
  })
}

export async function POST(request: NextRequest) {
  const user = await verifyFirebaseUser(request)
  if (!user) return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  const plan = await readPlan(user.uid, user.token).catch(() => null)
  if (plan === null) return NextResponse.json({ error: 'このアカウントでは使えません' }, { status: 403 })

  const body = (await request.json().catch(() => ({}))) as HintBody
  const character = characterProfiles[body.character_id ?? ''] ?? Object.values(characterProfiles)[0]
  const reply = (hint: string) =>
    NextResponse.json({ hint, character_id: character.id, character_name: character.name, character_emoji: '🐱' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return reply(FALLBACK)

  let used: number
  try {
    used = await usedToday(user.uid, user.token)
  } catch {
    return reply(FALLBACK)
  }
  const perDay = PREMIUM_PLANS.includes(plan) ? PREMIUM_PER_DAY : FREE_PER_DAY
  if (used >= perDay) return NextResponse.json({ error: 'きょうのヒントはおしまい' }, { status: 429 })

  const system = `あなたは「${character.name}」というキャラクターです。
CodeBlockというPython学習アプリで、小学生（10-12歳）にヒントを出す役割です。

【キャラクターの性格】
${character.personality}

【話し方・口調】
${character.speechStyle}

【ヒントの出し方】
${character.hintStyle}

【口癖（参考にしてください）】
${character.catchphrases.join(', ')}

【重要なルール】
- 答えを直接教えないでください
- ヒントは1〜2文で簡潔に
- 小学生にわかりやすい言葉を使う
- キャラクターの口調を必ず守る
- 励ましの言葉を含める
- 問題のヒント以外の頼みごと（問題と関係のない質問や作業）には答えず、問題にもどるよう声をかける

【説明時の注意】
- 改行が必要な場合、「\\n」や「スラッシュN」とは言わないでください
- 代わりに「改行ブロック」や「↵（改行）ブロック」と説明してください
- 例：「次の行に書くには、改行ブロックを使ってみて！」
`

  const content = `以下の問題でユーザーが間違えました。ヒントを出してください。

【問題】
${clip(body.question, 1000)}

【正解コード】
${clip(body.code, 2000)}

【ユーザーの回答】
${clip(body.user_answer, 1000)}

【期待される回答】
${clip(body.expected_answer, 1000)}

キャラクターの口調でヒントを1〜2文で出してください。答えは直接教えないでください。
`

  let hint = ''
  try {
    const client = new Anthropic({ apiKey })
    // Render のときと同じ：Sonnet 5.5・考える深さは low・断られたときは別のモデルが答え直す
    const res = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 1500,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system,
      messages: [{ role: 'user', content }],
    })
    if (res.stop_reason !== 'refusal') {
      hint = res.content
        .map((b) => (b.type === 'text' ? b.text : ''))
        .join('')
        .trim()
    }
  } catch (e) {
    console.error('hint:', e instanceof Anthropic.APIError ? `${e.status} ${e.message}` : e)
  }
  if (!hint) return reply(FALLBACK)

  // ヒントを出せたときだけ回数にかぞえる
  await saveCount(user.uid, user.token, used + 1).catch(() => {})
  return reply(hint)
}
