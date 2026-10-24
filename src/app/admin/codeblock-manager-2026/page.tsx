"use client";

// CodeBlock の管理画面（先生の画面）。
// 「生徒とプラン」は今までの管理画面の機能（人数・検索・プラン変更・進捗管理）をそのまま入れたもの。
// Python ナビ（新しいコース）の「いまの教室」「苦手」「コースの切りかえ」は、Supabase に移したあとに中身を入れる。
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUsers, changeUserPlan } from "@/utils/subscription";
import { UserProfile, SubscriptionPlan } from "@/types/user";
import { getStudentProgress, setStudentProgress, LESSON_STRUCTURE, ALL_LESSON_IDS } from "@/utils/adminProgress";
import { ProgressData } from "@/lib/progressSync";
import { isAdminEmail } from "@/utils/admin";
import Link from "next/link";

type Tab = "students" | "classroom" | "weak" | "course";

const NAV: { key: Tab; icon: string; label: string; soon?: boolean }[] = [
  { key: "students", icon: "👥", label: "生徒とプラン" },
  { key: "classroom", icon: "🏫", label: "いまの教室", soon: true },
  { key: "weak", icon: "📊", label: "苦手", soon: true },
  { key: "course", icon: "⚙️", label: "コースの切りかえ", soon: true },
];

const SOON_TEXT: Record<Exclude<Tab, "students">, { title: string; body: string[] }> = {
  classroom: {
    title: "いまの教室（Python ナビ）",
    body: [
      "授業中の生徒が、いま何をしているか（動画の何分・エディターのエラー・CodeBlock の何問目）を並べて見る画面です。",
      "並び：進めない → 止まっている → 順調。ヒントを3つ使っても進めない子には「進めてOK」。",
      "生徒の進み具合を Supabase に記録するようになってから使えます。",
    ],
  },
  weak: {
    title: "苦手（Python ナビ）",
    body: [
      "生徒ごとの苦手（動画の巻き戻し・エディターのエラー・CodeBlock のまちがい・ナビへの質問から）と声かけの例、みんながつまずいているところを見る画面です。",
      "生徒の進み具合を Supabase に記録するようになってから使えます。",
    ],
  },
  course: {
    title: "コースの切りかえ（Python ナビ）",
    body: [
      "生徒ごとに「新しいコース（Python ナビ）」をオンにする画面です。押しまちがえないように、確かめの画面つきにします。",
      "今までのコースの生徒には、ナビは出ません。",
      "Supabase に移したあとに使えます。",
    ],
  },
};

const PLAN_STYLE: Record<string, string> = {
  free: "bg-[#f0eef7] text-[#6d6893]",
  monthly: "bg-[#e3ecff] text-[#2f5fd8]",
  yearly: "bg-[#efe9ff] text-[#7448f0]",
  plusone: "bg-[#e2f7ec] text-[#11845a]",
};

