'use client'

// YouTube の動画（IFrame Player API）。再生位置を親に知らせ、親から止める・飛ばすができる
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

type YTPlayer = {
  getCurrentTime: () => number
  getPlayerState: () => number
  pauseVideo: () => void
  playVideo: () => void
  seekTo: (sec: number, allowSeekAhead: boolean) => void
  destroy: () => void
}

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer; PlayerState: { PLAYING: number; ENDED: number } }
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<void> | null = null
function loadApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  })
  return apiPromise
}

export type PlayerHandle = {
  pause: () => void
  play: () => void
  seek: (sec: number) => void
  time: () => number
}

type Props = {
  videoId: string
  startAt: number
  onTime: (sec: number, playing: boolean) => void
  onEnded: () => void
}

export const YouTubePlayer = forwardRef<PlayerHandle, Props>(function YouTubePlayer({ videoId, startAt, onTime, onEnded }, ref) {
  const host = useRef<HTMLDivElement>(null)
  const player = useRef<YTPlayer | null>(null)
  const cb = useRef({ onTime, onEnded })
  useEffect(() => {
    cb.current = { onTime, onEnded }
  }, [onTime, onEnded])

  useImperativeHandle(ref, () => ({
    pause: () => player.current?.pauseVideo(),
    play: () => player.current?.playVideo(),
    seek: (sec) => player.current?.seekTo(sec, true),
    time: () => player.current?.getCurrentTime() ?? 0,
  }))

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined
    let alive = true
    const box = host.current
    loadApi().then(() => {
      if (!alive || !box || !window.YT) return
      const el = document.createElement('div')
      box.appendChild(el)
      player.current = new window.YT.Player(el, {
        videoId,
        width: '100%',
        height: '100%',
        host: 'https://www.youtube-nocookie.com',
        playerVars: { start: Math.floor(startAt), rel: 0, modestbranding: 1, playsinline: 1, cc_lang_pref: 'ja' },
        events: {
          onStateChange: (e: { data: number }) => {
            if (e.data === window.YT?.PlayerState.ENDED) cb.current.onEnded()
          },
        },
      })
      timer = setInterval(() => {
        const p = player.current
        if (!p?.getCurrentTime) return
        cb.current.onTime(p.getCurrentTime(), p.getPlayerState?.() === window.YT?.PlayerState.PLAYING)
      }, 500)
    })
    return () => {
      alive = false
      if (timer) clearInterval(timer)
      player.current?.destroy?.()
      player.current = null
      if (box) box.innerHTML = ''
    }
    // 動画を切りかえたときだけ作り直す（startAt は最初の1回だけ使う）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  return <div ref={host} className="aspect-video w-full bg-[#15122a] [&_iframe]:h-full [&_iframe]:w-full" />
})
