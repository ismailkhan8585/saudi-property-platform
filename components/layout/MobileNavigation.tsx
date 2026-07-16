'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, MessageCircle, Phone } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useContact } from '@/components/providers/ContactProvider';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import LanguageSwitcher from './LanguageSwitcher';
import { isNavigationItemActive, PUBLIC_NAVIGATION } from './navigation';

export default function MobileNavigation({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { locale, dict } = useLocale();
  const contact = useContact();
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent id="mobile-navigation-drawer" side={locale === 'ar' ? 'right' : 'left'} className="flex h-[100dvh] w-[min(90vw,23rem)] flex-col gap-0 border-white/10 bg-navy-900 p-0 text-white [&>button]:text-white [&>button]:hover:bg-white/10">
        <SheetHeader className="shrink-0 border-b border-white/10 px-5 pb-5 pe-16 pt-[calc(1.25rem+env(safe-area-inset-top))] text-start">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-500 text-navy-900"><Building2 className="h-5 w-5" /></span>
            <div className="min-w-0"><SheetTitle className="truncate text-white">{dict.brand}</SheetTitle><SheetDescription className="line-clamp-2 text-white/55">{dict.tagline}</SheetDescription></div>
          </div>
        </SheetHeader>
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3" aria-label={locale === 'ar' ? 'قائمة الجوال' : 'Mobile menu'}>
          {PUBLIC_NAVIGATION.map(({ href, label }) => {
            const active = isNavigationItemActive(pathname, href);
            return <SheetClose asChild key={href}><Link href={href} aria-current={active ? 'page' : undefined} className={`mb-1 flex min-h-12 items-center rounded-xl border px-4 font-semibold transition ${active ? 'border-gold-400/30 bg-gold-400/15 text-gold-200' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}>{dict.nav[label]}</Link></SheetClose>;
          })}
        </nav>
        <div className="shrink-0 grid gap-2 border-t border-white/10 bg-navy-900 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <LanguageSwitcher showLabel />
          {contact.whatsappNumber && <a href={`https://wa.me/${contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 font-bold"><MessageCircle className="h-4 w-4" />{dict.common.whatsapp}</a>}
          {contact.businessPhone && <a href={`tel:${contact.businessPhone}`} dir="ltr" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 font-bold"><Phone className="h-4 w-4" />{contact.phoneDisplay}</a>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
