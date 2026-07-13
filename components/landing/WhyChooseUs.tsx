import { STATS } from '@/lib/constants';

const reasons = [
  { icon: '🤝', title: `${STATS.yearsExperience}+ Years Experience`, desc: 'Deep knowledge of Lahore real estate market across all major societies.' },
  { icon: '✅', title: 'Verified Listings Only',    desc: 'Every property is personally verified before listing. No fake listings.' },
  { icon: '💬', title: 'WhatsApp Support 24/7',     desc: 'Always available on WhatsApp for your queries. Quick, convenient, and personal.' },
  { icon: '🏙️', title: 'All Major Societies',      desc: 'DHA, Bahria Town, Gulberg, Model Town and all Lahore societies covered.' },
  { icon: '💰', title: 'Best Price Guaranteed',     desc: 'We negotiate the best market price whether you are buying, selling, or renting.' },
  { icon: '🔑', title: 'Sale & Rent Under One Roof', desc: 'One agent handles all your property needs — residential and commercial.' },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-heading font-800 text-navy-700 text-2xl md:text-3xl relative inline-block gold-underline-center">
            Why Choose Us
          </h2>
          <p className="font-urdu text-gold-600 text-xl mt-6">ہمیں کیوں چنیں؟</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reasons.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="group flex gap-3 sm:gap-4 bg-surface-secondary hover:bg-navy-50 border border-surface-border hover:border-navy-200 rounded-2xl p-4 sm:p-6 transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl shrink-0">{icon}</div>
              <div>
                <h3 className="font-heading font-700 text-navy-700 text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
