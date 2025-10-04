// Utility functions for points and tiers
export interface Tier {
  name: string
  color: string
  minPoints: number
  maxPoints?: number
  benefits: string[]
}

export function getTierFromPoints(points: number): Tier {
  if (points >= 2000) {
    return {
      name: 'Ambassador',
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      minPoints: 2000,
      benefits: [
        '2x points multiplier',
        'Early access to new rewards',
        'Exclusive Ambassador events',
        'Priority customer support'
      ]
    }
  } else if (points >= 500) {
    return {
      name: 'Mentor',
      color: 'bg-gradient-to-r from-blue-600 to-purple-600',
      minPoints: 500,
      maxPoints: 1999,
      benefits: [
        '1.5x points multiplier',
        'Access to Mentor rewards',
        'Monthly bonus points'
      ]
    }
  } else {
    return {
      name: 'Supporter',
      color: 'bg-gradient-to-r from-green-600 to-blue-600',
      minPoints: 0,
      maxPoints: 499,
      benefits: [
        'Standard points earning',
        'Access to basic rewards',
        'Community access'
      ]
    }
  }
}

export function getNextTier(points: number): Tier | null {
  const currentTier = getTierFromPoints(points)
  
  if (currentTier.name === 'Ambassador') {
    return null // Already at highest tier
  }
  
  if (currentTier.name === 'Supporter') {
    return {
      name: 'Mentor',
      color: 'bg-gradient-to-r from-blue-600 to-purple-600',
      minPoints: 500,
      maxPoints: 1999,
      benefits: [
        '1.5x points multiplier',
        'Access to Mentor rewards',
        'Monthly bonus points'
      ]
    }
  }
  
  if (currentTier.name === 'Mentor') {
    return {
      name: 'Ambassador',
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      minPoints: 2000,
      benefits: [
        '2x points multiplier',
        'Early access to new rewards',
        'Exclusive Ambassador events',
        'Priority customer support'
      ]
    }
  }
  
  return null
}

export function getPointsToNextTier(points: number): number {
  const nextTier = getNextTier(points)
  if (!nextTier) return 0
  
  return nextTier.minPoints - points
}

export function getTierProgress(points: number): number {
  const currentTier = getTierFromPoints(points)
  const nextTier = getNextTier(points)
  
  if (!nextTier) return 100 // At highest tier
  
  const tierRange = nextTier.minPoints - currentTier.minPoints
  const progress = points - currentTier.minPoints
  
  return Math.min(100, Math.max(0, (progress / tierRange) * 100))
}

export function formatPoints(points: number): string {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M`
  } else if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`
  } else {
    return points.toString()
  }
}

export function calculatePointsFromReceipt(
  kind: 'dispensary' | 'restaurant' | 'unknown',
  isPlus: boolean = false,
  hasComboBonus: boolean = false
): number {
  let basePoints = 0
  
  switch (kind) {
    case 'dispensary':
      basePoints = 10
      break
    case 'restaurant':
      basePoints = 8
      break
    default:
      return 0
  }
  
  // Apply Plus multiplier
  if (isPlus) {
    basePoints *= 2
  }
  
  // Apply combo bonus
  if (hasComboBonus) {
    basePoints += 15
  }
  
  return basePoints
}

export function getTierMultiplier(tier: Tier): number {
  switch (tier.name) {
    case 'Ambassador':
      return 2.0
    case 'Mentor':
      return 1.5
    case 'Supporter':
    default:
      return 1.0
  }
}