const getPlanLabel = (plan: SubscriptionPlan) => {
  switch (plan) {
    case "free": return "無料";
    case "monthly": return "月額";
    case "yearly": return "年間";
    case "plusone": return "plus one";
    default: return plan;
  }
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = isAdminEmail(user?.email);
  const [tab, setTab] = useState<Tab>("students");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 進捗管理の窓
  const [progressModalUser, setProgressModalUser] = useState<UserProfile | null>(null);
  const [studentProgress, setStudentProgressState] = useState<ProgressData | null>(null);
  const [editedCompleted, setEditedCompleted] = useState<string[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);
  const [bulkUpToLesson, setBulkUpToLesson] = useState("");

  // ログインしていなければログインの画面へ（終わったらここへ戻る）
  useEffect(() => {
    if (!authLoading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [authLoading, user, router, pathname]);

  const loadUsers = async () => {
    setLoading(true);
    const allUsers = await getAllUsers();
    setUsers(allUsers);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    let alive = true;
    getAllUsers().then((all) => {
      if (!alive) return;
      setUsers(all);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [isAdmin]);

  const handlePlanChange = async (uid: string, newPlan: SubscriptionPlan) => {
    if (!confirm(`プランを「${getPlanLabel(newPlan)}」に変更しますか？`)) return;
    setUpdating(uid);
    try {
      await changeUserPlan(uid, newPlan);
      await loadUsers();
      alert("プランを変更しました");
    } catch (error) {
      console.error("Error changing plan:", error);
      alert("エラーが発生しました");
    } finally {
      setUpdating(null);
    }
  };

  const handleOpenProgressModal = async (u: UserProfile) => {
    setProgressModalUser(u);
    setProgressLoading(true);
    setEditedCompleted([]);
    setBulkUpToLesson("");
    const progress = await getStudentProgress(u.uid);
    setStudentProgressState(progress);
    setEditedCompleted(progress?.completedLessons ?? []);
    setProgressLoading(false);
  };

  const handleCloseProgressModal = () => {
    setProgressModalUser(null);
    setStudentProgressState(null);
    setEditedCompleted([]);
    setBulkUpToLesson("");
  };

  const handleToggleLesson = (lessonId: string) => {
    setEditedCompleted((prev) => (prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]));
  };

  const handleBulkSet = () => {
    if (!bulkUpToLesson) return;
    const index = ALL_LESSON_IDS.indexOf(bulkUpToLesson);
    if (index === -1) return;
    setEditedCompleted(ALL_LESSON_IDS.slice(0, index + 1));
  };

  const handleSaveProgress = async () => {
    if (!progressModalUser) return;
    if (!confirm(`${progressModalUser.displayName || progressModalUser.email} の進捗を保存しますか？`)) return;
    setProgressSaving(true);
    try {
      const missionProgress = studentProgress?.missionProgress ?? {};
      await setStudentProgress(progressModalUser.uid, editedCompleted, missionProgress);
      alert("進捗を保存しました");
      handleCloseProgressModal();
    } catch (error) {
      console.error("Error saving progress:", error);
      alert("エラーが発生しました");
    } finally {
      setProgressSaving(false);
    }
  };

  if (authLoading || !user) {
    return <div className="grid min-h-screen place-items-center text-sm font-bold text-[#6d6893]">読みこみ中…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="rounded-[22px] bg-white px-10 py-8 text-center shadow-sm">
          <div className="text-xl font-black">管理者だけが使える画面です</div>
          <div className="mt-2 text-sm font-bold text-[#6d6893]">教室のアカウントでログインしてください</div>
          <Link href="/" className="mt-4 inline-block font-bold text-[#7448f0]">← ホームに戻る</Link>
        </div>
      </div>
    );
  }

  const q = searchTerm.toLowerCase();
  const filteredUsers = users.filter(
    (u) => u.email.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q) || (u.userId ?? "").toLowerCase().includes(q),
  );
  const counts = [
    { label: "総ユーザー数", value: users.length, color: "text-[#2a2452]" },
    { label: "無料", value: users.filter((u) => u.subscription.plan === "free").length, color: "text-[#6d6893]" },
    { label: "月額・年間", value: users.filter((u) => ["monthly", "yearly"].includes(u.subscription.plan)).length, color: "text-[#7448f0]" },
    { label: "plus one", value: users.filter((u) => u.subscription.plan === "plusone").length, color: "text-[#11845a]" },
  ];

  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <aside className="flex flex-col gap-1.5 border-r border-[#e6e1fa] bg-white px-3.5 py-[22px]">
        <div className="mx-2 mb-5 flex items-center gap-2.5 whitespace-nowrap text-[19px] font-bold">
          <i className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#a259ff,#4f7cff)] text-[15px] not-italic text-white">▶</i>
          CodeBlock<small className="text-xs text-[#6d6893]">管理</small>
        </div>
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => setTab(n.key)}
            className={`flex items-center gap-2.5 rounded-[14px] px-3.5 py-[11px] text-left text-[14.5px] font-bold ${
              tab === n.key ? "bg-[#efe9ff] text-[#7448f0]" : "text-[#6d6893] hover:bg-[#f7f6fc]"
            }`}
          >
            {n.icon} {n.label}
            {n.soon && <span className="ml-auto rounded-full bg-[#f0eef7] px-2 text-[11px] text-[#8a85ad]">準備中</span>}
          </button>
        ))}
        <div className="mt-auto px-2.5 text-xs font-bold text-[#6d6893]">
          <Link href="/" className="text-[#7448f0]">← ホームに戻る</Link>
          <div className="mt-2 truncate">{user.email}</div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-col gap-4 px-[26px] py-5">
        {tab === "students" ? (
          <>
            <div className="flex items-center gap-3.5">
              <h1 className="text-[23px] font-black">生徒とプラン</h1>
              <span className="rounded-full bg-[#efe9ff] px-3 py-0.5 text-[13px] font-bold text-[#7448f0]">プランの変更・進捗の管理</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {counts.map((c) => (
                <div key={c.label} className="rounded-[18px] bg-white px-5 py-4 shadow-sm">
                  <div className={`text-[30px] font-black leading-tight ${c.color}`}>{c.value}</div>
                  <div className="text-[13px] font-bold text-[#6d6893]">{c.label}</div>
                </div>
              ))}
            </div>

            <input
              type="text"
              placeholder="ユーザーID・名前・メールで検索…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-[14px] bg-white px-4 py-2.5 text-sm font-bold shadow-sm outline-none ring-[#7448f0] focus:ring-2"
            />

            <section className="overflow-hidden rounded-[22px] bg-white shadow-sm">
              {loading ? (
                <div className="py-16 text-center text-sm font-bold text-[#6d6893]">読みこみ中…</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[12.5px] tracking-wider text-[#6d6893]">
                      <th className="px-5 py-3 font-bold">生徒</th>
                      <th className="px-5 py-3 font-bold">プラン</th>
                      <th className="px-5 py-3 font-bold">有効期限</th>
                      <th className="px-5 py-3 font-bold">プランを変える</th>
                      <th className="px-5 py-3 font-bold">進捗</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="border-t border-[#f0eef7] hover:bg-[#faf8ff]">
                        <td className="px-5 py-3">
                          <div className="font-bold">{u.userId || u.displayName || "名前未設定"}</div>
                          {u.displayName && u.displayName !== u.userId && <div className="text-[13px] font-bold text-[#6d6893]">{u.displayName}</div>}
                          <div className="text-xs text-[#9893b5]">{u.email}</div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-bold ${PLAN_STYLE[u.subscription.plan] ?? PLAN_STYLE.free}`}>
                            {getPlanLabel(u.subscription.plan)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-[13px] font-bold text-[#6d6893]">
                          {u.subscription.endDate ? new Date(u.subscription.endDate).toLocaleDateString("ja-JP") : "—"}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {(["free", "monthly", "yearly", "plusone"] as SubscriptionPlan[]).map((plan) => (
                              <button
                                key={plan}
                                onClick={() => handlePlanChange(u.uid, plan)}
                                disabled={u.subscription.plan === plan || updating === u.uid}
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                  u.subscription.plan === plan ? "cursor-not-allowed bg-[#f7f6fc] text-[#c4c0da]" : "bg-[#efe9ff] text-[#7448f0] hover:bg-[#e2d8ff]"
                                } ${updating === u.uid ? "opacity-50" : ""}`}
                              >
                                {updating === u.uid ? "…" : getPlanLabel(plan)}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleOpenProgressModal(u)}
                            className="whitespace-nowrap rounded-full bg-[#e2f7ec] px-3 py-1 text-xs font-bold text-[#11845a] hover:bg-[#cdf0dc]"
                          >
                            📚 進捗管理
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && filteredUsers.length === 0 && <div className="py-8 text-center text-sm font-bold text-[#6d6893]">ユーザーが見つかりません</div>}
            </section>
          </>
        ) : (
          <section className="max-w-[720px] rounded-[22px] bg-white px-8 py-7 shadow-sm">
            <div className="flex items-center gap-3">
              <h1 className="text-[23px] font-black">{SOON_TEXT[tab].title}</h1>
              <span className="rounded-full bg-[#f0eef7] px-3 py-0.5 text-[13px] font-bold text-[#8a85ad]">準備中</span>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-[15px] font-bold leading-relaxed text-[#4a4470]">
              {SOON_TEXT[tab].body.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 進捗管理の窓 */}
      {progressModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(42,36,82,.55)] p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-[22px] bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-[#f0eef7] px-6 py-5">
              <div>
                <h2 className="text-xl font-black">📚 進捗管理</h2>
                <p className="mt-1 text-sm font-bold text-[#6d6893]">
                  {progressModalUser.userId || progressModalUser.displayName || "名前未設定"}
                  {progressModalUser.displayName && progressModalUser.displayName !== progressModalUser.userId ? ` (${progressModalUser.displayName})` : ""}
                </p>
              </div>
              <button onClick={handleCloseProgressModal} className="text-2xl leading-none text-[#9893b5] hover:text-[#2a2452]">
                ×
              </button>
            </div>

            {progressLoading ? (
              <div className="py-12 text-center text-sm font-bold text-[#6d6893]">読みこみ中…</div>
            ) : (
              <>
                <div className="border-b border-[#f0eef7] bg-[#faf9fe] px-6 py-4">
                  <p className="mb-2 text-sm font-bold">ここまで一括完了：</p>
                  <div className="flex items-center gap-2">
                    <select
                      value={bulkUpToLesson}
                      onChange={(e) => setBulkUpToLesson(e.target.value)}
                      className="flex-1 rounded-[12px] border border-[#e6e1fa] bg-white px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#22b573]"
                    >
                      <option value="">レッスンを選ぶ…</option>
                      {LESSON_STRUCTURE.map((unit) =>
                        unit.lessons.map((lessonId) => (
                          <option key={lessonId} value={lessonId}>
                            {lessonId}（Unit {unit.unit}: {unit.name}）
                          </option>
                        )),
                      )}
                    </select>
                    <button
                      onClick={handleBulkSet}
                      disabled={!bulkUpToLesson}
                      className="rounded-full bg-[#22b573] px-5 py-2 text-sm font-black text-white disabled:opacity-40"
                    >
                      設定
                    </button>
                  </div>
                  <p className="mt-1 text-xs font-bold text-[#9893b5]">
                    いまの完了数：{editedCompleted.length} / {ALL_LESSON_IDS.length} レッスン
                  </p>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
                  {LESSON_STRUCTURE.map((unit) => (
                    <div key={unit.unit}>
                      <h3 className="mb-2 text-sm font-black text-[#6d6893]">
                        Unit {unit.unit}：{unit.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {unit.lessons.map((lessonId) => {
                          const isCompleted = editedCompleted.includes(lessonId);
                          return (
                            <label
                              key={lessonId}
                              className={`flex cursor-pointer items-center gap-2 rounded-[12px] border px-3 py-2 ${
                                isCompleted ? "border-[#a8e6c6] bg-[#e2f7ec] text-[#0f7a51]" : "border-[#e6e1fa] bg-white text-[#6d6893] hover:border-[#c9c2ee]"
                              }`}
                            >
                              <input type="checkbox" checked={isCompleted} onChange={() => handleToggleLesson(lessonId)} className="accent-[#22b573]" />
                              <span className="text-sm font-bold">{lessonId}</span>
                              {isCompleted && <span className="text-xs font-bold">✓ 完了</span>}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 border-t border-[#f0eef7] px-6 py-4">
                  <button onClick={handleCloseProgressModal} className="rounded-full px-5 py-2 text-sm font-bold text-[#6d6893] shadow-[inset_0_0_0_2px_#e6e1fa]">
                    キャンセル
                  </button>
                  <button
                    onClick={handleSaveProgress}
                    disabled={progressSaving}
                    className="rounded-full bg-[#22b573] px-6 py-2 text-sm font-black text-white disabled:opacity-50"
                  >
                    {progressSaving ? "保存中…" : "保存する"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
