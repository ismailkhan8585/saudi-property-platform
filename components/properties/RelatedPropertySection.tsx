import PropertyCard from './PropertyCard';
import { getRelatedProperties } from '@/lib/data/public';
import { getServerI18n } from '@/lib/i18n-server';
import type { Property } from '@/lib/types';

export default async function RelatedPropertySection({ property }: { property: Property }) {
  const [{ dict }, related] = await Promise.all([getServerI18n(), getRelatedProperties(property)]);
  if (!related.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="text-2xl font-extrabold">{dict.property.related}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {related.map((item) => <PropertyCard key={item.id} property={item} />)}
      </div>
    </section>
  );
}
