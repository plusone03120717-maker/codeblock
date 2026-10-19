/**
 * 書き出した CodeBlock の Firestore の JSON → Supabase に入れる形（行）に直す（ファイルを読んで書くだけ）
 *
 *   npx tsx scripts/supabase-migration/transform.ts [--data .migration-data]
 *
 * 作るもの（--data の下）
 *   transformed/profiles.json・user_progress.json … 入れる行
 *   transformed/auth-users.json                  … Supabase Auth に作るアカウント
 *   transform-report.json                        … 件数・「注意」・入れなかったもの
 */

import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import type { Json } from './firebase-rest';

type Row = Record<string, Json>;
interface ExportedDoc {
  path: string;
  id: string;
  data: Record<string, Json>;
}
interface ExportedAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  disabled: boolean;
  providers: { providerId: string; uid: string | null; email: string | null }[];
  passwordHash: string | null;
  passwordSalt: string | null;
  createdAt: string | null;
}
export interface TransformedAuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  disabled: boolean;
  providers: string[];
  passwordHash: string | null;
  passwordSalt: string | null;
}

export const LOGIN_EMAIL_DOMAIN = 'codeblock.local';

// Firebase のログインID → UUID を毎回同じに決める（UUID v5）。PLUS Navi とは別の名前空間
const UUID_NAMESPACE = '8f1d2c3b-4a5e-4b6c-8d7e-9f0a1b2c3d4e';
export function uuidFromFirebaseUid(uid: string): string {
  const ns = Buffer.from(UUID_NAMESPACE.replace(/-/g, ''), 'hex');
  const b = Buffer.from(createHash('sha1').update(Buffer.concat([ns, Buffer.from(uid, 'utf8')])).digest().subarray(0, 16));
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** Firebase の base64（URL 用の - _）→ 標準の base64（Supabase Auth が読む形） */
export function toStdBase64(value: string): string {
  const s = value.replace(/-/g, '+').replace(/_/g, '/');
  return s + '='.repeat((4 - (s.length % 4)) % 4);
}

const isTs = (v: unknown): v is { __ts: string } =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && typeof (v as { __ts?: unknown }).__ts === 'string';

function toJson(value: Json): Json {
  if (isTs(value)) return value.__ts;
  if (Array.isArray(value)) return value.map(toJson);
  if (value && typeof value === 'object') {
    if (typeof value.__ref === 'string') return value.__ref;
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toJson(v)]));
  }
  return value;
}

// users の項目 → profiles の列
const COLUMNS: Record<string, [string, 'text' | 'int' | 'bool' | 'ts' | 'json']> = {
  displayName: ['display_name', 'text'],
  contactEmail: ['contact_email', 'text'],
  xp: ['xp', 'int'],
  level: ['level', 'int'],
  achievements: ['achievements', 'json'],
  pendingAchievements: ['pending_achievements', 'json'],
  lessonsCompleted: ['lessons_completed', 'json'],
  lessonCompleteCounts: ['lesson_complete_counts', 'json'],
  totalCorrect: ['total_correct', 'int'],
  streakDays: ['streak_days', 'int'],
  consecutiveCorrect: ['consecutive_correct', 'int'],
  maxConsecutiveCorrect: ['max_consecutive_correct', 'int'],
  noMistakeLessons: ['no_mistake_lessons', 'json'],
  noHintLessons: ['no_hint_lessons', 'json'],
  fastLessons: ['fast_lessons', 'json'],
  studiedOnWeekend: ['studied_on_weekend', 'bool'],
  studiedEarly: ['studied_early', 'bool'],
  createdAt: ['created_at', 'ts'],
  updatedAt: ['updated_at', 'ts'],
};

