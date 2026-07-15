'use client';

import { createContext, useContext } from 'react';
import { dictionaries, type Dictionary, type Locale } from '@/lib/i18n';

const LocaleContext = createContext<{ locale: Locale; dict: Dictionary }>({ locale: 'ar', dict: dictionaries.ar as Dictionary });

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale, dict: dictionaries[locale] as Dictionary }}>{children}</LocaleContext.Provider>;
}

export function useLocale() { return useContext(LocaleContext); }
