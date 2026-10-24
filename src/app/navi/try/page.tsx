import type { Metadata } from 'next'
import { TryClient } from './TryClient'

export const metadata: Metadata = {
  title: 'Python ナビ（試し）',
  robots: { index: false, follow: false },
}

export default function NaviTryPage() {
  return <TryClient />
}
