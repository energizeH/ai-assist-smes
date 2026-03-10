import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Log in to your AI-Assist for SMEs dashboard to manage your AI automations, clients, leads, and business tools.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
