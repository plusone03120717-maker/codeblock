// Python ナビ（新しいコース）を使うアカウント。
// 管理画面の「コース切りかえ」で先生がオンにした生徒（users/{uid}.naviCourse）は、CodeBlock のトップを開くと
// Python ナビのホームへ移る。今までの生徒には何も変わらない。
// 下の一覧は、スイッチができる前からナビを使っていたアカウント（スイッチで一度でも切りかえたら、スイッチのほうに従う）
const NAVI_USER_UIDS = new Set<string>([
  'hjGSSIzzJYWNIdVsXejf0AT9rH63', // 依頼主の Google アカウント（2026-10-25 依頼主の指示）
])

export const isNaviUser = (uid: string | null | undefined, profile?: { naviCourse?: boolean } | null) =>
  !!uid && (profile?.naviCourse ?? NAVI_USER_UIDS.has(uid))
