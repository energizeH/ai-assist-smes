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

    // Fetch all platform data using service role (bypasses RLS)
    const [
      { count: totalUsers },
      { data: allProfiles },
      { count: totalClients },
      { count: totalLeads },
      { count: totalAppointments },
      { data: allSubscriptions },
      { data: recentContacts },
      { data: recentActivities },
    ] = await Promise.all([
      admin.from('profiles').select('*', { count: 'exact', head: true }),
      admin.from('profiles').select('id, email, full_name, company, created_at').order('created_at', { ascending: false }).limit(50),
      admin.from('clients').select('*', { count: 'exact', head: true }),
      admin.from('leads').select('*', { count: 'exact', head: true }),
      admin.from('appointments').select('*', { count: 'exact', head: true }),
      admin.from('subscriptions').select('*').order('created_at', { ascending: false }),
      admin.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(20),
      admin.from('activities').select('*').order('created_at', { ascending: false }).limit(30),
    ])

    // Subscription stats
    const activeSubscriptions = allSubscriptions?.filter(s => s.status === 'active') || []
    const trialSubscriptions = allSubscriptions?.filter(s => s.status === 'trialing') || []
    const pastDueSubscriptions = allSubscriptions?.filter(s => s.status === 'past_due') || []
    const cancelledSubscriptions = allSubscriptions?.filter(s => s.status === 'cancelled') || []

    const planBreakdown = {
      starter: activeSubscriptions.filter(s => s.plan === 'starter').length,
      professional: activeSubscriptions.filter(s => s.plan === 'professional').length,
      enterprise: activeSubscriptions.filter(s => s.plan === 'enterprise').length,
    }

    // Monthly recurring revenue estimate
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
    const recentUsers = allProfiles?.filter(p =>
      new Date(p.created_at) >= thirtyDaysAgo
    ) || []

    // Contact submissions stats
    const newContacts = recentContacts?.filter(c => c.status === 'new') || []

    return NextResponse.json({
      overview: {
        totalUsers: totalUsers || 0,
        totalClients: totalClients || 0,
        totalLeads: totalLeads || 0,
        totalAppointments: totalAppointments || 0,
        mrr,
        newUsersLast30Days: recentUsers.length,
      },
      subscriptions: {
        active: activeSubscriptions.length,
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
      },
      users: allProfiles || [],
      contacts: recentContacts || [],
      newContactCount: newContacts.length,
      recentActivities: recentActivities || [],
    })
  } catch (error) {
    console.error('CEO API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
