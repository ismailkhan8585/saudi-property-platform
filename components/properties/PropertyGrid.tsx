'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import PropertyCard from './PropertyCard';
import type { PaginatedProperties, RelaxedSearchFilter, SearchAlternativeGroup } from '@/lib/types';
import { useLocale } from '@/components/providers/LocaleProvider';
import { formatNumber } from '@/lib/i18n';

interface Props {
  initialData: PaginatedProperties;
  alternatives?: SearchAlternativeGroup[];
}

export default function PropertyGrid({ initialData, alternatives = [] }: Props) {
  const { dict, locale } = useLocale();
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    startTransition(() => router.push(`${path}?${params}`));
  }

  const relaxedLabels: Record<RelaxedSearchFilter, string> = {
    amenities: dict.search.relaxAmenities,
    furnished: dict.search.relaxFurnishing,
    bathrooms: dict.search.relaxBathrooms,
    bedrooms: dict.search.relaxBedrooms,
    area: dict.search.relaxArea,
    price: dict.search.relaxPrice,
  };
  const groupLabels = {
    sameDistrict: dict.search.sameDistrict,
    sameCity: dict.search.sameCity,
    sameRegion: dict.search.sameRegion,
    suggested: dict.search.optionsYouMayLike,
  };
  const data = initialData;

  return (
    <section className="min-w-0 flex-1" aria-busy={pending}>
      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
        <p className="font-bold text-navy-800" aria-live="polite">{formatNumber(data.total, locale)} {dict.search.results}</p>
        <select
          value={searchParams.get('sort') || 'newest'}
          onChange={(event) => setFilter('sort', event.target.value)}
          aria-label={dict.search.sort}
          className="min-h-11 max-w-[55%] rounded-xl border bg-white px-3 py-2 text-sm sm:max-w-none"
        >
          <option value="relevance">{dict.search.relevance}</option>
          <option value="newest">{dict.search.newest}</option>
          <option value="price_asc">{dict.search.priceAsc}</option>
          <option value="price_desc">{dict.search.priceDesc}</option>
          <option value="area_desc">{dict.search.areaDesc}</option>
        </select>
      </div>

      {data.properties.length ? (
        <div className={`grid gap-5 transition motion-reduce:transition-none ${pending ? 'opacity-60' : ''} sm:grid-cols-2 xl:grid-cols-3`}>
          {data.properties.map((property, index) => <PropertyCard key={property.id} property={property} priority={index < 2} />)}
        </div>
      ) : (
        <>
          <div className="rounded-2xl border bg-white px-6 py-10 text-center">
            <SearchX className="mx-auto h-12 w-12 text-gold-500" />
            <h2 className="mt-4 text-xl font-bold">{dict.search.noResults}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-gray-500">{dict.search.alternativesHint}</p>
          </div>
          {alternatives.map((group) => (
            <section key={group.kind} className="mt-10" aria-labelledby={`alternatives-${group.kind}`}>
              <div className="mb-5">
                <h2 id={`alternatives-${group.kind}`} className="text-xl font-bold text-navy-900">{groupLabels[group.kind]}</h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  {dict.search.relaxedFilters}: {group.relaxed.map((filter) => relaxedLabels[filter]).join(locale === 'ar' ? '، ' : ', ')}.
                  {' '}{group.kind === 'sameCity' ? dict.search.expandedToCity : group.kind === 'sameRegion' ? dict.search.expandedToRegion : ''}
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {group.properties.map((property) => <PropertyCard key={property.id} property={property} />)}
              </div>
            </section>
          ))}
          {!alternatives.length && <p className="mt-5 text-center text-sm text-gray-500">{dict.search.noResultsHint}</p>}
        </>
      )}

      {data.totalPages > 1 && (
        <nav className="mt-8 flex justify-center gap-2" aria-label="Pagination">
          <button aria-label={locale === 'ar' ? 'الصفحة السابقة' : 'Previous page'} disabled={data.page <= 1} onClick={() => setFilter('page', String(data.page - 1))} className="grid min-h-11 min-w-11 place-items-center rounded-lg border bg-white p-2 disabled:opacity-40">
            <ChevronRight className="h-5 w-5 rtl:hidden" /><ChevronLeft className="hidden h-5 w-5 rtl:block" />
          </button>
          <span className="rounded-lg bg-navy-800 px-4 py-2 text-sm text-white">{formatNumber(data.page, locale)} / {formatNumber(data.totalPages, locale)}</span>
          <button aria-label={locale === 'ar' ? 'الصفحة التالية' : 'Next page'} disabled={data.page >= data.totalPages} onClick={() => setFilter('page', String(data.page + 1))} className="grid min-h-11 min-w-11 place-items-center rounded-lg border bg-white p-2 disabled:opacity-40">
            <ChevronLeft className="h-5 w-5 rtl:hidden" /><ChevronRight className="hidden h-5 w-5 rtl:block" />
          </button>
        </nav>
      )}
    </section>
  );
}
