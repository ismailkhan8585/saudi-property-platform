'use client';

import { useState, useEffect, useCallback } from 'react';
import { Phone, MessageCircle, Check, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WHATSAPP_URL } from '@/lib/constants';
import { formatDistance } from 'date-fns';

const LEAD_TYPE_LABELS: Record<string, string> = {
  WHATSAPP_CLICK: 'WhatsApp',
  CALL_CLICK:     'Call Click',
  CONTACT_FORM:   'Contact Form',
  SCHEDULE_VISIT: 'Visit Request',
  PRICE_REQUEST:  'Price Request',
};

const LEAD_TYPE_COLORS: Record<string, string> = {
  WHATSAPP_CLICK: 'bg-green-100 text-green-700',
  CALL_CLICK:     'bg-blue-100 text-blue-700',
  CONTACT_FORM:   'bg-navy-100 text-navy-700',
  SCHEDULE_VISIT: 'bg-amber-100 text-amber-700',
  PRICE_REQUEST:  'bg-purple-100 text-purple-700',
};

interface Lead {
  id: string;
  type: string;
  name: string;
  phone: string;
  message?: string;
  is_read: boolean;
  created_at: string;
  property?: { title?: string; property_id?: string };
}

const FILTERS = [
  { value: '',               label: 'All' },
  { value: 'CONTACT_FORM',  label: 'Forms' },
  { value: 'WHATSAPP_CLICK', label: 'WhatsApp' },
  { value: 'CALL_CLICK',    label: 'Calls' },
  { value: 'SCHEDULE_VISIT', label: 'Visits' },
  { value: 'PRICE_REQUEST',  label: 'Price' },
];

export default function LeadsTable() {
  const [leads,   setLeads]   = useState<Lead[]>([]);
  const [total,   setTotal]   = useState(0);
  const [filter,  setFilter]  = useState('');
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15' });
    if (filter) params.set('type', filter);
    const res = await fetch(`/api/leads?${params}`);
    const data = await res.json();
    setLeads(data.leads ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function markRead(id: string) {
    await fetch(`/api/leads/${id}/read`, { method: 'PATCH' });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, is_read: true } : l));
  }

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
      {/* Filter Bar */}
      <div className="px-4 sm:px-6 py-4 border-b border-surface-border flex flex-wrap items-center gap-2 sm:gap-3">
        <Filter className="w-4 h-4 text-gray-400" />
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(1); }}
            className={cn(
              'px-3 py-2 rounded-lg text-xs font-700 transition-colors',
              filter === f.value
                ? 'bg-navy-500 text-white'
                : 'bg-surface-secondary text-gray-600 hover:bg-gray-100'
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="w-full sm:w-auto sm:ml-auto text-xs sm:text-sm text-gray-400">{total} total</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading leads...</div>
      ) : leads.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No leads found</div>
      ) : (
        <div className="divide-y divide-surface-border">
          {leads.map(lead => (
            <div key={lead.id} className={cn('px-4 sm:px-6 py-4', !lead.is_read && 'bg-gold-50/40')}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-700 text-navy-700 text-sm">{lead.name}</span>
                    {!lead.is_read && <span className="w-2 h-2 bg-gold-500 rounded-full" />}
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-700', LEAD_TYPE_COLORS[lead.type] ?? 'bg-gray-100 text-gray-600')}>
                      {LEAD_TYPE_LABELS[lead.type] ?? lead.type}
                    </span>
                  </div>
                  <div className="font-price text-navy-500 text-sm mb-1">{lead.phone}</div>
                  {lead.property?.title && (
                    <div className="text-gray-500 text-xs mb-1">
                      Property: <span className="text-navy-600 font-600">{lead.property.title}</span>
                      {lead.property.property_id && <span className="text-gray-400 ml-1">#{lead.property.property_id}</span>}
                    </div>
                  )}
                  {lead.message && (
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{lead.message}</p>
                  )}
                  <div className="text-gray-400 text-xs mt-1.5">
                    {formatDistance(new Date(lead.created_at), new Date(), { addSuffix: true })}
                  </div>
                </div>

                <div className="w-full sm:w-auto grid grid-cols-2 min-[420px]:grid-cols-3 sm:flex gap-2 sm:shrink-0">
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center justify-center gap-1 bg-navy-50 hover:bg-navy-100 text-navy-700 px-3 py-2.5 sm:py-2 rounded-lg text-xs font-700 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>
                  <a
                    href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ${lead.name}! Thank you for contacting us. How can I help you?`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2.5 sm:py-2 rounded-lg text-xs font-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                  {!lead.is_read && (
                    <button
                      onClick={() => markRead(lead.id)}
                      className="col-span-2 min-[420px]:col-span-1 flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2.5 sm:py-2 rounded-lg text-xs font-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 15 && (
        <div className="px-4 sm:px-6 py-4 border-t border-surface-border flex justify-between items-center gap-3">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="text-sm text-navy-500 hover:text-navy-700 disabled:opacity-40 font-600">
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page}</span>
          <button disabled={page * 15 >= total} onClick={() => setPage(p => p + 1)}
            className="text-sm text-navy-500 hover:text-navy-700 disabled:opacity-40 font-600">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
