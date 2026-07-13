import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { PossessionStatus, PriceType, PropertyCategory, PropertyStatus, Purpose, SizeUnit } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { PROPERTY_CACHE_TAG } from '@/lib/data/public';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await prisma.properties.update({
      where: { id },
      data: {
        title:          body.title,
        title_ur:       body.titleUr || null,
        description:    body.description || null,
        purpose:        body.purpose as Purpose,
        category:       body.category as PropertyCategory,
        status:         body.status as PropertyStatus,
        price_type:     body.priceType as PriceType,
        price:          body.price ? Number(body.price) : null,
        rent_price:     body.rentPrice ? Number(body.rentPrice) : null,
        size:           Number(body.size),
        size_unit:      body.sizeUnit as SizeUnit,
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
        possession:     body.possession as PossessionStatus,
        featured:       body.featured,
        is_active:      body.isActive,
      },
    });

    revalidateTag(PROPERTY_CACHE_TAG);

    return NextResponse.json({ property: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.properties.update({ where: { id }, data: { is_active: false } });
    revalidateTag(PROPERTY_CACHE_TAG);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
