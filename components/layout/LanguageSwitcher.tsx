'use client';

import { Languages } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';

export default function LanguageSwitcher({ showLabel = false }: { showLabel?: boolean }) {
  const { locale, dict } = useLocale();
  function switchLanguage() {
    const next = locale === 'ar' ? 'en' : 'ar';
    document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }
  return <button type="button" onClick={switchLanguage} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[.04] px-2 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 sm:px-3" aria-label={dict.common.language}><Languages className="h-4 w-4" /><span className={showLabel ? 'inline' : 'hidden sm:inline'}>{dict.common.language}</span></button>;
}
