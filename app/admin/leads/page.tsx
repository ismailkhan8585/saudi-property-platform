export const dynamic = 'force-dynamic';
import { getServiceClient } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LeadsTable from '@/components/admin/LeadsTable';

async function getUnreadCount() {
  const { count } = await getServiceClient()
    .from('leads').select('*', { count: 'exact', head: true }).eq('is_read', false);
  return count ?? 0;
}

export default async function LeadsPage() {
  const unreadLeads = await getUnreadCount();

  return (
    <div className="flex min-h-screen bg-surface-secondary">
      <AdminSidebar unreadLeads={unreadLeads} />
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading font-800 text-navy-700 text-2xl">Leads & Inquiries</h1>
              <p className="text-gray-500 text-sm mt-1">All customer inquiries and lead activity</p>
            </div>
            {unreadLeads > 0 && (
              <div className="bg-gold-100 border border-gold-300 text-gold-700 px-4 py-2 rounded-xl text-sm font-700">
                {unreadLeads} unread lead{unreadLeads !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <LeadsTable />
        </div>
      </div>
    </div>
  );
}
