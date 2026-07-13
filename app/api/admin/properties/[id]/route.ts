import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('properties')
      .update({
        title:          body.title,
        title_ur:       body.titleUr || null,
        description:    body.description || null,
        purpose:        body.purpose,
        category:       body.category,
        status:         body.status,
        price_type:     body.priceType,
        price:          body.price ? Number(body.price) : null,
        rent_price:     body.rentPrice ? Number(body.rentPrice) : null,
        size:           Number(body.size),
        size_unit:      body.sizeUnit,
        bedrooms:       body.bedrooms ? Number(body.bedrooms) : null,
        bathrooms:      body.bathrooms ? Number(body.bathrooms) : null,
        floors:         body.floors ? Number(body.floors) : null,
        facing:         body.facing || null,
        society:        body.society || null,
        area:           body.area || null,
        address:        body.address || null,
        photos:         body.photos || [],
        is_corner:      body.isCorner,
        is_park_facing: body.isParkFacing,
        is_gated:       body.isGated,
        has_security:   body.hasSecurity,
        has_gas:        body.hasGas,
        has_electricity: body.hasElectricity,
        has_water:      body.hasWater,
        has_garage:     body.hasGarage,
        has_garden:     body.hasGarden,
        has_servant_qtr: body.hasServantQtr,
        possession:     body.possession,
        featured:       body.featured,
        is_active:      body.isActive,
      })
      .eq('id', params.id)
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ property: data });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await getServiceClient()
    .from('properties')
    .update({ is_active: false })
    .eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
