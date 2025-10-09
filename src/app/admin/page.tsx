'use client';

import { motion } from 'framer-motion';
import { Users, Building2, Receipt, Gift, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdminStats {
  users: {
    total: number;
    premium: number;
    totalPartners: number;
    totalReceipts: number;
  };
  partners: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  receipts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  redemptions: {
    total: number;
    completed: number;
    pending: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-dp-blue-300 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary pb-24">
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/70">Manage your DankPass platform</p>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Users Stats */}
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-dp-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-dp-blue-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.users.total}</div>
                    <div className="text-xs text-white/60">Total Users</div>
                  </div>
                </div>
                <div className="text-sm text-white/70">
                  {stats.users.premium} premium • {stats.users.totalPartners} partners
                </div>
              </div>

              {/* Partners Stats */}
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-dp-mint/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-dp-mint" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.partners.total}</div>
                    <div className="text-xs text-white/60">Total Partners</div>
                  </div>
                </div>
                <div className="text-sm text-white/70">
                  {stats.partners.pending} pending • {stats.partners.approved} approved
                </div>
              </div>

              {/* Receipts Stats */}
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-dp-lime/20 rounded-xl flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-dp-lime" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.receipts.total}</div>
                    <div className="text-xs text-white/60">Total Receipts</div>
                  </div>
                </div>
                <div className="text-sm text-white/70">
                  {stats.receipts.pending} pending • {stats.receipts.approved} approved
                </div>
              </div>

              {/* Redemptions Stats */}
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Gift className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.redemptions.total}</div>
                    <div className="text-xs text-white/60">Total Redemptions</div>
                  </div>
                </div>
                <div className="text-sm text-white/70">
                  {stats.redemptions.completed} completed • {stats.redemptions.pending} pending
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Pending Partners */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Pending Partners
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Review and approve new partner applications
              </p>
              <Link href="/admin/partners" className="btn-primary w-full">
                Review Applications
              </Link>
            </div>

            {/* Pending Receipts */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-400" />
                Pending Receipts
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Review uploaded receipts and award points
              </p>
              <Link href="/admin/receipts" className="btn-primary w-full">
                Review Receipts
              </Link>
            </div>

            {/* Platform Analytics */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Analytics
              </h3>
              <p className="text-white/70 text-sm mb-4">
                View platform performance and user engagement
              </p>
              <button className="btn-primary w-full">
                View Analytics
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              {/* Mock recent activity */}
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Green Valley Dispensary approved</p>
                  <p className="text-white/60 text-sm">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">New receipt uploaded by John Doe</p>
                  <p className="text-white/60 text-sm">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Perk redeemed: Free Coffee</p>
                  <p className="text-white/60 text-sm">6 hours ago</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Pizza Palace application pending</p>
                  <p className="text-white/60 text-sm">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
