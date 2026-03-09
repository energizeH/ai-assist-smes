'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  PlusIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  FilterIcon
} from 'lucide-react';

interface Appointment {
  id: string;
  client_id: string;
  client_name: string;
  service_type: string;
  appointment_date: string;
  start_time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppt, setCurrentAppt] = useState<Partial<Appointment> | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const apptData = {
        ...currentAppt,
        user_id: user.id,
      };

      if (currentAppt?.id) {
        const { error } = await supabase
          .from('appointments')
          .update(apptData)
          .eq('id', currentAppt.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('appointments')
          .insert([apptData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const updateStatus = async (id: string, status: Appointment['status']) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your bookings and schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'calendar' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500'
              }`}
            >
              Calendar
            </button>
          </div>
          <button
            onClick={() => {
              setCurrentAppt({ status: 'pending', duration: 30 });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Booking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Today's Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Scheduled</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {appointments.filter(a => a.appointment_date === selectedDate).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-bold text-green-600">
                  {appointments.filter(a => a.appointment_date === selectedDate && a.status === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cancelled</span>
                <span className="font-bold text-red-600">
                  {appointments.filter(a => a.appointment_date === selectedDate && a.status === 'cancelled').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() - 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
                </button>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h2>
                <button 
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() + 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-sm border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white"
              />
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading schedule...</div>
              ) : appointments.filter(a => a.appointment_date === selectedDate).length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No appointments scheduled for this day</p>
                </div>
              ) : (
                appointments
                  .filter(a => a.appointment_date === selectedDate)
                  .map((appt) => (
                    <div key={appt.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-bold text-gray-900 dark:text-white w-16">
                          {appt.start_time}
                        </div>
                        <div className="h-10 w-0.5 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{appt.client_name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{appt.service_type} ({appt.duration} min)</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[appt.status]}`}>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                        </span>
                        <div className="flex items-center gap-2">
                          {appt.status !== 'completed' && (
                            <button 
                              onClick={() => updateStatus(appt.id, 'completed')}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                              title="Complete"
                            >
                              <CheckCircle2Icon className="w-5 h-5" />
                            </button>
                          )}
                          {appt.status !== 'cancelled' && (
                            <button 
                              onClick={() => updateStatus(appt.id, 'cancelled')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Cancel"
                            >
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentAppt?.id ? 'Edit Appointment' : 'New Booking'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveAppointment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                  <input
                    required
                    type="text"
                    value={currentAppt?.client_name || ''}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, client_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Type</label>
                  <input
                    required
                    type="text"
                    value={currentAppt?.service_type || ''}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, service_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    required
                    type="date"
                    value={currentAppt?.appointment_date || ''}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, appointment_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input
                    required
                    type="time"
                    value={currentAppt?.start_time || ''}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, start_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (min)</label>
                  <input
                    required
                    type="number"
                    value={currentAppt?.duration || 30}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={currentAppt?.status || 'pending'}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, status: e.target.value as Appointment['status'] })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  {currentAppt?.id ? 'Update' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
