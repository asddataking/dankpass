'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CountUp from '@/components/CountUp';
import { CONTACT_ANCHOR } from '@/lib/app-config';

const PLAN_BASE_MONTHLY = 299;
const ENGAGEMENT_MODES = [
  { id: 'conservative', label: 'Conservative', value: 8 },
  { id: 'standard', label: 'Standard', value: 10 },
  { id: 'aggressive', label: 'Aggressive', value: 15 },
] as const;

export function ROICalculator() {
  const [monthlyCustomers, setMonthlyCustomers] = useState(1000);
  const [avgOrderValue, setAvgOrderValue] = useState(45);
  const [repeatLift, setRepeatLift] = useState(10);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [locations, setLocations] = useState(1);
  const [smsOptIn, setSmsOptIn] = useState(60);
  const [engagementMode, setEngagementMode] = useState<'conservative' | 'standard' | 'aggressive'>('standard');

  const effectiveLift = useMemo(() => {
    if (advancedOpen) {
      const mode = ENGAGEMENT_MODES.find((m) => m.id === engagementMode);
      return mode ? mode.value : repeatLift;
    }
    return repeatLift;
  }, [advancedOpen, engagementMode, repeatLift]);

  const { additionalRevenue, roi } = useMemo(() => {
    const revenue =
      monthlyCustomers *
      (effectiveLift / 100) *
      avgOrderValue *
      (smsOptIn / 100) *
      locations;
    const r = revenue > 0 ? revenue / PLAN_BASE_MONTHLY : 0;
    return { additionalRevenue: Math.round(revenue), roi: r };
  }, [monthlyCustomers, effectiveLift, avgOrderValue, smsOptIn, locations]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="card max-w-2xl mx-auto relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-5" aria-hidden>
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='160' viewBox='0 0 120 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 20 L45 140 Q60 150 75 140 L60 20' stroke='%23d1d5db' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '80px 100px',
          }}
        />
      </div>
      <div className="relative">
        <h2 className="text-2xl font-bold text-brand-ink mb-6 text-center">
          See Your Loyalty ROI
        </h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="roi-customers" className="block text-sm font-medium text-brand-ink mb-1">
              Monthly Customers
            </label>
            <input
              id="roi-customers"
              type="number"
              min={1}
              max={100000}
              value={monthlyCustomers}
              onChange={(e) => setMonthlyCustomers(Number(e.target.value) || 0)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="roi-aov" className="block text-sm font-medium text-brand-ink mb-1">
              Average Order Value ($)
            </label>
            <input
              id="roi-aov"
              type="number"
              min={1}
              max={1000}
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(Number(e.target.value) || 0)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="roi-lift" className="block text-sm font-medium text-brand-ink mb-2">
              Repeat Visit Lift % — {effectiveLift}%
            </label>
            <input
              id="roi-lift"
              type="range"
              min={5}
              max={25}
              value={repeatLift}
              onChange={(e) => setRepeatLift(Number(e.target.value))}
              className="w-full h-2 bg-brand-card rounded-lg appearance-none cursor-pointer accent-brand-primary"
              aria-valuenow={repeatLift}
              aria-valuemin={5}
              aria-valuemax={25}
            />
            <div className="flex justify-between text-xs text-brand-subtle mt-1">
              <span>5%</span>
              <span>25%</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:opacity-90"
              aria-expanded={advancedOpen}
            >
              {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Advanced options
            </button>
            {advancedOpen && (
              <div className="mt-4 pl-4 border-l-2 border-brand-primary/20 space-y-4">
                <div>
                  <label htmlFor="roi-locations" className="block text-sm font-medium text-brand-ink mb-1">
                    Number of Locations
                  </label>
                  <input
                    id="roi-locations"
                    type="number"
                    min={1}
                    max={100}
                    value={locations}
                    onChange={(e) => setLocations(Number(e.target.value) || 1)}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="roi-sms" className="block text-sm font-medium text-brand-ink mb-1">
                    SMS Opt-In Rate %
                  </label>
                  <input
                    id="roi-sms"
                    type="number"
                    min={0}
                    max={100}
                    value={smsOptIn}
                    onChange={(e) => setSmsOptIn(Number(e.target.value) || 0)}
                    className="input"
                  />
                </div>
                <div>
                  <span className="block text-sm font-medium text-brand-ink mb-2">Engagement Mode</span>
                  <div className="flex flex-wrap gap-2">
                    {ENGAGEMENT_MODES.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setEngagementMode(m.id);
                          setRepeatLift(m.value);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          engagementMode === m.id
                            ? 'bg-brand-primary text-black'
                            : 'bg-brand-card border border-brand-primary/20 text-brand-ink hover:border-brand-primary/40'
                        }`}
                      >
                        {m.label} ({m.value}%)
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-6 rounded-xl bg-brand-card/80 border border-brand-primary/10">
          <p className="text-brand-subtle text-sm mb-1">Estimated Additional Monthly Revenue</p>
          <p className="text-2xl md:text-3xl font-bold text-brand-primary">
            <CountUp value={additionalRevenue} format={formatCurrency} /> / month
          </p>
          <p className="text-brand-subtle text-sm mt-3">
            Plan starts at $299/month → Estimated ROI:{' '}
            <span className="font-bold text-brand-primary">
              <CountUp value={roi} format={(n) => `${n.toFixed(1)}×`} />
            </span>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href={CONTACT_ANCHOR} className="btn-primary inline-flex items-center justify-center gap-2">
            Book a Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
