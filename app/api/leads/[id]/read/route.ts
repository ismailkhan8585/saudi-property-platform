import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await getServiceClient()
    .from('leads')
    .update({ is_read: true })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
