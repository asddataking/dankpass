// DANKPASS: Updated to use AI Gateway instead of direct provider calls
import { getAllPartners } from './neon-db'
import { normalizeVendorName } from './ocr'
import { classifyReceiptWithAI } from './ai'

export interface ClassificationResult {
  kind: 'dispensary' | 'restaurant' | 'unknown'
  matchedPartnerId?: string
  confidence: number
}

export async function classifyReceipt(vendor: string): Promise<ClassificationResult> {
  const normalizedVendor = normalizeVendorName(vendor)
  
  // DANKPASS: First, try to match against known partners
  const partnerMatch = await matchPartner(normalizedVendor)
  if (partnerMatch) {
    return {
      kind: partnerMatch.kind,
      matchedPartnerId: partnerMatch.id,
      confidence: 0.9
    }
  }

  // DANKPASS: Use AI Gateway for classification
  try {
    const aiResult = await classifyReceiptWithAI(normalizedVendor, normalizedVendor)
    return {
      kind: aiResult.kind,
      confidence: aiResult.confidence
    }
  } catch (error) {
    console.error('DANKPASS: AI classification failed, falling back to keywords:', error)
    
    // DANKPASS: Fallback to keyword-based classification
    const keywordClassification = classifyByKeywords(normalizedVendor)
    
    return {
      kind: keywordClassification.kind,
      confidence: keywordClassification.confidence
    }
  }
}

async function matchPartner(vendorName: string): Promise<{ id: string; kind: 'dispensary' | 'restaurant' } | null> {
  try {
    const partners = await getAllPartners()

    for (const partner of partners) {
      // Check if vendor name matches partner name or keywords
      const partnerName = normalizeVendorName(partner.name)
      const keywords = partner.matchKeywords || []
      
      if (vendorName.includes(partnerName) || partnerName.includes(vendorName)) {
        return { id: partner.id, kind: partner.kind as 'dispensary' | 'restaurant' }
      }
      
      for (const keyword of keywords) {
        const normalizedKeyword = normalizeVendorName(keyword)
        if (vendorName.includes(normalizedKeyword) || normalizedKeyword.includes(vendorName)) {
          return { id: partner.id, kind: partner.kind as 'dispensary' | 'restaurant' }
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching partners:', error)
    return null
  }
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
