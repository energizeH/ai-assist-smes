'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LegalFooter from '../components/LegalFooter'

const plans = [
  {
    name: 'Starter',
    price: '£49',
    annualPrice: '£39',
    annualSaving: '£120',
    period: '/month',
    description: 'Perfect for small businesses getting started with AI automation',
    features: [
      'AI Chatbot (up to 1,000 messages/month)',
      'Basic WhatsApp automation',
      'Email support',
      '3 user accounts',
      'Standard templates',
      'Basic analytics'
    ],
    highlighted: false,
    popular: false
  },
  {
    name: 'Professional',
    price: '£149',
    annualPrice: '£119',
    annualSaving: '£360',
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
    annualPrice: '£239',
    annualSaving: '£720',
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
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">AI-Assist for SMEs</Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-[#94a3b8] hover:text-white transition">Home</Link>
              <Link href="/about" className="text-[#94a3b8] hover:text-white transition">About</Link>
              <Link href="/services" className="text-[#94a3b8] hover:text-white transition">Services</Link>
              <Link href="/plans" className="text-white font-semibold transition">Pricing</Link>
              <Link href="/contact" className="text-[#94a3b8] hover:text-white transition">Contact</Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="px-4 py-2 text-[#94a3b8] hover:text-white font-medium transition">Sign In</Link>
              <Link href="/register" className="btn btn-primary text-sm">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="section-gradient relative py-20 overflow-hidden">
        <div className="orb orb-blue w-96 h-96 -top-48 -left-48" />
        <div className="orb orb-violet w-72 h-72 -bottom-36 -right-36" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Choose Your Perfect Plan</span>
          </h1>
          <p className="text-xl text-[#94a3b8]">Flexible pricing for businesses of all sizes. Start automating today.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Error */}
          {error && (
            <div className="max-w-md mx-auto mb-8 glass-card border-red-500/30 text-red-400 px-4 py-3 text-center">
              {error}
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'btn btn-primary'
                  : 'glass-card-static text-[#94a3b8] hover:text-white cursor-pointer'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                billingPeriod === 'annual'
                  ? 'btn btn-primary'
                  : 'glass-card-static text-[#94a3b8] hover:text-white cursor-pointer'
              }`}
            >
              Annual
            </button>
            {billingPeriod === 'annual' && (
              <span className="bg-[#10b981]/20 text-[#10b981] text-xs font-semibold px-3 py-1 rounded-full">Save 20%</span>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 animate-fadeIn stagger-${i + 1} ${
                  plan.highlighted
                    ? 'glass-card-strong scale-105 ring-2 ring-[#3b82f6]/50'
                    : 'glass-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg" style={{ background: 'var(--gradient-cta)' }}>MOST POPULAR</span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-[#f1f5f9] mb-2">{plan.name}</h3>
                <p className="text-sm mb-6 text-[#94a3b8]">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold gradient-text">
                      {billingPeriod === 'annual' ? plan.annualPrice : plan.price}
                    </span>
                    <span className="text-sm text-[#94a3b8]">{plan.period}</span>
                  </div>
                  {billingPeriod === 'annual' && (
                    <div className="mt-2">
                      <span className="line-through text-sm mr-2 text-[#64748b]">{plan.price}/month</span>
                      <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981]">
                        Save {plan.annualSaving}/year
                      </span>
                    </div>
                  )}
                </div>

                {plan.name === 'Enterprise' ? (
                  <Link
                    href="/contact"
                    className={`block w-full py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 mb-8 text-center btn btn-outline`}
                  >
                    Book a Demo
                  </Link>
                ) : (
                  <button
                    onClick={() => handlePurchase(plan)}
                    disabled={loading === plan.name}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed mb-8 ${
                      plan.highlighted
                        ? 'btn btn-primary'
                        : 'btn btn-outline'
                    }`}
                  >
                    {loading === plan.name ? 'Redirecting to checkout...' : 'Start Free Trial'}
                  </button>
                )}

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-[#94a3b8]">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[#10b981]/20 text-[#10b981]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8"><span className="gradient-text">Frequently Asked Questions</span></h2>
            <div className="space-y-6">
              {[
                { q: 'Can I change plans later?', a: 'Yes! You can upgrade or downgrade your plan at any time from your billing settings. Changes take effect immediately.' },
                { q: 'Is there a free trial?', a: 'We offer a 14-day free trial on all plans. No credit card required to start.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards via Stripe. Bank transfers are available for annual enterprise plans.' },
                { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time with no cancellation fees. Access continues until the end of your billing period.' },
                { q: 'What happens when my free trial ends?', a: 'After your 14-day trial, you\'ll be asked to choose a plan and enter payment details. You won\'t be charged automatically — we\'ll remind you before your trial ends.' }
              ].map((faq, i) => (
                <div key={i} className={`glass-card p-6 animate-fadeIn stagger-${i + 1}`}>
                  <h3 className="font-semibold text-[#f1f5f9] mb-2">{faq.q}</h3>
                  <p className="text-[#94a3b8] text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LegalFooter />
    </div>
  )
}
