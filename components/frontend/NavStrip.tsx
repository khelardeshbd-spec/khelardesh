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
      { label: 'দেশের ফুটবল', slug: 'bd-football' },
      { label: 'বিদেশের ফুটবল', slug: 'international-football' },
      { label: 'পাড়া মহল্লার ফুটবল', slug: 'club-football' },
      { label: 'ফুটবল বিশ্বকাপ ২০২৬', slug: 'world-cup-2026' },
    ],
  },
  {
    label: 'ক্রিকেট',
    slug: 'cricket',
    subItems: [
      { label: 'দেশের ক্রিকেট', slug: 'bd-cricket' },
      { label: 'বিদেশের ক্রিকেট', slug: 'international-cricket' },
      { label: 'পাড়া মহল্লার ক্রিকেট', slug: 'local-cricket' }
    ],
  },
  { label: 'ইন্টারভিউ', slug: 'interview' },
  { label: 'ফিচার', slug: 'feature' },
  { label: 'খেলার দেশ বিশেষ', slug: 'special' },
  { label: 'অতিথি কলাম', slug: 'guest-column' },
  {
    label: 'অন্যান্য',
    slug: 'other',
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
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

  // Scroll active item into view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [pathname]);

  // Close on click outside or scroll
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }
    function handleScroll() {
      closeDropdown();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
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
                    className="flex-1 px-4 py-3 flex items-center relative"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 17,
                      fontWeight: active ? 700 : 500,
                      color: active ? 'var(--live-red)' : 'var(--ink)',
                    }}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => { closeDropdown(); onNavigate?.(); }}
                  >
                    {item.label}
                    {active && <span className="absolute bottom-2 left-4 w-6 h-[3px] bg-[var(--live-red)] rounded-full" />}
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
                            fontFamily: "var(--font-body)",
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
      className="relative z-50 w-full scrollbar-none overflow-x-auto lg:overflow-visible"
      style={{ borderBottom: noBorder ? 'none' : '1.5px solid var(--ink)' }}
      aria-label="খেলার বিভাগ"
    >
      <ul className="flex flex-nowrap items-center lg:overflow-visible">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.slug);
          const href = item.slug === '' ? '/' : `/sport/${item.slug}`;
          const hasSubItems = !!item.subItems;
          const isOpen = openDropdown === item.slug;

          return (
            <li
              key={item.slug}
              className="relative flex-shrink-0"
              onMouseEnter={() => {
                if (window.innerWidth >= 1024) {
                  setOpenDropdown(item.slug);
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= 1024) {
                  setOpenDropdown(null);
                }
              }}
            >
              <div className="flex items-stretch">
                <Link
                  ref={active ? activeItemRef : undefined}
                  href={href}
                  lang="bn"
                  className="flex items-center px-1.5 py-2.5 whitespace-nowrap transition-colors duration-150 relative"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12.5,
                    fontWeight: 600,
                    backgroundColor: 'transparent',
                    color: active ? 'var(--live-red)' : 'var(--ink)',
                  }}
                  aria-current={active ? 'page' : undefined}
                  onClick={closeDropdown}
                >
                  {item.label}
                  {active && <span className="absolute bottom-0.5 left-1.5 right-1.5 h-[2.5px] bg-[var(--live-red)] rounded-full" />}
                </Link>

                {/* Dropdown chevron button (mobile/desktop: click to toggle) */}
                {hasSubItems && (
                  <button
                    onClick={(e) => { e.preventDefault(); setOpenDropdown(isOpen ? null : item.slug); }}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-label={`${item.label} সাব-মেন্যু`}
                    className="flex items-center justify-center h-[32px] px-1.5 cursor-pointer -mr-1.5"
                    style={{
                      color: active ? 'var(--live-red)' : 'var(--ink-muted)',
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
                  className={`hidden lg:block absolute left-0 top-full pt-1 z-[60] min-w-[210px] transition-all duration-150 ${
                    isOpen 
                      ? 'opacity-100 visible pointer-events-auto' 
                      : 'opacity-0 invisible pointer-events-none'
                  }`}
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
                            fontFamily: "var(--font-body)",
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
                            fontFamily: "var(--font-body)",
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
