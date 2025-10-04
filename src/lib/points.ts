import { supabaseAdmin } from './supabase'

export interface PointsAward {
  userId: string
  delta: number
  reason: 'receipt' | 'combo' | 'bonus' | 'redeem' | 'admin'
  refId?: string
}

export async function awardPoints(award: PointsAward) {
  const { data, error } = await supabaseAdmin
    .from('points_ledger')
    .insert({
      user_id: award.userId,
      delta: award.delta,
      reason: award.reason,
      ref_id: award.refId
    })
    .select()
    .single()

  if (error) {
    console.error('Error awarding points:', error)
    throw error
  }

  return data
}

export async function getUserPoints(userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('points_ledger')
    .select('delta')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user points:', error)
    return 0
  }

  return data.reduce((sum, entry) => sum + entry.delta, 0)
}

export async function getUserPointsBreakdown(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('points_ledger')
    .select('delta, reason, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching points breakdown:', error)
    return []
  }

  return data
}

export function getTierFromPoints(points: number): { name: string; color: string; minPoints: number } {
  if (points >= 2000) {
    return { name: 'Ambassador', color: 'bg-gradient-to-r from-purple-600 to-black', minPoints: 2000 }
  } else if (points >= 500) {
    return { name: 'Mentor', color: 'bg-gradient-to-r from-yellow-500 to-orange-500', minPoints: 500 }
  } else {
    return { name: 'Supporter', color: 'bg-gradient-to-r from-green-500 to-emerald-500', minPoints: 0 }
  }
}

export async function checkComboEligibility(userId: string, receiptKind: 'dispensary' | 'restaurant'): Promise<boolean> {
  const otherKind = receiptKind === 'dispensary' ? 'restaurant' : 'dispensary'
  
  // Check if user has an approved receipt of the other kind within 48 hours
  const { data, error } = await supabaseAdmin
    .from('receipts')
    .select('id, created_at')
    .eq('user_id', userId)
    .eq('status', 'approved')
    .eq('kind', otherKind)
    .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
    .limit(1)

  if (error) {
    console.error('Error checking combo eligibility:', error)
    return false
  }

  return data.length > 0
}

export async function awardComboBonus(userId: string, receiptId: string) {
  const { data, error } = await supabaseAdmin
    .from('points_ledger')
    .insert({
      user_id: userId,
      delta: 15,
      reason: 'combo',
      ref_id: receiptId
    })
    .select()
    .single()

  if (error) {
    console.error('Error awarding combo bonus:', error)
    throw error
  }

  return data
}
