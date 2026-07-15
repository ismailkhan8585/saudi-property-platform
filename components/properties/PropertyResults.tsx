import PropertyGrid from '@/components/properties/PropertyGrid';
import { getPublicProperties, getSearchAlternatives } from '@/lib/data/public';
import { parsePublicPropertyQuery, serializePublicPropertyQuery, type PageSearchParams } from '@/lib/property-query';
import type { PropertyCategory, Purpose } from '@prisma/client';

interface Props {
  searchParams?: PageSearchParams;
  initialPurpose?: Purpose;
  initialCategory?: PropertyCategory;
}

export default async function PropertyResults({ searchParams = {}, initialPurpose, initialCategory }: Props) {
  const query = parsePublicPropertyQuery(searchParams, {
    purpose: initialPurpose,
    category: initialCategory,
  });
  const queryString = serializePublicPropertyQuery(query);
  const initialData = await getPublicProperties(query);
  const alternatives = initialData.total === 0 ? await getSearchAlternatives(query) : [];

  return (
    <PropertyGrid
      key={queryString}
      initialData={initialData}
      alternatives={alternatives}
    />
  );
}
