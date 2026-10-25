'use client'

// ナビの声：/api/tts（ElevenLabs）で読み上げ、声の大きさで口を動かす。
// ・同じ文の声はブラウザにとっておき、2回目からはお金をかけずに鳴らす
// ・声の設定がない・ログインが切れたなど、鳴らせないときは何もしない（画面は文字だけで動く）
// ・ブラウザが自動で鳴らすのを止めたときは blocked を true にして、ボタンで鳴らしてもらう
import { useCallback, useEffect, useRef, useState } from 'react'
import { auth } from '@/lib/firebase'

const CACHE_NAME = 'navi-voice-v1'
const OFF_KEY = 'codeblock_navi_voice_off'

async function cacheRequest(text: string): Promise<Request> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  const hex = Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('')
  return new Request(`${location.origin}/__navi-voice/${hex}`)
}

// 声（mp3）を取ってくる。鳴らせないときは null
async function fetchVoice(text: string): Promise<Blob | null> {
  let cache: Cache | null = null
  let req: Request | null = null
  try {
    cache = await caches.open(CACHE_NAME)
    req = await cacheRequest(text)
    const hit = await cache.match(req)
    if (hit) return await hit.blob()
  } catch {
    // とっておけないブラウザ（プライベートウィンドウなど）は、毎回取りに行く
  }
  const token = await auth.currentUser?.getIdToken().catch(() => undefined)
  if (!token) return null
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  }).catch(() => null)
  if (!res?.ok) return null
  const blob = await res.blob()
  if (cache && req) cache.put(req, new Response(blob, { headers: { 'Content-Type': 'audio/mpeg' } })).catch(() => {})
  return blob
}

export function useNaviVoice() {
  const [off, setOff] = useState(false)
  // 「声オフ」を読みおわったか（読む前に話しはじめないように）
  const [ready, setReady] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)
  const ctx = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const url = useRef<string | null>(null)
  const raf = useRef(0)
  const flap = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const seq = useRef(0)
  const lastText = useRef('')
  // 話しおわったら（止めた・鳴らせなかったときも）知らせる。speak() が返す Promise をここで解く
  const finish = useRef<(() => void) | null>(null)
  const settle = useCallback(() => {
    const f = finish.current
    finish.current = null
    f?.()
  }, [])

  useEffect(() => {
    // 「声オフ」はその PC のブラウザにだけ覚えておく
    try {
      setOff(localStorage.getItem(OFF_KEY) === '1')
    } catch {}
    setReady(true)
    return () => {
      // 番号を進めて、取りに行っている途中の声を鳴らさないようにする
      // eslint-disable-next-line react-hooks/exhaustive-deps
      seq.current++
      cancelAnimationFrame(raf.current)
      clearInterval(flap.current)
      audio.current?.pause()
      if (url.current) URL.revokeObjectURL(url.current)
      ctx.current?.close().catch(() => {})
    }
  }, [])

  const stop = useCallback(() => {
    seq.current++
    audio.current?.pause()
    cancelAnimationFrame(raf.current)
    clearInterval(flap.current)
    setSpeaking(false)
    setMouthOpen(false)
    settle()
  }, [settle])

  // 口の動き：声の大きさが分かるときはそれで、分からないときは一定の間隔で開け閉めする
  // パクパクしすぎないように、声の大きさをならし、開く・閉じるの境目をずらし、
  // 一度切り替えたら少しのあいだ（約0.12秒）同じ形のままにする
  const startMouth = useCallback(() => {
    const a = analyser.current
    if (a) {
      const buf = new Uint8Array(a.fftSize)
      let open = false
      let level = 0
      let last = performance.now()
      let lastSwitch = 0
      const tick = (now = performance.now()) => {
        const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
        last = now
        a.getByteTimeDomainData(buf)
        let sum = 0
        for (const v of buf) sum += (v - 128) * (v - 128)
        const rms = Math.sqrt(sum / buf.length)
        level += (rms - level) * (1 - Math.exp(-dt / 0.04))
        const next = open ? level > 6 : level > 9
        if (next !== open && now - lastSwitch > 120) {
          open = next
          lastSwitch = now
          setMouthOpen(next)
        }
        raf.current = requestAnimationFrame(tick)
      }
      tick()
    } else {
      flap.current = setInterval(() => setMouthOpen((o) => !o), 220)
    }
  }, [])

  // 話す。返す Promise は、話しおわったとき（止めた・鳴らせなかったときも）に解ける
  const speak = useCallback(
    async (text: string): Promise<void> => {
      lastText.current = text
      stop()
      const done = new Promise<void>((res) => {
        finish.current = res
      })
      const my = ++seq.current
      const blob = await fetchVoice(text)
      if (my !== seq.current) return
      if (!blob) {
        setUnavailable(true)
        settle()
        return
      }
      if (!audio.current) audio.current = new Audio()
      const el = audio.current
      if (url.current) URL.revokeObjectURL(url.current)
      url.current = URL.createObjectURL(blob)
      el.src = url.current

      // 声の大きさを見るしかけは、ブラウザが音を出してよいとき（AudioContext が動くとき）だけつなぐ。
      // 止まったままつなぐと音が出なくなるため
      if (!analyser.current) {
        try {
          const c = ctx.current ?? new AudioContext()
          ctx.current = c
          if (c.state !== 'running') await c.resume().catch(() => {})
          if (c.state === 'running') {
            const an = c.createAnalyser()
            an.fftSize = 512
            c.createMediaElementSource(el).connect(an)
            an.connect(c.destination)
            analyser.current = an
          }
        } catch {}
      }
      if (my !== seq.current) return

      el.onended = () => {
        if (my !== seq.current) return
        cancelAnimationFrame(raf.current)
        clearInterval(flap.current)
        setSpeaking(false)
        setMouthOpen(false)
        settle()
      }
      try {
        await el.play()
      } catch {
        // 自動で鳴らすのをブラウザが止めた（まだ画面を一度もクリックしていない）
        if (my === seq.current) setBlocked(true)
        settle()
        return
      }
      if (my !== seq.current) return
      setBlocked(false)
      setSpeaking(true)
      startMouth()
      return done
    },
    [stop, startMouth, settle],
  )

  // 声オフにしたら止める
  const toggleOff = useCallback(() => {
    const now = !off
    setOff(now)
    try {
      localStorage.setItem(OFF_KEY, now ? '1' : '0')
    } catch {}
    if (now) stop()
  }, [off, stop])

  const replay = useCallback(() => {
    if (lastText.current) speak(lastText.current)
  }, [speak])

  return { ready, off, speaking, mouthOpen, blocked, unavailable, speak, stop, replay, toggleOff }
}
