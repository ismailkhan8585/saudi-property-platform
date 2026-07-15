import { cookies } from 'next/headers';
import { getDictionary, isLocale } from '@/lib/i18n';
export async function getServerI18n(){const value=(await cookies()).get('locale')?.value;const locale=isLocale(value)?value:'ar';return{locale,dict:getDictionary(locale)}}
