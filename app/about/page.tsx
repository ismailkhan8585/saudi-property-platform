export const dynamic = 'force-dynamic';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { getServiceClient } from '@/lib/supabase';
import { WHATSAPP_URL, CALL_URL, AGENT_PHONE, WHATSAPP_GENERAL_MSG, STATS, AGENT_NAME_EN } from '@/lib/constants';
import { Phone, MessageCircle, Star, Award, Home, MapPin, Clock } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `About Us | ${AGENT_NAME_EN}`,
  description: `Learn about ${AGENT_NAME_EN} — Lahore's trusted property dealer with ${STATS.yearsExperience}+ years experience.`,
};

const services = [
  { icon: '🏠', title: 'Residential Sale & Purchase',   desc: 'Buy or sell houses, apartments, and villas across all Lahore societies.' },
  { icon: '🔑', title: 'Rental Management',             desc: 'Find quality rental properties or manage your rental income professionally.' },
  { icon: '🏢', title: 'Commercial Properties',         desc: 'Shops, offices, plazas, and warehouses for sale and rent in Lahore.' },
  { icon: '🏗️', title: 'Plot Buying & Selling',        desc: 'Residential and commercial plots in DHA, Bahria Town, and all major societies.' },
  { icon: '📊', title: 'Property Valuation',            desc: 'Accurate market valuation for your property by an experienced professional.' },
  { icon: '💡', title: 'Investment Advice',             desc: 'Expert guidance on the best investment opportunities in Lahore real estate.' },
];

async function getSettings(): Promise<SiteSettings | null> {
  const { data } = await getServiceClient().from('site_settings').select('*').maybeSingle();
  return data as SiteSettings | null;
}

interface Testimonial {
  id: string;
  client_name: string;
  client_area: string;
  property_type: string;
  rating: number;
  quote_text: string;
}

async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await getServiceClient()
    .from('testimonials').select('*').eq('is_active', true).limit(3);
  return (data as Testimonial[]) ?? [];
}

export default async function AboutPage() {
  const [settings, testimonials] = await Promise.all([getSettings(), getTestimonials()]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <div className="bg-navy-700 pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-heading font-800 text-white text-4xl md:text-5xl mb-4">
              About {settings?.agentNameEn ?? AGENT_NAME_EN}
            </h1>
            <p className="text-gold-300 text-lg">Lahore's Trusted Property Consultant</p>
          </div>
        </div>

        {/* Agent Profile */}
        <section className="section-padding bg-surface-secondary">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-gold-400 shadow-2xl">
                    <Image
                      src={settings?.agentPhoto ?? 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=600'}
                      alt={settings?.agentNameEn ?? AGENT_NAME_EN}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-gold-500 text-white rounded-2xl px-5 py-3 shadow-xl">
                    <div className="font-price font-700 text-3xl">{STATS.yearsExperience}+</div>
                    <div className="text-xs text-white/80">Years in Lahore Real Estate</div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-heading font-800 text-navy-700 text-3xl mb-2">
                  {settings?.agentNameEn ?? AGENT_NAME_EN}
                </h2>
                <p className="text-gold-600 font-600 mb-6">Property Consultant — Lahore, Pakistan</p>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {settings?.agentBioEn ?? `With over ${STATS.yearsExperience} years of experience in Lahore real estate, I have helped hundreds of families find their dream homes and investors secure the best deals in DHA Lahore, Bahria Town, Gulberg, and all major Lahore societies.`}
                </p>

                {settings?.agentBioUr && (
                  <p className="font-urdu text-gray-500 text-lg leading-loose mb-6">{settings.agentBioUr}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { Icon: Home,  val: `${STATS.dealsClosed}+`,      label: 'Deals Closed' },
                    { Icon: Star,  val: `${STATS.happyClients}+`,     label: 'Happy Clients' },
                    { Icon: Award, val: `${STATS.propertiesListed}+`, label: 'Properties' },
                  ].map(({ Icon, val, label }) => (
                    <div key={label} className="bg-white rounded-xl p-4 text-center border border-surface-border shadow-sm">
                      <Icon className="w-5 h-5 text-gold-500 mx-auto mb-2" />
                      <div className="font-price font-700 text-navy-700 text-2xl">{val}</div>
                      <div className="text-gray-500 text-xs">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_GENERAL_MSG)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Me
                  </a>
                  <a
                    href={CALL_URL}
                    className="flex items-center gap-2 bg-navy-500 hover:bg-navy-600 text-white px-6 py-3 rounded-xl font-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {AGENT_PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="section-padding bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading font-800 text-navy-700 text-2xl md:text-3xl relative inline-block gold-underline-center">
                Our Services
              </h2>
              <p className="font-urdu text-gold-600 text-xl mt-6">ہماری خدمات</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4 bg-surface-secondary rounded-2xl p-5 border border-surface-border">
                  <span className="text-3xl shrink-0">{icon}</span>
                  <div>
                    <h3 className="font-heading font-700 text-navy-700 text-sm mb-1">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="section-padding bg-surface-secondary">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="font-heading font-800 text-navy-700 text-2xl md:text-3xl text-center mb-10">
                Client Testimonials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl p-6 border border-surface-border">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.quote_text}"</p>
                    <div className="font-heading font-700 text-navy-700 text-sm">{t.client_name}</div>
                    <div className="text-gray-400 text-xs">{t.client_area} · {t.property_type}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
