'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

/**
 * NavStrip
 * Horizontal nav with dropdown support.
 */

const NAV_ITEMS = [
  { label: 'মাঠ', slug: '' },
  { 
    label: 'ফুটবল', 
    slug: 'football',
    subItems: [
      { label: 'আন্তর্জাতিক ফুটবল', slug: 'international-football' },
      { label: 'ক্লাব ফুটবল', slug: 'club-football' },
      { label: 'ফুটবল বিশ্বকাপ ২০২৬', slug: 'world-cup-2026' }
    ]
  },
  { label: 'বাংলাদেশের ফুটবল', slug: 'bd-football' },
  { label: 'ক্রিকেট', slug: 'cricket' },
  { label: 'বাংলাদেশের ক্রিকেট', slug: 'bd-cricket' },
  { label: 'ইন্টারভিউ', slug: 'interview' },
  { label: 'ফিচার', slug: 'feature' },
  { label: 'খেলার দেশ বিশেষ', slug: 'special' },
  { label: 'অতিথি কলাম', slug: 'guest-column' },
  { 
    label: 'অন্যান্য', 
    slug: 'others',
    subItems: [
      { label: 'বাস্কেটবল', slug: 'basketball' },
      { label: 'রাগবি', slug: 'rugby' },
      { label: 'ফর্মুলা ওয়ান', slug: 'f1' },
      { label: 'টেবিল টেনিস', slug: 'table-tennis' },
      { label: 'গল্ফ', slug: 'golf' }
    ]
  },
];

export default function NavStrip({ noBorder = false }: { noBorder?: boolean }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (slug: string) => {
    if (slug === '') return pathname === '/';
    if (pathname === `/sport/${slug}`) return true;
    const item = NAV_ITEMS.find(i => i.slug === slug);
    if (item && item.subItems) {
      return item.subItems.some(sub => pathname === `/sport/${sub.slug}`);
    }
    return false;
  };

  return (
    <nav
      ref={navRef}
      className="relative z-50 w-full"
      style={{ borderBottom: noBorder ? 'none' : '1.5px solid var(--ink)' }}
      aria-label="Sport categories"
    >
      <ul className="flex flex-wrap lg:flex-nowrap lg:overflow-x-visible items-center gap-x-1 gap-y-2 lg:gap-0 lg:justify-center px-2 py-2 lg:py-0">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.slug);
          const href = item.slug === '' ? '/' : `/sport/${item.slug}`;
          const hasSubItems = !!item.subItems;
          const isOpen = openDropdown === item.slug;

          return (
            <li key={item.slug} className="relative group">
              <div className="flex items-center">
                <Link
                  href={href}
                  className="nav-item ui-label flex items-center px-3 py-2 whitespace-nowrap transition-colors duration-150 rounded lg:rounded-none"
                  style={{
                    fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                    fontSize: '15px',
                    fontWeight: 600,
                    backgroundColor: active ? 'var(--ink)' : 'transparent',
                    color: active ? 'var(--bg-page)' : 'var(--ink)',
                  }}
                  aria-current={active ? 'page' : undefined}
                  lang="bn"
                  onClick={() => setOpenDropdown(null)}
                >
                  {item.label}
                </Link>
                {hasSubItems && (
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.slug)}
                    className="px-2 py-2 ml-1 rounded lg:hidden"
                    style={{
                      color: active ? 'var(--bg-page)' : 'var(--ink)',
                      backgroundColor: active ? 'var(--ink)' : 'transparent',
                    }}
                  >
                    {isOpen ? '▲' : '▼'}
                  </button>
                )}
              </div>

              {/* Desktop Hover Dropdown */}
              {hasSubItems && (
                <div 
                  className="hidden lg:block absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px]"
                >
                  <ul className="bg-[var(--bg-surface)] border border-[var(--ink-border)] shadow-lg rounded-sm overflow-hidden py-1">
                    {item.subItems!.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`/sport/${sub.slug}`}
                          className="block px-4 py-2 hover:bg-[var(--ink-ghost)] transition-colors whitespace-nowrap"
                          style={{
                            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                            fontSize: '14px',
                            color: pathname === `/sport/${sub.slug}` ? 'var(--live-red)' : 'var(--ink)',
                            fontWeight: pathname === `/sport/${sub.slug}` ? 600 : 400
                          }}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mobile Click Dropdown */}
              {hasSubItems && isOpen && (
                <div className="lg:hidden w-full pl-4 py-1">
                  <ul className="flex flex-col gap-1 border-l-2 border-[var(--ink-border)] pl-2">
                    {item.subItems!.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`/sport/${sub.slug}`}
                          className="block px-2 py-1.5 hover:bg-[var(--ink-ghost)] rounded"
                          style={{
                            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                            fontSize: '14px',
                            color: pathname === `/sport/${sub.slug}` ? 'var(--live-red)' : 'var(--ink-muted)',
                          }}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
