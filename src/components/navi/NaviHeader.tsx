'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { isAdminEmail } from '@/utils/admin'

type Props = {
  step: number
  unit: number
  name?: string
  onEnd?: () => void
  active?: 'navi' | 'archive'
}

const tab = (on: boolean) => `whitespace-nowrap rounded-full px-4 py-2 ${on ? 'bg-[#efe9ff] text-[#7448f0]' : 'text-[#6d6893] hover:bg-[#f5f3ff]'}`

export function NaviHeader({ step, unit, name, onEnd, active = 'navi' }: Props) {
  const router = useRouter()
  // 先生用（こまったときカード・質問の記録）は、教室の管理者のアカウントのときだけ出す（答えがのっているので）
  const { user } = useAuth()
  const teacher = isAdminEmail(user?.email)
  return (
    <header className="flex h-[68px] items-center gap-7 border-b border-[#e6e1fa] bg-white px-8">
      <Link href="/navi" className="flex items-center gap-2.5 text-xl font-bold">
        <i className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#a259ff,#4f7cff)] text-[15px] not-italic text-white">▶</i>
        Python ナビ
      </Link>
      <nav className="flex gap-1.5 text-sm font-bold">
        <Link href="/navi" className={tab(active === 'navi')}>
          ホーム
        </Link>
        <Link href="/navi/archive" className={tab(active === 'archive')}>
          動画アーカイブ
        </Link>
        <Link href="/review" className={tab(false)}>
          ふくしゅう
        </Link>
        {teacher && (
          <Link href="/navi/teacher" className="whitespace-nowrap rounded-full bg-[#2a2452] px-4 py-2 text-white">
            先生用
          </Link>
        )}
      </nav>
      <span className="flex-1" />
      <div className="flex items-center gap-2.5 rounded-full bg-[#f5f3ff] py-1.5 pl-1.5 pr-4 text-sm font-bold">
        <b className="rounded-full bg-[linear-gradient(135deg,#a259ff,#4f7cff)] px-3 py-0.5 text-white">Lv.{unit}</b>ステップ {step}
      </div>
      {onEnd && (
        <button
          onClick={onEnd}
          className="flex h-[38px] items-center gap-1.5 rounded-full bg-white px-4 text-sm font-black text-[#1f6f9c] shadow-[inset_0_0_0_2px_#c9e8f8,0_3px_0_#c9e8f8] hover:bg-[#e3f3fc]"
        >
          🏁 今日はおわる
        </button>
      )}
      {name && <div className="text-sm font-bold">{name}</div>}
      {/* 動画やエディターの画面では出さない（「今日はおわる」とまちがえないように） */}
      {!onEnd && (
        <button
          onClick={async () => {
            await logout()
            router.push('/login')
          }}
          className="text-[13px] font-bold text-[#6d6893] underline-offset-2 hover:underline"
        >
          ログアウト
        </button>
      )}
    </header>
  )
}
