'use client';

import { useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PropertyCard from './PropertyCard';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaginatedProperties } from '@/lib/types';

interface Props {
  initialData: PaginatedProperties;
}

export default function PropertyGrid({ initialData }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { properties, total, page, totalPages } = initialData;
  const sortParam = searchParams.get('sort');
  const sort = sortParam === 'price_asc' || sortParam === 'price_desc' ? sortParam : 'newest';

  function updateUrl(updates: Record<string, string | number>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) params.set(key, String(value));
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  function goToPage(nextPage: number) {
    if (nextPage === page || nextPage < 1 || nextPage > totalPages) return;
    updateUrl({ page: nextPage });
  }

  const visiblePageCount = Math.min(totalPages, 5);
  const firstVisiblePage = Math.max(1, Math.min(page - 2, totalPages - visiblePageCount + 1));
  const visiblePages = Array.from({ length: visiblePageCount }, (_, index) => firstVisiblePage + index);

  return (
    <div className="flex-1 min-w-0" aria-busy={isPending}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-4 border-b border-surface-border">
        <p className="text-sm text-gray-500">
          Showing <span className="font-600 text-navy-700">{properties.length}</span> of{' '}
          <span className="font-600 text-navy-700">{total}</span> properties
        </p>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <select
            aria-label="Sort properties"
            value={sort}
            disabled={isPending}
            onChange={event => updateUrl({ sort: event.target.value, page: 1 })}
            className="min-w-0 flex-1 sm:flex-none border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 disabled:opacity-60"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <div className="flex gap-1 border border-surface-border rounded-lg overflow-hidden">
            <button aria-label="Grid view" onClick={() => setView('grid')} className={cn('p-2', view === 'grid' ? 'bg-navy-500 text-white' : 'text-gray-500 hover:bg-gray-100')}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button aria-label="List view" onClick={() => setView('list')} className={cn('p-2', view === 'list' ? 'bg-navy-500 text-white' : 'text-gray-500 hover:bg-gray-100')}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className={cn('transition-opacity duration-200', isPending && 'opacity-60')}>
        {properties.length === 0 ? (
          <div className="text-center py-14 sm:py-20 px-2">
            <p className="text-gray-400 text-lg mb-2">No properties found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or WhatsApp us â€” we may have unlisted properties!</p>
          </div>
        ) : (
          <div className={cn(
            'grid gap-5',
            view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1',
          )}>
            {properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} priority={index < 2} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Property pagination" className="flex flex-wrap justify-center gap-2 mt-8 sm:mt-10">
            <button
              aria-label="Previous page"
              disabled={page <= 1 || isPending}
              onClick={() => goToPage(page - 1)}
              className="p-2 border border-surface-border rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {visiblePages.map(pageNumber => (
              <button
                key={pageNumber}
                aria-label={`Page ${pageNumber}`}
                aria-current={page === pageNumber ? 'page' : undefined}
                disabled={isPending}
                onClick={() => goToPage(pageNumber)}
                className={cn(
                  'w-9 h-9 rounded-lg text-sm font-600 border transition-colors disabled:opacity-60',
                  page === pageNumber
                    ? 'bg-navy-500 text-white border-navy-500'
                    : 'border-surface-border hover:bg-gray-50',
                )}
              >
                {pageNumber}
              </button>
            ))}
            <button
              aria-label="Next page"
              disabled={page >= totalPages || isPending}
              onClick={() => goToPage(page + 1)}
              className="p-2 border border-surface-border rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
