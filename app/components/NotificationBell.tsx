'use client'

import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Notification {
  id: string
  type: string
  description: string
  created_at: string
  metadata?: Record<string, unknown>
}

const NOTIFICATION_TYPES = [
  'welcome',
  'subscription_change',
  'payment_success',
  'payment_failed',
  'system_update',
]

function getNotificationIcon(type: string) {
  switch (type) {
    case 'welcome':
      return (
        <svg className="w-4 h-4 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'payment_success':
      return (
        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'payment_failed':
      return (
        <svg className="w-4 h-4 text-[#f43f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'subscription_change':
      return (
        <svg className="w-4 h-4 text-[#a855f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    case 'system_update':
      return (
        <svg className="w-4 h-4 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    default:
      return (
        <svg className="w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [lastReadAt, setLastReadAt] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const stored = localStorage.getItem('notifications_last_read')
    if (stored) setLastReadAt(stored)
    fetchNotifications(stored)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async (readTimestamp: string | null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('activities')
        .select('id, type, description, created_at, metadata')
        .eq('user_id', user.id)
        .in('type', NOTIFICATION_TYPES)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error || !data) return

      setNotifications(data)

      if (readTimestamp) {
        const unread = data.filter(n => new Date(n.created_at) > new Date(readTimestamp))
        setUnreadCount(unread.length)
      } else {
        setUnreadCount(data.length)
      }
    } catch {
      // Silently fail — notifications are non-critical
    }
  }

  const handleOpen = () => {
    const opening = !isOpen
    setIsOpen(opening)

    if (opening && unreadCount > 0) {
      const now = new Date().toISOString()
      localStorage.setItem('notifications_last_read', now)
      setLastReadAt(now)
      setUnreadCount(0)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 text-[#94a3b8] hover:text-[#60a5fa] hover:bg-white/5 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#f43f5e] rounded-full border-2 border-[#0a0f1e]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass-card-strong rounded-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold text-[#f1f5f9]">Notifications</h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <svg className="w-8 h-8 mx-auto text-[#64748b] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm text-[#64748b]">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const isUnread = lastReadAt
                  ? new Date(notification.created_at) > new Date(lastReadAt)
                  : true

                return (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
                      isUnread ? 'bg-[#3b82f6]/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#f1f5f9] leading-snug">
                          {notification.description}
                        </p>
                        <p className="text-xs text-[#64748b] mt-1">
                          {timeAgo(notification.created_at)}
                        </p>
                      </div>
                      {isUnread && (
                        <div className="flex-shrink-0 mt-1.5">
                          <span className="w-2 h-2 bg-[#3b82f6] rounded-full block" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
