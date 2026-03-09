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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
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
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'no_show': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const upcoming = appointments.filter(a => a.status === 'scheduled' && new Date(`${a.appointment_date}T${a.appointment_time}`) >= new Date())
  const today = appointments.filter(a => a.appointment_date === new Date().toISOString().split('T')[0])

  return (
    <DashboardLayout title="Appointments" subtitle="Schedule and manage your appointments">
      {error && <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">{success}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Today</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{today.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Upcoming</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcoming.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointments.length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            List
          </button>
          <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            Calendar
          </button>
        </div>
        <button onClick={openAddForm} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + New Appointment
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name *</label>
                  <input required value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Email</label>
                  <input type="email" value={form.client_email} onChange={e => setForm({...form, client_email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                  <input required type="date" value={form.appointment_date} onChange={e => setForm({...form, appointment_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time *</label>
                  <input required type="time" value={form.appointment_time} onChange={e => setForm({...form, appointment_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service</label>
                  <select value={form.service} onChange={e => setForm({...form, service: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    <option value="">Select service</option>
                    <option value="consultation">Consultation</option>
                    <option value="demo">Product Demo</option>
                    <option value="setup">System Setup</option>
                    <option value="support">Support Call</option>
                    <option value="training">Training Session</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (mins)</label>
                  <select value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : (editingAppointment ? 'Update' : 'Create Appointment')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg font-medium transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No appointments yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Click &quot;New Appointment&quot; to schedule one</p>
        </div>
      ) : view === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {appointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{apt.client_name}</div>
                      {apt.client_email && <div className="text-xs text-gray-500 dark:text-gray-400">{apt.client_email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{new Date(apt.appointment_date).toLocaleDateString('en-GB')}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{apt.appointment_time} ({apt.duration || 30} mins)</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell capitalize">{apt.service || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(apt)} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm mr-3">Edit</button>
                      <button onClick={() => handleDelete(apt.id)} className="text-red-600 dark:text-red-400 hover:text-red-700 text-sm">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar View - Simple month grid */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calendar View</h3>
          <div className="space-y-3">
            {Array.from(new Set(appointments.map(a => a.appointment_date))).sort().map(date => (
              <div key={date} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                <div className="space-y-2">
                  {appointments.filter(a => a.appointment_date === date).map(apt => (
                    <div key={apt.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{apt.appointment_time}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-3">{apt.client_name}</span>
                        {apt.service && <span className="text-xs text-gray-400 ml-2 capitalize">- {apt.service}</span>}
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
