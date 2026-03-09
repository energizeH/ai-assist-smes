'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [loggingOut, setLoggingOut] = useState(false)
  const [stats, setStats] = useState<Stats>({ totalClients: 0, activeLeads: 0, appointmentsToday: 0, automationsActive: 0 })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch stats', err)
    }
  }, [])

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/activities')
      if (res.ok) {
        const data = await res.json()
        setActivities(data.activities || [])
      }
    } catch (err) {
      console.error('Failed to fetch activities', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    fetchActivities()
    const interval = setInterval(() => {
      fetchStats()
      fetchActivities()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchStats, fetchActivities])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {}
    router.push('/login')
    router.refresh()
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${Math.floor(diffHours / 24)} days ago`
  }

  const tabs = [
    { id: 'overview', label: 'Overview', href: '/dashboard' },
    { id: 'clients', label: 'Clients', href: '/dashboard/clients' },
    { id: 'appointments', label: 'Appointments', href: '/dashboard/appointments' },
    { id: 'leads', label: 'Leads', href: '/dashboard/leads' },
    { id: 'automations', label: 'Automations', href: '/dashboard/automations' },
    { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics' },
    { id: 'billing', label: 'Billing', href: '/dashboard/billing' },
    { id: 'settings', label: 'Settings', href: '/dashboard/settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 mr-8">AI-Assist</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/support" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Support</Link>
              <Link href="/dashboard/settings" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Account</Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {loading ? '...' : stats.totalClients}
            </p>
            <Link href="/dashboard/clients" className="text-xs text-blue-600 hover:underline mt-2 inline-block">View all clients →</Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Leads</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {loading ? '...' : stats.activeLeads}
            </p>
            <Link href="/dashboard/leads" className="text-xs text-blue-600 hover:underline mt-2 inline-block">View pipeline →</Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Appointments Today</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {loading ? '...' : stats.appointmentsToday}
            </p>
            <Link href="/dashboard/appointments" className="text-xs text-blue-600 hover:underline mt-2 inline-block">View calendar →</Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Automations</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {loading ? '...' : stats.automationsActive}
            </p>
            <Link href="/dashboard/automations" className="text-xs text-blue-600 hover:underline mt-2 inline-block">Manage automations →</Link>
          </div>
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
            <button onClick={() => { fetchStats(); fetchActivities(); }} className="text-xs text-blue-600 hover:underline">
              Refresh
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <div className="px-6 py-8 text-center text-gray-500">Loading activity...</div>
            ) : activities.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No recent activity yet.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add clients, leads or appointments to see activity here.</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">
                      {activity.type === 'lead' ? '🎯' : activity.type === 'appointment' ? '📅' : activity.type === 'client' ? '👥' : '⚡'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatTimeAgo(activity.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
