/**
 * transform.ts で作った行を Supabase に入れる
 *
 *   npx tsx scripts/supabase-migration/import-supabase.ts [--data .migration-data] [--reset --confirm <プロジェクトのID>] --yes
 *
 * 必要な環境変数（.env.local でもよい）：SUPABASE_URL（または NEXT_PUBLIC_SUPABASE_URL）・SUPABASE_SERVICE_ROLE_KEY
 *
 * - --yes が無いときは、何をするかを出すだけ（書きこまない）
 * - 入れる先に行があると止まる。--reset --confirm <プロジェクトのID> で、表を空にし、前に移したアカウントを消してから入れる
 *   ⚠ 切りかえたあとの本番では --reset を使わない
 * - ユーザーID＋パスワードの人：Firebase のパスワードの暗号（scrypt）のまま入れる（$fbscrypt$ の形）
 * - Google の人：同じメールで「確認ずみ」のアカウントを作る。Google でログインすると、Supabase が自動でこのアカウントにつなぐ
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { fetchHashConfig, FirebaseHashConfig } from './firebase-rest';
import type { TransformedAuthUser } from './transform';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

export const INSERT_ORDER = ['profiles', 'user_progress'];

const has = (flag: string) => process.argv.includes(flag);
function argValue(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

export function firebaseScryptHash(user: TransformedAuthUser, config: FirebaseHashConfig): string | null {
  if (!user.passwordHash || !user.passwordSalt) return null;
  return (
    `$fbscrypt$v=1,n=${config.memoryCost},r=${config.rounds},p=1,` +
    `ss=${config.saltSeparator},sk=${config.signerKey}$${user.passwordSalt}$${user.passwordHash}`
  );
}

async function main() {
  const data = resolve(process.cwd(), argValue('--data') ?? '.migration-data');
  const apply = has('--yes');
  const reset = has('--reset');
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
  if (reset) {
    const ref = new URL(url).hostname.split('.')[0];
    if (argValue('--confirm') !== ref) throw new Error(`--reset には --confirm ${ref} が要ります`);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const readRows = (table: string) =>
    JSON.parse(readFileSync(join(data, 'transformed', `${table}.json`), 'utf8')) as Record<string, unknown>[];
  const authUsers = JSON.parse(readFileSync(join(data, 'transformed', 'auth-users.json'), 'utf8')) as TransformedAuthUser[];

  console.log(`入れる先: ${url}`);
  const nonEmpty: string[] = [];
  for (const table of INSERT_ORDER) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) throw new Error(`${table} を読めません: ${error.message}（migration を先に流す）`);
    if (count) nonEmpty.push(`${table}(${count})`);
  }
  if (nonEmpty.length && !reset) throw new Error(`入れる先に行があります: ${nonEmpty.join(', ')}。やり直すときは --reset`);
  if (!apply) {
    console.log(`アカウント ${authUsers.length} 件・${INSERT_ORDER.map((t) => `${t} ${readRows(t).length} 行`).join('・')}`);
    console.log('--yes が無いので、ここで止めます（書きこんでいません）');
    return;
  }
  if (reset) await resetTarget(supabase);

  const hashConfig = authUsers.some((u) => u.passwordHash) ? await fetchHashConfig() : null;
  let withPassword = 0;
  for (const u of authUsers) {
    const passwordHash = hashConfig ? firebaseScryptHash(u, hashConfig) : null;
    if (passwordHash) withPassword++;
    const { error } = await supabase.auth.admin.createUser({
      id: u.id,
      email: u.email,
      email_confirm: true,
      ...(passwordHash ? { password_hash: passwordHash } : {}),
      ...(u.disabled ? { ban_duration: '876000h' } : {}),
      user_metadata: u.displayName ? { display_name: u.displayName } : {},
      app_metadata: { firebase_uid: u.firebaseUid, firebase_providers: u.providers },
    });
    if (error) throw new Error(`アカウント ${u.firebaseUid} を作れません: ${error.message}`);
  }
  console.log(`アカウントを作りました: ${authUsers.length} 件（パスワードつき ${withPassword} 件・Google など ${authUsers.length - withPassword} 件）`);

  for (const table of INSERT_ORDER) {
    const rows = readRows(table);
    if (rows.length) {
      const { error } = await supabase.from(table).insert(rows, { defaultToNull: false });
      if (error) throw new Error(`${table} に入れられません: ${error.message} ${error.details ?? ''}`);
    }
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    console.log(`${count === rows.length ? '✓' : '✗'} ${table}: ${count} 行（${rows.length} 行のはず）`);
    if (count !== rows.length) process.exitCode = 1;
  }
}

async function resetTarget(supabase: SupabaseClient) {
  for (const [table, column] of [['user_progress', 'user_id'], ['profiles', 'id']] as const) {
    const { error } = await supabase.from(table).delete().not(column, 'is', null);
    if (error) throw new Error(`${table} を空にできません: ${error.message}`);
  }
  let removed = 0;
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    for (const u of data.users) {
      if (u.app_metadata?.firebase_uid) {
        const { error: delError } = await supabase.auth.admin.deleteUser(u.id);
        if (delError) throw delError;
        removed++;
      }
    }
    if (data.users.length < 1000) break;
  }
  console.log(`--reset: 表を空にし、前に移したアカウント ${removed} 件を消しました`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
