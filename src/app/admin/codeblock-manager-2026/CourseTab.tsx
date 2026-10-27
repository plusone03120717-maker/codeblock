"use client";

// コースの切りかえ（Python ナビ）：生徒ごとに「新しいコース（Python ナビ）」をオン・オフする。
// 押しまちがえないように、確かめの画面をはさむ。今までのコースの生徒には、いちか（ナビ）は出ない
import { useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/user";
import { isNaviUser } from "@/lib/navi/access";

const nameOf = (u: UserProfile) => u.userId || u.displayName || "名前未設定";

export function CourseTab({ users, onChanged }: { users: UserProfile[]; onChanged: () => Promise<void> }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmFor, setConfirmFor] = useState<{ u: UserProfile; on: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const q = searchTerm.toLowerCase();
  const list = users
    .filter((u) => u.email.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q) || (u.userId ?? "").toLowerCase().includes(q))
    .sort((a, b) => Number(isNaviUser(b.uid, b)) - Number(isNaviUser(a.uid, a)));
  const naviCount = users.filter((u) => isNaviUser(u.uid, u)).length;

  const save = async () => {
    if (!confirmFor) return;
    setSaving(true);
    setError("");
    try {
      await updateDoc(doc(db, "users", confirmFor.u.uid), { naviCourse: confirmFor.on, updatedAt: serverTimestamp() });
      await onChanged();
      setConfirmFor(null);
    } catch (err) {
      console.error("Error changing course:", err);
      setError("切りかえられませんでした。もう一度ためしてください");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3.5">
        <h1 className="text-[23px] font-black">コース切りかえ</h1>
        <span className="rounded-full bg-[#efe9ff] px-3 py-0.5 text-[13px] font-bold text-[#7448f0]">新しいコース（Python ナビ）にする生徒を選ぶ</span>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-3">
        <div className="rounded-[18px] bg-white px-5 py-4 shadow-sm">
          <div className="text-[30px] font-black leading-tight text-[#7448f0]">{naviCount}</div>
          <div className="text-[13px] font-bold text-[#6d6893]">Python ナビの生徒</div>
        </div>
        <div className="rounded-[18px] bg-white px-5 py-4 text-[13.5px] font-bold leading-relaxed text-[#4a4470] shadow-sm">
          オンにした生徒は、CodeBlock のトップを開くと Python ナビのホームへ移ります（いちかが案内します）。
          今までのコースの生徒には、いちかは出ません。今までのレッスンの記録は、切りかえても消えません。
        </div>
      </div>

      <input
        type="text"
        placeholder="ユーザーID・名前・メールで検索…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-[14px] bg-white px-4 py-2.5 text-sm font-bold shadow-sm outline-none ring-[#7448f0] focus:ring-2"
      />

      <section className="overflow-hidden rounded-[22px] bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[12.5px] tracking-wider text-[#6d6893]">
              <th className="px-5 py-3 font-bold">生徒</th>
              <th className="px-5 py-3 font-bold">いまのコース</th>
              <th className="px-5 py-3 font-bold">新しいコース（Python ナビ）</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => {
              const on = isNaviUser(u.uid, u);
              return (
                <tr key={u.uid} className="border-t border-[#f0eef7] hover:bg-[#faf8ff]">
                  <td className="px-5 py-3">
                    <div className="font-bold">{nameOf(u)}</div>
                    {u.displayName && u.displayName !== u.userId && <div className="text-[13px] font-bold text-[#6d6893]">{u.displayName}</div>}
                    <div className="text-xs text-[#9893b5]">{u.email}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-bold ${on ? "bg-[#efe9ff] text-[#7448f0]" : "bg-[#f0eef7] text-[#6d6893]"}`}
                    >
                      {on ? "Python ナビ" : "今までのコース"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      role="switch"
                      aria-checked={on}
                      aria-label={`${nameOf(u)} の新しいコース`}
                      onClick={() => {
                        setError("");
                        setConfirmFor({ u, on: !on });
                      }}
                      className={`relative h-[30px] w-[54px] rounded-full transition-colors ${on ? "bg-[#7448f0]" : "bg-[#d9d5ea]"}`}
                    >
                      <span className={`absolute top-[3px] h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[27px]" : "left-[3px]"}`} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && <div className="py-8 text-center text-sm font-bold text-[#6d6893]">ユーザーが見つかりません</div>}
      </section>

      {/* 確かめの窓 */}
      {confirmFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(42,36,82,.55)] p-4">
          <div className="w-full max-w-md rounded-[22px] bg-white shadow-xl">
            <div className="border-b border-[#f0eef7] px-6 py-5">
              <h2 className="text-xl font-black">{confirmFor.on ? "新しいコースにしますか？" : "今までのコースにもどしますか？"}</h2>
              <p className="mt-1 text-sm font-bold text-[#6d6893]">{nameOf(confirmFor.u)}</p>
            </div>
            <div className="flex flex-col gap-2 px-6 py-5 text-[14px] font-bold leading-relaxed text-[#4a4470]">
              {confirmFor.on ? (
                <>
                  <p>CodeBlock のトップを開くと、Python ナビのホームへ移るようになります。</p>
                  <p>今までのレッスンの記録は消えません。</p>
                </>
              ) : (
                <>
                  <p>CodeBlock のトップは、今までのレッスンの一覧にもどります。いちかは出なくなります。</p>
                  <p>Python ナビの進み具合は、その生徒のパソコンに残ります（あとでもどしても、つづきから）。</p>
                </>
              )}
              {error && <p className="rounded-[12px] bg-[#fdecec] px-3 py-2 text-sm font-bold text-[#c23b3b]">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-[#f0eef7] px-6 py-4">
              <button onClick={() => setConfirmFor(null)} className="rounded-full px-5 py-2 text-sm font-bold text-[#6d6893] shadow-[inset_0_0_0_2px_#e6e1fa]">
                キャンセル
              </button>
              <button onClick={save} disabled={saving} className="rounded-full bg-[#7448f0] px-6 py-2 text-sm font-black text-white disabled:opacity-50">
                {saving ? "切りかえています…" : confirmFor.on ? "新しいコースにする" : "今までのコースにもどす"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
