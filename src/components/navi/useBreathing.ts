'use client'

// いちかの「呼吸」と「ゆらぎ」（計算アプリのアバター F:\計算自動生成アプリ\keisan-app\components\avatar.tsx と同じ動き）
//   - 呼吸：約3.6秒でゆっくり上下し、少しだけ縦にふくらむ
//   - ゆらぎ：ゆっくり左右にかたむく（±0.5度）
//   - 話しているあいだ：小さくうなずく（話す強さは、上がるのに約0.25秒・下がるのに約0.9秒かけて、カクカクしない）
// 時間（dt）基準なので、画面の速さに左右されない。「動きを減らす」の設定のときは動かさない。
// mode 'chest'：全身の絵の上半身だけに使う（腰を軸に胸がふくらむ。上下には動かさない。軸は呼ぶ側の transform-origin）。
//   全身ごと上下すると浮いて見えるため（2026-10-26 依頼主）
import { useEffect, useRef, type RefObject } from 'react'

// ready：絵が画面に出てから動かしはじめる（読みこみ中は絵がないので）
export function useBreathing(ref: RefObject<HTMLElement | null>, speaking: boolean, ready = true, mode: 'whole' | 'chest' = 'whole') {
  const speakingRef = useRef(speaking)
  useEffect(() => {
    speakingRef.current = speaking
  }, [speaking])

  useEffect(() => {
    const el = ref.current
    if (!ready || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let last = performance.now()
    let env = 0 // 話している強さ
    let nod = 0 // うなずきの位相
    const springs = { bob: { x: 0, v: 0 }, tilt: { x: 0, v: 0 } }
    // ばね（目標に向かって、行き過ぎずになめらかに近づく）
    const step = (sp: { x: number; v: number }, target: number, dt: number, omega: number, zeta: number) => {
      const n = Math.max(1, Math.ceil(dt / 0.004))
      const h = dt / n
      for (let i = 0; i < n; i++) {
        const a = omega * omega * (target - sp.x) - 2 * zeta * omega * sp.v
        sp.v += a * h
        sp.x += sp.v * h
      }
      return sp.x
    }
    const ease = (from: number, to: number, dt: number, tau: number) => from + (to - from) * (1 - Math.exp(-dt / tau))
    const loop = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
      last = now
      const t = now / 1000
      const target = speakingRef.current ? 0.8 : 0
      env = ease(env, target, dt, target > env ? 0.25 : 0.9)
      nod += dt * Math.PI * 2 * (1.25 + env * 0.35)
      const breath = (Math.sin((t * (Math.PI * 2)) / 3.6) + 1) / 2
      const bob = step(springs.bob, env * (0.35 + 0.25 * Math.sin(nod)), dt, 7.5, 0.85)
      const tilt = step(springs.tilt, Math.sin(t * 0.55) * 0.5 + env * 0.55 * Math.sin(nod * 0.5 + 0.8), dt, 5.5, 0.8)
      if (mode === 'chest') {
        el.style.transform =
          `rotate(${(tilt * 0.6).toFixed(4)}deg) ` +
          `scale(${(1 + breath * 0.006).toFixed(5)}, ${(1 + breath * 0.014 + bob * 0.006).toFixed(5)})`
        raf = requestAnimationFrame(loop)
        return
      }
      el.style.transform =
        `translateY(${(-breath * 0.35 - bob * 0.55).toFixed(4)}%) ` +
        `rotate(${tilt.toFixed(4)}deg) ` +
        `scale(${(1 + breath * 0.004).toFixed(5)}, ${(1 + breath * 0.009 + bob * 0.003).toFixed(5)})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ref, ready, mode])
}
