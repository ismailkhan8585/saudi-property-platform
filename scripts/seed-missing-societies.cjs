const { randomUUID } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const HOUSE_PHOTOS = [
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1200',
];
const MODERN_HOME_PHOTOS = [
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200',
];
const APARTMENT_PHOTOS = [
  'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
];
const COMMERCIAL_PHOTOS = [
  'https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

const samples = [
  {
    property_id: 'PROP-9001', slug: 'renovated-10-marla-house-allama-iqbal-town-prop-9001',
    title: 'Renovated 10 Marla House in Allama Iqbal Town', society: 'Allama Iqbal Town', area: 'Karim Block',
    category: 'HOUSE', purpose: 'SALE', price: 36500000, size: 10, size_unit: 'MARLA', bedrooms: 5, bathrooms: 6,
    description: 'A thoughtfully renovated family home in Karim Block with five spacious bedrooms, modern bathrooms, two kitchens, a drawing room, secure parking, and convenient access to schools, markets, and main boulevard.', photos: HOUSE_PHOTOS,
  },
  {
    property_id: 'PROP-9002', slug: 'family-villa-paragon-city-prop-9002',
    title: 'Elegant 10 Marla Family Villa in Paragon City', society: 'Paragon City', area: 'Imperial Block',
    category: 'VILLA', purpose: 'SALE', price: 41500000, size: 10, size_unit: 'MARLA', bedrooms: 5, bathrooms: 6,
    description: 'An elegant villa in a peaceful gated block featuring bright living areas, five en-suite bedrooms, a landscaped terrace, servant space, and quick access to the commercial centre and Ring Road.', photos: MODERN_HOME_PHOTOS,
  },
  {
    property_id: 'PROP-9003', slug: 'three-bed-apartment-askari-11-prop-9003',
    title: 'Well-Maintained 3 Bed Apartment in Askari 11', society: 'Askari Housing', area: 'Askari 11',
    category: 'APARTMENT', purpose: 'RENT', rent_price: 95000, size: 1650, size_unit: 'SQFT', bedrooms: 3, bathrooms: 3,
    description: 'A secure and well-maintained apartment with three bedrooms, a spacious lounge, balcony, lift access, reserved parking, and reliable utilities in the family-friendly Askari 11 community.', photos: APARTMENT_PHOTOS,
  },
  {
    property_id: 'PROP-9004', slug: 'upper-portion-wapda-town-phase-1-prop-9004',
    title: 'Spacious 10 Marla Upper Portion in Wapda Town', society: 'Wapda Town', area: 'Phase 1',
    category: 'PORTION', purpose: 'RENT', rent_price: 72000, size: 10, size_unit: 'MARLA', bedrooms: 3, bathrooms: 3,
    description: 'A bright independent upper portion offering three bedrooms, drawing and dining space, a practical kitchen, separate entrance, and a convenient location near parks and local markets.', photos: HOUSE_PHOTOS,
  },
  {
    property_id: 'PROP-9005', slug: 'one-kanal-residential-plot-pu-society-prop-9005',
    title: 'Prime 1 Kanal Residential Plot in Punjab University Society', society: 'Punjab University Society', area: 'Phase 2',
    category: 'PLOT', purpose: 'SALE', price: 28500000, size: 1, size_unit: 'KANAL', bedrooms: null, bathrooms: null,
    description: 'A well-positioned one kanal residential plot on a wide road in a developed neighbourhood. Utilities are available nearby, making it suitable for a custom family residence or long-term investment.', photos: MODERN_HOME_PHOTOS,
  },
  {
    property_id: 'PROP-9006', slug: 'corporate-office-canal-road-prop-9006',
    title: 'Furnished Corporate Office near Canal Road', society: 'Canal Road', area: 'Canal View',
    category: 'OFFICE', purpose: 'RENT', rent_price: 165000, size: 2200, size_unit: 'SQFT', bedrooms: null, bathrooms: 2,
    description: 'A professional furnished office with reception, executive rooms, open work area, meeting room, kitchenette, backup power provision, and excellent connectivity to central Lahore.', photos: COMMERCIAL_PHOTOS,
  },
  {
    property_id: 'PROP-9007', slug: 'affordable-five-marla-house-sabzazar-prop-9007',
    title: 'Affordable 5 Marla Double-Storey House in Sabzazar', society: 'Sabzazar', area: 'Block H',
    category: 'HOUSE', purpose: 'SALE', price: 19800000, size: 5, size_unit: 'MARLA', bedrooms: 4, bathrooms: 4,
    description: 'A practical double-storey home for a growing family with four bedrooms, two lounges, a drawing room, car porch, and easy access to Multan Road, schools, and daily shopping.', photos: HOUSE_PHOTOS,
  },
  {
    property_id: 'PROP-9008', slug: 'corner-house-iqbal-town-prop-9008',
    title: 'Corner 7 Marla House in Iqbal Town', society: 'Iqbal Town', area: 'Neelam Block',
    category: 'HOUSE', purpose: 'SALE', price: 29500000, size: 7, size_unit: 'MARLA', bedrooms: 4, bathrooms: 5,
    description: 'A corner family house with excellent ventilation, four bedrooms, modern kitchen, drawing room, separate lounge, car parking, and a central location close to Moon Market.', photos: MODERN_HOME_PHOTOS,
  },
  {
    property_id: 'PROP-9009', slug: 'five-marla-house-township-lahore-prop-9009',
    title: 'Ready-to-Move 5 Marla House in Township', society: 'Township', area: 'Sector B1',
    category: 'HOUSE', purpose: 'SALE', price: 21500000, size: 5, size_unit: 'MARLA', bedrooms: 4, bathrooms: 4,
    description: 'A ready-to-move home with tasteful finishes, four comfortable bedrooms, two kitchens, family lounges, secure car porch, and convenient access to College Road and public transport.', photos: HOUSE_PHOTOS,
  },
  {
    property_id: 'PROP-9010', slug: 'modern-house-tajpura-lahore-prop-9010',
    title: 'Modern 5 Marla House in Tajpura', society: 'Tajpura', area: 'Tajpura Scheme',
    category: 'HOUSE', purpose: 'SALE', price: 17250000, size: 5, size_unit: 'MARLA', bedrooms: 3, bathrooms: 4,
    description: 'A newly finished modern house with three en-suite bedrooms, open family lounge, quality kitchen cabinetry, car parking, and straightforward access to Canal Bank Road and Harbanspura.', photos: MODERN_HOME_PHOTOS,
  },
  {
    property_id: 'PROP-9011', slug: 'canal-view-family-home-other-lahore-prop-9011',
    title: 'Contemporary 8 Marla Family Home in Canal View', society: 'Other', area: 'Canal View Housing Scheme',
    category: 'HOUSE', purpose: 'SALE', price: 26800000, size: 8, size_unit: 'MARLA', bedrooms: 4, bathrooms: 5,
    description: 'A contemporary family residence in Canal View Housing Scheme with four bedrooms, airy living spaces, a modern kitchen, terrace, car porch, and nearby access to the canal and Multan Road.', photos: MODERN_HOME_PHOTOS,
  },
];

async function main() {
  const created = [];
  const skipped = [];

  await prisma.$transaction(async tx => {
    for (const sample of samples) {
      const existingSociety = await tx.properties.findFirst({
        where: { is_active: true, society: { equals: sample.society, mode: 'insensitive' } },
        select: { property_id: true },
      });
      if (existingSociety) {
        skipped.push({ society: sample.society, reason: `active listing ${existingSociety.property_id} already exists` });
        continue;
      }

      const existingKey = await tx.properties.findFirst({
        where: { OR: [{ property_id: sample.property_id }, { slug: sample.slug }] },
        select: { property_id: true },
      });
      if (existingKey) {
        skipped.push({ society: sample.society, reason: `seed key ${existingKey.property_id} already exists` });
        continue;
      }

      const now = new Date();
      await tx.properties.create({
        data: {
          id: randomUUID(),
          ...sample,
          status: 'AVAILABLE',
          price_type: 'FIXED',
          city: 'Lahore',
          is_corner: sample.property_id === 'PROP-9008',
          is_gated: ['Paragon City', 'Askari Housing', 'Punjab University Society'].includes(sample.society),
          has_security: ['Paragon City', 'Askari Housing'].includes(sample.society),
          has_gas: true,
          has_electricity: true,
          has_water: true,
          possession: 'AVAILABLE',
          featured: false,
          is_active: true,
          views: 0,
          created_at: now,
          updated_at: now,
        },
      });
      created.push({ society: sample.society, property_id: sample.property_id });
    }
  }, { maxWait: 20000, timeout: 60000 });

  console.log(JSON.stringify({ created, skipped }, null, 2));
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
