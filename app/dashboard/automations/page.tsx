'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ZapIcon, 
  MessageSquareIcon, 
  MailIcon, 
  PhoneIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  SettingsIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircle2Icon
} from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  trigger_event: string;
  action_type: 'whatsapp' | 'email' | 'sms' | 'webhook';
  action_content: string;
  is_active: boolean;
  run_count: number;
  last_run: string;
}

const triggerOptions = [
  { value: 'new_lead', label: 'New Lead Captured' },
  { value: 'appointment_scheduled', label: 'Appointment Scheduled' },
  { value: 'appointment_confirmed', label: 'Appointment Confirmed' },
  { value: 'appointment_cancelled', label: 'Appointment Cancelled' },
  { value: 'client_created', label: 'Client Created' }
];

const actionOptions = [
  { value: 'whatsapp', label: 'Send WhatsApp Message', icon: MessageSquareIcon, color: 'text-green-500' },
  { value: 'email', label: 'Send Email Notification', icon: MailIcon, color: 'text-blue-500' },
  { value: 'sms', label: 'Send SMS Alert', icon: PhoneIcon, color: 'text-purple-500' }
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAutomation, setCurrentAutomation] = useState<Partial<Automation> | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const automationData = {
        ...currentAutomation,
        user_id: user.id,
      };

      if (currentAutomation?.id) {
        const { error } = await supabase
          .from('automations')
          .update(automationData)
          .eq('id', currentAutomation.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('automations')
          .insert([automationData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchAutomations();
    } catch (error) {
      console.error('Error saving automation:', error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('automations')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      fetchAutomations();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this automation?')) return;
    try {
      const { error } = await supabase
        .from('automations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchAutomations();
    } catch (error) {
      console.error('Error deleting automation:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workflow Automations</h1>
          <p className="text-gray-500 dark:text-gray-400">Automate your business processes and notifications</p>
        </div>
        <button
          onClick={() => {
            setCurrentAutomation({ is_active: true, action_type: 'whatsapp' });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Automation
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading your workflows...</div>
      ) : automations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
          <ZapIcon className="w-16 h-16 mx-auto mb-4 text-blue-500 opacity-20" />
          <h2 className="text-xl font-bold mb-2">No Automations Yet</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Build your first workflow to automate messages, emails, and lead follow-ups.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 font-bold hover:underline"
          >
            Create your first workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {automations.map((auto) => (
            <div key={auto.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-900`}>
                  {actionOptions.find(opt => opt.value === auto.action_type)?.icon({ 
                    className: `w-6 h-6 ${actionOptions.find(opt => opt.value === auto.action_type)?.color}` 
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleStatus(auto.id, auto.is_active)}
                    className={`p-1.5 rounded-full transition-colors ${
                      auto.is_active ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-gray-400 bg-gray-50 dark:bg-gray-900'
                    }`}
                  >
                    {auto.is_active ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => handleDelete(auto.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{auto.name}</h3>
              <p className="text-sm text-gray-500 mb-4 flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" /> Triggered by: {triggerOptions.find(t => t.value === auto.trigger_event)?.label}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-semibold">Total Runs</span>
                  <span className="text-lg font-bold">{auto.run_count || 0}</span>
                </div>
                <button 
                  onClick={() => {
                    setCurrentAutomation(auto);
                    setIsModalOpen(true);
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentAutomation?.id ? 'Edit Workflow' : 'New Automation'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveAutomation} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Automation Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Welcome New Leads"
                  value={currentAutomation?.name || ''}
                  onChange={(e) => setCurrentAutomation({ ...currentAutomation, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Trigger Event</label>
                  <select
                    value={currentAutomation?.trigger_event || 'new_lead'}
                    onChange={(e) => setCurrentAutomation({ ...currentAutomation, trigger_event: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                  >
                    {triggerOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Action Type</label>
                  <select
                    value={currentAutomation?.action_type || 'whatsapp'}
                    onChange={(e) => setCurrentAutomation({ ...currentAutomation, action_type: e.target.value as Automation['action_type'] })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                  >
                    {actionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Message Content</label>
                <textarea
                  required
                  placeholder="Type the message you want to send..."
                  value={currentAutomation?.action_content || ''}
                  onChange={(e) => setCurrentAutomation({ ...currentAutomation, action_content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 h-32 focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-2 text-xs text-gray-400">
                  Tip: Use <span className="text-blue-500">{"{name}"}</span> to include the person's name dynamically.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center"
                >
                  {currentAutomation?.id ? 'Update' : 'Activate'} Workflow
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
