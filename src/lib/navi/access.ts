// Python ナビ（新しいコース）を使うアカウント。
// ここにあるアカウントは、CodeBlock のトップを開くと Python ナビのホームへ移る。今までの生徒には何も変わらない。
// Supabase に移したら、先生の画面の「コース切りかえ」のスイッチに置きかえる。
const NAVI_USER_UIDS = new Set<string>([
  'hjGSSIzzJYWNIdVsXejf0AT9rH63', // 依頼主の Google アカウント（2026-10-25 依頼主の指示）
])

export const isNaviUser = (uid: string | null | undefined) => !!uid && NAVI_USER_UIDS.has(uid)
