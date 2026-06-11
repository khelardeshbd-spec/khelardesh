'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { motion } from 'framer-motion';

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
      className="md:hidden flex fixed bottom-0 left-0 right-0"
      style={{
        justifyContent: 'center',
        alignItems: 'flex-end',
        transform: navVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.25s ease',
        zIndex: 50,
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 0,
          backgroundColor: 'var(--bg-page)',
          border: '0.5px solid var(--ink-border)',
          borderRadius: 100,
          padding: '6px 8px',
          marginBottom: 8,
        }}
      >
        {NAV_ITEMS.map(({ labelBn, href, icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <motion.div key={href} whileTap={{ scale: 0.88 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Link
                href={href}
                className="flex flex-col items-center justify-center gap-0.5"
                aria-current={isActive ? 'page' : undefined}
                style={{
                  color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
                  minHeight: 44,
                  padding: '7px 16px',
                  backgroundColor: isActive ? 'var(--ink-ghost)' : 'transparent',
                  borderRadius: 100,
                }}
              >
                {icon(isActive)}
                <span
                  lang="bn"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: '0.04em',
                    color: 'inherit',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {labelBn}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </nav>
  );
}
