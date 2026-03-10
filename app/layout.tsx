import type { Metadata, Viewport } from 'next'
import './globals.css'
import ThemeToggle from './components/ThemeToggle'
import CookieConsent from './components/CookieConsent'

const siteUrl = 'https://ai-assist-smes.vercel.app'

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AI-Assist for SMEs | AI Automation for UK Small Businesses',
    template: '%s | AI-Assist for SMEs',
  },
  description: 'Transform your small business with AI automation. Workflow automation, AI chatbots, CRM, and process optimisation built for UK SMEs. Plans from £49/month.',
  keywords: ['AI automation', 'SME consulting', 'workflow automation', 'AI chatbot', 'business automation', 'UK small business', 'CRM', 'lead management'],
  authors: [{ name: 'AI-Assist for SMEs' }],
  creator: 'AI-Assist for SMEs',
  publisher: 'AI-Assist for SMEs',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    siteName: 'AI-Assist for SMEs',
    title: 'AI-Assist for SMEs | AI Automation for UK Small Businesses',
    description: 'Transform your small business with AI automation. Workflow automation, AI chatbots, CRM, and process optimisation built for UK SMEs.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AI-Assist for SMEs — AI Automation for Small Businesses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Assist for SMEs | AI Automation for UK Small Businesses',
    description: 'Transform your small business with AI automation. Plans from £49/month.',
    images: [`${siteUrl}/og-image.png`],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
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
        <CookieConsent />
      </body>
    </html>
  )
}
