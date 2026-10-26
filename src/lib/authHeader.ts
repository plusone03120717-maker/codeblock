// ログイン中の人の ID トークンを、API に送るヘッダーにする（2026-10-26）。
// コードの実行（Render の /api/execute）とヒント（/api/hint）は、ログインした生徒だけが使えるようにした
import { auth } from "@/lib/firebase";

export async function authHeader(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken().catch(() => null);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
