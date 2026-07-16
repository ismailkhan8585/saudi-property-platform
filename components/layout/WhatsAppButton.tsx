'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useContact } from '@/components/providers/ContactProvider';

export default function WhatsAppButton(){
  const pathname=usePathname();const{locale,dict}=useLocale();const contact=useContact();
  if(pathname.startsWith('/admin')||pathname.startsWith('/properties/'))return null;
  const message=locale==='ar'?'مرحباً، أرغب في الاستفسار عن أحد العقارات المعروضة على موقعكم.':'Hello, I would like to enquire about a property listed on your website.';
  const className='fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] end-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-[0_12px_35px_rgba(5,150,105,.35)] transition duration-200 hover:-translate-y-1 hover:bg-emerald-700 focus-visible:ring-4 focus-visible:ring-emerald-200 sm:bottom-7 sm:end-7';
  if(!contact.whatsappNumber)return <Link href="/contact" className={className} aria-label={locale==='ar'?'تأكيد رقم واتساب':'Confirm WhatsApp number'} title={locale==='ar'?'رقم واتساب بانتظار تأكيد العميل':'WhatsApp number awaiting client confirmation'}><MessageCircle className="h-7 w-7"/></Link>;
  return <a href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className={className} aria-label={dict.common.whatsapp}><MessageCircle className="h-7 w-7"/></a>;
}
