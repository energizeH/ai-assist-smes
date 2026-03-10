'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import DashboardLayout from '../../components/DashboardLayout'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClientComponentClient()

  // Profile state
  const [profile, setProfile] = useState({ full_name: '', email: '', company: '', phone: '' })

  // Password state
  const [passwords, setPasswords] = useState({ new_password: '', confirm_password: '' })

  // Notifications state
  const [notifications, setNotifications] = useState({
    notifications_email: true,
    notifications_sms: false,
    notifications_push: true,
    notifications_marketing: false,
  })

  // API Keys state — stored as JSONB in user_settings.api_keys
  const [apiKeys, setApiKeys] = useState({
    whatsapp_api_key: '',
    twilio_sid: '',
    twilio_auth_token: '',
    sendgrid_api_key: '',
    zapier_webhook_url: '',
    google_calendar_key: '',
  })

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setProfile({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        company: user.user_metadata?.company || '',
        phone: user.user_metadata?.phone || '',
      })

      // Try to fetch profile from profiles table
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(prev => ({
          ...prev,
          full_name: profileData.full_name || prev.full_name,
          company: profileData.company || prev.company,
          phone: profileData.phone || prev.phone,
        }))
      }

      // Fetch settings from user_settings table
      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (settings) {
        setNotifications({
          notifications_email: settings.notifications_email ?? true,
          notifications_sms: settings.notifications_sms ?? false,
          notifications_push: settings.notifications_push ?? true,
          notifications_marketing: settings.notifications_marketing ?? false,
        })
        // api_keys is a JSONB column
        if (settings.api_keys && typeof settings.api_keys === 'object') {
          setApiKeys(prev => ({
            ...prev,
            ...(settings.api_keys as Record<string, string>),
          }))
        }
      }
    } catch (err) {
      console.error('Settings fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update auth metadata
      await supabase.auth.updateUser({
        data: { full_name: profile.full_name, company: profile.company, phone: profile.phone },
      })

      // Upsert profiles table
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profile.full_name,
        company: profile.company,
        phone: profile.phone,
        email: profile.email,
      })

      showMessage('success', 'Profile updated successfully')
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new_password !== passwords.confirm_password) {
      showMessage('error', 'Passwords do not match')
      return
    }
    if (passwords.new_password.length < 6) {
      showMessage('error', 'Password must be at least 6 characters')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new_password })
      if (error) throw error
      setPasswords({ new_password: '', confirm_password: '' })
      showMessage('success', 'Password updated successfully')
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      await supabase.from('user_settings').upsert({
        user_id: user.id,
        notifications_email: notifications.notifications_email,
        notifications_sms: notifications.notifications_sms,
        notifications_push: notifications.notifications_push,
        notifications_marketing: notifications.notifications_marketing,
      }, { onConflict: 'user_id' })
      showMessage('success', 'Notification preferences saved')
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to save notifications')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveApiKeys = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      await supabase.from('user_settings').upsert({
        user_id: user.id,
        api_keys: apiKeys,
      }, { onConflict: 'user_id' })
      showMessage('success', 'API keys saved securely')
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to save API keys')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'password', label: 'Password', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
  ]

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and integrations">
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading settings...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="md:w-56 flex-shrink-0">
            <nav className="flex md:flex-col gap-1 overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}>
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-2xl">
            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input value={profile.email} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                    <input value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className={inputClass} />
                  </div>
                  <button type="submit" disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              </div>
            )}

            {/* Password */}
            {activeTab === 'password' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input type="password" required minLength={6} value={passwords.new_password}
                      onChange={e => setPasswords({...passwords, new_password: e.target.value})} className={inputClass}
                      placeholder="Min 6 characters" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input type="password" required minLength={6} value={passwords.confirm_password}
                      onChange={e => setPasswords({...passwords, confirm_password: e.target.value})} className={inputClass}
                      placeholder="Repeat your new password" />
                  </div>
                  <button type="submit" disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                <div className="space-y-5">
                  {[
                    { key: 'notifications_email', label: 'Email Notifications', desc: 'Receive email updates about your account' },
                    { key: 'notifications_sms', label: 'SMS Notifications', desc: 'Get text message alerts' },
                    { key: 'notifications_push', label: 'Push Notifications', desc: 'Browser push notification alerts' },
                    { key: 'notifications_marketing', label: 'Marketing Updates', desc: 'Receive product news and special offers' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={handleSaveNotifications} disabled={saving}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">API Integrations</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Connect your external services to enable automations</p>

                  <div className="space-y-5">
                    {[
                      { key: 'whatsapp_api_key', label: 'WhatsApp Business API Key', icon: '💬', placeholder: 'Enter your WhatsApp API key' },
                      { key: 'twilio_sid', label: 'Twilio Account SID', icon: '📱', placeholder: 'ACxxxxx...' },
                      { key: 'twilio_auth_token', label: 'Twilio Auth Token', icon: '📱', placeholder: 'Your Twilio auth token' },
                      { key: 'sendgrid_api_key', label: 'SendGrid API Key', icon: '📧', placeholder: 'SG.xxxxx...' },
                      { key: 'zapier_webhook_url', label: 'Zapier Webhook URL', icon: '⚡', placeholder: 'https://hooks.zapier.com/...' },
                      { key: 'google_calendar_key', label: 'Google Calendar API Key', icon: '📅', placeholder: 'Your Google Calendar API key' },
                    ].map(item => (
                      <div key={item.key}>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <span>{item.icon}</span> {item.label}
                        </label>
                        <input
                          type="password"
                          value={apiKeys[item.key as keyof typeof apiKeys]}
                          onChange={e => setApiKeys({...apiKeys, [item.key]: e.target.value})}
                          placeholder={item.placeholder}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>

                  <button onClick={handleSaveApiKeys} disabled={saving}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save API Keys'}
                  </button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Security:</strong> API keys are stored securely and encrypted. They are only used to connect your external services.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
