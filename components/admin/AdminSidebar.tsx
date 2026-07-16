'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, ExternalLink, Home, LayoutDashboard, LogOut, Menu, MessageSquare, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AGENT_NAME_EN } from '@/lib/constants';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/properties', label: 'Properties', Icon: Home },
  { href: '/admin/leads', label: 'Leads', Icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

interface Props { unreadLeads?: number }

export default function AdminSidebar({ unreadLeads = 0 }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    toast.success('Logged out');
    router.push('/admin/login');
  }

  const navigation = (mobile = false) => (
    <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
      {nav.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        const item = <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={cn('flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors', active ? 'bg-gold-500 text-navy-900' : 'text-white/65 hover:bg-white/10 hover:text-white')}><Icon className="h-4 w-4 shrink-0" /><span>{label}</span>{label === 'Leads' && unreadLeads > 0 && <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-xs font-bold text-white">{unreadLeads}</span>}</Link>;
        return mobile ? <SheetClose asChild key={href}>{item}</SheetClose> : item;
      })}
    </nav>
  );

  const footerActions = (
    <div className="grid gap-1 border-t border-white/10 p-3">
      <button onClick={handleLogout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-sm text-white/65 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" />Sign Out</button>
      <Link href="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm text-white/45 hover:bg-white/10 hover:text-white"><ExternalLink className="h-4 w-4" />View Site</Link>
    </div>
  );

  return <>
    <header className="sticky top-0 z-40 flex min-h-16 w-full items-center justify-between gap-3 border-b border-white/10 bg-navy-800 px-4 text-white shadow-md md:hidden">
      <div className="flex min-w-0 items-center gap-2"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500 text-navy-900"><Building2 className="h-5 w-5" /></span><div className="min-w-0"><div className="truncate text-sm font-bold">{AGENT_NAME_EN}</div><div className="text-[11px] text-white/50">Admin Panel</div></div></div>
      <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="admin-mobile-navigation" aria-label="Open admin menu" className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/[.06] hover:bg-white/10"><Menu className="h-5 w-5" /></button>
    </header>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent id="admin-mobile-navigation" side="left" className="flex h-[100dvh] w-[min(90vw,22rem)] flex-col gap-0 border-white/10 bg-navy-800 p-0 text-white [&>button]:text-white" dir="ltr">
        <SheetHeader className="border-b border-white/10 p-5 pe-16 text-left"><SheetTitle className="text-white">{AGENT_NAME_EN}</SheetTitle><SheetDescription className="text-white/50">Admin Panel</SheetDescription></SheetHeader>
        {navigation(true)}{footerActions}
      </SheetContent>
    </Sheet>
    <aside className="hidden min-h-screen w-60 shrink-0 flex-col bg-navy-800 text-white md:flex" dir="ltr">
      <div className="flex items-center gap-2 border-b border-white/10 p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500 text-navy-900"><Building2 className="h-5 w-5" /></span><div><div className="text-sm font-bold">{AGENT_NAME_EN}</div><div className="text-xs text-white/40">Admin Panel</div></div></div>
      {navigation()}{footerActions}
    </aside>
  </>;
}
