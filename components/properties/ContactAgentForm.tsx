'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';

export default function ContactAgentForm({ propertyId, propertyTitle, propertyRef }: { propertyId: string; propertyTitle: string; propertyRef: string }) {
  const { dict } = useLocale();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !/^((\+966|00966|966|0)?5\d{8})$/.test(phone.replace(/[\s-]/g, ''))) {
      toast.error(dict.property.required);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CONTACT_FORM', name: name.trim(), phone: phone.trim(), message: message.trim() || `${propertyTitle} — ${propertyRef}`, propertyId }),
      });
      if (!response.ok) throw new Error();
      toast.success(dict.property.success);
      setName('');
      setPhone('');
      setMessage('');
    } catch {
      toast.error(dict.property.failure);
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = 'mt-1 min-h-12 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold-500';
  return (
    <div id="property-enquiry" className="scroll-mt-28 rounded-2xl border bg-white p-5">
      <h2 className="font-bold">{dict.property.contact}</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block text-xs font-semibold text-gray-600">{dict.property.name}<input className={fieldClass} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required /></label>
        <label className="block text-xs font-semibold text-gray-600">{dict.property.phone}<input className={fieldClass} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={20} required /></label>
        <label className="block text-xs font-semibold text-gray-600">{dict.property.message}<textarea className={fieldClass} value={message} onChange={(event) => setMessage(event.target.value)} rows={4} maxLength={1000} /></label>
        <button disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy-800 px-4 font-bold text-white disabled:opacity-50"><Send className="h-4 w-4" />{loading ? dict.property.sending : dict.property.send}</button>
      </form>
    </div>
  );
}
