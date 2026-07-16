'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bath, Bed, CalendarDays, Check, Heart, MapPin, Maximize2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Property } from '@/lib/types';
import { formatCurrency, formatDate, formatNumber } from '@/lib/i18n';
import { useLocale } from '@/components/providers/LocaleProvider';
import ContactAgentForm from './ContactAgentForm';
import PropertyContactActions from './PropertyContactActions';

const fallback = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function PropertyDetail({ property }: { property: Property }) {
  const { locale, dict } = useLocale();
  const title = locale === 'ar' ? property.titleAr || property.title : property.title;
  const description = locale === 'ar' ? property.descriptionAr || property.description : property.description;
  const amount = property.purpose === 'SALE' ? property.price : property.rentPrice;

  async function share() {
    if (navigator.share) await navigator.share({ title, url: location.href });
    else {
      await navigator.clipboard.writeText(location.href);
      toast.success(locale === 'ar' ? 'تم نسخ الرابط' : 'Link copied');
    }
  }

  return (
    <div className="pb-[calc(var(--mobile-contact-height)+1rem)] lg:pb-0">
      <div className="bg-navy-800 py-4 text-sm text-white/60 sm:py-5">
        <div className="mx-auto max-w-7xl truncate px-4 sm:px-6"><Link href="/search" className="hover:text-white">{dict.nav.properties}</Link> / <span className="text-gold-300">{property.propertyId}</span></div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-7">
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <section className="overflow-hidden rounded-2xl border bg-white">
              <div className="relative aspect-[4/3] sm:aspect-[16/9]">
                <Image src={property.photos[0] || fallback} alt={title} fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 70vw" />
                <div className="absolute start-3 top-3 flex flex-wrap gap-2 sm:start-4 sm:top-4">
                  {property.isDemo && <span className="rounded-full bg-white px-3 py-1 text-xs font-bold">{dict.property.demo}</span>}
                  {property.featured && <span className="rounded-full bg-gold-500 px-3 py-1 text-xs font-bold">{dict.property.featured}</span>}
                </div>
              </div>
              {property.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3 scrollbar-hide">
                  {property.photos.slice(1, 6).map((photo, index) => <div key={photo} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28"><Image src={photo} alt={`${title} ${index + 2}`} fill className="object-cover" sizes="7rem" /></div>)}
                </div>
              )}
            </section>

            <section className="rounded-2xl border bg-white p-4 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:gap-5">
                <div className="min-w-0"><h1 className="break-words text-xl font-extrabold leading-tight text-navy-800 sm:text-3xl">{title}</h1><p className="mt-3 flex items-start gap-2 break-words text-sm text-gray-500 sm:text-base"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />{locale === 'ar' ? property.addressAr || property.area : property.address}</p></div>
                <p className="shrink-0 text-xl font-extrabold text-navy-700 sm:text-2xl">{amount ? formatCurrency(amount, locale) : dict.property.priceOnRequest}</p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t pt-5 sm:mt-6 sm:grid-cols-4 sm:pt-6">
                {property.bedrooms != null && <Stat icon={Bed} label={dict.property.beds} value={formatNumber(property.bedrooms, locale)} />}
                {property.bathrooms != null && <Stat icon={Bath} label={dict.property.baths} value={formatNumber(property.bathrooms, locale)} />}
                <Stat icon={Maximize2} label={dict.property.area} value={`${formatNumber(property.size, locale)} ${dict.property.sqm}`} />
                <Stat icon={CalendarDays} label={dict.property.published} value={formatDate(property.createdAt, locale)} />
              </div>
            </section>

            {description && <section className="rounded-2xl border bg-white p-4 sm:p-6"><h2 className="text-lg font-bold sm:text-xl">{dict.property.description}</h2><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">{description}</p></section>}
            <section className="rounded-2xl border bg-white p-4 sm:p-6"><h2 className="text-lg font-bold sm:text-xl">{dict.property.amenities}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">{property.amenities.map((amenity) => <span key={amenity} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-600" />{dict.amenity[amenity as keyof typeof dict.amenity] || amenity}</span>)}</div></section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border bg-white p-5"><p className="text-xs text-gray-500">{dict.property.reference}</p><p className="mt-1 break-all font-mono font-bold">{property.propertyId}</p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={share} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border px-2 text-sm"><Share2 className="h-4 w-4" />{dict.property.share}</button><button onClick={() => toast.success(locale === 'ar' ? 'تم الحفظ محلياً' : 'Saved locally')} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border px-2 text-sm"><Heart className="h-4 w-4" />{dict.property.favorite}</button></div></div>
            <PropertyContactActions title={title} reference={property.propertyId} />
            <ContactAgentForm propertyId={property.id} propertyTitle={title} propertyRef={property.propertyId} />
          </aside>
        </div>

      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Bed; label: string; value: string }) {
  return <div className="flex min-w-0 gap-2"><Icon className="h-5 w-5 shrink-0 text-gold-600" /><div className="min-w-0"><p className="text-xs text-gray-400">{label}</p><p className="mt-1 break-words text-sm font-bold">{value}</p></div></div>;
}
