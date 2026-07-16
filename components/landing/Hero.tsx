'use client';

import Image from 'next/image';
import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpLeft, Search, ShieldCheck } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';

const heroImage = 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600';

export default function Hero() {
  const { locale, dict } = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [purpose, setPurpose] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (purpose) params.set('purpose', purpose);
    startTransition(() => router.push(`/search${params.size ? `?${params}` : ''}`));
  }

  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <Image src={heroImage} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/45 rtl:bg-gradient-to-l" />
      <div className="mx-auto grid min-h-[470px] max-w-7xl items-center px-[var(--page-gutter)] py-9 sm:min-h-[600px] sm:py-16 lg:min-h-[650px] lg:grid-cols-[1.1fr_.9fr] lg:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-300/30 bg-gold-400/10 px-3 py-2 text-xs font-bold text-gold-200 sm:mb-5 sm:px-4 sm:text-sm">
            <ShieldCheck className="h-4 w-4" />{dict.hero.eyebrow}
          </p>
          <h1 className="text-balance text-[clamp(1.85rem,9vw,3rem)] font-extrabold leading-[1.16] sm:text-5xl lg:text-7xl">{dict.hero.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:mt-6 sm:text-lg sm:leading-8">{dict.hero.subtitle}</p>
          <form onSubmit={submit} className="mt-6 max-w-3xl rounded-2xl border border-white/15 bg-white/95 p-2.5 text-navy-900 shadow-2xl backdrop-blur sm:mt-9 sm:rounded-3xl sm:p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto p-1 scrollbar-hide sm:mb-3">
              {[["", locale === 'ar' ? 'الكل' : 'All'], ['SALE', dict.property.sale], ['RENT', dict.property.rent]].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setPurpose(value)} aria-pressed={purpose === value} className={`min-h-10 whitespace-nowrap rounded-full px-4 text-sm font-bold transition ${purpose === value ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{label}</button>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">{dict.hero.search}</span>
                <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-12 w-full rounded-xl bg-gray-50 ps-12 pe-4 text-start text-base outline-none ring-gold-500 focus:ring-2 sm:h-14 sm:rounded-2xl" placeholder={dict.hero.search} />
              </label>
              <button disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 font-extrabold text-navy-900 transition hover:bg-gold-400 disabled:opacity-70 sm:h-14 sm:rounded-2xl sm:px-7">
                {pending ? dict.common.loading : dict.hero.button}<ArrowUpLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-90" />
              </button>
            </div>
          </form>
          <p className="mt-3 text-xs text-white/60 sm:mt-4">{dict.hero.demo}</p>
        </div>
      </div>
    </section>
  );
}
