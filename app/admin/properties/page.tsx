export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Plus, Edit, Eye } from 'lucide-react';
import { formatPKR, formatRent } from '@/lib/currency';
import { cn } from '@/lib/utils';

async function getProperties() {
  return prisma.properties.findMany({ orderBy: { created_at: 'desc' }, take: 50 });
}

async function getUnreadCount() {
  return prisma.leads.count({ where: { is_read: false } });
}

export default async function AdminPropertiesPage() {
  const [properties, unreadLeads] = await Promise.all([getProperties(), getUnreadCount()]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-secondary">
      <AdminSidebar unreadLeads={unreadLeads} />
      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading font-800 text-navy-700 text-xl sm:text-2xl">Properties</h1>
              <p className="text-gray-500 text-sm mt-1">{properties.length} total listings</p>
            </div>
            <Link
              href="/admin/properties/new"
              className="flex items-center justify-center gap-2 bg-navy-500 hover:bg-navy-600 text-white px-5 py-3 sm:py-2.5 rounded-xl text-sm font-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
            <div className="divide-y divide-surface-border">
              {properties.map((p: any) => {
                const priceDisplay = p.price_type === 'ON_REQUEST' ? 'Price on Request'
                  : p.purpose === 'RENT' ? formatRent(Number(p.rent_price))
                  : formatPKR(Number(p.price));

                return (
                  <div key={p.id} className="px-4 sm:px-5 py-4 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-md font-700 uppercase',
                          p.purpose === 'SALE' ? 'bg-navy-100 text-navy-700' : 'bg-green-100 text-green-700'
                        )}>
                          {p.purpose === 'SALE' ? 'Sale' : 'Rent'}
                        </span>
                        {p.featured && <span className="text-xs px-2 py-0.5 rounded-md font-700 bg-gold-100 text-gold-700">Featured</span>}
                        {!p.is_active && <span className="text-xs px-2 py-0.5 rounded-md font-700 bg-red-100 text-red-700">Inactive</span>}
                        <span className="text-xs text-gray-400 font-price">#{p.property_id}</span>
                      </div>
                      <div className="font-600 text-navy-700 text-sm truncate">{p.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{[p.society, p.area].filter(Boolean).join(', ')}</div>
                    </div>
                    <div className="order-3 sm:order-none basis-full sm:basis-auto font-price text-navy-600 text-sm font-700 sm:shrink-0">{priceDisplay}</div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/properties/${p.slug}`}
                        target="_blank"
                        className="w-8 h-8 bg-surface-secondary hover:bg-gray-100 rounded-lg flex items-center justify-center"
                      >
                        <Eye className="w-3.5 h-3.5 text-gray-500" />
                      </Link>
                      <Link
                        href={`/admin/properties/${p.id}/edit`}
                        className="w-8 h-8 bg-navy-50 hover:bg-navy-100 rounded-lg flex items-center justify-center"
                      >
                        <Edit className="w-3.5 h-3.5 text-navy-600" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
