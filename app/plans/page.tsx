'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Starter',
    price: '£49',
    annualPrice: '£39',
    period: '/month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
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
    annualPrice: '£79',
    period: '/month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
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
    annualPrice: '£239',
    period: '/month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE,
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
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handlePurchase = async (plan: typeof plans[0]) => {
    setLoading(plan.name)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName: plan.name, billingPeriod })
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login?redirect=/plans')
          return
        }
        throw new Error(data.error || 'Failed to create checkout session')
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">AI-Assist for SMEs</Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm font-medium">Sign In</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Perfect Plan</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Flexible pricing for businesses of all sizes. Start automating today.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            className={`relative w-14 h-8 rounded-full transition-colors ${billingPeriod === 'annual' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm font-medium ${billingPeriod === 'annual' ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Annual</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Save 20%</span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-blue-600 to-purple-700 text-white shadow-2xl scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">MOST POPULAR</span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold">
                  {billingPeriod === 'annual' ? plan.annualPrice : plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{plan.period}</span>
                {billingPeriod === 'annual' && (
                  <p className={`text-xs mt-1 ${plan.highlighted ? 'text-blue-200' : 'text-gray-400'}`}>
                    Billed annually — save 20%
                  </p>
                )}
              </div>

              <button
                onClick={() => handlePurchase(plan)}
                disabled={loading === plan.name}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed mb-8 ${
                  plan.highlighted
                    ? 'bg-white text-blue-700 hover:bg-gray-50 shadow-lg'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                }`}
              >
                {loading === plan.name ? 'Redirecting to checkout...' : 'Get Started'}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlighted ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600'
                    }`}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Can I change plans later?', a: 'Yes! You can upgrade or downgrade your plan at any time from your billing settings. Changes take effect immediately.' },
              { q: 'Is there a free trial?', a: 'We offer a 14-day free trial on all plans. No credit card required to start.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards via Stripe. Bank transfers are available for annual enterprise plans.' },
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time with no cancellation fees. Access continues until the end of your billing period.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2026 AI-Assist for SMEs. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
