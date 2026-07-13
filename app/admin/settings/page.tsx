'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [form, setForm] = useState({
    agentNameEn: '', agentNameUr: '', taglineEn: '', taglineUr: '',
    phone: '', whatsapp: '', email: '', officeAddressEn: '', officeAddressUr: '',
    yearsExperience: 0, dealsClosed: 0, happyClients: 0,
    agentPhoto: '', agentBioEn: '', agentBioUr: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.settings) {
        const s = d.settings;
        setForm({
          agentNameEn: s.agent_name_en ?? '',
          agentNameUr: s.agent_name_ur ?? '',
          taglineEn:   s.tagline_en ?? '',
          taglineUr:   s.tagline_ur ?? '',
          phone:       s.phone ?? '',
          whatsapp:    s.whatsapp ?? '',
          email:       s.email ?? '',
          officeAddressEn: s.office_address_en ?? '',
          officeAddressUr: s.office_address_ur ?? '',
          yearsExperience: s.years_experience ?? 0,
          dealsClosed:     s.deals_closed ?? 0,
          happyClients:    s.happy_clients ?? 0,
          agentPhoto:  s.agent_photo ?? '',
          agentBioEn:  s.agent_bio_en ?? '',
          agentBioUr:  s.agent_bio_ur ?? '',
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  function set(key: string, value: string | number) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500';
  const labelCls = 'text-sm font-600 text-gray-700 block mb-1.5';

  if (loading) return (
    <div className="flex min-h-screen bg-surface-secondary">
      <AdminSidebar />
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-secondary">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading font-800 text-navy-700 text-2xl mb-6">Site Settings</h1>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Agent Info */}
            <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-4">
              <h2 className="font-heading font-700 text-navy-700 text-base">Agent Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelCls}>Agent Name (English)</label><input className={inputCls} value={form.agentNameEn} onChange={e => set('agentNameEn', e.target.value)} /></div>
                <div><label className={labelCls}>Agent Name (Urdu)</label><input className={cn(inputCls, 'font-urdu text-right')} dir="rtl" value={form.agentNameUr} onChange={e => set('agentNameUr', e.target.value)} /></div>
                <div><label className={labelCls}>Tagline (English)</label><input className={inputCls} value={form.taglineEn} onChange={e => set('taglineEn', e.target.value)} /></div>
                <div><label className={labelCls}>Tagline (Urdu)</label><input className={cn(inputCls, 'font-urdu text-right')} dir="rtl" value={form.taglineUr} onChange={e => set('taglineUr', e.target.value)} /></div>
              </div>
              <div><label className={labelCls}>Agent Photo URL</label><input className={inputCls} value={form.agentPhoto} onChange={e => set('agentPhoto', e.target.value)} placeholder="https://res.cloudinary.com/..." /></div>
              <div><label className={labelCls}>Bio (English)</label><textarea className={cn(inputCls, 'resize-none')} rows={4} value={form.agentBioEn} onChange={e => set('agentBioEn', e.target.value)} /></div>
              <div><label className={labelCls}>Bio (Urdu)</label><textarea className={cn(inputCls, 'resize-none font-urdu text-right')} dir="rtl" rows={3} value={form.agentBioUr} onChange={e => set('agentBioUr', e.target.value)} /></div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-4">
              <h2 className="font-heading font-700 text-navy-700 text-base">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelCls}>Phone Number</label><input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+923001234567" /></div>
                <div><label className={labelCls}>WhatsApp Number</label><input className={inputCls} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="923001234567" /></div>
                <div><label className={labelCls}>Email</label><input className={inputCls} type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
              </div>
              <div><label className={labelCls}>Office Address (English)</label><input className={inputCls} value={form.officeAddressEn} onChange={e => set('officeAddressEn', e.target.value)} /></div>
              <div><label className={labelCls}>Office Address (Urdu)</label><input className={cn(inputCls, 'font-urdu text-right')} dir="rtl" value={form.officeAddressUr} onChange={e => set('officeAddressUr', e.target.value)} /></div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl p-6 border border-surface-border space-y-4">
              <h2 className="font-heading font-700 text-navy-700 text-base">Stats for Homepage</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className={labelCls}>Years Experience</label><input className={inputCls} type="number" value={form.yearsExperience} onChange={e => set('yearsExperience', Number(e.target.value))} /></div>
                <div><label className={labelCls}>Deals Closed</label><input className={inputCls} type="number" value={form.dealsClosed} onChange={e => set('dealsClosed', Number(e.target.value))} /></div>
                <div><label className={labelCls}>Happy Clients</label><input className={inputCls} type="number" value={form.happyClients} onChange={e => set('happyClients', Number(e.target.value))} /></div>
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-navy-500 hover:bg-navy-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
