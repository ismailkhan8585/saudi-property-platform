'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { LAHORE_SOCIETIES, PROPERTY_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { canonicalizeSociety } from '@/lib/societies';

interface FiltersProps {
  initialPurpose?: string;
  initialCategory?: string;
}

export default function PropertyFilters({ initialPurpose, initialCategory }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const normalizePurpose = (value?: string | null) => {
    const normalized = value?.toUpperCase();
    return normalized === 'SALE' || normalized === 'RENT' ? normalized : '';
  };
  const normalizeCategory = (value?: string | null) => {
    const normalized = value?.toUpperCase();
    return PROPERTY_CATEGORIES.some(category => category.value === normalized) ? normalized ?? '' : '';
  };
  const [purpose,  setPurpose]  = useState(normalizePurpose(searchParams.get('purpose') ?? initialPurpose));
  const [category, setCategory] = useState(normalizeCategory(searchParams.get('category') ?? initialCategory));
  const [society,  setSociety]  = useState(canonicalizeSociety(searchParams.get('society')) ?? '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') ?? '');
  const [search,   setSearch]   = useState(searchParams.get('q')        ?? '');

  const queryKey = searchParams.toString();
  useEffect(() => {
    setPurpose(normalizePurpose(searchParams.get('purpose') ?? initialPurpose));
    setCategory(normalizeCategory(searchParams.get('category') ?? initialCategory));
    setSociety(canonicalizeSociety(searchParams.get('society')) ?? '');
    setBedrooms(searchParams.get('bedrooms') ?? '');
    setSearch(searchParams.get('q') ?? '');
  // queryKey is the stable URL representation used to synchronize browser back/forward state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, initialPurpose, initialCategory]);

  function apply() {
    const params = new URLSearchParams();
    if (purpose)  params.set('purpose', purpose);
    if (category) params.set('category', category);
    if (society)  params.set('society', society);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (search)   params.set('q', search);
    router.push(`/search?${params.toString()}`);
    setOpen(false);
  }

  function clear() {
    setPurpose(''); setCategory(''); setSociety(''); setBedrooms(''); setSearch('');
    router.push('/properties');
    setOpen(false);
  }

  const filterContent = (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="text-sm font-600 text-navy-700 block mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search properties..."
            className="w-full pl-9 pr-4 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="text-sm font-600 text-navy-700 block mb-2">Purpose</label>
        <div className="flex gap-2">
          {[{ value: '', label: 'All' }, { value: 'SALE', label: 'For Sale' }, { value: 'RENT', label: 'For Rent' }].map(opt => (
            <button
              key={opt.value}
              onClick={() => setPurpose(opt.value)}
              className={cn('flex-1 py-2 rounded-lg text-xs font-600 border transition-colors',
                purpose === opt.value
                  ? 'bg-navy-500 text-white border-navy-500'
                  : 'border-surface-border text-gray-600 hover:border-navy-300'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-600 text-navy-700 block mb-2">Property Type</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border border-surface-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
        >
          <option value="">All Types</option>
          {PROPERTY_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
          ))}
        </select>
      </div>

      {/* Society */}
      <div>
        <label className="text-sm font-600 text-navy-700 block mb-2">Society / Area</label>
        <select
          aria-label="All Areas / Societies"
          value={society}
          onChange={e => setSociety(e.target.value)}
          className="w-full border border-surface-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
        >
          <option value="">All Areas / Societies</option>
          {LAHORE_SOCIETIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="text-sm font-600 text-navy-700 block mb-2">Bedrooms</label>
        <div className="flex gap-2 flex-wrap">
          {['', '1', '2', '3', '4', '5'].map(val => (
            <button
              key={val || 'any'}
              onClick={() => setBedrooms(val)}
              className={cn('py-2 px-3 rounded-lg text-xs font-600 border transition-colors',
                bedrooms === val
                  ? 'bg-navy-500 text-white border-navy-500'
                  : 'border-surface-border text-gray-600 hover:border-navy-300'
              )}
            >
              {val || 'Any'}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={apply}
          className="flex-1 bg-navy-500 hover:bg-navy-600 text-white py-2.5 rounded-xl text-sm font-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={clear}
          className="px-4 border border-surface-border text-gray-500 hover:text-error rounded-xl text-sm transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="bg-white border border-surface-border rounded-2xl p-5 sticky top-24">
          <h3 className="font-heading font-700 text-navy-700 text-base mb-5">Filter Properties</h3>
          {filterContent}
        </div>
      </aside>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-1 w-full">
        <button
          onClick={() => setOpen(!open)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-navy-500 text-white px-4 py-3 rounded-xl text-sm font-600"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter Properties
        </button>

        {open && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between mb-5">
                <h3 className="font-heading font-700 text-navy-700 text-base">Filters</h3>
                <button onClick={() => setOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              {filterContent}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
