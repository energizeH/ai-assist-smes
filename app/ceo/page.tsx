'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CEO_EMAIL = 'hxssxn772@gmail.com'

interface CEOData {
  overview: {
    totalUsers: number
    totalClients: number
    totalLeads: number
    totalAppointments: number
    mrr: number
    newUsersLast30Days: number
    churnRate: number
    mrrGrowth: number | null
    previousMrr: number
  }
  subscriptions: {
    active: number
    gifted: number
    trialing: number
    pastDue: number
    cancelled: number
    planBreakdown: { starter: number; professional: number; enterprise: number }
    all: any[]
  }
  stripe: {
    balance: { available: { amount: number; currency: string }[]; pending: { amount: number; currency: string }[] } | null
    recentCharges: any[]
    customerCount: number
    refundsThisMonth: number
  }
  users: any[]
  contacts: any[]
  newContactCount: number
  recentActivities: any[]
  upcomingRenewals: { userId: string; email: string; plan: string; renewalDate: string; amount: number }[]
  failedPayments: { userId: string; email: string; name: string; plan: string; status: string; periodEnd: string }[]
  mrrHistory: { month: string; mrr: number }[]
  platformStats: {
    leadsThisMonth: number
    clientsThisMonth: number
    appointmentsThisMonth: number
    activeAutomations: number
    mostPopularPlan: string
    avgLeadsPerUser: number
  }
}

