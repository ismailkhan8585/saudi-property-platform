'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import type { Location } from '@/lib/types';
import { PROPERTY_CATEGORIES } from '@/lib/constants';
import { useLocale } from '@/components/providers/LocaleProvider';

const MobileFilterSheet = dynamic(() => import('./MobileFilterSheet'), { ssr: false });

const FILTER_KEYS = ['q', 'purpose', 'category', 'region', 'city', 'district', 'minPrice', 'maxPrice', 'minArea', 'maxArea', 'bedrooms', 'bathrooms', 'furnished'] as const;
type FilterKey = (typeof FILTER_KEYS)[number];
type FilterForm = Record<FilterKey, string>;

function formFromParams(params: URLSearchParams): FilterForm {
  return Object.fromEntries(FILTER_KEYS.map((key) => [key, params.get(key) || ''])) as FilterForm;
}

export default function PropertyFilters({ locations }: { locations: Location[] }) {
  const { locale, dict } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(() => formFromParams(new URLSearchParams(searchKey)));

  useEffect(() => setForm(formFromParams(new URLSearchParams(searchKey))), [searchKey]);

  const regions = useMemo(() => locations.filter((location) => location.type === 'REGION'), [locations]);
  const selectedRegionId = locations.find((location) => location.slug === form.region)?.id;
  const selectedCityId = locations.find((location) => location.slug === form.city)?.id;
  const cities = locations.filter((location) => location.type === 'CITY' && (!form.region || location.parentId === selectedRegionId));
  const districts = locations.filter((location) => location.type === 'DISTRICT' && (!form.city || location.parentId === selectedCityId));
  const activeFilters = FILTER_KEYS.filter((key) => searchParams.get(key));
  const locationName = (location: Location) => locale === 'ar' ? location.nameAr : location.nameEn;

  function change(key: FilterKey, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === 'region' ? { city: '', district: '' } : {}),
      ...(key === 'city' ? { district: '' } : {}),
    }));
  }

  function apply() {
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => value && params.set(key, value));
    startTransition(() => router.push(`/search${params.size ? `?${params}` : ''}`));
    setOpen(false);
  }

  function clearAll() {
    setForm(formFromParams(new URLSearchParams()));
    startTransition(() => router.push('/search'));
    setOpen(false);
  }

  function removeFilter(key: FilterKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete('page');
    startTransition(() => router.push(`/search${params.size ? `?${params}` : ''}`));
  }

  const filterLabels: Record<FilterKey, string> = {
    q: dict.search.query,
    purpose: dict.search.purpose,
    category: dict.search.type,
    region: dict.search.region,
    city: dict.search.city,
    district: dict.search.district,
    minPrice: dict.search.minPrice,
    maxPrice: dict.search.maxPrice,
    minArea: dict.search.minArea,
    maxArea: dict.search.maxArea,
    bedrooms: dict.search.bedrooms,
    bathrooms: dict.search.bathrooms,
    furnished: dict.search.furnished,
  };

  const content = (
    <FilterFields
      form={form}
      pending={pending}
      locale={locale}
      regions={regions}
      cities={cities}
      districts={districts}
      locationName={locationName}
      onChange={change}
      onApply={apply}
      onClear={clearAll}
    />
  );

  return (
    <>
      <aside className="hidden w-72 shrink-0 lg:block" aria-label={dict.search.filters}>
        <div className="sticky top-28 rounded-3xl border border-surface-border bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-bold text-navy-800">{dict.search.filters}</h2>
          {content}
        </div>
      </aside>

      <div className="mb-2 w-full lg:hidden">
        <button type="button" onClick={() => setOpen(true)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-navy-800 px-5 py-3 font-bold text-white shadow-sm" aria-expanded={open}>
          <SlidersHorizontal className="h-5 w-5" />
          {dict.search.filters}
          {activeFilters.length > 0 && <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs text-navy-900">{activeFilters.length}</span>}
        </button>
        {open && <MobileFilterSheet open={open} onOpenChange={setOpen}>{content}</MobileFilterSheet>}

        {activeFilters.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" aria-label={dict.search.filters}>
            {activeFilters.map((key) => (
              <button key={key} type="button" onClick={() => removeFilter(key)} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-navy-200 bg-white px-3 text-xs font-semibold text-navy-800">
                {filterLabels[key]}<X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
            <button type="button" onClick={clearAll} className="min-h-9 shrink-0 rounded-full px-3 text-xs font-bold text-gold-700">{dict.search.clear}</button>
          </div>
        )}
      </div>
    </>
  );
}

interface FilterFieldsProps {
  form: FilterForm;
  pending: boolean;
  locale: 'ar' | 'en';
  regions: Location[];
  cities: Location[];
  districts: Location[];
  locationName: (location: Location) => string;
  onChange: (key: FilterKey, value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

function FilterFields({ form, pending, locale, regions, cities, districts, locationName, onChange, onApply, onClear }: FilterFieldsProps) {
  const { dict } = useLocale();
  const field = 'mt-1 min-h-11 w-full rounded-xl border border-surface-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gold-500';
  return (
    <div className="space-y-4">
      <label className="relative block text-xs font-semibold text-gray-600">
        {dict.search.query}
        <Search className="absolute start-3 top-9 h-4 w-4 text-gray-400" aria-hidden="true" />
        <input className={`${field} ps-10`} value={form.q} onChange={(event) => onChange('q', event.target.value)} placeholder={dict.hero.search} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <Select label={dict.search.purpose} value={form.purpose} onChange={(value) => onChange('purpose', value)} options={[["SALE", dict.property.sale], ["RENT", dict.property.rent], ["DAILY_RENT", dict.property.dailyRent], ["COMMERCIAL_LEASE", dict.property.commercialLease]]} />
        <Select label={dict.search.type} value={form.category} onChange={(value) => onChange('category', value)} options={PROPERTY_CATEGORIES.map((category) => [category.value, locale === 'ar' ? category.labelAr : category.label])} />
        <Select label={dict.search.region} value={form.region} onChange={(value) => onChange('region', value)} options={regions.map((location) => [location.slug, locationName(location)])} />
        <Select label={dict.search.city} value={form.city} onChange={(value) => onChange('city', value)} options={cities.map((location) => [location.slug, locationName(location)])} />
        <Select label={dict.search.district} value={form.district} onChange={(value) => onChange('district', value)} options={districts.map((location) => [location.slug, locationName(location)])} />
        <Select label={dict.search.furnished} value={form.furnished} onChange={(value) => onChange('furnished', value)} options={Object.entries(dict.furnishing)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {([
          ['minPrice', dict.search.minPrice], ['maxPrice', dict.search.maxPrice], ['minArea', dict.search.minArea],
          ['maxArea', dict.search.maxArea], ['bedrooms', dict.search.bedrooms], ['bathrooms', dict.search.bathrooms],
        ] as Array<[FilterKey, string]>).map(([key, label]) => (
          <label key={key} className="text-xs font-semibold text-gray-600">
            {label}
            <input type="number" inputMode="numeric" min="0" className={field} value={form[key]} onChange={(event) => onChange(key, event.target.value)} />
          </label>
        ))}
      </div>
      <div className="sticky bottom-0 grid grid-cols-[1fr_auto] gap-2 bg-white pt-2">
        <button type="button" onClick={onApply} disabled={pending} className="min-h-12 rounded-xl bg-navy-800 px-4 text-sm font-bold text-white hover:bg-navy-700 disabled:opacity-60">
          {pending ? dict.common.loading : dict.search.apply}
        </button>
        <button type="button" onClick={onClear} aria-label={dict.search.clear} title={dict.search.clear} className="grid min-h-12 min-w-12 place-items-center rounded-xl border border-surface-border">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<readonly string[] | string[]> }) {
  const { dict } = useLocale();
  return (
    <label className="text-xs font-semibold text-gray-600">
      {label}
      <select className="mt-1 min-h-11 w-full rounded-xl border border-surface-border bg-white px-3 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{dict.search.all}</option>
        {options.map((option) => <option key={option[0]} value={option[0]}>{option[1]}</option>)}
      </select>
    </label>
  );
}
