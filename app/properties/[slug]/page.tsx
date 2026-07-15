import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyDetail from '@/components/properties/PropertyDetail';
import RelatedPropertySection from '@/components/properties/RelatedPropertySection';
import { getPublicPropertyBySlug } from '@/lib/data/public';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'تفاصيل العقار | Property details',
  description: 'تفاصيل وصور ومزايا العقار | Property details, photos, and features.',
};
type Props = { params: Promise<{ slug: string }> };

export default async function PropertyPage({ params }: Props) {
  const property = await getPublicPropertyBySlug((await params).slug);
  if (!property) notFound();
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PropertyDetail property={property} />
        <Suspense fallback={<RelatedSkeleton />}><RelatedPropertySection property={property} /></Suspense>
      </main>
      <Footer />
    </>
  );
}

function RelatedSkeleton() {
  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14"><div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200 motion-reduce:animate-none" /><div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-200 motion-reduce:animate-none" />)}</div></section>;
}
