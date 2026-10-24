'use client'

// 「今日はおわる」を押したときのポップアップ：今日できたこと・ここまで進んだこと・つぎに来たら

type Props = {
  learned: string[]
  progressLines: string[]
  nextText: string
  xp: number
  onBack: () => void
  onEnd: () => void
}

export function EndPopup({ learned, progressLines, nextText, xp, onBack, onEnd }: Props) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(42,36,82,.55)]">
      <div className="flex w-[520px] flex-col items-center gap-3 rounded-[28px] bg-white px-8 pb-6 pt-7 text-center shadow-[0_30px_80px_rgba(20,10,60,.35)]">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[#e3f3fc] text-3xl">🏁</div>
        <div className="text-[26px] font-black">おつかれさま！ 今日やったこと</div>
        <div className="text-[14.5px] font-bold text-[#6d6893]">ここまでのことは、ぜんぶ保存したよ。とちゅうでも大丈夫</div>
        <div className="w-full rounded-[18px] border-2 border-[#ffe08a] bg-[#fffbea] px-[18px] py-3 text-left">
          <div className="text-[13px] font-black tracking-wider text-[#11845a]">
            今日できたこと <small className="ml-1 text-xs text-[#6d6893]">+{xp} XP</small>
          </div>
          {learned.length > 0 ? (
            learned.map((l) => (
              <div key={l} className="text-[15.5px] font-black">
                ✔ {l}
              </div>
            ))
          ) : (
            <div className="text-[14.5px] font-bold text-[#6d6893]">動画を見て、コードを打ったよ</div>
          )}
        </div>
        <div className="w-full rounded-[18px] bg-[#e2f7ec] px-[18px] py-3.5 text-left">
          <div className="text-[13px] font-bold tracking-wider text-[#6d6893]">ここまで進んだよ</div>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {progressLines.map((l) => (
              <li key={l} className="flex items-center gap-2.5 text-[15px] font-bold">
                <i className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[#22b573] text-xs not-italic text-white">✔</i>
                {l}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full rounded-2xl border-2 border-[#ffe08a] bg-[#fffbea] px-4 py-3 text-left text-[14.5px] font-bold leading-relaxed">
          <span className="mr-2 rounded-full bg-[#ffd23f] px-2.5 py-0.5 text-xs font-black text-[#5c4200]">つぎに来たら</span>
          {nextText}
        </div>
        <div className="flex w-full gap-2.5">
          <button onClick={onBack} className="h-[54px] flex-1 rounded-full bg-white font-black text-[#7448f0] shadow-[inset_0_0_0_2px_#efe9ff,0_4px_0_#e6e1fa]">
            もどってつづける
          </button>
          <button onClick={onEnd} className="h-[54px] flex-[1.4] rounded-full bg-[#ff8a1f] text-[17px] font-black text-white shadow-[0_5px_0_#db6500]">
            おわる（ホームへ）
          </button>
        </div>
        <div className="text-[12.5px] font-bold text-[#6d6893]">このあと日誌に「今日できたこと」を書こう</div>
      </div>
    </div>
  )
}
