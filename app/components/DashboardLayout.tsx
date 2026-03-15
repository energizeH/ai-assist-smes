'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import NotificationBell from './NotificationBell'
import { ToastProvider } from './Toast'

const navItems = [
  { id: 'overview', label: 'Overview', href: '/dashboard', icon: '📊' },
  { id: 'clients', label: 'Clients', href: '/dashboard/clients', icon: '👥' },
  { id: 'leads', label: 'Leads', href: '/dashboard/leads', icon: '🎯' },
  { id: 'appointments', label: 'Appointments', href: '/dashboard/appointments', icon: '📅' },
  { id: 'automations', label: 'Automations', href: '/dashboard/automations', icon: '⚡' },
  { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
  { id: 'knowledge', label: 'Knowledge Base', href: '/dashboard/knowledge-base', icon: '🧠' },
  { id: 'billing', label: 'Billing', href: '/dashboard/billing', icon: '💳' },
  { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // Fetch user info
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUserName(data.user?.name || data.user?.email || '')
          setUserEmail(data.user?.email || '')
        }
      } catch {}
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <ToastProvider>
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Top Header */}
      <header className="nav-glass sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold gradient-text">
                AI-Assist
              </Link>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#94a3b8] hover:bg-white/5 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {userName && (
                <span className="hidden sm:block text-sm text-[#94a3b8]">
                  {userName}
                </span>
              )}
              <NotificationBell />
              {userEmail.toLowerCase() === 'hxssxn772@gmail.com' && (
                <Link
                  href="/ceo"
                  className="text-xs bg-gradient-to-r from-[#3b82f6] to-[#7c3aed] text-white px-3 py-1.5 rounded-lg font-semibold hover:from-[#2563eb] hover:to-[#6d28d9] transition-all"
                >
                  CEO
                </Link>
              )}
              <Link
                href="/support"
                className="text-sm text-[#94a3b8] hover:text-[#60a5fa] transition-colors"
              >
                Support
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-sm text-[#f43f5e] hover:text-[#fb7185] font-medium transition-colors disabled:opacity-50"
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10 bg-[rgba(10,15,30,0.6)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-all flex items-center gap-1.5 ${
                  isActive(item.href)
                    ? 'border-[#3b82f6] text-[#60a5fa]'
                    : 'border-transparent text-[#64748b] hover:text-[#f1f5f9] hover:border-white/20'
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-white/10 shadow-lg">
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#3b82f6]/15 text-[#60a5fa]'
                    : 'text-[#94a3b8] hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-2xl font-bold text-[#f1f5f9]">{title}</h1>}
            {subtitle && <p className="text-[#94a3b8] mt-1">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
    </ToastProvider>
  )
}
