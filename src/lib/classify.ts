import { supabaseAdmin } from './supabase'
import { normalizeVendorName } from './ocr'

export interface ClassificationResult {
  kind: 'dispensary' | 'restaurant' | 'unknown'
  matchedPartnerId?: string
  confidence: number
}

export async function classifyReceipt(vendor: string, total: number): Promise<ClassificationResult> {
  const normalizedVendor = normalizeVendorName(vendor)
  
  // First, try to match against known partners
  const partnerMatch = await matchPartner(normalizedVendor)
  if (partnerMatch) {
    return {
      kind: partnerMatch.kind,
      matchedPartnerId: partnerMatch.id,
      confidence: 0.9
    }
  }

  // Fallback to keyword-based classification
  const keywordClassification = classifyByKeywords(normalizedVendor)
  
  return {
    kind: keywordClassification.kind,
    confidence: keywordClassification.confidence
  }
}

async function matchPartner(vendorName: string): Promise<{ id: string; kind: 'dispensary' | 'restaurant' } | null> {
  const { data: partners, error } = await supabaseAdmin
    .from('partners')
    .select('id, name, kind, match_keywords')

  if (error) {
    console.error('Error fetching partners:', error)
    return null
  }

  for (const partner of partners) {
    // Check if vendor name matches partner name or keywords
    const partnerName = normalizeVendorName(partner.name)
    const keywords = partner.match_keywords || []
    
    if (vendorName.includes(partnerName) || partnerName.includes(vendorName)) {
      return { id: partner.id, kind: partner.kind }
    }
    
    for (const keyword of keywords) {
      const normalizedKeyword = normalizeVendorName(keyword)
      if (vendorName.includes(normalizedKeyword) || normalizedKeyword.includes(vendorName)) {
        return { id: partner.id, kind: partner.kind }
      }
    }
  }

  return null
}

function classifyByKeywords(vendorName: string): { kind: 'dispensary' | 'restaurant' | 'unknown'; confidence: number } {
  const dispensaryKeywords = [
    'DISPENSARY', 'CANNABIS', 'WEED', 'MARIJUANA', 'THC', 'CBD', 'GREEN', 'HERB', 'SMOKE',
    'BUD', 'FLOWER', 'CONCENTRATE', 'EDIBLE', 'VAPE', 'MEDICAL', 'RECREATIONAL'
  ]
  
  const restaurantKeywords = [
    'RESTAURANT', 'CAFE', 'COFFEE', 'PIZZA', 'BURGER', 'FOOD', 'EAT', 'DINE', 'KITCHEN',
    'GRILL', 'BAR', 'PUB', 'TAVERN', 'DELI', 'BAKERY', 'DINER', 'BISTRO'
  ]

  const upperVendor = vendorName.toUpperCase()
  
  const dispensaryMatches = dispensaryKeywords.filter(keyword => 
    upperVendor.includes(keyword)
  ).length
  
  const restaurantMatches = restaurantKeywords.filter(keyword => 
    upperVendor.includes(keyword)
  ).length

  if (dispensaryMatches > restaurantMatches && dispensaryMatches > 0) {
    return { kind: 'dispensary', confidence: Math.min(0.8, dispensaryMatches * 0.2) }
  } else if (restaurantMatches > dispensaryMatches && restaurantMatches > 0) {
    return { kind: 'restaurant', confidence: Math.min(0.8, restaurantMatches * 0.2) }
  } else {
    return { kind: 'unknown', confidence: 0.1 }
  }
}

export async function getActiveCampaigns(partnerId?: string) {
  const query = supabaseAdmin
    .from('campaigns')
    .select('*')
    .eq('is_active', true)
    .lte('starts_at', new Date().toISOString())
    .gte('ends_at', new Date().toISOString())

  if (partnerId) {
    query.eq('partner_id', partnerId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching campaigns:', error)
    return []
  }

  return data
}
