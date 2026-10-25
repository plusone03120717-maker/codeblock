import { NextRequest, NextResponse } from 'next/server'
import { createRemoteJWKSet, jwtVerify } from 'jose'

// 日本から使うので、東京で動かす
export const preferredRegion = 'hnd1'
export const dynamic = 'force-dynamic'

/**
 * POST /api/tts
 *
 * Python ナビ（ホームの VTuber）の声。ElevenLabs で文を読み上げ、mp3 を「できた分から」流して返す。
 * PLUS Navi・計算プリントアプリと同じ声（Romaco）・同じモデル（2026-10-25）。
 *
 * 必要な環境変数: ELEVENLABS_API_KEY（ElevenLabs のプラスワンのアカウント）
 * 任意: ELEVENLABS_VOICE_ID（既定は Romaco）／ELEVENLABS_MODEL_ID（既定は eleven_v4_turbo）
 * キーがないときは 503 を返す（画面は文字だけで動く）
 */

const DEFAULT_VOICE_ID = 'KgETZ36CCLD1Cob4xpkv' // Romaco
const MAX_TEXT_LENGTH = 300

// Firebase のログインの証明書（ID トークン）を、Google の公開鍵で確かめる。
// Supabase に移したら、ここを Supabase のログインの確かめ方に入れかえる
const firebaseKeys = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
)

async function isLoggedIn(request: NextRequest): Promise<boolean> {
  const auth = request.headers.get('authorization')
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  if (!auth?.startsWith('Bearer ') || !projectId) return false
  try {
    const { payload } = await jwtVerify(auth.substring(7), firebaseKeys, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    })
    return typeof payload.sub === 'string' && payload.sub.length > 0
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  // ログイン中の人からのリクエストだけ受け付ける（声はお金がかかるので）
  if (!(await isLoggedIn(request))) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: '読み上げの設定がありません' }, { status: 503 })
  }

  const { text } = (await request.json().catch(() => ({}))) as { text?: string }
  if (!text || text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: '読み上げる文がありません' }, { status: 400 })
  }
  const voice = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}/stream?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_v4_turbo' }),
    },
  )
  if (!res.ok || !res.body) {
    console.error('ElevenLabs error:', res.status, await res.text().catch(() => ''))
    return NextResponse.json({ error: '読み上げに失敗しました' }, { status: 502 })
  }

  return new NextResponse(res.body, {
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
  })
}
