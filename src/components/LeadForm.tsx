'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
];

export function LeadForm() {
  const [dispensaryName, setDispensaryName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!dispensaryName.trim()) next.dispensaryName = 'Dispensary name is required';
    if (!contactName.trim()) next.contactName = 'Contact name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!state.trim()) next.state = 'State is required';
    else if (!US_STATES.includes(state.toUpperCase())) next.state = 'Enter a valid US state (e.g. CA)';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting' || status === 'success') return;
    if (!validate()) return;
    setStatus('submitting');
    setErrors({});
    // Client-side only: show success after a short delay (no backend)
    setTimeout(() => {
      setStatus('success');
    }, 600);
  }

  if (status === 'success') {
    return (
      <div className="card max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-brand-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-brand-success" aria-hidden />
        </div>
        <h2 className="text-xl font-bold text-brand-ink mb-2">Demo request received</h2>
        <p className="text-brand-subtle text-sm">
          Thanks for your interest. We&apos;ll be in touch shortly to schedule your DankPass demo.
        </p>
      </div>
    );
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-brand-ink mb-6 text-center">
        Book a DankPass Demo
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="dispensary-name" className="block text-sm font-medium text-brand-ink mb-2">
            Dispensary Name <span className="text-brand-error">*</span>
          </label>
          <input
            type="text"
            id="dispensary-name"
            required
            value={dispensaryName}
            onChange={(e) => setDispensaryName(e.target.value)}
            className="input"
            placeholder="Your dispensary name"
            aria-required="true"
            aria-invalid={!!errors.dispensaryName}
            aria-describedby={errors.dispensaryName ? 'err-dispensary' : undefined}
          />
          {errors.dispensaryName && (
            <p id="err-dispensary" className="text-sm text-brand-error mt-1" role="alert">
              {errors.dispensaryName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-brand-ink mb-2">
            Contact Name <span className="text-brand-error">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="input"
            placeholder="Your name"
            aria-required="true"
            aria-invalid={!!errors.contactName}
            aria-describedby={errors.contactName ? 'err-contact' : undefined}
          />
          {errors.contactName && (
            <p id="err-contact" className="text-sm text-brand-error mt-1" role="alert">
              {errors.contactName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-ink mb-2">
            Email <span className="text-brand-error">*</span>
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'err-email' : undefined}
          />
          {errors.email && (
            <p id="err-email" className="text-sm text-brand-error mt-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-brand-ink mb-2">
            Phone <span className="text-brand-subtle text-xs">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
            placeholder="(555) 000-0000"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-brand-ink mb-2">
            State <span className="text-brand-error">*</span>
          </label>
          <input
            type="text"
            id="state"
            required
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
            className="input"
            placeholder="e.g. CA"
            aria-required="true"
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? 'err-state' : undefined}
          />
          {errors.state && (
            <p id="err-state" className="text-sm text-brand-error mt-1" role="alert">
              {errors.state}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary w-full disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Request Demo'}
        </button>
      </form>
    </div>
  );
}
