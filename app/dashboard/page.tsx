'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import DashboardLayout from '../components/DashboardLayout'
import OnboardingWizard from '../components/OnboardingWizard'
import UpgradeBanner from '../components/UpgradeBanner'

interface Stats {
  totalClients: number
  activeLeads: number
  appointmentsToday: number
  automationsActive: number
}

interface Activity {
  id: string
  type: string
  title: string
  description: string
  created_at: string
}

function DashboardContent() {
  const [stats, setStats] = useState<Stats>({ totalClients: 0, activeLeads: 0, appointmentsToday: 0, automationsActive: 0 })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userName, setUserName] = useState('')
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  // Check for subscription success redirect
  useEffect(() => {
    if (searchParams.get('subscription') === 'success') {
      setShowSuccessBanner(true)
      setTimeout(() => setShowSuccessBanner(false), 8000)
      // Clean URL
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [searchParams])

  const fetchData = useCallback(async () => {
    try {
      // Fetch user info and check onboarding
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '')

        // Check if user needs onboarding
        const isOnboarded = user.user_metadata?.onboarding_complete
        if (!isOnboarded) {
          // Check if they have any data (existing user vs brand new)
          const { count } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
          if ((count || 0) === 0) {
            setShowOnboarding(true)
          }
        }

        // Fetch subscription
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('user_id', user.id)
          .single()
        if (sub) {
          setSubscriptionPlan(sub.plan)
          setSubscriptionStatus(sub.status)
        }
      }

      const [statsRes, activitiesRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/activities'),
      ])
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
      if (activitiesRes.ok) {
        const data = await activitiesRes.json()
        setActivities(data.activities || [])
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  const statCards = [
    { label: 'Total Clients', value: stats.totalClients, href: '/dashboard/clients', color: 'blue', icon: '👥' },
    { label: 'Active Leads', value: stats.activeLeads, href: '/dashboard/leads', color: 'green', icon: '🎯' },
    { label: 'Appointments Today', value: stats.appointmentsToday, href: '/dashboard/appointments', color: 'purple', icon: '📅' },
    { label: 'Active Automations', value: stats.automationsActive, href: '/dashboard/automations', color: 'orange', icon: '⚡' },
  ]

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  // Show onboarding wizard
  if (showOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} userName={userName} />
  }

  return (
    <DashboardLayout>
      {/* Subscription success banner */}

      {showSuccessBanner && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
          <span className="text-green-600 text-xl">✓</span>
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">Subscription activated successfully!</p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">Your plan is now active. Enjoy your new features.</p>
          </div>
        </div>
      )}

      {/* Past due warning */}
      {subscriptionStatus === 'past_due' && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-xl">⚠</span>
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">Payment overdue</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">Please update your payment method to avoid service interruption.</p>
            </div>
          </div>
          <Link href="/dashboard/billing" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors whitespace-nowrap flex-shrink-0">
            Update Payment
          </Link>
        </div>
      )}

      {/* No subscription prompt */}
      {!subscriptionPlan && !loading && (
        <div className="mb-6">
          <UpgradeBanner message="Choose a plan to unlock all AI-Assist features" />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                <span className="text-xl">{card.icon}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : card.value}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">View details →</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/clients" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 text-center transition-colors">
          <div className="text-2xl mb-1">👥</div>
          <div className="text-sm font-medium">Add Client</div>
        </Link>
        <Link href="/dashboard/appointments" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 text-center transition-colors">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-sm font-medium">New Appointment</div>
        </Link>
        <Link href="/dashboard/leads" className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-4 text-center transition-colors">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-sm font-medium">Add Lead</div>
        </Link>
        <Link href="/dashboard/automations" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl p-4 text-center transition-colors">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-sm font-medium">New Automation</div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          <button onClick={fetchData} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Refresh
          </button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading activity...</div>
          ) : activities.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No recent activity yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add clients, leads or appointments to see activity here.</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">
                    {activity.type === 'lead' ? '🎯' : activity.type === 'appointment' ? '📅' : activity.type === 'client' ? '👥' : '⚡'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{formatTimeAgo(activity.created_at)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading dashboard...</div>
      </DashboardLayout>
    }>
      <DashboardContent />
    </Suspense>
  )
}
