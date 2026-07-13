import { Phone, MessageCircle } from 'lucide-react';
import { WHATSAPP_URL, CALL_URL, AGENT_PHONE, WHATSAPP_GENERAL_MSG } from '@/lib/constants';

export default function CtaBanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-navy-700 via-navy-600 to-navy-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgb(201 168 76), transparent)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgb(201 168 76), transparent)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-heading font-800 text-white text-3xl md:text-4xl mb-3">
          Looking to Buy, Sell or Rent in Lahore?
        </h2>
        <p className="font-urdu text-gold-300 text-2xl mb-4">
          لاہور میں خریدنا، بیچنا یا کرایہ؟
        </p>
        <p className="text-white/70 mb-10 max-w-xl mx-auto">
          Contact us now — we respond within minutes. Available 7 days a week.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_GENERAL_MSG)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-base font-700 shadow-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Now
          </a>
          <a
            href={CALL_URL}
            className="flex items-center justify-center gap-3 border-2 border-gold-400 text-gold-300 hover:bg-gold-500 hover:text-white px-8 py-4 rounded-xl text-base font-700 transition-colors"
          >
            <Phone className="w-5 h-5" />
            {AGENT_PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}
