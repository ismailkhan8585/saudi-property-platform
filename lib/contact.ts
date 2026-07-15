export interface PublicContactConfig {
  whatsappNumber: string | null;
  businessPhone: string | null;
  phoneDisplay: string;
  email: string;
  configured: boolean;
}

function digits(value?: string) { return value?.replace(/\D/g, '') || ''; }

export function getContactConfig(): PublicContactConfig {
  const whatsapp = digits(process.env.WHATSAPP_NUMBER);
  const phone = digits(process.env.BUSINESS_PHONE);
  const validWhatsApp = /^966\d{9}$/.test(whatsapp);
  const validPhone = /^966\d{9}$/.test(phone);
  return {
    whatsappNumber: validWhatsApp ? whatsapp : null,
    businessPhone: validPhone ? `+${phone}` : null,
    phoneDisplay: validPhone ? `+966 ${phone.slice(3, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}` : '+966 XX XXX XXXX',
    email: process.env.BUSINESS_EMAIL || 'info@example.sa',
    configured: validWhatsApp && validPhone,
  };
}
