"use client";

// 苦手（Python ナビ）：生徒ごとの苦手と声かけの例、みんながつまずいているところ。
// もとにするのは、動画の巻きもどし・エディターのまちがいとエラー・ヒント・CodeBlock のまちがい・いちかへの質問
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserProfile } from "@/types/user";
import { getNaviStep } from "@/data/navi/steps";
import { getMission } from "@/data/missions";
import { naviLessonLabel } from "@/data/navi/finish31";
import { ERROR_TALK } from "@/lib/navi/friendlyError";
import { loadWeak, sectionScore, STRUGGLE, type SectionWeak, type WeakData } from "@/lib/navi/teacherData";
import { Empty } from "./ClassroomTab";

type SecRow = { step: number; section: number; w: SectionWeak; questions: number; score: number };

const nameOf = (u: UserProfile) => u.displayName || u.userId || u.email || "名前未設定";

const secTitle = (step: number, section: number) => getNaviStep(step)?.sections[section]?.title ?? `見出し${section + 1}`;

function sectionRows(d: WeakData): SecRow[] {
  const q = new Map<string, number>();
  d.questions.forEach((x) => x.section !== null && q.set(`${x.step}-${x.section}`, (q.get(`${x.step}-${x.section}`) ?? 0) + 1));
  const rows: SecRow[] = [];
  d.steps.forEach((s) =>
    Object.entries(s.sections).forEach(([i, w]) => {
      const questions = q.get(`${s.step}-${i}`) ?? 0;
      rows.push({ step: s.step, section: Number(i), w, questions, score: sectionScore(w, questions) });
    }),
  );
  return rows.sort((a, b) => b.score - a.score);
}

