'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, LayoutDashboard, Home, Users, Settings, LogOut, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AGENT_NAME_EN } from '@/lib/constants';

const nav = [
  { href: '/admin/dashboard',  label: 'Dashboard',   Icon: LayoutDashboard },
  { href: '/admin/properties', label: 'Properties',  Icon: Home },
  { href: '/admin/leads',      label: 'Leads',       Icon: MessageSquare },
  { href: '/admin/settings',   label: 'Settings',    Icon: Settings },
];

interface Props { unreadLeads?: number }

export default function AdminSidebar({ unreadLeads = 0 }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    toast.success('Logged out');
    router.push('/admin/login');
  }

  return (
    <aside className="w-60 bg-navy-800 min-h-screen flex flex-col text-white shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-navy-600">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-heading font-700 text-sm text-white">{AGENT_NAME_EN}</div>
            <div className="text-white/40 text-xs">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          const badge = label === 'Leads' && unreadLeads > 0;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-gold-500 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {badge && (
                <span className="ml-auto bg-error text-white text-xs font-700 min-w-5 h-5 rounded-full flex items-center justify-center px-1">
                  {unreadLeads}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-navy-600">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors mt-1"
        >
          <Home className="w-4 h-4" />
          View Site
        </Link>
      </div>
    </aside>
  );
}
