export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Home, MessageSquare, TrendingUp, Users, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getContactConfig } from '@/lib/contact';
import { formatDistance } from 'date-fns';

async function getDashboardStats() {
  const [
    totalActive,
    saleCount,
    rentCount,
    unreadLeads,
    recentLeadRows,
    topProperties,
  ] = await Promise.all([
    prisma.properties.count({ where: { is_active: true } }),
    prisma.properties.count({ where: { is_active: true, purpose: 'SALE' } }),
    prisma.properties.count({ where: { is_active: true, purpose: 'RENT' } }),
    prisma.leads.count({ where: { is_read: false } }),
    prisma.leads.findMany({ include: { properties: { select: { title: true, property_id: true } } }, orderBy: { created_at: 'desc' }, take: 8 }),
    prisma.properties.findMany({ select: { id: true, title: true, views: true, society: true }, where: { is_active: true }, orderBy: { views: 'desc' }, take: 5 }),
  ]);
  const recentLeads = recentLeadRows.map(({ properties, ...lead }) => ({ ...lead, property: properties }));

  return {
    totalActive,
    saleCount,
    rentCount,
    unreadLeads,
    recentLeads,
    topProperties,
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
  const contact = getContactConfig();

  const statCards = [
    { label: 'Total Active Listings', value: stats.totalActive, Icon: Home,         color: 'border-l-navy-500',   bg: 'bg-navy-50',   text: 'text-navy-700' },
    { label: 'Unread Leads',          value: stats.unreadLeads, Icon: MessageSquare, color: 'border-l-gold-500',   bg: 'bg-gold-50',   text: 'text-gold-700', urgent: true },
    { label: 'For Sale',              value: stats.saleCount,   Icon: TrendingUp,    color: 'border-l-green-600',  bg: 'bg-green-50',  text: 'text-green-700' },
    { label: 'For Rent',              value: stats.rentCount,   Icon: Users,         color: 'border-l-blue-600',   bg: 'bg-blue-50',   text: 'text-blue-700' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-secondary">
      <AdminSidebar unreadLeads={stats.unreadLeads} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading font-800 text-navy-700 text-xl sm:text-2xl mb-2">Dashboard</h1>
          <p className="text-gray-500 text-sm mb-8">Overview of your property listings and leads</p>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
            {statCards.map(({ label, value, Icon, color, bg, text, urgent }) => (
              <div key={label} className={cn('min-w-0 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border-l-4 shadow-sm', color, urgent && value > 0 && 'ring-2 ring-gold-400')}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] sm:text-sm leading-tight font-600 text-gray-500">{label}</p>
                  <div className={cn('hidden min-[360px]:flex w-8 h-8 sm:w-9 sm:h-9 rounded-xl items-center justify-center shrink-0', bg)}>
                    <Icon className={cn('w-5 h-5', text)} />
                  </div>
                </div>
                <p className={cn('font-price font-700 text-2xl sm:text-3xl', text)}>{value}</p>
                {urgent && value > 0 && (
                  <p className="text-gold-600 text-xs font-600 mt-1">Needs attention!</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-surface-border flex items-center justify-between gap-3">
                <h2 className="font-heading font-700 text-navy-700 text-base">Recent Leads</h2>
                <a href="/admin/leads" className="text-gold-600 text-sm hover:text-gold-700 font-600">View All →</a>
              </div>
              <div className="divide-y divide-surface-border">
                {stats.recentLeads.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No leads yet</p>
                ) : (
                  stats.recentLeads.map((lead: any) => (
                    <div key={lead.id} className={cn('px-4 sm:px-6 py-4 flex items-start gap-3', !lead.is_read && 'bg-gold-50/50')}>
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
                        {contact.whatsappNumber && <a
                          href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(`Hi ${lead.name}, regarding your inquiry...`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-center"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                        </a>}
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
