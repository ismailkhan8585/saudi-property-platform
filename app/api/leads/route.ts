import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import type { LeadType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, phone, message, propertyId, preferredDate, preferredTime } = body;

    if (!type || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.leads.create({ data: {
      id: randomUUID(),
      type: type as LeadType,
      name: name.trim(),
      phone: phone.trim(),
      message: message?.trim() || null,
      property_id: propertyId || null,
      preferred_date: preferredDate ? new Date(`${preferredDate}T00:00:00.000Z`) : null,
      preferred_time: preferredTime || null,
    } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const isRead = searchParams.get('isRead');
  const type   = searchParams.get('type');
  const page   = parseInt(searchParams.get('page') ?? '1', 10);
  const limit  = parseInt(searchParams.get('limit') ?? '20', 10);

  const from = (page - 1) * limit;
  const where = {
    ...(isRead === 'false' ? { is_read: false } : {}),
    ...(type ? { type: type as LeadType } : {}),
  };
  try {
    const [data, count] = await Promise.all([
      prisma.leads.findMany({
        where,
        include: { properties: { select: { id: true, title: true, property_id: true, slug: true } } },
        orderBy: { created_at: 'desc' },
        skip: from,
        take: limit,
      }),
      prisma.leads.count({ where }),
    ]);
    const leads = data.map(({ properties, ...lead }) => ({ ...lead, property: properties }));
    return NextResponse.json({ leads, total: count, page, totalPages: Math.ceil(count / limit) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
