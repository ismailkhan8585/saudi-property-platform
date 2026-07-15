const fs = require('node:fs');
const path = require('node:path');

const REPORT_PATH = path.join(process.cwd(), 'reports', 'search-coverage.json');
const SALE_BANDS = [
  { name: 'low', min: 250000, max: 999999, target: 650000 },
  { name: 'medium', min: 1000000, max: 2999999, target: 1850000 },
  { name: 'premium', min: 3000000, max: 10000000, target: 4800000 },
];
const RENT_BANDS = [
  { name: 'low', min: 1500, max: 4999, target: 3200 },
  { name: 'medium', min: 5000, max: 14999, target: 9500 },
  { name: 'premium', min: 15000, max: 50000, target: 26000 },
];
const AREA_BANDS = [
  { name: 'small', min: 45, max: 120, target: 85 },
  { name: 'medium', min: 121, max: 300, target: 185 },
  { name: 'large', min: 301, max: 1000, target: 520 },
];
const RESIDENTIAL_PROFILES = [
  { category: 'APARTMENT', bedrooms: 1, bathrooms: 1, furnished: 'FURNISHED', priceBand: 0, areaBand: 0 },
  { category: 'APARTMENT', bedrooms: 2, bathrooms: 2, furnished: 'UNFURNISHED', priceBand: 1, areaBand: 1 },
  { category: 'APARTMENT', bedrooms: 3, bathrooms: 3, furnished: 'FURNISHED', priceBand: 2, areaBand: 1 },
  { category: 'VILLA', bedrooms: 4, bathrooms: 5, furnished: 'UNFURNISHED', priceBand: 1, areaBand: 2 },
  { category: 'VILLA', bedrooms: 5, bathrooms: 6, furnished: 'FURNISHED', priceBand: 2, areaBand: 2 },
];
const MAJOR_CITIES = ['riyadh', 'jeddah', 'makkah', 'madinah', 'dammam', 'khobar'];
const COMMERCIAL_PROFILES = [
  { category: 'PLOT', purpose: 'SALE', price: 1850000, area: 520, bedrooms: null, bathrooms: null, furnished: 'UNFURNISHED' },
  { category: 'COMMERCIAL', purpose: 'SALE', price: 4800000, area: 520, bedrooms: null, bathrooms: 4, furnished: 'UNFURNISHED' },
  { category: 'OFFICE', purpose: 'RENT', price: 9500, area: 185, bedrooms: null, bathrooms: 2, furnished: 'FURNISHED' },
  { category: 'SHOP', purpose: 'RENT', price: 9500, area: 85, bedrooms: null, bathrooms: 1, furnished: 'UNFURNISHED' },
  { category: 'WAREHOUSE', purpose: 'RENT', price: 26000, area: 520, bedrooms: null, bathrooms: 2, furnished: 'UNFURNISHED' },
  { category: 'PORTION', purpose: 'RENT', price: 26000, area: 520, bedrooms: 5, bathrooms: 6, furnished: 'FURNISHED' },
  { category: 'HOUSE', purpose: 'SALE', price: 1850000, area: 185, bedrooms: 3, bathrooms: 3, furnished: 'UNFURNISHED' },
  { category: 'HOUSE', purpose: 'RENT', price: 9500, area: 185, bedrooms: 3, bathrooms: 3, furnished: 'FURNISHED' },
  { category: 'ROOM', purpose: 'RENT', price: 3200, area: 85, bedrooms: 1, bathrooms: 1, furnished: 'FURNISHED' },
];

function client() {
  const { PrismaClient } = require('@prisma/client');
  return new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
}

function hierarchy(location, byId) {
  const city = location?.parent_id ? byId.get(location.parent_id) : null;
  const region = city?.parent_id ? byId.get(city.parent_id) : null;
  return { district: location, city, region };
}

function matches(property, query, byId) {
  const h = hierarchy(byId.get(property.location_id), byId);
  if (query.region && h.region?.slug !== query.region) return false;
  if (query.city && h.city?.slug !== query.city) return false;
  if (query.district && h.district?.slug !== query.district) return false;
  if (query.purpose && property.purpose !== query.purpose) return false;
  if (query.category && property.category !== query.category) return false;
  const price = Number(property.purpose === 'SALE' ? property.price : property.rent_price);
  if (query.minPrice != null && price < query.minPrice) return false;
  if (query.maxPrice != null && price > query.maxPrice) return false;
  const area = Number(property.size);
  if (query.minArea != null && area < query.minArea) return false;
  if (query.maxArea != null && area > query.maxArea) return false;
  if (query.bedrooms != null && (property.bedrooms == null || property.bedrooms < query.bedrooms)) return false;
  if (query.bathrooms != null && (property.bathrooms == null || property.bathrooms < query.bathrooms)) return false;
  if (query.furnished && property.furnished !== query.furnished) return false;
  if (query.amenities?.some((amenity) => !property.amenities.includes(amenity))) return false;
  if (query.featured && !property.featured) return false;
  return true;
}

