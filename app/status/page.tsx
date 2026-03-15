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
    operational: { label: 'Operational', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
    degraded: { label: 'Degraded', color: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-500' },
    partial: { label: 'Partial Outage', color: 'text-orange-400', bg: 'bg-orange-500/10', dot: 'bg-orange-500' },
    major: { label: 'Major Outage', color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-500' },
    maintenance: { label: 'Maintenance', color: 'text-[#60a5fa]', bg: 'bg-[#3b82f6]/10', dot: 'bg-[#3b82f6]' },
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
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Header */}
      <header className="nav-glass sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            AI-Assist for SMEs
          </Link>
          <span className="text-sm text-[#94a3b8]">System Status</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Overall Status */}
        <div className={`glass-card-static rounded-xl p-6 mb-8 ${allOperational ? 'border-emerald-500/30' : 'border-yellow-500/30'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${allOperational ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`} />
            <h1 className={`text-xl font-semibold ${allOperational ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {allOperational ? 'All Systems Operational' : 'Some Systems Experiencing Issues'}
            </h1>
          </div>
          <p className={`mt-2 text-sm ${allOperational ? 'text-emerald-400/70' : 'text-yellow-400/70'}`}>
            {allOperational
              ? 'All services are running normally. No incidents reported.'
              : 'We are aware of the issue and working to resolve it.'}
          </p>
        </div>

        {/* Service List */}
        <div className="glass-card-static rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-[#f1f5f9]">Services</h2>
          </div>
          <div className="divide-y divide-white/10">
            {services.map((service) => (
              <div key={service.name} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#f1f5f9] text-sm">{service.name}</h3>
                  <p className="text-xs text-[#94a3b8] mt-0.5">{service.description}</p>
                </div>
                <StatusBadge status={service.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Uptime Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#94a3b8]">
            This page is updated manually. For urgent issues, contact{' '}
            <a href="mailto:support@aiassistsmes.co.uk" className="text-[#60a5fa] hover:text-[#3b82f6] transition">
              support@aiassistsmes.co.uk
            </a>
          </p>
          <p className="text-xs text-[#64748b] mt-2">
            Last checked: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Recent Incidents */}
        <div className="mt-8 glass-card-static rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-[#f1f5f9]">Recent Incidents</h2>
          </div>
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-[#94a3b8]">No incidents reported in the last 90 days.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 py-6 mt-8 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-[#64748b]">
          <Link href="/" className="hover:text-[#60a5fa] transition">&larr; Back to AI-Assist</Link>
          <span>&copy; {new Date().getFullYear()} AI-Assist for SMEs Ltd.</span>
        </div>
      </footer>
    </div>
  )
}
