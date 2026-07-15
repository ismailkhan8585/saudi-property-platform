'use client';

import type { ReactNode } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function MobileFilterSheet({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }) {
  const { dict } = useLocale();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto rounded-t-3xl px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-6 sm:px-6">
        <SheetHeader className="pe-10 text-start">
          <SheetTitle>{dict.search.filters}</SheetTitle>
          <SheetDescription>{dict.search.subtitle}</SheetDescription>
        </SheetHeader>
        <div className="mt-5">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
