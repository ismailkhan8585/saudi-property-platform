'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SAUDI_CITIES, PROPERTY_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';

interface Props { property?: Property; }

export default function PropertyForm({ property }: Props) {
  const router = useRouter();
  const isEdit = !!property;

  const [form, setForm] = useState({
    title:        property?.title        ?? '',
    titleUr:      property?.titleUr      ?? '',
    description:  property?.description  ?? '',
    purpose:      property?.purpose      ?? 'SALE',
    category:     property?.category     ?? 'HOUSE',
    status:       property?.status       ?? 'AVAILABLE',
    priceType:    property?.priceType    ?? 'FIXED',
    price:        property?.price?.toString()     ?? '',
    rentPrice:    property?.rentPrice?.toString() ?? '',
    size:         property?.size?.toString()      ?? '',
    sizeUnit:     property?.sizeUnit     ?? 'SQM',
    bedrooms:     property?.bedrooms?.toString()  ?? '',
    bathrooms:    property?.bathrooms?.toString() ?? '',
    floors:       property?.floors?.toString()    ?? '',
    facing:       property?.facing       ?? '',
    society:      property?.society      ?? '',
    area:         property?.area         ?? '',
    address:      property?.address      ?? '',
    possession:   property?.possession   ?? 'AVAILABLE',
    hasGas:       property?.hasGas       ?? false,
    hasElectricity: property?.hasElectricity ?? false,
    hasWater:     property?.hasWater     ?? false,
    hasGarage:    property?.hasGarage    ?? false,
    hasGarden:    property?.hasGarden    ?? false,
    hasServantQtr: property?.hasServantQtr ?? false,
    isCorner:     property?.isCorner     ?? false,
    isParkFacing: property?.isParkFacing ?? false,
    isGated:      property?.isGated      ?? false,
    hasSecurity:  property?.hasSecurity  ?? false,
    featured:     property?.featured     ?? false,
    isActive:     property?.isActive     ?? true,
    photos:       property?.photos       ?? [] as string[],
  });

  const [loading, setLoading] = useState(false);

  function set(key: string, value: string | boolean | string[]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function toggle(key: string) {
    setForm(f => ({ ...f, [key]: !(f as any)[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.size || !form.purpose || !form.category) {
      toast.error('Title, size, purpose, and category are required');
      return;
    }
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/properties/${property!.id}` : '/api/admin/properties';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({ error: 'Unexpected server response' }));
      if (!res.ok) { toast.error(data.error ?? 'Failed'); return; }
      toast.success(isEdit ? 'Property updated!' : 'Property created!');
      router.replace('/admin/properties');
      router.refresh();
    } catch {
      toast.error('Unable to save the property. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500';
  const labelCls = 'text-sm font-600 text-gray-700 block mb-1.5';

  const checkboxes = [
    { key: 'hasGas',        label: 'Gas' },
    { key: 'hasElectricity', label: 'Electricity' },
    { key: 'hasWater',      label: 'Water Supply' },
    { key: 'hasGarage',     label: 'Garage' },
    { key: 'hasGarden',     label: 'Garden' },
    { key: 'hasServantQtr', label: 'Servant Quarter' },
    { key: 'isCorner',      label: 'Corner Plot' },
    { key: 'isParkFacing',  label: 'Park Facing' },
    { key: 'isGated',       label: 'Gated Community' },
    { key: 'hasSecurity',   label: '24/7 Security' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Basic Info */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-surface-border space-y-4">
        <h2 className="font-heading font-700 text-navy-700 text-base">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Title (English) *</label>
            <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Family villa in Al Malqa" required />
          </div>
          <div>
            <label className={labelCls}>Title (Arabic)</label>
            <input className={cn(inputCls, 'font-urdu text-right')} value={form.titleUr} onChange={e => set('titleUr', e.target.value)} placeholder="فيلا عائلية في حي الملقا" dir="rtl" />
          </div>
          <div>
            <label className={labelCls}>Purpose *</label>
            <select className={inputCls} value={form.purpose} onChange={e => set('purpose', e.target.value)}>
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Category *</label>
            <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
              {PROPERTY_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
              <option value="RESERVED">Reserved</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea className={cn(inputCls, 'resize-none')} rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detailed property description..." />
        </div>
      </div>

      {/* Section 2: Location */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-surface-border space-y-4">
        <h2 className="font-heading font-700 text-navy-700 text-base">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Society / Area</label>
            <select className={inputCls} value={form.society} onChange={e => set('society', e.target.value)}>
              <option value="">Select Society</option>
              {SAUDI_CITIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Block / Phase / Sector</label>
            <input className={inputCls} value={form.area} onChange={e => set('area', e.target.value)} placeholder="Phase 5, Block A..." />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Full Address</label>
            <input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street / Plot number, sector..." />
          </div>
        </div>
      </div>

      {/* Section 3: Details */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-surface-border space-y-4">
        <h2 className="font-heading font-700 text-navy-700 text-base">Property Details</h2>
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Size *</label>
            <input className={inputCls} type="number" value={form.size} onChange={e => set('size', e.target.value)} placeholder="5" required />
          </div>
          <div>
            <label className={labelCls}>Unit</label>
            <select className={inputCls} value={form.sizeUnit} onChange={e => set('sizeUnit', e.target.value)}>
              <option value="SQM">Square metres</option>
              <option value="SQFT">Sq. Ft</option>
              <option value="SQYD">Sq. Yd</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Bedrooms</label>
            <input className={inputCls} type="number" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} placeholder="3" />
          </div>
          <div>
            <label className={labelCls}>Bathrooms</label>
            <input className={inputCls} type="number" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} placeholder="2" />
          </div>
          <div>
            <label className={labelCls}>Floors</label>
            <input className={inputCls} type="number" value={form.floors} onChange={e => set('floors', e.target.value)} placeholder="2" />
          </div>
          <div>
            <label className={labelCls}>Facing</label>
            <select className={inputCls} value={form.facing} onChange={e => set('facing', e.target.value)}>
              <option value="">Select</option>
              <option>East</option><option>West</option>
              <option>North</option><option>South</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Possession</label>
            <select className={inputCls} value={form.possession} onChange={e => set('possession', e.target.value)}>
              <option value="AVAILABLE">Available Now</option>
              <option value="ON_BOOKING">On Booking</option>
              <option value="UNDER_CONSTRUCTION">Under Construction</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 4: Price */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-surface-border space-y-4">
        <h2 className="font-heading font-700 text-navy-700 text-base">Pricing</h2>
        <div className="flex gap-3 mb-4">
          {(['FIXED', 'ON_REQUEST'] as const).map(pt => (
            <button key={pt} type="button" onClick={() => set('priceType', pt)}
              className={cn('px-4 py-2 rounded-xl text-sm font-700 border transition-colors',
                form.priceType === pt ? 'bg-navy-500 text-white border-navy-500' : 'border-surface-border text-gray-600 hover:border-navy-300'
              )}>
              {pt === 'FIXED' ? 'Fixed Price' : 'Price on Request'}
            </button>
          ))}
        </div>
        {form.priceType === 'FIXED' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.purpose === 'SALE' && (
              <div>
                <label className={labelCls}>Sale Price (SAR)</label>
                <input className={inputCls} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="18500000" />
              </div>
            )}
            {form.purpose === 'RENT' && (
              <div>
                <label className={labelCls}>Monthly Rent (SAR)</label>
                <input className={inputCls} type="number" value={form.rentPrice} onChange={e => set('rentPrice', e.target.value)} placeholder="45000" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 5: Amenities */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-surface-border">
        <h2 className="font-heading font-700 text-navy-700 text-base mb-4">Features & Amenities</h2>
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {checkboxes.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={(form as any)[key]} onChange={() => toggle(key)} className="w-4 h-4 rounded accent-navy-500" />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Section 6: Photos */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-surface-border space-y-3">
        <h2 className="font-heading font-700 text-navy-700 text-base">Photo URLs</h2>
        <p className="text-gray-400 text-xs">Enter photo URLs (one per line) — Cloudinary or Pexels URLs</p>
        <textarea
          className={cn(inputCls, 'resize-none font-mono text-xs')} rows={5}
          value={form.photos.join('\n')}
          onChange={e => set('photos', e.target.value.split('\n').filter(Boolean))}
          placeholder="https://res.cloudinary.com/your-cloud/image/upload/...&#10;https://images.pexels.com/..."
        />
      </div>

      {/* Section 7: Settings */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-surface-border">
        <h2 className="font-heading font-700 text-navy-700 text-base mb-4">Settings</h2>
        <div className="flex flex-col min-[360px]:flex-row gap-3 sm:gap-6">
          {[
            { key: 'featured', label: 'Featured' },
            { key: 'isActive', label: 'Active / Visible' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={(form as any)[key]} onChange={() => toggle(key)} className="w-4 h-4 rounded accent-navy-500" />
              <span className="text-sm font-600 text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:flex gap-3">
        <button
          type="submit" disabled={loading}
          className="w-full md:w-48 bg-navy-500 hover:bg-navy-600 disabled:opacity-50 text-white py-3 rounded-xl font-700 transition-colors"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 border border-surface-border text-gray-600 rounded-xl font-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
