import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const CEO_EMAIL = 'hxssxn772@gmail.com'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  try {
    // Auth check - only CEO
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabaseAuth.auth.getSession()

    if (!session || session.user.email !== CEO_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const admin = getAdminClient()
    const stripe = getStripe()

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch all platform data using service role (bypasses RLS)
    const [
      { data: allProfiles },
      { count: totalClients },
      { count: totalLeads },
      { count: totalAppointments },
      { data: allSubscriptions },
      { data: recentContacts },
      { data: recentActivities },
      { count: leadsThisMonth },
      { count: clientsThisMonth },
      { count: appointmentsThisMonth },
      { count: activeAutomations },
      authUsersResponse,
    ] = await Promise.all([
      admin.from('profiles').select('id, email, full_name, company, created_at, last_active').order('created_at', { ascending: false }).limit(50),
      admin.from('clients').select('*', { count: 'exact', head: true }),
      admin.from('leads').select('*', { count: 'exact', head: true }),
      admin.from('appointments').select('*', { count: 'exact', head: true }),
      admin.from('subscriptions').select('*').order('created_at', { ascending: false }),
      admin.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(50),
      admin.from('activities').select('*').in('type', ['signup', 'subscription', 'contact', 'payment', 'cancellation', 'platform', 'admin']).order('created_at', { ascending: false }).limit(30),
      admin.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
      admin.from('clients').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
      admin.from('appointments').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
      admin.from('automations').select('*', { count: 'exact', head: true }).eq('is_active', true),
      admin.auth.admin.listUsers(),
    ])

    // Merge auth users with profiles to create a comprehensive user list
    const authUsers = authUsersResponse?.data?.users || []
    const profileMap = new Map((allProfiles || []).map(p => [p.id, p]))

    const mergedUsers = authUsers.map(authUser => {
      const profile = profileMap.get(authUser.id)
      return {
        id: authUser.id,
        email: profile?.email || authUser.email || '',
        full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
        company: profile?.company || authUser.user_metadata?.company || '',
        created_at: profile?.created_at || authUser.created_at,
        last_active: profile?.last_active || authUser.last_sign_in_at || null,
      }
    })

    // Also add any profile-only users not in auth (edge case)
    for (const profile of (allProfiles || [])) {
      if (!authUsers.find(a => a.id === profile.id)) {
        mergedUsers.push({
          id: profile.id,
          email: profile.email || '',
          full_name: profile.full_name || '',
          company: profile.company || '',
          created_at: profile.created_at,
          last_active: profile.last_active || null,
        })
      }
    }

    // Sort by created_at descending
    mergedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const totalUsers = mergedUsers.length

    // Subscription stats
    const activeSubscriptions = allSubscriptions?.filter(s => s.status === 'active') || []
    const trialSubscriptions = allSubscriptions?.filter(s => s.status === 'trialing') || []
    const pastDueSubscriptions = allSubscriptions?.filter(s => s.status === 'past_due') || []
    const cancelledSubscriptions = allSubscriptions?.filter(s => s.status === 'cancelled') || []

    // Exclude gifted/complimentary subscriptions from revenue calculations
    const paidSubscriptions = activeSubscriptions.filter(s => !s.is_gifted)
    const giftedSubscriptions = activeSubscriptions.filter(s => s.is_gifted)

    const planBreakdown = {
      starter: paidSubscriptions.filter(s => s.plan === 'starter').length,
      professional: paidSubscriptions.filter(s => s.plan === 'professional').length,
      enterprise: paidSubscriptions.filter(s => s.plan === 'enterprise').length,
    }

    // Monthly recurring revenue estimate (excludes gifted plans)
    const mrr = (planBreakdown.starter * 49) + (planBreakdown.professional * 149) + (planBreakdown.enterprise * 299)

    // Stripe revenue data (if available)
    let stripeBalance = null
    let recentCharges: any[] = []
    let stripeCustomerCount = 0

    if (stripe) {
      try {
        const [balance, charges, customers] = await Promise.all([
          stripe.balance.retrieve(),
          stripe.charges.list({ limit: 10 }),
          stripe.customers.list({ limit: 1 }),
        ])
        stripeBalance = {
          available: balance.available.map(b => ({ amount: b.amount / 100, currency: b.currency })),
          pending: balance.pending.map(b => ({ amount: b.amount / 100, currency: b.currency })),
        }
        recentCharges = charges.data.map(c => ({
          id: c.id,
          amount: (c.amount / 100),
          currency: c.currency,
          status: c.status,
          customer_email: c.billing_details?.email || c.receipt_email,
          description: c.description,
          created: new Date(c.created * 1000).toISOString(),
        }))
        stripeCustomerCount = customers.data.length > 0 ? (customers as any).total_count || customers.data.length : 0
      } catch (e) {
        console.error('Stripe data fetch error:', e)
      }
    }

    // User signups over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentUsers = mergedUsers.filter(u =>
      new Date(u.created_at) >= thirtyDaysAgo
    )

    // Contact submissions stats
    const newContacts = recentContacts?.filter(c => c.status === 'new') || []

    // Change 4: Churn rate calculation
    const cancelledThisMonth = cancelledSubscriptions.filter(s => {
      const updatedAt = s.updated_at || s.created_at
      return new Date(updatedAt) >= new Date(startOfMonth)
    }).length
    const startOfMonthTotal = activeSubscriptions.length + cancelledThisMonth
    const churnRate = startOfMonthTotal > 0
      ? parseFloat(((cancelledThisMonth / startOfMonthTotal) * 100).toFixed(1))
      : 0

    // Change 5: MRR growth calculation
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
    const thirtyDaysAgoDate = new Date()
    thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30)

    const previousMonthSubs = (allSubscriptions || []).filter(s => {
      const created = new Date(s.created_at)
      return created < thirtyDaysAgoDate && s.status === 'active' && !s.is_gifted
    })
    const getPlanPrice = (plan: string) => {
      if (plan === 'starter') return 49
      if (plan === 'professional') return 149
      if (plan === 'enterprise') return 299
      return 0
    }
    const previousMrr = previousMonthSubs.reduce((sum, s) => sum + getPlanPrice(s.plan), 0)
    const mrrGrowth = previousMrr > 0
      ? parseFloat((((mrr - previousMrr) / previousMrr) * 100).toFixed(1))
      : null

    // Change 9: Refunds this month
    let refundsThisMonth = 0
    if (stripe) {
      try {
        const startOfMonthUnix = Math.floor(new Date(startOfMonth).getTime() / 1000)
        const refunds = await stripe.refunds.list({ created: { gte: startOfMonthUnix }, limit: 100 })
        refundsThisMonth = refunds.data.reduce((sum, r) => sum + (r.amount / 100), 0)
      } catch (e) {
        console.error('Stripe refunds fetch error:', e)
      }
    }

    // Change 10: Historical MRR for bar chart (last 6 months)
    const mrrHistory: { month: string; mrr: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
      const monthLabel = monthDate.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })

      const activeThen = (allSubscriptions || []).filter(s => {
        const created = new Date(s.created_at)
        if (created > monthEnd) return false
        if (s.is_gifted) return false
        if (s.status === 'cancelled') {
          const updatedAt = s.updated_at ? new Date(s.updated_at) : null
          if (updatedAt && updatedAt < monthDate) return false
        }
        return true
      })
      const monthMrr = activeThen.reduce((sum, s) => sum + getPlanPrice(s.plan), 0)
      mrrHistory.push({ month: monthLabel, mrr: monthMrr })
    }

    // Change 11: Upcoming renewals (next 7 days)
    const upcomingRenewals = activeSubscriptions
      .filter(s => {
        const periodEnd = s.current_period_end ? new Date(s.current_period_end) : null
        return periodEnd && periodEnd >= now && periodEnd <= new Date(sevenDaysFromNow)
      })
      .map(s => {
        const user = mergedUsers.find(u => u.id === s.user_id)
        return {
          userId: s.user_id,
          email: user?.email || 'Unknown',
          plan: s.plan,
          renewalDate: s.current_period_end,
          amount: getPlanPrice(s.plan),
        }
      })

    // Change 12: Failed payments (past_due subscriptions with profile info)
    const failedPayments = pastDueSubscriptions.map(s => {
      const user = mergedUsers.find(u => u.id === s.user_id)
      return {
        userId: s.user_id,
        email: user?.email || 'Unknown',
        name: user?.full_name || 'Unknown',
        plan: s.plan,
        status: s.status,
        periodEnd: s.current_period_end,
      }
    })

    // Change 14: Platform stats
    const allPlans = (allSubscriptions || []).filter(s => s.status === 'active')
    const planCounts: Record<string, number> = {}
    allPlans.forEach(s => {
      planCounts[s.plan] = (planCounts[s.plan] || 0) + 1
    })
    const mostPopularPlan = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    const avgLeadsPerUser = (totalUsers && totalUsers > 0) ? parseFloat(((totalLeads || 0) / totalUsers).toFixed(1)) : 0

    return NextResponse.json({
      overview: {
        totalUsers,
        totalClients: totalClients || 0,
        totalLeads: totalLeads || 0,
        totalAppointments: totalAppointments || 0,
        mrr,
        newUsersLast30Days: recentUsers.length,
        churnRate,
        mrrGrowth,
        previousMrr,
      },
      subscriptions: {
        active: activeSubscriptions.length,
        gifted: giftedSubscriptions.length,
        trialing: trialSubscriptions.length,
        pastDue: pastDueSubscriptions.length,
        cancelled: cancelledSubscriptions.length,
        planBreakdown,
        all: allSubscriptions || [],
      },
      stripe: {
        balance: stripeBalance,
        recentCharges,
        customerCount: stripeCustomerCount,
        refundsThisMonth,
      },
      users: mergedUsers,
      contacts: recentContacts || [],
      newContactCount: newContacts.length,
      recentActivities: recentActivities || [],
      upcomingRenewals,
      failedPayments,
      mrrHistory,
      platformStats: {
        leadsThisMonth: leadsThisMonth || 0,
        clientsThisMonth: clientsThisMonth || 0,
        appointmentsThisMonth: appointmentsThisMonth || 0,
        activeAutomations: activeAutomations || 0,
        mostPopularPlan,
        avgLeadsPerUser,
      },
    })
  } catch (error) {
    console.error('CEO API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
