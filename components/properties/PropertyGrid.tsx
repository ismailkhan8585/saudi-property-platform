'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from './PropertyCard';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';

interface Props {
  initialPurpose?: string;
  initialCategory?: string;
}

export default function PropertyGrid({ initialPurpose, initialCategory }: Props) {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [total,       setTotal]      = useState(0);
  const [page,        setPage]       = useState(1);
  const [totalPages,  setTotalPages] = useState(1);
  const [loading,     setLoading]    = useState(true);
  const [sort,        setSort]       = useState('newest');
  const [view,        setView]       = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    const purpose  = searchParams.get('purpose')  ?? initialPurpose ?? '';
    const category = searchParams.get('category') ?? initialCategory ?? '';
    const society  = searchParams.get('society')  ?? '';
    const bedrooms = searchParams.get('bedrooms') ?? '';

    if (purpose)  params.set('purpose', purpose);
    if (category) params.set('category', category);
    if (society)  params.set('society', society);
    if (bedrooms) params.set('bedrooms', bedrooms);
    params.set('sort', sort);
    params.set('page', String(page));
    params.set('limit', '12');

    setLoading(true);
    fetch(`/api/properties?${params}`)
      .then(r => r.json())
      .then(d => {
        setProperties(d.properties ?? []);
        setTotal(d.total ?? 0);
        setTotalPages(d.totalPages ?? 1);
      })
      .finally(() => setLoading(false));
  }, [searchParams, page, sort, initialPurpose, initialCategory]);

  if (loading) {
    return (
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-72 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-surface-border">
        <p className="text-sm text-gray-500">
          Showing <span className="font-600 text-navy-700">{properties.length}</span> of{' '}
          <span className="font-600 text-navy-700">{total}</span> properties
        </p>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-surface-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <div className="flex gap-1 border border-surface-border rounded-lg overflow-hidden">
            <button onClick={() => setView('grid')} className={cn('p-2', view === 'grid' ? 'bg-navy-500 text-white' : 'text-gray-500 hover:bg-gray-100')}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={cn('p-2', view === 'list' ? 'bg-navy-500 text-white' : 'text-gray-500 hover:bg-gray-100')}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-2">No properties found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters or WhatsApp us — we may have unlisted properties!</p>
        </div>
      ) : (
        <div className={cn(
          'grid gap-5',
          view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
        )}>
          {properties.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 border border-surface-border rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const pg = i + 1;
            return (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={cn(
                  'w-9 h-9 rounded-lg text-sm font-600 border transition-colors',
                  page === pg
                    ? 'bg-navy-500 text-white border-navy-500'
                    : 'border-surface-border hover:bg-gray-50'
                )}
              >
                {pg}
              </button>
            );
          })}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-2 border border-surface-border rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
