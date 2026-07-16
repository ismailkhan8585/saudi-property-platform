export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LeadsTable from '@/components/admin/LeadsTable';
import { getContactConfig } from '@/lib/contact';

async function getUnreadCount() {
  return prisma.leads.count({ where: { is_read: false } });
}

export default async function LeadsPage() {
  const unreadLeads = await getUnreadCount();

  return (
    <div className="flex min-h-screen flex-col bg-surface-secondary md:flex-row" dir="ltr">
      <AdminSidebar unreadLeads={unreadLeads} />
      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="font-heading font-800 text-navy-700 text-xl sm:text-2xl">Leads & Inquiries</h1>
              <p className="text-gray-500 text-sm mt-1">All customer inquiries and lead activity</p>
            </div>
            {unreadLeads > 0 && (
              <div className="bg-gold-100 border border-gold-300 text-gold-700 px-4 py-2 rounded-xl text-sm font-700">
                {unreadLeads} unread lead{unreadLeads !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <LeadsTable whatsappNumber={getContactConfig().whatsappNumber} />
        </div>
      </div>
    </div>
  );
}
