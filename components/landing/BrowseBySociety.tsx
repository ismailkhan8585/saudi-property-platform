import Link from 'next/link';
import { getServiceClient } from '@/lib/supabase';

const FEATURED_SOCIETIES = [
  'DHA Lahore',
  'Bahria Town Lahore',
  'Gulberg',
  'Model Town',
  'Johar Town',
  'Garden Town',
  'Valencia Town',
  'Lake City',
  'Faisal Town',
  'Cantt',
  'Paragon City',
  'Wapda Town',
];

async function getSocietyCounts() {
  const { data } = await getServiceClient()
    .from('properties')
    .select('society')
    .eq('is_active', true);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (row.society) {
      counts[row.society] = (counts[row.society] ?? 0) + 1;
    }
  }
  return counts;
}

export default async function BrowseBySociety() {
  const counts = await getSocietyCounts();

  return (
    <section className="section-padding bg-navy-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-800 text-white text-2xl md:text-3xl">
            Browse by Society
          </h2>
          <p className="font-urdu text-gold-300 text-xl mt-3">معاشرے کے مطابق تلاش کریں</p>
          <p className="text-white/60 mt-3">Find properties in all major Lahore housing societies</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {FEATURED_SOCIETIES.map(society => {
            const count = Object.entries(counts).find(([k]) => k.includes(society.split(' ')[0]))?.[1] ?? 0;
            return (
              <Link
                key={society}
                href={`/search?society=${encodeURIComponent(society)}`}
                className="group flex items-center gap-2 bg-white/10 hover:bg-gold-500 border border-white/20 hover:border-gold-400 text-white px-5 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="text-sm font-medium">{society}</span>
                {count > 0 && (
                  <span className="bg-gold-500 group-hover:bg-white group-hover:text-gold-600 text-white text-xs font-price px-2 py-0.5 rounded-full transition-colors">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 border border-gold-400 text-gold-300 hover:bg-gold-500 hover:text-white px-6 py-3 rounded-xl font-600 transition-colors"
          >
            View All Properties →
          </Link>
        </div>
      </div>
    </section>
  );
}
