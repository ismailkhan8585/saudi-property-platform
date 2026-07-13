export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import Hero from '@/components/landing/Hero';
import FeaturedProperties from '@/components/landing/FeaturedProperties';
import ForSaleSection from '@/components/landing/ForSaleSection';
import ForRentSection from '@/components/landing/ForRentSection';
import BrowseByCategory from '@/components/landing/BrowseByCategory';
import BrowseBySociety from '@/components/landing/BrowseBySociety';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import AboutAgent from '@/components/landing/AboutAgent';
import Testimonials from '@/components/landing/Testimonials';
import CtaBanner from '@/components/landing/CtaBanner';

function SectionSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`section-padding ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <Suspense fallback={<SectionSkeleton className="bg-surface-secondary" />}>
          <FeaturedProperties />
        </Suspense>

        <Suspense fallback={<SectionSkeleton className="bg-white" />}>
          <ForSaleSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton className="bg-surface-secondary" />}>
          <ForRentSection />
        </Suspense>

        <Suspense fallback={<div className="section-padding bg-white animate-pulse" />}>
          <BrowseByCategory />
        </Suspense>

        <Suspense fallback={<div className="section-padding bg-navy-700 animate-pulse" />}>
          <BrowseBySociety />
        </Suspense>

        <WhyChooseUs />

        <Suspense fallback={<SectionSkeleton className="bg-surface-secondary" />}>
          <AboutAgent />
        </Suspense>

        <Suspense fallback={<div className="section-padding animate-pulse" />}>
          <Testimonials />
        </Suspense>

        <CtaBanner />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
