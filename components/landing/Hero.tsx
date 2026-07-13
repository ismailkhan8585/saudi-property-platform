'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import { LAHORE_SOCIETIES, PROPERTY_CATEGORIES, STATS, AGENT_NAME_EN } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function Hero() {
  const router = useRouter();
  const [purpose, setPurpose]     = useState<'SALE' | 'RENT'>('SALE');
  const [category, setCategory]   = useState('');
  const [society, setSociety]     = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (purpose)  params.set('purpose', purpose);
    if (category) params.set('category', category);
    if (society)  params.set('society', society);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=1920')" }}
        />
        <div className="absolute inset-0 bg-navy-900/75" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgb(201 168 76) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-24 pb-16">
        {/* Floating badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 text-gold-300 text-sm px-4 py-2 rounded-full backdrop-blur-sm">
            🏙️ Lahore's Trusted Property Dealer
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-4">
          <h1 className="font-heading font-800 text-white text-4xl md:text-6xl lg:text-7xl leading-tight mb-4">
            Find Your Perfect
            <span className="text-gold-400 block">Property in Lahore</span>
          </h1>
          <p className="font-urdu text-gold-200 text-xl md:text-2xl mb-4 text-right sm:text-center">
            لاہور میں اپنا بہترین گھر تلاش کریں
          </p>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
            Houses, Plots, Apartments & Commercial Properties for Sale and Rent across all major Lahore societies
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-2">
          {/* Purpose Toggle */}
          <div className="flex gap-1 p-1 bg-surface-secondary rounded-xl mb-2">
            {(['SALE', 'RENT'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPurpose(p)}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-600 transition-all',
                  purpose === p
                    ? 'bg-navy-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {p === 'SALE' ? 'For Sale' : 'For Rent'}
              </button>
            ))}
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <div className="relative">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full appearance-none bg-surface-secondary border border-surface-border rounded-xl px-4 py-3 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-navy-500 pr-8"
              >
                <option value="">All Property Types</option>
                {PROPERTY_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={society}
                onChange={e => setSociety(e.target.value)}
                className="w-full appearance-none bg-surface-secondary border border-surface-border rounded-xl px-4 py-3 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-navy-500 pr-8"
              >
                <option value="">All Areas / Societies</option>
                {LAHORE_SOCIETIES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white py-3 px-6 rounded-xl text-sm font-700 transition-colors shadow-lg"
            >
              <Search className="w-4 h-4" />
              Search Properties
            </button>
          </div>
        </form>

        {/* Trust Stats */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: `${STATS.propertiesListed}+`, label: 'Properties Listed' },
            { value: `${STATS.dealsClosed}+`,      label: 'Deals Closed' },
            { value: `${STATS.happyClients}+`,     label: 'Happy Clients' },
            { value: `${STATS.yearsExperience}+`,  label: 'Years Experience' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-4 px-3">
              <div className="font-price font-700 text-gold-300 text-2xl md:text-3xl">{value}</div>
              <div className="text-white/70 text-xs md:text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
