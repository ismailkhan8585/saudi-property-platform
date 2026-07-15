import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import type { FurnishingStatus, Prisma, PropertyCategory, Purpose } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { normalizeArabic } from '@/lib/i18n';
import { mapProperty, mapSiteSettings } from '@/lib/mappers';
import type {
  Location,
  PaginatedProperties,
  Property,
  RelaxedSearchFilter,
  SearchAlternativeGroup,
  SiteSettings,
} from '@/lib/types';

export const PROPERTY_CACHE_TAG = 'public-properties';
export const LOCATION_CACHE_TAG = 'public-locations';
export const PUBLIC_CACHE_SECONDS = 300;
export const SETTINGS_CACHE_TAG = 'site-settings';
export const TESTIMONIALS_CACHE_TAG = 'testimonials';

export interface PublicPropertyQuery {
  purpose?: Purpose;
  category?: PropertyCategory;
  region?: string;
  city?: string;
  district?: string;
  society?: string;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: FurnishingStatus;
  amenities?: string[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  featured?: boolean;
  search?: string;
  sort?: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'area_desc';
  page?: number;
  limit?: number;
}

const locationTreeSelect = {
  id: true,
  slug: true,
  name_ar: true,
  name_en: true,
  parent: {
    select: {
      id: true,
      slug: true,
      name_ar: true,
      name_en: true,
      parent: { select: { id: true, slug: true, name_ar: true, name_en: true } },
    },
  },
} satisfies Prisma.locationsSelect;

const propertyCardSelect = {
  id: true,
  property_id: true,
  slug: true,
  title: true,
  title_ar: true,
  purpose: true,
  category: true,
  price: true,
  rent_price: true,
  size: true,
  size_unit: true,
  bedrooms: true,
  bathrooms: true,
  city: true,
  area: true,
  photos: true,
  location_id: true,
  furnished: true,
  is_demo: true,
  featured: true,
  created_at: true,
  updated_at: true,
  location: { select: locationTreeSelect },
} satisfies Prisma.propertiesSelect;

const propertyDetailInclude = {
  location: { select: locationTreeSelect },
} satisfies Prisma.propertiesInclude;

function mapLocation(row: {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  type: Location['type'];
  parent_id: string | null;
  aliases_ar: string[];
  aliases_en: string[];
}): Location {
  return {
    id: row.id,
    slug: row.slug,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    type: row.type,
    parentId: row.parent_id,
    aliasesAr: row.aliases_ar,
    aliasesEn: row.aliases_en,
  };
}

const loadLocations = unstable_cache(
  async (): Promise<Location[]> => {
    const rows = await prisma.locations.findMany({
      where: { active: true },
      orderBy: [{ display_order: 'asc' }, { name_en: 'asc' }],
      select: {
        id: true,
        slug: true,
        name_ar: true,
        name_en: true,
        type: true,
        parent_id: true,
        aliases_ar: true,
        aliases_en: true,
      },
    });
    return rows.map(mapLocation);
  },
  ['public-locations-v2'],
  { revalidate: 86400, tags: [LOCATION_CACHE_TAG] },
);

export const getLocations = cache(loadLocations);

async function resolveLocationIds(query: PublicPropertyQuery): Promise<string[]> {
  const locations = await getLocations();
  const slug = query.district || query.city || query.region;
  let roots: Location[] = [];

  if (slug) {
    const selected = locations.find((location) => location.slug === slug);
    if (!selected) return [];
    roots = [selected];
  } else if (query.search?.trim()) {
    const raw = query.search.trim().slice(0, 100);
    const normalized = normalizeArabic(raw).toLocaleLowerCase('en');
    roots = locations.filter((location) => {
      const candidates = [location.nameAr, location.nameEn, ...location.aliasesAr, ...location.aliasesEn]
        .map((value) => normalizeArabic(value).toLocaleLowerCase('en'));
      return candidates.some((value) => value.includes(normalized));
    });
  }

  if (!roots.length) return [];
  const ids = new Set(roots.map((location) => location.id));
  let changed = true;
  while (changed) {
    changed = false;
    for (const location of locations) {
      if (location.parentId && ids.has(location.parentId) && !ids.has(location.id)) {
        ids.add(location.id);
        changed = true;
      }
    }
  }
  return Array.from(ids);
}

function serializeQuery(query: PublicPropertyQuery): string {
  const normalized = Object.fromEntries(
    Object.entries(query)
      .filter(([, value]) => value !== undefined && value !== '')
      .sort(([left], [right]) => left.localeCompare(right)),
  );
  return JSON.stringify(normalized);
}

async function buildPropertyWhere(query: PublicPropertyQuery): Promise<Prisma.propertiesWhereInput> {
  const locationSlug = query.district || query.city || query.region;
  const search = query.search?.trim().slice(0, 100);
  const locationIds = locationSlug || search ? await resolveLocationIds(query) : [];
  const rentPurpose = query.purpose === 'RENT' || query.purpose === 'DAILY_RENT' || query.purpose === 'COMMERCIAL_LEASE';
  const priceField = rentPurpose ? 'rent_price' : 'price';
  const priceFilter = query.minPrice != null || query.maxPrice != null
    ? {
        [priceField]: {
          ...(query.minPrice != null ? { gte: query.minPrice } : {}),
          ...(query.maxPrice != null ? { lte: query.maxPrice } : {}),
        },
      }
    : {};

  return {
    is_active: true,
    status: 'AVAILABLE',
    published_at: { not: null },
    ...(query.purpose ? { purpose: query.purpose } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(locationSlug ? { location_id: { in: locationIds } } : {}),
    ...(query.bedrooms ? { bedrooms: { gte: query.bedrooms } } : {}),
    ...(query.bathrooms ? { bathrooms: { gte: query.bathrooms } } : {}),
    ...(query.furnished ? { furnished: query.furnished } : {}),
    ...(query.amenities?.length ? { amenities: { hasEvery: query.amenities } } : {}),
    ...(query.minArea != null || query.maxArea != null
      ? { size: { ...(query.minArea != null ? { gte: query.minArea } : {}), ...(query.maxArea != null ? { lte: query.maxArea } : {}) } }
      : {}),
    ...priceFilter,
    ...(query.featured ? { featured: true } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { title_ar: { contains: search } },
            { description: { contains: search, mode: 'insensitive' } },
            { description_ar: { contains: search } },
            { property_id: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { society: { contains: search, mode: 'insensitive' } },
            { area: { contains: search, mode: 'insensitive' } },
            ...(locationIds.length ? [{ location_id: { in: locationIds } }] : []),
          ],
        }
      : {}),
  };
}

function propertyOrderBy(query: PublicPropertyQuery): Prisma.propertiesOrderByWithRelationInput {
  const rentPurpose = query.purpose === 'RENT' || query.purpose === 'DAILY_RENT' || query.purpose === 'COMMERCIAL_LEASE';
  const priceField = rentPurpose ? 'rent_price' : 'price';
  if (query.sort === 'price_asc') return { [priceField]: { sort: 'asc', nulls: 'last' } };
  if (query.sort === 'price_desc') return { [priceField]: { sort: 'desc', nulls: 'last' } };
  if (query.sort === 'area_desc') return { size: 'desc' };
  return { created_at: 'desc' };
}

async function loadPublicProperties(serialized: string): Promise<PaginatedProperties> {
  const query = JSON.parse(serialized) as PublicPropertyQuery;
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, query.limit ?? 12));
  const where = await buildPropertyWhere(query);
  const [rows, total] = await Promise.all([
    prisma.properties.findMany({
      where,
      orderBy: propertyOrderBy(query),
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: propertyCardSelect,
    }),
    prisma.properties.count({ where }),
  ]);
  return {
    properties: rows.map((row) => mapProperty({ ...row, photos: row.photos.slice(0, 1) } as unknown as Record<string, unknown>)),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

const loadCachedPublicProperties = unstable_cache(
  loadPublicProperties,
  ['public-property-search-v3'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);

export const getPublicProperties = cache(async (query: PublicPropertyQuery = {}) =>
  loadCachedPublicProperties(serializeQuery(query)),
);

async function loadPropertyCards(serialized: string): Promise<Property[]> {
  const query = JSON.parse(serialized) as PublicPropertyQuery;
  const where = await buildPropertyWhere(query);
  const rows = await prisma.properties.findMany({
    where,
    orderBy: propertyOrderBy(query),
    take: Math.min(12, Math.max(1, query.limit ?? 6)),
    select: propertyCardSelect,
  });
  return rows.map((row) => mapProperty({ ...row, photos: row.photos.slice(0, 1) } as unknown as Record<string, unknown>));
}

const loadCachedPropertyCards = unstable_cache(
  loadPropertyCards,
  ['public-property-cards-v2'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);

export const getPublicPropertyCards = cache(async (query: PublicPropertyQuery = {}) =>
  loadCachedPropertyCards(serializeQuery(query)),
);

const RELAXATION_ORDER: Array<{ filter: RelaxedSearchFilter; keys: (keyof PublicPropertyQuery)[] }> = [
  { filter: 'amenities', keys: ['amenities'] },
  { filter: 'furnished', keys: ['furnished'] },
  { filter: 'bathrooms', keys: ['bathrooms'] },
  { filter: 'bedrooms', keys: ['bedrooms'] },
  { filter: 'area', keys: ['minArea', 'maxArea'] },
  { filter: 'price', keys: ['minPrice', 'maxPrice'] },
];

function alternativeQuery(query: PublicPropertyQuery): PublicPropertyQuery {
  const next = { ...query, amenities: query.amenities ? [...query.amenities] : undefined, limit: 6, page: 1 };
  delete next.sort;
  return next;
}

export async function getSearchAlternatives(query: PublicPropertyQuery): Promise<SearchAlternativeGroup[]> {
  const groups: SearchAlternativeGroup[] = [];
  const seen = new Set<string>();
  const relaxed: RelaxedSearchFilter[] = [];
  const progressivelyRelaxed = alternativeQuery(query);
  let sameDistrict: Property[] = [];

  for (const step of RELAXATION_ORDER) {
    if (!step.keys.some((key) => progressivelyRelaxed[key] != null)) continue;
    for (const key of step.keys) delete progressivelyRelaxed[key];
    relaxed.push(step.filter);
    const result = await getPublicProperties(progressivelyRelaxed);
    sameDistrict = result.properties.filter((property) => !seen.has(property.id));
    if (sameDistrict.length) break;
  }
  if (sameDistrict.length) {
    sameDistrict.forEach((property) => seen.add(property.id));
    groups.push({ kind: query.district ? 'sameDistrict' : 'suggested', relaxed: [...relaxed], properties: sameDistrict });
  }

  const fullyRelaxed = alternativeQuery(query);
  const allRelaxed: RelaxedSearchFilter[] = [];
  for (const step of RELAXATION_ORDER) {
    if (step.keys.some((key) => fullyRelaxed[key] != null)) allRelaxed.push(step.filter);
    for (const key of step.keys) delete fullyRelaxed[key];
  }
  if (query.district && query.city) {
    delete fullyRelaxed.district;
    const result = await getPublicProperties(fullyRelaxed);
    const properties = result.properties.filter((property) => !seen.has(property.id));
    if (properties.length) {
      properties.forEach((property) => seen.add(property.id));
      groups.push({ kind: 'sameCity', relaxed: allRelaxed, properties });
    }
  }
  if (query.city && query.region) {
    delete fullyRelaxed.city;
    delete fullyRelaxed.district;
    const result = await getPublicProperties(fullyRelaxed);
    const properties = result.properties.filter((property) => !seen.has(property.id));
    if (properties.length) groups.push({ kind: 'sameRegion', relaxed: allRelaxed, properties });
  }
  return groups;
}

const loadPropertyBySlug = unstable_cache(
  async (slug: string): Promise<Property | null> => {
    const row = await prisma.properties.findFirst({
      where: { slug, is_active: true, status: 'AVAILABLE', published_at: { not: null } },
      include: propertyDetailInclude,
    });
    return row ? mapProperty(row as unknown as Record<string, unknown>) : null;
  },
  ['public-property-detail-v2'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);

export const getPublicPropertyBySlug = cache(loadPropertyBySlug);

const loadRelatedProperties = unstable_cache(
  async (propertyId: string, locationId: string | null, category: PropertyCategory): Promise<Property[]> => {
    const rows = await prisma.properties.findMany({
      where: {
        is_active: true,
        status: 'AVAILABLE',
        published_at: { not: null },
        id: { not: propertyId },
        OR: [{ location_id: locationId ?? undefined }, { category }],
      },
      take: 3,
      orderBy: { created_at: 'desc' },
      select: propertyCardSelect,
    });
    return rows.map((row) => mapProperty({ ...row, photos: row.photos.slice(0, 1) } as unknown as Record<string, unknown>));
  },
  ['related-public-properties-v2'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);

export const getRelatedProperties = cache(async (property: Property) =>
  loadRelatedProperties(property.id, property.locationId ?? null, property.category as PropertyCategory),
);

const loadCategoryCounts = unstable_cache(
  async () => {
    const rows = await prisma.properties.groupBy({
      by: ['category'],
      where: { is_active: true, status: 'AVAILABLE', published_at: { not: null } },
      _count: { _all: true },
    });
    return Object.fromEntries(rows.map((row) => [row.category, row._count._all]));
  },
  ['public-category-counts-v2'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);
export const getCategoryCounts = cache(loadCategoryCounts);

const loadSocietyCounts = unstable_cache(
  async () => {
    const rows = await prisma.properties.groupBy({
      by: ['city'],
      where: { is_active: true, status: 'AVAILABLE', published_at: { not: null } },
      _count: { _all: true },
    });
    return Object.fromEntries(rows.map((row) => [row.city, row._count._all]));
  },
  ['public-city-counts-v2'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);
export const getSocietyCounts = cache(loadSocietyCounts);

const loadPublishedPropertyCount = unstable_cache(
  () => prisma.properties.count({ where: { is_active: true, status: 'AVAILABLE', published_at: { not: null } } }),
  ['published-property-count-v2'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);
export const getPublishedPropertyCount = cache(loadPublishedPropertyCount);

const loadSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    const row = await prisma.site_settings.findFirst();
    return row ? mapSiteSettings(row as unknown as Record<string, unknown>) : null;
  },
  ['public-site-settings-v2'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [SETTINGS_CACHE_TAG] },
);
export const getSiteSettings = cache(loadSiteSettings);

export interface PublicTestimonial {
  id: string;
  client_name: string;
  client_area: string | null;
  property_type: string | null;
  rating: number;
  quote_text: string;
}
const loadTestimonials = unstable_cache(
  (limit: number): Promise<PublicTestimonial[]> => prisma.testimonials.findMany({
    where: { is_active: true },
    take: limit,
    orderBy: { created_at: 'desc' },
    select: { id: true, client_name: true, client_area: true, property_type: true, rating: true, quote_text: true },
  }),
  ['public-testimonials-v2'],
  { revalidate: 3600, tags: [TESTIMONIALS_CACHE_TAG] },
);
export const getTestimonials = cache((limit = 4) => loadTestimonials(limit));

export async function getHomePageData() {
  const [featured, forSale, forRent, categoryCounts, societyCounts, settings, testimonials] = await Promise.all([
    getPublicPropertyCards({ featured: true, limit: 6 }),
    getPublicPropertyCards({ purpose: 'SALE', limit: 6 }),
    getPublicPropertyCards({ purpose: 'RENT', limit: 6 }),
    getCategoryCounts(),
    getSocietyCounts(),
    getSiteSettings(),
    getTestimonials(),
  ]);
  return { featured, forSale, forRent, categoryCounts, societyCounts, settings, testimonials };
}
