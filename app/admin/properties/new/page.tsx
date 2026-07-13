export const dynamic = 'force-dynamic';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PropertyForm from '@/components/admin/PropertyForm';
import { getServiceClient } from '@/lib/supabase';

async function getUnreadCount() {
  const { count } = await getServiceClient()
    .from('leads').select('*', { count: 'exact', head: true }).eq('is_read', false);
  return count ?? 0;
}

export default async function NewPropertyPage() {
  const unreadLeads = await getUnreadCount();
  return (
    <div className="flex min-h-screen bg-surface-secondary">
      <AdminSidebar unreadLeads={unreadLeads} />
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-800 text-navy-700 text-2xl mb-6">Add New Property</h1>
          <PropertyForm />
        </div>
      </div>
    </div>
  );
}
