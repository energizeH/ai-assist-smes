'use client'

import { useMemo } from 'react'

interface PasswordStrengthProps {
  password: string
}

interface CriteriaResult {
  label: string
  met: boolean
}

export function checkPasswordStrength(password: string) {
  const criteria: CriteriaResult[] = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least 1 lowercase letter', met: /[a-z]/.test(password) },
    { label: 'At least 1 number', met: /[0-9]/.test(password) },
    { label: 'At least 1 special character (!@#$%^&*...)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) },
  ]
  const metCount = criteria.filter(c => c.met).length
  return { criteria, metCount }
}

export function isPasswordStrongEnough(password: string): boolean {
  const { metCount } = checkPasswordStrength(password)
  return metCount >= 4
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const { criteria, metCount } = useMemo(() => checkPasswordStrength(password), [password])

  if (!password) return null

  const getStrengthLabel = () => {
    if (metCount <= 2) return 'Weak'
    if (metCount === 3) return 'Fair'
    if (metCount === 4) return 'Good'
    return 'Strong'
  }

  const getStrengthColour = () => {
    if (metCount <= 2) return 'bg-red-500'
    if (metCount === 3) return 'bg-orange-500'
    if (metCount === 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthTextColour = () => {
    if (metCount <= 2) return 'text-red-600 dark:text-red-400'
    if (metCount === 3) return 'text-orange-600 dark:text-orange-400'
    if (metCount === 4) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  const strengthPercent = (metCount / 5) * 100

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getStrengthColour()}`}
            style={{ width: `${strengthPercent}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${getStrengthTextColour()}`}>
          {getStrengthLabel()}
        </span>
      </div>
      <ul className="space-y-1">
        {criteria.map((c) => (
          <li key={c.label} className="flex items-center gap-1.5 text-xs">
            {c.met ? (
              <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={c.met ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
              {c.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
