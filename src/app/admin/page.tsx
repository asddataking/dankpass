import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/neon-auth'
import { getPendingReceipts, getPendingRedemptions, getAllPartners } from '@/lib/neon-db'
import AdminDashboard from '@/components/AdminDashboard'

export default async function AdminPage() {
  try {
    await requireAdmin()
  } catch (error) {
    redirect('/')
  }

  // Get admin data
  const [
    pendingReceipts,
    pendingRedemptions,
    partners
  ] = await Promise.all([
    getPendingReceipts(20),
    getPendingRedemptions(),
    getAllPartners()
  ])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg"></div>
            <span className="text-xl font-bold">DankPass Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              Home
            </Link>
            <Link href="/admin" className="px-4 py-2 bg-gray-800 rounded-lg">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <AdminDashboard
          pendingReceipts={(pendingReceipts || []).map(receipt => ({
            id: receipt.id,
            user_id: receipt.userId,
            vendor: receipt.vendor || 'Unknown',
            kind: receipt.kind || 'unknown',
            status: receipt.status || 'pending',
            created_at: receipt.createdAt.toISOString(),
            deny_reason: receipt.denyReason || undefined
          }))}
          recentReceipts={[]}
          recentRedemptions={(pendingRedemptions || []).map(redemption => ({
            id: redemption.id,
            user_id: redemption.userId,
            reward_code: redemption.rewardCode,
            points_cost: redemption.pointsCost,
            status: redemption.status || 'pending',
            created_at: redemption.createdAt.toISOString()
          }))}
          partners={(partners || []).map(partner => ({
            id: partner.id,
            name: partner.name,
            kind: partner.kind as 'dispensary' | 'restaurant',
            is_featured: partner.isFeatured || false,
            city: partner.city || 'Unknown',
            state: partner.state || 'Unknown'
          }))}
          agentEvents={[]}
        />
      </div>
    </div>
  )
}