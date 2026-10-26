'use client'

// 先生用「こまったときカード」と「質問の記録」（2026-10-26 依頼主：Python を知らない講師でも、アプリの中で生徒の質問に対応できるように）
// ・ステップごとに、習うこと・見出しとこたえ・仕上げ5問のこたえ・よくあるつまずき・声かけを1枚で見せる（steps.json と仕上げ5問から作る）
// ・いちかへの質問（users/{uid}/naviQuestions）を、新しい順に見せる
// 答えがのっているので、教室の管理者のアカウントだけが見られる（管理画面と同じ決まり。生徒には入り口も出さない）
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, limit, orderBy, query, type Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { isAdminEmail } from '@/utils/admin'
import { getAllUsers } from '@/utils/subscription'
import { NAVI_STEPS } from '@/data/navi/steps'
import { getLessonMissions } from '@/data/missions'
import { NaviCode } from '@/components/navi/NaviCode'
import type { NaviStep } from '@/lib/navi/types'

const READY = NAVI_STEPS.filter((s) => !s.planned)

// よくあるつまずき：そのステップのコードに出てくるものから選ぶ（全角・半角はいつも）
function commonMistakes(step: NaviStep): { title: string; fix: string }[] {
  const code = step.sections.map((s) => s.code).join('\n')
  const list = [
    {
      title: '全角で打ってしまった（（ ） " や空白が全角）',
      fix: '実行すると「◯行目の「（」が全角」と出ます。キーボードの「半角/全角」キーで「A」にして打ち直させる。" " の中の日本語は全角のままでOK',
    },
  ]
  if (code.includes('"'))
    list.push({ title: '" や ) の閉じわすれ', fix: '「カッコ ( が閉じていない」などの黄色い説明が出ます。その行の " と ( ) の数を、指でかぞえさせる' })
  if (/print/.test(code)) list.push({ title: 'print のつづりまちがい（Print・prnt など）', fix: '「◯◯という名前が、まだ作られていない」と出ます。動画のコードと1文字ずつくらべさせる（ヒントで、ちがう字に色がつきます）' })
  if (/^\s*[a-z_]+\s*=/m.test(code))
    list.push({ title: '箱（変数）の名前のちがい・作るのをわすれた', fix: '「◯行目の「namae」という名前が、まだ作られていない」と出ます。= で箱を作る行が、使う行より上にあるかを見させる' })
  if (code.includes('input('))
    list.push({ title: 'input で止まったまま', fix: 'ターミナルの黄色い欄に答えを打って Enter。チャレンジは新しいファイル（challenge1.py など）だけが動くので、質問はそのチャレンジの分だけ' })
  if (/"\s*\+|\+\s*"/.test(code))
    list.push({ title: '文字と数を + でつないだ', fix: '「文字と数は + でつなげないよ」と出ます。数も " " でかこむ（"6" のように）' })
  if (/^\s{4}/m.test(code)) list.push({ title: '字下げ（行のはじめの空白）', fix: 'if や for の次の行は、半角スペース4つ（Tab キー）。黄色い説明に「字下げ」と出ます' })
  return list
}

const TALK = [
  ['エラーが出た', '「黄色い説明を、いっしょに読もう。何行目って書いてある？」'],
  ['同じにならない', '「💡 ヒントのコードと、1文字ずつくらべてみよう。色がついた字はどこ？」'],
  ['打ち方がわからない', '「動画を10秒もどして、キーの説明を見てみよう」'],
  ['意味がわからない', '「いい質問！ いちかに聞いてみよう」（いちかに質問は1日3回まで）'],
  ['どうしても進めない', '「チャレンジは『たしかめたよ』で、こたえの例を見て進んでいいよ」'],
  ['先生も答えがわからない', '「いい質問だね。メモして、あとで調べておくね」→ Discord で Python がわかるスタッフに'],
]

type QLog = { uid: string; name: string; step: number; section: number; question: string; answer: string; error: string; at: Date | null }

