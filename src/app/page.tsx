import { Metadata } from 'next';
import Link from 'next/link';
import { Upload, Gift, MapPin, Star } from 'lucide-react';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'DankPass - Earn Points, Get Perks',
  description: 'Upload receipts from dispensaries and restaurants to earn points and redeem amazing perks',
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-brand-primary/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-brand-success/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-brand-warn/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 px-6 pt-16 pb-8">
          {/* Logo/Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Logo size="xl" showText={false} />
            </div>
            <p className="text-lg text-brand-subtle max-w-sm mx-auto">
              Upload receipts, earn points, get perks. The rewards app for dispensaries & restaurants.
            </p>
          </div>

          {/* Main CTA */}
          <div className="text-center mb-12">
            <Link href="/auth/signin" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              <Upload className="w-5 h-5" />
              Get Started
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4 mb-12">
            <div className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-ink">Upload Receipts</h3>
                  <p className="muted">Snap a photo of your dispensary or restaurant receipt</p>
                </div>
              </div>
            </div>

            <div className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-success/10 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-brand-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-ink">Earn Points</h3>
                  <p className="muted">Get points for every dollar spent at partner locations</p>
                </div>
              </div>
            </div>

            <div className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-warn/10 rounded-2xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-brand-warn" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-ink">Redeem Perks</h3>
                  <p className="muted">Use your points for exclusive discounts and rewards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-ink">500+</div>
              <div className="muted">Partners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-ink">10K+</div>
              <div className="muted">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-ink">$50K+</div>
              <div className="muted">Saved</div>
            </div>
          </div>

          {/* Partner Types */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-brand-ink mb-6">Join Our Network</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Link href="/join/dispensary" className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-brand-success mx-auto mb-2" />
                  <h3 className="font-medium text-brand-ink">Dispensary</h3>
                  <p className="muted mt-1">Cannabis retailers</p>
                </div>
              </Link>

              <Link href="/join/restaurant" className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
                <div className="text-center">
                  <Star className="w-8 h-8 text-brand-warn mx-auto mb-2" />
                  <h3 className="font-medium text-brand-ink">Restaurant</h3>
                  <p className="muted mt-1">Food & dining</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
