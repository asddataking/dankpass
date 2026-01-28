'use client';

import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  Mail,
  QrCode,
  Database,
  Users,
  Store,
  ArrowRight,
  Zap,
  Gift,
} from 'lucide-react';
import { ECOSYSTEM_LINKS, CONTACT_ANCHOR } from '@/lib/app-config';
import { ROICalculator } from '@/components/ROICalculator';
import { LeadForm } from '@/components/LeadForm';

const PALM_BG = {
  main: `url("data:image/svg+xml,%3Csvg width='120' height='160' viewBox='0 0 120 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 20 L45 140 Q60 150 75 140 L60 20' stroke='%23d1d5db' stroke-width='1.5' fill='none'/%3E%3Cpath d='M60 20 Q35 30 30 50 Q40 40 60 30' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q85 30 90 50 Q80 40 60 30' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q25 40 20 70 Q35 60 60 45' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q95 40 100 70 Q85 60 60 45' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q20 60 15 90 Q30 80 60 65' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q100 60 105 90 Q90 80 60 65' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
  offset: `url("data:image/svg+xml,%3Csvg width='120' height='160' viewBox='0 0 120 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 20 L45 140 Q60 150 75 140 L60 20' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3Cpath d='M60 20 Q35 30 30 50 Q40 40 60 30' stroke='%23d1d5db' stroke-width='0.8' fill='none'/%3E%3Cpath d='M60 20 Q85 30 90 50 Q80 40 60 30' stroke='%23d1d5db' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
};

const PRODUCT_BENEFITS = [
  { icon: Store, text: 'White-labeled per dispensary' },
  { icon: Mail, text: 'Automated SMS & email campaigns' },
  { icon: QrCode, text: 'QR code signup at checkout' },
  { icon: Database, text: 'Own your customer data' },
  { icon: Users, text: 'No staff training required' },
  { icon: Zap, text: 'Built for dispensaries (not generic retail)' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden>
        <div
          className="w-full h-full"
          style={{
            backgroundImage: PALM_BG.main,
            backgroundRepeat: 'repeat',
            backgroundSize: '120px 160px',
            backgroundPosition: '0 0',
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: PALM_BG.offset,
            backgroundRepeat: 'repeat',
            backgroundSize: '120px 160px',
            backgroundPosition: '60px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-24">
        {/* Hero */}
        <section className="text-center mb-20 sm:mb-28">
          <div className="inline-flex items-center gap-2 bg-brand-success/20 text-brand-success px-4 py-2 rounded-full border border-brand-success/30 mb-6">
            <Sparkles className="w-4 h-4" aria-hidden />
            <span className="text-sm font-medium">Earn & Burn</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            <span className="headline-primary">Earn & Burn</span>
            <br />
            <span className="text-brand-primary">Modern Loyalty for Dispensaries</span>
          </h1>
          <p className="text-brand-subtle text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Replace punch cards with automated rewards powered by SMS, email, and real customer data.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-brand-ink font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-success shrink-0" aria-hidden />
              No punch cards
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-success shrink-0" aria-hidden />
              No app downloads
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-success shrink-0" aria-hidden />
              Own your customer list
            </li>
          </ul>
          <Link
            href={CONTACT_ANCHOR}
            className="btn-primary inline-flex items-center justify-center gap-2 text-lg py-4 px-8"
          >
            Book a Demo
          </Link>
          <p className="text-sm text-brand-subtle mt-4">
            Starts at $299/month · One-time setup fee: $799
          </p>
        </section>

        {/* Product Value */}
        <section id="product" className="scroll-mt-24 mb-20 sm:mb-28">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-ink mb-4 text-center">
            Your Brand. Your Rewards. One System.
          </h2>
          <p className="text-brand-subtle text-lg text-center max-w-2xl mx-auto mb-10">
            DankPass is a white-labeled loyalty engine designed specifically for dispensaries.
            It helps you increase repeat visits, grow customer lifetime value, and automate retention.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCT_BENEFITS.map(({ icon: Icon, text }) => (
              <div key={text} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-primary" aria-hidden />
                  </div>
                  <p className="font-medium text-brand-ink">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="scroll-mt-24 mb-20 sm:mb-28">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-ink mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: 1, title: 'Customer shops', desc: 'They visit and make a purchase.' },
              { n: 2, title: 'Points are earned automatically', desc: 'No punch cards, no extra steps.' },
              { n: 3, title: 'SMS rewards bring them back', desc: 'Automated messages drive repeat visits.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="card text-center">
                <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {n}
                </div>
                <h3 className="font-semibold text-brand-ink mb-2">{title}</h3>
                <p className="text-sm text-brand-subtle">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ecosystem - Daily Dispo Deals */}
        <section id="ecosystem" className="scroll-mt-24 mb-20 sm:mb-28">
          <div className="card bg-gradient-to-br from-brand-primary/5 to-brand-success/5 border-brand-primary/20 relative">
            <span className="absolute top-4 right-4 bg-brand-warn/20 text-brand-warn px-3 py-1 rounded-full text-xs font-semibold">
              Optional Add-On
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-ink mb-4 text-center pr-24">
              Loyalty That Connects to Real Deal Demand
            </h2>
            <p className="text-brand-subtle text-center max-w-2xl mx-auto mb-8">
              DankPass helps you retain customers you already have. Daily Dispo Deals helps new customers discover your offers.
              Together, they create a simple loop: Discover → Visit → Earn & Burn → Repeat.
            </p>
            <p className="text-brand-subtle text-center text-sm mb-6 max-w-2xl mx-auto">
              Use DankPass as your dispensary loyalty program, and optionally pair it with deal discovery through Daily Dispo Deals.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { title: 'Discover', desc: 'Get found through DailyDispoDeals.com (optional)', icon: Zap },
                { title: 'Convert', desc: 'Turn deal shoppers into loyalty members with QR signup', icon: QrCode },
                { title: 'Retain', desc: 'Automated Earn & Burn rewards bring them back', icon: Gift },
              ].map(({ title, desc, icon: Icon }) => (
                <div key={title} className="bg-brand-card/50 rounded-xl p-4 border border-brand-primary/10">
                  <Icon className="w-8 h-8 text-brand-primary mb-2" aria-hidden />
                  <h3 className="font-semibold text-brand-ink mb-2">{title}</h3>
                  <p className="text-sm text-brand-subtle">{desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-4">
              <a
                href={ECOSYSTEM_LINKS.DAILY_DISPODEALS}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2"
              >
                See Daily Dispo Deals
                <ArrowRight className="w-4 h-4" aria-hidden />
              </a>
              <p className="text-xs text-brand-subtle text-center">
                Daily Dispo Deals is a separate product. DankPass works standalone.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 mb-20 sm:mb-28">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-ink mb-8 text-center">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'Starter',
                price: 299,
                popular: false,
                features: [
                  'Earn & Burn™ loyalty system',
                  'SMS + email rewards',
                  'QR code signup',
                  'Customer profiles & points tracking',
                  'Basic analytics',
                ],
              },
              {
                name: 'Growth',
                price: 499,
                popular: true,
                features: [
                  'Everything in Starter',
                  'Advanced automations',
                  'Re-engagement & win-back campaigns',
                  'Birthday & milestone rewards',
                  'White-label branding',
                ],
              },
              {
                name: 'Network',
                price: 799,
                popular: false,
                features: [
                  'Everything in Growth',
                  'Multi-location support',
                  'Priority support',
                  'Advanced analytics',
                  'Optional DankPass Network exposure',
                ],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`card ${tier.popular ? 'ring-2 ring-brand-primary' : ''}`}
              >
                {tier.popular && (
                  <p className="text-xs font-semibold text-brand-primary mb-2">Most Popular</p>
                )}
                <h3 className="text-xl font-bold text-brand-ink mb-1">{tier.name}</h3>
                <p className="text-2xl font-bold text-brand-primary mb-4">
                  ${tier.price}
                  <span className="text-base font-normal text-brand-subtle"> / month</span>
                </p>
                <ul className="space-y-2 text-sm text-brand-subtle">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0 mt-0.5" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-brand-subtle text-center mb-2">
            One-time setup fee: $799
          </p>
          <p className="text-xs text-brand-subtle text-center">
            Built for licensed dispensaries only.
          </p>
        </section>

        {/* ROI Calculator */}
        <section id="roi" className="scroll-mt-24 mb-20 sm:mb-28">
          <ROICalculator />
        </section>

        {/* Lead Form */}
        <section id="contact" className="scroll-mt-24">
          <LeadForm />
        </section>
      </div>
    </div>
  );
}

