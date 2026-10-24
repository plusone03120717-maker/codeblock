import type { Metadata } from 'next'
import { Zen_Maru_Gothic } from 'next/font/google'
import { NaviAuthGate } from '@/components/navi/NaviAuthGate'

const maru = Zen_Maru_Gothic({ weight: ['500', '700', '900'], subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Python ナビ',
  robots: { index: false, follow: false },
}

export default function NaviLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${maru.className} min-h-screen bg-[#f5f3ff] text-[#2a2452]`}>
      <NaviAuthGate>{children}</NaviAuthGate>
    </div>
  )
}
