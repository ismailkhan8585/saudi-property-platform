export const dynamic = 'force-dynamic';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PropertyForm from '@/components/admin/PropertyForm';
import { prisma } from '@/lib/prisma';

async function getUnreadCount() {
  return prisma.leads.count({ where: { is_read: false } });
}

export default async function NewPropertyPage() {
  const unreadLeads = await getUnreadCount();
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-secondary">
      <AdminSidebar unreadLeads={unreadLeads} />
      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-800 text-navy-700 text-xl sm:text-2xl mb-6">Add New Property</h1>
          <PropertyForm />
        </div>
      </div>
    </div>
  );
}
