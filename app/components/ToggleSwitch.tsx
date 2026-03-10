'use client'

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  description?: string
  size?: 'sm' | 'md'
  disabled?: boolean
}

export default function ToggleSwitch({ enabled, onChange, label, description, size = 'md', disabled = false }: ToggleSwitchProps) {
  const trackSize = size === 'sm' ? 'w-11 h-6' : 'w-14 h-7'
  const thumbSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const thumbTranslate = size === 'sm'
    ? (enabled ? 'translate-x-[22px]' : 'translate-x-[3px]')
    : (enabled ? 'translate-x-[30px]' : 'translate-x-[3px]')

  return (
    <div className={`flex items-center justify-between gap-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>}
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label || 'Toggle'}
        onClick={() => onChange(!enabled)}
        disabled={disabled}
        className={`
          relative inline-flex items-center flex-shrink-0 ${trackSize} rounded-full 
          transition-colors duration-200 ease-in-out cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          ${enabled 
            ? 'bg-blue-600' 
            : 'bg-gray-300 dark:bg-gray-600'
          }
        `}
      >
        <span
          className={`
            ${thumbSize} rounded-full bg-white shadow-sm
            transform transition-transform duration-200 ease-in-out
            ${thumbTranslate}
          `}
        />
        {/* ON/OFF label inside the track */}
        <span className={`
          absolute text-[9px] font-bold uppercase tracking-wide select-none
          ${enabled 
            ? 'left-1.5 text-white' 
            : (size === 'sm' ? 'right-1 text-gray-500 dark:text-gray-400' : 'right-1.5 text-gray-500 dark:text-gray-400')
          }
        `}>
          {enabled ? 'ON' : 'OFF'}
        </span>
      </button>
    </div>
  )
}
