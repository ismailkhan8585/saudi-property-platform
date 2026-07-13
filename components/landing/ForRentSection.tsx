import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';
import { getHomePageData } from '@/lib/data/public';
import type { Property } from '@/lib/types';

async function getRentProperties(): Promise<Property[]> {
  return (await getHomePageData()).forRent;
}

export default async function ForRentSection() {
  const properties = await getRentProperties();
  if (!properties.length) return null;

  return (
    <section className="section-padding bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-heading font-800 text-navy-700 text-2xl md:text-3xl relative gold-underline">
              Properties for Rent in Lahore
            </h2>
            <p className="font-urdu text-gold-600 text-lg mt-4">لاہور میں کرائے کے لیے پراپرٹیز</p>
          </div>
          <Link href="/properties/for-rent" className="inline-flex items-center gap-2 text-navy-500 hover:text-gold-600 font-600 text-sm transition-colors shrink-0">
            View All for Rent <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </div>
    </section>
  );
}
