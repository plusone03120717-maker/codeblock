"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUsers, changeUserPlan } from "@/utils/subscription";
import { UserProfile, SubscriptionPlan } from "@/types/user";
import { getStudentProgress, setStudentProgress, LESSON_STRUCTURE, ALL_LESSON_IDS } from "@/utils/adminProgress";
import { ProgressData } from "@/lib/progressSync";
import Link from "next/link";

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 進捗管理モーダル
  const [progressModalUser, setProgressModalUser] = useState<UserProfile | null>(null);
  const [studentProgress, setStudentProgressState] = useState<ProgressData | null>(null);
  const [editedCompleted, setEditedCompleted] = useState<string[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);
  const [bulkUpToLesson, setBulkUpToLesson] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const allUsers = await getAllUsers();
    setUsers(allUsers);
    setLoading(false);
  };

  const handlePlanChange = async (uid: string, newPlan: SubscriptionPlan) => {
    if (!confirm(`プランを「${newPlan}」に変更しますか？`)) return;
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
    setEditedCompleted((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
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

  const getPlanBadgeColor = (plan: SubscriptionPlan) => {
    switch (plan) {
      case "free": return "bg-gray-200 text-gray-700";
      case "monthly": return "bg-blue-200 text-blue-700";
      case "yearly": return "bg-purple-200 text-purple-700";
      case "plusone": return "bg-green-200 text-green-700";
      default: return "bg-gray-200 text-gray-700";
    }
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

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🔐 CodeBlock 管理画面</h1>
              <p className="text-gray-500 text-sm mt-1">ユーザープランの管理</p>
            </div>
            <Link href="/" className="text-purple-500 hover:text-purple-600 font-medium">
              ← ホームに戻る
            </Link>
          </div>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-gray-800">{users.length}</div>
            <div className="text-sm text-gray-500">総ユーザー数</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-gray-800">
              {users.filter(u => u.subscription.plan === "free").length}
            </div>
            <div className="text-sm text-gray-500">無料ユーザー</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {users.filter(u => ["monthly", "yearly"].includes(u.subscription.plan)).length}
            </div>
            <div className="text-sm text-gray-500">有料ユーザー</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {users.filter(u => u.subscription.plan === "plusone").length}
            </div>
            <div className="text-sm text-gray-500">plus one</div>
          </div>
        </div>

        {/* 検索 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <input
            type="text"
            placeholder="メールアドレスまたは名前で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* ユーザーリスト */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ユーザー</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">現在のプラン</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">有効期限</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">プラン変更</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">進捗</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{u.displayName || "名前未設定"}</div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanBadgeColor(u.subscription.plan)}`}>
                      {getPlanLabel(u.subscription.plan)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {u.subscription.endDate
                      ? new Date(u.subscription.endDate).toLocaleDateString("ja-JP")
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {(["free", "monthly", "yearly", "plusone"] as SubscriptionPlan[]).map((plan) => (
                        <button
                          key={plan}
                          onClick={() => handlePlanChange(u.uid, plan)}
                          disabled={u.subscription.plan === plan || updating === u.uid}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            u.subscription.plan === plan
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          } ${updating === u.uid ? "opacity-50" : ""}`}
                        >
                          {updating === u.uid ? "..." : getPlanLabel(plan)}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleOpenProgressModal(u)}
                      className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                      📚 進捗管理
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ユーザーが見つかりません
            </div>
          )}
        </div>
      </div>

      {/* 進捗管理モーダル */}
      {progressModalUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* モーダルヘッダー */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">📚 進捗管理</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {progressModalUser.displayName || "名前未設定"} ({progressModalUser.email})
                  </p>
                </div>
                <button
                  onClick={handleCloseProgressModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {progressLoading ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <>
                {/* 一括設定 */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">ここまで一括完了：</p>
                  <div className="flex gap-2 items-center">
                    <select
                      value={bulkUpToLesson}
                      onChange={(e) => setBulkUpToLesson(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">レッスンを選択...</option>
                      {LESSON_STRUCTURE.map((unit) =>
                        unit.lessons.map((lessonId) => (
                          <option key={lessonId} value={lessonId}>
                            {lessonId}（Unit {unit.unit}: {unit.name}）
                          </option>
                        ))
                      )}
                    </select>
                    <button
                      onClick={handleBulkSet}
                      disabled={!bulkUpToLesson}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      設定
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    現在の完了数：{editedCompleted.length} / {ALL_LESSON_IDS.length} レッスン
                  </p>
                </div>

                {/* レッスン一覧 */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {LESSON_STRUCTURE.map((unit) => (
                    <div key={unit.unit}>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">
                        Unit {unit.unit}：{unit.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {unit.lessons.map((lessonId) => {
                          const isCompleted = editedCompleted.includes(lessonId);
                          return (
                            <label
                              key={lessonId}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                                isCompleted
                                  ? "bg-green-50 border-green-300 text-green-800"
                                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isCompleted}
                                onChange={() => handleToggleLesson(lessonId)}
                                className="accent-green-500"
                              />
                              <span className="text-sm font-medium">{lessonId}</span>
                              {isCompleted && <span className="text-xs text-green-600">✓ 完了</span>}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* モーダルフッター */}
                <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                  <button
                    onClick={handleCloseProgressModal}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSaveProgress}
                    disabled={progressSaving}
                    className="px-5 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50"
                  >
                    {progressSaving ? "保存中..." : "保存する"}
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
