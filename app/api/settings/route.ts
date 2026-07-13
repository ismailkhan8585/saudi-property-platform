import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { SETTINGS_CACHE_TAG } from '@/lib/data/public';

export async function GET() {
  try {
    const settings = await prisma.site_settings.findFirst();
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await prisma.site_settings.findFirst({ select: { id: true } });

    const payload = {
      agent_name_en:    body.agentNameEn,
      agent_name_ur:    body.agentNameUr || null,
      tagline_en:       body.taglineEn || null,
      tagline_ur:       body.taglineUr || null,
      phone:            body.phone,
      whatsapp:         body.whatsapp,
      email:            body.email || null,
      office_address_en: body.officeAddressEn || null,
      office_address_ur: body.officeAddressUr || null,
      years_experience: body.yearsExperience || 0,
      deals_closed:     body.dealsClosed || 0,
      happy_clients:    body.happyClients || 0,
      agent_photo:      body.agentPhoto || null,
      agent_bio_en:     body.agentBioEn || null,
      agent_bio_ur:     body.agentBioUr || null,
      updated_at:       new Date(),
    };

    if (existing) {
      await prisma.site_settings.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.site_settings.create({ data: { id: randomUUID(), ...payload } });
    }

    revalidateTag(SETTINGS_CACHE_TAG);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
