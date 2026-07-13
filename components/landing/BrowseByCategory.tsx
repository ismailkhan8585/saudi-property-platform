import Link from 'next/link';
import { PROPERTY_CATEGORIES } from '@/lib/constants';
import { getHomePageData } from '@/lib/data/public';

export default async function BrowseByCategory() {
  const counts = (await getHomePageData()).categoryCounts;

  const main = PROPERTY_CATEGORIES.slice(0, 6);

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-800 text-navy-700 text-2xl md:text-3xl relative inline-block gold-underline-center">
            Browse by Category
          </h2>
          <p className="font-urdu text-gold-600 text-xl mt-6">قسم کے مطابق تلاش کریں</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {main.map(({ value, label, labelUr, icon }) => (
            <Link
              key={value}
              href={`/search?category=${value}`}
              className="group min-w-0 flex flex-col items-center gap-2 sm:gap-3 bg-surface-secondary hover:bg-navy-500 border border-surface-border rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-3xl sm:text-4xl">{icon}</span>
              <div className="text-center">
                <p className="font-heading font-700 text-navy-700 group-hover:text-white text-sm transition-colors">
                  {label}
                </p>
                <p className="font-urdu text-gray-500 group-hover:text-white/70 text-xs transition-colors">
                  {labelUr}
                </p>
                <p className="font-price text-gold-500 group-hover:text-gold-300 text-xs mt-1 transition-colors">
                  {counts[value] ?? 0} listed
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
