/**
 * CodeBlock の Firestore と Firebase Auth の中身を JSON に書き出す（読むだけ。Firebase 側は何も変えない）
 *
 *   npx tsx scripts/supabase-migration/export-firestore.ts [--out .migration-data]
 *
 * 書き出すもの（--out の下。既定は .migration-data/。.gitignore 済み）
 *   firestore/<パス>.json … [{ path, id, data }]。サブコレクション（users/{uid}/data）もふくむ
 *   auth/users.json       … ログインのアカウント（パスワードの暗号と salt・Google のつながりをふくむ）
 *
 * ⚠ メールアドレス・パスワードの暗号が入る。移行が終わったら消す
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { decodeFields, getJson, Json, PROJECT_ID } from './firebase-rest';

const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

interface ExportedDoc {
  path: string; // 例: users/abc/data/progress
  id: string;
  data: { [key: string]: Json };
}

async function listCollectionIds(parent: string): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;
  do {
    const r = await getJson<{ collectionIds?: string[]; nextPageToken?: string }>(`${parent}:listCollectionIds`, {
      method: 'POST',
      body: JSON.stringify({ pageSize: 300, pageToken }),
    });
    ids.push(...(r.collectionIds ?? []));
    pageToken = r.nextPageToken;
  } while (pageToken);
  return ids;
}

async function exportCollection(parent: string, collectionId: string, out: Map<string, ExportedDoc[]>) {
  let pageToken: string | undefined;
  do {
    const url = `${parent}/${collectionId}?pageSize=300${pageToken ? `&pageToken=${pageToken}` : ''}&showMissing=true`;
    const r = await getJson<{ documents?: { name: string; fields?: Record<string, Record<string, unknown>> }[]; nextPageToken?: string }>(url);
    for (const d of r.documents ?? []) {
      const path = d.name.split('/documents/')[1];
      const group = path.split('/').filter((_, i) => i % 2 === 0).join('.'); // users / users.data
      if (d.fields) {
        out.set(group, [...(out.get(group) ?? []), { path, id: path.split('/').pop()!, data: decodeFields(d.fields) }]);
      }
      // 中身の無い文書（showMissing）でもサブコレクションは見る
      for (const sub of await listCollectionIds(`https://firestore.googleapis.com/v1/${d.name}`)) {
        await exportCollection(`https://firestore.googleapis.com/v1/${d.name}`, sub, out);
      }
    }
    pageToken = r.nextPageToken;
  } while (pageToken);
}

async function main() {
  const i = process.argv.indexOf('--out');
  const out = resolve(process.cwd(), i >= 0 ? process.argv[i + 1] : '.migration-data');
  mkdirSync(join(out, 'firestore'), { recursive: true });
  mkdirSync(join(out, 'auth'), { recursive: true });

  const groups = new Map<string, ExportedDoc[]>();
  for (const id of await listCollectionIds(BASE)) await exportCollection(BASE, id, groups);
  const counts: Record<string, number> = {};
  for (const [group, docs] of groups) {
    writeFileSync(join(out, 'firestore', `${group}.json`), JSON.stringify(docs));
    counts[group] = docs.length;
  }

  const users: unknown[] = [];
  let nextPageToken: string | undefined;
  do {
    const r = await getJson<{ users?: Record<string, unknown>[]; nextPageToken?: string }>(
      `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:batchGet?maxResults=500${nextPageToken ? `&nextPageToken=${nextPageToken}` : ''}`
    );
    for (const u of r.users ?? []) {
      users.push({
        uid: u.localId,
        email: u.email ?? null,
        emailVerified: u.emailVerified ?? false,
        displayName: u.displayName ?? null,
        disabled: u.disabled ?? false,
        providers: ((u.providerUserInfo as Record<string, unknown>[]) ?? []).map((p) => ({
          providerId: p.providerId,
          uid: p.rawId ?? null,
          email: p.email ?? null,
        })),
        passwordHash: u.passwordHash ?? null,
        passwordSalt: u.salt ?? null,
        createdAt: u.createdAt ? new Date(Number(u.createdAt)).toISOString() : null,
        lastSignInAt: u.lastLoginAt ? new Date(Number(u.lastLoginAt)).toISOString() : null,
      });
    }
    nextPageToken = r.nextPageToken;
  } while (nextPageToken);
  writeFileSync(join(out, 'auth', 'users.json'), JSON.stringify(users));

  writeFileSync(join(out, 'export-summary.json'), JSON.stringify({ exportedAt: new Date().toISOString(), counts, authUsers: users.length }, null, 2));
  console.log('書き出しました:', out);
  console.table(counts);
  console.log(`ログインのアカウント: ${users.length} 件`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
