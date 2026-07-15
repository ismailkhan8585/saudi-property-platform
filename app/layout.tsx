import './globals.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Toaster } from '@/components/ui/sonner';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { isLocale } from '@/lib/i18n';
import { APP_URL } from '@/lib/constants';
import { getContactConfig } from '@/lib/contact';
import { ContactProvider } from '@/components/providers/ContactProvider';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: 'دار العقار | Dar Al Aqar', template: '%s | دار العقار' },
  description: 'منصة عقارية ثنائية اللغة للبحث عن العقارات في المملكة العربية السعودية | Bilingual Saudi property search platform.',
  keywords: ['عقارات السعودية', 'عقارات الرياض', 'عقار جدة', 'Saudi property', 'Riyadh real estate'],
  openGraph: { type: 'website', locale: 'ar_SA', alternateLocale: 'en_SA', siteName: 'دار العقار | Dar Al Aqar' },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const value = (await cookies()).get('locale')?.value;
  const locale = isLocale(value) ? value : 'ar';
  const contact = getContactConfig();
  return <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}><body className="bg-surface-secondary text-foreground antialiased"><LocaleProvider locale={locale}><ContactProvider value={contact}>{children}<WhatsAppButton/><Toaster richColors position={locale === 'ar' ? 'top-left' : 'top-right'} /></ContactProvider></LocaleProvider></body></html>;
}
