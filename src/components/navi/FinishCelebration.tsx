'use client'

// 仕上げ5問をクリアしたときの画面（Python ナビの生徒）。2026-10-26 依頼主「ウェブデザイナー賞をもらえるくらいのクリア画面に」
// いちかのコマ送り（Gemini で描いた4コマ：ため → ジャンプ → ピース → メダル）と、Motion Prompt の動きを組み合わせる。
//   #001 ポップイン・#002 スタガー・#003 バースト・#005 マスクリビール・#007 カウントアップ・#015 パーティクル（紙ふぶき）
//   #022 ライトスイープ・#080 ハイライター・#096 フローティング
// 動きは時間（t 秒）だけで決まる。「動きを減らす」の設定のときは、さいごの形をはじめから見せる（紙ふぶきなし）。
// 絵の作り方：F:\plus One new\images\ichika\clear\make_frames.py
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useBreathing } from '@/components/navi/useBreathing'
import { useNaviVoice } from '@/components/navi/useNaviVoice'

type Props = {
  step: number
  missionCount: number
  xp: number
  isReview: boolean
  totalXP: number
  level: { level: number; name: string }
  levelProgress: number // 0〜1
  leveledUp: boolean
  cheer: string
  nextTitle: string | null // 「ステップ8「台形の面積アプリ」」など
  nextLabel: string
  onNext: () => void
}

// ---- Motion Prompt kit と同じ式 ----
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
const eOut3 = (x: number) => 1 - (1 - x) ** 3
const eOut5 = (x: number) => 1 - (1 - x) ** 5
const eIO3 = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2)
const spring = (t: number, w: number, d: number) => (t <= 0 ? 0 : 1 - Math.exp(-d * t) * Math.cos(w * t))
const backOut = (x: number, s = 1.70158) => 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2
const popIn = (t: number) => ({ s: Math.max(0, spring(t, 15, 6.5)), r: (1 - spring(t, 11, 6)) * -0.35 }) // #001

// ---- 時間割（秒） ----
const T = {
  line: 0.1, // #005 線がのびる
  ichika: 0.35, // いちかが出る（ため）
  crouch: 0.95, // ためてしゃがむ
  jump: 1.2, // ジャンプ
  land: 1.75, // 着地（ピース）・紙ふぶき・バースト
  medal: 0.8, // メダルが出る
  stars: 1.0, // 星が1つずつつく（5つ）
  burst: 1.75,
  sweep: 2.2, // #022 光が横切る（4.7秒ごと）
  xp: 2.1, // #007 カウントアップ
  hold: 3.4, // いちかがメダルを見せる
  next: 2.9,
  buttons: 3.3,
  end: 6.5, // ここまでは毎フレーム、あとは止める（ゆれ・光はつづける）
}

