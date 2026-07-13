export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PropertyForm from '@/components/admin/PropertyForm';
import { getServiceClient } from '@/lib/supabase';
import type { Property } from '@/lib/types';

async function getProperty(id: string): Promise<Property | null> {
  const { data } = await getServiceClient()
    .from('properties').select('*').eq('id', id).maybeSingle();

  if (!data) return null;

  return {
    ...data,
    isCorner:      data.is_corner,
    isParkFacing:  data.is_park_facing,
    isGated:       data.is_gated,
    hasSecurity:   data.has_security,
    hasGas:        data.has_gas,
    hasElectricity: data.has_electricity,
    hasWater:      data.has_water,
    hasGarage:     data.has_garage,
    hasGarden:     data.has_garden,
    hasServantQtr: data.has_servant_qtr,
    isActive:      data.is_active,
    priceType:     data.price_type,
    rentPrice:     data.rent_price,
    sizeUnit:      data.size_unit,
    titleUr:       data.title_ur,
    description:   data.description,
    descriptionUr: data.description_ur,
    propertyId:    data.property_id,
    createdAt:     data.created_at,
    updatedAt:     data.updated_at,
  } as Property;
}

async function getUnreadCount() {
  const { count } = await getServiceClient()
    .from('leads').select('*', { count: 'exact', head: true }).eq('is_read', false);
  return count ?? 0;
}

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const [property, unreadLeads] = await Promise.all([getProperty(params.id), getUnreadCount()]);
  if (!property) notFound();

  return (
    <div className="flex min-h-screen bg-surface-secondary">
      <AdminSidebar unreadLeads={unreadLeads} />
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-800 text-navy-700 text-2xl mb-6">Edit Property</h1>
          <PropertyForm property={property} />
        </div>
      </div>
    </div>
  );
}
