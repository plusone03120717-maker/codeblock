"use client";

import { Mission } from "@/types";
import { F, FuriganaText } from "@/components/Furigana";
import { NaviCode } from "@/components/navi/NaviCode";

/**
 * 問題文・前提コード・期待される出力のまとまり。
 * レッスン／復習／デイリーチャレンジの3画面で同じ見た目にするための共通部品。
 */

/** 前提コードの見出しを中身から決める（関数定義なのに「変数の設定」と出ないように） */
export function prefixLabel(mission: Mission): string {
  if (mission.prefixLabel) return mission.prefixLabel;
  const code = mission.prefixCode || "";
  const hasDef = code.includes("def ");
  const hasAssign = /^[A-Za-z_]\w*\s*=/m.test(code);
  if (hasDef && hasAssign) return "あらかじめ用意されている関数とデータ（自動で入力されます）";
  if (hasDef) return "あらかじめ用意されている関数（自動で入力されます）";
  return "変数の設定（自動で入力されます）";
}

// navi：Python ナビから来た仕上げ5問（31-N）の見た目（ナビのエディターと同じ色）。今までのレッスンは false のまま
export function MissionInfo({ mission, navi = false }: { mission: Mission; navi?: boolean }) {
  const isQuiz = mission.type === "quiz";
  const expected = mission.expectedOutput || "";

  return (
    <div className="flex-1 min-w-0">
      <p className={navi ? "mb-2 pt-1 text-[19px] font-bold leading-relaxed text-[#2a2452]" : "text-sm md:text-base text-gray-700 mb-2 leading-relaxed"}>
        <FuriganaText text={mission.description} />
      </p>

      {/* ナビの見た目では「変数の設定」と「期待される出力」を横にならべて、カードを低くする */}
      <div className={navi && mission.prefixCode && !isQuiz && !mission.hideExpectedOutput ? "grid grid-cols-2 gap-3" : ""}>
      {mission.prefixCode && (
        <div className={navi ? "mt-3 rounded-[16px] bg-[#23203b] px-4 py-3" : "bg-gray-700 rounded-lg p-2 mt-3"}>
          <p className={navi ? "mb-1 text-[12px] font-bold text-[#8a85ad]" : "text-xs text-gray-400 mb-1"}>{prefixLabel(mission)}:</p>
          <pre className={navi ? "whitespace-pre-wrap break-words font-mono text-[15px] text-[#e5c07b]" : "text-yellow-400 font-mono text-sm whitespace-pre-wrap break-words"}>
            {mission.prefixCode}
          </pre>
        </div>
      )}

      {!isQuiz && !mission.hideExpectedOutput && (
        <div className={navi ? "mt-3 rounded-[16px] bg-[#120f24] px-4 py-3" : "bg-gray-800 rounded-lg p-2 mt-3"}>
          <p className={navi ? "mb-1 text-[12px] font-bold text-[#8a85ad]" : "text-xs text-gray-400 mb-1"}>
            <F reading="きたい">期待</F>される<F reading="しゅつりょく">出力</F>:
          </p>
          {expected.trim() === "" ? (
            // 関数を定義するだけの問題など、出力が無いことが正解のケース
            <p className="text-gray-400 font-mono text-sm">
              （この問題では画面には何も出力されません）
            </p>
          ) : (
            <pre className={navi ? "whitespace-pre-wrap break-words font-mono text-[16px] text-[#7ee2a8]" : "text-green-400 font-mono text-sm whitespace-pre-wrap break-words"}>
              {expected}
            </pre>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

/** 組み立てたPythonコードの表示（ブロックと実際のコードを結びつける） */
export function GeneratedCode({ code, navi = false }: { code: string; navi?: boolean }) {
  if (!code.trim()) return null;
  return (
    <div className="mb-4">
      <h3 className={navi ? "mb-2 text-[15px] font-black text-[#6d6893]" : "text-sm font-bold mb-2 text-gray-700"}>
        あなたが<F reading="く">組</F>み<F reading="た">立</F>てたPython<F reading="の">の</F>コード
      </h3>
      <pre className={navi ? "overflow-x-auto rounded-[20px] bg-[#23203b] p-5 font-mono text-[16px] leading-[1.8] text-[#dcdcf0]" : "bg-gray-900 text-green-400 font-mono text-sm rounded-2xl p-4 overflow-x-auto"}>
        {navi ? <NaviCode code={code} /> : code}
      </pre>
    </div>
  );
}

/** 行き詰まったときに見せる正解例 */
export function AnswerExample({ code, navi = false }: { code: string; navi?: boolean }) {
  if (!code) return null;
  return (
    <div className={navi ? "mt-3 rounded-[20px] bg-[#fff7e0] p-4 shadow-[inset_0_0_0_2px_#ffe08a]" : "mt-3 p-3 bg-amber-50 border-2 border-amber-300 rounded-xl"}>
      <p className={navi ? "mb-2 text-[15px] font-black text-[#8a5a00]" : "text-amber-800 text-sm font-bold mb-2"}>
        📖 <F reading="せいかい">正解</F>れい：<F reading="おな">同</F>じになるように<F reading="なら">並</F>べてみよう
      </p>
      <pre className={navi ? "overflow-x-auto rounded-[14px] bg-[#23203b] p-4 font-mono text-[16px] text-[#dcdcf0]" : "bg-gray-900 text-green-400 font-mono text-sm rounded-lg p-3 overflow-x-auto"}>
        {navi ? <NaviCode code={code} /> : code}
      </pre>
    </div>
  );
}
