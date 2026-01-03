"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUsers, changeUserPlan } from "@/utils/subscription";
import { UserProfile, SubscriptionPlan } from "@/types/user";
import Link from "next/link";

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      await loadUsers(); // リロード
      alert("プランを変更しました");
    } catch (error) {
      console.error("Error changing plan:", error);
      alert("エラーが発生しました");
    } finally {
      setUpdating(null);
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
            <Link
              href="/"
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
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
                      : "-"
                    }
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
    </div>
  );
}

