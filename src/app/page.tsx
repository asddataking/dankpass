'use client';

import Link from 'next/link';
import { Upload, Gift, MapPin, Star, TrendingUp, Sparkles, Crown, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vintage Wallpaper Palm Tree Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='160' viewBox='0 0 120 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 20 L45 140 Q60 150 75 140 L60 20' stroke='%23d1d5db' stroke-width='1.5' fill='none'/%3E%3Cpath d='M60 20 Q35 30 30 50 Q40 40 60 30' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q85 30 90 50 Q80 40 60 30' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q25 40 20 70 Q35 60 60 45' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q95 40 100 70 Q85 60 60 45' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q20 60 15 90 Q30 80 60 65' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q100 60 105 90 Q90 80 60 65' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 160px',
          backgroundPosition: '0 0'
        }}></div>
        
        {/* Offset pattern layer for depth */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='160' viewBox='0 0 120 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 20 L45 140 Q60 150 75 140 L60 20' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q35 30 30 50 Q40 40 60 30' stroke='%23d1d5db' stroke-width='0.8' fill='none'/%3E%3Cpath d='M60 20 Q85 30 90 50 Q80 40 60 30' stroke='%23d1d5db' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 160px',
          backgroundPosition: '60px 80px'
        }}></div>
      </div>
      
      <div className="relative z-10 max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-6 pt-12 pb-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-bold text-brand-ink">DankPass</h2>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/signin" className="text-brand-subtle hover:text-brand-ink transition-colors text-base font-medium">
              Sign In
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-success/20 to-brand-warn/20 text-brand-success px-4 py-2 rounded-full border border-brand-success/30">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">🔥 Earn & Burn Rewards</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary/10 to-brand-primary/20 text-brand-primary px-4 py-2 rounded-full border border-brand-primary/30">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">✨ AI Powered</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-ink mb-4 leading-tight">
            Earn Free Weed
            <br />
            <span className="text-brand-primary">With Every Receipt</span>
          </h1>
          
          <p className="text-brand-subtle text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Upload receipts from dispensaries & restaurants. Earn points. Burn for free weed, discounts & exclusive perks.
          </p>

          {/* CTA Buttons */}
          <div className="space-y-3 md:space-y-4 max-w-md mx-auto">
            <Link href="/auth/signup" className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4">
              Get Started Free
              <TrendingUp className="w-5 h-5" />
            </Link>
            <p className="text-xs text-brand-subtle">
              Already have an account? <Link href="/auth/signin" className="text-brand-primary font-medium">Sign in</Link>
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-ink mb-6 text-center">How to Earn Free Weed in 3 Steps</h2>
          
          <div className="space-y-3 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-ink mb-1">📸 Upload Receipt</h3>
                  <p className="text-sm text-brand-subtle">Snap a photo of your receipt from dispensaries or restaurants</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-success rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-ink mb-1">⚡ Earn Points</h3>
                  <p className="text-sm text-brand-subtle">Get 10 points for every $1 you spend (15 pts for Premium)</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-warn rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-ink mb-1">🔥 Burn Rewards</h3>
                  <p className="text-sm text-brand-subtle">Burn points for free weed, exclusive perks, and VIP discounts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="card mb-12">
          <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-gray-200">
            <div className="text-center px-4">
              <div className="text-2xl font-bold text-brand-primary">500+</div>
              <div className="text-xs text-brand-subtle mt-1">Partners</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl font-bold text-brand-primary">10K+</div>
              <div className="text-xs text-brand-subtle mt-1">Users</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl font-bold text-brand-primary">$50K</div>
              <div className="text-xs text-brand-subtle mt-1">Saved</div>
            </div>
            <div className="text-center px-4 hidden md:block">
              <div className="text-2xl font-bold text-brand-primary">4.9★</div>
              <div className="text-xs text-brand-subtle mt-1">Rating</div>
            </div>
            <div className="text-center px-4 hidden md:block">
              <div className="text-2xl font-bold text-brand-primary">24/7</div>
              <div className="text-xs text-brand-subtle mt-1">Support</div>
            </div>
            <div className="text-center px-4 hidden md:block">
              <div className="text-2xl font-bold text-brand-primary">AI</div>
              <div className="text-xs text-brand-subtle mt-1">Powered</div>
            </div>
          </div>
        </div>

        {/* Referral CTA - Large */}
        <div className="card bg-gradient-to-br from-brand-primary/20 to-brand-success/20 border-brand-primary/30 mb-12 text-center">
          <div className="py-8">
            <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-brand-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-ink mb-4">
              Invite Friends, Earn Together
            </h2>
            <p className="text-lg text-brand-subtle mb-6 max-w-2xl mx-auto">
              Share DankPass with friends and you both get <span className="font-bold text-brand-primary">250 bonus points</span> instantly!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link href="/auth/signup" className="btn-primary flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Join & Get Your Referral Code
              </Link>
              <Link href="/auth/signin" className="btn-ghost flex items-center justify-center gap-2">
                Share Your Code
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-success/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-brand-success" />
                </div>
                <span className="text-brand-subtle">You get 250 pts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-success/20 rounded-full flex items-center justify-center">
                  <Gift className="w-4 h-4 text-brand-success" />
                </div>
                <span className="text-brand-subtle">Friend gets 250 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Premium CTA - Large */}
        <div className="card bg-gradient-to-br from-brand-warn/20 to-brand-primary/20 border-brand-warn/30 mb-12 text-center hover:-translate-y-1 transition-all">
          <div className="py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-warn/30 to-brand-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-brand-primary" />
            </div>
            <div className="inline-flex items-center gap-2 bg-brand-warn/20 text-brand-warn px-4 py-2 rounded-full border border-brand-warn/40 mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">PREMIUM MEMBERSHIP</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-ink mb-4">
              Unlock 1.5x Points & VIP Perks
            </h2>
            <p className="text-lg text-brand-subtle mb-6 max-w-2xl mx-auto">
              Get <span className="font-bold text-brand-primary">50% more points</span> on every upload, unlimited receipts, and exclusive rewards for just <span className="font-bold text-brand-primary">$7/month</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link href="/auth/signup?redirect=/premium" className="btn-primary flex items-center justify-center gap-2">
                <Crown className="w-5 h-5" />
                Start Premium Trial
              </Link>
              <Link href="/premium" className="btn-ghost flex items-center justify-center gap-2">
                Learn More
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-8 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-primary/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-brand-primary" />
                </div>
                <span className="text-brand-subtle">1.5x points</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-success/20 rounded-full flex items-center justify-center">
                  <Upload className="w-4 h-4 text-brand-success" />
                </div>
                <span className="text-brand-subtle">Unlimited uploads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-warn/20 rounded-full flex items-center justify-center">
                  <Gift className="w-4 h-4 text-brand-warn" />
                </div>
                <span className="text-brand-subtle">VIP rewards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Types */}
        <div>
          <h2 className="text-lg md:text-xl font-bold text-brand-ink mb-4 text-center md:text-left">Are you a business?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8 max-w-lg mx-auto md:max-w-none">
            <Link href="/auth/signup?redirect=/join/dispensary" className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
              <div className="text-center py-4">
                <MapPin className="w-8 h-8 text-brand-success mx-auto mb-3" />
                <h3 className="font-semibold text-brand-ink text-base mb-1">Dispensary</h3>
                <p className="text-sm text-brand-subtle">Join our network of cannabis retailers</p>
              </div>
            </Link>

            <Link href="/auth/signup?redirect=/join/restaurant" className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
              <div className="text-center py-4">
                <Star className="w-8 h-8 text-brand-warn mx-auto mb-3" />
                <h3 className="font-semibold text-brand-ink text-base mb-1">Restaurant</h3>
                <p className="text-sm text-brand-subtle">Join our network of food establishments</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-brand-subtle">
            © 2024 DankPass. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
