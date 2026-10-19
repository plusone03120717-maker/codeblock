/**
 * 移行スクリプト用：Firebase（codeblock-app-863d0）を REST で読む（読むだけ）
 *
 * CodeBlock にはサービスアカウントキーが無いので、Firebase CLI のログイン（firebase login）を使う。
 * FIREBASE_ACCESS_TOKEN があればそれを使う
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export const PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? 'codeblock-app-863d0';

let cachedToken: string | null = null;

export function accessToken(): string {
  if (process.env.FIREBASE_ACCESS_TOKEN) return process.env.FIREBASE_ACCESS_TOKEN;
  if (cachedToken) return cachedToken;
  // CLI を1回動かすと、保存されているトークンが新しくなる
  execSync('firebase projects:list', { stdio: 'ignore' });
  const config = JSON.parse(readFileSync(join(homedir(), '.config', 'configstore', 'firebase-tools.json'), 'utf8'));
  const token = config?.tokens?.access_token;
  if (!token) throw new Error('Firebase CLI にログインしてください（firebase login）');
  cachedToken = token as string;
  return cachedToken;
}

export async function getJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken()}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as T;
}

type FirestoreValue = Record<string, unknown>;
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** Firestore REST の値 → ふつうの JSON。時刻は { __ts: ISO } */
export function decodeValue(v: FirestoreValue): Json {
  if ('nullValue' in v) return null;
  if ('stringValue' in v) return v.stringValue as string;
  if ('booleanValue' in v) return v.booleanValue as boolean;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('timestampValue' in v) return { __ts: new Date(v.timestampValue as string).toISOString() };
  if ('referenceValue' in v) return { __ref: String(v.referenceValue).split('/documents/')[1] ?? String(v.referenceValue) };
  if ('geoPointValue' in v) {
    const g = v.geoPointValue as { latitude?: number; longitude?: number };
    return { __geo: [g.latitude ?? 0, g.longitude ?? 0] };
  }
  if ('bytesValue' in v) return { __bytes: v.bytesValue as string };
  if ('arrayValue' in v) return ((v.arrayValue as { values?: FirestoreValue[] }).values ?? []).map(decodeValue);
  if ('mapValue' in v) return decodeFields((v.mapValue as { fields?: Record<string, FirestoreValue> }).fields ?? {});
  throw new Error(`知らない形の値: ${Object.keys(v).join(',')}`);
}

export function decodeFields(fields: Record<string, FirestoreValue>): { [key: string]: Json } {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]));
}

export interface FirebaseHashConfig {
  signerKey: string;
  saltSeparator: string;
  rounds: number;
  memoryCost: number;
}

/** パスワードの暗号の鍵（コンソールの「パスワード ハッシュ パラメータ」と同じ）。画面に出さない・ファイルに書かない */
export async function fetchHashConfig(): Promise<FirebaseHashConfig> {
  const body = await getJson<{ signIn?: { hashConfig?: Record<string, unknown> } }>(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config`
  );
  const h = body.signIn?.hashConfig;
  if (!h || h.algorithm !== 'SCRYPT') throw new Error('パスワードの暗号が SCRYPT ではありません');
  return {
    signerKey: String(h.signerKey),
    saltSeparator: String(h.saltSeparator),
    rounds: Number(h.rounds),
    memoryCost: Number(h.memoryCost),
  };
}
