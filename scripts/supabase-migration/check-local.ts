/**
 * 手元の Postgres（PGlite・メモリの中だけ）で、migration と移すデータとパスワードの暗号を確かめる（どこにもつながない）
 *
 *   npx tsx scripts/supabase-migration/check-local.ts [--data .migration-data]
 *   （パスワードも見るとき）CHECK_USERNAME=<ユーザーID> CHECK_PASSWORD=<パスワード> をつける
 */

import { createCipheriv, scryptSync, timingSafeEqual } from 'crypto';
import { readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { PGlite } from '@electric-sql/pglite';
import { fetchHashConfig } from './firebase-rest';
import { INSERT_ORDER } from './import-supabase';
import { LOGIN_EMAIL_DOMAIN, TransformedAuthUser } from './transform';

const SUPABASE_STUB = `
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create table auth.users (id uuid primary key, email text);
create function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
$$;
create function auth.uid() returns uuid language sql stable as $$
  select nullif(auth.jwt() ->> 'sub', '')::uuid
$$;
grant usage on schema auth to anon, authenticated, service_role;
grant execute on all functions in schema auth to anon, authenticated, service_role;
`;
const SUPABASE_GRANTS = `
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
`;

async function main() {
  const i = process.argv.indexOf('--data');
  const data = resolve(process.cwd(), i >= 0 ? process.argv[i + 1] : '.migration-data');
  const readRows = (table: string) => JSON.parse(readFileSync(join(data, 'transformed', `${table}.json`), 'utf8')) as Record<string, unknown>[];
  const authUsers = JSON.parse(readFileSync(join(data, 'transformed', 'auth-users.json'), 'utf8')) as TransformedAuthUser[];

  const db = new PGlite();
  await db.exec(SUPABASE_STUB);
  const dir = resolve(process.cwd(), 'supabase/migrations');
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
    await db.exec(readFileSync(join(dir, file), 'utf8'));
    console.log(`✓ migration: ${file}`);
  }
  await db.exec(SUPABASE_GRANTS);

  for (const u of authUsers) await db.query('insert into auth.users (id, email) values ($1, $2)', [u.id, u.email]);
  const json = new Set(
    (await db.query<{ c: string }>(`select table_name || '.' || column_name as c from information_schema.columns where table_schema = 'public' and data_type = 'jsonb'`)).rows.map((r) => r.c)
  );
  for (const table of INSERT_ORDER) {
    for (const row of readRows(table)) {
      const keys = Object.keys(row);
      const isJson = (k: string) => json.has(`${table}.${k}`);
      await db.query(
        `insert into public.${table} (${keys.map((k) => `"${k}"`).join(', ')}) values (${keys.map((k, n) => `$${n + 1}${isJson(k) ? '::jsonb' : ''}`).join(', ')})`,
        keys.map((k) => (isJson(k) ? JSON.stringify(row[k]) : row[k]))
      );
    }
  }
  console.log(`✓ データ: アカウント ${authUsers.length} 件・${INSERT_ORDER.map((t) => `${t} ${readRows(t).length} 行`).join('・')}`);

  // ---------- 行ごとの決まり ----------
  const results: [string, boolean][] = [];
  const check = (name: string, ok: boolean) => results.push([name, ok]);
  const succeeds = async (sql: string) => db.query(sql).then(() => true, () => false);
  const count = async (sql: string) => Number((await db.query<{ n: number }>(`select count(*)::int as n from (${sql}) t`)).rows[0].n);
  async function as(claims: Record<string, unknown> | null, role: string, fn: () => Promise<void>) {
    await db.exec(`set role ${role}`);
    await db.query(`select set_config('request.jwt.claims', $1, false)`, [claims ? JSON.stringify(claims) : '']);
    try {
      await fn();
    } finally {
      await db.exec('reset role');
    }
  }

  const user = (await db.query<{ id: string; username: string | null; login_email: string }>(
    `select p.id, p.username, p.login_email from public.profiles p join public.user_progress u on u.user_id = p.id limit 1`
  )).rows[0];
  const all = await count('select 1 from public.profiles');
  await as({ sub: user.id, email: user.login_email, role: 'authenticated' }, 'authenticated', async () => {
    check('本人：自分の行だけ見える', (await count('select 1 from public.profiles')) === 1);
    check('本人：自分の進み具合が見える', (await count('select 1 from public.user_progress')) === 1);
    check('本人：xp・実績は変えられる', await succeeds(`update public.profiles set xp = xp + 10, total_correct = total_correct + 1 where id = '${user.id}'`));
    check('本人：プランは変えられない', !(await succeeds(`update public.profiles set plan = 'yearly' where id = '${user.id}'`)));
    check('本人：終了日は変えられない', !(await succeeds(`update public.profiles set plan_end_date = now() + interval '10 years' where id = '${user.id}'`)));
  });
  await as({ sub: 'ffffffff-ffff-4fff-8fff-ffffffffffff', email: 'new@codeblock.local', role: 'authenticated' }, 'authenticated', async () => {
    check('新しい人：有料プランで登録はできない', !(await succeeds(`insert into public.profiles (id, display_name, plan) values ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'x', 'yearly')`)));
  });
  await as({ sub: user.id, email: 'plus.one.0312.0717@gmail.com', role: 'authenticated' }, 'authenticated', async () => {
    check('管理者：全員が見える', (await count('select 1 from public.profiles')) === all);
    check('管理者：プランを変えられる', await succeeds(`update public.profiles set plan = plan where id = '${user.id}'`));
  });
  await as(null, 'anon', async () => {
    check('ログインしていない人：何も見えない', (await count('select 1 from public.profiles')) === 0);
    if (user.username) {
      const r = await db.query<{ e: boolean }>(`select public.username_exists($1) as e`, [user.username]);
      check('ログインしていない人：ユーザーIDがあるかは確かめられる', r.rows[0].e === true);
    }
  });
  for (const [name, ok] of results) console.log(`${ok ? '✓' : '✗'} ${name}`);
  const failed = results.filter(([, ok]) => !ok).length;
  console.log(failed ? `✗ ${failed} 件が合いません` : `✓ 決まり（RLS）の確かめ ${results.length} 件がすべて合いました`);
  if (failed) process.exitCode = 1;
  await db.close();

  // ---------- パスワードの暗号（Supabase Auth と同じ計算） ----------
  if (process.env.CHECK_USERNAME && process.env.CHECK_PASSWORD) {
    const email = `${process.env.CHECK_USERNAME.toLowerCase()}@${LOGIN_EMAIL_DOMAIN}`;
    const u = authUsers.find((a) => a.email === email);
    if (!u?.passwordHash || !u.passwordSalt) throw new Error(`${email} のパスワードの暗号がありません`);
    const config = await fetchHashConfig();
    const N = 2 ** config.memoryCost;
    const keyBytes = scryptSync(process.env.CHECK_PASSWORD, Buffer.concat([Buffer.from(u.passwordSalt, 'base64'), Buffer.from(config.saltSeparator, 'base64')]), 32, {
      N,
      r: config.rounds,
      p: 1,
      maxmem: 256 * N * config.rounds + 1024 * 1024,
    });
    const c = createCipheriv('aes-256-ctr', keyBytes, Buffer.alloc(16, 0));
    const actual = Buffer.concat([c.update(Buffer.from(config.signerKey, 'base64')), c.final()]);
    const expected = Buffer.from(u.passwordHash, 'base64');
    const ok = actual.length === expected.length && timingSafeEqual(actual, expected);
    console.log(ok ? `✓ ${email}: パスワードの暗号が合いました` : `✗ ${email}: 合いません`);
    if (!ok) process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
