import Link from 'next/link';
import { ArrowLeft, ArrowRight, Building2 } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';
import { getPublicPropertyCards, type PublicPropertyQuery } from '@/lib/data/public';
import { getServerI18n } from '@/lib/i18n-server';

type Kind = 'sale' | 'rent' | 'featured';
const config: Record<Kind, { query: PublicPropertyQuery; href: string }> = {
  sale: { query: { purpose: 'SALE', limit: 6 }, href: '/search?purpose=SALE' },
  rent: { query: { purpose: 'RENT', limit: 6 }, href: '/search?purpose=RENT' },
  featured: { query: { featured: true, limit: 6 }, href: '/search?featured=true' },
};

export default async function PropertySection({ kind, tone = 'light' }: { kind: Kind; tone?: 'light' | 'soft' }) {
  const [{ dict }, properties] = await Promise.all([
    getServerI18n(),
    getPublicPropertyCards(config[kind].query),
  ]);
  if (kind === 'featured' && !properties.length) return null;

  const title = kind === 'sale' ? dict.home.saleTitle : kind === 'rent' ? dict.home.rentTitle : dict.home.featured;
  const hint = kind === 'sale' ? dict.home.saleHint : kind === 'rent' ? dict.home.rentHint : dict.home.featuredHint;
  const button = kind === 'sale' ? dict.home.saleAll : kind === 'rent' ? dict.home.rentAll : dict.home.featuredAll;

  return (
    <section data-property-section={kind} className={tone === 'soft' ? 'bg-surface-secondary py-12 sm:py-16 lg:py-20' : 'bg-white py-12 sm:py-16 lg:py-20'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-extrabold text-gold-700">
              <Building2 className="h-4 w-4" />
              {kind === 'featured' ? dict.property.featured : kind === 'sale' ? dict.property.sale : dict.property.rent}
            </p>
            <h2 className="max-w-4xl text-2xl font-extrabold leading-tight text-navy-900 sm:text-4xl">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">{hint}</p>
          </div>
          <Link href={config[kind].href} className="hidden min-h-11 items-center gap-2 rounded-xl border border-navy-200 px-5 py-3 text-sm font-bold text-navy-800 transition hover:border-gold-500 hover:text-gold-700 sm:inline-flex">
            {button}<ArrowLeft className="hidden h-4 w-4 rtl:block" /><ArrowRight className="h-4 w-4 rtl:hidden" />
          </Link>
        </div>
        {properties.length ? (
          <div className="mt-7 grid gap-5 sm:mt-9 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((property, index) => <PropertyCard key={property.id} property={property} priority={kind === 'featured' && index < 2} />)}
          </div>
        ) : (
          <div className="mt-9 rounded-2xl border border-dashed bg-white px-6 py-14 text-center text-gray-500">{dict.home.empty}</div>
        )}
        <Link href={config[kind].href} className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy-800 px-5 py-3 text-sm font-bold text-white sm:hidden">
          {button}<ArrowLeft className="hidden h-4 w-4 rtl:block" /><ArrowRight className="h-4 w-4 rtl:hidden" />
        </Link>
      </div>
    </section>
  );
}

export function PropertySectionSkeleton({ tone = 'light' }: { tone?: 'light' | 'soft' }) {
  return (
    <section className={tone === 'soft' ? 'bg-surface-secondary py-12 sm:py-16 lg:py-20' : 'bg-white py-12 sm:py-16 lg:py-20'} aria-label="Loading properties">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-8 w-3/5 animate-pulse rounded-xl bg-gray-200 motion-reduce:animate-none" />
        <div className="mt-4 h-4 w-2/5 animate-pulse rounded bg-gray-200 motion-reduce:animate-none" />
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-[4/5] animate-pulse rounded-3xl bg-gray-200 motion-reduce:animate-none" />)}
        </div>
      </div>
    </section>
  );
}
