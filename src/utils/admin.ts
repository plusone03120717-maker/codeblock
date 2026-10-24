// 管理者（教室の Google アカウント）。firestore.rules の isAdmin() と同じメール
export const ADMIN_EMAIL = "plus.one.0312.0717@gmail.com";

export const isAdminEmail = (email: string | null | undefined): boolean => email === ADMIN_EMAIL;
