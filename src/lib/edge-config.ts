// DANKPASS: Vercel Edge Config integration for Neon-based stack
import { get } from '@vercel/edge-config'

export interface EdgeConfigData {
  // Point values for different receipt types
  pointValues: {
    dispensary: number
    restaurant: number
    bonus: number
  }
  
  // Feature flags
  features: {
    aiProcessing: boolean
    duplicateDetection: boolean
    leaderboard: boolean
    notifications: boolean
  }
  
  // Rate limits
  rateLimits: {
    receiptUpload: number
    apiCalls: number
  }
  
  // Partner configurations
  partners: {
    featured: string[]
    active: string[]
  }
}

// DANKPASS: Get point values from Edge Config
export async function getPointValues(): Promise<{ dispensary: number; restaurant: number; bonus: number }> {
  try {
    const data = await get<{ dispensary: number; restaurant: number; bonus: number }>('pointValues')
    return data || {
      dispensary: 10,
      restaurant: 5,
      bonus: 25
    }
  } catch (error) {
    console.error('Error fetching point values from Edge Config:', error)
    // Fallback values
    return {
      dispensary: 10,
      restaurant: 5,
      bonus: 25
    }
  }
}

// DANKPASS: Get feature flags from Edge Config
export async function getFeatureFlags(): Promise<{ aiProcessing: boolean; duplicateDetection: boolean; leaderboard: boolean; notifications: boolean }> {
  try {
    const data = await get<{ aiProcessing: boolean; duplicateDetection: boolean; leaderboard: boolean; notifications: boolean }>('features')
    return data || {
      aiProcessing: true,
      duplicateDetection: true,
      leaderboard: true,
      notifications: true
    }
  } catch (error) {
    console.error('Error fetching feature flags from Edge Config:', error)
    // Fallback values
    return {
      aiProcessing: true,
      duplicateDetection: true,
      leaderboard: true,
      notifications: true
    }
  }
}

// DANKPASS: Get rate limits from Edge Config
export async function getRateLimits(): Promise<{ receiptUpload: number; apiCalls: number }> {
  try {
    const data = await get<{ receiptUpload: number; apiCalls: number }>('rateLimits')
    return data || {
      receiptUpload: 5,
      apiCalls: 100
    }
  } catch (error) {
    console.error('Error fetching rate limits from Edge Config:', error)
    // Fallback values
    return {
      receiptUpload: 5,
      apiCalls: 100
    }
  }
}

// DANKPASS: Get partner configurations from Edge Config
export async function getPartnerConfig(): Promise<{ featured: string[]; active: string[] }> {
  try {
    const data = await get<{ featured: string[]; active: string[] }>('partners')
    return data || {
      featured: [],
      active: []
    }
  } catch (error) {
    console.error('Error fetching partner config from Edge Config:', error)
    // Fallback values
    return {
      featured: [],
      active: []
    }
  }
}

// DANKPASS: Check if a feature is enabled
export async function isFeatureEnabled(feature: 'aiProcessing' | 'duplicateDetection' | 'leaderboard' | 'notifications'): Promise<boolean> {
  try {
    const flags = await getFeatureFlags()
    return flags[feature] || false
  } catch (error) {
    console.error(`Error checking feature flag ${feature}:`, error)
    return false
  }
}
