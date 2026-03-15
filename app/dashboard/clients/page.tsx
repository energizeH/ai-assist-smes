'use client'

import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import DashboardLayout from '../../components/DashboardLayout'

interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  status: string
  notes?: string
  photo_url?: string
  created_at: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [viewingClient, setViewingClient] = useState<Client | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'active', notes: '' })
  const [saving, setSaving] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      if (!res.ok) throw new Error('Failed to load clients')
      const data = await res.json()
      setClients(data.clients || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
    fetch('/api/setup/storage', { method: 'POST' }).catch(() => {})
  }, [])

  const uploadPhoto = async (clientId: string): Promise<string | null> => {
    if (!photoFile) return null
    setUploadingPhoto(true)
    try {
      const ext = photoFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${clientId}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('client-photos')
        .upload(path, photoFile, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage
        .from('client-photos')
        .getPublicUrl(path)
      return publicUrl
    } catch {
      return null
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const method = editingClient ? 'PUT' : 'POST'
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients'
      const payload: any = { ...form }

      if (photoFile && editingClient) {
        const photoUrl = await uploadPhoto(editingClient.id)
        if (photoUrl) payload.photo_url = photoUrl
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to save client')
      }
      const result = await res.json()

      if (photoFile && !editingClient && result.client?.id) {
        const photoUrl = await uploadPhoto(result.client.id)
        if (photoUrl) {
          await fetch(`/api/clients/${result.client.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, photo_url: photoUrl }),
          })
        }
      }

      await fetchClients()
      setShowForm(false)
      setEditingClient(null)
      setForm({ name: '', email: '', phone: '', company: '', status: 'active', notes: '' })
      setPhotoFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setSuccess(editingClient ? 'Client updated successfully' : 'Client added successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchClients()
      setSuccess('Client deleted')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setForm({ name: client.name, email: client.email || '', phone: client.phone || '', company: client.company || '', status: client.status, notes: client.notes || '' })
    setPhotoFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setShowForm(true)
  }

  const openAddForm = () => {
    setEditingClient(null)
    setForm({ name: '', email: '', phone: '', company: '', status: 'active', notes: '' })
    setPhotoFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setShowForm(true)
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout title="Clients" subtitle="Manage your client relationships">
      {error && <div className="mb-4 bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#fb7185] px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg">{success}</div>}

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input w-full sm:max-w-md"
        />
        <button onClick={openAddForm} className="btn btn-primary whitespace-nowrap">
          + Add Client
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="glass-card-strong p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#f1f5f9] mb-6">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="input w-full text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
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
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="input w-full text-sm">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
                  className="input w-full text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Photo</label>
                <div className="flex items-center gap-3">
                  {(editingClient?.photo_url || photoFile) && (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoFile ? URL.createObjectURL(photoFile) : editingClient?.photo_url || ''}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={e => setPhotoFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-[#94a3b8] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#3b82f6]/20 file:text-[#60a5fa] hover:file:bg-[#3b82f6]/30"
                  />
                </div>
                <p className="text-xs text-[#64748b] mt-1">JPG, PNG, or WebP. Max 5MB.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 btn btn-primary py-2 disabled:opacity-50">
                  {saving ? 'Saving...' : (editingClient ? 'Update Client' : 'Add Client')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-[#f1f5f9] py-2 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Detail Modal */}
      {viewingClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingClient(null)}>
          <div className="glass-card-strong p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                {viewingClient.photo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={viewingClient.photo_url} alt={viewingClient.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#64748b] text-xl font-bold">
                    {viewingClient.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 flex justify-between items-start">
                <h2 className="text-xl font-bold text-[#f1f5f9]">{viewingClient.name}</h2>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                viewingClient.status === 'active' ? 'badge-success' :
                viewingClient.status === 'inactive' ? 'bg-white/10 text-[#94a3b8]' :
                'badge-info'
              }`}>{viewingClient.status}</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {viewingClient.email ? <div><span className="text-[#64748b]">Email:</span> <span className="text-[#f1f5f9] ml-2">{viewingClient.email}</span></div> : <div><span className="text-[#64748b]">Email:</span> <span className="text-[#64748b] ml-2">—</span></div>}
              {viewingClient.phone && <div><span className="text-[#64748b]">Phone:</span> <span className="text-[#f1f5f9] ml-2">{viewingClient.phone}</span></div>}
              {viewingClient.company && <div><span className="text-[#64748b]">Company:</span> <span className="text-[#f1f5f9] ml-2">{viewingClient.company}</span></div>}
              {viewingClient.notes && (
                <div>
                  <span className="text-[#64748b]">Notes:</span>
                  <p className="text-[#f1f5f9] mt-1 bg-white/5 rounded-lg p-3">{viewingClient.notes}</p>
                </div>
              )}
              <div><span className="text-[#64748b]">Added:</span> <span className="text-[#f1f5f9] ml-2">{new Date(viewingClient.created_at).toLocaleDateString()}</span></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { handleEdit(viewingClient); setViewingClient(null) }} className="flex-1 btn btn-primary py-2 text-sm">Edit</button>
              <button onClick={() => setViewingClient(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-[#f1f5f9] py-2 rounded-lg text-sm font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Clients Table */}
      {loading ? (
        <div className="text-center py-12 text-[#94a3b8]">Loading clients...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 glass-card-static">
          <p className="text-[#94a3b8] text-lg">No clients yet</p>
          <p className="text-sm text-[#64748b] mt-2">Click &quot;Add Client&quot; to get started</p>
        </div>
      ) : (
        <div className="glass-card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="hidden md:table-cell">Company</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(client => (
                  <tr key={client.id} className="cursor-pointer" onClick={() => setViewingClient(client)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                          {client.photo_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={client.photo_url} alt={client.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#64748b] text-xs font-bold">
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[#f1f5f9]">{client.name}</div>
                          {client.phone && <div className="text-xs text-[#64748b] mt-0.5">{client.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-[#94a3b8]">{client.email || '—'}</td>
                    <td className="text-sm text-[#94a3b8] hidden md:table-cell">{client.company || '-'}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        client.status === 'active' ? 'badge-success' :
                        client.status === 'inactive' ? 'bg-white/10 text-[#94a3b8]' :
                        'badge-info'
                      }`}>{client.status}</span>
                    </td>
                    <td className="text-right" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleEdit(client)} className="text-[#60a5fa] hover:text-[#93bbfc] text-sm mr-3">Edit</button>
                      <button onClick={() => handleDelete(client.id)} className="text-[#f43f5e] hover:text-[#fb7185] text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
