'use client'

// Python ナビの画面はログインした生徒だけが使う。ログインしていなければログインの画面へ送り、終わったらここへ戻す
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function NaviAuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
  }, [loading, user, router, pathname])

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center text-sm font-bold text-[#6d6893]">{loading ? '読みこみ中…' : 'ログインの画面へ移動しています…'}</div>
  }
  return <>{children}</>
}
