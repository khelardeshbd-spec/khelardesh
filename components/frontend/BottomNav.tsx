'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';

/**
 * BottomNav — mobile only
 * SVG icons (no unicode glyphs), Bengali labels
 * Active state: ink color fill
 * Safe-area-inset-bottom padding for iPhone notch
 */

const NAV_ITEMS = [
  {
    labelBn: 'মাঠ',
    href: '/',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" fill={active ? 'currentColor' : 'none'} />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    labelBn: 'খোঁজ',
    href: '/search',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
    ),
  },
  {
    labelBn: 'সেভ',
    href: '/saved',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    labelBn: 'সতর্কতা',
    href: '/alerts',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const navVisible = useScrollDirection();
  const pathname = usePathname();

  return (
    <nav
      id="bottom-nav"
      aria-label="মোবাইল নেভিগেশন"
      className="lg:hidden fixed bottom-0 left-0 right-0"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderTop: '1px solid var(--ink-border)',
        transform: navVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.25s ease',
        zIndex: 50,
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}
    >
      <ul className="flex items-stretch" style={{ height: 52 }}>
        {NAV_ITEMS.map(({ labelBn, href, icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center justify-center h-full gap-0.5"
                aria-current={isActive ? 'page' : undefined}
                style={{
                  color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
                  minHeight: 44,
                }}
              >
                {icon(isActive)}
                <span
                  lang="bn"
                  style={{
                    fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                    fontSize: 9,
                    letterSpacing: '0.04em',
                    color: 'inherit',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {labelBn}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
