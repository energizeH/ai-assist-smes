'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface Appointment {
  id: string
  client_name: string
  client_email?: string
  client_phone?: string
  service?: string
  appointment_date: string
  appointment_time: string
  duration?: number
  notes?: string
  status: string
  created_at: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [form, setForm] = useState({
    client_name: '', client_email: '', client_phone: '', service: '',
    appointment_date: '', appointment_time: '', duration: 30, notes: '', status: 'scheduled'
  })
  const [saving, setSaving] = useState(false)

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments')
      if (!res.ok) throw new Error('Failed to load appointments')
      const data = await res.json()
      setAppointments(data.appointments || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [])

  const getMinDate = () => new Date().toISOString().split('T')[0]
  const getMaxDate = () => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      // Validate date is not in the past and not more than 1 year ahead
      const selectedDate = new Date(`${form.appointment_date}T${form.appointment_time}`)
      const now = new Date()
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

      if (selectedDate < now && form.status === 'scheduled') {
        throw new Error('Appointment date and time cannot be in the past')
      }
      if (new Date(form.appointment_date) > oneYearFromNow) {
        throw new Error('Appointment date cannot be more than 1 year in the future')
      }
      const method = editingAppointment ? 'PUT' : 'POST'
      const url = editingAppointment ? `/api/appointments/${editingAppointment.id}` : '/api/appointments'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to save appointment')
      }
      await fetchAppointments()
      setShowForm(false)
      setEditingAppointment(null)
      resetForm()
      setSuccess(editingAppointment ? 'Appointment updated' : 'Appointment created')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchAppointments()
      setSuccess('Appointment cancelled')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (apt: Appointment) => {
    setEditingAppointment(apt)
    setForm({
      client_name: apt.client_name, client_email: apt.client_email || '',
      client_phone: apt.client_phone || '', service: apt.service || '',
      appointment_date: apt.appointment_date, appointment_time: apt.appointment_time,
      duration: apt.duration || 30, notes: apt.notes || '', status: apt.status,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setForm({ client_name: '', client_email: '', client_phone: '', service: '', appointment_date: '', appointment_time: '', duration: 30, notes: '', status: 'scheduled' })
  }

  const openAddForm = () => {
    setEditingAppointment(null)
    resetForm()
    setShowForm(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'badge-info'
      case 'completed': return 'badge-success'
      case 'cancelled': return 'badge-danger'
      case 'no_show': return 'bg-white/10 text-[#94a3b8]'
      default: return 'bg-white/10 text-[#94a3b8]'
    }
  }

  const upcoming = appointments.filter(a => a.status === 'scheduled' && new Date(`${a.appointment_date}T${a.appointment_time}`) >= new Date())
  const today = appointments.filter(a => a.appointment_date === new Date().toISOString().split('T')[0])

  return (
    <DashboardLayout title="Appointments" subtitle="Schedule and manage your appointments">
      {error && <div className="mb-4 bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#fb7185] px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg">{success}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="kpi-card">
          <p className="text-sm font-medium text-[#94a3b8] mb-1">Today</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">{today.length}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-[#94a3b8] mb-1">Upcoming</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">{upcoming.length}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-[#94a3b8] mb-1">Total</p>
          <p className="text-2xl font-bold text-[#f1f5f9]">{appointments.length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'glass-tab-active' : 'glass-tab'}`}>
            List
          </button>
          <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'calendar' ? 'glass-tab-active' : 'glass-tab'}`}>
            Calendar
          </button>
        </div>
        <button onClick={openAddForm} className="btn btn-primary">
          + New Appointment
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="glass-card-strong p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#f1f5f9] mb-6">{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Client Name *</label>
                  <input required value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})}
                    className="input w-full text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Client Email</label>
                  <input type="email" value={form.client_email} onChange={e => setForm({...form, client_email: e.target.value})}
                    className="input w-full text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Date *</label>
                  <input required type="date" value={form.appointment_date} onChange={e => setForm({...form, appointment_date: e.target.value})}
                    min={getMinDate()} max={getMaxDate()}
                    className="input w-full text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Time *</label>
                  <input required type="time" value={form.appointment_time} onChange={e => setForm({...form, appointment_time: e.target.value})}
                    className="input w-full text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Service</label>
                  <select value={form.service} onChange={e => setForm({...form, service: e.target.value})}
                    className="input w-full text-sm">
                    <option value="">Select service</option>
                    <option value="consultation">Consultation</option>
                    <option value="demo">Product Demo</option>
                    <option value="setup">System Setup</option>
                    <option value="support">Support Call</option>
                    <option value="training">Training Session</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Duration (mins)</label>
                  <select value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})}
                    className="input w-full text-sm">
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                  </select>
                </div>
              </div>
              {editingAppointment && (
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                    className="input w-full text-sm">
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
                  className="input w-full text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 btn btn-primary py-2 disabled:opacity-50">
                  {saving ? 'Saving...' : (editingAppointment ? 'Update' : 'Create Appointment')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-[#f1f5f9] py-2 rounded-lg font-medium transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-12 text-[#94a3b8]">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 glass-card-static">
          <p className="text-[#94a3b8] text-lg">No appointments yet</p>
          <p className="text-sm text-[#64748b] mt-2">Click &quot;New Appointment&quot; to schedule one</p>
        </div>
      ) : view === 'list' ? (
        <div className="glass-card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Date & Time</th>
                  <th className="hidden md:table-cell">Service</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt.id}>
                    <td>
                      <div className="font-medium text-[#f1f5f9]">{apt.client_name}</div>
                      {apt.client_email && <div className="text-xs text-[#64748b]">{apt.client_email}</div>}
                    </td>
                    <td>
                      <div className="text-sm text-[#f1f5f9]">{new Date(apt.appointment_date).toLocaleDateString('en-GB')}</div>
                      <div className="text-xs text-[#64748b]">{apt.appointment_time} ({apt.duration || 30} mins)</div>
                    </td>
                    <td className="text-sm text-[#94a3b8] hidden md:table-cell capitalize">{apt.service || '-'}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-right">
                      <button onClick={() => handleEdit(apt)} className="text-[#60a5fa] hover:text-[#93bbfc] text-sm mr-3">Edit</button>
                      <button onClick={() => handleDelete(apt.id)} className="text-[#f43f5e] hover:text-[#fb7185] text-sm">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar View - Simple month grid */
        <div className="glass-card-static p-6">
          <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Calendar View</h3>
          <div className="space-y-3">
            {Array.from(new Set(appointments.map(a => a.appointment_date))).sort().map(date => (
              <div key={date} className="border border-white/10 rounded-lg p-4">
                <h4 className="font-medium text-[#f1f5f9] mb-2">{new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                <div className="space-y-2">
                  {appointments.filter(a => a.appointment_date === date).map(apt => (
                    <div key={apt.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                      <div>
                        <span className="text-sm font-medium text-[#f1f5f9]">{apt.appointment_time}</span>
                        <span className="text-sm text-[#94a3b8] ml-3">{apt.client_name}</span>
                        {apt.service && <span className="text-xs text-[#64748b] ml-2 capitalize">- {apt.service}</span>}
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(apt.status)}`}>{apt.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
