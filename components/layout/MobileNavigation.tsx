'use client';

import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useContact } from '@/components/providers/ContactProvider';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function MobileNavigation({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { locale, dict } = useLocale();
  const contact = useContact();
  const links = [
    ['/', dict.nav.home], ['/search', dict.nav.properties], ['/search?purpose=SALE', dict.nav.sale],
    ['/search?purpose=RENT', dict.nav.rent], ['/about', dict.nav.about], ['/contact', dict.nav.contact],
  ];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={locale === 'ar' ? 'left' : 'right'} className="w-[min(88vw,22rem)] border-white/10 bg-navy-900 p-0 text-white">
        <SheetHeader className="border-b border-white/10 p-6 pe-14 text-start">
          <SheetTitle className="text-white">{dict.brand}</SheetTitle>
          <SheetDescription className="text-white/55">{dict.tagline}</SheetDescription>
        </SheetHeader>
        <nav className="p-3" aria-label={locale === 'ar' ? 'قائمة الجوال' : 'Mobile menu'}>
          {links.map(([href, label]) => <SheetClose asChild key={href}><Link href={href} className="flex min-h-12 items-center rounded-xl px-4 font-semibold text-white/85 hover:bg-white/10 hover:text-white">{label}</Link></SheetClose>)}
        </nav>
        <div className="absolute inset-x-0 bottom-0 grid gap-2 border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {contact.whatsappNumber && <a href={`https://wa.me/${contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 font-bold"><MessageCircle className="h-4 w-4" />{dict.common.whatsapp}</a>}
          {contact.businessPhone && <a href={`tel:${contact.businessPhone}`} dir="ltr" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 font-bold"><Phone className="h-4 w-4" />{contact.phoneDisplay}</a>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
