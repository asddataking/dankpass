'use client';

import { motion } from 'framer-motion';
import { Upload, Crown, TrendingUp, Receipt, Gift } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@stackframe/stack';

export default function DashboardPage() {
  const user = useUser();
  
  // Mock data - in real app, this would come from the database
  const userStats = {
    points: 1250,
    tier: 'Gold',
    premium: false,
    totalSaved: 89.50,
    receiptsUploaded: 12,
    perksRedeemed: 3
  };

  const recentOffers = [
    {
      id: 1,
      partner: 'Green Valley Dispensary',
      title: '20% off edibles',
      pointsCost: 500,
      expiresAt: '2024-01-15'
    },
    {
      id: 2,
      partner: 'Pizza Palace',
      title: 'Free appetizer',
      pointsCost: 300,
      expiresAt: '2024-01-20'
    }
  ];

  const recentReceipts = [
    {
      id: 1,
      partner: 'Green Valley Dispensary',
      amount: 45.00,
      points: 90,
      status: 'approved',
      date: '2024-01-10'
    },
    {
      id: 2,
      partner: 'Pizza Palace',
      amount: 28.50,
      points: 57,
      status: 'pending',
      date: '2024-01-12'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back{user?.displayName ? `, ${user.displayName}` : ''}!
              </h1>
              <p className="text-white/70">Ready to earn some points?</p>
            </div>
            {!userStats.premium && (
              <Link href="/premium" className="btn-secondary flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Go Premium
              </Link>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dp-blue-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-dp-blue-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{userStats.points.toLocaleString()}</div>
                  <div className="text-xs text-white/60">Points</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dp-mint/20 rounded-xl flex items-center justify-center">
                  <Gift className="w-5 h-5 text-dp-mint" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{userStats.tier}</div>
                  <div className="text-xs text-white/60">Tier</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Ring */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Today&apos;s Progress</h3>
            <div className="flex items-center justify-center">
              <div className="activity-ring">
                <svg viewBox="0 0 100 100">
                  <circle
                    className="background"
                    cx="50"
                    cy="50"
                    r="45"
                  />
                  <circle
                    className="progress"
                    cx="50"
                    cy="50"
                    r="45"
                    strokeDashoffset={283 - (283 * 0.75)} // 75% progress
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">75%</div>
                    <div className="text-xs text-white/60">Goal</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-white/70 mt-4">
              Earn {userStats.points} more points to reach your daily goal!
            </p>
          </div>

          {/* Quick Action */}
          <Link href="/upload" className="btn-primary w-full flex items-center justify-center gap-2 mb-6">
            <Upload className="w-5 h-5" />
            Upload Receipt
          </Link>

          {/* Recent Offers */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Available Offers</h3>
            <div className="space-y-3">
              {recentOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  className="card hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{offer.title}</h4>
                      <p className="text-sm text-white/70">{offer.partner}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-dp-blue-300">{offer.pointsCost} pts</div>
                      <div className="text-xs text-white/60">Expires {offer.expiresAt}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Receipts */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Receipts</h3>
            <div className="space-y-3">
              {recentReceipts.map((receipt) => (
                <motion.div
                  key={receipt.id}
                  className="card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{receipt.partner}</h4>
                      <p className="text-sm text-white/70">${receipt.amount} • {receipt.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-dp-mint">+{receipt.points} pts</div>
                      <div className={`text-xs ${
                        receipt.status === 'approved' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {receipt.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
