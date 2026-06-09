'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * NavStrip — Section 10.2
 * Horizontal scroll nav, sport items in Bangla, routes in English
 * Active: bg --ink, text --bg-page
 */

const NAV_ITEMS = [
  { label: 'সব', slug: '' },         // All
  { label: 'ফুটবল', slug: 'football' },
  { label: 'ক্রিকেট', slug: 'cricket' },
  { label: 'বাস্কেটবল', slug: 'basketball' },
  { label: 'টেনিস', slug: 'tennis' },
  { label: 'F1', slug: 'f1' },
  { label: 'রাগবি', slug: 'rugby' },
  { label: 'অ্যাথলেটিক্স', slug: 'athletics' },
];

export default function NavStrip() {
  const pathname = usePathname();

  const isActive = (slug: string) => {
    if (slug === '') {
      return pathname === '/';
    }
    return pathname === `/sport/${slug}`;
  };

  return (
    <nav
      className="scrollbar-none overflow-x-auto"
      style={{ borderBottom: '1.5px solid var(--ink)' }}
      aria-label="Sport categories"
    >
      <ul className="flex flex-nowrap items-stretch">
        {NAV_ITEMS.map(({ label, slug }) => {
          const active = isActive(slug);
          const href = slug === '' ? '/' : `/sport/${slug}`;
          return (
            <li key={slug} className="flex-shrink-0">
              <Link
                href={href}
                className="nav-item ui-label flex items-center px-4 py-3 whitespace-nowrap transition-colors duration-150"
                style={{
                  fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  backgroundColor: active ? 'var(--ink)' : 'transparent',
                  color: active ? 'var(--bg-page)' : 'var(--ink)',
                }}
                aria-current={active ? 'page' : undefined}
                lang="bn"
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
