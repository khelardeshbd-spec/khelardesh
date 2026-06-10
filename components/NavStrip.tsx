'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';

export const NAV_ITEMS = [
  { label: 'মাঠ', slug: '' },
  {
    label: 'ফুটবল',
    slug: 'football',
    subItems: [
      { label: 'আন্তর্জাতিক ফুটবল', slug: 'international-football' },
      { label: 'ক্লাব ফুটবল', slug: 'club-football' },
      { label: 'ফুটবল বিশ্বকাপ ২০২৬', slug: 'world-cup-2026' },
    ],
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
      { label: 'ফর্মুলা ওয়ান', slug: 'f1' },
      { label: 'টেবিল টেনিস', slug: 'table-tennis' },
      { label: 'গল্ফ', slug: 'golf' },
    ],
  },
];

interface NavStripProps {
  noBorder?: boolean;
  /** When true, renders a vertical drawer-style list (for mobile drawer) */
  vertical?: boolean;
  onNavigate?: () => void;
}

export default function NavStrip({ noBorder = false, vertical = false, onNavigate }: NavStripProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropdown]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeDropdown();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeDropdown]);

  const isActive = (slug: string) => {
    if (slug === '') return pathname === '/';
    if (pathname === `/sport/${slug}`) return true;
    const item = NAV_ITEMS.find((i) => i.slug === slug);
    if (item && item.subItems) {
      return item.subItems.some((sub) => pathname === `/sport/${sub.slug}`);
    }
    return false;
  };

  if (vertical) {
    // Vertical drawer layout
    return (
      <nav ref={navRef} aria-label="প্রধান নেভিগেশন" className="w-full">
        <ul className="flex flex-col">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.slug);
            const href = item.slug === '' ? '/' : `/sport/${item.slug}`;
            const hasSubItems = !!item.subItems;
            const isOpen = openDropdown === item.slug;

            return (
              <li key={item.slug} className="border-b border-[var(--ink-border)]">
                <div className="flex items-center justify-between">
                  <Link
                    href={href}
                    lang="bn"
                    className="flex-1 px-4 py-3 flex items-center"
                    style={{
                      fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                      fontSize: 17,
                      fontWeight: active ? 700 : 500,
                      color: active ? 'var(--live-red)' : 'var(--ink)',
                    }}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => { closeDropdown(); onNavigate?.(); }}
                  >
                    {item.label}
                  </Link>
                  {hasSubItems && (
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.slug)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className="px-4 py-3 flex items-center justify-center"
                      style={{ color: 'var(--ink-muted)', minWidth: 44, minHeight: 44 }}
                      aria-label={isOpen ? 'বন্ধ করুন' : 'খুলুন'}
                    >
                      <svg
                        width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  )}
                </div>
                {/* Sub-items accordion */}
                {hasSubItems && isOpen && (
                  <ul role="menu" className="bg-[var(--bg-surface)] border-t border-[var(--ink-border)]">
                    {item.subItems!.map((sub) => (
                      <li key={sub.slug} role="none">
                        <Link
                          href={`/sport/${sub.slug}`}
                          role="menuitem"
                          lang="bn"
                          className="block px-8 py-2.5 hover:bg-[var(--ink-ghost)] transition-colors"
                          style={{
                            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                            fontSize: 15,
                            color: pathname === `/sport/${sub.slug}` ? 'var(--live-red)' : 'var(--ink-muted)',
                            fontWeight: pathname === `/sport/${sub.slug}` ? 600 : 400,
                          }}
                          onClick={() => { closeDropdown(); onNavigate?.(); }}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  // Horizontal nav (desktop strip / mobile scroll)
  return (
    <nav
      ref={navRef}
      className="relative z-50 w-full scrollbar-none overflow-x-auto"
      style={{ borderBottom: noBorder ? 'none' : '1.5px solid var(--ink)' }}
      aria-label="খেলার বিভাগ"
    >
      <ul className="flex flex-nowrap items-center">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.slug);
          const href = item.slug === '' ? '/' : `/sport/${item.slug}`;
          const hasSubItems = !!item.subItems;
          const isOpen = openDropdown === item.slug;

          return (
            <li key={item.slug} className="relative flex-shrink-0 group">
              <div className="flex items-stretch">
                <Link
                  href={href}
                  lang="bn"
                  className="flex items-center px-3 py-3 whitespace-nowrap transition-colors duration-150"
                  style={{
                    fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: active ? 'var(--ink)' : 'transparent',
                    color: active ? 'var(--bg-page)' : 'var(--ink)',
                  }}
                  aria-current={active ? 'page' : undefined}
                  onClick={closeDropdown}
                >
                  {item.label}
                </Link>

                {/* Dropdown chevron button (mobile: click; desktop: decorative) */}
                {hasSubItems && (
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.slug)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-label={`${item.label} সাব-মেন্যু`}
                    className="flex items-center px-1 pr-2 lg:hidden"
                    style={{
                      backgroundColor: active ? 'var(--ink)' : 'transparent',
                      color: active ? 'var(--bg-page)' : 'var(--ink-muted)',
                    }}
                  >
                    <svg
                      width="10" height="10" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Desktop hover dropdown */}
              {hasSubItems && (
                <div
                  className="hidden lg:block absolute left-0 top-full pt-1 z-[60] min-w-[210px]
                             opacity-0 invisible pointer-events-none
                             group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto
                             transition-all duration-150"
                >
                  <ul
                    role="menu"
                    className="bg-[var(--bg-surface)] border border-[var(--ink-border)] shadow-xl overflow-hidden"
                    style={{ borderRadius: 2 }}
                  >
                    {item.subItems!.map((sub) => (
                      <li key={sub.slug} role="none">
                        <Link
                          href={`/sport/${sub.slug}`}
                          role="menuitem"
                          lang="bn"
                          className="block px-4 py-2.5 hover:bg-[var(--ink-ghost)] transition-colors whitespace-nowrap"
                          style={{
                            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                            fontSize: 14,
                            color: pathname === `/sport/${sub.slug}` ? 'var(--live-red)' : 'var(--ink)',
                            fontWeight: pathname === `/sport/${sub.slug}` ? 600 : 400,
                          }}
                          onClick={closeDropdown}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mobile click dropdown (inline) */}
              {hasSubItems && isOpen && (
                <div className="lg:hidden absolute left-0 top-full z-[60] min-w-[200px] shadow-xl">
                  <ul
                    role="menu"
                    className="bg-[var(--bg-surface)] border border-[var(--ink-border)] overflow-hidden"
                    style={{ borderRadius: 2 }}
                  >
                    {item.subItems!.map((sub) => (
                      <li key={sub.slug} role="none">
                        <Link
                          href={`/sport/${sub.slug}`}
                          role="menuitem"
                          lang="bn"
                          className="block px-4 py-2.5 hover:bg-[var(--ink-ghost)] transition-colors whitespace-nowrap"
                          style={{
                            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                            fontSize: 14,
                            color: pathname === `/sport/${sub.slug}` ? 'var(--live-red)' : 'var(--ink-muted)',
                            fontWeight: pathname === `/sport/${sub.slug}` ? 600 : 400,
                          }}
                          onClick={() => { closeDropdown(); onNavigate?.(); }}
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
