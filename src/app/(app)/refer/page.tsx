'use client';

import { motion } from 'framer-motion';
import { Copy, Share2, Check, Users, TrendingUp, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';

interface ReferralStats {
  code: string;
  shareUrl: string;
  totalReferrals: number;
  pointsEarned: number;
  recentReferrals: Array<{
    id: string;
    referredUserName: string;
    status: string;
    points: number;
    createdAt: string;
  }>;
}

export default function ReferPage() {
  const user = useUser();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadReferralData() {
      try {
        // Get referral code and basic info
        const codeResponse = await fetch('/api/referrals/my-code');
        const codeData = await codeResponse.json();

        // Get referral stats
        const statsResponse = await fetch('/api/referrals/stats');
        const statsData = await statsResponse.json();

        setStats({
          code: codeData.code,
          shareUrl: codeData.shareUrl,
          totalReferrals: statsData.totalReferrals,
          pointsEarned: statsData.pointsEarned,
          recentReferrals: statsData.recentReferrals || [],
        });
      } catch (error) {
        console.error('Error loading referral data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadReferralData();
    }
  }, [user]);

  const handleCopyCode = () => {
    if (stats?.code) {
      navigator.clipboard.writeText(stats.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (stats?.shareUrl) {
      navigator.clipboard.writeText(stats.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!stats?.shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join DankPass!',
          text: `Join me on DankPass and earn 250 bonus points! Use my referral code: ${stats.code}`,
          url: stats.shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-brand-subtle">Loading referral info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-brand-success to-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Gift className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-brand-ink mb-2">Refer & Earn</h1>
            <p className="text-brand-subtle max-w-md mx-auto">
              Invite friends to DankPass and you both earn 250 bonus points!
            </p>
          </div>

          {/* Referral Code Card */}
          <div className="card mb-6 bg-gradient-to-br from-brand-primary/5 to-brand-success/5 border-brand-primary/20">
            <div className="text-center mb-4">
              <p className="text-sm text-brand-subtle mb-2">Your Referral Code</p>
              <div className="bg-white rounded-xl p-4 mb-4">
                <p className="text-2xl font-bold text-brand-ink tracking-wider">
                  {stats?.code || 'Loading...'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <button
                  onClick={handleShare}
                  className="btn-ghost flex-1 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            <div className="border-t border-brand-ink/10 pt-4">
              <p className="text-xs text-brand-subtle mb-2">Share Link:</p>
              <div className="bg-white rounded-lg p-3 flex items-center gap-2">
                <input
                  type="text"
                  value={stats?.shareUrl || ''}
                  readOnly
                  className="flex-1 text-sm text-brand-ink bg-transparent border-none outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-brand-ink mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-primary font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-brand-ink mb-1">Share Your Code</h4>
                  <p className="text-sm text-brand-subtle">Send your referral link to friends via text, email, or social media</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-brand-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-success font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-brand-ink mb-1">They Sign Up</h4>
                  <p className="text-sm text-brand-subtle">Your friend creates an account using your referral code</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-brand-warn/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-warn font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-brand-ink mb-1">You Both Earn!</h4>
                  <p className="text-sm text-brand-subtle">You each get 250 bonus points instantly added to your accounts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card text-center">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-brand-primary" />
              </div>
              <div className="text-2xl font-bold text-brand-ink">{stats?.totalReferrals || 0}</div>
              <div className="text-sm text-brand-subtle">Total Referrals</div>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-brand-success/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-brand-success" />
              </div>
              <div className="text-2xl font-bold text-brand-ink">{stats?.pointsEarned || 0}</div>
              <div className="text-sm text-brand-subtle">Points Earned</div>
            </div>
          </div>

          {/* Recent Referrals */}
          {stats && stats.recentReferrals.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-brand-ink mb-4">Recent Referrals</h3>
              <div className="space-y-3">
                {stats.recentReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-3 bg-brand-bg rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-ink">{referral.referredUserName}</p>
                        <p className="text-xs text-brand-subtle">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-brand-success">+{referral.points} pts</p>
                      <p className="text-xs text-brand-subtle capitalize">{referral.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats && stats.recentReferrals.length === 0 && (
            <div className="card text-center py-8">
              <Users className="w-12 h-12 text-brand-subtle mx-auto mb-3" />
              <p className="text-brand-subtle mb-2">No referrals yet</p>
              <p className="text-sm text-brand-subtle">Share your code to start earning!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

