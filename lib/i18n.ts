import ar from '@/locales/ar.json';
import en from '@/locales/en.json';

export type Locale = 'ar' | 'en';
export const dictionaries = { ar, en } as const;
export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}

export function isLocale(value: unknown): value is Locale {
  return value === 'ar' || value === 'en';
}

export function formatCurrency(amount: number, locale: Locale, compact = false) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', {
    style: 'currency', currency: 'SAR', maximumFractionDigits: 0,
    notation: compact ? 'compact' : 'standard',
  }).format(amount);
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA').format(value);
}

export function formatDate(value: string | Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', { dateStyle: 'medium' }).format(new Date(value));
}

export function normalizeArabic(value: string) {
  return value.normalize('NFKD').replace(/[\u064B-\u065F\u0670]/g, '').replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ة/g, 'ه').replace(/ـ/g, '').trim();
}
