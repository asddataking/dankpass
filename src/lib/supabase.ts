import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser/client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side usage with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          city: string | null
          is_plus: boolean
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          city?: string | null
          is_plus?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          city?: string | null
          is_plus?: boolean
          created_at?: string
        }
      }
      partners: {
        Row: {
          id: string
          name: string
          kind: 'dispensary' | 'restaurant'
          url: string | null
          logo_url: string | null
          match_keywords: string[]
          is_featured: boolean
          city: string | null
          state: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          kind: 'dispensary' | 'restaurant'
          url?: string | null
          logo_url?: string | null
          match_keywords?: string[]
          is_featured?: boolean
          city?: string | null
          state?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          kind?: 'dispensary' | 'restaurant'
          url?: string | null
          logo_url?: string | null
          match_keywords?: string[]
          is_featured?: boolean
          city?: string | null
          state?: string | null
          created_at?: string
        }
      }
      receipts: {
        Row: {
          id: string
          user_id: string
          storage_path: string
          kind: 'dispensary' | 'restaurant' | 'unknown'
          matched_partner_id: string | null
          status: 'pending' | 'approved' | 'denied'
          vendor: string | null
          total_amount_cents: number | null
          receipt_date: string | null
          image_hash: string | null
          deny_reason: string | null
          created_at: string
          approved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          storage_path: string
          kind?: 'dispensary' | 'restaurant' | 'unknown'
          matched_partner_id?: string | null
          status?: 'pending' | 'approved' | 'denied'
          vendor?: string | null
          total_amount_cents?: number | null
          receipt_date?: string | null
          image_hash?: string | null
          deny_reason?: string | null
          created_at?: string
          approved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          storage_path?: string
          kind?: 'dispensary' | 'restaurant' | 'unknown'
          matched_partner_id?: string | null
          status?: 'pending' | 'approved' | 'denied'
          vendor?: string | null
          total_amount_cents?: number | null
          receipt_date?: string | null
          image_hash?: string | null
          deny_reason?: string | null
          created_at?: string
          approved_at?: string | null
        }
      }
      points_ledger: {
        Row: {
          id: string
          user_id: string
          delta: number
          reason: 'receipt' | 'combo' | 'bonus' | 'redeem' | 'admin'
          ref_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          delta: number
          reason: 'receipt' | 'combo' | 'bonus' | 'redeem' | 'admin'
          ref_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          delta?: number
          reason?: 'receipt' | 'combo' | 'bonus' | 'redeem' | 'admin'
          ref_id?: string | null
          created_at?: string
        }
      }
      redemptions: {
        Row: {
          id: string
          user_id: string
          reward_code: 'SHOUTOUT' | 'BONUS_CLIP' | 'STICKERS'
          points_cost: number
          status: 'pending' | 'fulfilled' | 'cancelled'
          created_at: string
          fulfilled_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          reward_code: 'SHOUTOUT' | 'BONUS_CLIP' | 'STICKERS'
          points_cost: number
          status?: 'pending' | 'fulfilled' | 'cancelled'
          created_at?: string
          fulfilled_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          reward_code?: 'SHOUTOUT' | 'BONUS_CLIP' | 'STICKERS'
          points_cost?: number
          status?: 'pending' | 'fulfilled' | 'cancelled'
          created_at?: string
          fulfilled_at?: string | null
        }
      }
    }
  }
}
