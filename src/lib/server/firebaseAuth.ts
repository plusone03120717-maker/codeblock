// サーバー（API）で、Firebase のログインの証明書（ID トークン）を Google の公開鍵で確かめる。
// 声（/api/tts）といちかへの質問（/api/navi-ask）で使う。Supabase に移したら、ここを Supabase の確かめ方に入れかえる
import type { NextRequest } from 'next/server'
import { createRemoteJWKSet, jwtVerify } from 'jose'

const firebaseKeys = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
)

// ログイン中ならその人の uid と ID トークン（Firestore を本人として読み書きするのに使う）、そうでなければ null
export async function verifyFirebaseUser(request: NextRequest): Promise<{ uid: string; token: string } | null> {
  const auth = request.headers.get('authorization')
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  if (!auth?.startsWith('Bearer ') || !projectId) return null
  const token = auth.substring(7)
  try {
    const { payload } = await jwtVerify(token, firebaseKeys, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    })
    return typeof payload.sub === 'string' && payload.sub.length > 0 ? { uid: payload.sub, token } : null
  } catch {
    return null
  }
}
