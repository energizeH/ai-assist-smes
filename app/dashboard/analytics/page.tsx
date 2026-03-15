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

interface MonthlyDataPoint {
  month: string
  count: number
}

interface ActivityItem {
  id: string
  type: string
  description: string
  created_at: string
}

const PLAN_PRICES: Record<string, number> = {
  starter: 29,
  professional: 79,
  enterprise: 199,
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({ totalClients: 0, activeLeads: 0, appointmentsToday: 0, automationsActive: 0 })
  const [loading, setLoading] = useState(true)
  const [leadsBySource, setLeadsBySource] = useState<Record<string, number>>({})
  const [recentLeads, setRecentLeads] = useState<{ name: string; created_at: string; status: string; source?: string }[]>([])
  const [mrr, setMrr] = useState(0)
  const [planBreakdown, setPlanBreakdown] = useState<Record<string, number>>({})
  const [clientGrowth, setClientGrowth] = useState<MonthlyDataPoint[]>([])
  const [leadGrowth, setLeadGrowth] = useState<MonthlyDataPoint[]>([])
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([])
  const [leadStatusCounts, setLeadStatusCounts] = useState<Record<string, number>>({})
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch all data in parallel
      const [statsRes, leadsResult, subsResult, clientsResult, activitiesResult] = await Promise.all([
        fetch('/api/dashboard/stats'),
        supabase
          .from('leads')
          .select('source, created_at, name, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('user_id', user.id),
        supabase
          .from('clients')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('activities')
          .select('id, type, description, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      // Stats
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }

      // Leads analysis
      if (leadsResult.data) {
        const leads = leadsResult.data
        const sources: Record<string, number> = {}
        const statuses: Record<string, number> = {}
        leads.forEach(lead => {
          const src = lead.source || 'unknown'
          sources[src] = (sources[src] || 0) + 1
          const st = lead.status || 'unknown'
          statuses[st] = (statuses[st] || 0) + 1
        })
        setLeadsBySource(sources)
        setLeadStatusCounts(statuses)
        setRecentLeads(leads.slice(0, 10))

        // Lead growth by month (last 6 months)
        const leadMonthly = groupByMonth(leads.map(l => l.created_at))
        setLeadGrowth(leadMonthly)
      }

      // Subscription / MRR
      if (subsResult.data) {
        const activeSubs = subsResult.data.filter(s => s.status === 'active')
        let totalMrr = 0
        const plans: Record<string, number> = {}
        activeSubs.forEach(sub => {
          const plan = (sub.plan || 'starter').toLowerCase()
          totalMrr += PLAN_PRICES[plan] || 0
          plans[plan] = (plans[plan] || 0) + 1
        })
        setMrr(totalMrr)
        setPlanBreakdown(plans)
      }

      // Client growth by month
      if (clientsResult.data) {
        const clientMonthly = groupByMonth(clientsResult.data.map(c => c.created_at))
        setClientGrowth(clientMonthly)
      }

      // Activities
      if (activitiesResult.data) {
        setRecentActivities(activitiesResult.data)
      }
    } catch (error) {
      console.error('Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxSourceCount = Math.max(...Object.values(leadsBySource), 1)

  const totalLeads = Object.values(leadStatusCounts).reduce((a, b) => a + b, 0)
  const conversionRate = totalLeads > 0
    ? Math.round(((leadStatusCounts.closed_won || 0) / totalLeads) * 100)
    : 0

  return (
    <DashboardLayout title="Analytics" subtitle="Track your business performance">
      {loading ? (
        <div className="text-center py-12 text-[#94a3b8]">Loading analytics...</div>
      ) : (
        <>
          {/* Revenue & KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="kpi-card bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/5 border-[#3b82f6]/30">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#60a5fa]">Monthly Revenue (MRR)</p>
                <svg className="w-5 h-5 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-[#f1f5f9] mt-2">&pound;{mrr}</p>
              <p className="text-xs text-[#60a5fa] mt-1">{Object.values(planBreakdown).reduce((a, b) => a + b, 0)} active subscription{Object.values(planBreakdown).reduce((a, b) => a + b, 0) !== 1 ? 's' : ''}</p>
            </div>

            <div className="kpi-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#94a3b8]">Total Clients</p>
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-[#f1f5f9] mt-2">{stats.totalClients}</p>
              <p className="text-xs text-emerald-400 mt-1">Active accounts</p>
            </div>

            <div className="kpi-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#94a3b8]">Conversion Rate</p>
                <svg className="w-5 h-5 text-[#a855f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-[#f1f5f9] mt-2">{conversionRate}%</p>
              <p className="text-xs text-[#a855f7] mt-1">Lead to client</p>
            </div>

            <div className="kpi-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#94a3b8]">Active Leads</p>
                <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-[#f1f5f9] mt-2">{stats.activeLeads}</p>
              <p className="text-xs text-[#fbbf24] mt-1">In pipeline</p>
            </div>
          </div>

          {/* Revenue & Client Growth Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* MRR Breakdown */}
            <div className="glass-card-static p-6">
              <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Revenue by Plan</h3>
              {Object.keys(planBreakdown).length === 0 ? (
                <p className="text-[#94a3b8] text-sm">No active subscriptions yet.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(planBreakdown).sort((a, b) => (PLAN_PRICES[b[0]] || 0) * b[1] - (PLAN_PRICES[a[0]] || 0) * a[1]).map(([plan, count]) => {
                    const revenue = (PLAN_PRICES[plan] || 0) * count
                    const pct = mrr > 0 ? Math.round((revenue / mrr) * 100) : 0
                    return (
                      <div key={plan}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#94a3b8] capitalize font-medium">{plan}</span>
                          <span className="text-[#f1f5f9] font-semibold">&pound;{revenue}/mo <span className="text-[#64748b] font-normal">({count} sub{count !== 1 ? 's' : ''})</span></span>
                        </div>
                        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  <div className="pt-3 border-t border-white/10 flex justify-between">
                    <span className="text-sm font-semibold text-[#f1f5f9]">Total MRR</span>
                    <span className="text-sm font-bold text-[#60a5fa]">&pound;{mrr}/mo</span>
                  </div>
                </div>
              )}
            </div>

            {/* Client Growth Trend */}
            <div className="glass-card-static p-6">
              <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Client Growth</h3>
              {clientGrowth.length === 0 ? (
                <p className="text-[#94a3b8] text-sm">No client data yet. Add clients to see growth trends.</p>
              ) : (
                <div className="space-y-3">
                  <BarChart data={clientGrowth} color="green" />
                  <p className="text-xs text-[#64748b] text-center mt-2">New clients per month</p>
                </div>
              )}
            </div>
          </div>

          {/* Lead Analytics & Conversion Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Lead Sources */}
            <div className="glass-card-static p-6">
              <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Lead Sources</h3>
              {Object.keys(leadsBySource).length === 0 ? (
                <p className="text-[#94a3b8] text-sm">No lead data yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(leadsBySource).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
                    <div key={source}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#94a3b8] capitalize">{source.replace('_', ' ')}</span>
                        <span className="font-medium text-[#f1f5f9]">{count}</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3b82f6] rounded-full transition-all duration-500"
                          style={{ width: `${(count / maxSourceCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lead Pipeline Status */}
            <div className="glass-card-static p-6">
              <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Lead Pipeline</h3>
              {Object.keys(leadStatusCounts).length === 0 ? (
                <p className="text-[#94a3b8] text-sm">No lead data yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(leadStatusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          status === 'new' ? 'bg-[#3b82f6]' :
                          status === 'qualified' ? 'bg-[#a855f7]' :
                          status === 'contacted' ? 'bg-[#fbbf24]' :
                          status === 'closed_won' ? 'bg-emerald-500' :
                          status === 'closed_lost' ? 'bg-[#f43f5e]' :
                          'bg-[#64748b]'
                        }`} />
                        <span className="text-sm text-[#94a3b8] capitalize">{status.replace('_', ' ')}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#f1f5f9]">{count}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-[#64748b]">Conversion rate</span>
                      <span className="text-sm font-bold text-[#a855f7]">{conversionRate}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lead Growth Trend */}
            <div className="glass-card-static p-6">
              <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Lead Growth</h3>
              {leadGrowth.length === 0 ? (
                <p className="text-[#94a3b8] text-sm">No lead data yet.</p>
              ) : (
                <div className="space-y-3">
                  <BarChart data={leadGrowth} color="blue" />
                  <p className="text-xs text-[#64748b] text-center mt-2">New leads per month</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom row: Recent Leads + Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Leads */}
            <div className="glass-card-static p-6">
              <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Recent Leads</h3>
              {recentLeads.length === 0 ? (
                <p className="text-[#94a3b8] text-sm">No recent leads yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentLeads.map((lead, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[#f1f5f9]">{lead.name}</p>
                        <p className="text-xs text-[#64748b]">{new Date(lead.created_at).toLocaleDateString('en-GB')}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        lead.status === 'new' ? 'badge-info' :
                        lead.status === 'qualified' ? 'badge-violet' :
                        lead.status === 'closed_won' ? 'badge-success' :
                        'bg-white/10 text-[#94a3b8]'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div className="glass-card-static p-6">
              <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Activity Feed</h3>
              {recentActivities.length === 0 ? (
                <p className="text-[#94a3b8] text-sm">No recent activity yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 py-2 border-b border-white/5 last:border-0">
                      <div className="flex-shrink-0 mt-0.5">
                        <span className={`w-2 h-2 rounded-full block mt-1.5 ${
                          activity.type.includes('payment') ? 'bg-emerald-500' :
                          activity.type.includes('client') ? 'bg-[#3b82f6]' :
                          activity.type.includes('lead') ? 'bg-[#a855f7]' :
                          activity.type.includes('automation') ? 'bg-[#fbbf24]' :
                          'bg-[#64748b]'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#f1f5f9]">{activity.description}</p>
                        <p className="text-xs text-[#64748b] mt-0.5">
                          {new Date(activity.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="mt-8 glass-card-static p-6">
            <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#60a5fa]">{stats.automationsActive}</p>
                <p className="text-sm text-[#94a3b8] mt-1">Active Automations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{Object.keys(leadsBySource).length}</p>
                <p className="text-sm text-[#94a3b8] mt-1">Lead Sources</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#a855f7]">{recentLeads.filter(l => l.status === 'qualified').length}</p>
                <p className="text-sm text-[#94a3b8] mt-1">Qualified Leads</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#fbbf24]">{stats.appointmentsToday}</p>
                <p className="text-sm text-[#94a3b8] mt-1">Today&apos;s Meetings</p>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

// ── Helpers ──────────────────────────────────────────────────────

function groupByMonth(dates: string[]): MonthlyDataPoint[] {
  const now = new Date()
  const months: MonthlyDataPoint[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
    const count = dates.filter(dt => {
      const pd = new Date(dt)
      return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth()
    }).length
    months.push({ month: label, count })
  }

  return months
}

function BarChart({ data, color }: { data: MonthlyDataPoint[]; color: 'blue' | 'green' | 'purple' }) {
  const max = Math.max(...data.map(d => d.count), 1)
  const colorMap = {
    blue: 'bg-[#3b82f6]',
    green: 'bg-emerald-500',
    purple: 'bg-[#a855f7]',
  }

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-[#f1f5f9]">{item.count}</span>
          <div className="w-full bg-white/10 rounded-t-md overflow-hidden relative" style={{ height: '100px' }}>
            <div
              className={`absolute bottom-0 w-full rounded-t-md transition-all duration-500 ${colorMap[color]}`}
              style={{ height: `${(item.count / max) * 100}%`, minHeight: item.count > 0 ? '4px' : '0' }}
            />
          </div>
          <span className="text-xs text-[#64748b]">{item.month}</span>
        </div>
      ))}
    </div>
  )
}
