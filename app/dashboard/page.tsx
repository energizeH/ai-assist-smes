'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ClientsContent from '@/components/dashboard/ClientsContent''

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  const handleLogout = () => {
    // Clear authentication cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    // Redirect to login
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI-Assist Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Link 
                href="/support" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className="text-sm font-medium">Support</span>
              </Link>
              <Link 
                href="/account" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className="text-sm font-medium">Account</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'clients', label: 'Clients' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'leads', label: 'Leads' },
              { id: 'automations', label: 'Automations' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clients</div>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">247</div>
                <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                  <span className="mr-1">↑</span> +12% from last month
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Leads</div>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">89</div>
                <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                  <span className="mr-1">↑</span> +23% from last month
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Appointments Today</div>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">15</div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">3 pending confirmation</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Automation Uptime</div>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">99.8%</div>
                <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  All systems operational
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { time: '10 minutes ago', action: 'New lead captured', detail: 'John Smith via website form', icon: '📬' },
                    { time: '25 minutes ago', action: 'Appointment booked', detail: 'Sarah Johnson - Tomorrow 2:00 PM', icon: '📅' },
                    { time: '1 hour ago', action: 'WhatsApp message sent', detail: 'Appointment reminder to 5 clients', icon: '💬' },
                    { time: '2 hours ago', action: 'Lead qualified', detail: 'Michael Brown moved to sales pipeline', icon: '✅' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className="text-2xl mr-3">{activity.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{activity.detail}</div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

              {/* Clients Tab */}
      {activeTab === 'clients' && (
        <ClientsContent />
      )}

              {/* Other Tabs - Placeholder Content */}
      {activeTab !== 'overview' && activeTab !== 'clients' && (

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 animate-fadeIn">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This section is under development. Check back soon for updates!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
