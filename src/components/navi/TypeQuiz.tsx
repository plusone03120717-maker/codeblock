'use client'

// データ型のミニテスト（ステップ9のあと、ホームで1回3問・2026-11-06 依頼主）。
// 3問を答えおわったら記録して、ちがう日に3回つづけて全問正解で卒業
import { useMemo, useRef, useState } from 'react'
import { NaviCode } from '@/components/navi/NaviCode'
import { typeQuizSet } from '@/data/navi/typeQuiz'
import { TYPE_QUIZ_STREAK, recordTypeQuiz } from '@/lib/navi/progress'
import { REVIEW_RIGHT_SPEECH, REVIEW_WRONG_SPEECH, TYPE_QUIZ_ALL_RIGHT_SPEECH, TYPE_QUIZ_MASTERED_SPEECH, TYPE_QUIZ_RETRY_SPEECH } from '@/lib/navi/speech'

// 回ごとに決まったならべかえ（正解がいつも上にならないように）
function order(n: number, seed: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i)
  let x = seed * 9301 + 49297
  for (let i = n - 1; i > 0; i--) {
    x = (x * 9301 + 49297) % 233280
    const j = Math.floor((x / 233280) * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}

type Props = {
  count: number // これまでに答えた回数
  streak: number // つづけて全問正解した回数
  speak: ((text: string) => Promise<void>) | null // 声オフのときは null
  speaking: boolean
  onDone: () => void
}

export function TypeQuiz({ count, streak, speak, speaking, onDone }: Props) {
  const qs = useMemo(() => typeQuizSet(count).map((q, k) => ({ ...q, order: order(q.choices.length, count * 3 + k) })), [count])
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [right, setRight] = useState(0)
  const [result, setResult] = useState<{ allRight: boolean; mastered: boolean } | null>(null)
  const [leaving, setLeaving] = useState(false)
  const talk = useRef<Promise<void> | null>(null)
  const q = qs[i]

  const say = (text: string) => {
    talk.current = speak ? speak(text) : null
  }

  const next = () => {
    if (i < qs.length - 1) {
      setI(i + 1)
      setPicked(null)
      return
    }
    const allRight = right === qs.length
    const mastered = recordTypeQuiz(allRight)
    setResult({ allRight, mastered })
    say(mastered ? TYPE_QUIZ_MASTERED_SPEECH : allRight ? TYPE_QUIZ_ALL_RIGHT_SPEECH : TYPE_QUIZ_RETRY_SPEECH)
  }

  const finish = async () => {
    // いちかが話しているあいだは、話しおわってから進む（長くても10秒まで）
    setLeaving(true)
    if (talk.current) await Promise.race([talk.current, new Promise((r) => setTimeout(r, 10000))])
    onDone()
  }

  const left = TYPE_QUIZ_STREAK - (result ? (result.allRight ? streak + 1 : 0) : streak)

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(42,36,82,.55)]">
      <div className="w-[560px] rounded-[28px] bg-white px-8 py-7 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-black tracking-widest text-[#8a6400]">データ型のミニテスト（3問）</span>
          {!result && <span className="text-[13px] font-black text-[#6d6893]">{i + 1} / {qs.length}</span>}
        </div>

        {result ? (
          <div className="mt-3">
            <div className="text-[22px] font-black">
              {result.mastered ? '🎓 データ型、卒業！' : result.allRight ? '🎉 3問とも せいかい！' : `${right}問 せいかい`}
            </div>
            <p className="mt-2 text-[15px] font-bold leading-relaxed text-[#4a4570]">
              {result.mastered
                ? `${TYPE_QUIZ_STREAK}回つづけて全問せいかい。データ型のミニテストは、もう出ないよ。`
                : result.allRight
                  ? `あと ${left}回 つづけて全問せいかいで、データ型は卒業だよ。`
                  : `まちがえた問題は、説明を読んでおこうね。${TYPE_QUIZ_STREAK}回つづけて全問せいかいで卒業だよ。`}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                disabled={leaving}
                onClick={finish}
                className="h-12 rounded-full bg-[#ff8a1f] px-6 font-black text-white shadow-[0_5px_0_#db6500] disabled:opacity-70"
              >
                {leaving && speaking ? 'いちかの話をきいてね…' : 'つづきへ ▶'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-2 text-[20px] font-black">{q.question}</div>
            {q.code && (
              <pre className="mt-3 whitespace-pre-wrap rounded-[18px] bg-[#23203b] px-5 py-4 font-mono text-[17px] leading-[1.8] text-[#dcdcf0]">
                <NaviCode code={q.code} />
              </pre>
            )}
            <div className="mt-4 flex flex-col gap-2">
              {q.order.map((c) => {
                const done = picked !== null
                const ok = c === 0
                const cls = !done
                  ? 'bg-[#f7f6fc] hover:bg-[#efe9ff]'
                  : ok
                    ? 'bg-[#e2f7ec] text-[#0f7a51] shadow-[inset_0_0_0_2px_#22b573]'
                    : c === picked
                      ? 'bg-[#fde9e9] text-[#c93c3c]'
                      : 'bg-[#f7f6fc] text-[#9b97b8]'
                return (
                  <button
                    key={c}
                    disabled={done}
                    onClick={() => {
                      setPicked(c)
                      if (ok) setRight(right + 1)
                      say(ok ? REVIEW_RIGHT_SPEECH : REVIEW_WRONG_SPEECH)
                    }}
                    className={`rounded-2xl px-4 py-3 text-left font-mono text-[16px] font-bold ${cls}`}
                  >
                    {done && ok ? '✔ ' : ''}
                    {q.choices[c]}
                  </button>
                )
              })}
            </div>
            {picked !== null && (
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-[15px] font-bold leading-relaxed">
                  <b>{picked === 0 ? 'せいかい！' : 'おしい！'}</b> {q.explain}
                </span>
                <button onClick={next} className="h-12 flex-none rounded-full bg-[#ff8a1f] px-6 font-black text-white shadow-[0_5px_0_#db6500]">
                  {i < qs.length - 1 ? 'つぎへ ▶' : '結果を見る ▶'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
