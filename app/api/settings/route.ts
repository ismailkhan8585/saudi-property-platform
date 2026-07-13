import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await getServiceClient().from('site_settings').select('*').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceClient();

    const { data: existing } = await supabase.from('site_settings').select('id').maybeSingle();

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
    };

    if (existing) {
      const { error } = await supabase.from('site_settings').update(payload).eq('id', existing.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const { error } = await supabase.from('site_settings').insert(payload);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
