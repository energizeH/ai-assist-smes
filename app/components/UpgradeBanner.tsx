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
      <div className="inline-flex items-center gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#fbbf24] px-3 py-1.5 rounded-lg text-xs font-medium">
        <span>⚡</span>
        <span>{text}</span>
        <Link href="/plans" className="text-[#60a5fa] hover:underline ml-1">
          Upgrade
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-[#3b82f6]/10 to-[#7c3aed]/10 border border-[#3b82f6]/20 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚡</span>
        <div>
          <p className="text-sm font-medium text-[#f1f5f9]">{text}</p>
          <p className="text-xs text-[#64748b] mt-0.5">Get access to more powerful features</p>
        </div>
      </div>
      <Link
        href="/plans"
        className="btn btn-primary text-sm whitespace-nowrap flex-shrink-0"
      >
        View Plans
      </Link>
    </div>
  )
}
