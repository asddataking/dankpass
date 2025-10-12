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
  waitlist?: {
    total: number;
    recent: Array<{
      id: string;
      name: string;
      email: string;
      referrer: string;
      created_at: string;
    }>;
  };
  referrals?: {
    total: number;
    pointsAwarded: number;
    topReferrers: Array<{
      name: string;
      email: string;
      referralCount: number;
      pointsEarned: number;
    }>;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      console.log('Starting to fetch admin stats...');
      try {
        const response = await fetch('/api/admin/stats');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        if (response.ok) {
          const data = await response.json();
          console.log('Admin stats loaded:', data); // Debug log
          setStats(data);
        } else {
          const errorText = await response.text();
          console.error('Failed to load stats:', response.status, response.statusText, errorText);
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
          {(stats || loading) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Users Stats */}
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-dp-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-dp-blue-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{loading ? '...' : (stats?.users?.total || 0)}</div>
                    <div className="text-xs text-gray-600">Total Users</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {stats?.users?.premium || 0} premium • {stats?.users?.totalPartners || 0} partners
                </div>
              </div>

              {/* Partners Stats */}
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-dp-mint/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-dp-mint" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{loading ? '...' : (stats?.partners?.total || 0)}</div>
                    <div className="text-xs text-gray-600">Total Partners</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {stats?.partners?.pending || 0} pending • {stats?.partners?.approved || 0} approved
                </div>
              </div>

              {/* Receipts Stats */}
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-dp-lime/20 rounded-xl flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-dp-lime" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{loading ? '...' : (stats?.receipts?.total || 0)}</div>
                    <div className="text-xs text-gray-600">Total Receipts</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {stats?.receipts?.pending || 0} pending • {stats?.receipts?.approved || 0} approved
                </div>
              </div>

              {/* Redemptions Stats */}
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Gift className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{loading ? '...' : (stats?.redemptions?.total || 0)}</div>
                    <div className="text-xs text-gray-600">Total Redemptions</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {stats?.redemptions?.completed || 0} completed • {stats?.redemptions?.pending || 0} pending
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Pending Partners */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Pending Partners
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Review and approve new partner applications
              </p>
              <Link href="/admin/partners" className="btn-primary w-full">
                Review Applications
              </Link>
            </div>

            {/* Pending Receipts */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-400" />
                Pending Receipts
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Review uploaded receipts and award points
              </p>
              <Link href="/admin/receipts" className="btn-primary w-full">
                Review Receipts
              </Link>
            </div>

            {/* Platform Analytics */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Analytics
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                View platform performance and user engagement
              </p>
              <button className="btn-primary w-full">
                View Analytics
              </button>
            </div>
          </div>

          {/* Waitlist Signups */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-primary" />
                Waitlist Signups ({stats?.waitlist?.total || 0})
              </h3>
            </div>
            
            {stats?.waitlist && stats.waitlist.recent.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stats.waitlist.recent.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{entry.name}</p>
                      <p className="text-sm text-gray-600">{entry.email}</p>
                      {entry.referrer && (
                        <p className="text-xs text-gray-500 mt-1">Referrer: {entry.referrer}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No waitlist signups yet</p>
            )}
          </div>

          {/* Referral Stats */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Gift className="w-5 h-5 text-brand-success" />
                Referral Program Stats
              </h3>
            </div>
            
            {stats?.referrals ? (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-brand-success/10 rounded-xl">
                    <div className="text-3xl font-bold text-brand-success">{stats.referrals.total}</div>
                    <div className="text-sm text-gray-600">Total Referrals</div>
                  </div>
                  <div className="p-4 bg-brand-primary/10 rounded-xl">
                    <div className="text-3xl font-bold text-brand-primary">{stats.referrals.pointsAwarded.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Points Awarded</div>
                  </div>
                </div>

                {stats.referrals.topReferrers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Top Referrers</h4>
                    <div className="space-y-2">
                      {stats.referrals.topReferrers.map((referrer, index) => (
                        <div key={referrer.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-brand-primary font-bold text-sm">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{referrer.name}</p>
                              <p className="text-xs text-gray-600">{referrer.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-brand-success">{referrer.referralCount} referrals</p>
                            <p className="text-xs text-gray-600">{referrer.pointsEarned} pts earned</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No referral data yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