export function TeacherClient() {
  const { user, loading } = useAuth()
  const isAdmin = isAdminEmail(user?.email)
  const [tab, setTab] = useState<'card' | 'questions'>('card')
  const [stepNo, setStepNo] = useState(READY[0]?.step ?? 1)
  const step = useMemo(() => READY.find((s) => s.step === stepNo) ?? READY[0], [stepNo])

  if (loading) return null
  if (!isAdmin) {
    return (
      <div className="p-10 text-[16px] font-bold">
        このページは、教室の先生用です。
        <Link href="/navi" className="ml-2 text-[#7448f0] underline">
          ホームへ
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="flex h-[68px] items-center gap-6 border-b border-[#e6e1fa] bg-white px-8">
        <Link href="/navi" className="flex items-center gap-2.5 text-xl font-bold">
          <i className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#a259ff,#4f7cff)] text-[15px] not-italic text-white">▶</i>
          Python ナビ
        </Link>
        <span className="rounded-full bg-[#2a2452] px-3 py-1 text-[13px] font-black text-white">先生用</span>
        <nav className="flex gap-1.5 text-sm font-bold">
          {(
            [
              ['card', 'こまったときカード'],
              ['questions', 'いちかへの質問の記録'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-full px-4 py-2 ${tab === k ? 'bg-[#efe9ff] text-[#7448f0]' : 'text-[#6d6893] hover:bg-[#f5f3ff]'}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <span className="flex-1" />
        <Link href="/navi" className="text-sm font-bold text-[#6d6893]">
          ‹ 生徒のホームへ
        </Link>
      </header>
      {tab === 'card' ? <Card step={step} stepNo={stepNo} setStepNo={setStepNo} /> : <Questions />}
    </div>
  )
}

function Card({ step, stepNo, setStepNo }: { step: NaviStep; stepNo: number; setStepNo: (n: number) => void }) {
  const missions = step.codeblock.flatMap((id) => getLessonMissions(id) ?? [])
  return (
    <main className="mx-auto grid max-w-[1240px] grid-cols-[220px_minmax(0,1fr)] gap-6 px-8 py-6">
      <aside className="flex flex-col gap-1.5">
        <div className="mb-1 text-[13px] font-black text-[#6d6893]">ステップ</div>
        {READY.map((s) => (
          <button
            key={s.step}
            onClick={() => setStepNo(s.step)}
            className={`rounded-[14px] px-3 py-2 text-left text-[14px] font-bold ${s.step === stepNo ? 'bg-white text-[#7448f0] shadow-[inset_0_0_0_2px_#c9b8ff]' : 'text-[#2a2452] hover:bg-white'}`}
          >
            <span className="mr-1.5 text-[12px] text-[#8a85ad]">{s.step}</span>
            {s.title}
          </button>
        ))}
      </aside>

      <section className="flex flex-col gap-5">
        <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(42,36,82,.06)]">
          <div className="text-[13px] font-black text-[#7448f0]">ステップ{step.step}</div>
          <h1 className="text-[28px] font-black">{step.title}</h1>
          {step.learn.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {step.learn.map((l) => (
                <li key={l} className="text-[15px] font-bold text-[#2a2452]">
                  ✔ {l}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(42,36,82,.06)]">
          <h2 className="mb-3 text-[18px] font-black">生徒に聞かれたら（声かけ）</h2>
          <div className="grid grid-cols-2 gap-2">
            {TALK.map(([k, v]) => (
              <div key={k} className="rounded-[14px] bg-[#f8f6ff] px-4 py-2.5">
                <div className="text-[13px] font-black text-[#7448f0]">{k}</div>
                <div className="text-[14px] font-bold leading-relaxed">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(42,36,82,.06)]">
          <h2 className="mb-3 text-[18px] font-black">よくあるつまずき</h2>
          <div className="flex flex-col gap-2">
            {commonMistakes(step).map((m) => (
              <div key={m.title} className="rounded-[14px] bg-[#fff7e0] px-4 py-2.5">
                <div className="text-[14px] font-black text-[#8a5a00]">{m.title}</div>
                <div className="text-[14px] font-bold leading-relaxed text-[#6b4a00]">{m.fix}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(42,36,82,.06)]">
          <h2 className="mb-3 text-[18px] font-black">見出しと こたえ（動画で打つコード）</h2>
          <div className="flex flex-col gap-3">
            {step.sections.map((s, i) => (
              <div key={i} className="rounded-[16px] bg-[#f8f6ff] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[15px] font-black">{s.title}</span>
                  {s.challenge && <span className="rounded-full bg-[#ff8a1f] px-2 py-0.5 text-[11px] font-black text-white">チャレンジ</span>}
                  {s.expectError && <span className="rounded-full bg-[#ef5a5a] px-2 py-0.5 text-[11px] font-black text-white">エラーが出ればOK</span>}
                </div>
                <pre className="whitespace-pre-wrap rounded-[12px] bg-[#23203b] px-4 py-3 font-mono text-[15px] leading-[1.7] text-[#dcdcf0]">
                  <NaviCode code={s.code} />
                </pre>
                <div className="mt-2 flex flex-col gap-1 text-[13px] font-bold text-[#6d6893]">
                  {s.expected.length > 0 && <div>出る結果：{s.expected.join(' / ')}</div>}
                  {s.inputs && s.inputs.length > 0 && <div>input に入れる答え（動画）：{s.inputs.join('、')}</div>}
                  {s.note && <div>生徒への説明：{s.note}</div>}
                  {s.answerNote && <div>ひとこと：{s.answerNote}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {missions.length > 0 && (
          <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(42,36,82,.06)]">
            <h2 className="mb-3 text-[18px] font-black">仕上げ5問の こたえ</h2>
            <div className="flex flex-col gap-3">
              {missions.map((m, i) => (
                <div key={i} className="rounded-[16px] bg-[#f8f6ff] p-4">
                  <div className="text-[15px] font-black">
                    {i + 1}. {m.title}
                    <span className="ml-2 text-[12px] font-bold text-[#8a85ad]">{m.type === 'quiz' ? 'クイズ' : 'ブロック'}</span>
                  </div>
                  <div className="mt-1 text-[14px] font-bold text-[#6d6893]">{m.description}</div>
                  {m.type === 'quiz' ? (
                    <>
                      {m.codeToRead && (
                        <pre className="mt-2 whitespace-pre-wrap rounded-[12px] bg-[#23203b] px-4 py-3 font-mono text-[14px] text-[#dcdcf0]">
                          <NaviCode code={m.codeToRead} />
                        </pre>
                      )}
                      <div className="mt-2 text-[14px] font-black text-[#16905a]">こたえ：{m.choices?.[m.correctAnswer ?? 0]}</div>
                    </>
                  ) : (
                    <>
                      <pre className="mt-2 whitespace-pre-wrap rounded-[12px] bg-[#23203b] px-4 py-3 font-mono text-[14px] text-[#dcdcf0]">
                        <NaviCode code={m.correctCode ?? ''} />
                      </pre>
                      <div className="mt-2 text-[14px] font-black text-[#16905a]">出る結果：{m.expectedOutput}</div>
                    </>
                  )}
                  {m.explanation && <div className="mt-1 text-[13px] font-bold text-[#1f4f7a]">💡 {m.explanation}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function Questions() {
  const [logs, setLogs] = useState<QLog[] | null>(null)
  useEffect(() => {
    let alive = true
    ;(async () => {
      const users = await getAllUsers()
      const all: QLog[] = []
      await Promise.all(
        users.map(async (u) => {
          const snap = await getDocs(query(collection(db, 'users', u.uid, 'naviQuestions'), orderBy('createdAt', 'desc'), limit(30))).catch(() => null)
          snap?.forEach((d) => {
            const x = d.data()
            all.push({
              uid: u.uid,
              name: u.userId || u.displayName || '名前未設定',
              step: Number(x.step ?? 0),
              section: Number(x.section ?? -1),
              question: String(x.question ?? ''),
              answer: String(x.answer ?? ''),
              error: String(x.error ?? ''),
              at: (x.createdAt as Timestamp | undefined)?.toDate?.() ?? null,
            })
          })
        }),
      )
      all.sort((a, b) => (b.at?.getTime() ?? 0) - (a.at?.getTime() ?? 0))
      if (alive) setLogs(all.slice(0, 200))
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <main className="mx-auto max-w-[1100px] px-8 py-6">
      <p className="mb-4 text-[14px] font-bold text-[#6d6893]">
        生徒が「いちかに質問」で聞いたことと、いちかの答えです（新しい順・1人につき30件まで）。答えがおかしいときや、多い質問は、Discord で共有して、動画やアプリの改善に使います。
      </p>
      {logs === null ? (
        <div className="font-bold text-[#6d6893]">読みこみ中…</div>
      ) : logs.length === 0 ? (
        <div className="rounded-[20px] bg-white p-6 font-bold text-[#6d6893]">まだ質問はありません。</div>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((l, i) => {
            const st = NAVI_STEPS.find((s) => s.step === l.step)
            const sec = st && l.section >= 0 ? st.sections[l.section] : undefined
            return (
              <div key={i} className="rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(42,36,82,.05)]">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[13px] font-bold text-[#6d6893]">
                  <span className="rounded-full bg-[#efe9ff] px-2.5 py-0.5 font-black text-[#7448f0]">{l.name}</span>
                  <span>
                    ステップ{l.step}
                    {st ? `「${st.title}」` : ''}
                    {sec ? ` ・ ${sec.title}` : ''}
                  </span>
                  <span className="flex-1" />
                  <span>{l.at ? l.at.toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                </div>
                <div className="text-[15px] font-black">Q. {l.question}</div>
                {l.error && <div className="mt-1 text-[13px] font-bold text-[#c93c3c]">そのときのエラー：{l.error}</div>}
                <div className="mt-2 rounded-[14px] bg-[#f8f6ff] px-4 py-2.5 text-[14px] font-bold leading-relaxed">いちか：{l.answer}</div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
