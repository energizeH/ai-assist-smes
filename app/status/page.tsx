import Link from 'next/link'

export const metadata = {
  title: 'System Status | AI-Assist for SMEs',
  description: 'Check the current operational status of AI-Assist for SMEs services including platform, API, payments, and email delivery.',
}

const services = [
  {
    name: 'Platform & Dashboard',
    description: 'Web application, login, and dashboard access',
    status: 'operational',
  },
  {
    name: 'Authentication',
    description: 'Sign up, login, password reset, and session management',
    status: 'operational',
  },
  {
    name: 'AI Chat & Automations',
    description: 'AI receptionist, chatbot, and workflow automations',
    status: 'operational',
  },
  {
    name: 'Payments & Billing',
    description: 'Stripe checkout, subscription management, and invoicing',
    status: 'operational',
  },
  {
    name: 'Email Delivery',
    description: 'Transactional emails, notifications, and contact form',
    status: 'operational',
  },
  {
    name: 'Database & API',
    description: 'Supabase database, REST API, and data operations',
    status: 'operational',
  },
]

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    operational: { label: 'Operational', color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' },
    degraded: { label: 'Degraded', color: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-500' },
    partial: { label: 'Partial Outage', color: 'text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-500' },
    major: { label: 'Major Outage', color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
    maintenance: { label: 'Maintenance', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  }
  const c = config[status] || config.operational

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.color} ${c.bg}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

export default function StatusPage() {
  const allOperational = services.every(s => s.status === 'operational')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            AI-Assist for SMEs
          </Link>
          <span className="text-sm text-gray-500 dark:text-gray-400">System Status</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Overall Status */}
        <div className={`rounded-xl p-6 mb-8 ${allOperational ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${allOperational ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
            <h1 className={`text-xl font-semibold ${allOperational ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
              {allOperational ? 'All Systems Operational' : 'Some Systems Experiencing Issues'}
            </h1>
          </div>
          <p className={`mt-2 text-sm ${allOperational ? 'text-green-600 dark:text-green-300' : 'text-yellow-600 dark:text-yellow-300'}`}>
            {allOperational
              ? 'All services are running normally. No incidents reported.'
              : 'We are aware of the issue and working to resolve it.'}
          </p>
        </div>

        {/* Service List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Services</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {services.map((service) => (
              <div key={service.name} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">{service.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{service.description}</p>
                </div>
                <StatusBadge status={service.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Uptime Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This page is updated manually. For urgent issues, contact{' '}
            <a href="mailto:support@aiassistsmes.co.uk" className="text-blue-600 hover:underline">
              support@aiassistsmes.co.uk
            </a>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Last checked: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Recent Incidents */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Incidents</h2>
          </div>
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No incidents reported in the last 90 days.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 py-6 mt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <Link href="/" className="hover:text-blue-600">← Back to AI-Assist</Link>
          <span>&copy; {new Date().getFullYear()} AI-Assist for SMEs Ltd.</span>
        </div>
      </footer>
    </div>
  )
}
