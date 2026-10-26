"use client";

// いまの教室（Python ナビ）：授業中の生徒が、いま何をしているかを並べて見る。
// 並び：進めない → 止まっている → 順調。ヒントを3つ使っても進めない子には「進めてOK」を出す。
// 「止まっている」は、実行・入力・動画の再生が3分ない（2026-10-24 の決まり）
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/user";
import { getNaviStep } from "@/data/navi/steps";
import { naviLessonLabel } from "@/data/navi/finish31";
import { fmtTime } from "@/lib/navi/progress";
import { inStep } from "@/lib/navi/types";
import { CLASS_MS, IDLE_MS } from "@/lib/navi/teacherLog";
import { watchLive, type LiveRow } from "@/lib/navi/teacherData";

type Status = "stuck" | "idle" | "ok";

const STATUS: Record<Status, { label: string; badge: string; card: string; order: number }> = {
  stuck: { label: "進めない", badge: "bg-[#ff5d5d] text-white", card: "shadow-[inset_0_0_0_3px_#ff8a8a]", order: 0 },
  idle: { label: "止まっている", badge: "bg-[#ffd23f] text-[#5c4200]", card: "shadow-[inset_0_0_0_3px_#ffe27a]", order: 1 },
  ok: { label: "順調", badge: "bg-[#e2f7ec] text-[#11845a]", card: "", order: 2 },
};

const HINT_LABEL: Record<string, string> = { rewind: "10秒もどす", code: "動画のコード", diff: "ちがう行" };

export const statusOf = (r: LiveRow, now: number): Status => {
  const stuck = r.where === "codeblock" ? r.fails >= 3 : (r.where === "section" || r.where === "video") && (r.hints.length >= 3 || r.fails >= 5);
  if (stuck) return "stuck";
  if (!r.activeAt || now - r.activeAt.getTime() >= IDLE_MS) return "idle";
  return "ok";
};

const inClass = (r: LiveRow | null | undefined, now: number): r is LiveRow =>
  !!r && r.where !== "ended" && !!r.updatedAt && now - r.updatedAt.getTime() < CLASS_MS;

const nameOf = (u: UserProfile) => u.displayName || u.userId || u.email || "名前未設定";

function doingText(r: LiveRow): string {
  const step = getNaviStep(r.step);
  switch (r.where) {
    case "home":
      return "ホーム（いちかの案内を聞いている）";
    case "video": {
      if (!step) return "動画を見ている";
      const at = fmtTime(inStep(step, r.videoSec ?? 0));
      // まちがえたり、ヒントを使ったりしたあとは、その見出しを見なおしている
      const sec = r.section !== null && r.section !== undefined ? step.sections[r.section] : undefined;
      return sec && (r.fails > 0 || r.hints.length > 0) ? `「${sec.title}」の場面を見なおしている（動画の ${at}）` : `動画の ${at} あたりを見ている`;
    }
    case "section":
      return r.section !== null && r.section !== undefined && step?.sections[r.section]
        ? `「${step.sections[r.section].title}」のコードを打っている`
        : "動画と見出しはクリア。つぎへ進むところ";
    case "codeblock":
      return `${r.lessonId ? naviLessonLabel(r.lessonId) : "CodeBlock"} の ${r.mission ?? 1}問目`;
    default:
      return "今日はおわった";
  }
}

function talkFor(r: LiveRow, status: Status): string | null {
  if (status === "stuck")
    return r.where === "codeblock"
      ? "「こたえの例を見て、つぎの問題へ進んでOK。あとでいっしょにふくしゅうしよう」"
      : "「ここはあとで先生といっしょにやろう。『あとでやる』（チャレンジは『たしかめたよ』）で先へ進めてOK」";
  if (status === "idle") return "「いま、どこまでできた？ 画面を見せて」";
  return null;
}

const ago = (d: Date | null, now: number) => {
  if (!d) return "—";
  const m = Math.floor((now - d.getTime()) / 60000);
  if (m < 1) return "いま";
  if (m < 60) return `${m}分前`;
  if (m < 60 * 24) return `${Math.floor(m / 60)}時間前`;
  return `${Math.floor(m / 60 / 24)}日前`;
};

