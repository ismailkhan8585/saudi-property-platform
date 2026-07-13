export const revalidate = 300;
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import PropertyFilters from '@/components/properties/PropertyFilters';
import PropertyResults from '@/components/properties/PropertyResults';
import type { PageSearchParams } from '@/lib/property-query';
import { AGENT_NAME_EN } from '@/lib/constants';

export const metadata = { title: `Apartments in Lahore | ${AGENT_NAME_EN}` };

export default async function ApartmentsPage({ searchParams }: { searchParams: Promise<PageSearchParams> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-secondary">
        <div className="bg-navy-700 pt-20 sm:pt-24 pb-8 sm:pb-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="font-heading font-800 text-white text-2xl sm:text-3xl md:text-4xl">Apartments in Lahore</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-5 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
            <Suspense><PropertyFilters initialCategory="APARTMENT" /></Suspense>
            <Suspense fallback={<div className="flex-1 animate-pulse bg-gray-200 rounded-2xl h-96" />}>
              <PropertyResults searchParams={resolvedSearchParams} initialCategory="APARTMENT" />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
