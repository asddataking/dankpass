import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/lib/neon-auth'
import { getUserPointsTotal } from '@/lib/neon-db'
import RewardsClient from './RewardsClient'

export default async function RewardsPage() {
  const user = await getOrCreateUser()
  if (!user) {
    redirect('/auth/signin')
  }

  const points = await getUserPointsTotal(user.id)

  return <RewardsClient initialPoints={points} />
}