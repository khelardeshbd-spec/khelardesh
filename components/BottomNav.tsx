'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';

/**
 * BottomNav — Section 7 / 8 (mobile only)
 * Sticky bottom bar: Home Search Saved Alerts
 * Slides off-screen on scroll down, slides back on scroll up
 * Height: 52px
 */

const NAV_ITEMS = [
  { label: 'Home', labelBn: 'হোম', href: '/', icon: '⌂' },
  { label: 'Search', labelBn: 'খোঁজ', href: '/search', icon: '◎' },
  { label: 'Saved', labelBn: 'সেভ', href: '/saved', icon: '♡' },
  { label: 'Alerts', labelBn: 'সতর্কতা', href: '/alerts', icon: '◉' },
];

export default function BottomNav() {
  const navVisible = useScrollDirection();
  const pathname = usePathname();

  return (
    <nav
      id="bottom-nav"
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0"
      style={{
        height: 52,
        backgroundColor: 'var(--bg-page)',
        borderTop: '1px solid var(--ink-border)',
        transform: navVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.25s ease',
        zIndex: 50,
      }}
    >
      <ul className="flex items-stretch h-full">
        {NAV_ITEMS.map(({ label, labelBn, href, icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center justify-center h-full gap-0.5"
                aria-current={isActive ? 'page' : undefined}
                style={{
                  color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
                <span
                  className="type-nav"
                  lang="bn"
                  style={{
                    fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                    fontSize: 9,
                    letterSpacing: '0.06em',
                    color: 'inherit',
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
