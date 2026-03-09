'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import DashboardLayout from '../../components/DashboardLayout'

interface Stats {
  totalClients: number
  activeLeads: number
  appointmentsToday: number
  automationsActive: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({ totalClients: 0, activeLeads: 0, appointmentsToday: 0, automationsActive: 0 })
  const [loading, setLoading] = useState(true)
  const [leadsBySource, setLeadsBySource] = useState<Record<string, number>>({})
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/dashboard/stats')
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }

      // Fetch leads for source breakdown
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: leads } = await supabase
          .from('leads')
          .select('source, created_at, name, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (leads) {
          // Group by source
          const sources: Record<string, number> = {}
          leads.forEach(lead => {
            const src = lead.source || 'unknown'
            sources[src] = (sources[src] || 0) + 1
          })
          setLeadsBySource(sources)
          setRecentLeads(leads.slice(0, 10))
        }
      }
    } catch (error) {
      console.error('Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxSourceCount = Math.max(...Object.values(leadsBySource), 1)

  const conversionRate = stats.totalClients && stats.activeLeads
    ? Math.round((stats.totalClients / (stats.totalClients + stats.activeLeads)) * 100)
    : 0

  return (
    <DashboardLayout title="Analytics" subtitle="Track your business performance">
      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading analytics...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalClients}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">Active accounts</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Leads</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeLeads}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">In pipeline</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{conversionRate}%</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">Lead to client</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today&apos;s Appointments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.appointmentsToday}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">Scheduled</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lead Sources Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Lead Sources</h3>
              {Object.keys(leadsBySource).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No lead data yet. Add leads to see source breakdown.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(leadsBySource).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
                    <div key={source}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300 capitalize">{source.replace('_', ' ')}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${(count / maxSourceCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Leads */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Leads</h3>
              {recentLeads.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No recent leads yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentLeads.map((lead, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(lead.created_at).toLocaleDateString('en-GB')}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        lead.status === 'qualified' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        lead.status === 'closed_won' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.automationsActive}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active Automations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{Object.keys(leadsBySource).length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lead Sources</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{recentLeads.filter(l => l.status === 'qualified').length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Qualified Leads</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.appointmentsToday}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Today&apos;s Meetings</p>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
