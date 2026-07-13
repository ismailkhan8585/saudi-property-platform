export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import PropertyFilters from '@/components/properties/PropertyFilters';
import PropertyGrid from '@/components/properties/PropertyGrid';
import type { Metadata } from 'next';
import { AGENT_NAME_EN } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Properties for Sale in Lahore | ${AGENT_NAME_EN}`,
};

export default function ForSalePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-secondary">
        <div className="bg-navy-700 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="font-heading font-800 text-white text-3xl md:text-4xl">Properties for Sale in Lahore</h1>
            <p className="text-white/60 mt-2">Verified sale listings across all major Lahore societies</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            <Suspense><PropertyFilters initialPurpose="SALE" /></Suspense>
            <Suspense fallback={<div className="flex-1 animate-pulse bg-gray-200 rounded-2xl h-96" />}>
              <PropertyGrid initialPurpose="SALE" />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
