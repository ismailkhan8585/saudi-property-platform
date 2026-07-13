export const dynamic = 'force-dynamic';
import { getServiceClient } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Home, MessageSquare, TrendingUp, Users, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CALL_URL, WHATSAPP_URL } from '@/lib/constants';
import { formatDistance } from 'date-fns';

async function getDashboardStats() {
  const supabase = getServiceClient();

  const [
    { count: totalActive },
    { count: saleCount },
    { count: rentCount },
    { count: unreadLeads },
    { data: recentLeads },
    { data: topProperties },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('purpose', 'SALE'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('purpose', 'RENT'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('leads').select('*, property:property_id(title, property_id)').order('created_at', { ascending: false }).limit(8),
    supabase.from('properties').select('id, title, views, society').eq('is_active', true).order('views', { ascending: false }).limit(5),
  ]);

  return {
    totalActive: totalActive ?? 0,
    saleCount:   saleCount ?? 0,
    rentCount:   rentCount ?? 0,
    unreadLeads: unreadLeads ?? 0,
    recentLeads: recentLeads ?? [],
    topProperties: topProperties ?? [],
  };
}

const LEAD_TYPE_LABELS: Record<string, string> = {
  WHATSAPP_CLICK: 'WhatsApp',
  CALL_CLICK:     'Call',
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

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: 'Total Active Listings', value: stats.totalActive, Icon: Home,         color: 'border-l-navy-500',   bg: 'bg-navy-50',   text: 'text-navy-700' },
    { label: 'Unread Leads',          value: stats.unreadLeads, Icon: MessageSquare, color: 'border-l-gold-500',   bg: 'bg-gold-50',   text: 'text-gold-700', urgent: true },
    { label: 'For Sale',              value: stats.saleCount,   Icon: TrendingUp,    color: 'border-l-green-600',  bg: 'bg-green-50',  text: 'text-green-700' },
    { label: 'For Rent',              value: stats.rentCount,   Icon: Users,         color: 'border-l-blue-600',   bg: 'bg-blue-50',   text: 'text-blue-700' },
  ];

  return (
    <div className="flex min-h-screen bg-surface-secondary">
      <AdminSidebar unreadLeads={stats.unreadLeads} />

      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading font-800 text-navy-700 text-2xl mb-2">Dashboard</h1>
          <p className="text-gray-500 text-sm mb-8">Overview of your property listings and leads</p>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map(({ label, value, Icon, color, bg, text, urgent }) => (
              <div key={label} className={cn('bg-white rounded-2xl p-5 border-l-4 shadow-sm', color, urgent && value > 0 && 'ring-2 ring-gold-400')}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-600 text-gray-500">{label}</p>
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', bg)}>
                    <Icon className={cn('w-5 h-5', text)} />
                  </div>
                </div>
                <p className={cn('font-price font-700 text-3xl', text)}>{value}</p>
                {urgent && value > 0 && (
                  <p className="text-gold-600 text-xs font-600 mt-1">Needs attention!</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
                <h2 className="font-heading font-700 text-navy-700 text-base">Recent Leads</h2>
                <a href="/admin/leads" className="text-gold-600 text-sm hover:text-gold-700 font-600">View All →</a>
              </div>
              <div className="divide-y divide-surface-border">
                {stats.recentLeads.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No leads yet</p>
                ) : (
                  stats.recentLeads.map((lead: any) => (
                    <div key={lead.id} className={cn('px-6 py-4 flex items-start gap-3', !lead.is_read && 'bg-gold-50/50')}>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-600 text-navy-700 text-sm truncate">{lead.name}</span>
                          {!lead.is_read && <span className="w-2 h-2 bg-gold-500 rounded-full" />}
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-600', LEAD_TYPE_COLORS[lead.type] ?? 'bg-gray-100 text-gray-600')}>
                            {LEAD_TYPE_LABELS[lead.type] ?? lead.type}
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                          {lead.property?.title && <span className="text-navy-500">{lead.property.title}</span>}
                          {lead.message && <span className="ml-1">· {lead.message.slice(0, 60)}</span>}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {formatDistance(new Date(lead.created_at), new Date(), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <a href={`tel:${lead.phone}`} className="w-8 h-8 bg-navy-50 hover:bg-navy-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-3.5 h-3.5 text-navy-600" />
                        </a>
                        <a
                          href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi ${lead.name}, regarding your inquiry...`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-center"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Properties */}
            <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-border">
                <h2 className="font-heading font-700 text-navy-700 text-base">Top Properties by Views</h2>
              </div>
              <div className="divide-y divide-surface-border">
                {stats.topProperties.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
                ) : (
                  stats.topProperties.map((p: any, i: number) => (
                    <div key={p.id} className="px-5 py-3.5 flex items-center gap-3">
                      <span className="font-price font-700 text-gray-300 text-lg w-6 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-600 text-navy-700 text-sm truncate">{p.title}</div>
                        <div className="text-gray-400 text-xs">{p.society}</div>
                      </div>
                      <span className="font-price text-gold-600 text-sm font-700 shrink-0">{p.views} views</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
