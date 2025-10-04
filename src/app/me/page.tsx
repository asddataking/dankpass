import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getOrCreateUser } from '@/lib/neon-auth'
import { getUserPointsTotal, getUserPointsBreakdown, getUserReceipts, getUserRedemptions } from '@/lib/neon-db'
import DankPassCard from '@/components/DankPassCard'

export default async function MePage() {
  const user = await getOrCreateUser()
  if (!user) {
    redirect('/auth/signin')
  }

  const points = await getUserPointsTotal(user.id)
  const pointsBreakdown = await getUserPointsBreakdown(user.id)
  const recentReceipts = await getUserReceipts(user.id, 5)
  const recentRedemptions = await getUserRedemptions(user.id, 5)

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
              displayName={user.display_name || user.email}
              city={undefined}
              isPlus={user.is_plus}
              recentReceipts={recentReceipts || []}
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
                        entry.delta > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-gray-300 capitalize">{entry.reason}</span>
                    </div>
                    <div className={`text-sm font-semibold ${
                      entry.delta > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {entry.delta > 0 ? '+' : ''}{entry.delta}
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
                        <span className="text-sm text-gray-300">{redemption.reward_code}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        -{redemption.points_cost}
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
