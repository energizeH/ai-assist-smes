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

  return (
    <DashboardLayout title="Billing & Subscription" subtitle="Manage your plan and payment methods">
      {error && <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">{error}</div>}

      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading billing information...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase">
                    Current Plan
                  </span>
                  {subscription?.status === 'active' && (
                    <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Active
                    </span>
                  )}
                  {subscription?.status === 'past_due' && (
                    <span className="text-red-600 text-sm font-medium">Payment Overdue</span>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {plan?.name || 'No Active Plan'}
                </h2>
                {plan && <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">{plan.price}</p>}
                {subscription && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Next billing date: {new Date(subscription.current_period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>

              {/* Plan Features */}
              {plan && (
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Plan Includes:</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row gap-3">
                {subscription ? (
                  <button onClick={handleManageBilling} disabled={portalLoading}
                    className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                    {portalLoading ? 'Opening...' : 'Manage Billing'}
                  </button>
                ) : (
                  <Link href="/plans"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center">
                    Choose a Plan
                  </Link>
                )}
                <Link href="/plans"
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
                  View All Plans
                </Link>
              </div>
            </div>

            {/* Payment Security */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔒</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Secure Payments</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All payments are processed securely through Stripe. We never store your card details. 
                You can manage your payment methods, view invoices, and update your subscription through the Stripe customer portal.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {!subscription && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg sticky top-24">
                <span className="text-3xl mb-3 block">⚡</span>
                <h3 className="text-xl font-bold mb-2">Get Started</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Subscribe to a plan to unlock the full power of AI automation for your business.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  {['AI Receptionist', 'Lead Capture', 'Appointment Scheduling', 'WhatsApp Automation'].map((f, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/plans" className="block w-full py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors text-center">
                  View Plans
                </Link>
              </div>
            )}

            {subscription && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-500 dark:text-gray-400">
                    Questions about your billing or subscription? Contact our support team.
                  </p>
                  <Link href="/support" className="block text-blue-600 dark:text-blue-400 hover:underline">
                    Contact Support →
                  </Link>
                  <Link href="/plans" className="block text-blue-600 dark:text-blue-400 hover:underline">
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