function main() {
  const i = process.argv.indexOf('--data');
  const data = resolve(process.cwd(), i >= 0 ? process.argv[i + 1] : '.migration-data');
  const read = <T>(path: string, fallback: T): T =>
    existsSync(join(data, path)) ? (JSON.parse(readFileSync(join(data, path), 'utf8')) as T) : fallback;

  const warnings: string[] = [];
  const skipped: { what: string; id: string; reason: string }[] = [];

  // ---------- ログインのアカウント ----------
  const uidMap = new Map<string, string>();
  const authUsers: TransformedAuthUser[] = [];
  for (const u of read<ExportedAuthUser[]>('auth/users.json', [])) {
    if (!u.email) {
      skipped.push({ what: 'auth_users', id: u.uid, reason: 'メールなし' });
      continue;
    }
    const id = uuidFromFirebaseUid(u.uid);
    uidMap.set(u.uid, id);
    authUsers.push({
      id,
      firebaseUid: u.uid,
      email: u.email.toLowerCase(),
      displayName: u.displayName,
      disabled: u.disabled,
      providers: u.providers.map((p) => p.providerId),
      passwordHash: u.passwordHash ? toStdBase64(u.passwordHash) : null,
      passwordSalt: u.passwordSalt ? toStdBase64(u.passwordSalt) : null,
    });
    if (u.providers.some((p) => p.providerId === 'password') && !u.passwordHash) {
      warnings.push(`アカウント ${u.uid}: パスワードの暗号がありません`);
    }
  }

  // ---------- ユーザーID（userIds・古い usernames） ----------
  const usernameOf = new Map<string, string>(); // uid → ユーザーID
  for (const file of ['firestore/userIds.json', 'firestore/usernames.json']) {
    for (const d of read<ExportedDoc[]>(file, [])) {
      const uid = d.data.uid;
      if (typeof uid !== 'string') continue;
      const name = d.id.toLowerCase();
      const before = usernameOf.get(uid);
      if (before && before !== name) warnings.push(`ユーザーID: ${uid} に ${before} と ${name} の2つ（${before} を使う）`);
      if (!before) usernameOf.set(uid, name);
    }
  }

  // ---------- profiles ----------
  const profiles: Row[] = [];
  for (const d of read<ExportedDoc[]>('firestore/users.json', [])) {
    const id = uidMap.get(d.id);
    if (!id) {
      skipped.push({ what: 'profiles', id: d.id, reason: 'ログインのアカウントがない users の文書' });
      continue;
    }
    const auth = authUsers.find((u) => u.id === id)!;
    const row: Row = { id, firebase_uid: d.id, login_email: auth.email };
    const extra: Record<string, Json> = {};
    for (const [field, value] of Object.entries(d.data)) {
      const col = COLUMNS[field];
      if (field === 'uid' && value === d.id) continue;
      if (field === 'subscription' && value && typeof value === 'object' && !Array.isArray(value)) {
        const { plan, status, startDate, endDate, stripeCustomerId, stripeSubscriptionId, ...rest } = value as Record<string, Json>;
        if (typeof plan === 'string') row.plan = plan;
        if (typeof status === 'string') row.plan_status = status;
        if (isTs(startDate)) row.plan_start_date = startDate.__ts;
        if (isTs(endDate)) row.plan_end_date = endDate.__ts;
        if (typeof stripeCustomerId === 'string') row.stripe_customer_id = stripeCustomerId;
        if (typeof stripeSubscriptionId === 'string') row.stripe_subscription_id = stripeSubscriptionId;
        if (Object.keys(rest).length) extra.subscription = toJson(rest);
        continue;
      }
      if (field === 'lastStudyDate') {
        if (typeof value === 'string') row.last_study_date = value;
        else if (isTs(value)) row.last_study_date = value.__ts;
        else if (value !== null) extra[field] = toJson(value);
        continue;
      }
      if (!col) {
        extra[field] = toJson(value);
        continue;
      }
      const [column, type] = col;
      const ok =
        value === null ||
        (type === 'text' && typeof value === 'string') ||
        (type === 'int' && typeof value === 'number' && Number.isInteger(value)) ||
        (type === 'bool' && typeof value === 'boolean') ||
        (type === 'ts' && isTs(value)) ||
        type === 'json';
      if (!ok) {
        warnings.push(`users/${d.id}.${field}: 型が ${type} ではないので extra に入れました`);
        extra[field] = toJson(value);
      } else if (value !== null) {
        row[column] = type === 'ts' ? (value as { __ts: string }).__ts : type === 'json' ? toJson(value) : value;
      }
    }
    // ユーザーID：userIds → users.username → ログインのメール（@codeblock.local）の順
    const [local, domain] = auth.email.split('@');
    const fromDoc = typeof d.data.username === 'string' ? d.data.username.toLowerCase() : null;
    row.username = usernameOf.get(d.id) ?? fromDoc ?? (domain === LOGIN_EMAIL_DOMAIN ? local : null);
    if (Object.keys(extra).length) row.extra = extra;
    profiles.push(row);
  }
  for (const u of authUsers) {
    if (!profiles.some((p) => p.id === u.id)) warnings.push(`アカウント ${u.firebaseUid}（${u.providers.join(',')}）: users の文書がありません`);
  }
  const names = new Map<string, number>();
  for (const p of profiles) if (p.username) names.set(String(p.username), (names.get(String(p.username)) ?? 0) + 1);
  for (const [name, n] of names) if (n > 1) warnings.push(`ユーザーID ${name} が ${n} 人（一意にできない）`);

  // ---------- user_progress（users/{uid}/data/progress） ----------
  const progress: Row[] = [];
  for (const d of read<ExportedDoc[]>('firestore/users.data.json', [])) {
    const uid = d.path.split('/')[1];
    const userId = uidMap.get(uid);
    if (d.id !== 'progress') {
      skipped.push({ what: 'user_progress', id: d.path, reason: 'progress 以外の文書（対応を足す）' });
      continue;
    }
    if (!userId || !profiles.some((p) => p.id === userId)) {
      skipped.push({ what: 'user_progress', id: d.path, reason: 'その人の profiles がない' });
      continue;
    }
    progress.push({ user_id: userId, progress: toJson(d.data) });
  }

  const tables = { profiles, user_progress: progress };
  mkdirSync(join(data, 'transformed'), { recursive: true });
  for (const [table, rows] of Object.entries(tables)) writeFileSync(join(data, 'transformed', `${table}.json`), JSON.stringify(rows));
  writeFileSync(join(data, 'transformed', 'auth-users.json'), JSON.stringify(authUsers));
  writeFileSync(join(data, 'transform-report.json'), JSON.stringify({ warnings, skipped }, null, 2));

  console.log(`アカウント ${authUsers.length} 件・profiles ${profiles.length} 行・user_progress ${progress.length} 行`);
  for (const s of skipped) console.log(`入れなかった: ${s.what} ${s.id}（${s.reason}）`);
  for (const w of warnings) console.log(`注意: ${w}`);
}

if (require.main === module) main();