export default function CEOPage() {
  const [data, setData] = useState<CEOData | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'subscriptions' | 'revenue' | 'contacts' | 'activity' | 'platform_stats'>('overview')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [modalAction, setModalAction] = useState<string | null>(null)
  const [grantPlan, setGrantPlan] = useState('professional')
  const [giftMonths, setGiftMonths] = useState(1)
  // Change 3: Enquiries state
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'new' | 'read' | 'resolved'>('all')
  const [expandedEnquiry, setExpandedEnquiry] = useState<string | null>(null)
  const [enquiryLoading, setEnquiryLoading] = useState<string | null>(null)
  // Change 7: Users search and filter state
  const [userSearch, setUserSearch] = useState('')
  const [userPlanFilter, setUserPlanFilter] = useState<'all' | 'starter' | 'professional' | 'enterprise'>('all')
  const [userSort, setUserSort] = useState<'joined' | 'plan' | 'status'>('joined')
  // Change 8: View Summary modal state
  const [viewSummaryUser, setViewSummaryUser] = useState<any | null>(null)
  const [summaryData, setSummaryData] = useState<any | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthAndFetch()
  }, [])

  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [actionMessage])

  const checkAuthAndFetch = async () => {
    let email = ''
    try {
      const meRes = await fetch('/api/auth/me')
      if (meRes.ok) {
        const meData = await meRes.json()
        email = meData.user?.email || ''
      }
    } catch {
      // Auth check failed
    }

    if (!email || email.toLowerCase() !== CEO_EMAIL) {
      router.push('/dashboard')
      return
    }
    setAuthorized(true)

    try {
      const res = await fetch('/api/ceo')
      if (!res.ok) {
        if (res.status === 403) {
          router.push('/dashboard')
          return
        }
      }
      const json = await res.json()
      if (!json.error) {
        setData(json)
      }
    } catch (err) {
      console.error('CEO fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const executeAction = async (action: string, userId: string, plan?: string) => {
    setActionLoading(`${action}-${userId}`)
    setActionMessage(null)
    try {
      const res = await fetch('/api/ceo/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, plan, giftMonths }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Action failed')
      setActionMessage({ type: 'success', text: json.message })
      // Refresh data
      const dataRes = await fetch('/api/ceo')
      if (dataRes.ok) {
        const newData = await dataRes.json()
        if (!newData.error) setData(newData)
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    } finally {
      setActionLoading(null)
      setSelectedUser(null)
      setModalAction(null)
    }
  }

  // Change 3: Enquiry actions
  const updateEnquiryStatus = async (id: string, status: string) => {
    setEnquiryLoading(`status-${id}`)
    try {
      const res = await fetch('/api/ceo/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to update status')
      setActionMessage({ type: 'success', text: json.message })
      const dataRes = await fetch('/api/ceo')
      if (dataRes.ok) {
        const newData = await dataRes.json()
        if (!newData.error) setData(newData)
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    } finally {
      setEnquiryLoading(null)
    }
  }

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry? This cannot be undone.')) return
    setEnquiryLoading(`delete-${id}`)
    try {
      const res = await fetch('/api/ceo/enquiries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to delete')
      setActionMessage({ type: 'success', text: json.message })
      const dataRes = await fetch('/api/ceo')
      if (dataRes.ok) {
        const newData = await dataRes.json()
        if (!newData.error) setData(newData)
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    } finally {
      setEnquiryLoading(null)
    }
  }

  // Change 8: View Summary modal
  const openViewSummary = async (user: any) => {
    setViewSummaryUser(user)
    setSummaryLoading(true)
    setSummaryData(null)
    try {
      const sub = data?.subscriptions.all.find(s => s.user_id === user.id)
      const res = await fetch('/api/ceo')
      if (res.ok) {
        const json = await res.json()
        setSummaryData({
          subscription: sub || null,
          totalUsers: json.overview.totalUsers,
        })
      }
    } catch {
      setSummaryData({ subscription: null, totalUsers: 0 })
    } finally {
      setSummaryLoading(false)
    }
  }

  const getUserSubscription = (userId: string) => {
    return data?.subscriptions.all.find(s => s.user_id === userId)
  }

  if (!authorized || loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#64748b] text-sm">Loading CEO Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '💳' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'contacts', label: 'Enquiries', icon: '📩' },
    { id: 'activity', label: 'Activity Feed', icon: '🔔' },
    { id: 'platform_stats', label: 'Platform Stats', icon: '📈' },
  ] as const

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    catch { return d }
  }

  const formatShortDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
    catch { return d }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#f1f5f9]">
      {/* Top bar */}
      <div className="nav-glass sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3b82f6] to-[#7c3aed] rounded-lg flex items-center justify-center text-sm font-bold text-white">A</div>
              <div>
                <h1 className="text-sm font-bold gradient-text">AI-Assist for SMEs</h1>
                <p className="text-[10px] text-[#64748b] uppercase tracking-widest">CEO Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#64748b]">{CEO_EMAIL}</span>
              <Link href="/dashboard" className="text-xs text-[#94a3b8] hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5">
                ← Back to App
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {actionMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl backdrop-blur-sm animate-fadeIn ${
          actionMessage.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-[#fb7185]'
        }`}>
          {actionMessage.text}
        </div>
      )}

      {/* User Action Modal */}
      {selectedUser && modalAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-strong p-6 w-full max-w-md animate-fadeIn">
            <h3 className="text-lg font-bold text-[#f1f5f9] mb-2">
              {modalAction === 'grant_free_access' && 'Grant Free Access'}
              {modalAction === 'change_plan' && 'Change Plan'}
              {modalAction === 'revoke_access' && 'Revoke Access'}
              {modalAction === 'delete_user' && 'Delete User'}
              {modalAction === 'reactivate' && 'Reactivate Subscription'}
              {modalAction === 'gift_membership' && 'Gift Membership'}
            </h3>
            <p className="text-sm text-[#94a3b8] mb-4">
              User: <span className="text-[#f1f5f9] font-medium">{selectedUser.full_name || selectedUser.email}</span>
              <br />
              <span className="text-[#64748b]">{selectedUser.email}</span>
            </p>

            {(modalAction === 'grant_free_access' || modalAction === 'change_plan' || modalAction === 'gift_membership') && (
              <div className="mb-4">
                <label className="text-xs text-[#94a3b8] uppercase tracking-wide mb-2 block">Select Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {['starter', 'professional', 'enterprise'].map(p => (
                    <button
                      key={p}
                      onClick={() => setGrantPlan(p)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        grantPlan === p
                          ? 'bg-[#3b82f6] text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                          : 'bg-white/5 text-[#94a3b8] hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {modalAction === 'gift_membership' && (
              <div className="mb-4">
                <label className="text-xs text-[#94a3b8] uppercase tracking-wide mb-2 block">Gift Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 6, 12].map(m => (
                    <button
                      key={m}
                      onClick={() => setGiftMonths(m)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        giftMonths === m
                          ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                          : 'bg-white/5 text-[#94a3b8] hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {m} {m === 1 ? 'month' : 'months'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {modalAction === 'revoke_access' && (
              <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                This will cancel their subscription. They will lose access to paid features.
              </p>
            )}

            {modalAction === 'delete_user' && (
              <p className="text-sm text-[#fb7185] bg-[#f43f5e]/10 border border-[#f43f5e]/20 rounded-lg p-3 mb-4">
                This will permanently delete this user and all their data. This cannot be undone.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedUser(null); setModalAction(null) }}
                className="flex-1 px-4 py-2.5 bg-white/5 text-[#f1f5f9] rounded-lg text-sm font-medium hover:bg-white/10 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => executeAction(modalAction, selectedUser.id, grantPlan)}
                disabled={!!actionLoading}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  modalAction === 'delete_user'
                    ? 'bg-[#f43f5e] text-white hover:bg-[#e11d48]'
                    : modalAction === 'revoke_access'
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : modalAction === 'gift_membership'
                    ? 'bg-[#a855f7] text-white hover:bg-[#9333ea]'
                    : 'btn btn-primary'
                }`}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 glass-card-static p-1.5 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'glass-tab-active'
                  : 'glass-tab'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: data.overview.totalUsers, icon: '👥' },
                { label: 'MRR', value: `£${data.overview.mrr}`, icon: '💷' },
                { label: 'Active Subs', value: data.subscriptions.active, icon: '✅' },
                { label: 'New (30d)', value: data.overview.newUsersLast30Days, icon: '📈' },
                { label: 'Total Leads', value: data.overview.totalLeads, icon: '🎯' },
                { label: 'Enquiries', value: data.newContactCount, icon: '📩' },
              ].map((kpi, i) => (
                <div key={kpi.label} className={`kpi-card animate-fadeIn stagger-${i + 1}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{kpi.icon}</span>
                  </div>
                  <p className="text-2xl font-bold text-[#f1f5f9]">{kpi.value}</p>
                  <p className="text-xs text-[#64748b] mt-1">{kpi.label}</p>
                </div>
              ))}
              {/* Change 4: Churn Rate Card */}
              <div className="kpi-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">📉</span>
                </div>
                <p className={`text-2xl font-bold ${data.overview.churnRate > 5 ? 'text-[#fb7185]' : 'text-emerald-400'}`}>{data.overview.churnRate}%</p>
                <p className="text-xs text-[#64748b] mt-1">Churn Rate</p>
              </div>
              {/* Change 5: MRR Growth Card */}
              <div className="kpi-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{data.overview.mrrGrowth !== null && data.overview.mrrGrowth >= 0 ? '📈' : '📉'}</span>
                </div>
                <p className={`text-2xl font-bold ${data.overview.mrrGrowth !== null && data.overview.mrrGrowth >= 0 ? 'text-emerald-400' : 'text-[#fb7185]'}`}>
                  {data.overview.mrrGrowth !== null ? `${data.overview.mrrGrowth > 0 ? '+' : ''}${data.overview.mrrGrowth}%` : 'Tracking started'}
                </p>
                <p className="text-xs text-[#64748b] mt-1">MRR Growth</p>
              </div>
            </div>

            {/* Subscription Breakdown + Stripe Balance */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card-static p-6">
                <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 uppercase tracking-wide">Plan Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { plan: 'Starter (£49/mo)', count: data.subscriptions.planBreakdown.starter, color: 'bg-[#3b82f6]', revenue: data.subscriptions.planBreakdown.starter * 49 },
                    { plan: 'Professional (£149/mo)', count: data.subscriptions.planBreakdown.professional, color: 'bg-[#7c3aed]', revenue: data.subscriptions.planBreakdown.professional * 149 },
                    { plan: 'Enterprise (£299/mo)', count: data.subscriptions.planBreakdown.enterprise, color: 'bg-amber-500', revenue: data.subscriptions.planBreakdown.enterprise * 299 },
                  ].map(p => (
                    <div key={p.plan} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${p.color}`} />
                        <span className="text-sm text-[#94a3b8]">{p.plan}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#f1f5f9]">{p.count} users</span>
                        <span className="text-xs text-[#64748b] ml-2">£{p.revenue}/mo</span>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#f1f5f9]">Total MRR</span>
                      <span className="text-lg font-bold text-emerald-400">£{data.overview.mrr}/mo</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-[#64748b]">Projected ARR</span>
                      <span className="text-sm font-semibold text-emerald-300">£{(data.overview.mrr * 12).toLocaleString()}/yr</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card-static p-6">
                <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 uppercase tracking-wide">Stripe Balance</h3>
                {data.stripe.balance ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[#64748b] mb-1">Available</p>
                      {data.stripe.balance.available.map((b, i) => (
                        <p key={i} className="text-3xl font-bold text-emerald-400">
                          £{b.amount.toFixed(2)}
                          <span className="text-xs text-[#64748b] ml-1 uppercase">{b.currency}</span>
                        </p>
                      ))}
                      {data.stripe.balance.available.length === 0 && (
                        <p className="text-3xl font-bold text-[#64748b]">£0.00</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-[#64748b] mb-1">Pending</p>
                      {data.stripe.balance.pending.map((b, i) => (
                        <p key={i} className="text-xl font-semibold text-amber-400">
                          £{b.amount.toFixed(2)}
                          <span className="text-xs text-[#64748b] ml-1 uppercase">{b.currency}</span>
                        </p>
                      ))}
                      {data.stripe.balance.pending.length === 0 && (
                        <p className="text-xl font-semibold text-[#64748b]">£0.00</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#64748b]">Stripe not connected</p>
                )}

                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-xs text-[#64748b] mb-2">Subscription Status</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-emerald-400">{data.subscriptions.active}</p>
                      <p className="text-[10px] text-emerald-300/70 uppercase">Active</p>
                    </div>
                    <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-[#60a5fa]">{data.subscriptions.trialing}</p>
                      <p className="text-[10px] text-[#60a5fa]/70 uppercase">Trial</p>
                    </div>
                    <div className="bg-[#f43f5e]/10 border border-[#f43f5e]/20 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-[#fb7185]">{data.subscriptions.pastDue}</p>
                      <p className="text-[10px] text-[#fb7185]/70 uppercase">Past Due</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-[#94a3b8]">{data.subscriptions.cancelled}</p>
                      <p className="text-[10px] text-[#94a3b8]/70 uppercase">Cancelled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users + Recent Contacts side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card-static p-6">
                <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 uppercase tracking-wide">Recent Signups</h3>
                <div className="space-y-3">
                  {data.users.slice(0, 5).map((u) => (
                    <div key={u.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#3b82f6]/20 border border-[#3b82f6]/30 rounded-full flex items-center justify-center text-xs font-bold text-[#60a5fa]">
                          {(u.full_name || u.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#f1f5f9]">{u.full_name || 'No name'}</p>
                          <p className="text-xs text-[#64748b]">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#64748b]">{formatShortDate(u.created_at)}</span>
                    </div>
                  ))}
                  {data.users.length === 0 && <p className="text-sm text-[#64748b]">No users yet</p>}
                </div>
              </div>

              <div className="glass-card-static p-6">
                <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 uppercase tracking-wide">
                  Recent Enquiries
                  {data.newContactCount > 0 && (
                    <span className="ml-2 bg-[#f43f5e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{data.newContactCount} NEW</span>
                  )}
                </h3>
                <div className="space-y-3">
                  {data.contacts.slice(0, 5).map((c) => (
                    <div key={c.id} className="py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-[#f1f5f9]">{c.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          c.status === 'new' ? 'badge-success' : 'bg-white/5 text-[#94a3b8] border border-white/10'
                        }`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-[#64748b]">{c.email} · {c.subject || 'No subject'}</p>
                      <p className="text-xs text-[#64748b] mt-1 line-clamp-1">{c.message}</p>
                    </div>
                  ))}
                  {data.contacts.length === 0 && <p className="text-sm text-[#64748b]">No enquiries yet</p>}
                </div>
              </div>
            </div>

            {/* Change 11: Upcoming Renewals */}
            <div className="glass-card-static p-6">
              <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 uppercase tracking-wide">Upcoming Renewals (Next 7 Days)</h3>
              {data.upcomingRenewals && data.upcomingRenewals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Plan</th>
                        <th>Renewal Date</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.upcomingRenewals.map((r, i) => (
                        <tr key={i}>
                          <td className="text-[#94a3b8]">{r.email}</td>
                          <td>
                            <span className={`${
                              r.plan === 'enterprise' ? 'badge-warning' :
                              r.plan === 'professional' ? 'badge-violet' :
                              'badge-info'
                            }`}>{r.plan}</span>
                          </td>
                          <td>{formatShortDate(r.renewalDate)}</td>
                          <td className="text-sm font-bold text-emerald-400 text-right">£{r.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-[#64748b]">No renewals in the next 7 days.</p>
              )}
            </div>

            {/* Change 12: Failed Payments */}
            <div className={`rounded-xl p-6 ${data.failedPayments && data.failedPayments.length > 0 ? 'bg-[#f43f5e]/5 border border-[#f43f5e]/20' : 'glass-card-static'}`}>
              <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 uppercase tracking-wide">Failed Payments</h3>
              {data.failedPayments && data.failedPayments.length > 0 ? (
                <div className="space-y-3">
                  {data.failedPayments.map((fp, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#f43f5e]/10 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[#f1f5f9]">{fp.name || fp.email}</p>
                        <p className="text-xs text-[#64748b]">{fp.email} · {fp.plan}</p>
                      </div>
                      <span className="badge-danger uppercase">{fp.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <p className="text-sm text-[#94a3b8]">No failed payments</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab - with management controls */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Change 7: Search and Filter Bar */}
            <div className="glass-card-static p-4 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="input flex-1 text-sm"
              />
              <div className="flex gap-1">
                {(['all', 'starter', 'professional', 'enterprise'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setUserPlanFilter(p)}
                    className={`text-[10px] px-3 py-2 rounded-lg font-bold uppercase transition-colors ${
                      userPlanFilter === p
                        ? 'glass-tab-active'
                        : 'glass-tab'
                    }`}
                  >
                    {p === 'all' ? 'All Plans' : p}
                  </button>
                ))}
              </div>
              <select
                value={userSort}
                onChange={e => setUserSort(e.target.value as any)}
                className="input text-sm w-auto"
              >
                <option value="joined">Joined (Newest)</option>
                <option value="plan">Plan</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div className="glass-card-static overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wide">All Users ({data.users.length})</h3>
                <p className="text-xs text-[#64748b]">Click actions to manage users</p>
              </div>
              <div className="overflow-x-auto">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Last Active</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users
                      .filter(u => {
                        const searchLower = userSearch.toLowerCase()
                        if (searchLower && !(u.full_name || '').toLowerCase().includes(searchLower) && !(u.email || '').toLowerCase().includes(searchLower)) return false
                        if (userPlanFilter !== 'all') {
                          const sub = getUserSubscription(u.id)
                          if (!sub || sub.plan !== userPlanFilter) return false
                        }
                        return true
                      })
                      .sort((a, b) => {
                        if (userSort === 'joined') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                        if (userSort === 'plan') {
                          const planOrder: Record<string, number> = { enterprise: 0, professional: 1, starter: 2 }
                          const aSub = getUserSubscription(a.id)
                          const bSub = getUserSubscription(b.id)
                          return (planOrder[aSub?.plan] ?? 3) - (planOrder[bSub?.plan] ?? 3)
                        }
                        if (userSort === 'status') {
                          const statusOrder: Record<string, number> = { active: 0, trialing: 1, past_due: 2, cancelled: 3 }
                          const aSub = getUserSubscription(a.id)
                          const bSub = getUserSubscription(b.id)
                          return (statusOrder[aSub?.status] ?? 4) - (statusOrder[bSub?.status] ?? 4)
                        }
                        return 0
                      })
                      .map(u => {
                      const sub = getUserSubscription(u.id)
                      const isCeo = u.email?.toLowerCase() === CEO_EMAIL
                      return (
                        <tr key={u.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#3b82f6]/20 border border-[#3b82f6]/30 rounded-full flex items-center justify-center text-xs font-bold text-[#60a5fa]">
                                {(u.full_name || u.email || '?')[0].toUpperCase()}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-[#f1f5f9]">{u.full_name || '—'}</span>
                                {isCeo && <span className="ml-2 text-[9px] bg-gradient-to-r from-[#3b82f6] to-[#7c3aed] text-white px-1.5 py-0.5 rounded font-bold">CEO</span>}
                              </div>
                            </div>
                          </td>
                          <td className="text-[#94a3b8]">{u.email}</td>
                          <td>
                            {sub ? (
                              <span className={`${
                                sub.plan === 'enterprise' ? 'badge-warning' :
                                sub.plan === 'professional' ? 'badge-violet' :
                                sub.plan === 'starter' ? 'badge-info' :
                                'bg-white/5 text-[#94a3b8] px-3 py-1 rounded-full text-xs font-semibold border border-white/10'
                              }`}>{sub.plan || 'free'}</span>
                            ) : (
                              <span className="text-xs text-[#64748b]">No plan</span>
                            )}
                          </td>
                          <td>
                            {sub ? (
                              <span className={`${
                                sub.status === 'active' ? 'badge-success' :
                                sub.status === 'past_due' ? 'badge-danger' :
                                sub.status === 'trialing' ? 'badge-info' :
                                sub.status === 'cancelled' ? 'bg-white/5 text-[#94a3b8] px-3 py-1 rounded-full text-xs font-semibold border border-white/10' :
                                'bg-white/5 text-[#94a3b8] px-3 py-1 rounded-full text-xs font-semibold border border-white/10'
                              }`}>{sub.status}</span>
                            ) : (
                              <span className="text-xs text-[#64748b]">Free</span>
                            )}
                          </td>
                          <td>{formatShortDate(u.created_at)}</td>
                          <td>{u.last_active ? formatDate(u.last_active) : '—'}</td>
                          <td>
                            {!isCeo && (
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => openViewSummary(u)}
                                  className="text-[10px] px-2 py-1 bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500/25 transition-colors font-bold"
                                >
                                  View
                                </button>
                                {!sub || sub.status === 'cancelled' ? (
                                  <button
                                    onClick={() => { setSelectedUser(u); setModalAction('grant_free_access'); setGrantPlan('professional') }}
                                    className="text-[10px] px-2 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-500/25 transition-colors font-bold"
                                  >
                                    Grant Access
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => { setSelectedUser(u); setModalAction('change_plan'); setGrantPlan(sub.plan || 'professional') }}
                                      className="text-[10px] px-2 py-1 bg-[#3b82f6]/15 text-[#60a5fa] border border-[#3b82f6]/30 rounded hover:bg-[#3b82f6]/25 transition-colors font-bold"
                                    >
                                      Change Plan
                                    </button>
                                    <button
                                      onClick={() => { setSelectedUser(u); setModalAction('revoke_access') }}
                                      className="text-[10px] px-2 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded hover:bg-amber-500/25 transition-colors font-bold"
                                    >
                                      Revoke
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => { setSelectedUser(u); setModalAction('gift_membership'); setGrantPlan('professional'); setGiftMonths(1) }}
                                  className="text-[10px] px-2 py-1 bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30 rounded hover:bg-[#a855f7]/25 transition-colors font-bold"
                                >
                                  Gift
                                </button>
                                <button
                                  onClick={() => { setSelectedUser(u); setModalAction('delete_user') }}
                                  className="text-[10px] px-2 py-1 bg-[#f43f5e]/15 text-[#fb7185] border border-[#f43f5e]/30 rounded hover:bg-[#f43f5e]/25 transition-colors font-bold"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {data.users.length === 0 && <p className="p-8 text-center text-[#64748b]">No users yet</p>}
            </div>
          </div>
        )}

        {/* Change 8: View Summary Modal */}
        {viewSummaryUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card-strong p-6 w-full max-w-lg animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#f1f5f9]">User Summary</h3>
                <button onClick={() => { setViewSummaryUser(null); setSummaryData(null) }} className="text-[#94a3b8] hover:text-white text-xl">×</button>
              </div>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center text-sm font-bold text-cyan-400">
                  {(viewSummaryUser.full_name || viewSummaryUser.email || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f1f5f9]">{viewSummaryUser.full_name || 'No name'}</p>
                  <p className="text-xs text-[#64748b]">{viewSummaryUser.email}</p>
                </div>
              </div>
              {summaryLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : summaryData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-[#64748b] uppercase">Plan</p>
                      <p className="text-sm font-bold text-[#f1f5f9] capitalize">{summaryData.subscription?.plan || 'None'}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-[#64748b] uppercase">Status</p>
                      <p className={`text-sm font-bold capitalize ${
                        summaryData.subscription?.status === 'active' ? 'text-emerald-400' :
                        summaryData.subscription?.status === 'past_due' ? 'text-[#fb7185]' :
                        summaryData.subscription?.status === 'cancelled' ? 'text-[#94a3b8]' :
                        'text-[#94a3b8]'
                      }`}>{summaryData.subscription?.status || 'Free'}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-[#64748b] uppercase">Joined</p>
                      <p className="text-sm font-bold text-[#f1f5f9]">{formatShortDate(viewSummaryUser.created_at)}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-[#64748b] uppercase">Last Active</p>
                      <p className="text-sm font-bold text-[#f1f5f9]">{viewSummaryUser.last_active ? formatDate(viewSummaryUser.last_active) : '—'}</p>
                    </div>
                  </div>
                  {summaryData.subscription?.is_gifted && (
                    <div className="bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-lg p-3">
                      <p className="text-xs text-[#a855f7] font-bold uppercase">Gifted Membership</p>
                      <p className="text-xs text-[#94a3b8] mt-1">Duration: {summaryData.subscription.gift_months} month{summaryData.subscription.gift_months !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                  {summaryData.subscription?.current_period_end && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-[#64748b] uppercase">Period End</p>
                      <p className="text-sm font-bold text-[#f1f5f9]">{formatShortDate(summaryData.subscription.current_period_end)}</p>
                    </div>
                  )}
                  {viewSummaryUser.company && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-[#64748b] uppercase">Company</p>
                      <p className="text-sm font-bold text-[#f1f5f9]">{viewSummaryUser.company}</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="kpi-card">
                <p className="text-3xl font-bold text-emerald-400">{data.subscriptions.active}</p>
                <p className="text-xs text-[#64748b] uppercase mt-1">Active</p>
              </div>
              <div className="kpi-card">
                <p className="text-3xl font-bold text-[#60a5fa]">{data.subscriptions.trialing}</p>
                <p className="text-xs text-[#64748b] uppercase mt-1">Trialing</p>
              </div>
              <div className="kpi-card">
                <p className="text-3xl font-bold text-[#fb7185]">{data.subscriptions.pastDue}</p>
                <p className="text-xs text-[#64748b] uppercase mt-1">Past Due</p>
              </div>
              <div className="kpi-card">
                <p className="text-3xl font-bold text-[#94a3b8]">{data.subscriptions.cancelled}</p>
                <p className="text-xs text-[#64748b] uppercase mt-1">Cancelled</p>
              </div>
            </div>

            <div className="glass-card-static overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wide">All Subscriptions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Period End</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subscriptions.all.map(s => {
                      const user = data.users.find(u => u.id === s.user_id)
                      return (
                        <tr key={s.id}>
                          <td className="text-[#94a3b8]">{user?.email || s.user_id?.slice(0, 8) + '...'}</td>
                          <td>
                            <span className={`${
                              s.plan === 'enterprise' ? 'badge-warning' :
                              s.plan === 'professional' ? 'badge-violet' :
                              s.plan === 'starter' ? 'badge-info' :
                              'bg-white/5 text-[#94a3b8] px-3 py-1 rounded-full text-xs font-semibold border border-white/10'
                            }`}>{s.plan || 'free'}</span>
                          </td>
                          <td>
                            <span className={`${
                              s.status === 'active' ? 'badge-success' :
                              s.status === 'past_due' ? 'badge-danger' :
                              s.status === 'trialing' ? 'badge-info' :
                              'bg-white/5 text-[#94a3b8] px-3 py-1 rounded-full text-xs font-semibold border border-white/10'
                            }`}>{s.status}</span>
                            {s.is_gifted && (
                              <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30 rounded font-bold">GIFTED</span>
                            )}
                          </td>
                          <td>{s.current_period_end ? formatShortDate(s.current_period_end) : '—'}</td>
                          <td>{formatShortDate(s.created_at)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {data.subscriptions.all.length === 0 && <p className="p-8 text-center text-[#64748b]">No subscriptions yet</p>}
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="kpi-card animate-fadeIn stagger-1">
                <p className="text-xs text-[#64748b] uppercase mb-1">Monthly Recurring Revenue</p>
                <p className="text-4xl font-bold text-emerald-400">£{data.overview.mrr}</p>
                <p className="text-xs text-[#64748b] mt-2">From {data.subscriptions.active - data.subscriptions.gifted} paying subscriptions{data.subscriptions.gifted > 0 ? ` (${data.subscriptions.gifted} gifted excluded)` : ''}</p>
              </div>
              <div className="kpi-card animate-fadeIn stagger-2">
                <p className="text-xs text-[#64748b] uppercase mb-1">Annual Run Rate</p>
                <p className="text-4xl font-bold text-[#60a5fa]">£{(data.overview.mrr * 12).toLocaleString()}</p>
                <p className="text-xs text-[#64748b] mt-2">Projected yearly revenue</p>
              </div>
              <div className="kpi-card animate-fadeIn stagger-3">
                <p className="text-xs text-[#64748b] uppercase mb-1">Avg Revenue Per User</p>
                <p className="text-4xl font-bold text-[#a855f7]">
                  £{data.subscriptions.active > 0 ? (data.overview.mrr / data.subscriptions.active).toFixed(0) : '0'}
                </p>
                <p className="text-xs text-[#64748b] mt-2">Per active subscriber</p>
              </div>
              {/* Change 9: Net Revenue card */}
              <div className="kpi-card animate-fadeIn stagger-4">
                <p className="text-xs text-[#64748b] uppercase mb-1">Net Revenue</p>
                <p className="text-4xl font-bold text-emerald-400">
                  £{(data.overview.mrr - (data.stripe.refundsThisMonth || 0)).toFixed(0)}
                </p>
                {data.stripe.refundsThisMonth > 0 ? (
                  <p className="text-xs text-[#64748b] mt-2">MRR minus £{data.stripe.refundsThisMonth.toFixed(2)} in refunds</p>
                ) : (
                  <p className="text-xs text-[#64748b] mt-2">{data.stripe.balance ? 'No refunds this month' : 'No refund data available'}</p>
                )}
              </div>
            </div>

            {/* Change 10: MRR History Bar Chart */}
            <div className="glass-card-static p-6">
              <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 uppercase tracking-wide">MRR History (Last 6 Months)</h3>
              {data.mrrHistory && data.mrrHistory.length > 0 ? (() => {
                const maxMrr = Math.max(...data.mrrHistory.map(m => m.mrr), 1)
                return (
                  <div className="flex items-end gap-3 h-48">
                    {data.mrrHistory.map((m, i) => {
                      const heightPct = maxMrr > 0 ? (m.mrr / maxMrr) * 100 : 0
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="text-xs text-emerald-400 font-bold">£{m.mrr}</span>
                          <div
                            className="w-full bg-gradient-to-t from-[#3b82f6] to-[#7c3aed] rounded-t-md transition-all duration-500"
                            style={{ height: `${Math.max(heightPct, 2)}%`, minHeight: '4px' }}
                          />
                          <span className="text-[10px] text-[#64748b] font-medium">{m.month}</span>
                        </div>
                      )
                    })}
                  </div>
                )
              })() : (
                <p className="text-sm text-[#64748b]">Revenue history will appear here as data builds up.</p>
              )}
            </div>

            <div className="glass-card-static p-6">
              <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 uppercase tracking-wide">Recent Charges (Stripe)</h3>
              {data.stripe.recentCharges.length > 0 ? (
                <div className="space-y-3">
                  {data.stripe.recentCharges.map(c => (
                    <div key={c.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[#f1f5f9]">{c.customer_email || 'Unknown customer'}</p>
                        <p className="text-xs text-[#64748b]">{c.description || 'Subscription payment'} · {formatDate(c.created)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${c.status === 'succeeded' ? 'text-emerald-400' : 'text-[#fb7185]'}`}>
                          £{c.amount.toFixed(2)}
                        </p>
                        <span className={`text-[10px] uppercase font-bold ${
                          c.status === 'succeeded' ? 'text-emerald-500' : 'text-[#f43f5e]'
                        }`}>{c.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748b]">No charges yet. Revenue will appear here once customers subscribe.</p>
              )}
            </div>
          </div>
        )}

        {/* Contacts Tab — Change 3: Actions, Filters, Expandable Rows */}
        {activeTab === 'contacts' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter bar */}
            <div className="flex gap-2 glass-card-static p-3">
              {(['all', 'new', 'read', 'resolved'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setEnquiryFilter(f)}
                  className={`text-xs px-4 py-2 rounded-lg font-bold uppercase transition-colors ${
                    enquiryFilter === f
                      ? 'glass-tab-active'
                      : 'glass-tab'
                  }`}
                >
                  {f === 'all' ? `All (${data.contacts.length})` : `${f} (${data.contacts.filter(c => c.status === f).length})`}
                </button>
              ))}
            </div>

            <div className="glass-card-static overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wide">
                  Contact Enquiries
                  {data.newContactCount > 0 && (
                    <span className="ml-2 bg-[#f43f5e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{data.newContactCount} NEW</span>
                  )}
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {data.contacts
                  .filter(c => enquiryFilter === 'all' || c.status === enquiryFilter)
                  .map(c => {
                    const isExpanded = expandedEnquiry === c.id
                    const isLoading = enquiryLoading?.includes(c.id)
                    return (
                      <div key={c.id} className="hover:bg-white/[0.03] transition-colors">
                        <div
                          className="flex items-center gap-4 px-4 py-3 cursor-pointer"
                          onClick={() => setExpandedEnquiry(isExpanded ? null : c.id)}
                        >
                          <span className="text-[#64748b] text-xs">{isExpanded ? '▼' : '▶'}</span>
                          <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase flex-shrink-0 ${
                            c.status === 'new' ? 'badge-success' :
                            c.status === 'read' ? 'badge-info' :
                            c.status === 'resolved' ? 'bg-white/5 text-[#94a3b8] border border-white/10' :
                            'bg-white/5 text-[#94a3b8] border border-white/10'
                          }`}>{c.status}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-[#f1f5f9]">{c.name}</span>
                            <span className="text-xs text-[#64748b] ml-2">{c.email}</span>
                          </div>
                          <span className="text-xs text-[#64748b] flex-shrink-0">{c.subject || '—'}</span>
                          <span className="text-xs text-[#64748b] flex-shrink-0">{formatShortDate(c.created_at)}</span>
                        </div>
                        {isExpanded && (
                          <div className="px-4 pb-4 pl-12 animate-fadeIn">
                            <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 mb-3">
                              <p className="text-xs text-[#64748b] uppercase mb-1">Full Message</p>
                              <p className="text-sm text-[#94a3b8] whitespace-pre-wrap">{c.message || 'No message provided.'}</p>
                              {c.phone && <p className="text-xs text-[#64748b] mt-2">Phone: {c.phone}</p>}
                              {c.company && <p className="text-xs text-[#64748b]">Company: {c.company}</p>}
                              {c.service && <p className="text-xs text-[#64748b]">Service: {c.service}</p>}
                            </div>
                            <div className="flex gap-2">
                              {c.status !== 'read' && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateEnquiryStatus(c.id, 'read') }}
                                  disabled={!!isLoading}
                                  className="btn btn-primary text-[10px] px-3 py-1.5 font-bold disabled:opacity-50"
                                >
                                  {isLoading ? '...' : 'Mark as Read'}
                                </button>
                              )}
                              {c.status !== 'resolved' && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateEnquiryStatus(c.id, 'resolved') }}
                                  disabled={!!isLoading}
                                  className="btn btn-ghost text-[10px] px-3 py-1.5 font-bold disabled:opacity-50 border border-white/10"
                                >
                                  {isLoading ? '...' : 'Resolve'}
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteEnquiry(c.id) }}
                                disabled={!!isLoading}
                                className="text-[10px] px-3 py-1.5 bg-[#f43f5e]/15 text-[#fb7185] border border-[#f43f5e]/30 rounded-xl hover:bg-[#f43f5e]/25 transition-colors font-bold disabled:opacity-50"
                              >
                                {isLoading ? '...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
              {data.contacts.length === 0 && <p className="p-8 text-center text-[#64748b]">No enquiries yet. They will appear here when visitors submit the contact form.</p>}
              {data.contacts.length > 0 && data.contacts.filter(c => enquiryFilter === 'all' || c.status === enquiryFilter).length === 0 && (
                <p className="p-8 text-center text-[#64748b]">No enquiries matching this filter.</p>
              )}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="glass-card-static p-6 animate-fadeIn">
            <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 uppercase tracking-wide">Platform Activity Feed</h3>
            <div className="space-y-4">
              {data.recentActivities.map(a => (
                <div key={a.id} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                    a.type === 'signup' ? 'bg-emerald-500/15 border border-emerald-500/30' :
                    a.type === 'subscription' || a.type === 'payment' ? 'bg-[#3b82f6]/15 border border-[#3b82f6]/30' :
                    a.type === 'cancellation' ? 'bg-[#f43f5e]/15 border border-[#f43f5e]/30' :
                    a.type === 'contact' ? 'bg-[#7c3aed]/15 border border-[#7c3aed]/30' :
                    'bg-white/5 border border-white/10'
                  }`}>
                    {a.type === 'signup' ? '👤' : a.type === 'subscription' ? '💳' : a.type === 'payment' ? '💷' : a.type === 'cancellation' ? '❌' : a.type === 'contact' ? '📩' : '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#f1f5f9]">{a.title || a.type}</p>
                    <p className="text-xs text-[#64748b]">{a.description}</p>
                  </div>
                  <span className="text-xs text-[#64748b] whitespace-nowrap">{formatDate(a.created_at)}</span>
                </div>
              ))}
              {data.recentActivities.length === 0 && <p className="text-sm text-[#64748b]">No activity yet</p>}
            </div>
          </div>
        )}

        {/* Change 14: Platform Stats Tab */}
        {activeTab === 'platform_stats' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="kpi-card animate-fadeIn stagger-1">
                <p className="text-xs text-[#64748b] uppercase mb-1">Leads This Month</p>
                <p className="text-4xl font-bold text-[#60a5fa]">{data.platformStats.leadsThisMonth}</p>
                <p className="text-xs text-[#64748b] mt-2">Captured across all accounts</p>
              </div>
              <div className="kpi-card animate-fadeIn stagger-2">
                <p className="text-xs text-[#64748b] uppercase mb-1">Clients This Month</p>
                <p className="text-4xl font-bold text-emerald-400">{data.platformStats.clientsThisMonth}</p>
                <p className="text-xs text-[#64748b] mt-2">Added across all accounts</p>
              </div>
              <div className="kpi-card animate-fadeIn stagger-3">
                <p className="text-xs text-[#64748b] uppercase mb-1">Appointments This Month</p>
                <p className="text-4xl font-bold text-[#a855f7]">{data.platformStats.appointmentsThisMonth}</p>
                <p className="text-xs text-[#64748b] mt-2">Booked across all accounts</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="kpi-card animate-fadeIn stagger-4">
                <p className="text-xs text-[#64748b] uppercase mb-1">Active Automations</p>
                <p className="text-4xl font-bold text-amber-400">{data.platformStats.activeAutomations}</p>
                <p className="text-xs text-[#64748b] mt-2">Running across all accounts</p>
              </div>
              <div className="kpi-card animate-fadeIn stagger-5">
                <p className="text-xs text-[#64748b] uppercase mb-1">Most Popular Plan</p>
                <p className="text-4xl font-bold text-cyan-400 capitalize">{data.platformStats.mostPopularPlan}</p>
                <p className="text-xs text-[#64748b] mt-2">Highest active subscription count</p>
              </div>
              <div className="kpi-card animate-fadeIn stagger-6">
                <p className="text-xs text-[#64748b] uppercase mb-1">Avg Leads Per User</p>
                <p className="text-4xl font-bold text-[#fb7185]">{data.platformStats.avgLeadsPerUser}</p>
                <p className="text-xs text-[#64748b] mt-2">Platform-wide average</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
