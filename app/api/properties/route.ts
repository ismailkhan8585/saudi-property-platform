import { NextRequest, NextResponse } from 'next/server';
import { getPublicProperties, PUBLIC_CACHE_SECONDS } from '@/lib/data/public';
import { parsePublicPropertyQuery } from '@/lib/property-query';

export const revalidate = 300;

export async function GET(req: NextRequest) {
  try {
    const result = await getPublicProperties(parsePublicPropertyQuery(req.nextUrl.searchParams));
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, s-maxage=${PUBLIC_CACHE_SECONDS}, stale-while-revalidate=${PUBLIC_CACHE_SECONDS * 2}`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load properties' },
      { status: 500 },
    );
  }
}
