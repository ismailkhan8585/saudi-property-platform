import { unstable_cache } from 'next/cache';
import type { Prisma, PropertyCategory, Purpose } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { mapProperty, mapSiteSettings } from '@/lib/mappers';
import type { PaginatedProperties, Property, SiteSettings } from '@/lib/types';
import { cache } from 'react';
import { getSocietyAliases } from '@/lib/societies';

export const PUBLIC_CACHE_SECONDS = 300;
export const PROPERTY_CACHE_TAG = 'public-properties';
export const SETTINGS_CACHE_TAG = 'site-settings';
export const TESTIMONIALS_CACHE_TAG = 'testimonials';

export interface PublicPropertyQuery {
  purpose?: Purpose;
  category?: PropertyCategory;
  society?: string;
  bedrooms?: number;
  featured?: boolean;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

const cardSelect = {
  id: true,
  property_id: true,
  slug: true,
  title: true,
  purpose: true,
  category: true,
  status: true,
  price_type: true,
  price: true,
  rent_price: true,
  size: true,
  size_unit: true,
  bedrooms: true,
  bathrooms: true,
  city: true,
  society: true,
  area: true,
  photos: true,
  is_corner: true,
  featured: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.propertiesSelect;

export const getPublicProperties = unstable_cache(
  async (query: PublicPropertyQuery = {}): Promise<PaginatedProperties> => {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(48, Math.max(1, query.limit ?? 12));
    const search = query.search?.trim();
    const societyAliases = query.society ? getSocietyAliases(query.society) : [];
    const where: Prisma.propertiesWhereInput = {
      is_active: true,
      ...(query.purpose ? { purpose: query.purpose } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(societyAliases.length ? {
        AND: [{
          OR: societyAliases.map(society => ({ society: { equals: society, mode: 'insensitive' } })),
        }],
      } : {}),
      ...(query.featured ? { featured: true } : {}),
      ...(query.bedrooms ? { bedrooms: { gte: query.bedrooms } } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { property_id: { contains: search, mode: 'insensitive' } },
          { society: { contains: search, mode: 'insensitive' } },
          { area: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    };

    const orderBy: Prisma.propertiesOrderByWithRelationInput = query.sort === 'price_asc'
      ? { price: { sort: 'asc', nulls: 'last' } }
      : query.sort === 'price_desc'
        ? { price: { sort: 'desc', nulls: 'last' } }
        : { created_at: 'desc' };

    const [rows, total] = await Promise.all([
      prisma.properties.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: cardSelect,
      }),
      prisma.properties.count({ where }),
    ]);

    return {
      properties: rows.map(row => mapProperty(row as unknown as Record<string, unknown>)),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },
  ['public-property-list-v3'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);

export const getPublicPropertyBySlug = unstable_cache(
  async (slug: string): Promise<Property | null> => {
    const row = await prisma.properties.findFirst({ where: { slug, is_active: true } });
    return row ? mapProperty(row as unknown as Record<string, unknown>) : null;
  },
  ['public-property-detail-v1'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);

export const getCategoryCounts = unstable_cache(
  async (): Promise<Record<string, number>> => {
    const rows = await prisma.properties.groupBy({
      by: ['category'],
      where: { is_active: true },
      _count: { _all: true },
    });
    return Object.fromEntries(rows.map(row => [row.category, row._count._all]));
  },
  ['public-category-counts-v1'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);

export const getSocietyCounts = unstable_cache(
  async (): Promise<Record<string, number>> => {
    const rows = await prisma.properties.groupBy({
      by: ['society'],
      where: { is_active: true, society: { not: null } },
      _count: { _all: true },
    });
    return Object.fromEntries(rows.flatMap(row => row.society ? [[row.society, row._count._all]] : []));
  },
  ['public-society-counts-v2'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [PROPERTY_CACHE_TAG] },
);

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    const row = await prisma.site_settings.findFirst();
    return row ? mapSiteSettings(row as unknown as Record<string, unknown>) : null;
  },
  ['public-site-settings-v1'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [SETTINGS_CACHE_TAG] },
);

export interface PublicTestimonial {
  id: string;
  client_name: string;
  client_area: string | null;
  property_type: string | null;
  rating: number;
  quote_text: string;
}

export interface HomePageData {
  featured: Property[];
  forSale: Property[];
  forRent: Property[];
  categoryCounts: Record<string, number>;
  societyCounts: Record<string, number>;
  settings: SiteSettings | null;
  testimonials: PublicTestimonial[];
}

const getHomePageDataCached = unstable_cache(
  async (): Promise<HomePageData> => {
    const [featuredRows, saleRows, rentRows, categoryRows, societyRows, settingsRow, testimonials] = await Promise.all([
      prisma.properties.findMany({ where: { is_active: true, featured: true }, orderBy: { created_at: 'desc' }, take: 6, select: cardSelect }),
      prisma.properties.findMany({ where: { is_active: true, purpose: 'SALE' }, orderBy: { created_at: 'desc' }, take: 6, select: cardSelect }),
      prisma.properties.findMany({ where: { is_active: true, purpose: 'RENT' }, orderBy: { created_at: 'desc' }, take: 6, select: cardSelect }),
      prisma.properties.groupBy({ by: ['category'], where: { is_active: true }, _count: { _all: true } }),
      prisma.properties.groupBy({ by: ['society'], where: { is_active: true, society: { not: null } }, _count: { _all: true } }),
      prisma.site_settings.findFirst(),
      prisma.testimonials.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'desc' },
        take: 4,
        select: { id: true, client_name: true, client_area: true, property_type: true, rating: true, quote_text: true },
      }),
    ]);
    const mapRows = (rows: typeof featuredRows) => rows.map(row => mapProperty(row as unknown as Record<string, unknown>));

    return {
      featured: mapRows(featuredRows),
      forSale: mapRows(saleRows),
      forRent: mapRows(rentRows),
      categoryCounts: Object.fromEntries(categoryRows.map(row => [row.category, row._count._all])),
      societyCounts: Object.fromEntries(societyRows.flatMap(row => row.society ? [[row.society, row._count._all]] : [])),
      settings: settingsRow ? mapSiteSettings(settingsRow as unknown as Record<string, unknown>) : null,
      testimonials,
    };
  },
  ['public-home-data-v2'],
  {
    revalidate: PUBLIC_CACHE_SECONDS,
    tags: [PROPERTY_CACHE_TAG, SETTINGS_CACHE_TAG, TESTIMONIALS_CACHE_TAG],
  },
);

// React cache deduplicates all landing-section calls within one server render.
export const getHomePageData = cache(getHomePageDataCached);

export const getTestimonials = unstable_cache(
  async (limit = 4): Promise<PublicTestimonial[]> => prisma.testimonials.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
    take: limit,
    select: {
      id: true,
      client_name: true,
      client_area: true,
      property_type: true,
      rating: true,
      quote_text: true,
    },
  }),
  ['public-testimonials-v1'],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: [TESTIMONIALS_CACHE_TAG] },
);
