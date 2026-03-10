'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type ConsentStatus = 'accepted' | 'essential-only' | null

/**
 * ICO-compliant Cookie Consent Banner
 * - Shows on first visit (no cookies set until user acts)
 * - "Accept All" enables analytics cookies
 * - "Essential Only" blocks analytics cookies
 * - Links to Cookie Policy page
 * - Dispatches a custom event so other scripts can listen for consent changes
 */
export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent') as ConsentStatus
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setShow(true), 800)
      return () => clearTimeout(timer)
    }
    // If consent was already given, dispatch the status
    window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: consent }))
  }, [])

  const handleConsent = (choice: 'accepted' | 'essential-only') => {
    localStorage.setItem('cookie-consent', choice)
    setShow(false)
    // Dispatch event so analytics scripts can check consent
    window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: choice }))

    if (choice === 'essential-only') {
      // Remove any analytics cookies that may have been set
      removeAnalyticsCookies()
    }
  }

  const removeAnalyticsCookies = () => {
    // Remove known analytics cookies
    const analyticsCookies = ['_va_id', '_va_ses', '_ga', '_gid', '_gat']
    analyticsCookies.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
    })
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-slideUp">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">We value your privacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We use essential cookies to make our platform work. We&apos;d also like to set analytics cookies to help us understand how you use our service so we can improve it. Analytics cookies are only set if you give your consent.{' '}
              <Link href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Read our Cookie Policy
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => handleConsent('essential-only')}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors order-2 sm:order-1"
            >
              Essential Only
            </button>
            <button
              onClick={() => handleConsent('accepted')}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
            >
              Accept All Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Helper function for other components to check if analytics consent was given.
 * Usage: import { hasAnalyticsConsent } from '@/app/components/CookieConsent'
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('cookie-consent') === 'accepted'
}
