'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface SubscriptionData {
  plan: string | null
  status: string | null
  isActive: boolean
  isPastDue: boolean
  isCancelled: boolean
  isFree: boolean
  currentPeriodEnd: string | null
  loading: boolean
}

// Feature limits by plan
const PLAN_FEATURES: Record<string, {
  maxClients: number
  maxLeads: number
  maxAutomations: number
  maxAppointments: number
  hasAdvancedAnalytics: boolean
  hasApiAccess: boolean
  hasCrmIntegration: boolean
  hasWhatsApp: boolean
}> = {
  free: {
    maxClients: 10,
    maxLeads: 25,
    maxAutomations: 2,
    maxAppointments: 20,
    hasAdvancedAnalytics: false,
    hasApiAccess: false,
    hasCrmIntegration: false,
    hasWhatsApp: false,
  },
  starter: {
    maxClients: 100,
    maxLeads: 500,
    maxAutomations: 10,
    maxAppointments: 200,
    hasAdvancedAnalytics: false,
    hasApiAccess: false,
    hasCrmIntegration: false,
    hasWhatsApp: true,
  },
  professional: {
    maxClients: 1000,
    maxLeads: 5000,
    maxAutomations: 50,
    maxAppointments: -1, // unlimited
    hasAdvancedAnalytics: true,
    hasApiAccess: false,
    hasCrmIntegration: true,
    hasWhatsApp: true,
  },
  enterprise: {
    maxClients: -1,
    maxLeads: -1,
    maxAutomations: -1,
    maxAppointments: -1,
    hasAdvancedAnalytics: true,
    hasApiAccess: true,
    hasCrmIntegration: true,
    hasWhatsApp: true,
  },
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData>({
    plan: null,
    status: null,
    isActive: false,
    isPastDue: false,
    isCancelled: false,
    isFree: true,
    currentPeriodEnd: null,
    loading: true,
  })
  const supabase = createClientComponentClient()

  const fetchSubscription = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setSubscription({
          plan: data.plan,
          status: data.status,
          isActive: data.status === 'active' || data.status === 'trialing',
          isPastDue: data.status === 'past_due',
          isCancelled: data.status === 'cancelled',
          isFree: false,
          currentPeriodEnd: data.current_period_end,
          loading: false,
        })
      } else {
        setSubscription(prev => ({ ...prev, loading: false }))
      }
    } catch (err) {
      console.error('Subscription fetch error:', err)
      setSubscription(prev => ({ ...prev, loading: false }))
    }
  }, [supabase])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const getFeatures = () => {
    const planKey = subscription.isActive ? (subscription.plan || 'free') : 'free'
    return PLAN_FEATURES[planKey] || PLAN_FEATURES.free
  }

  const canUseFeature = (feature: keyof typeof PLAN_FEATURES.free): boolean => {
    const features = getFeatures()
    const value = features[feature]
    if (typeof value === 'boolean') return value
    return true // number limits checked separately
  }

  const isWithinLimit = (feature: 'maxClients' | 'maxLeads' | 'maxAutomations' | 'maxAppointments', currentCount: number): boolean => {
    const features = getFeatures()
    const limit = features[feature]
    if (limit === -1) return true // unlimited
    return currentCount < limit
  }

  const getLimit = (feature: 'maxClients' | 'maxLeads' | 'maxAutomations' | 'maxAppointments'): number => {
    const features = getFeatures()
    return features[feature]
  }

  return {
    ...subscription,
    getFeatures,
    canUseFeature,
    isWithinLimit,
    getLimit,
    refetch: fetchSubscription,
  }
}
