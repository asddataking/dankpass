'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Gift, TrendingUp, Zap, Users, Star, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/Logo';

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('🎉 You\'re on the list! We\'ll notify you when we launch.');
        setFormData({ name: '', email: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  const perks = [
    {
      icon: Gift,
      title: 'Exclusive Rewards',
      description: 'Earn points on every purchase and redeem for amazing perks at your favorite dispensaries and restaurants.'
    },
    {
      icon: TrendingUp,
      title: 'Build Your Tier',
      description: 'Level up from Bronze to Gold and unlock better rewards, bigger discounts, and exclusive offers.'
    },
    {
      icon: Zap,
      title: 'Instant Tracking',
      description: 'Simply snap a photo of your receipt and watch your points add up automatically.'
    },
    {
      icon: Star,
      title: 'VIP Access',
      description: 'Get early access to new products, special events, and limited-time offers from partner locations.'
    }
  ];

  const stats = [
    { label: 'Partner Locations', value: '500+' },
    { label: 'Active Users', value: '50K+' },
    { label: 'Points Earned', value: '2M+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-brand-bg to-brand-success/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-success/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-16"
          >
            <Logo size="lg" showText={true} />
            <a
              href="/auth/signup"
              className="text-brand-subtle hover:text-brand-ink transition-colors font-medium"
            >
              Sign Up
            </a>
          </motion.div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Join the Waitlist</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-brand-ink mb-6 leading-tight">
                Turn Every Receipt Into{' '}
                <span className="text-brand-primary">Rewards</span>
              </h1>

              <p className="text-xl text-brand-subtle mb-8 leading-relaxed">
                Upload receipts from your favorite dispensaries and restaurants, earn points automatically, and unlock exclusive perks. It's that simple.
              </p>

              {/* Stats */}
              <div className="flex gap-8 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-3xl font-bold text-brand-primary">{stat.value}</div>
                    <div className="text-sm text-brand-subtle">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-success border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-warn text-brand-warn" />
                    ))}
                  </div>
                  <p className="text-sm text-brand-subtle mt-0.5">Loved by 50,000+ users</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card max-w-md mx-auto lg:mx-0">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-brand-ink mb-2">
                    Get Early Access
                  </h2>
                  <p className="muted">
                    Join the waitlist and be the first to start earning rewards
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-ink mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="input"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-ink mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="input"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={status === 'loading'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      'Joining...'
                    ) : (
                      <>
                        Join the Waitlist
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl text-sm ${
                        status === 'success'
                          ? 'bg-brand-success/10 text-brand-success'
                          : 'bg-brand-error/10 text-brand-error'
                      }`}
                    >
                      {message}
                    </motion.div>
                  )}
                </form>

                <p className="text-xs text-brand-subtle text-center mt-4">
                  By signing up, you agree to receive updates about DankPass
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Perks Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-brand-ink mb-4">
            Why Join DankPass?
          </h2>
          <p className="text-xl text-brand-subtle max-w-2xl mx-auto">
            We make it easy to get more from every purchase
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, index) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all"
              >
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-brand-ink mb-2">
                  {perk.title}
                </h3>
                <p className="muted">
                  {perk.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-brand-primary/5 to-brand-success/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-brand-ink mb-4">
              How It Works
            </h2>
            <p className="text-xl text-brand-subtle">
              Start earning in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Receipt', desc: 'Take a photo of your receipt from any partner location' },
              { step: '02', title: 'Earn Points', desc: 'We automatically verify and add points to your account' },
              { step: '03', title: 'Redeem Perks', desc: 'Use your points for discounts, freebies, and exclusive offers' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-brand-ink mb-2">
                  {item.title}
                </h3>
                <p className="muted">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card bg-gradient-to-r from-brand-primary/10 to-brand-success/10 text-center"
        >
          <Users className="w-16 h-16 text-brand-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-brand-ink mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-brand-subtle mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already turning their everyday purchases into valuable rewards.
          </p>
          <a href="#top" className="btn-primary inline-flex items-center gap-2">
            Join the Waitlist
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo size="md" showText={true} />
            <p className="text-sm text-brand-subtle">
              © 2024 DankPass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

