'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Building2, Menu, Phone } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useContact } from '@/components/providers/ContactProvider';
import LanguageSwitcher from './LanguageSwitcher';

const MobileNavigation = dynamic(() => import('./MobileNavigation'), { ssr: false });

export default function Navbar() {
  const { locale, dict } = useLocale();
  const contact = useContact();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['/', dict.nav.home],
    ['/search', dict.nav.properties],
    ['/search?purpose=SALE', dict.nav.sale],
    ['/search?purpose=RENT', dict.nav.rent],
    ['/about', dict.nav.about],
    ['/contact', dict.nav.contact],
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-900 text-white shadow-lg">
      <div className="border-b border-white/10 bg-navy-800">
        <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-end gap-3 px-4 text-xs text-white/70 sm:justify-between sm:px-6">
          <span className="hidden sm:inline">{locale === 'ar' ? 'منصة عقارية سعودية ثنائية اللغة' : 'Bilingual Saudi property platform'}</span>
          {contact.businessPhone ? (
            <a href={`tel:${contact.businessPhone}`} className="inline-flex min-h-9 items-center gap-1.5 font-semibold text-white hover:text-gold-300" dir="ltr">
              <Phone className="h-3.5 w-3.5" />{contact.phoneDisplay}
            </a>
          ) : (
            <Link href="/contact" className="inline-flex min-h-9 items-center text-gold-300">{dict.nav.contact}</Link>
          )}
        </div>
      </div>

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6" aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
        <Link href="/" className="flex min-h-11 min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500 text-navy-900 sm:h-11 sm:w-11"><Building2 className="h-5 w-5 sm:h-6 sm:w-6" /></span>
          <span className="min-w-0"><strong className="block truncate text-base sm:text-lg">{dict.brand}</strong><small className="hidden text-gold-300 xl:block">{dict.tagline}</small></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([href, label]) => <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white">{label}</Link>)}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <button type="button" onClick={() => setMenuOpen(true)} className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 hover:bg-white/10 lg:hidden" aria-label={locale === 'ar' ? 'فتح القائمة' : 'Open menu'} aria-expanded={menuOpen}>
            <Menu className="h-5 w-5" />
          </button>
          {menuOpen && <MobileNavigation open={menuOpen} onOpenChange={setMenuOpen} />}
        </div>
      </nav>
    </header>
  );
}
