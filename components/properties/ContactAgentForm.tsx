'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

interface Props {
  propertyId: string;
  propertyTitle: string;
  propertyRef: string;
}

export default function ContactAgentForm({ propertyId, propertyTitle, propertyRef }: Props) {
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Please enter your name and phone number');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CONTACT_FORM',
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || `Inquiry about ${propertyTitle} — ${propertyRef}`,
          propertyId,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Message sent! We will contact you shortly.');
      setName(''); setPhone(''); setMessage('');
    } catch {
      toast.error('Failed to send. Please WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-surface-border">
      <h3 className="font-heading font-700 text-navy-700 text-base mb-4">Send Inquiry</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your Name *"
          className="w-full border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          required
        />
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Phone Number (03XXXXXXXXX) *"
          className="w-full border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          required
        />
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Message (optional)"
          rows={3}
          className="w-full border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-navy-500 hover:bg-navy-600 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Sending...' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  );
}
