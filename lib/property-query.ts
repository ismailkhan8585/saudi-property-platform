import type { PropertyCategory, Purpose } from '@prisma/client';
import type { PublicPropertyQuery } from '@/lib/data/public';
import { canonicalizeSociety } from '@/lib/societies';

export type PageSearchParams = Record<string, string | string[] | undefined>;

const PURPOSES = new Set<Purpose>(['SALE', 'RENT']);
const CATEGORIES = new Set<PropertyCategory>([
  'HOUSE', 'APARTMENT', 'PLOT', 'COMMERCIAL', 'FARMHOUSE', 'VILLA',
  'ROOM', 'PORTION', 'OFFICE', 'SHOP', 'WAREHOUSE',
]);

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePublicPropertyQuery(
  params: PageSearchParams | URLSearchParams,
  defaults: Pick<PublicPropertyQuery, 'purpose' | 'category'> = {},
): PublicPropertyQuery {
  const read = (key: string) => params instanceof URLSearchParams ? params.get(key) ?? undefined : first(params[key]);
  const purposeValue = read('purpose');
  const categoryValue = read('category');
  const bedroomsValue = Number.parseInt(read('bedrooms') ?? '', 10);
  const pageValue = Number.parseInt(read('page') ?? '1', 10);
  const limitValue = Number.parseInt(read('limit') ?? '12', 10);
  const sortValue = read('sort');

  return {
    purpose: purposeValue && PURPOSES.has(purposeValue as Purpose) ? purposeValue as Purpose : defaults.purpose,
    category: categoryValue && CATEGORIES.has(categoryValue as PropertyCategory)
      ? categoryValue as PropertyCategory
      : defaults.category,
    society: canonicalizeSociety(read('society')) ?? (read('society')?.trim() || undefined),
    bedrooms: Number.isFinite(bedroomsValue) && bedroomsValue > 0 ? bedroomsValue : undefined,
    featured: read('featured') === 'true' || undefined,
    search: read('q')?.trim() || undefined,
    sort: sortValue === 'price_asc' || sortValue === 'price_desc' ? sortValue : 'newest',
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1,
    limit: Number.isFinite(limitValue) && limitValue > 0 ? Math.min(limitValue, 48) : 12,
  };
}

export function serializePublicPropertyQuery(query: PublicPropertyQuery): string {
  const params = new URLSearchParams();
  if (query.purpose) params.set('purpose', query.purpose);
  if (query.category) params.set('category', query.category);
  if (query.society) params.set('society', query.society);
  if (query.bedrooms) params.set('bedrooms', String(query.bedrooms));
  if (query.featured) params.set('featured', 'true');
  if (query.search) params.set('q', query.search);
  params.set('sort', query.sort ?? 'newest');
  params.set('page', String(query.page ?? 1));
  params.set('limit', String(query.limit ?? 12));
  return params.toString();
}
