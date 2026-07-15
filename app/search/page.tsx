import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyFilters from '@/components/properties/PropertyFilters';
import PropertyResults from '@/components/properties/PropertyResults';
import { getLocations } from '@/lib/data/public';
import type { PageSearchParams } from '@/lib/property-query';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'البحث عن عقار | Property Search' };

export default async function SearchPage({ searchParams }: { searchParams: Promise<PageSearchParams> }) {
  const params = await searchParams;
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-navy-800 py-8 text-white sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h1 className="text-2xl font-extrabold sm:text-4xl">البحث عن عقار <span className="mt-1 block text-base font-medium text-gold-300 sm:mt-0 sm:inline sm:text-lg">Property search</span></h1>
            <p className="mt-3 text-sm leading-6 text-white/65">ابحث بالعربية أو الإنجليزية في مناطق ومدن وأحياء المملكة</p>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:gap-7">
            <Suspense fallback={<FilterSkeleton />}><AsyncPropertyFilters /></Suspense>
            <Suspense fallback={<ResultsSkeleton />}><PropertyResults searchParams={params} /></Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

async function AsyncPropertyFilters() {
  const locations = await getLocations();
  return <PropertyFilters locations={locations} />;
}

function FilterSkeleton() {
  return <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-200 motion-reduce:animate-none lg:h-[640px] lg:w-72 lg:shrink-0" aria-label="Loading filters" />;
}

function ResultsSkeleton() {
  return (
    <div className="grid min-w-0 flex-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading results">
      {Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-200 motion-reduce:animate-none" />)}
    </div>
  );
}
