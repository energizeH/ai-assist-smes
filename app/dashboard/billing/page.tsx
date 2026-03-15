'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import DashboardLayout from '../../components/DashboardLayout'

interface Subscription {
  id: string
  status: string
  plan: string
  stripe_customer_id: string
  stripe_subscription_id: string
  current_period_start: string
  current_period_end: string
}

const planDetails: Record<string, { name: string; price: string; features: string[] }> = {
  starter: {
    name: 'Starter',
    price: '£49/month',
    features: ['1,000 AI messages/month', 'Basic WhatsApp automation', 'Email support', '1 user account'],
  },
  professional: {
    name: 'Professional',
    price: '£149/month',
    features: ['10,000 AI messages/month', 'Advanced automation', 'Priority support', '5 user accounts', 'CRM integration'],
  },
  enterprise: {
    name: 'Enterprise',
    price: '£299/month',
    features: ['Unlimited AI messages', 'Full omnichannel automation', 'Dedicated account manager', 'Unlimited users', 'API access'],
  },
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => { fetchSubscription() }, [])

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error: err } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (err && err.code !== 'PGRST116') throw err
      setSubscription(data)
    } catch (err: any) {
      console.error('Billing error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setPortalLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/customer-portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to open billing portal')
      if (data.url) window.location.href = data.url
    } catch (err: any) {
      setError(err.message)
    } finally {
      setPortalLoading(false)
    }
  }

  const plan = subscription ? planDetails[subscription.plan] || null : null

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500', dot: true }
      case 'past_due':
        return { label: 'Payment Overdue', color: 'text-[#fb7185]', bg: 'bg-[#f43f5e]', dot: true }
      case 'cancelled':
        return { label: 'Cancelled', color: 'text-[#94a3b8]', bg: 'bg-[#64748b]', dot: false }
      case 'trialing':
        return { label: 'Trial', color: 'text-[#60a5fa]', bg: 'bg-[#3b82f6]', dot: true }
      default:
        return { label: status, color: 'text-[#94a3b8]', bg: 'bg-[#64748b]', dot: false }
    }
  }

  return (
    <DashboardLayout title="Billing & Subscription" subtitle="Manage your plan and payment methods">
      {error && <div className="mb-4 bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#fb7185] px-4 py-3 rounded-lg">{error}</div>}

      {/* Past due warning banner */}
      {subscription?.status === 'past_due' && (
        <div className="mb-6 bg-[#f43f5e]/10 border border-[#f43f5e]/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[#f43f5e] text-xl">⚠</span>
            <div>
              <p className="text-sm font-medium text-[#fb7185]">Your payment is overdue</p>
              <p className="text-xs text-[#f43f5e]/70 mt-0.5">Please update your payment method to avoid losing access to your features.</p>
            </div>
          </div>
          <button onClick={handleManageBilling} disabled={portalLoading}
            className="px-4 py-2 bg-[#f43f5e] text-white rounded-lg text-sm font-medium hover:bg-[#e11d48] transition-colors whitespace-nowrap flex-shrink-0 disabled:opacity-50">
            {portalLoading ? 'Opening...' : 'Update Payment'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#94a3b8]">Loading billing information...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <div className="glass-card-static overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge-info uppercase font-bold">
                    Current Plan
                  </span>
                  {subscription && (() => {
                    const status = getStatusDisplay(subscription.status)
                    return (
                      <span className={`flex items-center ${status.color} text-sm font-medium`}>
                        {status.dot && <span className={`w-2 h-2 ${status.bg} rounded-full mr-2`} />}
                        {status.label}
                      </span>
                    )
                  })()}
                </div>
                <h2 className="text-3xl font-bold text-[#f1f5f9] mb-1">
                  {plan?.name || 'No Active Plan'}
                </h2>
                {plan && <p className="text-xl text-[#60a5fa] font-semibold">{plan.price}</p>}
                {subscription && (
                  <p className="text-sm text-[#94a3b8] mt-2">
                    {subscription.status === 'cancelled'
                      ? `Access until: ${new Date(subscription.current_period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                      : `Next billing date: ${new Date(subscription.current_period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                    }
                  </p>
                )}
              </div>

              {/* Plan Features */}
              {plan && (
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3">Plan Includes:</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-[#94a3b8]">
                        <span className="w-5 h-5 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="p-6 bg-white/5 flex flex-col sm:flex-row gap-3">
                {subscription && subscription.status !== 'cancelled' ? (
                  <button onClick={handleManageBilling} disabled={portalLoading}
                    className="px-6 py-2.5 border border-white/10 rounded-lg text-sm font-medium text-[#94a3b8] hover:bg-white/5 transition-colors disabled:opacity-50">
                    {portalLoading ? 'Opening...' : 'Manage Billing'}
                  </button>
                ) : (
                  <Link href="/plans"
                    className="btn btn-primary px-6 py-2.5 text-center">
                    {subscription?.status === 'cancelled' ? 'Resubscribe' : 'Choose a Plan'}
                  </Link>
                )}
                <Link href="/plans"
                  className="px-6 py-2.5 border border-white/10 rounded-lg text-sm font-medium text-[#94a3b8] hover:bg-white/5 transition-colors text-center">
                  View All Plans
                </Link>
              </div>
            </div>

            {/* Payment Security */}
            <div className="glass-card-static p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔒</span>
                <h3 className="text-lg font-semibold text-[#f1f5f9]">Secure Payments</h3>
              </div>
              <p className="text-sm text-[#94a3b8]">
                All payments are processed securely through Stripe. We never store your card details.
                You can manage your payment methods, view invoices, and update your subscription through the Stripe customer portal.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {!subscription && (
              <div className="glass-card-strong p-6 sticky top-24 bg-gradient-to-br from-[#3b82f6]/20 to-[#7c3aed]/20 border-[#3b82f6]/30">
                <span className="text-3xl mb-3 block">⚡</span>
                <h3 className="text-xl font-bold text-[#f1f5f9] mb-2">Get Started</h3>
                <p className="text-[#94a3b8] text-sm mb-4">
                  Subscribe to a plan to unlock the full power of AI automation for your business.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  {['AI Receptionist', 'Lead Capture', 'Appointment Scheduling', 'WhatsApp Automation'].map((f, i) => (
                    <li key={i} className="flex items-center text-[#f1f5f9]">
                      <span className="mr-2 text-emerald-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/plans" className="block w-full py-3 btn btn-primary text-center font-bold">
                  View Plans
                </Link>
              </div>
            )}

            {subscription && (
              <div className="glass-card-static p-6 sticky top-24">
                <h3 className="font-semibold text-[#f1f5f9] mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-[#94a3b8]">
                    Questions about your billing or subscription? Contact our support team.
                  </p>
                  <Link href="/support" className="block text-[#60a5fa] hover:underline">
                    Contact Support →
                  </Link>
                  <Link href="/plans" className="block text-[#60a5fa] hover:underline">
                    Compare Plans →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
