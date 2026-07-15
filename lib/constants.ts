export const AGENT_NAME_EN = 'Dar Al Aqar';
export const AGENT_NAME_AR = 'دار العقار';
export const AGENT_NAME_UR = AGENT_NAME_AR;
export const TAGLINE_EN = 'A clearer way to find property in Saudi Arabia';
export const TAGLINE_AR = 'طريقة أوضح للبحث عن العقار في السعودية';
export const TAGLINE_UR = TAGLINE_AR;
export const CITY = 'Riyadh';
export const OFFICE_ADDRESS = 'Saudi Arabia';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
export const PROPERTY_CATEGORIES = [
  { value: 'APARTMENT', label: 'Apartment', labelAr: 'شقة', icon: '⌂' }, { value: 'VILLA', label: 'Villa', labelAr: 'فيلا', icon: '⌂' },
  { value: 'HOUSE', label: 'House', labelAr: 'منزل', icon: '⌂' }, { value: 'PLOT', label: 'Residential land', labelAr: 'أرض سكنية', icon: '◇' },
  { value: 'COMMERCIAL', label: 'Commercial land', labelAr: 'أرض تجارية', icon: '◇' }, { value: 'OFFICE', label: 'Office', labelAr: 'مكتب', icon: '□' },
  { value: 'SHOP', label: 'Shop', labelAr: 'محل', icon: '□' }, { value: 'WAREHOUSE', label: 'Warehouse', labelAr: 'مستودع', icon: '□' },
  { value: 'FARMHOUSE', label: 'Farm', labelAr: 'مزرعة', icon: '◇' }, { value: 'PORTION', label: 'Compound', labelAr: 'مجمع سكني', icon: '⌂' },
  { value: 'ROOM', label: 'Room', labelAr: 'غرفة', icon: '□' }
] as const;
export const SAUDI_CITIES = ['Riyadh','Jeddah','Makkah','Madinah','Dammam','Al Khobar','Dhahran','Taif','Tabuk','Abha','Khamis Mushait','Buraydah','Unaizah','Hail','Al Hofuf','Jubail','Najran','Jazan','Al Bahah','Sakaka','Arar'] as const;
export const WORKING_HOURS = { weekdays: { days: 'Sun – Thu', hours: '9:00 – 18:00' }, weekend: { days: 'Fri – Sat', hours: 'By appointment' } };
export const STATS = { yearsExperience: 0, dealsClosed: 0, happyClients: 0, propertiesListed: 0 };
