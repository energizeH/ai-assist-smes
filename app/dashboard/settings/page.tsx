'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../components/DashboardLayout'
import ToggleSwitch from '../../components/ToggleSwitch'
import PasswordStrength, { isPasswordStrongEnough } from '../../components/PasswordStrength'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

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

  // Subscription state (for Enterprise detection)
  const [userPlan, setUserPlan] = useState<string>('')

  // Webhook key state
  const [webhookKey, setWebhookKey] = useState<string>('')
  const [regeneratingKey, setRegeneratingKey] = useState(false)

  // Data rights state
  const [exportingData, setExportingData] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
        // Webhook key
        if (settings.webhook_key) {
          setWebhookKey(settings.webhook_key)
        }
      }

      // Fetch subscription for plan detection
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (subscription?.plan) {
        setUserPlan(subscription.plan)
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
    if (!isPasswordStrongEnough(passwords.new_password)) {
      showMessage('error', 'Password is not strong enough. Please meet at least 4 of the 5 requirements.')
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

  const generateWebhookKey = async (regenerate = false) => {
    if (regenerate && !confirm('Are you sure you want to regenerate your webhook key? Existing integrations using the old key will stop working.')) {
      return
    }
    setRegeneratingKey(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const newKey = crypto.randomUUID()
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        webhook_key: newKey,
      }, { onConflict: 'user_id' })
      setWebhookKey(newKey)
      showMessage('success', regenerate ? 'Webhook key regenerated' : 'Webhook key generated')
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to generate webhook key')
    } finally {
      setRegeneratingKey(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showMessage('success', 'Copied to clipboard')
  }

  const handleExportData = async () => {
    setExportingData(true)
    try {
      const response = await fetch('/api/user/export-data')
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Export failed')
      }
      // Trigger download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-assist-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      showMessage('success', 'Your data export has been downloaded.')
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to export data')
    } finally {
      setExportingData(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      showMessage('error', 'Please type "DELETE MY ACCOUNT" exactly to confirm.')
      return
    }
    setDeletingAccount(true)
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'DELETE MY ACCOUNT' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Deletion failed')

      // Sign out and redirect
      await supabase.auth.signOut()
      router.push('/')
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to delete account')
    } finally {
      setDeletingAccount(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'password', label: 'Password', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    ...(userPlan === 'enterprise' ? [{ id: 'email_templates', label: 'Email Templates', icon: '✉️' }] : []),
    { id: 'data', label: 'My Data', icon: '🛡️' },
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
                    <input type="password" required minLength={8} value={passwords.new_password}
                      onChange={e => setPasswords({...passwords, new_password: e.target.value})} className={inputClass}
                      placeholder="Min 8 characters" />
                    <PasswordStrength password={passwords.new_password} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input type="password" required minLength={8} value={passwords.confirm_password}
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
                  <ToggleSwitch
                    enabled={notifications.notifications_email}
                    onChange={(val) => setNotifications({ ...notifications, notifications_email: val })}
                    label="Email Notifications"
                    description="Receive email updates about your account"
                  />
                  <ToggleSwitch
                    enabled={notifications.notifications_sms}
                    onChange={(val) => setNotifications({ ...notifications, notifications_sms: val })}
                    label="SMS Notifications"
                    description="Get text message alerts"
                  />
                  <ToggleSwitch
                    enabled={notifications.notifications_push}
                    onChange={(val) => setNotifications({ ...notifications, notifications_push: val })}
                    label="Push Notifications"
                    description="Browser push notification alerts"
                  />
                  <ToggleSwitch
                    enabled={notifications.notifications_marketing}
                    onChange={(val) => setNotifications({ ...notifications, notifications_marketing: val })}
                    label="Marketing Updates"
                    description="Receive product news and special offers"
                  />
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
                {/* Lead Webhook URL */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lead Webhook URL</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Receive leads from external systems via this unique webhook endpoint.
                  </p>

                  {webhookKey ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={`https://aiassistsmes.co.uk/api/leads/webhook?key=${webhookKey}`}
                          className={`${inputClass} font-mono text-xs`}
                        />
                        <button
                          onClick={() => copyToClipboard(`https://aiassistsmes.co.uk/api/leads/webhook?key=${webhookKey}`)}
                          className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors"
                          title="Copy URL"
                        >
                          📋
                        </button>
                      </div>
                      <button
                        onClick={() => generateWebhookKey(true)}
                        disabled={regeneratingKey}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                      >
                        {regeneratingKey ? 'Regenerating...' : 'Regenerate Key'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => generateWebhookKey(false)}
                      disabled={regeneratingKey}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {regeneratingKey ? 'Generating...' : 'Generate Webhook Key'}
                    </button>
                  )}

                  <div className="mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Usage:</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Send POST requests with JSON body containing: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">name</code>, <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">email</code>, <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">phone</code>, <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">company</code>, <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">notes</code>
                    </p>
                  </div>
                </div>

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

            {/* Email Templates (Enterprise only) */}
            {activeTab === 'email_templates' && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700 p-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">✉️</div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Custom Email Templates</h2>
                  <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    Enterprise Feature — Coming Soon
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    You&apos;ll soon be able to design and customise your own email templates for:
                  </p>
                  <ul className="text-left max-w-xs mx-auto space-y-2 mb-8">
                    {['Welcome emails', 'Appointment confirmations', 'Follow-up sequences', 'Invoice notifications'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 max-w-sm mx-auto">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We&apos;re building this feature now. You&apos;ll be notified when it&apos;s ready.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Data Rights (GDPR) */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Data Rights</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Under the UK GDPR and Data Protection Act 2018, you have the right to access, export, and delete your personal data.
                  </p>

                  {/* Data Export */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Export Your Data</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Download a copy of all your personal data in a machine-readable format (JSON). This includes your profile, settings, appointments, and leads data. This is your right under Article 20 (Right to Data Portability).
                    </p>
                    <button
                      onClick={handleExportData}
                      disabled={exportingData}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {exportingData ? 'Preparing Download...' : 'Download My Data'}
                    </button>
                  </div>

                  {/* Account Deletion */}
                  <div>
                    <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2">Delete Your Account</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Permanently delete your account and all associated data. This action cannot be undone. Under Article 17 (Right to Erasure), this will:
                    </p>
                    <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc pl-5 mb-4 space-y-1">
                      <li>Cancel any active subscription</li>
                      <li>Delete your profile, settings, and preferences</li>
                      <li>Delete all your appointments and leads data</li>
                      <li>Remove your authentication credentials</li>
                    </ul>

                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center gap-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete My Account
                      </button>
                    ) : (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-3">
                          This is permanent and cannot be undone. Type <strong>&quot;DELETE MY ACCOUNT&quot;</strong> to confirm:
                        </p>
                        <input
                          type="text"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Type DELETE MY ACCOUNT"
                          className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm mb-3"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount || deleteConfirmation !== 'DELETE MY ACCOUNT'}
                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingAccount ? 'Deleting...' : 'Permanently Delete'}
                          </button>
                          <button
                            onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmation('') }}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Your rights:</strong> You can also exercise your data rights by emailing{' '}
                    <a href="mailto:privacy@aiassistsmes.co.uk" className="underline">privacy@aiassistsmes.co.uk</a>.
                    We will respond within one month as required by UK GDPR.
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
