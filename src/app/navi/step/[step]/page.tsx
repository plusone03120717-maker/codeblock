import { StudyClient } from './StudyClient'

export default async function NaviStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params
  return <StudyClient step={Number(step)} />
}