function makeCase(h, filters, needed = 1) {
  return {
    region: h.region?.slug || null,
    city: h.city?.slug || null,
    district: h.district?.slug || null,
    purpose: filters.purpose || null,
    propertyType: filters.category || null,
    priceRange: filters.minPrice != null ? { min: filters.minPrice, max: filters.maxPrice } : null,
    areaRange: filters.minArea != null ? { min: filters.minArea, max: filters.maxArea } : null,
    bedrooms: filters.bedrooms ?? null,
    bathrooms: filters.bathrooms ?? null,
    furnishing: filters.furnished || null,
    amenities: filters.amenities || [],
    featured: filters.featured || false,
    reason: 'No published, available property satisfies every active filter.',
    numberNeeded: needed,
    query: filters,
  };
}

async function auditCoverage() {
  const prisma = client();
  try {
    const [locations, properties] = await Promise.all([
      prisma.locations.findMany({ where: { active: true }, orderBy: { display_order: 'asc' } }),
      prisma.properties.findMany({
        where: { is_active: true, status: 'AVAILABLE', published_at: { not: null } },
        select: {
          property_id: true, location_id: true, purpose: true, category: true, price: true, rent_price: true,
          size: true, bedrooms: true, bathrooms: true, furnished: true, amenities: true, featured: true,
          title: true, title_ar: true, description: true, description_ar: true, is_demo: true,
        },
      }),
    ]);
    const byId = new Map(locations.map((location) => [location.id, location]));
    const missing = [];
    const districts = locations.filter((location) => location.type === 'DISTRICT');

    for (const district of districts) {
      const h = hierarchy(district, byId);
      for (const purpose of ['SALE', 'RENT']) {
        for (const category of ['APARTMENT', 'VILLA']) {
          for (const furnished of ['FURNISHED', 'UNFURNISHED']) {
            const query = { region: h.region.slug, city: h.city.slug, district: district.slug, purpose, category, furnished };
            if (!properties.some((property) => matches(property, query, byId))) missing.push(makeCase(h, query));
          }
        }
        for (let bedrooms = 1; bedrooms <= 5; bedrooms += 1) {
          const category = bedrooms <= 3 ? 'APARTMENT' : 'VILLA';
          const query = { region: h.region.slug, city: h.city.slug, district: district.slug, purpose, category, bedrooms, bathrooms: Math.min(6, bedrooms), amenities: ['parking'] };
          if (!properties.some((property) => matches(property, query, byId))) missing.push(makeCase(h, query));
        }
        for (const band of purpose === 'SALE' ? SALE_BANDS : RENT_BANDS) {
          const query = { region: h.region.slug, city: h.city.slug, district: district.slug, purpose, minPrice: band.min, maxPrice: band.max };
          if (!properties.some((property) => matches(property, query, byId))) missing.push(makeCase(h, query));
        }
        for (const band of AREA_BANDS) {
          const query = { region: h.region.slug, city: h.city.slug, district: district.slug, purpose, minArea: band.min, maxArea: band.max };
          if (!properties.some((property) => matches(property, query, byId))) missing.push(makeCase(h, query));
        }
        for (const category of ['APARTMENT', 'VILLA']) {
          const query = { region: h.region.slug, city: h.city.slug, district: district.slug, purpose, category, featured: true };
          if (!properties.some((property) => matches(property, query, byId))) missing.push(makeCase(h, query));
        }
      }
    }

    for (const citySlug of MAJOR_CITIES) {
      const city = locations.find((location) => location.slug === citySlug);
      const district = districts.find((candidate) => candidate.parent_id === city?.id);
      if (!city || !district) continue;
      const h = hierarchy(district, byId);
      for (const profile of COMMERCIAL_PROFILES) {
        const query = { region: h.region.slug, city: city.slug, purpose: profile.purpose, category: profile.category, featured: true };
        if (!properties.some((property) => matches(property, query, byId))) missing.push(makeCase({ ...h, district: null }, query));
      }
    }

    const translationErrors = properties
      .filter((property) => property.is_demo && (!property.title || !property.title_ar || !property.description || !property.description_ar))
      .map((property) => property.property_id);
    const relationshipErrors = properties
      .filter((property) => property.location_id && !byId.has(property.location_id))
      .map((property) => property.property_id);
    return {
      generatedAt: new Date().toISOString(),
      contract: {
        activeDistricts: districts.length,
        majorCities: MAJOR_CITIES,
        priceBands: { sale: SALE_BANDS, rent: RENT_BANDS },
        areaBands: AREA_BANDS,
        bedroomMinimums: [1, 2, 3, 4, 5],
        furnishing: ['FURNISHED', 'UNFURNISHED'],
        featuredByResidentialType: true,
        featuredMajorCityCategories: true,
        documentedBedroomBehavior: 'minimum (greater than or equal)',
      },
      counts: {
        locations: locations.length,
        properties: properties.length,
        requiredCases: districts.length * 34 + MAJOR_CITIES.length * COMMERCIAL_PROFILES.length,
        missing: missing.length,
        translationErrors: translationErrors.length,
        relationshipErrors: relationshipErrors.length,
      },
      missing,
      translationErrors,
      relationshipErrors,
    };
  } finally {
    await prisma.$disconnect();
  }
}

function writeReport(report) {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
}

module.exports = {
  REPORT_PATH, SALE_BANDS, RENT_BANDS, AREA_BANDS, RESIDENTIAL_PROFILES,
  MAJOR_CITIES, COMMERCIAL_PROFILES, client, auditCoverage, writeReport,
};
