import type { Metadata } from 'next'
import './globals.css'
import ThemeToggle from './components/ThemeToggle'

export const metadata: Metadata = {
  title: 'AI-Assist for SMEs | AI Automation Consultancy',
  description: 'Transform your small business with AI automation solutions. Workflow automation, AI chatbots, and process optimization for SMEs.',
  keywords: 'AI automation, SME consulting, workflow automation, AI chatbot, business automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  )
}
