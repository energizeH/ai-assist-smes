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
      {error && <div className="mb-4 bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#fb7185] px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg">{success}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="kpi-card">
          <p className="text-sm font-medium text-[#94a3b8] mb-1">Total Automations</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">{automations.length}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-[#94a3b8] mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-[#94a3b8] mb-1">Paused</p>
          <p className="text-2xl font-bold text-[#94a3b8]">{automations.length - activeCount}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end mb-6">
        <button onClick={openAddForm} className="btn btn-primary">
          + New Automation
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="glass-card-strong p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#f1f5f9] mb-6">{editingAutomation ? 'Edit Automation' : 'New Automation'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Welcome email for new leads"
                  className="input w-full text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Type</label>
                  <select value={form.type} onChange={e => {
                    const newType = e.target.value
                    setForm({...form, type: newType, action_description: generateActionDescription(newType, form.trigger_event)})
                  }}
                    className="input w-full text-sm">
                    {automationTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Trigger</label>
                  <select value={form.trigger_event} onChange={e => {
                    const newTrigger = e.target.value
                    setForm({...form, trigger_event: newTrigger, action_description: generateActionDescription(form.type, newTrigger)})
                  }}
                    className="input w-full text-sm">
                    {triggerEvents.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                <p className="text-xs font-medium text-[#64748b] mb-1">Auto-generated action</p>
                <p className="text-sm text-[#f1f5f9]">{form.action_description}</p>
              </div>
              <ToggleSwitch
                enabled={form.is_active}
                onChange={(val) => setForm({...form, is_active: val})}
                label={form.is_active ? 'Active' : 'Paused'}
                size="sm"
              />
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 btn btn-primary py-2 disabled:opacity-50">
                  {saving ? 'Saving...' : (editingAutomation ? 'Update' : 'Create Automation')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-[#f1f5f9] py-2 rounded-lg font-medium transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Automations List */}
      {loading ? (
        <div className="text-center py-12 text-[#94a3b8]">Loading automations...</div>
      ) : automations.length === 0 ? (
        <div className="text-center py-12 glass-card-static">
          <p className="text-3xl mb-3">⚡</p>
          <p className="text-[#94a3b8] text-lg">No automations yet</p>
          <p className="text-sm text-[#64748b] mt-2">Create your first automation to streamline your workflows</p>
        </div>
      ) : (
        <div className="space-y-4">
          {automations.map(auto => (
            <div key={auto.id} className="glass-card-static p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                  <ToggleSwitch
                    enabled={auto.is_active}
                    onChange={() => handleToggle(auto.id, auto.is_active)}
                    size="sm"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-[#f1f5f9]">{auto.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="badge-info capitalize">{auto.type}</span>
                    <span className="badge-violet">
                      {triggerEvents.find(t => t.id === auto.trigger_event)?.label || auto.trigger_event}
                    </span>
                    <span className={auto.is_active ? 'badge-success' : 'bg-white/10 text-[#94a3b8] px-2 py-0.5 text-xs rounded-full font-medium'}>
                      {auto.is_active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <p className="text-sm text-[#94a3b8] mt-1">{auto.action_description}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(auto)} className="text-[#60a5fa] hover:text-[#93bbfc] text-sm font-medium">Edit</button>
                <button onClick={() => handleDelete(auto.id)} className="text-[#f43f5e] hover:text-[#fb7185] text-sm font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
