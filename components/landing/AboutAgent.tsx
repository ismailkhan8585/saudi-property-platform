import Image from 'next/image';
import Link from 'next/link';
import { Phone, MessageCircle, Star, Award, Home } from 'lucide-react';
import { AGENT_PHONE, WHATSAPP_URL, WHATSAPP_GENERAL_MSG, CALL_URL, STATS, AGENT_NAME_EN } from '@/lib/constants';
import { getServiceClient } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types';

async function getSettings(): Promise<SiteSettings | null> {
  const { data } = await getServiceClient().from('site_settings').select('*').maybeSingle();
  return data as SiteSettings | null;
}

export default async function AboutAgent() {
  const settings = await getSettings();

  return (
    <section className="section-padding bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Photo + stats */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="relative">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden border-4 border-gold-400 shadow-2xl">
                <Image
                  src={settings?.agentPhoto ?? 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={AGENT_NAME_EN}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-gold-500 text-white rounded-xl px-4 py-2 shadow-lg">
                <span className="font-price font-700 text-2xl">{STATS.yearsExperience}+</span>
                <p className="text-xs">Years Exp.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
              {[
                { Icon: Home,  value: `${STATS.dealsClosed}+`, label: 'Deals Closed' },
                { Icon: Star,  value: '5.0',                   label: 'Rating' },
                { Icon: Award, value: `${STATS.propertiesListed}+`, label: 'Properties' },
              ].map(({ Icon, value, label }) => (
                <div key={label} className="bg-white rounded-xl p-3 text-center border border-surface-border shadow-sm">
                  <Icon className="w-5 h-5 text-gold-500 mx-auto mb-1" />
                  <div className="font-price font-700 text-navy-700 text-lg">{value}</div>
                  <div className="text-gray-500 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <span className="inline-block bg-gold-100 text-gold-700 text-xs font-600 px-3 py-1 rounded-full mb-4">
              Your Property Expert
            </span>
            <h2 className="font-heading font-800 text-navy-700 text-3xl md:text-4xl mb-2">
              {settings?.agentNameEn ?? AGENT_NAME_EN}
            </h2>
            <p className="text-gold-600 font-600 mb-6">Property Consultant, Lahore</p>

            <p className="text-gray-600 leading-relaxed mb-4">
              {settings?.agentBioEn ?? 'With over 12 years of experience in Lahore real estate, I have helped hundreds of families find their dream homes and investors secure the best deals. I specialize in DHA Lahore, Bahria Town, Gulberg, and all major Lahore societies.'}
            </p>

            {settings?.agentBioUr && (
              <p className="font-urdu text-gray-500 text-base leading-loose mb-6">{settings.agentBioUr}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_GENERAL_MSG)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Me
              </a>
              <a
                href={CALL_URL}
                className="flex items-center gap-2 bg-navy-500 hover:bg-navy-600 text-white px-5 py-3 rounded-xl font-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {AGENT_PHONE}
              </a>
              <Link
                href="/about"
                className="flex items-center gap-2 border border-navy-300 text-navy-600 hover:bg-navy-50 px-5 py-3 rounded-xl font-600 transition-colors"
              >
                View Full Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
