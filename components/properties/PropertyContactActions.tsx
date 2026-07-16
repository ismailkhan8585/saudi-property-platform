'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useContact } from '@/components/providers/ContactProvider';

export default function PropertyContactActions({ title, reference }: { title: string; reference: string }) {
  const { locale, dict } = useLocale();
  const contact = useContact();
  const [pageUrl, setPageUrl] = useState('');
  useEffect(() => setPageUrl(window.location.href), []);
  const message = locale === 'ar'
    ? `مرحباً، أنا مهتم بالعقار ${title}، الرقم المرجعي ${reference}. ${pageUrl}`
    : `Hello, I am interested in ${title}, reference ${reference}. ${pageUrl}`;
  const whatsappHref = contact.whatsappNumber ? `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}` : '/contact';

  return (
    <>
      <div className="hidden rounded-2xl border bg-white p-5 lg:block">
        <h2 className="font-bold text-navy-900">{locale === 'ar' ? 'تواصل مباشرة' : 'Contact directly'}</h2>
        <div className="mt-4 grid gap-2">
          <a href={whatsappHref} target={contact.whatsappNumber ? '_blank' : undefined} rel={contact.whatsappNumber ? 'noopener noreferrer' : undefined} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 font-bold text-white hover:bg-emerald-700"><MessageCircle className="h-4 w-4" />{dict.common.whatsapp}</a>
          {contact.businessPhone && <a href={`tel:${contact.businessPhone}`} dir="ltr" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-navy-200 px-4 font-bold text-navy-800 hover:border-gold-500"><Phone className="h-4 w-4" />{contact.phoneDisplay}</a>}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid min-h-[var(--mobile-contact-height)] grid-cols-3 gap-2 border-t border-surface-border bg-white/95 px-3 pb-[calc(.65rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(17,34,54,.12)] backdrop-blur lg:hidden" aria-label={locale === 'ar' ? 'خيارات التواصل' : 'Property contact options'}>
        {contact.businessPhone ? <a href={`tel:${contact.businessPhone}`} className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border border-navy-200 text-xs font-bold text-navy-800"><Phone className="h-4 w-4" />{dict.common.call}</a> : <Link href="/contact" className="flex min-h-12 items-center justify-center rounded-xl border text-xs font-bold">{dict.nav.contact}</Link>}
        <a href={whatsappHref} target={contact.whatsappNumber ? '_blank' : undefined} rel={contact.whatsappNumber ? 'noopener noreferrer' : undefined} className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl bg-emerald-600 text-xs font-bold text-white"><MessageCircle className="h-4 w-4" />{dict.common.whatsapp}</a>
        <a href="#property-enquiry" className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl bg-navy-800 text-xs font-bold text-white"><Mail className="h-4 w-4" />{dict.property.send}</a>
      </nav>
    </>
  );
}
