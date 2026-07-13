import { formatPKR, formatRent } from '@/lib/currency';
import { cn } from '@/lib/utils';
import type { PriceType, Purpose } from '@/lib/types';

interface PakistaniPriceProps {
  price?: number | null;
  rentPrice?: number | null;
  priceType: PriceType;
  purpose: Purpose;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function PakistaniPrice({
  price, rentPrice, priceType, purpose, size = 'md', className,
}: PakistaniPriceProps) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl md:text-4xl',
  };

  if (priceType === 'ON_REQUEST') {
    return (
      <span className={cn(
        'inline-flex items-center gap-1.5 bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-sm font-medium font-price',
        className
      )}>
        Price on Request
      </span>
    );
  }

  const amount = purpose === 'RENT' ? rentPrice : price;
  if (!amount) return null;

  return (
    <span className={cn('font-price font-medium text-navy-600', sizeClasses[size], className)}>
      {purpose === 'RENT' ? formatRent(Number(amount)) : formatPKR(Number(amount))}
    </span>
  );
}
