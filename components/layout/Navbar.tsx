'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, Phone } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useContact } from '@/components/providers/ContactProvider';
import LanguageSwitcher from './LanguageSwitcher';
import { isNavigationItemActive, PUBLIC_NAVIGATION } from './navigation';

const MobileNavigation = dynamic(() => import('./MobileNavigation'), { ssr: false });

export default function Navbar() {
  const { locale, dict } = useLocale();
  const contact = useContact();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-900 pt-[env(safe-area-inset-top)] text-white shadow-[0_8px_30px_rgba(7,16,28,.18)]">
      <div className="hidden border-b border-white/10 bg-navy-800 sm:block">
        <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-between gap-3 px-6 text-xs text-white/70">
          <span>{locale === 'ar' ? 'منصة عقارية سعودية ثنائية اللغة' : 'Bilingual Saudi property platform'}</span>
          {contact.businessPhone ? (
            <a href={`tel:${contact.businessPhone}`} className="inline-flex min-h-9 items-center gap-1.5 font-semibold text-white hover:text-gold-300" dir="ltr">
              <Phone className="h-3.5 w-3.5" />{contact.phoneDisplay}
            </a>
          ) : <Link href="/contact" className="inline-flex min-h-9 items-center text-gold-300">{dict.nav.contact}</Link>}
        </div>
      </div>

      <nav className="mx-auto flex h-[var(--mobile-header-height)] max-w-7xl items-center justify-between gap-2 px-[var(--page-gutter)] sm:h-20" aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
        <Link href="/" className="flex min-h-11 min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500 text-navy-900 sm:h-11 sm:w-11"><Building2 className="h-5 w-5 sm:h-6 sm:w-6" /></span>
          <span className="min-w-0"><strong className="block max-w-[8.5rem] truncate text-base sm:max-w-xs sm:text-lg">{dict.brand}</strong><small className="hidden text-gold-300 xl:block">{dict.tagline}</small></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {PUBLIC_NAVIGATION.map(({ href, label }) => {
            const active = isNavigationItemActive(pathname, href);
            return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-semibold transition ${active ? 'bg-white/10 text-gold-300' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}>{dict.nav[label]}</Link>;
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <button id="mobile-menu-toggle" type="button" onClick={() => setMenuOpen(true)} className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/[.07] shadow-sm transition hover:border-gold-300/60 hover:bg-white/10 active:scale-95 focus-visible:ring-2 focus-visible:ring-gold-400 lg:hidden" aria-label={locale === 'ar' ? 'فتح القائمة' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation-drawer">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <MobileNavigation open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      </nav>
    </header>
  );
}
