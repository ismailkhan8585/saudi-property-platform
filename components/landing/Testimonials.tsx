import { Star } from 'lucide-react';
import { getHomePageData } from '@/lib/data/public';

export default async function Testimonials() {
  const testimonials = (await getHomePageData()).testimonials;
  if (!testimonials.length) return null;

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-heading font-800 text-navy-700 text-2xl md:text-3xl relative inline-block gold-underline-center">
            What Our Clients Say
          </h2>
          <p className="font-urdu text-gold-600 text-xl mt-6">ہمارے کلائنٹس کیا کہتے ہیں</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-surface-secondary border border-surface-border rounded-2xl p-5 sm:p-6 flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">&ldquo;{t.quote_text}&rdquo;</p>
              <div className="border-t border-surface-border pt-4">
                <div className="font-heading font-700 text-navy-700 text-sm">{t.client_name}</div>
                <div className="text-gray-500 text-xs">{t.client_area} · {t.property_type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
