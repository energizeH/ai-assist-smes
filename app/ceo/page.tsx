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
  }
  users: any[]
  contacts: any[]
  newContactCount: number
  recentActivities: any[]
}

export default function CEOPage() {
  const [data, setData] = useState<CEOData | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'subscriptions' | 'revenue' | 'contacts' | 'activity'>('overview')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [modalAction, setModalAction] = useState<string | null>(null)
  const [grantPlan, setGrantPlan] = useState('professional')
  const [giftMonths, setGiftMonths] = useState(1)
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

  const getUserSubscription = (userId: string) => {
    return data?.subscriptions.all.find(s => s.user_id === userId)
  }

  if (!authorized || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading CEO Dashboard...</p>
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">A</div>
              <div>
                <h1 className="text-sm font-bold text-white">AI-Assist for SMEs</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">CEO Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">{CEO_EMAIL}</span>
              <Link href="/dashboard" className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                ← Back to App
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {actionMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-xl animate-pulse ${
          actionMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {actionMessage.text}
        </div>
      )}

      {/* User Action Modal */}
      {selectedUser && modalAction && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-2">
              {modalAction === 'grant_free_access' && 'Grant Free Access'}
              {modalAction === 'change_plan' && 'Change Plan'}
              {modalAction === 'revoke_access' && 'Revoke Access'}
              {modalAction === 'delete_user' && 'Delete User'}
              {modalAction === 'reactivate' && 'Reactivate Subscription'}
              {modalAction === 'gift_membership' && 'Gift Membership'}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              User: <span className="text-white font-medium">{selectedUser.full_name || selectedUser.email}</span>
              <br />
              <span className="text-gray-500">{selectedUser.email}</span>
            </p>

            {(modalAction === 'grant_free_access' || modalAction === 'change_plan' || modalAction === 'gift_membership') && (
              <div className="mb-4">
                <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Select Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {['starter', 'professional', 'enterprise'].map(p => (
                    <button
                      key={p}
                      onClick={() => setGrantPlan(p)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        grantPlan === p
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
                <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Gift Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 6, 12].map(m => (
                    <button
                      key={m}
                      onClick={() => setGiftMonths(m)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        giftMonths === m
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {m} {m === 1 ? 'month' : 'months'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {modalAction === 'revoke_access' && (
              <p className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                This will cancel their subscription. They will lose access to paid features.
              </p>
            )}

            {modalAction === 'delete_user' && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                This will permanently delete this user and all their data. This cannot be undone.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedUser(null); setModalAction(null) }}
                className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => executeAction(modalAction, selectedUser.id, grantPlan)}
                disabled={!!actionLoading}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  modalAction === 'delete_user'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : modalAction === 'revoke_access'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : modalAction === 'gift_membership'
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
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
        <div className="flex gap-1 mb-8 bg-gray-900 rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Users', value: data.overview.totalUsers, icon: '👥', color: 'from-blue-500/20 to-blue-600/5 border-blue-500/30' },
                { label: 'MRR', value: `£${data.overview.mrr}`, icon: '💷', color: 'from-green-500/20 to-green-600/5 border-green-500/30' },
                { label: 'Active Subs', value: data.subscriptions.active, icon: '✅', color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30' },
                { label: 'New (30d)', value: data.overview.newUsersLast30Days, icon: '📈', color: 'from-purple-500/20 to-purple-600/5 border-purple-500/30' },
                { label: 'Total Leads', value: data.overview.totalLeads, icon: '🎯', color: 'from-orange-500/20 to-orange-600/5 border-orange-500/30' },
                { label: 'Enquiries', value: data.newContactCount, icon: '📩', color: 'from-pink-500/20 to-pink-600/5 border-pink-500/30' },
              ].map((kpi) => (
                <div key={kpi.label} className={`bg-gradient-to-br ${kpi.color} border rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{kpi.icon}</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Subscription Breakdown + Stripe Balance */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Plan Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { plan: 'Starter (£49/mo)', count: data.subscriptions.planBreakdown.starter, color: 'bg-blue-500', revenue: data.subscriptions.planBreakdown.starter * 49 },
                    { plan: 'Professional (£149/mo)', count: data.subscriptions.planBreakdown.professional, color: 'bg-purple-500', revenue: data.subscriptions.planBreakdown.professional * 149 },
                    { plan: 'Enterprise (£299/mo)', count: data.subscriptions.planBreakdown.enterprise, color: 'bg-orange-500', revenue: data.subscriptions.planBreakdown.enterprise * 299 },
                  ].map(p => (
                    <div key={p.plan} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${p.color}`} />
                        <span className="text-sm text-gray-300">{p.plan}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">{p.count} users</span>
                        <span className="text-xs text-gray-500 ml-2">£{p.revenue}/mo</span>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-800 pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-200">Total MRR</span>
                      <span className="text-lg font-bold text-green-400">£{data.overview.mrr}/mo</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Projected ARR</span>
                      <span className="text-sm font-semibold text-green-300">£{(data.overview.mrr * 12).toLocaleString()}/yr</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Stripe Balance</h3>
                {data.stripe.balance ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Available</p>
                      {data.stripe.balance.available.map((b, i) => (
                        <p key={i} className="text-3xl font-bold text-green-400">
                          £{b.amount.toFixed(2)}
                          <span className="text-xs text-gray-500 ml-1 uppercase">{b.currency}</span>
                        </p>
                      ))}
                      {data.stripe.balance.available.length === 0 && (
                        <p className="text-3xl font-bold text-gray-500">£0.00</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pending</p>
                      {data.stripe.balance.pending.map((b, i) => (
                        <p key={i} className="text-xl font-semibold text-yellow-400">
                          £{b.amount.toFixed(2)}
                          <span className="text-xs text-gray-500 ml-1 uppercase">{b.currency}</span>
                        </p>
                      ))}
                      {data.stripe.balance.pending.length === 0 && (
                        <p className="text-xl font-semibold text-gray-500">£0.00</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Stripe not connected</p>
                )}

                <div className="mt-6 pt-4 border-t border-gray-800">
                  <h4 className="text-xs text-gray-500 mb-2">Subscription Status</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-green-400">{data.subscriptions.active}</p>
                      <p className="text-[10px] text-green-300/70 uppercase">Active</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-blue-400">{data.subscriptions.trialing}</p>
                      <p className="text-[10px] text-blue-300/70 uppercase">Trial</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-red-400">{data.subscriptions.pastDue}</p>
                      <p className="text-[10px] text-red-300/70 uppercase">Past Due</p>
                    </div>
                    <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-gray-400">{data.subscriptions.cancelled}</p>
                      <p className="text-[10px] text-gray-300/70 uppercase">Cancelled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users + Recent Contacts side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Recent Signups</h3>
                <div className="space-y-3">
                  {data.users.slice(0, 5).map((u) => (
                    <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">
                          {(u.full_name || u.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{u.full_name || 'No name'}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600">{formatShortDate(u.created_at)}</span>
                    </div>
                  ))}
                  {data.users.length === 0 && <p className="text-sm text-gray-600">No users yet</p>}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                  Recent Enquiries
                  {data.newContactCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{data.newContactCount} NEW</span>
                  )}
                </h3>
                <div className="space-y-3">
                  {data.contacts.slice(0, 5).map((c) => (
                    <div key={c.id} className="py-2 border-b border-gray-800/50 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">{c.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          c.status === 'new' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700 text-gray-400'
                        }`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-gray-500">{c.email} · {c.subject || 'No subject'}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">{c.message}</p>
                    </div>
                  ))}
                  {data.contacts.length === 0 && <p className="text-sm text-gray-600">No enquiries yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab - with management controls */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">All Users ({data.users.length})</h3>
                <p className="text-xs text-gray-500">Click actions to manage users</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map(u => {
                      const sub = getUserSubscription(u.id)
                      const isCeo = u.email?.toLowerCase() === CEO_EMAIL
                      return (
                        <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">
                                {(u.full_name || u.email || '?')[0].toUpperCase()}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-white">{u.full_name || '—'}</span>
                                {isCeo && <span className="ml-2 text-[9px] bg-gradient-to-r from-blue-600 to-purple-600 text-white px-1.5 py-0.5 rounded font-bold">CEO</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">{u.email}</td>
                          <td className="px-4 py-3">
                            {sub ? (
                              <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                                sub.plan === 'enterprise' ? 'bg-orange-500/20 text-orange-400' :
                                sub.plan === 'professional' ? 'bg-purple-500/20 text-purple-400' :
                                sub.plan === 'starter' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-gray-700 text-gray-400'
                              }`}>{sub.plan || 'free'}</span>
                            ) : (
                              <span className="text-xs text-gray-600">No plan</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {sub ? (
                              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                sub.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                sub.status === 'past_due' ? 'bg-red-500/20 text-red-400' :
                                sub.status === 'trialing' ? 'bg-blue-500/20 text-blue-400' :
                                sub.status === 'cancelled' ? 'bg-gray-700 text-gray-400' :
                                'bg-gray-700 text-gray-400'
                              }`}>{sub.status}</span>
                            ) : (
                              <span className="text-xs text-gray-600">Free</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{formatShortDate(u.created_at)}</td>
                          <td className="px-4 py-3">
                            {!isCeo && (
                              <div className="flex items-center justify-end gap-1">
                                {!sub || sub.status === 'cancelled' ? (
                                  <button
                                    onClick={() => { setSelectedUser(u); setModalAction('grant_free_access'); setGrantPlan('professional') }}
                                    className="text-[10px] px-2 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded hover:bg-green-600/30 transition-colors font-bold"
                                  >
                                    Grant Access
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => { setSelectedUser(u); setModalAction('change_plan'); setGrantPlan(sub.plan || 'professional') }}
                                      className="text-[10px] px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded hover:bg-blue-600/30 transition-colors font-bold"
                                    >
                                      Change Plan
                                    </button>
                                    <button
                                      onClick={() => { setSelectedUser(u); setModalAction('revoke_access') }}
                                      className="text-[10px] px-2 py-1 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded hover:bg-yellow-600/30 transition-colors font-bold"
                                    >
                                      Revoke
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => { setSelectedUser(u); setModalAction('gift_membership'); setGrantPlan('professional'); setGiftMonths(1) }}
                                  className="text-[10px] px-2 py-1 bg-pink-600/20 text-pink-400 border border-pink-600/30 rounded hover:bg-pink-600/30 transition-colors font-bold"
                                >
                                  Gift
                                </button>
                                <button
                                  onClick={() => { setSelectedUser(u); setModalAction('delete_user') }}
                                  className="text-[10px] px-2 py-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded hover:bg-red-600/30 transition-colors font-bold"
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
              {data.users.length === 0 && <p className="p-8 text-center text-gray-600">No users yet</p>}
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-green-400">{data.subscriptions.active}</p>
                <p className="text-xs text-green-300/70 uppercase mt-1">Active</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-blue-400">{data.subscriptions.trialing}</p>
                <p className="text-xs text-blue-300/70 uppercase mt-1">Trialing</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-red-400">{data.subscriptions.pastDue}</p>
                <p className="text-xs text-red-300/70 uppercase mt-1">Past Due</p>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-gray-400">{data.subscriptions.cancelled}</p>
                <p className="text-xs text-gray-300/70 uppercase mt-1">Cancelled</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">All Subscriptions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Period End</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subscriptions.all.map(s => {
                      const user = data.users.find(u => u.id === s.user_id)
                      return (
                        <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-300">{user?.email || s.user_id?.slice(0, 8) + '...'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                              s.plan === 'enterprise' ? 'bg-orange-500/20 text-orange-400' :
                              s.plan === 'professional' ? 'bg-purple-500/20 text-purple-400' :
                              s.plan === 'starter' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-700 text-gray-400'
                            }`}>{s.plan || 'free'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                              s.status === 'active' ? 'bg-green-500/20 text-green-400' :
                              s.status === 'past_due' ? 'bg-red-500/20 text-red-400' :
                              s.status === 'trialing' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-700 text-gray-400'
                            }`}>{s.status}</span>
                            {s.is_gifted && (
                              <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded font-bold">GIFTED</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{s.current_period_end ? formatShortDate(s.current_period_end) : '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{formatShortDate(s.created_at)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {data.subscriptions.all.length === 0 && <p className="p-8 text-center text-gray-600">No subscriptions yet</p>}
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/30 rounded-xl p-6">
                <p className="text-xs text-green-300/70 uppercase mb-1">Monthly Recurring Revenue</p>
                <p className="text-4xl font-bold text-green-400">£{data.overview.mrr}</p>
                <p className="text-xs text-gray-500 mt-2">From {data.subscriptions.active - data.subscriptions.gifted} paying subscriptions{data.subscriptions.gifted > 0 ? ` (${data.subscriptions.gifted} gifted excluded)` : ''}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-6">
                <p className="text-xs text-blue-300/70 uppercase mb-1">Annual Run Rate</p>
                <p className="text-4xl font-bold text-blue-400">£{(data.overview.mrr * 12).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">Projected yearly revenue</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-6">
                <p className="text-xs text-purple-300/70 uppercase mb-1">Avg Revenue Per User</p>
                <p className="text-4xl font-bold text-purple-400">
                  £{data.subscriptions.active > 0 ? (data.overview.mrr / data.subscriptions.active).toFixed(0) : '0'}
                </p>
                <p className="text-xs text-gray-500 mt-2">Per active subscriber</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Recent Charges (Stripe)</h3>
              {data.stripe.recentCharges.length > 0 ? (
                <div className="space-y-3">
                  {data.stripe.recentCharges.map(c => (
                    <div key={c.id} className="flex items-center justify-between py-3 border-b border-gray-800/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-white">{c.customer_email || 'Unknown customer'}</p>
                        <p className="text-xs text-gray-500">{c.description || 'Subscription payment'} · {formatDate(c.created)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${c.status === 'succeeded' ? 'text-green-400' : 'text-red-400'}`}>
                          £{c.amount.toFixed(2)}
                        </p>
                        <span className={`text-[10px] uppercase font-bold ${
                          c.status === 'succeeded' ? 'text-green-500' : 'text-red-500'
                        }`}>{c.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No charges yet. Revenue will appear here once customers subscribe.</p>
              )}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Contact Enquiries ({data.contacts.length})
                {data.newContactCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{data.newContactCount} NEW</span>
                )}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Message</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.contacts.map(c => (
                    <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                          c.status === 'new' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700 text-gray-400'
                        }`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{c.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{c.subject || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{c.message}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.contacts.length === 0 && <p className="p-8 text-center text-gray-600">No enquiries yet. They will appear here when visitors submit the contact form.</p>}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Platform Activity Feed</h3>
            <div className="space-y-4">
              {data.recentActivities.map(a => (
                <div key={a.id} className="flex items-start gap-3 py-3 border-b border-gray-800/50 last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                    a.type === 'signup' ? 'bg-green-500/20 border border-green-500/30' :
                    a.type === 'subscription' || a.type === 'payment' ? 'bg-blue-500/20 border border-blue-500/30' :
                    a.type === 'cancellation' ? 'bg-red-500/20 border border-red-500/30' :
                    a.type === 'contact' ? 'bg-purple-500/20 border border-purple-500/30' :
                    'bg-gray-500/20 border border-gray-500/30'
                  }`}>
                    {a.type === 'signup' ? '👤' : a.type === 'subscription' ? '💳' : a.type === 'payment' ? '💷' : a.type === 'cancellation' ? '❌' : a.type === 'contact' ? '📩' : '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{a.title || a.type}</p>
                    <p className="text-xs text-gray-500">{a.description}</p>
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap">{formatDate(a.created_at)}</span>
                </div>
              ))}
              {data.recentActivities.length === 0 && <p className="text-sm text-gray-600">No activity yet</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
