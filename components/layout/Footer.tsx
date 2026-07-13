import Link from 'next/link';
import { Building2, Phone, MessageCircle, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import {
  AGENT_NAME_EN, AGENT_NAME_UR, TAGLINE_EN, TAGLINE_UR,
  WHATSAPP_URL, CALL_URL, AGENT_PHONE, WHATSAPP_GENERAL_MSG,
  OFFICE_ADDRESS, WORKING_HOURS,
} from '@/lib/constants';

const propertyLinks = [
  { href: '/properties/for-sale', label: 'For Sale' },
  { href: '/properties/for-rent', label: 'For Rent' },
  { href: '/properties/houses',   label: 'Houses' },
  { href: '/properties/plots',    label: 'Plots' },
  { href: '/properties/apartments', label: 'Apartments' },
  { href: '/properties/commercial', label: 'Commercial' },
];

const societyLinks = [
  { href: '/search?society=DHA+Lahore',          label: 'DHA Lahore' },
  { href: '/search?society=Bahria+Town+Lahore',  label: 'Bahria Town' },
  { href: '/search?society=Gulberg',             label: 'Gulberg' },
  { href: '/search?society=Model+Town',          label: 'Model Town' },
  { href: '/search?society=Johar+Town',          label: 'Johar Town' },
  { href: '/properties',                         label: 'All Areas' },
];

const companyLinks = [
  { href: '/about',   label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-white">
      {/* Top CTA Strip */}
      <div className="bg-gold-500 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-heading font-700 text-navy-800 text-lg">
            Ready to find your perfect property in Lahore?
          </p>
          <div className="flex gap-3">
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_GENERAL_MSG)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Now
            </a>
            <a
              href={CALL_URL}
              className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-heading font-700 text-white text-lg">{AGENT_NAME_EN}</div>
                <div className="text-gold-300 text-xs font-urdu">{AGENT_NAME_UR}</div>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-3">{TAGLINE_EN}</p>
            <p className="text-gold-300 text-sm font-urdu mb-5">{TAGLINE_UR}</p>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">{OFFICE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={CALL_URL} className="text-white/60 text-sm hover:text-gold-300 transition-colors">
                  {AGENT_PHONE}
                </a>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <div className="text-white/60 text-sm">
                  <div>{WORKING_HOURS.weekdays.days}: {WORKING_HOURS.weekdays.hours}</div>
                  <div>{WORKING_HOURS.weekend.days}: {WORKING_HOURS.weekend.hours}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Column */}
          <div>
            <h3 className="font-heading font-700 text-white text-base mb-5 relative gold-underline">
              Properties
            </h3>
            <ul className="space-y-2.5 mt-4">
              {propertyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 text-sm hover:text-gold-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Societies Column */}
          <div>
            <h3 className="font-heading font-700 text-white text-base mb-5 relative gold-underline">
              Popular Areas
            </h3>
            <ul className="space-y-2.5 mt-4">
              {societyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 text-sm hover:text-gold-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-heading font-700 text-white text-base mb-5 relative gold-underline">
              Company
            </h3>
            <ul className="space-y-2.5 mt-4">
              {companyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 text-sm hover:text-gold-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="text-white/50 text-sm mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-600 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/40 text-sm">
          <p>© {new Date().getFullYear()} {AGENT_NAME_EN} — All Rights Reserved</p>
          <p>Serving Lahore with Integrity 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}
