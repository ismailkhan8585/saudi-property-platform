export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ContactAgentForm from '@/components/properties/ContactAgentForm';
import { getServiceClient } from '@/lib/supabase';
import { formatPKR, formatRent } from '@/lib/currency';
import { WHATSAPP_URL, CALL_URL, AGENT_PHONE, WHATSAPP_PROPERTY_MSG } from '@/lib/constants';
import type { Property } from '@/lib/types';
import {
  MapPin, Bed, Bath, Maximize2, Calendar, Phone, MessageCircle,
  CheckCircle, XCircle, Home, ChevronRight
} from 'lucide-react';
import { mapProperty } from '@/lib/mappers';
import type { Metadata } from 'next';

interface Params { params: { slug: string } }

async function getProperty(slug: string): Promise<Property | null> {
  const { data } = await getServiceClient()
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  return data ? mapProperty(data as Record<string, unknown>) : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getProperty(params.slug);
  if (!p) return { title: 'Property Not Found' };
  const price = p.priceType === 'ON_REQUEST' ? 'Price on Request'
    : p.purpose === 'RENT' ? formatRent(Number(p.rentPrice))
    : formatPKR(Number(p.price));
  return {
    title: `${p.size} ${p.sizeUnit} ${p.category} for ${p.purpose === 'SALE' ? 'Sale' : 'Rent'} in ${p.society || p.city}`,
    description: `${p.title} — ${price} in ${p.society}, ${p.city}. ${p.description?.slice(0, 120)}`,
    openGraph: { images: p.photos[0] ? [{ url: p.photos[0] }] : [] },
  };
}

const AMENITIES = [
  { key: 'hasGas',        label: 'Gas' },
  { key: 'hasElectricity', label: 'Electricity' },
  { key: 'hasWater',      label: 'Water Supply' },
  { key: 'hasGarage',     label: 'Garage / Parking' },
  { key: 'hasGarden',     label: 'Garden / Lawn' },
  { key: 'hasServantQtr', label: 'Servant Quarter' },
  { key: 'isCorner',      label: 'Corner Plot' },
  { key: 'isParkFacing',  label: 'Park Facing' },
  { key: 'isGated',       label: 'Gated Community' },
  { key: 'hasSecurity',   label: '24/7 Security' },
] as const;

