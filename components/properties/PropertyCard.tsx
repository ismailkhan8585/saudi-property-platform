'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize2, Phone, MessageCircle, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPKR, formatRent } from '@/lib/currency';
import { WHATSAPP_URL, WHATSAPP_PROPERTY_MSG, CALL_URL } from '@/lib/constants';
import type { Property } from '@/lib/types';
import { memo } from 'react';

interface PropertyCardProps {
  property: Property;
  className?: string;
  priority?: boolean;
}

const PLACEHOLDER = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800';

function PropertyCard({ property, className, priority = false }: PropertyCardProps) {
  const {
    slug, title, purpose, priceType, price, rentPrice,
    category, society, area, city, bedrooms, bathrooms, size, sizeUnit,
    photos, featured, isCorner, status,
  } = property;

  const mainPhoto = photos?.[0] || PLACEHOLDER;
  const waMsg = WHATSAPP_PROPERTY_MSG(title, property.propertyId);

  function displayPrice() {
    if (priceType === 'ON_REQUEST') return null;
    if (purpose === 'RENT' && rentPrice) return formatRent(Number(rentPrice));
    if (purpose === 'SALE' && price)    return formatPKR(Number(price));
    return null;
  }

  const isSold = status === 'SOLD' || status === 'RENTED';

  return (
    <div className={cn(
      'group bg-white rounded-2xl overflow-hidden border border-surface-border card-hover',
      isSold && 'opacity-70',
      className
    )}>
      {/* Photo */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={mainPhoto}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-auto flex gap-1.5 sm:gap-2 flex-wrap">
          <span className={cn(
            'px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-700 tracking-wide uppercase',
            purpose === 'SALE'
              ? 'bg-navy-500 text-white'
              : 'bg-green-600 text-white'
          )}>
            {purpose === 'SALE' ? 'For Sale' : 'For Rent'}
          </span>
          {isCorner && (
            <span className="bg-amber-500 text-white px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-700 uppercase">
              Corner
            </span>
          )}
          {isSold && (
            <span className="bg-error text-white px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-700 uppercase">
              {status}
            </span>
          )}
        </div>

        {featured && (
          <div className="absolute bottom-2 sm:bottom-auto sm:top-3 left-2 sm:left-auto sm:right-3">
            <span className="bg-gold-500 text-white px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-700 uppercase">
              Featured
            </span>
          </div>
        )}

        {photos.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            <Camera className="w-3 h-3" />
            {photos.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Price */}
        <div className="mb-2">
          {priceType === 'ON_REQUEST' ? (
            <span className="inline-flex items-center bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-xs font-medium">
              Price on Request
            </span>
          ) : (
            <span className="font-price font-medium text-navy-600 text-lg">
              {displayPrice()}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading font-700 text-navy-700 text-base leading-snug mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors">
          <Link href={`/properties/${slug}`}>{title}</Link>
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
          <span className="truncate">
            {[society, area, city].filter(Boolean).join(', ')}
          </span>
        </div>

        {/* Specs */}
        {(bedrooms || bathrooms || size) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-gray-600 font-price mb-4 pb-4 border-b border-surface-border">
            {bedrooms && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-navy-400" />
                {bedrooms} Beds
              </span>
            )}
            {bathrooms && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-navy-400" />
                {bathrooms} Baths
              </span>
            )}
            {size && (
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-navy-400" />
                {Number(size)} {sizeUnit ? sizeUnit.charAt(0) + sizeUnit.slice(1).toLowerCase() : 'Marla'}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <a
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(waMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2.5 sm:py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <a
            href={CALL_URL}
            className="flex items-center justify-center gap-1.5 bg-navy-50 hover:bg-navy-100 text-navy-700 px-3 py-2.5 sm:py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
          <Link
            href={`/properties/${slug}`}
            className="col-span-2 sm:col-span-1 sm:ml-auto flex items-center justify-center gap-1 py-2 sm:py-0 text-gold-600 hover:text-gold-700 text-xs font-medium transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(PropertyCard);
