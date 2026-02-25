'use client'

import Link from 'next/link'
import { useState } from 'react'

const plans = [
  {
    name: 'Starter',
    price: '£49',
    period: '/month',
    description: 'Perfect for small businesses getting started with AI automation',
    features: [
      'AI Chatbot (up to 1,000 messages/month)',
      'Basic WhatsApp automation',
      'Email support',
      '1 user account',
      'Standard templates',
      'Basic analytics'
    ],
    highlighted: false,
    popular: false
  },
  {
    name: 'Professional',
    price: '£99',
    period: '/month',
    description: 'Ideal for growing businesses seeking advanced automation',
    features: [
      'AI Chatbot (up to 10,000 messages/month)',
      'Advanced WhatsApp & SMS automation',
      'Priority support',
      '5 user accounts',
      'Custom templates',
      'Advanced analytics & reporting',
      'CRM integration',
      'Appointment scheduling'
    ],
    highlighted: true,
    popular: true
  },
  {
    name: 'Enterprise',
    price: '£299',
    period: '/month',
    description: 'For established businesses requiring complete automation solutions',
    features: [
      'AI Chatbot (unlimited messages)',
      'Full omnichannel automation',
      'Dedicated account manager',
      'Unlimited user accounts',
      'Fully custom solutions',
      'Real-time analytics & AI insights',
      'API access',
      'White-label options',
      'Custom integrations',
      'SLA guarantee'
    ],
    highlighted: false,
    popular: false
  }
]

export default function PlansPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  const handlePurchase = (planName: string) => {
    alert(`Redirecting to checkout for ${planName} plan...\n\nThis is a demo. In production, this would integrate with Stripe or another payment processor.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              AI-Assist for SMEs
            </Link>
            <div className="flex gap-4">
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Flexible pricing for businesses of all sizes. Start automating today.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg ${billingPeriod === 'monthly' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors"
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                billingPeriod === 'annual' ? 'transform translate-x-6' : ''
              }`} />
            </button>
            <span className={`text-lg ${billingPeriod === 'annual' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
              Annual
              <span className="ml-2 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border ${
                plan.highlighted
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400'
                  : 'border-gray-200 dark:border-gray-700'
              } p-8 animate-fadeIn`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-4 py-1 rounded-bl-xl rounded-tr-xl">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    {billingPeriod === 'annual' ? `£${Math.round(parseInt(plan.price.slice(1)) * 0.8)}` : plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{plan.period}</span>
                </div>
                {billingPeriod === 'annual' && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Billed annually at £{Math.round(parseInt(plan.price.slice(1)) * 0.8 * 12)}
                  </p>
                )}
              </div>

              <button
                onClick={() => handlePurchase(plan.name)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                }`}
              >
                Get Started
              </button>

              <div className="mt-8">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">What's included:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I change plans later?</h3>
              <p className="text-gray-600 dark:text-gray-400">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-400">We offer a 14-day free trial on all plans. No credit card required to start.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-400">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 dark:text-gray-400">Yes, you can cancel your subscription at any time with no cancellation fees.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Our team is here to help you choose the right plan</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/support"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Contact Support
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © 2026 AI-Assist for SMEs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
