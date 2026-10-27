// 先生の管理画面で読む、Python ナビの生徒の「いま」と「苦手」（書くのは teacherLog.ts）
import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, type Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { NaviLive } from './teacherLog'

export type LiveRow = NaviLive & { activeAt: Date | null; updatedAt: Date | null }

const toDate = (t: unknown) => (t && typeof (t as Timestamp).toDate === 'function' ? (t as Timestamp).toDate() : null)

// 生徒ごとの「いま」を、変わるたびに受けとる。もどり値で受けとるのをやめる
export function watchLive(uids: string[], onChange: (uid: string, row: LiveRow | null) => void): () => void {
  const stops = uids.map((uid) =>
    onSnapshot(
      doc(db, 'users', uid, 'naviLive', 'now'),
      (snap) => {
        if (!snap.exists()) return onChange(uid, null)
        const d = snap.data()
        onChange(uid, {
          step: d.step ?? 1,
          where: d.where ?? 'home',
          videoSec: d.videoSec,
          section: d.section ?? null,
          lessonId: d.lessonId,
          mission: d.mission,
          lastError: d.lastError ?? null,
          fails: d.fails ?? 0,
          hints: d.hints ?? [],
          activeAt: toDate(d.activeAt),
          updatedAt: toDate(d.updatedAt),
        })
      },
      () => onChange(uid, null),
    ),
  )
  return () => stops.forEach((s) => s())
}

export type SectionWeak = { fails?: number; rewinds?: number; hints?: number; revealed?: number }
export type WeakData = {
  steps: { step: number; sections: Record<string, SectionWeak>; errors: Record<string, number> }[]
  missions: { lessonId: string; missions: Record<string, number> }[]
  questions: { step: number; section: number | null; question: string; at: Date | null }[]
}

export async function loadWeak(uid: string): Promise<WeakData> {
  const [weak, qs] = await Promise.all([
    getDocs(collection(db, 'users', uid, 'naviWeak')).catch(() => null),
    getDocs(query(collection(db, 'users', uid, 'naviQuestions'), orderBy('createdAt', 'desc'), limit(100))).catch(() => null),
  ])
  const data: WeakData = { steps: [], missions: [], questions: [] }
  weak?.forEach((d) => {
    const v = d.data()
    if (d.id.startsWith('cb-')) data.missions.push({ lessonId: v.lessonId ?? d.id.slice(3), missions: v.missions ?? {} })
    else data.steps.push({ step: v.step ?? Number(d.id.slice(1)), sections: v.sections ?? {}, errors: v.errors ?? {} })
  })
  qs?.forEach((d) => {
    const v = d.data()
    data.questions.push({ step: v.step ?? 0, section: typeof v.section === 'number' ? v.section : null, question: v.question ?? '', at: toDate(v.createdAt) })
  })
  return data
}

// 見出しのつまずきの重さ（こたえの例をたしかめて進んだのは重め）
export const sectionScore = (w: SectionWeak, questions = 0) =>
  (w.fails ?? 0) + (w.rewinds ?? 0) + (w.hints ?? 0) + 2 * (w.revealed ?? 0) + questions
// これ以上を「つまずいた」とみなす
export const STRUGGLE = 3
