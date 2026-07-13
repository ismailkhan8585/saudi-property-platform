export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PropertyForm from '@/components/admin/PropertyForm';
import { prisma } from '@/lib/prisma';
import { mapProperty } from '@/lib/mappers';
import type { Property } from '@/lib/types';

async function getProperty(id: string): Promise<Property | null> {
  const data = await prisma.properties.findUnique({ where: { id } });
  if (!data) return null;
  return mapProperty(data as unknown as Record<string, unknown>);
}

async function getUnreadCount() {
  return prisma.leads.count({ where: { is_read: false } });
}

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [property, unreadLeads] = await Promise.all([getProperty(id), getUnreadCount()]);
  if (!property) notFound();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-secondary">
      <AdminSidebar unreadLeads={unreadLeads} />
      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-800 text-navy-700 text-xl sm:text-2xl mb-6">Edit Property</h1>
          <PropertyForm property={property} />
        </div>
      </div>
    </div>
  );
}
