const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

(async () => {
  const [admins, settings, properties, leads, testimonials] = await Promise.all([
    prisma.admins.findMany({ select: { id: true } }),
    prisma.site_settings.findMany({ select: { id: true, agent_photo: true } }),
    prisma.properties.findMany({ select: { id: true, property_id: true, slug: true, photos: true } }),
    prisma.leads.findMany({ select: { id: true, property_id: true } }),
    prisma.testimonials.findMany({ select: { id: true } }),
  ]);

  const propertyIds = new Set(properties.map((property) => property.id));
  const orphanLeadIds = leads
    .filter((lead) => lead.property_id && !propertyIds.has(lead.property_id))
    .map((lead) => lead.id);
  const imageUrls = [
    ...properties.flatMap((property) => property.photos),
    ...settings.map((row) => row.agent_photo).filter(Boolean),
  ];
  const invalidImageUrls = imageUrls.filter((url) => !isHttpUrl(url));

  const result = {
    counts: {
      admins: admins.length,
      site_settings: settings.length,
      properties: properties.length,
      leads: leads.length,
      testimonials: testimonials.length,
    },
    relationships: { orphanLeads: orphanLeadIds.length },
    references: { imageUrls: imageUrls.length, invalidImageUrls: invalidImageUrls.length },
    uniqueKeys: {
      duplicatePropertyIds: properties.length - new Set(properties.map((row) => row.property_id)).size,
      duplicateSlugs: properties.length - new Set(properties.map((row) => row.slug)).size,
    },
  };

  console.log(JSON.stringify(result, null, 2));

  if (orphanLeadIds.length || invalidImageUrls.length || result.uniqueKeys.duplicatePropertyIds || result.uniqueKeys.duplicateSlugs) {
    process.exitCode = 1;
  }
})()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
