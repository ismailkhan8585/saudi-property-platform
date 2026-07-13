export const AGENT_NAME_EN = 'Ahmed Properties';
export const AGENT_NAME_UR = 'احمد پراپرٹیز';
export const TAGLINE_EN = 'Your Trusted Property Dealer in Lahore';
export const TAGLINE_UR = 'لاہور میں آپ کا قابل اعتماد پراپرٹی ڈیلر';
export const CITY = 'Lahore';
export const AGENT_PHONE = '+923029154977';
export const WHATSAPP_NUMBER = '923029154977';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CALL_URL = `tel:${AGENT_PHONE}`;
export const AGENT_EMAIL = 'info@ahmedproperties.pk';
export const OFFICE_ADDRESS = 'Office 12, DHA Phase 5 Commercial, Lahore';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const WHATSAPP_PROPERTY_MSG = (title: string, id: string) =>
  `I'm interested in ${title} — Property ID #${id}. Please contact me.`;

export const WHATSAPP_GENERAL_MSG =
  "Hello! I'm interested in a property in Lahore. Can you help me?";

export { LAHORE_SOCIETIES, type LahoreSociety as LaSociety } from './societies';

export const PROPERTY_CATEGORIES = [
  { value: 'HOUSE',      label: 'House',       labelUr: 'مکان',      icon: '🏠' },
  { value: 'APARTMENT',  label: 'Apartment',   labelUr: 'اپارٹمنٹ', icon: '🏢' },
  { value: 'PLOT',       label: 'Plot',        labelUr: 'پلاٹ',      icon: '🏗️' },
  { value: 'COMMERCIAL', label: 'Commercial',  labelUr: 'کمرشل',     icon: '🏪' },
  { value: 'FARMHOUSE',  label: 'Farmhouse',   labelUr: 'فارم ہاؤس', icon: '🌾' },
  { value: 'OFFICE',     label: 'Office',      labelUr: 'دفتر',      icon: '🏬' },
  { value: 'SHOP',       label: 'Shop',        labelUr: 'دکان',      icon: '🛍️' },
  { value: 'VILLA',      label: 'Villa',       labelUr: 'ولا',       icon: '🏰' },
  { value: 'ROOM',       label: 'Room',        labelUr: 'کمرہ',      icon: '🚪' },
  { value: 'PORTION',    label: 'Portion',     labelUr: 'پورشن',     icon: '🏘️' },
  { value: 'WAREHOUSE',  label: 'Warehouse',   labelUr: 'گودام',     icon: '🏭' },
] as const;

export const WORKING_HOURS = {
  weekdays: { days: 'Mon – Sat', hours: '9:00 AM – 8:00 PM' },
  weekend:  { days: 'Sunday',   hours: '10:00 AM – 5:00 PM' },
};

export const STATS = {
  yearsExperience: 12,
  dealsClosed:     350,
  happyClients:    280,
  propertiesListed: 150,
};
