import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help with AI-Assist for SMEs. Browse FAQs, submit a support ticket, or contact our team for assistance with your AI automation tools.',
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children
}