function errorTotals(list: WeakData[]): [string, number][] {
  const m = new Map<string, number>();
  list.forEach((d) => d.steps.forEach((s) => Object.entries(s.errors).forEach(([k, n]) => m.set(k, (m.get(k) ?? 0) + n))));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function missionRows(list: WeakData[]): { lessonId: string; mission: number; wrong: number; people: number }[] {
  const m = new Map<string, { lessonId: string; mission: number; wrong: number; people: number }>();
  list.forEach((d) =>
    d.missions.forEach((l) =>
      Object.entries(l.missions).forEach(([id, n]) => {
        const key = `${l.lessonId}#${id}`;
        const cur = m.get(key) ?? { lessonId: l.lessonId, mission: Number(id), wrong: 0, people: 0 };
        cur.wrong += n;
        cur.people += 1;
        m.set(key, cur);
      }),
    ),
  );
  return [...m.values()].sort((a, b) => b.people - a.people || b.wrong - a.wrong);
}

// 見出しのつまずき方から、声かけの例を選ぶ
function sectionTalk(r: SecRow): string {
  if ((r.w.revealed ?? 0) > 0) return "「こたえの例を、いっしょにもう一度打ってみよう。どこがちがった？」";
  if ((r.w.rewinds ?? 0) >= Math.max(r.w.fails ?? 0, 1)) return "「動画のどこがわかりにくかった？ その場面をいっしょに見よう」";
  if (r.questions > 0) return "「いちかに聞いたこと、わかった？ 自分のことばで説明してみて」";
  return "「💡 ヒントのコードと、1文字ずつくらべてみよう」";
}

function Chips({ r }: { r: SecRow }) {
  const items: [string, number | undefined, string][] = [
    ["まちがい", r.w.fails, "bg-[#fdecec] text-[#c23b3b]"],
    ["巻きもどし", r.w.rewinds, "bg-[#e3ecff] text-[#2f5fd8]"],
    ["ヒント", r.w.hints, "bg-[#fff6d1] text-[#8a6400]"],
    ["こたえを見た", r.w.revealed, "bg-[#fff1e3] text-[#a24b00]"],
    ["質問", r.questions, "bg-[#efe9ff] text-[#7448f0]"],
  ];
  return (
    <div className="flex flex-wrap gap-1.5 text-[12px] font-bold">
      {items
        .filter(([, n]) => (n ?? 0) > 0)
        .map(([label, n, cls]) => (
          <span key={label} className={`rounded-full px-2.5 py-0.5 ${cls}`}>
            {label} {n}
          </span>
        ))}
    </div>
  );
}

const card = "rounded-[22px] bg-white px-6 py-5 shadow-sm";
const h2 = "mb-3 text-[16px] font-black";

export function WeakTab({ users }: { users: UserProfile[] }) {
  const [data, setData] = useState<Record<string, WeakData>>({});
  const [loading, setLoading] = useState(true);
  const [pick, setPick] = useState<string | "all">("all");

  // 生徒の顔ぶれが変わったときだけ読みなおす（親の画面が描きなおされるたびに読まないように）
  const uids = users.map((u) => u.uid).join(",");
  const load = useCallback(async () => {
    setLoading(true);
    const ids = uids ? uids.split(",") : [];
    const entries = await Promise.all(ids.map(async (uid) => [uid, await loadWeak(uid)] as const));
    setData(Object.fromEntries(entries));
    setLoading(false);
  }, [uids]);

  useEffect(() => {
    // 開いたときに1回読む（Firestore から）
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const totals = useMemo(() => {
    const map = new Map<string, number>();
    users.forEach((u) => map.set(u.uid, data[u.uid] ? sectionRows(data[u.uid]).filter((r) => r.score >= STRUGGLE).length : 0));
    return map;
  }, [users, data]);

  if (users.length === 0) return <Empty text="Python ナビの生徒がまだいません。「コース切りかえ」で生徒を新しいコースにすると、ここに出ます。" />;

  const all = Object.values(data);
  const picked = pick === "all" ? null : users.find((u) => u.uid === pick) ?? null;

  return (
    <>
      <div className="flex items-center gap-3.5">
        <h1 className="text-[23px] font-black">苦手</h1>
        <span className="rounded-full bg-[#efe9ff] px-3 py-0.5 text-[13px] font-bold text-[#7448f0]">Python ナビ・動画／エディター／CodeBlock／質問から</span>
        <button onClick={load} disabled={loading} className="ml-auto rounded-full px-4 py-1.5 text-sm font-bold text-[#7448f0] shadow-[inset_0_0_0_2px_#e6e1fa] disabled:opacity-50">
          {loading ? "読みこみ中…" : "↻ 読みなおす"}
        </button>
      </div>

      <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-4">
        <aside className="flex flex-col gap-1.5">
          <button
            onClick={() => setPick("all")}
            className={`rounded-[14px] px-3.5 py-2.5 text-left text-[14px] font-black ${pick === "all" ? "bg-[#efe9ff] text-[#7448f0]" : "bg-white text-[#2a2452] shadow-sm"}`}
          >
            👥 みんな
          </button>
          {users.map((u) => (
            <button
              key={u.uid}
              onClick={() => setPick(u.uid)}
              className={`flex items-center gap-2 rounded-[14px] px-3.5 py-2.5 text-left text-[14px] font-bold ${pick === u.uid ? "bg-[#efe9ff] text-[#7448f0]" : "bg-white text-[#2a2452] shadow-sm"}`}
            >
              <span className="truncate">{nameOf(u)}</span>
              {(totals.get(u.uid) ?? 0) > 0 && (
                <span className="ml-auto whitespace-nowrap rounded-full bg-[#fdecec] px-2 text-[11.5px] text-[#c23b3b]">{totals.get(u.uid)}か所</span>
              )}
            </button>
          ))}
        </aside>

        {loading ? (
          <div className="py-16 text-center text-sm font-bold text-[#6d6893]">読みこみ中…</div>
        ) : picked ? (
          <Student d={data[picked.uid]} name={nameOf(picked)} />
        ) : (
          <Everyone list={all} users={users} data={data} />
        )}
      </div>
    </>
  );
}

function Student({ d, name }: { d: WeakData | undefined; name: string }) {
  if (!d || (d.steps.length === 0 && d.missions.length === 0 && d.questions.length === 0))
    return <Empty text={`${name} さんの記録はまだありません。Python ナビで学習すると、ここにたまります。`} />;
  const rows = sectionRows(d).filter((r) => r.score > 0).slice(0, 8);
  const errors = errorTotals([d]).slice(0, 5);
  const missions = missionRows([d]).slice(0, 6);
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <section className={card}>
        <h2 className={h2}>つまずいた見出し（{name} さん）</h2>
        {rows.length === 0 ? (
          <p className="text-sm font-bold text-[#6d6893]">いまのところ、つまずいた見出しはありません。</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((r) => (
              <li key={`${r.step}-${r.section}`} className="flex flex-col gap-1.5 border-t border-[#f0eef7] pt-3 first:border-0 first:pt-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-black text-[#7448f0]">ステップ{r.step}</span>
                  <span className="text-[15px] font-black">「{secTitle(r.step, r.section)}」</span>
                  {r.score >= STRUGGLE && <span className="ml-auto rounded-full bg-[#ff5d5d] px-2.5 py-0.5 text-[11.5px] font-black text-white">苦手</span>}
                </div>
                <Chips r={r} />
                <div className="text-[13px] font-bold leading-relaxed text-[#4a4470]">声かけ：{sectionTalk(r)}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid grid-cols-2 gap-4">
        <ErrorList errors={errors} />
        <MissionList missions={missions} showPeople={false} />
      </div>

      {d.questions.length > 0 && (
        <section className={card}>
          <h2 className={h2}>いちかへの質問（新しい順）</h2>
          <ul className="flex flex-col gap-2">
            {d.questions.slice(0, 8).map((q, i) => (
              <li key={i} className="text-[14px] font-bold leading-relaxed">
                <span className="mr-2 text-[12px] text-[#7448f0]">
                  ステップ{q.step}
                  {q.section !== null ? `「${secTitle(q.step, q.section)}」` : ""}
                </span>
                {q.question}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Everyone({ list, users, data }: { list: WeakData[]; users: UserProfile[]; data: Record<string, WeakData> }) {
  // 見出しごとに、つまずいた人数と、だれか
  const bySec = new Map<string, { step: number; section: number; people: string[]; score: number }>();
  users.forEach((u) => {
    const d = data[u.uid];
    if (!d) return;
    sectionRows(d)
      .filter((r) => r.score >= STRUGGLE)
      .forEach((r) => {
        const key = `${r.step}-${r.section}`;
        const cur = bySec.get(key) ?? { step: r.step, section: r.section, people: [], score: 0 };
        cur.people.push(nameOf(u));
        cur.score += r.score;
        bySec.set(key, cur);
      });
  });
  const secs = [...bySec.values()].sort((a, b) => b.people.length - a.people.length || b.score - a.score).slice(0, 10);
  const errors = errorTotals(list).slice(0, 6);
  const missions = missionRows(list).slice(0, 8);
  if (secs.length === 0 && errors.length === 0 && missions.length === 0)
    return <Empty text="まだ記録がありません。生徒が Python ナビで学習すると、ここにたまります。" />;
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <section className={card}>
        <h2 className={h2}>みんながつまずいているところ</h2>
        {secs.length === 0 ? (
          <p className="text-sm font-bold text-[#6d6893]">いまのところ、つまずいた見出しはありません。</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {secs.map((s) => (
              <li key={`${s.step}-${s.section}`} className="flex items-center gap-3 border-t border-[#f0eef7] pt-2.5 first:border-0 first:pt-0">
                <span className="w-[72px] flex-none text-[12.5px] font-black text-[#7448f0]">ステップ{s.step}</span>
                <span className="min-w-0 flex-1 text-[15px] font-black">「{secTitle(s.step, s.section)}」</span>
                <span className="truncate text-[12.5px] font-bold text-[#6d6893]">{s.people.join("・")}</span>
                <span className="whitespace-nowrap rounded-full bg-[#fdecec] px-2.5 py-0.5 text-[12.5px] font-black text-[#c23b3b]">{s.people.length}人</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <div className="grid grid-cols-2 gap-4">
        <ErrorList errors={errors} />
        <MissionList missions={missions} showPeople />
      </div>
    </div>
  );
}

function ErrorList({ errors }: { errors: [string, number][] }) {
  return (
    <section className={card}>
      <h2 className={h2}>よく出るエラーと声かけ</h2>
      {errors.length === 0 ? (
        <p className="text-sm font-bold text-[#6d6893]">エラーの記録はまだありません。</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {errors.map(([k, n]) => (
            <li key={k} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 text-[14px] font-black">
                {ERROR_TALK[k]?.label ?? k}
                <span className="ml-auto text-[12.5px] text-[#c23b3b]">{n}回</span>
              </div>
              <div className="text-[12.5px] font-bold leading-relaxed text-[#4a4470]">{ERROR_TALK[k]?.talk ?? ERROR_TALK.other.talk}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MissionList({ missions, showPeople }: { missions: { lessonId: string; mission: number; wrong: number; people: number }[]; showPeople: boolean }) {
  return (
    <section className={card}>
      <h2 className={h2}>CodeBlock でまちがえた問題</h2>
      {missions.length === 0 ? (
        <p className="text-sm font-bold text-[#6d6893]">まちがいの記録はまだありません。</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {missions.map((m) => (
            <li key={`${m.lessonId}-${m.mission}`} className="flex items-center gap-2 text-[14px] font-bold">
              <span className="whitespace-nowrap text-[12.5px] font-black text-[#7448f0]">
                {naviLessonLabel(m.lessonId)} {m.mission}問目
              </span>
              <span className="min-w-0 flex-1 truncate">{getMission(m.lessonId, m.mission)?.title ?? ""}</span>
              <span className="whitespace-nowrap text-[12.5px] text-[#c23b3b]">
                {showPeople ? `${m.people}人・` : ""}
                {m.wrong}回
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
