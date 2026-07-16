export const PUBLIC_NAVIGATION = [
  { href: '/', label: 'home' },
  { href: '/search', label: 'properties' },
  { href: '/search?purpose=SALE', label: 'sale' },
  { href: '/search?purpose=RENT', label: 'rent' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
] as const;

export function isNavigationItemActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href === '/search') return pathname === '/search';
  return pathname === href || (!href.includes('?') && pathname.startsWith(`${href}/`));
}
