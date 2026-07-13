import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { mapProperty } from '@/lib/mappers';

export const revalidate = 1800;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const supabase = getServiceClient();

  const purpose  = searchParams.get('purpose');
  const category = searchParams.get('category');
  const society  = searchParams.get('society');
  const featured = searchParams.get('featured');
  const bedrooms = searchParams.get('bedrooms');
  const limit    = parseInt(searchParams.get('limit') ?? '12', 10);
  const page     = parseInt(searchParams.get('page') ?? '1', 10);
  const sort     = searchParams.get('sort') ?? 'newest';

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (purpose)  query = query.eq('purpose', purpose);
  if (category) query = query.eq('category', category);
  if (society)  query = query.ilike('society', `%${society}%`);
  if (featured === 'true') query = query.eq('featured', true);
  if (bedrooms && bedrooms !== 'any') query = query.gte('bedrooms', parseInt(bedrooms, 10));

  switch (sort) {
    case 'price_asc':  query = query.order('price', { ascending: true, nullsFirst: false }); break;
    case 'price_desc': query = query.order('price', { ascending: false, nullsFirst: false }); break;
    default:           query = query.order('created_at', { ascending: false });
  }

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    properties: (data ?? []).map(mapProperty),
    total: count ?? 0,
    page,
    pageSize: limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