function useTime(reduce: boolean) {
  const [t, setT] = useState(reduce ? 99 : 0)
  useEffect(() => {
    if (reduce) return
    // 手元で見た目を確かめるとき：?t=2.4 のように秒を決めて止める（本番では使わない）
    const fixed = process.env.NODE_ENV !== 'production' ? new URLSearchParams(location.search).get('t') : null
    if (fixed !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setT(Number(fixed))
      return
    }
    let raf = 0
    const t0 = performance.now()
    const loop = (now: number) => {
      const s = (now - t0) / 1000
      setT(s)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduce])
  return t
}

// 画面に入る大きさ（1280×860 を 1 として、大きい画面でも 1.2 倍まで）
function useFit() {
  const [k, setK] = useState(1)
  useEffect(() => {
    const f = () => setK(Math.min(1.2, innerWidth / 1280, innerHeight / 860))
    f()
    addEventListener('resize', f)
    return () => removeEventListener('resize', f)
  }, [])
  return k
}

// #015 パーティクル：画面の左下と右下から、紙ふぶきが2回ふき上がる（数・速さ・重力は画面の大きさに合わせて 2.2 倍）
function Confetti({ start, reduce }: { start: number; reduce: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c || reduce) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const K = 2.2
    const COLORS = ['#2b7fd9', '#ff6b53', '#ffc93c', '#3dcda0', '#7448f0']
    let seed = 7
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    type Pt = { x0: number; y0: number; vx: number; vy: number; born: number; life: number; size: number; shape: number; col: string; spin: number; rot: number }
    const parts: Pt[] = []
    const fit = () => {
      c.width = innerWidth * devicePixelRatio
      c.height = innerHeight * devicePixelRatio
    }
    fit()
    addEventListener('resize', fit)
    for (const [burst, at] of [[0, start], [1, start + 0.7]] as const) {
      for (const side of [0, 1]) {
        for (let i = 0; i < 60; i++) {
          const dir = side === 0 ? 1 : -1
          parts.push({
            x0: side === 0 ? 0.08 : 0.92,
            y0: 1.02,
            vx: dir * (60 + rnd() * 190) * K * 0.9,
            vy: -(250 + rnd() * 150) * K * (burst ? 0.85 : 1),
            born: at + rnd() * 0.25,
            life: 1.5 * K * 0.8,
            size: (5 + rnd() * 6) * 1.6,
            shape: Math.floor(rnd() * 3),
            col: COLORS[Math.floor(rnd() * COLORS.length)],
            spin: (rnd() * 2 - 1) * 4.5,
            rot: rnd() * 6.28,
          })
        }
      }
    }
    let raf = 0
    const t0 = performance.now()
    const draw = (now: number) => {
      const t = (now - t0) / 1000
      const W = c.width / devicePixelRatio
      const H = c.height / devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      ctx.clearRect(0, 0, W, H)
      let alive = false
      for (const p of parts) {
        const a = t - p.born
        if (a < 0) {
          alive = true
          continue
        }
        if (a > p.life) continue
        alive = true
        const g = 470 * K * 0.75
        const x = p.x0 * W + p.vx * a
        const y = p.y0 * H + p.vy * a + 0.5 * g * a * a
        const q = a / p.life
        const op = Math.min(1, a / 0.06) * (q > 0.7 ? (1 - q) / 0.3 : 1)
        const sc = 1.15 - 0.45 * q
        ctx.save()
        ctx.globalAlpha = op
        ctx.translate(x, y)
        ctx.rotate(p.rot + p.spin * a)
        ctx.scale(sc, sc)
        ctx.fillStyle = p.col
        const s = p.size
        ctx.beginPath()
        if (p.shape === 0) ctx.arc(0, 0, s / 2, 0, 7)
        else if (p.shape === 1) ctx.rect(-s / 2, -s / 3, s, (s * 2) / 3)
        else {
          ctx.moveTo(0, -s / 2)
          ctx.lineTo(s / 2, s / 2)
          ctx.lineTo(-s / 2, s / 2)
        }
        ctx.fill()
        ctx.restore()
      }
      if (alive) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', fit)
    }
  }, [start, reduce])
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-30 h-full w-full" aria-hidden />
}

// #003 バースト：輪・線・点が外へはじける（大きさ k 倍）
function Burst({ t, k = 1, cx, cy }: { t: number; k?: number; cx: number; cy: number }) {
  if (t < 0 || t > 0.9) return null
  const ring = eOut5(P(t, 0, 0.6))
  const lines = Array.from({ length: 10 }, (_, i) => i)
  return (
    <svg className="pointer-events-none absolute overflow-visible" style={{ left: cx, top: cy, width: 1, height: 1 }} aria-hidden>
      <circle r={(44 + 46 * ring) * k} fill="none" stroke="#ffc93c" strokeWidth={16 * (1 - ring) * k} />
      {lines.map((i) => {
        const a = (i / 10) * Math.PI * 2
        const outer = (64 + 66 * eOut5(P(t, 0, 0.6))) * k
        const len = 36 * (1 - P(t, 0.22, 0.7)) * k
        return (
          <line
            key={i}
            x1={Math.cos(a) * (outer - len)}
            y1={Math.sin(a) * (outer - len) * 0.82}
            x2={Math.cos(a) * outer}
            y2={Math.sin(a) * outer * 0.82}
            stroke={i % 2 ? '#3dcda0' : '#ffc93c'}
            strokeWidth={9 * k}
            strokeLinecap="round"
          />
        )
      })}
      {lines.map((i) => {
        const a = (i / 10) * Math.PI * 2 + 0.31
        const r = (58 + 92 * eOut5(P(t, 0, 0.72))) * k
        const op = 1 - P(t, 0.3, 0.72)
        return <circle key={`d${i}`} cx={Math.cos(a) * r * 1.45} cy={Math.sin(a) * r * 0.78} r={(8 - 3.2 * P(t, 0, 0.72)) * k} fill={i % 2 ? '#2b7fd9' : '#ff6b53'} opacity={op} />
      })}
    </svg>
  )
}

