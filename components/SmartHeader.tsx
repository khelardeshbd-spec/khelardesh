'use client';

import { useScrollDirection } from '@/hooks/useScrollDirection';
import Masthead from './Masthead';
import NavStrip from './NavStrip';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

/**
 * SmartHeader — Section 7 / 8
 * Wraps Masthead + NavStrip with disappearing scroll behavior
 * Desktop: 44px total; Mobile: 36px header
 */
export default function SmartHeader() {
  const navVisible = useScrollDirection();

  return (
    <header
      id="smart-header"
      style={{
        transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.25s ease',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--ink-border)',
      }}
    >
      {/* Top bar: masthead word + theme toggle on same row (mobile) */}
      {/* Desktop: stacked masthead then nav */}
      <div className="hidden lg:block">
        {/* Desktop: left-aligned logo bar */}
        <div className="relative flex items-center justify-between px-6 pb-2">
          {/* Left: masthead */}
          <div className="flex-1 flex justify-start">
            <Masthead />
          </div>
          {/* Right: theme toggle + search icon */}
          <div className="flex items-center gap-3" style={{ justifyContent: 'flex-end', alignSelf: 'flex-start', marginTop: '24px' }}>
            <ThemeToggle />
            <Link
              href="/search"
              aria-label="Search"
              style={{ color: 'var(--ink)', fontSize: 16, lineHeight: 1 }}
            >
              🔍
            </Link>
          </div>
        </div>
        <NavStrip />
      </div>

      {/* Mobile: slim single row */}
      <div className="flex lg:hidden items-center justify-between px-3 py-1" style={{ minHeight: 46 }}>
        {/* Hamburger / dot placeholder */}
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: 'var(--ink)'
            }}
          />
          <img
            src="/logo.png"
            alt="খেলারদেশ"
            style={{
              height: '42px',
              objectFit: 'contain',
              filter: 'var(--logo-filter, none)'
            }}
          />
        </div>
        <ThemeToggle />
      </div>

      {/* Mobile nav strip */}
      <div className="lg:hidden">
        <NavStrip />
      </div>
    </header>
  );
}
