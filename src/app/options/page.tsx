"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSettings, saveSettings, AppSettings } from "@/utils/settings";
import { useAuth } from "@/contexts/AuthContext";
import { updateDisplayName, updateEmail, changePassword, isGoogleUser } from "@/lib/auth";

export default function OptionsPage() {
  const { user, userId, displayName, contactEmail, refreshUserInfo } = useAuth();
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
  });
  const [saved, setSaved] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  useEffect(() => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
  }, []);

  useEffect(() => {
    setIsGoogleAccount(isGoogleUser());
  }, [user]);

  const handleSoundToggle = () => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(newSettings);
    saveSettings(newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpdateDisplayName = async () => {
    if (!user) return;
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      await updateDisplayName(user.uid, newDisplayName);
      await refreshUserInfo();
      setSuccess("ユーザー名を変更しました！");
      setIsEditing(false);
      setNewDisplayName("");
    } catch (err: any) {
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!user) return;
    setEmailError("");
    setEmailSuccess("");
    setEmailLoading(true);
    
    try {
      await updateEmail(user.uid, newEmail);
      await refreshUserInfo();
      setEmailSuccess("メールアドレスを設定しました！");
      setIsEditingEmail(false);
    } catch (err: any) {
      setEmailError(err.message || "エラーが発生しました");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    
    if (newPassword !== confirmPassword) {
      setPasswordError("新しいパスワードが一致しません");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("新しいパスワードは6文字以上にしてください");
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess("パスワードを変更しました！");
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "エラーが発生しました");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">オプション</h1>
        </div>

        {/* アカウント設定 */}
        {user && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 mb-4">
            <h3 className="font-bold text-gray-800 mb-4">アカウント</h3>
            
            <div className="mb-4">
              <span className="text-sm text-gray-500">ユーザーID（ログイン用）</span>
              <p className="text-gray-700">{userId}</p>
            </div>
            
            <div className="border-t pt-4">
              <span className="text-sm text-gray-500">ユーザー名（表示用）</span>
              
              {!isEditing ? (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-700">{displayName || "（未設定）"}</span>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setNewDisplayName(displayName || "");
                    }}
                    className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full"
                  >
                    変更
                  </button>
                </div>
              ) : (
                <div className="space-y-2 mt-1">
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="ユーザー名を入力"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                  
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {success && <p className="text-green-500 text-sm">{success}</p>}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateDisplayName}
                      disabled={loading}
                      className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full disabled:opacity-50"
                    >
                      {loading ? "変更中..." : "保存"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewDisplayName("");
                        setError("");
                      }}
                      className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t pt-3 mt-3">
              <span className="text-sm text-gray-500">メールアドレス</span>
              
              {!isEditingEmail ? (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-700">{contactEmail || "（未設定）"}</span>
                  <button
                    onClick={() => {
                      setIsEditingEmail(true);
                      setNewEmail(contactEmail || "");
                    }}
                    className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full"
                  >
                    {contactEmail ? "変更" : "設定"}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 mt-1">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                  
                  {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                  {emailSuccess && <p className="text-green-500 text-sm">{emailSuccess}</p>}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateEmail}
                      disabled={emailLoading}
                      className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full disabled:opacity-50"
                    >
                      {emailLoading ? "保存中..." : "保存"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingEmail(false);
                        setNewEmail("");
                        setEmailError("");
                      }}
                      className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {user && !isGoogleAccount && (
              <div className="border-t pt-3 mt-3">
                <span className="text-sm text-gray-500">パスワード</span>
                
                {!isEditingPassword ? (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-700">••••••••</span>
                    <button
                      onClick={() => setIsEditingPassword(true)}
                      className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full"
                    >
                      変更
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 mt-1">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="現在のパスワード"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="新しいパスワード（6文字以上）"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="新しいパスワード（確認）"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                    
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full disabled:opacity-50"
                      >
                        {passwordLoading ? "変更中..." : "保存"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingPassword(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setPasswordError("");
                        }}
                        className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {user && isGoogleAccount && (
              <div className="border-t pt-3 mt-3">
                <span className="text-sm text-gray-500">パスワード</span>
                <p className="text-gray-600 text-sm mt-1">
                  Googleアカウントでログインしているため、パスワードはGoogleで管理されています。
                </p>
              </div>
            )}
          </div>
        )}

        {/* 設定カード */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          
          {/* 効果音設定 */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔊</span>
              <div>
                <p className="font-bold text-gray-800">効果音</p>
                <p className="text-sm text-gray-500">ブロック追加・正解時の音</p>
              </div>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.soundEnabled ? "bg-green-400" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                  settings.soundEnabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* 保存完了メッセージ */}
          {saved && (
            <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-center font-medium">
              ✓ 設定を保存しました
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

