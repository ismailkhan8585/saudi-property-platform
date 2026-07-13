export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import PropertyFilters from '@/components/properties/PropertyFilters';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { AGENT_NAME_EN } from '@/lib/constants';

export const metadata = {
  title: `Houses for Sale and Rent in Lahore | ${AGENT_NAME_EN}`,
};

export default function HousesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-secondary">
        <div className="bg-navy-700 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="font-heading font-800 text-white text-3xl md:text-4xl">Houses in Lahore</h1>
            <p className="text-white/60 mt-2">Single storey, double storey, and luxury houses across Lahore</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            <Suspense><PropertyFilters initialCategory="HOUSE" /></Suspense>
            <Suspense fallback={<div className="flex-1 animate-pulse bg-gray-200 rounded-2xl h-96" />}>
              <PropertyGrid initialCategory="HOUSE" />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
