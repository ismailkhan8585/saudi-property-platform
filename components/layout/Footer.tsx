'use client';

import Link from 'next/link';
import { Building2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useContact } from '@/components/providers/ContactProvider';

export default function Footer() {
  const { locale, dict } = useLocale();
  const contact = useContact();
  return (
    <footer className="bg-navy-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-[var(--page-gutter)] py-10 sm:grid-cols-2 sm:py-14 lg:grid-cols-[1.2fr_.8fr_1fr_1fr] lg:gap-10">
        <div>
          <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-500 text-navy-900"><Building2 className="h-5 w-5" /></span><h2 className="min-w-0 truncate text-xl font-extrabold text-gold-300 sm:text-2xl">{dict.brand}</h2></div>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/60">{dict.footer.summary}</p>
        </div>
        <div>
          <h3 className="font-bold">{dict.footer.links}</h3>
          <nav className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-white/65 sm:flex sm:flex-col" aria-label={dict.footer.links}>
            <Link className="flex min-h-11 items-center hover:text-white" href="/search">{dict.nav.properties}</Link><Link className="flex min-h-11 items-center hover:text-white" href="/search?purpose=SALE">{dict.nav.sale}</Link><Link className="flex min-h-11 items-center hover:text-white" href="/search?purpose=RENT">{dict.nav.rent}</Link><Link className="flex min-h-11 items-center hover:text-white" href="/about">{dict.nav.about}</Link>
          </nav>
        </div>
        <div>
          <h3 className="font-bold">{dict.footer.contact}</h3>
          <div className="mt-3 space-y-1 text-sm text-white/65">
            {contact.businessPhone ? <a href={`tel:${contact.businessPhone}`} dir="ltr" className="flex min-h-11 items-center gap-2 hover:text-white"><Phone className="h-4 w-4 shrink-0 text-gold-400" />{contact.phoneDisplay}</a> : <Link href="/contact" className="flex min-h-11 items-center gap-2 hover:text-white"><Phone className="h-4 w-4 shrink-0 text-gold-400" />{dict.nav.contact}</Link>}
            {contact.whatsappNumber && <a href={`https://wa.me/${contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 hover:text-white"><MessageCircle className="h-4 w-4 shrink-0 text-gold-400" />{dict.common.whatsapp}</a>}
            <a href={`mailto:${contact.email}`} className="flex min-h-11 min-w-0 items-center gap-2 hover:text-white"><Mail className="h-4 w-4 shrink-0 text-gold-400" /><span className="truncate">{contact.email}</span></a>
            <p className="flex min-h-11 items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-gold-400" />{locale === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-bold">{locale === 'ar' ? 'ابدأ بحثك' : 'Start your search'}</h3><p className="mt-2 text-sm leading-6 text-white/55">{dict.home.ctaHint}</p><Link href="/search" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-900 hover:bg-gold-400">{dict.hero.button}</Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-[var(--page-gutter)] py-5 text-center text-xs leading-6 text-white/45">{dict.footer.disclaimer} © {new Date().getFullYear()} {dict.footer.rights}</div>
    </footer>
  );
}
