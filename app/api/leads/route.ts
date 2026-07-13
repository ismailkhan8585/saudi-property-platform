import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, phone, message, propertyId, preferredDate, preferredTime } = body;

    if (!type || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { error } = await supabase.from('leads').insert({
      type,
      name: name.trim(),
      phone: phone.trim(),
      message: message?.trim() || null,
      property_id: propertyId || null,
      preferred_date: preferredDate || null,
      preferred_time: preferredTime || null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const supabase = getServiceClient();
  const { searchParams } = req.nextUrl;
  const isRead = searchParams.get('isRead');
  const type   = searchParams.get('type');
  const page   = parseInt(searchParams.get('page') ?? '1', 10);
  const limit  = parseInt(searchParams.get('limit') ?? '20', 10);

  let query = supabase
    .from('leads')
    .select(`*, property:property_id(id, title, property_id, slug)`, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (isRead === 'false') query = query.eq('is_read', false);
  if (type) query = query.eq('type', type);

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ leads: data ?? [], total: count ?? 0, page, totalPages: Math.ceil((count ?? 0) / limit) });
}
