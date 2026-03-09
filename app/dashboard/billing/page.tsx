'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  CreditCardIcon, 
  CheckCircle2Icon, 
  ExternalLinkIcon, 
  ArrowRightIcon,
  ShieldCheckIcon,
  ZapIcon,
  StarIcon,
  ClockIcon
} from 'lucide-react';

interface Subscription {
  id: string;
  status: string;
  plan_name: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Error opening portal:', error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your plan and payment methods</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  Current Plan
                </span>
                {subscription?.status === 'active' && (
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <CheckCircle2Icon className="w-4 h-4 mr-1" /> Active
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                {subscription?.plan_name || 'Free Trial'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {subscription ? 
                  `Next billing date: ${new Date(subscription.current_period_end).toLocaleDateString()}` : 
                  'You are currently on the free trial period.'
                }
              </p>
            </div>
            <div className="p-8 bg-gray-50 dark:bg-gray-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CreditCardIcon className="w-5 h-5 mr-2" />
                Payments handled securely via Stripe
              </div>
              <button
                onClick={handleManageBilling}
                className="inline-flex items-center px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                Manage Billing Details
                <ExternalLinkIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Usage Summary</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">AI Tokens / Monthly Limit</span>
                  <span className="font-bold">4,250 / 10,000</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[42.5%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Leads Captured</span>
                  <span className="font-bold">128 / Unlimited</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Upgrade */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20 sticky top-6">
            <ZapIcon className="w-12 h-12 mb-4 text-blue-200" />
            <h3 className="text-xl font-bold mb-2">Need More Power?</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Upgrade to the Enterprise plan for unlimited AI agents, custom voice models, and priority 24/7 support.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited AI Agents',
                'Advanced Analytics',
                'API Access',
                'Custom Integrations'
              ].map((feature, i) => (
                <li key={i} className="flex items-center text-sm font-medium">
                  <StarIcon className="w-4 h-4 mr-2 text-yellow-400" /> {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center">
              View All Plans
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
