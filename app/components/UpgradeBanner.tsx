'use client'

import Link from 'next/link'

interface UpgradeBannerProps {
  feature?: string
  message?: string
  compact?: boolean
}

export default function UpgradeBanner({ feature, message, compact = false }: UpgradeBannerProps) {
  const text = message || (feature
    ? `Upgrade your plan to unlock ${feature}`
    : 'Upgrade your plan to unlock more features')

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-medium">
        <span>⚡</span>
        <span>{text}</span>
        <Link href="/plans" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
          Upgrade
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚡</span>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{text}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Get access to more powerful features</p>
        </div>
      </div>
      <Link
        href="/plans"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0"
      >
        View Plans
      </Link>
    </div>
  )
}
