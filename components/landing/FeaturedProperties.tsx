export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';
import { getServiceClient } from '@/lib/supabase';
import { mapProperty } from '@/lib/mappers';
import type { Property } from '@/lib/types';

async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('is_active', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);
  return (data ?? []).map(mapProperty);
}

interface SectionProps {
  title: string;
  titleUr: string;
  properties: Property[];
  viewAllHref: string;
  viewAllLabel: string;
}

function PropertySection({ title, titleUr, properties, viewAllHref, viewAllLabel }: SectionProps) {
  if (!properties.length) return null;
  return (
    <section className="section-padding bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-heading font-800 text-navy-700 text-2xl md:text-3xl relative gold-underline">
              {title}
            </h2>
            <p className="font-urdu text-gold-600 text-lg mt-4">{titleUr}</p>
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-navy-500 hover:text-gold-600 font-600 text-sm transition-colors shrink-0"
          >
            {viewAllLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </div>
    </section>
  );
}

export default async function FeaturedProperties() {
  const featured = await getFeaturedProperties();
  return (
    <PropertySection
      title="Featured Properties"
      titleUr="خاص پراپرٹیز"
      properties={featured}
      viewAllHref="/properties"
      viewAllLabel="View All Properties"
    />
  );
}
