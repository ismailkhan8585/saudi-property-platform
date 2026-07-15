import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import type { PossessionStatus, PriceType, PropertyCategory, PropertyStatus, Purpose, SizeUnit } from '@prisma/client';
import { slugify, generatePropertyId } from '@/lib/utils';
import { revalidateTag } from 'next/cache';
import { PROPERTY_CACHE_TAG } from '@/lib/data/public';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const count = await prisma.properties.count();
    const seq = count + 1;
    const propertyId = generatePropertyId(seq);
    const slug = `${slugify(body.title)}-${propertyId.toLowerCase()}`;

    const data = await prisma.properties.create({ data: {
      id:             randomUUID(),
      property_id:    propertyId,
      slug,
      title:          body.title,
      title_ur:       body.titleUr || null,
      title_ar:       body.titleUr || null,
      description:    body.description || null,
      description_ur: body.descriptionUr || null,
      description_ar: body.descriptionUr || null,
      purpose:        body.purpose as Purpose,
      category:       body.category as PropertyCategory,
      sub_category:   body.subCategory || null,
      status:         (body.status || 'AVAILABLE') as PropertyStatus,
      price_type:     body.priceType as PriceType,
      price:          body.price ? Number(body.price) : null,
      rent_price:     body.rentPrice ? Number(body.rentPrice) : null,
      size:           Number(body.size),
      size_unit:      (body.sizeUnit || 'SQM') as SizeUnit,
      bedrooms:       body.bedrooms ? Number(body.bedrooms) : null,
      bathrooms:      body.bathrooms ? Number(body.bathrooms) : null,
      floors:         body.floors ? Number(body.floors) : null,
      facing:         body.facing || null,
      city:           body.city || 'Riyadh',
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
      possession:     (body.possession || 'AVAILABLE') as PossessionStatus,
      featured:       body.featured || false,
      is_active:      body.isActive !== false,
      updated_at:     new Date(),
    } });

    revalidateTag(PROPERTY_CACHE_TAG);

    return NextResponse.json({ property: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
