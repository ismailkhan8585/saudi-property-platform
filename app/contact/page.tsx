'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { toast } from 'sonner';
import { Phone, MessageCircle, MapPin, Clock, Send } from 'lucide-react';
import { AGENT_PHONE, WHATSAPP_URL, CALL_URL, OFFICE_ADDRESS, AGENT_NAME_EN, WORKING_HOURS, WHATSAPP_GENERAL_MSG } from '@/lib/constants';

export default function ContactPage() {
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) { toast.error('Name and phone are required'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CONTACT_FORM', name, phone, message: `${purpose ? `[${purpose}] ` : ''}${message}` }),
      });
      if (!res.ok) throw new Error();
      toast.success('Message sent! We will contact you shortly.');
      setName(''); setPhone(''); setPurpose(''); setMessage('');
    } catch {
      toast.error('Failed to send. Please WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-secondary">
        <div className="bg-navy-700 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="font-heading font-800 text-white text-4xl md:text-5xl mb-3">Contact Us</h1>
            <p className="font-urdu text-gold-300 text-xl">ہم سے رابطہ کریں</p>
          </div>
        </div>

        <section className="section-padding">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Contact Form */}
              <div className="bg-white rounded-2xl p-8 border border-surface-border shadow-sm">
                <h2 className="font-heading font-700 text-navy-700 text-xl mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-600 text-gray-700 block mb-1.5">Your Name *</label>
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Muhammad Ahmed"
                      className="w-full border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-600 text-gray-700 block mb-1.5">Phone Number *</label>
                    <input
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="03XX XXXXXXX"
                      className="w-full border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-600 text-gray-700 block mb-1.5">I am looking to</label>
                    <select
                      value={purpose} onChange={e => setPurpose(e.target.value)}
                      className="w-full border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                    >
                      <option value="">Select purpose...</option>
                      <option>Buy a property</option>
                      <option>Rent a property</option>
                      <option>Sell my property</option>
                      <option>Rent out my property</option>
                      <option>Get property valuation</option>
                      <option>Investment advice</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-600 text-gray-700 block mb-1.5">Message</label>
                    <textarea
                      value={message} onChange={e => setMessage(e.target.value)}
                      placeholder="Tell us about your requirements..."
                      rows={4}
                      className="w-full border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-navy-500 hover:bg-navy-600 disabled:opacity-50 text-white py-3.5 rounded-xl font-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Agent Info */}
              <div className="space-y-5">
                <div className="bg-white rounded-2xl p-6 border border-surface-border">
                  <h3 className="font-heading font-700 text-navy-700 text-base mb-5">{AGENT_NAME_EN}</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gold-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-600 text-navy-700 mb-1">Office Address</div>
                        <div className="text-gray-500 text-sm">{OFFICE_ADDRESS}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                      <div>
                        <div className="text-sm font-600 text-navy-700 mb-1">Phone / Call</div>
                        <a href={CALL_URL} className="text-navy-500 hover:text-gold-600 text-sm font-600 transition-colors">{AGENT_PHONE}</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <div>
                        <div className="text-sm font-600 text-navy-700 mb-1">WhatsApp</div>
                        <a
                          href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_GENERAL_MSG)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 text-sm font-600 transition-colors"
                        >
                          Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gold-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-600 text-navy-700 mb-1">Working Hours</div>
                        <div className="text-gray-500 text-sm">
                          <div>{WORKING_HOURS.weekdays.days}: {WORKING_HOURS.weekdays.hours}</div>
                          <div>{WORKING_HOURS.weekend.days}: {WORKING_HOURS.weekend.hours}</div>
                          <div className="text-green-600 font-600 mt-1">Always available on WhatsApp</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_GENERAL_MSG)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Now
                  </a>
                  <a
                    href={CALL_URL}
                    className="flex-1 flex items-center justify-center gap-2 bg-navy-500 hover:bg-navy-600 text-white py-4 rounded-xl font-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