// いちかのまわりの「＋」（plus One の +1）。位置はステージの中心から（px）
const PLUSES = [
  { x: -250, y: -190, size: 40, color: '#ffc93c', rot: -12, amp: 7, period: 2.4, phase: 0 },
  { x: 235, y: -230, size: 30, color: '#4f7cff', rot: 14, amp: 6, period: 1.6, phase: 1.2 },
  { x: 270, y: 10, size: 46, color: '#3dcda0', rot: 8, amp: 8, period: 2.4, phase: 2.4 },
  { x: -285, y: 60, size: 28, color: '#ff6b53', rot: -20, amp: 6, period: 1.6, phase: 0.6 },
  { x: 205, y: 200, size: 26, color: '#ffc93c', rot: 24, amp: 5, period: 2.4, phase: 3.6 },
  { x: -215, y: 230, size: 34, color: '#7448f0', rot: 10, amp: 6, period: 1.6, phase: 2.0 },
]

function Star({ on, size }: { on: number; size: number }) {
  // on: 0〜1（ついていく）
  return (
    <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ transform: `scale(${0.6 + 0.4 * on})` }} aria-hidden>
      <path
        d="M0-11 3.2-3.5 11.2-3.4 4.9 1.6 7 9.5 0 5 -7 9.5 -4.9 1.6 -11.2-3.4 -3.2-3.5Z"
        fill={on > 0.05 ? '#ffc93c' : '#e6e1fa'}
        stroke={on > 0.05 ? '#e09b00' : '#d4cdf3'}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FinishCelebration(p: Props) {
  const [reduce] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const t = useTime(reduce)
  const tt = Math.min(t, T.end) // 一度きりの動きは、ここで止める
  const fit = useFit()
  const voice = useNaviVoice()
  const rig = useRef<HTMLDivElement>(null)
  useBreathing(rig, voice.speaking, t > T.hold)

  // いちかがひとこと（声オンのとき）。着地したあとに話す
  const spoke = useRef(false)
  useEffect(() => {
    if (spoke.current || !voice.ready || voice.off) return
    if (t > T.land + 0.3) {
      spoke.current = true
      voice.speak(p.cheer)
    }
  }, [t, voice, p.cheer])

  // ---- いちかのコマ ----
  const frame = tt < T.jump ? 'c1_ready' : tt < T.land ? 'c2_jump' : tt < T.hold ? 'c3_peace' : 'c4_medal'
  // 体が大きいので、#001 のはね返りは 1/10 にして、下から少しせり上がる
  const enterP = popIn(tt - T.ichika)
  const enter = { s: 0.9 + 0.1 * enterP.s, r: enterP.r * 0.3, y: 50 * (1 - eOut5(P(tt, T.ichika, T.ichika + 0.5))), o: clamp((tt - T.ichika) / 0.15) }
  // ため：しゃがむ（たてにつぶれる）→ ジャンプで上へ（放物線）→ 着地でつぶれてもどる
  const crouch = P(tt, T.crouch, T.jump)
  const airT = tt - T.jump
  const air = airT > 0 && tt < T.land ? (1 - ((airT / (T.land - T.jump)) * 2 - 1) ** 2) * 40 : 0
  const landS = tt >= T.land ? 1 - 0.07 * Math.exp(-7 * (tt - T.land)) * Math.cos(15 * (tt - T.land)) : 1
  const sy = (tt < T.jump ? 1 - 0.07 * eIO3(crouch) : 1) * landS
  const sx = 2 - sy
  const float = t > T.hold ? -8 * Math.sin((2 * Math.PI * (t - T.hold)) / 2.4) : 0 // #096

  // ---- 見出し #005 ----
  const line = eIO3(P(tt, T.line, T.line + 0.4))
  const topY = 120 * (1 - eOut5(P(tt, T.line + 0.25, T.line + 0.9)))
  const botY = -60 * (1 - eOut5(P(tt, T.line + 0.45, T.line + 1.05)))

  // ---- メダル ----
  const medal = popIn(tt - T.medal)
  const medalFloat = t > T.burst + 0.6 ? -6 * Math.sin((2 * Math.PI * (t - T.burst)) / 1.6 + 1.2) : 0
  // #003 の「ため」：0.2秒で 0.88 倍にちぢんで、はじけるときにばねでもどる
  const medalSq =
    tt < T.burst - 0.2 ? 1 : tt < T.burst ? 1 - 0.12 * eIO3(P(tt, T.burst - 0.2, T.burst)) : 0.88 + 0.12 * spring(tt - T.burst, 16, 6.5)
  const sweepT = t > T.sweep ? (t - T.sweep) % 4.7 : -1
  const sweepX = sweepT >= 0.45 && sweepT <= 1.5 ? -130 + 660 * eIO3(P(sweepT, 0.45, 1.5)) : -999
  const MEDAL_W = 210

  // ---- XP #007 ----
  const xpP = P(tt, T.xp + 0.45, T.xp + 2.9 - 1.2) // 少し速めに（1.25秒で数え終わる）
  const xpVal = Math.round(p.xp * (1 - (1 - xpP) ** 4))
  const landed = xpP >= 1
  const xpLand = landed ? tt - (T.xp + 1.7) : 0
  const xpScale = landed ? 1 + 0.07 * Math.exp(-7 * xpLand) * Math.cos(15 * xpLand) : 1
  const xpCard = backOut(P(tt, T.xp, T.xp + 0.5), 2.6)

  const rise = (start: number, i: number) => {
    const s = backOut(P(tt, start + 0.15 + 0.12 * i, start + 0.65 + 0.12 * i), 2.6) // #002
    return { opacity: clamp(s * 1.4), transform: `translateY(${(1 - s) * 26}px)` }
  }
  const hi = eOut3(P(tt, T.next + 0.5, T.next + 1.3)) // #080

  const stars = Array.from({ length: p.missionCount > 0 ? Math.min(p.missionCount, 5) : 5 }, (_, i) => i)

  return (
    <div className="relative h-screen overflow-hidden bg-[#eaf6fd] text-[#2a2452]">
      {/* 背景：空の色・ゆっくり回る光の帯・いちかのうしろのスポットライト */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_40%,#ffffff_0%,#e3f3fc_45%,#cfe9f9_100%)]" />
      <div
        className="absolute left-[70%] top-[50%] h-[1700px] w-[1700px] -translate-x-1/2 -translate-y-1/2 opacity-90"
        style={{
          background: 'repeating-conic-gradient(from 0deg, rgba(124,196,245,.30) 0deg 7deg, transparent 7deg 22deg)',
          transform: `translate(-50%,-50%) rotate(${t * 4}deg) scale(${0.6 + 0.4 * eOut3(P(tt, 0.2, 1.4))})`,
          maskImage: 'radial-gradient(circle, black 18%, transparent 62%)',
          WebkitMaskImage: 'radial-gradient(circle, black 18%, transparent 62%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(transparent,rgba(255,255,255,.85))]" />

      <Confetti start={T.land} reduce={reduce} />

      {/* 1280×860 で組んで、画面の大きさに合わせて全体をちぢめる（小さいノートPCでも、いちかが切れないように） */}
      <div
        className="absolute left-1/2 top-1/2 z-10 grid h-[860px] w-[1280px] grid-cols-[1.08fr_1fr] items-center gap-6 px-12 py-10"
        style={{ transform: `translate(-50%,-50%) scale(${fit})` }}
      >
        {/* 左：見出し・メダル・XP・つぎ・ボタン */}
        <div className="flex flex-col gap-7">
          <div style={rise(0, 0)}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-[14px] font-black text-[#7448f0] shadow-[0_6px_20px_rgba(116,72,240,.12)]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#ffd23f] text-[12px] text-[#7a5600]">+</span>
              Python ナビ ・ ステップ{p.step}の仕上げ
            </span>
          </div>

          {/* #005 線の向こうから、上の行はせり上がり、下の行はおりてくる */}
          <h1 className="relative select-none leading-none" aria-label={`ステップ${p.step} クリア！`}>
            <span className="block pb-2 [clip-path:inset(-80px_-80px_0_-80px)]">
              <span className="block text-[86px] font-black tracking-tight text-[#2a2452]" style={{ transform: `translateY(${topY}px)` }}>
                ステップ<span className="text-[#7448f0]">{p.step}</span>
              </span>
            </span>
            <span className="block h-[7px] rounded-full bg-[linear-gradient(90deg,#ff8a1f,#ffd23f)]" style={{ width: `${line * 360}px` }} />
            <span className="block pt-2 [clip-path:inset(0_-80px_-80px_-80px)]">
              <span
                className="block bg-[linear-gradient(100deg,#ff8a1f_10%,#ff5f6d_55%,#ffb21f_95%)] bg-clip-text text-[112px] font-black tracking-tight text-transparent [filter:drop-shadow(0_6px_0_rgba(219,101,0,.18))]"
                style={{ transform: `translateY(${botY}px)` }}
              >
                クリア！
              </span>
            </span>
          </h1>

          {/* メダルと星（5問） */}
          <div className="flex items-center gap-8">
            <div className="relative" style={{ width: MEDAL_W, height: MEDAL_W * 1.37 }}>
              <div
                className="absolute inset-0"
                style={{ transform: `translateY(${medalFloat}px) scale(${medal.s * medalSq}) rotate(${medal.r}rad)`, transformOrigin: '50% 64%' }}
              >
                <Image src="/navi/clear/medal.webp" alt="金メダル" width={520} height={713} priority unoptimized className="h-full w-full object-contain drop-shadow-[0_14px_18px_rgba(160,110,0,.28)]" />
                {/* #022 ライトスイープ（メダルの丸の中だけ） */}
                <div className="absolute overflow-hidden rounded-full" style={{ left: MEDAL_W * 0.035, top: MEDAL_W * 1.37 * 0.645 - MEDAL_W * 0.477, width: MEDAL_W * 0.954, height: MEDAL_W * 0.954 }}>
                  <div
                    className="absolute -top-1/4 h-[150%] w-[56px]"
                    style={{
                      left: (sweepX / 400) * MEDAL_W * 0.954,
                      transform: 'rotate(24deg)',
                      background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent)',
                    }}
                  />
                </div>
              </div>
              <Burst t={tt - T.burst} k={1.3} cx={MEDAL_W / 2} cy={MEDAL_W * 1.37 * 0.645} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1.5">
                {stars.map((i) => {
                  const on = spring(tt - (T.stars + 0.15 * i), 17, 7)
                  return <Star key={i} on={clamp(on, 0, 1.3)} size={46} />
                })}
              </div>
              <div className="text-[19px] font-black">
                仕上げ <span className="text-[#22b573]">{p.missionCount}問</span> ぜんぶクリア
              </div>
              {/* #007 XP がかけあがる */}
              <div
                className="flex w-[300px] flex-col gap-2 rounded-[22px] bg-white px-5 py-4 shadow-[0_14px_34px_rgba(42,36,82,.10)]"
                style={{ opacity: clamp(xpCard * 1.5), transform: `translateY(${(1 - xpCard) * 20}px)` }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-black tracking-widest text-[#6d6893]">{p.isReview ? 'ふくしゅう XP' : 'もらった XP'}</span>
                  <span
                    className={`text-[40px] font-black tabular-nums ${landed ? 'text-[#ff8a1f]' : 'text-[#2a2452]'}`}
                    style={{ transform: `scale(${xpScale})`, transformOrigin: 'right center' }}
                  >
                    +{xpVal}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#efeafd]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#4f7cff,#3dcda0)]"
                    style={{ width: `${Math.max(4, p.levelProgress * 100 * eOut3(P(tt, T.xp + 0.45, T.xp + 1.7)))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[13px] font-bold text-[#6d6893]">
                  <span>
                    Lv.{p.level.level} {p.level.name}
                  </span>
                  <span className="tabular-nums">ぜんぶで {p.totalXP} XP</span>
                </div>
                {p.leveledUp && (
                  <div
                    className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[linear-gradient(90deg,#ffd23f,#ff8a1f)] px-3 py-1 text-[13px] font-black text-white"
                    style={{ transform: `scale(${Math.max(0, spring(tt - (T.xp + 1.8), 15, 6.5))})`, transformOrigin: 'left center' }}
                  >
                    🎊 レベルアップ！
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* つぎ（#080 ハイライター） */}
          {p.nextTitle && (
            <div className="text-[19px] font-black" style={rise(T.next, 0)}>
              つぎは{' '}
              <span className="relative inline-block">
                <span
                  className="absolute bottom-[2px] left-0 -z-0 h-[12px] rounded-sm bg-[#FFE36B]"
                  style={{ width: `${hi * 100}%` }}
                />
                <span className="relative">{p.nextTitle}</span>
              </span>
              <span> だよ！</span>
            </div>
          )}

          <div className="flex items-center gap-3" style={rise(T.buttons, 0)}>
            <button
              onClick={p.onNext}
              className="h-[62px] whitespace-nowrap rounded-full bg-[#ff8a1f] px-9 text-[19px] font-black text-white shadow-[0_6px_0_#db6500,0_16px_30px_rgba(255,138,31,.35)] transition-transform hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-[0_1px_0_#db6500]"
            >
              {p.nextLabel}
            </button>
            <Link
              href="/navi"
              className="h-[62px] whitespace-nowrap rounded-full bg-white px-7 text-[16px] font-black leading-[62px] text-[#7448f0] shadow-[inset_0_0_0_2px_#efe9ff,0_5px_0_#e6e1fa]"
            >
              Python ナビにもどる
            </Link>
          </div>
        </div>

        {/* 右：いちか（コマ送り）とふきだし */}
        <div className="relative flex h-[760px] items-end justify-center">
          {/* いちかのうしろの光の丸（ステージ）と、ゆっくり回る点線の輪 */}
          <div
            className="absolute left-1/2 top-[50%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,#ffffff_0%,#ffffff_48%,#d3ecfb_72%,rgba(211,236,251,0)_100%)] shadow-[inset_0_0_0_10px_rgba(255,255,255,.6)]"
            style={{ transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * eOut3(P(tt, 0.2, 1.2))})` }}
          />
          <div
            className="absolute left-1/2 top-[50%] h-[560px] w-[560px] rounded-full border-[3px] border-dashed border-[#7448f0]/30"
            style={{ transform: `translate(-50%,-50%) rotate(${t * 6}deg) scale(${eOut3(P(tt, 0.4, 1.4))})` }}
          />
          {/* +1 の「＋」がまわりにうかぶ（着地のあと #001 で出て、#096 でゆれる） */}
          {PLUSES.map((q, i) => {
            const s = Math.max(0, spring(tt - (T.land + 0.1 + 0.08 * i), 15, 6.5))
            const y = -q.amp * Math.sin((2 * Math.PI * t) / q.period + q.phase)
            return (
              <svg
                key={i}
                className="absolute z-10"
                style={{ left: `calc(50% + ${q.x}px)`, top: `calc(50% + ${q.y}px)`, width: q.size * 1.35, height: q.size * 1.35, transform: `translate(-50%,-50%) translateY(${y}px) rotate(${q.rot}deg) scale(${s})` }}
                viewBox="-12 -12 24 24"
                aria-hidden
              >
                <path d="M-3.5-11h7v7.5h7.5v7h-7.5v7.5h-7v-7.5h-7.5v-7h7.5z" fill={q.color} stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
              </svg>
            )
          })}
          {/* 着地の #003 バースト（いちかのうしろ） */}
          <Burst t={tt - T.land} k={1.8} cx={320} cy={420} />
          {/* 足もとの丸いステージと影 */}
          <div className="absolute bottom-[24px] h-[60px] w-[380px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(42,36,82,.18),transparent)]" style={{ transform: `scaleX(${1 - air / 220})`, opacity: 1 - air / 160 }} />
          <div
            className="absolute bottom-[24px] left-1/2 w-[720px]"
            style={{
              transform: `translateX(-50%) translateY(${enter.y - air + float}px) rotate(${enter.r}rad) scale(${enter.s * sx}, ${enter.s * sy})`,
              transformOrigin: '50% 98%',
              opacity: enter.o,
            }}
          >
            <div ref={rig} className="origin-[50%_95%]">
              {(['c1_ready', 'c2_jump', 'c3_peace', 'c4_medal'] as const).map((f) => (
                <Image
                  key={f}
                  src={`/navi/clear/${f}.webp`}
                  alt={f === frame ? 'いちか' : ''}
                  width={760}
                  height={760}
                  priority
                  unoptimized
                  className={`absolute inset-x-0 bottom-0 w-full ${f === frame ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              <div className="aspect-square w-full" />
            </div>
          </div>
          {/* ふきだし（#001）：いちかの顔の左。しっぽは顔のほうへ */}
          <div
            className="absolute left-[-120px] top-[118px] z-20 w-[290px] rounded-[26px] bg-white px-6 py-5 text-[16.5px] font-bold leading-[1.8] shadow-[0_18px_40px_rgba(42,36,82,.14)]"
            style={{
              transform: `scale(${Math.max(0, spring(tt - (T.land + 0.25), 15, 6.5))})`,
              transformOrigin: '100% 40%',
            }}
          >
            {p.cheer}
            <span className="absolute -right-2.5 top-[46px] h-6 w-6 rotate-45 rounded-[4px] bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
