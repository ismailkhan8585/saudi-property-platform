const fs = require('node:fs');
const { z } = require('zod');
const {
  REPORT_PATH, SALE_BANDS, RENT_BANDS, AREA_BANDS, RESIDENTIAL_PROFILES,
  MAJOR_CITIES, COMMERCIAL_PROFILES, client,
} = require('./search-coverage-core.cjs');

const recordSchema = z.object({
  ref: z.string().regex(/^SA-COV-[A-Z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  titleAr: z.string().min(8),
  titleEn: z.string().min(8),
  descriptionAr: z.string().min(30),
  descriptionEn: z.string().min(30),
  purpose: z.enum(['SALE', 'RENT']),
  category: z.enum(['HOUSE', 'APARTMENT', 'PLOT', 'COMMERCIAL', 'FARMHOUSE', 'VILLA', 'ROOM', 'PORTION', 'OFFICE', 'SHOP', 'WAREHOUSE']),
  price: z.number().positive(),
  size: z.number().positive(),
  bedrooms: z.number().int().nonnegative().nullable(),
  bathrooms: z.number().int().nonnegative().nullable(),
  furnished: z.enum(['UNFURNISHED', 'SEMI_FURNISHED', 'FURNISHED']),
  amenities: z.array(z.string()),
  featured: z.boolean(),
  districtId: z.string(),
  districtSlug: z.string(),
  districtAr: z.string(),
  districtEn: z.string(),
  cityAr: z.string(),
  cityEn: z.string(),
  photos: z.array(z.string().url()).min(1),
});

const images = {
  home: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  apartment: ['https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  commercial: ['https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  land: ['https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200'],
};
const categoryNames = {
  HOUSE: ['منزل', 'house'], APARTMENT: ['شقة', 'apartment'], PLOT: ['أرض سكنية', 'residential land'],
  COMMERCIAL: ['مبنى تجاري', 'commercial building'], FARMHOUSE: ['مزرعة', 'farm'], VILLA: ['فيلا', 'villa'],
  ROOM: ['غرفة', 'room'], PORTION: ['مجمع سكني', 'residential compound'], OFFICE: ['مكتب', 'office'],
  SHOP: ['محل', 'shop'], WAREHOUSE: ['مستودع', 'warehouse'],
};

function residentialRecord(district, city, purpose, profile, index) {
  const bands = purpose === 'SALE' ? SALE_BANDS : RENT_BANDS;
  const price = bands[profile.priceBand].target;
  const size = AREA_BANDS[profile.areaBand].target;
  const [arType, enType] = categoryNames[profile.category];
  const furnishingAr = profile.furnished === 'FURNISHED' ? 'مفروشة' : 'غير مفروشة';
  const purposeAr = purpose === 'SALE' ? 'للبيع' : 'للإيجار';
  const key = `${district.slug}-${purpose.toLowerCase()}-${profile.category.toLowerCase()}-${profile.bedrooms}`;
  const amenities = [
    'parking',
    ...(profile.category === 'APARTMENT' ? ['elevator'] : ['security', 'garden']),
    ...(profile.furnished === 'FURNISHED' ? ['air_conditioning', 'kitchen'] : []),
  ];
  return {
    ref: `SA-COV-${district.slug.toUpperCase()}-${purpose}-${profile.category}-${profile.bedrooms}`,
    slug: `demo-${key}`,
    titleAr: `${arType} تجريبية ${furnishingAr} ${purposeAr} في ${district.name_ar}`,
    titleEn: `Demo ${profile.furnished === 'FURNISHED' ? 'furnished ' : ''}${enType} for ${purpose === 'SALE' ? 'sale' : 'rent'} in ${district.name_en}`,
    descriptionAr: `إعلان تجريبي مُنشأ لتغطية اختبارات البحث في ${district.name_ar}، ${city.name_ar}. لا يمثل هذا الإعلان عرضاً عقارياً حقيقياً.`,
    descriptionEn: `A demonstration listing generated for search coverage in ${district.name_en}, ${city.name_en}. This is not a genuine property offer.`,
    purpose,
    category: profile.category,
    price,
    size,
    bedrooms: profile.bedrooms,
    bathrooms: profile.bathrooms,
    furnished: profile.furnished,
    amenities,
    featured: index === 0 || index === 3,
    districtId: district.id,
    districtSlug: district.slug,
    districtAr: district.name_ar,
    districtEn: district.name_en,
    cityAr: city.name_ar,
    cityEn: city.name_en,
    photos: profile.category === 'APARTMENT' ? images.apartment : images.home,
  };
}

function commercialRecord(district, city, profile) {
  const [arType, enType] = categoryNames[profile.category];
  const key = `${city.slug}-${profile.purpose.toLowerCase()}-${profile.category.toLowerCase()}`;
  const amenities = [
    'parking',
    ...(['OFFICE', 'COMMERCIAL', 'PORTION'].includes(profile.category) ? ['security'] : []),
    ...(profile.furnished === 'FURNISHED' ? ['air_conditioning'] : []),
  ];
  return {
    ref: `SA-COV-${city.slug.toUpperCase()}-${profile.purpose}-${profile.category}`,
    slug: `demo-${key}`,
    titleAr: `${arType} تجريبي ${profile.purpose === 'SALE' ? 'للبيع' : 'للإيجار'} في ${city.name_ar}`,
    titleEn: `Demo ${enType} for ${profile.purpose === 'SALE' ? 'sale' : 'rent'} in ${city.name_en}`,
    descriptionAr: `إعلان تجريبي مُنشأ لتغطية البحث التجاري في ${city.name_ar}. البيانات غير حقيقية ولا تمثل عرضاً من مالك أو وسيط.`,
    descriptionEn: `A demonstration listing generated for commercial search coverage in ${city.name_en}. The data is fictional and is not an owner or agent offer.`,
    purpose: profile.purpose,
    category: profile.category,
    price: profile.price,
    size: profile.area,
    bedrooms: profile.bedrooms,
    bathrooms: profile.bathrooms,
    furnished: profile.furnished,
    amenities,
    featured: true,
    districtId: district.id,
    districtSlug: district.slug,
    districtAr: district.name_ar,
    districtEn: district.name_en,
    cityAr: city.name_ar,
    cityEn: city.name_en,
    photos: profile.category === 'PLOT'
      ? images.land
      : ['HOUSE', 'ROOM', 'PORTION'].includes(profile.category) ? images.home : images.commercial,
  };
}

async function main() {
  if (!fs.existsSync(REPORT_PATH)) throw new Error('Coverage report not found. Run npm run audit:search-coverage first.');
  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
  if (!report.counts?.missing) {
    console.log(JSON.stringify({ inserted: 0, updated: 0, skipped: 1, invalid: 0, reason: 'Coverage report has no missing required combinations.' }, null, 2));
    return;
  }

  const prisma = client();
  try {
    const locations = await prisma.locations.findMany({ where: { active: true } });
    const byId = new Map(locations.map((location) => [location.id, location]));
    const districts = locations.filter((location) => location.type === 'DISTRICT');
    const candidates = [];
    for (const district of districts) {
      const city = byId.get(district.parent_id);
      for (const purpose of ['SALE', 'RENT']) {
        RESIDENTIAL_PROFILES.forEach((profile, index) => candidates.push(residentialRecord(district, city, purpose, profile, index)));
      }
    }
    for (const citySlug of MAJOR_CITIES) {
      const city = locations.find((location) => location.slug === citySlug);
      const district = districts.find((candidate) => candidate.parent_id === city?.id);
      if (city && district) COMMERCIAL_PROFILES.forEach((profile) => candidates.push(commercialRecord(district, city, profile)));
    }

    const valid = [];
    const invalid = [];
    for (const candidate of candidates) {
      const parsed = recordSchema.safeParse(candidate);
      if (parsed.success) valid.push(parsed.data);
      else invalid.push({ ref: candidate.ref, issues: parsed.error.issues.map((issue) => issue.message) });
    }
    const existing = new Set((await prisma.properties.findMany({
      where: { property_id: { in: valid.map((record) => record.ref) } },
      select: { property_id: true },
    })).map((property) => property.property_id));

    await prisma.$transaction(async (tx) => {
      for (const property of valid) {
        const data = {
          slug: property.slug,
          title: property.titleEn,
          title_ar: property.titleAr,
          description: property.descriptionEn,
          description_ar: property.descriptionAr,
          purpose: property.purpose,
          category: property.category,
          status: 'AVAILABLE',
          price: property.purpose === 'SALE' ? property.price : null,
          rent_price: property.purpose === 'RENT' ? property.price : null,
          size: property.size,
          size_unit: 'SQM',
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          city: property.cityEn,
          society: property.cityEn,
          area: property.districtEn,
          address: `${property.districtEn}, ${property.cityEn}`,
          address_ar: `${property.districtAr}، ${property.cityAr}`,
          location_id: property.districtId,
          furnished: property.furnished,
          amenities: property.amenities,
          photos: property.photos,
          featured: property.featured,
          is_demo: true,
          is_active: true,
          published_at: new Date(),
          has_garage: property.amenities.includes('parking'),
          has_security: property.amenities.includes('security'),
          has_garden: property.amenities.includes('garden'),
          search_keywords_ar: [property.titleAr, property.districtAr, property.cityAr],
          search_keywords_en: [property.titleEn, property.districtEn, property.cityEn],
          updated_at: new Date(),
        };
        await tx.properties.upsert({
          where: { property_id: property.ref },
          update: data,
          create: { id: `coverage:${property.ref}`, property_id: property.ref, ...data },
        });
      }
    }, { maxWait: 20000, timeout: 180000 });

    console.log(JSON.stringify({
      inserted: valid.filter((record) => !existing.has(record.ref)).length,
      updated: valid.filter((record) => existing.has(record.ref)).length,
      skipped: 0,
      invalid: invalid.length,
      totalCandidates: candidates.length,
      invalidRecords: invalid.slice(0, 20),
    }, null, 2));
    if (invalid.length) process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
