import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with AI-Assist for SMEs. Book a free consultation, ask about our AI automation services, or request support. Based in Birmingham, UK.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
