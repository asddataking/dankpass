'use client'

import { Star, Zap, Gift } from 'lucide-react'
import { getTierFromPoints } from '@/lib/points'

interface DankPassCardProps {
  points: number
  displayName?: string
  city?: string
  isPlus?: boolean
  recentReceipts?: Array<{
    id: string
    vendor: string
    kind: 'dispensary' | 'restaurant' | 'unknown'
    status: 'pending' | 'approved' | 'denied'
    created_at: string
  }>
}

export default function DankPassCard({ 
  points, 
  displayName, 
  city, 
  isPlus = false,
  recentReceipts = []
}: DankPassCardProps) {
  const tier = getTierFromPoints(points)
  const approvedReceipts = recentReceipts.filter(r => r.status === 'approved')
  const dispensaryCount = approvedReceipts.filter(r => r.kind === 'dispensary').length
  const restaurantCount = approvedReceipts.filter(r => r.kind === 'restaurant').length

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-700 p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-green-500 to-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">DankPass</h2>
          <p className="text-gray-400 text-sm">Digital Loyalty Card</p>
        </div>
        {isPlus && (
          <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold">
            PLUS
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="relative z-10 mb-6">
        <h3 className="text-xl font-semibold mb-1">
          {displayName || 'Anonymous User'}
        </h3>
        {city && (
          <p className="text-gray-400 text-sm">{city}</p>
        )}
      </div>

      {/* Points Display */}
      <div className="relative z-10 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">
            {points.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">Dank Points</div>
        </div>
      </div>

      {/* Tier Badge */}
      <div className="relative z-10 mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${tier.color} text-white font-semibold`}>
          <Star className="w-4 h-4 mr-2" />
          {tier.name}
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 rounded-xl bg-gray-800/50">
          <div className="text-lg font-bold text-green-500">{dispensaryCount}</div>
          <div className="text-xs text-gray-400">Dispensary</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-gray-800/50">
          <div className="text-lg font-bold text-purple-500">{restaurantCount}</div>
          <div className="text-xs text-gray-400">Restaurant</div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentReceipts.length > 0 && (
        <div className="relative z-10">
          <h4 className="text-sm font-semibold mb-3 text-gray-300">Recent Activity</h4>
          <div className="space-y-2">
            {recentReceipts.slice(0, 3).map((receipt) => (
              <div key={receipt.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    receipt.status === 'approved' ? 'bg-green-500' :
                    receipt.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-300">{receipt.vendor}</span>
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {receipt.kind}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-6 right-6 opacity-20">
        <Zap className="w-6 h-6 text-green-500" />
      </div>
      <div className="absolute bottom-6 left-6 opacity-20">
        <Gift className="w-6 h-6 text-purple-500" />
      </div>
    </div>
  )
}