export default async function PropertyDetailPage({ params }: Params) {
  const property = await getProperty(params.slug);
  if (!property) notFound();

  const {
    title, purpose, priceType, price, rentPrice, category,
    society, area, city, bedrooms, bathrooms, size, sizeUnit,
    floors, facing, possession, photos, description, propertyId,
    createdAt, status,
  } = property;

  const waMsg = WHATSAPP_PROPERTY_MSG(title, propertyId);
  const mainPhoto = photos?.[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200';

  function displayPrice() {
    if (priceType === 'ON_REQUEST') return null;
    if (purpose === 'RENT' && rentPrice) return formatRent(Number(rentPrice));
    if (purpose === 'SALE' && price)    return formatPKR(Number(price));
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-secondary">
        {/* Breadcrumb */}
        <div className="bg-navy-700 pt-20 pb-6">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-white/60 text-sm">
              <Link href="/" className="hover:text-white flex items-center gap-1"><Home className="w-3.5 h-3.5" /></Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/properties" className="hover:text-white">Properties</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gold-300 truncate max-w-xs">{title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Photo Gallery */}
              <div className="bg-white rounded-2xl overflow-hidden border border-surface-border">
                <div className="relative aspect-video">
                  <Image
                    src={mainPhoto}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 70vw"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-700 uppercase ${purpose === 'SALE' ? 'bg-navy-500 text-white' : 'bg-green-600 text-white'}`}>
                      For {purpose === 'SALE' ? 'Sale' : 'Rent'}
                    </span>
                    {property.featured && (
                      <span className="bg-gold-500 text-white px-3 py-1.5 rounded-lg text-sm font-700 uppercase">Featured</span>
                    )}
                    {status !== 'AVAILABLE' && (
                      <span className="bg-error text-white px-3 py-1.5 rounded-lg text-sm font-700 uppercase">{status}</span>
                    )}
                  </div>
                </div>

                {photos.length > 1 && (
                  <div className="p-3 flex gap-2 overflow-x-auto scrollbar-hide">
                    {photos.slice(1).map((photo, i) => (
                      <div key={i} className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden border-2 border-surface-border">
                        <Image src={photo} alt={`Photo ${i + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Header */}
              <div className="bg-white rounded-2xl p-6 border border-surface-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="font-heading font-800 text-navy-800 text-2xl md:text-3xl mb-3 leading-tight">{title}</h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                      <span>{[society, area, city].filter(Boolean).join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="font-price">ID: #{propertyId}</span>
                      <span>Added: {new Date(createdAt).toLocaleDateString('en-PK')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {priceType === 'ON_REQUEST' ? (
                      <span className="inline-block bg-gold-100 text-gold-700 px-4 py-2 rounded-xl text-sm font-700">
                        Price on Request
                      </span>
                    ) : (
                      <div className="font-price font-700 text-navy-700 text-2xl md:text-3xl">{displayPrice()}</div>
                    )}
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-surface-border">
                  {bedrooms && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-gold-500" />
                      <div>
                        <div className="text-xs text-gray-400">Bedrooms</div>
                        <div className="font-price font-700 text-navy-700">{bedrooms}</div>
                      </div>
                    </div>
                  )}
                  {bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-gold-500" />
                      <div>
                        <div className="text-xs text-gray-400">Bathrooms</div>
                        <div className="font-price font-700 text-navy-700">{bathrooms}</div>
                      </div>
                    </div>
                  )}
                  {size && (
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-5 h-5 text-gold-500" />
                      <div>
                        <div className="text-xs text-gray-400">Size</div>
                        <div className="font-price font-700 text-navy-700">{Number(size)} {sizeUnit ? sizeUnit.charAt(0) + sizeUnit.slice(1).toLowerCase() : 'Marla'}</div>
                      </div>
                    </div>
                  )}
                  {floors && (
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-gold-500" />
                      <div>
                        <div className="text-xs text-gray-400">Floors</div>
                        <div className="font-price font-700 text-navy-700">{floors}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional specs */}
                {(facing || possession) && (
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-surface-border text-sm">
                    {facing && <span className="text-gray-500">Facing: <strong className="text-navy-700">{facing}</strong></span>}
                    {possession && <span className="text-gray-500">Possession: <strong className="text-navy-700">{possession.replace('_', ' ')}</strong></span>}
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl p-6 border border-surface-border">
                <h2 className="font-heading font-700 text-navy-700 text-lg mb-5">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AMENITIES.map(({ key, label }) => {
                    const has = property[key as keyof Property] as boolean;
                    return (
                      <div key={key} className={`flex items-center gap-2 text-sm ${has ? 'text-gray-700' : 'text-gray-300'}`}>
                        {has
                          ? <CheckCircle className="w-4 h-4 text-success shrink-0" />
                          : <XCircle className="w-4 h-4 text-gray-300 shrink-0" />
                        }
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              {description && (
                <div className="bg-white rounded-2xl p-6 border border-surface-border">
                  <h2 className="font-heading font-700 text-navy-700 text-lg mb-4">Property Description</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{description}</p>
                </div>
              )}
            </div>

            {/* Sticky Sidebar */}
            <aside className="lg:w-80 xl:w-96 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Quick Contact */}
                <div className="bg-white rounded-2xl p-5 border border-surface-border">
                  <h3 className="font-heading font-700 text-navy-700 text-base mb-4">Interested in this property?</h3>
                  <div className="flex gap-2 mb-4">
                    <a
                      href={`${WHATSAPP_URL}?text=${encodeURIComponent(waMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                    <a
                      href={CALL_URL}
                      className="flex-1 flex items-center justify-center gap-2 bg-navy-500 hover:bg-navy-600 text-white py-3 rounded-xl text-sm font-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {AGENT_PHONE}
                    </a>
                  </div>
                </div>

                {/* Contact Form */}
                <ContactAgentForm propertyId={property.id} propertyTitle={title} propertyRef={propertyId} />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
