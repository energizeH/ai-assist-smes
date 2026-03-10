import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Sign up for AI-Assist for SMEs and start automating your business with AI-powered tools. Free to register, no credit card required.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
