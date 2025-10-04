import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getUserPoints } from '@/lib/points'
import RewardsClient from './RewardsClient'

export default async function RewardsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/signin')
  }

  const points = await getUserPoints(user.id)

  return <RewardsClient initialPoints={points} />
}