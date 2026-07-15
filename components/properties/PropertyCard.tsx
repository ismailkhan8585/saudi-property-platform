'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bath, Bed, Heart, MapPin, Maximize2 } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/i18n';
import { useLocale } from '@/components/providers/LocaleProvider';

const fallback = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=900';

export default function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  const { locale, dict } = useLocale();
  const [image, setImage] = useState(property.photos[0] || fallback);
  const [favorite, setFavorite] = useState(false);
  const title = locale === 'ar' ? property.titleAr || property.title : property.title;
  const amount = property.purpose === 'SALE' ? property.price : property.rentPrice;
  const purpose = {
    SALE: dict.property.sale,
    RENT: dict.property.rent,
    DAILY_RENT: dict.property.dailyRent,
    COMMERCIAL_LEASE: dict.property.commercialLease,
  }[property.purpose];
  const location = locale === 'ar'
    ? [property.regionNameAr, property.cityNameAr, property.districtNameAr]
    : [property.regionNameEn, property.cityNameEn, property.districtNameEn];
  const type = dict.types[property.category as keyof typeof dict.types] || property.category;

  function toggleFavorite() {
    setFavorite((currentValue) => {
      const next = !currentValue;
      try {
        const current = JSON.parse(localStorage.getItem('favoriteProperties') || '[]') as string[];
        localStorage.setItem('favoriteProperties', JSON.stringify(next ? Array.from(new Set([...current, property.id])) : current.filter((id) => id !== property.id)));
      } catch {}
      return next;
    });
  }

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-[0_18px_45px_rgba(17,34,54,.12)] motion-reduce:transform-none motion-reduce:transition-none sm:rounded-3xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 sm:aspect-[16/10]">
        <Link href={`/properties/${property.slug}`} aria-label={title} className="absolute inset-0">
          <Image
            src={image}
            onError={() => setImage(fallback)}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1279px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex flex-wrap gap-1.5 sm:inset-x-3 sm:top-3 sm:gap-2">
          <span className="rounded-full bg-navy-900/95 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur sm:px-3 sm:text-xs">{purpose}</span>
          {property.featured && <span className="rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-extrabold text-navy-900 sm:px-3 sm:text-xs">{dict.property.featured}</span>}
          {property.isDemo && <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy-800 sm:px-3 sm:text-xs">{dict.property.demo}</span>}
        </div>
        <button type="button" onClick={toggleFavorite} aria-pressed={favorite} aria-label={dict.property.favorite} className={`absolute bottom-2.5 end-2.5 grid h-11 w-11 place-items-center rounded-full shadow-lg transition sm:bottom-3 sm:end-3 ${favorite ? 'bg-rose-600 text-white' : 'bg-white/95 text-navy-800 hover:text-rose-600'}`}>
          <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-3">
          <p className="min-w-0 truncate text-lg font-black text-navy-800 sm:text-xl">{amount ? formatCurrency(amount, locale) : dict.property.priceOnRequest}</p>
          <span className="shrink-0 rounded-lg bg-navy-50 px-2.5 py-1 text-[11px] font-bold text-navy-700">{type}</span>
        </div>
        <h3 className="mt-2.5 line-clamp-2 min-h-12 break-words text-base font-extrabold leading-6 text-navy-900 sm:mt-3">
          <Link href={`/properties/${property.slug}`} className="transition hover:text-gold-700">{title}</Link>
        </h3>
        <p className="mt-2.5 flex min-w-0 items-start gap-1.5 text-sm text-gray-500 sm:mt-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
          <span className="line-clamp-2 break-words">{location.filter(Boolean).join(' · ') || property.city}</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 border-y border-surface-border py-3.5 text-xs text-gray-600 sm:mt-5 sm:gap-x-4 sm:py-4 sm:text-sm">
          {property.bedrooms != null && <span className="flex items-center gap-1.5"><Bed className="h-4 w-4 text-navy-500" />{formatNumber(property.bedrooms, locale)} {dict.property.beds}</span>}
          {property.bathrooms != null && <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-navy-500" />{formatNumber(property.bathrooms, locale)} {dict.property.baths}</span>}
          <span className="flex items-center gap-1.5"><Maximize2 className="h-4 w-4 text-navy-500" />{formatNumber(property.size, locale)} {dict.property.sqm}</span>
        </div>
        <div className="mt-3 flex min-w-0 items-center justify-between gap-2 text-xs sm:mt-4">
          <span className="min-w-0 truncate font-mono text-gray-400">{dict.property.reference}: {property.propertyId}</span>
          <Link className="inline-flex min-h-11 shrink-0 items-center px-1 font-extrabold text-gold-700 hover:underline" href={`/properties/${property.slug}`}>{dict.property.details}</Link>
        </div>
      </div>
    </article>
  );
}
