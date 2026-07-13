'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Building2, Search, Info, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AGENT_NAME_EN, WHATSAPP_URL, WHATSAPP_GENERAL_MSG } from '@/lib/constants';

const navLinks = [
  { href: '/properties',          label: 'Properties' },
  { href: '/properties/for-sale', label: 'For Sale' },
  { href: '/properties/for-rent', label: 'For Rent' },
  { href: '/about',               label: 'About' },
  { href: '/contact',             label: 'Contact' },
];

const mobileNavLinks = [
  { href: '/',                    label: 'Home',       Icon: Home },
  { href: '/properties',          label: 'Properties', Icon: Building2 },
  { href: '/search',              label: 'Search',     Icon: Search },
  { href: '/about',               label: 'About',      Icon: Info },
  { href: '/contact',             label: 'Contact',    Icon: Phone },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isTransparent = isHomePage && !scrolled && !menuOpen;

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          isTransparent
            ? 'bg-transparent'
            : 'bg-navy-700 shadow-lg backdrop-blur-md'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-800 text-white text-lg leading-tight block">
                  {AGENT_NAME_EN}
                </span>
                <span className="text-gold-300 text-xs leading-none font-urdu">
                  لاہور پراپرٹی ڈیلر
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === href || pathname.startsWith(href + '/')
                      ? 'text-gold-400 bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_GENERAL_MSG)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <Link
                href="/contact"
                className="hidden md:flex items-center border border-gold-400 text-gold-300 hover:bg-gold-500 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                List Property
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-white rounded-md hover:bg-white/10"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-navy-800 border-t border-navy-600 px-4 py-4 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-gold-500/20 text-gold-300'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-navy-800 border-t border-navy-600 safe-area-bottom">
        <div className="flex">
          {mobileNavLinks.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                pathname === href
                  ? 'text-gold-400'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