export function ClassroomTab({ users }: { users: UserProfile[] }) {
  const [live, setLive] = useState<Record<string, LiveRow | null>>({});
  const [now, setNow] = useState(() => Date.now());
  const uids = users.map((u) => u.uid).join(",");

  useEffect(() => {
    if (!uids) return;
    return watchLive(uids.split(","), (uid, row) => setLive((prev) => ({ ...prev, [uid]: row })));
  }, [uids]);

  // 「止まっている」「◯分前」を数えなおすため、15秒ごとに時計を進める
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  const here = users
    .filter((u) => inClass(live[u.uid], now))
    .map((u) => ({ u, r: live[u.uid] as LiveRow, s: statusOf(live[u.uid] as LiveRow, now) }))
    .sort((a, b) => STATUS[a.s].order - STATUS[b.s].order || (a.r.activeAt?.getTime() ?? 0) - (b.r.activeAt?.getTime() ?? 0));
  const away = users.filter((u) => !inClass(live[u.uid], now));
  const count = (s: Status) => here.filter((h) => h.s === s).length;

  return (
    <>
      <div className="flex items-center gap-3.5">
        <h1 className="text-[23px] font-black">いまの教室</h1>
        <span className="rounded-full bg-[#efe9ff] px-3 py-0.5 text-[13px] font-bold text-[#7448f0]">Python ナビ・自動で更新</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "授業中", value: here.length, color: "text-[#2a2452]" },
          { label: "進めない", value: count("stuck"), color: "text-[#e03c3c]" },
          { label: "止まっている（3分）", value: count("idle"), color: "text-[#b98a00]" },
          { label: "順調", value: count("ok"), color: "text-[#11845a]" },
        ].map((c) => (
          <div key={c.label} className="rounded-[18px] bg-white px-5 py-4 shadow-sm">
            <div className={`text-[30px] font-black leading-tight ${c.color}`}>{c.value}</div>
            <div className="text-[13px] font-bold text-[#6d6893]">{c.label}</div>
          </div>
        ))}
      </div>

      {users.length === 0 ? (
        <Empty text="Python ナビの生徒がまだいません。「コース切りかえ」で生徒を新しいコースにすると、ここに出ます。" />
      ) : here.length === 0 ? (
        <Empty text="いま授業中の生徒はいません。生徒が Python ナビを開くと、ここに出ます。" />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
          {here.map(({ u, r, s }) => {
            const step = getNaviStep(r.step);
            const talk = talkFor(r, s);
            return (
              <div key={u.uid} className={`flex flex-col gap-2 rounded-[20px] bg-white px-5 py-4 shadow-sm ${STATUS[s].card}`}>
                <div className="flex items-center gap-2">
                  <span className="truncate text-[17px] font-black">{nameOf(u)}</span>
                  <span className={`ml-auto whitespace-nowrap rounded-full px-3 py-0.5 text-[12.5px] font-black ${STATUS[s].badge}`}>{STATUS[s].label}</span>
                </div>
                <div className="text-[13px] font-bold text-[#7448f0]">
                  ステップ{r.step}　{step?.title ?? ""}
                </div>
                <div className="text-[15px] font-bold leading-snug">{doingText(r)}</div>
                {(r.fails > 0 || r.hints.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 text-[12px] font-bold">
                    {r.fails > 0 && <span className="rounded-full bg-[#fdecec] px-2.5 py-0.5 text-[#c23b3b]">まちがい {r.fails}回</span>}
                    {r.hints.map((h) => (
                      <span key={h} className="rounded-full bg-[#fff6d1] px-2.5 py-0.5 text-[#8a6400]">
                        ヒント：{HINT_LABEL[h] ?? h}
                      </span>
                    ))}
                  </div>
                )}
                {r.lastError && <div className="rounded-[12px] bg-[#fffbea] px-3 py-2 text-[13px] font-bold leading-relaxed text-[#5c4200]">⚠ {r.lastError}</div>}
                {s === "stuck" && (
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap rounded-full bg-[#22b573] px-3 py-1 text-[13px] font-black text-white">✔ 進めてOK</span>
                  </div>
                )}
                {talk && <div className="text-[13px] font-bold leading-relaxed text-[#4a4470]">声かけ：{talk}</div>}
                <div className="mt-auto text-right text-[12px] font-bold text-[#9893b5]">最後に動いた：{ago(r.activeAt, now)}</div>
              </div>
            );
          })}
        </div>
      )}

      {away.length > 0 && (
        <section className="rounded-[22px] bg-white px-5 py-4 shadow-sm">
          <div className="mb-2 text-[13px] font-black text-[#6d6893]">いまは来ていない・今日はおわった（{away.length}人）</div>
          <div className="flex flex-wrap gap-2">
            {away.map((u) => {
              const r = live[u.uid];
              return (
                <span key={u.uid} className="rounded-full bg-[#f7f6fc] px-3 py-1 text-[13px] font-bold text-[#6d6893]">
                  {nameOf(u)}
                  {r ? `（ステップ${r.step}・${ago(r.updatedAt, now)}）` : "（まだ記録なし）"}
                </span>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="rounded-[22px] bg-white px-8 py-10 text-center text-[15px] font-bold text-[#6d6893] shadow-sm">{text}</div>;
}
