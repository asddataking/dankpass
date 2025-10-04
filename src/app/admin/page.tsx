import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { isAdminEmail } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'
import AdminDashboard from '@/components/AdminDashboard'

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user || !isAdminEmail(user.email || '')) {
    redirect('/')
  }

  // Get admin data
  const [
    { data: pendingReceipts },
    { data: recentReceipts },
    { data: recentRedemptions },
    { data: partners },
    { data: agentEvents }
  ] = await Promise.all([
    supabaseAdmin
      .from('receipts')
      .select('id, user_id, vendor, kind, status, created_at, deny_reason')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(20),
    
    supabaseAdmin
      .from('receipts')
      .select('id, user_id, vendor, kind, status, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
    
    supabaseAdmin
      .from('redemptions')
      .select('id, user_id, reward_code, points_cost, status, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
    
    supabaseAdmin
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false }),
    
    supabaseAdmin
      .from('agent_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
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
          pendingReceipts={pendingReceipts || []}
          recentReceipts={recentReceipts || []}
          recentRedemptions={recentRedemptions || []}
          partners={partners || []}
          agentEvents={agentEvents || []}
        />
      </div>
    </div>
  )
}