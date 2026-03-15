'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: string
  source?: string
  value?: number
  notes?: string
  created_at: string
}

const pipelineStages = [
  { id: 'new', label: 'New', color: 'badge-info' },
  { id: 'contacted', label: 'Contacted', color: 'badge-violet' },
  { id: 'qualified', label: 'Qualified', color: 'bg-[#a855f7]/15 text-[#a855f7]' },
  { id: 'closed_won', label: 'Converted', color: 'badge-success' },
  { id: 'closed_lost', label: 'Lost', color: 'badge-danger' },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'new', source: 'manual', value: 0, notes: '' })
  const [saving, setSaving] = useState(false)

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      if (!res.ok) throw new Error('Failed to load leads')
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeads() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const method = editingLead ? 'PUT' : 'POST'
      const url = editingLead ? `/api/leads/${editingLead.id}` : '/api/leads'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to save lead')
      }
      await fetchLeads()
      setShowForm(false)
      setEditingLead(null)
      setForm({ name: '', email: '', phone: '', company: '', status: 'new', source: 'manual', value: 0, notes: '' })
      setSuccess(editingLead ? 'Lead updated' : 'Lead added')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchLeads()
      setSuccess('Lead deleted')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleConvert = async (id: string) => {
    if (!confirm('Convert this lead to a client?')) return
    try {
      const res = await fetch(`/api/leads/${id}/convert`, { method: 'POST' })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to convert lead')
      }
      await fetchLeads()
      setSuccess('Lead converted to client successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setForm({ name: lead.name, email: lead.email, phone: lead.phone || '', company: lead.company || '', status: lead.status, source: lead.source || 'manual', value: lead.value || 0, notes: lead.notes || '' })
    setShowForm(true)
  }

  const openAddForm = () => {
    setEditingLead(null)
    setForm({ name: '', email: '', phone: '', company: '', status: 'new', source: 'manual', value: 0, notes: '' })
    setShowForm(true)
  }

  const filtered = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.company || '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalValue = filtered.reduce((sum, lead) => sum + (lead.value || 0), 0)

  return (
    <DashboardLayout title="Lead Management" subtitle="Track and manage your sales pipeline">
      {error && <div className="mb-4 bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#fb7185] px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg">{success}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="kpi-card">
          <p className="text-sm font-medium text-[#94a3b8] mb-1">Total Leads</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">{filtered.length}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-[#94a3b8] mb-1">Pipeline Value</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">£{totalValue.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-[#94a3b8] mb-1">Avg. Value</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">
            £{filtered.length ? Math.round(totalValue / filtered.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
            className="input w-full sm:w-64" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="input">
            <option value="all">All Statuses</option>
            {pipelineStages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <button onClick={openAddForm} className="btn btn-primary whitespace-nowrap">
          + Add Lead
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="glass-card-strong p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#f1f5f9] mb-6">{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="input w-full text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="input w-full text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="input w-full text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Company</label>
                  <input value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                    className="input w-full text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Stage</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                    className="input w-full text-sm">
                    {pipelineStages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Value (£)</label>
                  <input type="number" value={form.value} onChange={e => setForm({...form, value: parseInt(e.target.value) || 0})}
                    className="input w-full text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
                  className="input w-full text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 btn btn-primary py-2 disabled:opacity-50">
                  {saving ? 'Saving...' : (editingLead ? 'Update Lead' : 'Add Lead')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-[#f1f5f9] py-2 rounded-lg font-medium transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leads Table */}
      {loading ? (
        <div className="text-center py-12 text-[#94a3b8]">Loading leads...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 glass-card-static">
          <p className="text-[#94a3b8] text-lg">No leads yet</p>
          <p className="text-sm text-[#64748b] mt-2">Click &quot;Add Lead&quot; to start building your pipeline</p>
        </div>
      ) : (
        <div className="glass-card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="hidden md:table-cell">Company</th>
                  <th>Stage</th>
                  <th className="hidden sm:table-cell">Value</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => {
                  const stage = pipelineStages.find(s => s.id === lead.status)
                  return (
                    <tr key={lead.id}>
                      <td>
                        <div className="font-medium text-[#f1f5f9]">{lead.name}</div>
                        <div className="text-xs text-[#64748b]">{lead.email}</div>
                      </td>
                      <td className="text-sm text-[#94a3b8] hidden md:table-cell">{lead.company || '-'}</td>
                      <td>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${stage?.color || 'bg-white/10 text-[#94a3b8]'}`}>
                          {stage?.label || lead.status}
                        </span>
                      </td>
                      <td className="text-sm text-[#94a3b8] hidden sm:table-cell">
                        £{(lead.value || 0).toLocaleString()}
                      </td>
                      <td className="text-right">
                        <button onClick={() => handleEdit(lead)} className="text-[#60a5fa] hover:text-[#93bbfc] text-sm mr-2">Edit</button>
                        {lead.status !== 'closed_won' && (
                          <button onClick={() => handleConvert(lead.id)} className="text-emerald-400 hover:text-emerald-300 text-sm mr-2">Convert</button>
                        )}
                        <button onClick={() => handleDelete(lead.id)} className="text-[#f43f5e] hover:text-[#fb7185] text-sm">Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
