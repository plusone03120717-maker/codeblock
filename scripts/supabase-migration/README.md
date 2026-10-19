# Firebase → Supabase の移行（データ）

CodeBlock のデータを Firestore・Firebase Auth（プロジェクト `codeblock-app-863d0`）から Supabase に移すためのスクリプト。
計画は vault の「CodeBlock の Supabase 移行計画」。この PR では**表・行ごとの決まり（RLS）・データ移し**だけを作る。アプリのコードはまだ Firebase のまま。

## ファイル
| ファイル | すること | つなぐ先 |
|---|---|---|
| `supabase/migrations/20261020000000_initial_schema.sql` | 表 2 個（profiles・user_progress）・RLS・ユーザーIDの確かめ（username_exists） | — |
| `export-firestore.ts` | Firestore（サブコレクションもふくむ）と Firebase Auth を JSON に書き出す | Firebase（**読むだけ**。Firebase CLI のログインを使う） |
| `transform.ts` | JSON → 表に入れる行に直す | どこにもつながない |
| `check-local.ts` | 手元の Postgres（PGlite）に migration と全データを入れ、RLS を確かめる（パスワードの暗号も見られる） | どこにもつながない（暗号を見るときだけ Firebase の鍵を読む） |
| `import-supabase.ts` | 行とアカウントを Supabase に入れ、件数を確かめる | Supabase（書く） |

## 決めごと
| Firestore | Supabase |
|---|---|
| `users/{uid}` | `profiles`（実績は列に、プランは `plan`・`plan_status`・`plan_start_date`・`plan_end_date`・Stripe の ID に分ける。ほかは `extra`） |
| `users/{uid}/data/progress` | `user_progress.progress`（jsonb のまま） |
| `userIds`・`usernames` | `profiles.username`（一意）。ログイン前の確かめは `username_exists()` |
| `passwordResets` | 移さない（今は動いていない） |

- **プランは本人が変えられない**（トリガー）。今は `/subscription/success?plan=yearly` を開くだけで有料になるが、Supabase ではサーバー（Stripe の webhook）か管理者だけが変えられる。画面のコードを書きかえるときに、支払いの確かめをサーバーに移す
- ユーザーID＋パスワードの人：Firebase の暗号（scrypt）のまま `$fbscrypt$…` で入れる。入れ直し不要
- Google の人：同じメールで「確認ずみ」のアカウントを作る。Google でログインすると Supabase が同じメールのアカウントに自動でつなぐ（Identity Linking）。Supabase に Google ログインの設定が要る

## 2026-10-20 に本番の写しで確かめた結果
| こと | 結果 |
|---|---|
| 書き出し | users 11・users/{uid}/data 8・userIds 5・usernames 2・アカウント 13（パスワード 7・Google 6） |
| 直した行 | profiles 11・user_progress 8・アカウント 13 |
| 手元の Postgres | migration ✓・全行が入った ✓ |
| RLS | 10 件 ✓（本人は自分の行だけ・xp や実績は変えられる・プランと終了日は変えられない・有料プランで登録できない・管理者はすべて・ログインしていない人は何も見えないがユーザーIDの有無は確かめられる） |
| パスワード | 暗号は 64 バイト・salt 10 バイトで、PLUS Navi（同じ計算で一致を確かめた）と同じ形。パスワードの分かるテスト用アカウントが無いので、一致はまだ見ていない |
| 注意 | users の文書が無いアカウント 2 件（パスワード）。プランの記録が無い人 1 人は free にした |

## 手順
```bash
firebase login   # plus.one.0312.0717@gmail.com
npx tsx scripts/supabase-migration/export-firestore.ts
npx tsx scripts/supabase-migration/transform.ts
npx tsx scripts/supabase-migration/check-local.ts
# テスト用アカウントがあれば：CHECK_USERNAME=<ID> CHECK_PASSWORD=<パスワード> npx tsx scripts/supabase-migration/check-local.ts

supabase link --project-ref <プロジェクトのID>
supabase db push

# .env.local に SUPABASE_URL・SUPABASE_SERVICE_ROLE_KEY
npx tsx scripts/supabase-migration/import-supabase.ts          # 何をするかを出すだけ
npx tsx scripts/supabase-migration/import-supabase.ts --yes    # 入れる
# やり直すとき（リハーサル中だけ）
npx tsx scripts/supabase-migration/import-supabase.ts --reset --confirm <プロジェクトのID> --yes
```

⚠ `.migration-data/` にはメール・パスワードの暗号が入る（.gitignore 済み）。移行が終わったら消す。
