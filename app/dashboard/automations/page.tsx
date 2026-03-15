'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import DashboardLayout from '../../components/DashboardLayout'
import ToggleSwitch from '../../components/ToggleSwitch'

interface Automation {
  id: string
  name: string
  type: string
  trigger_event: string
  action_description: string
  is_active: boolean
  created_at: string
}

const automationTypes = [
  { id: 'email', label: 'Email' },
  { id: 'sms', label: 'SMS' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'webhook', label: 'Webhook' },
]

const triggerEvents = [
  { id: 'new_lead', label: 'New Lead Created' },
  { id: 'new_client', label: 'New Client Added' },
  { id: 'appointment_booked', label: 'Appointment Booked' },
  { id: 'form_submitted', label: 'Form Submitted' },
  { id: 'lead_qualified', label: 'Lead Qualified' },
]

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', type: 'email', trigger_event: 'new_lead', action_description: '', is_active: true
  })
  const supabase = createClientComponentClient()

  useEffect(() => { fetchAutomations() }, [])

  const fetchAutomations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error: err } = await supabase
        .from('automations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (err) throw err
      setAutomations(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (editingAutomation) {
        const { error: err } = await supabase
          .from('automations')
          .update({ ...form })
          .eq('id', editingAutomation.id)
          .eq('user_id', user.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase
          .from('automations')
          .insert([{ ...form, user_id: user.id }])
        if (err) throw err
      }
      await fetchAutomations()
      setShowForm(false)
      setEditingAutomation(null)
      resetForm()
      setSuccess(editingAutomation ? 'Automation updated' : 'Automation created')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (id: string, currentState: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error: err } = await supabase
        .from('automations')
        .update({ is_active: !currentState })
        .eq('id', id)
        .eq('user_id', user.id)
      if (err) throw err
      await fetchAutomations()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this automation?')) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error: err } = await supabase.from('automations').delete().eq('id', id).eq('user_id', user.id)
      if (err) throw err
      await fetchAutomations()
      setSuccess('Automation deleted')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (auto: Automation) => {
    setEditingAutomation(auto)
    setForm({
      name: auto.name, type: auto.type, trigger_event: auto.trigger_event,
      action_description: auto.action_description, is_active: auto.is_active,
    })
    setShowForm(true)
  }

  const generateActionDescription = (type: string, trigger: string) => {
    const typeLabel = automationTypes.find(t => t.id === type)?.label || type
    const triggerLabel = triggerEvents.find(t => t.id === trigger)?.label || trigger
    return `Send ${typeLabel.toLowerCase()} notification when ${triggerLabel.toLowerCase()}`
  }

  const resetForm = () => {
    setForm({ name: '', type: 'email', trigger_event: 'new_lead', action_description: generateActionDescription('email', 'new_lead'), is_active: true })
  }

  const openAddForm = () => {
    setEditingAutomation(null)
    setForm({ name: '', type: 'email', trigger_event: 'new_lead', action_description: generateActionDescription('email', 'new_lead'), is_active: true })
    setShowForm(true)
  }

  const activeCount = automations.filter(a => a.is_active).length

  return (
    <DashboardLayout title="Automations" subtitle="Create workflows that run automatically">
      {error && <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">{success}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Automations</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{automations.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Paused</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{automations.length - activeCount}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end mb-6">
        <button onClick={openAddForm} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + New Automation
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{editingAutomation ? 'Edit Automation' : 'New Automation'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Welcome email for new leads"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select value={form.type} onChange={e => {
                    const newType = e.target.value
                    setForm({...form, type: newType, action_description: generateActionDescription(newType, form.trigger_event)})
                  }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    {automationTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger</label>
                  <select value={form.trigger_event} onChange={e => {
                    const newTrigger = e.target.value
                    setForm({...form, trigger_event: newTrigger, action_description: generateActionDescription(form.type, newTrigger)})
                  }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    {triggerEvents.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Auto-generated action</p>
                <p className="text-sm text-gray-900 dark:text-white">{form.action_description}</p>
              </div>
              <ToggleSwitch
                enabled={form.is_active}
                onChange={(val) => setForm({...form, is_active: val})}
                label={form.is_active ? 'Active' : 'Paused'}
                size="sm"
              />
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : (editingAutomation ? 'Update' : 'Create Automation')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg font-medium transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Automations List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading automations...</div>
      ) : automations.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-3xl mb-3">⚡</p>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No automations yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Create your first automation to streamline your workflows</p>
        </div>
      ) : (
        <div className="space-y-4">
          {automations.map(auto => (
            <div key={auto.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                  <ToggleSwitch
                    enabled={auto.is_active}
                    onChange={() => handleToggle(auto.id, auto.is_active)}
                    size="sm"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{auto.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium capitalize">{auto.type}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium">
                      {triggerEvents.find(t => t.id === auto.trigger_event)?.label || auto.trigger_event}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${auto.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                      {auto.is_active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{auto.action_description}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(auto)} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium">Edit</button>
                <button onClick={() => handleDelete(auto.id)} className="text-red-600 dark:text-red-400 hover:text-red-700 text-sm font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
