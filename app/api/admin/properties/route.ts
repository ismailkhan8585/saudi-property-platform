import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { slugify, generatePropertyId } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceClient();

    const { count } = await supabase.from('properties').select('*', { count: 'exact', head: true });
    const seq = (count ?? 0) + 1;
    const propertyId = generatePropertyId(seq);
    const slug = `${slugify(body.title)}-${propertyId.toLowerCase()}`;

    const { data, error } = await supabase.from('properties').insert({
      property_id:    propertyId,
      slug,
      title:          body.title,
      title_ur:       body.titleUr || null,
      description:    body.description || null,
      description_ur: body.descriptionUr || null,
      purpose:        body.purpose,
      category:       body.category,
      sub_category:   body.subCategory || null,
      status:         body.status || 'AVAILABLE',
      price_type:     body.priceType,
      price:          body.price ? Number(body.price) : null,
      rent_price:     body.rentPrice ? Number(body.rentPrice) : null,
      size:           Number(body.size),
      size_unit:      body.sizeUnit || 'MARLA',
      bedrooms:       body.bedrooms ? Number(body.bedrooms) : null,
      bathrooms:      body.bathrooms ? Number(body.bathrooms) : null,
      floors:         body.floors ? Number(body.floors) : null,
      facing:         body.facing || null,
      city:           body.city || 'Lahore',
      society:        body.society || null,
      area:           body.area || null,
      address:        body.address || null,
      photos:         body.photos || [],
      is_corner:      body.isCorner || false,
      is_park_facing: body.isParkFacing || false,
      is_gated:       body.isGated || false,
      has_security:   body.hasSecurity || false,
      has_gas:        body.hasGas || false,
      has_electricity: body.hasElectricity || false,
      has_water:      body.hasWater || false,
      has_garage:     body.hasGarage || false,
      has_garden:     body.hasGarden || false,
      has_servant_qtr: body.hasServantQtr || false,
      possession:     body.possession || 'AVAILABLE',
      featured:       body.featured || false,
      is_active:      body.isActive !== false,
    }).select().maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ property: data });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
