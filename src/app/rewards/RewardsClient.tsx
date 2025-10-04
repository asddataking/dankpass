'use client'

import { useState } from 'react'
import { Star, Zap, Gift, CheckCircle, AlertCircle } from 'lucide-react'

interface RewardsClientProps {
  initialPoints: number
}

export default function RewardsClient({ initialPoints }: RewardsClientProps) {
  const [points, setPoints] = useState(initialPoints)
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const rewards = [
    {
      code: 'SHOUTOUT',
      name: 'Social Shoutout',
      description: 'Get featured on our social media channels',
      cost: 50,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20'
    },
    {
      code: 'BONUS_CLIP',
      name: 'Bonus Clip Access',
      description: 'Exclusive access to bonus content and clips',
      cost: 75,
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      code: 'STICKERS',
      name: 'Sticker Pack',
      description: 'Physical sticker pack mailed to your address',
      cost: 150,
      icon: Gift,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20'
    }
  ]

  const handleRedeem = async (rewardCode: string, cost: number) => {
    if (points < cost) {
      setErrorMessage('Not enough points for this reward')
      setRedeemStatus('error')
      return
    }

    setRedeeming(rewardCode)
    setRedeemStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reward_code: rewardCode }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Redemption failed')
      }

      setRedeemStatus('success')
      setPoints(points - cost)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setRedeemStatus('idle')
      }, 3000)

    } catch (error) {
      console.error('Redemption error:', error)
      setRedeemStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Redemption failed')
    } finally {
      setRedeeming(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg"></div>
            <span className="text-xl font-bold">DankPass</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              Home
            </a>
            <a href="/upload" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              Upload
            </a>
            <a href="/me" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              My Pass
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">
            Rewards Store
          </h1>
          <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-gray-900 border border-gray-800">
            <div className="text-2xl font-bold text-green-500 mr-2">{points.toLocaleString()}</div>
            <div className="text-gray-400">Dank Points Available</div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {redeemStatus === 'success' && (
          <div className="mb-8 p-4 rounded-2xl bg-green-500/20 border border-green-500/50 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-green-500">Reward redeemed successfully! Check your dashboard for updates.</span>
          </div>
        )}

        {redeemStatus === 'error' && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-500">{errorMessage}</span>
          </div>
        )}

        {/* Rewards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {rewards.map((reward) => {
            const Icon = reward.icon
            const canAfford = points >= reward.cost
            const isRedeeming = redeeming === reward.code

            return (
              <div
                key={reward.code}
                className={`p-8 rounded-2xl border transition-all duration-300 ${
                  canAfford
                    ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    : 'bg-gray-900/50 border-gray-800/50 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${reward.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className={`w-8 h-8 ${reward.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{reward.name}</h3>
                  <p className="text-gray-400 mb-6">{reward.description}</p>
                  
                  <div className="text-3xl font-bold mb-6 text-green-500">
                    {reward.cost} Points
                  </div>
                  
                  <button
                    onClick={() => handleRedeem(reward.code, reward.cost)}
                    disabled={!canAfford || isRedeeming}
                    className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      canAfford && !isRedeeming
                        ? 'bg-gradient-to-r from-green-500 to-purple-500 hover:scale-105'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isRedeeming ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Redeeming...
                      </div>
                    ) : canAfford ? (
                      'Redeem Now'
                    ) : (
                      'Not Enough Points'
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* How to Earn Points */}
        <div className="mt-16 p-8 rounded-2xl bg-gray-900 border border-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-center">How to Earn More Points</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 font-bold">10</span>
              </div>
              <h4 className="font-semibold mb-2">Dispensary Receipts</h4>
              <p className="text-sm text-gray-400">Upload receipts from cannabis dispensaries</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-500 font-bold">8</span>
              </div>
              <h4 className="font-semibold mb-2">Restaurant Receipts</h4>
              <p className="text-sm text-gray-400">Upload receipts from restaurants</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-500 font-bold">15</span>
              </div>
              <h4 className="font-semibold mb-2">Combo Bonus</h4>
              <p className="text-sm text-gray-400">Get both types within 48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
