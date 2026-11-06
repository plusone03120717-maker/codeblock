'use client'

// ホームのいちか（LivLiv Player で動かす 2D のいちか。2026-11-06 依頼主の指示）
//   - 絵は今のいちかを部品に分けたもの（public/navi/ichika.livliv。作り方は F:\plus One new\images\ichika\livliv\README.md）
//   - 首の向き・黒目（マウスの方を見る）・まばたき・呼吸・髪のゆれ・表情はプレイヤーが動かす
//   - 口は声（useNaviVoice の stream）から：大きさで開き方、母音で「お」「い」の形。話すときは頭も少し動く
//   - WebGL2 が使えない・読みこめない・「動きを減らす」の設定のときは、今までの絵（fallback）のまま
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Player } from '@livliv/player'
import type { LipSync } from '@livliv/player/voice'

const MODEL = '/navi/ichika.livliv'

// mood：いちかの表情（null＝ふつう）。ids は smile・shy・sad・puffed・surprised・x_thinking・x_troubled・x_wink
export function IchikaLive({ stream, mood = null, fallback }: { stream: MediaStream | null; mood?: string | null; fallback: ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [player, setPlayer] = useState<Player | null>(null)

  // プレイヤーを作って、いちかを読みこむ
  useEffect(() => {
    const el = canvas.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!document.createElement('canvas').getContext('webgl2')) return
    let p: Player | null = null
    let gone = false
    ;(async () => {
      try {
        const { Player } = await import('@livliv/player')
        if (gone) return
        p = new Player(el, { lang: 'ja', maxPixelRatio: 2 })
        await p.load(MODEL)
        p.view.zoom = 0.98 // 今までの絵と同じ大きさに
        if (!gone) setPlayer(p)
      } catch {
        // 読みこめないときは今までの絵のまま
      }
    })()
    return () => {
      gone = true
      p?.dispose()
      setPlayer(null)
    }
  }, [])

  // 声に合わせて口と頭を動かす
  useEffect(() => {
    if (!player || !stream) return
    let sync: LipSync | null = null
    let gone = false
    import('@livliv/player/voice')
      .then(({ startLipSync }) => startLipSync(player, stream))
      .then((s) => {
        if (gone) s.stop()
        else sync = s
      })
      .catch(() => {})
    return () => {
      gone = true
      sync?.stop()
    }
  }, [player, stream])

  useEffect(() => {
    player?.setExpression(mood)
  }, [player, mood])

  return (
    <>
      <div className={`transition-opacity duration-300 ${player ? 'opacity-0' : 'opacity-100'}`}>{fallback}</div>
      <canvas
        ref={canvas}
        aria-label="いちか"
        className={`pointer-events-none absolute left-1/2 top-10 h-[520px] w-[520px] max-w-none -translate-x-1/2 transition-opacity duration-300 ${player ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  )
}
