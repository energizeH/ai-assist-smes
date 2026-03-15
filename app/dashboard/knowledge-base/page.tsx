'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface KBEntry {
  id: string
  category: string
  title: string
  content: string
  created_at: string
}

const categories = [
  { id: 'business_info', label: 'Business Info', icon: '🏢' },
  { id: 'services', label: 'Services', icon: '⚙️' },
  { id: 'faqs', label: 'FAQs', icon: '❓' },
  { id: 'pricing', label: 'Pricing', icon: '💰' },
  { id: 'policies', label: 'Policies', icon: '📋' },
]

export default function KnowledgeBasePage() {
  const [entries, setEntries] = useState<KBEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<KBEntry | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ category: 'business_info', title: '', content: '' })

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/knowledge-base')
      if (!res.ok) throw new Error('Failed to load knowledge base')
      const data = await res.json()
      setEntries(data.entries || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEntries() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const method = editingEntry ? 'PUT' : 'POST'
      const url = editingEntry ? `/api/knowledge-base/${editingEntry.id}` : '/api/knowledge-base'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to save entry')
      }
      await fetchEntries()
      setShowForm(false)
      setEditingEntry(null)
      setForm({ category: 'business_info', title: '', content: '' })
      setSuccess(editingEntry ? 'Entry updated' : 'Entry added to knowledge base')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this knowledge base entry?')) return
    try {
      const res = await fetch(`/api/knowledge-base/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchEntries()
      setSuccess('Entry deleted')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (entry: KBEntry) => {
    setEditingEntry(entry)
    setForm({ category: entry.category, title: entry.title, content: entry.content })
    setShowForm(true)
  }

  const openAddForm = () => {
    setEditingEntry(null)
    setForm({ category: 'business_info', title: '', content: '' })
    setShowForm(true)
  }

  const filtered = filterCategory === 'all' ? entries : entries.filter(e => e.category === filterCategory)

  return (
    <DashboardLayout title="AI Knowledge Base" subtitle="Train your AI chatbot with business information">
      {error && <div className="mb-4 bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#fb7185] px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg">{success}</div>}

      {/* Info Banner */}
      <div className="mb-6 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <h3 className="font-medium text-[#60a5fa]">How it works</h3>
            <p className="text-sm text-[#94a3b8] mt-1">
              Add your business information here so the AI chatbot can answer customer questions accurately.
              The more details you provide about your services, pricing, and policies, the better the AI will respond.
            </p>
          </div>
        </div>
      </div>

      {/* Stats & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#94a3b8]">{entries.length} entries</span>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="input text-sm">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <button onClick={openAddForm} className="btn btn-primary">
          + Add Entry
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="glass-card-strong p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#f1f5f9] mb-6">{editingEntry ? 'Edit Entry' : 'Add Knowledge Base Entry'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="input w-full text-sm">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Title *</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="e.g. Opening Hours, Return Policy, Service List"
                  className="input w-full text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Content *</label>
                <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={6}
                  placeholder="Enter the information the AI should know about this topic..."
                  className="input w-full text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 btn btn-primary py-2 disabled:opacity-50">
                  {saving ? 'Saving...' : (editingEntry ? 'Update Entry' : 'Add Entry')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-[#f1f5f9] py-2 rounded-lg font-medium transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div className="text-center py-12 text-[#94a3b8]">Loading knowledge base...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 glass-card-static">
          <p className="text-3xl mb-3">🧠</p>
          <p className="text-[#94a3b8] text-lg">No entries yet</p>
          <p className="text-sm text-[#64748b] mt-2">Add business information so the AI can answer customer questions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(entry => {
            const cat = categories.find(c => c.id === entry.category)
            return (
              <div key={entry.id} className="glass-card-static p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="badge-info">
                      {cat?.icon} {cat?.label || entry.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(entry)} className="text-[#60a5fa] hover:text-[#93bbfc] text-xs font-medium">Edit</button>
                    <button onClick={() => handleDelete(entry.id)} className="text-[#f43f5e] hover:text-[#fb7185] text-xs font-medium">Delete</button>
                  </div>
                </div>
                <h3 className="font-semibold text-[#f1f5f9] mb-2">{entry.title}</h3>
                <p className="text-sm text-[#94a3b8] line-clamp-3">{entry.content}</p>
                <p className="text-xs text-[#64748b] mt-3">Added {new Date(entry.created_at).toLocaleDateString('en-GB')}</p>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
