'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@stackframe/stack'
import { getUserPointsTotal, getUserPointsBreakdown, getUserReceipts, getUserRedemptions } from '@/lib/neon-db'
import DankPassCard from '@/components/DankPassCard'

export default function MePage() {
  const user = useUser()
  const router = useRouter()
  
  const [points, setPoints] = useState(0)
  const [pointsBreakdown, setPointsBreakdown] = useState<Array<{ reason: string; total: number }>>([])
  const [recentReceipts, setRecentReceipts] = useState<Array<{ id: string; vendor: string; kind: 'dispensary' | 'restaurant' | 'unknown'; status: 'pending' | 'approved' | 'denied'; created_at: string; }>>([])
  const [recentRedemptions, setRecentRedemptions] = useState<Array<{ id: string; rewardCode: string; pointsCost: number; status: 'pending' | 'fulfilled' | 'cancelled'; created_at: string; }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        router.push('/auth/signin')
        return
      }
      
      try {
        const [totalPoints, breakdown, receipts, redemptions] = await Promise.all([
          getUserPointsTotal(user.id),
          getUserPointsBreakdown(user.id),
          getUserReceipts(user.id, 5),
          getUserRedemptions(user.id, 5),
        ])

        setPoints(totalPoints)
        setPointsBreakdown(breakdown.map(entry => ({
          reason: entry.reason,
          total: entry.delta
        })))
        setRecentReceipts(receipts.map(receipt => ({
          id: receipt.id,
          vendor: receipt.vendor || 'Unknown',
          kind: receipt.kind || 'unknown',
          status: receipt.status || 'pending',
          created_at: receipt.createdAt.toISOString()
        })))
        setRecentRedemptions(redemptions.map(redemption => ({
          id: redemption.id,
          rewardCode: redemption.rewardCode,
          pointsCost: redemption.pointsCost,
          status: redemption.status || 'pending',
          created_at: redemption.createdAt.toISOString()
        })))
      } catch (err) {
        console.error('Failed to fetch user data:', err)
        setError('Failed to load user data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl mx-auto mb-4 animate-pulse"></div>
          <h2 className="text-2xl font-bold mb-2">Loading your DankPass...</h2>
          <p className="text-gray-400">Please wait while we fetch your data.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-500">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Should redirect by now
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
            <Link href="/" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              Home
            </Link>
            <Link href="/upload" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              Upload
            </Link>
            <Link href="/rewards" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              Rewards
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <DankPassCard
              points={points}
              displayName={user.displayName || 'User'}
              city={undefined}
              isPlus={false}
              recentReceipts={(recentReceipts || []).map(receipt => ({
                id: receipt.id,
                vendor: receipt.vendor || 'Unknown',
                kind: receipt.kind || 'unknown',
                status: receipt.status || 'pending',
                created_at: receipt.created_at
              }))}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/upload"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg text-center font-semibold hover:scale-105 transition-transform"
                >
                  Upload Receipt
                </a>
                <a
                  href="/rewards"
                  className="block w-full px-4 py-3 border border-gray-600 rounded-lg text-center font-semibold hover:border-green-500 transition-colors"
                >
                  Redeem Rewards
                </a>
              </div>
            </div>

            {/* Points Breakdown */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
              <h3 className="text-lg font-bold mb-4">Points Breakdown</h3>
              <div className="space-y-3">
                {pointsBreakdown.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        entry.total > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-gray-300 capitalize">{entry.reason}</span>
                    </div>
                    <div className={`text-sm font-semibold ${
                      entry.total > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {entry.total > 0 ? '+' : ''}{entry.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Redemptions */}
            {recentRedemptions && recentRedemptions.length > 0 && (
              <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
                <h3 className="text-lg font-bold mb-4">Recent Redemptions</h3>
                <div className="space-y-3">
                  {recentRedemptions.map((redemption, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          redemption.status === 'fulfilled' ? 'bg-green-500' :
                          redemption.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm text-gray-300">{redemption.rewardCode}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        -{redemption.pointsCost}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Receipts Table */}
        {recentReceipts && recentReceipts.length > 0 && (
          <div className="mt-8 p-6 rounded-2xl bg-gray-900 border border-gray-800">
            <h3 className="text-lg font-bold mb-4">Recent Receipts</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-sm text-gray-400">Vendor</th>
                    <th className="text-left py-2 text-sm text-gray-400">Type</th>
                    <th className="text-left py-2 text-sm text-gray-400">Status</th>
                    <th className="text-left py-2 text-sm text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReceipts.map((receipt) => (
                    <tr key={receipt.id} className="border-b border-gray-800">
                      <td className="py-3 text-sm text-gray-300">{receipt.vendor}</td>
                      <td className="py-3 text-sm text-gray-300 capitalize">{receipt.kind}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          receipt.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                          receipt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-400">
                        {new Date(receipt.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
