import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, Noto_Nastaliq_Urdu, JetBrains_Mono } from 'next/font/google';
import { AGENT_NAME_EN, TAGLINE_EN, APP_URL } from '@/lib/constants';
import { Toaster } from '@/components/ui/sonner';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-urdu',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${AGENT_NAME_EN} — ${TAGLINE_EN}`,
    template: `%s | ${AGENT_NAME_EN}`,
  },
  description:
    'Find houses, plots, apartments & commercial properties for sale and rent across all major Lahore societies. Trusted property dealer in Lahore.',
  keywords: [
    'property for sale Lahore',
    'house for rent Lahore',
    'plot for sale DHA Lahore',
    'apartment Bahria Town',
    'property dealer Lahore',
    'real estate Lahore',
    'Zameen Lahore',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: AGENT_NAME_EN,
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dmSans.variable} ${notoUrdu.variable} ${jetbrains.variable}`}>
      <body className="font-body bg-surface-secondary text-foreground antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
