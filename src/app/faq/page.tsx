'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { APP_ROUTES } from '@/lib/app-config';

export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I earn points?',
      answer: 'Simply upload a photo of your receipt from any dispensary or restaurant partner. You\'ll earn 10 points for every $1 spent. Premium members earn 15 points per dollar (1.5x multiplier).'
    },
    {
      question: 'What can I redeem my points for?',
      answer: 'You can redeem points for free products, discounts, exclusive perks, VIP access, and more at our partner locations. Check the perks section in the app to see all available rewards.'
    },
    {
      question: 'Is there a limit on how many receipts I can upload?',
      answer: 'Free members can upload up to 15 receipts. Premium members ($7/month) get unlimited uploads and earn 1.5x points on every purchase.'
    },
    {
      question: 'How do I refer friends?',
      answer: 'Share your unique referral code with friends. When they sign up using your code, you both get 250 bonus points instantly!'
    },
    {
      question: 'What types of receipts are accepted?',
      answer: 'We accept receipts from dispensaries and restaurants that are part of our partner network. The receipt must be clear and readable for our AI to process it.'
    },
    {
      question: 'How quickly are points awarded?',
      answer: 'Points are awarded instantly after your receipt is processed by our AI system, usually within seconds of upload.'
    },
    {
      question: 'Can I cancel my Premium subscription?',
      answer: 'Yes! You can cancel your Premium subscription at any time. You\'ll continue to have Premium benefits until the end of your billing period.'
    },
    {
      question: 'Do points expire?',
      answer: 'No, your points never expire. You can accumulate and redeem them whenever you\'re ready.'
    }
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-brand-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-ink mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-brand-subtle max-w-2xl mx-auto">
              Everything you need to know about DankPass
            </p>
          </div>

          {/* FAQ List */}
          <div className="max-w-3xl mx-auto space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-brand-ink mb-2">{faq.question}</h3>
                <p className="text-brand-subtle leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-brand-subtle mb-4">Still have questions?</p>
            <Link 
              href={APP_ROUTES.LAUNCH}
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
            >
              Launch DankPass App
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
