'use client';

import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaLink: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for individual learners getting started',
    features: [
      'Access to assigned courses',
      'Sequential learning paths',
      'Progress tracking',
      'Course completion certificates',
      'Mobile-friendly access',
      'Email support',
    ],
    cta: 'Get Started Free',
    ctaLink: '/register',
  },
  {
    name: 'Professional',
    price: '$29',
    period: 'per month',
    description: 'Best for mentors and small teams',
    features: [
      'Everything in Starter',
      'Unlimited course creation',
      'Advanced analytics dashboard',
      'Custom branding',
      'Priority support',
      'Video hosting (10GB)',
      'Team collaboration',
      'Export reports',
    ],
    highlighted: true,
    cta: 'Start Free Trial',
    ctaLink: '/register?plan=pro',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'per organization',
    description: 'For organizations with advanced needs',
    features: [
      'Everything in Professional',
      'Unlimited video storage',
      'SSO / SAML integration',
      'Advanced security features',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`
                relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2
                ${tier.highlighted
                  ? 'bg-gradient-to-b from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-500/30 scale-105 z-10'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className={`text-xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {tier.name}
              </h3>
              <p className={`text-sm mb-6 ${tier.highlighted ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                {tier.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className={`text-5xl font-bold ${tier.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {tier.price}
                </span>
                {tier.price !== 'Custom' && (
                  <span className={`text-sm ml-2 ${tier.highlighted ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                    /{tier.period}
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href={tier.ctaLink}
                className={`
                  block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300
                  ${tier.highlighted
                    ? 'bg-white text-indigo-600 hover:bg-gray-100 shadow-lg'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg shadow-indigo-500/25'
                  }
                `}
              >
                {tier.cta}
              </Link>

              {/* Features */}
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tier.highlighted 
                        ? 'bg-white/20' 
                        : 'bg-indigo-100 dark:bg-indigo-900/30'
                    }`}>
                      <Check className={`w-3 h-3 ${tier.highlighted ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                    </div>
                    <span className={`text-sm ${tier.highlighted ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-6 py-3 rounded-full border border-emerald-200 dark:border-emerald-800">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">
              30-day money-back guarantee on all paid plans
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
