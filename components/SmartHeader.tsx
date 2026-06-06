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
        {/* Desktop: full masthead centered */}
        <div className="relative flex items-end justify-between px-6 pt-2 pb-0">
          {/* Left placeholder for balance */}
          <div style={{ width: 80 }} />
          {/* Centered masthead */}
          <div className="flex-1 flex justify-center">
            <Masthead />
          </div>
          {/* Right: theme toggle + search icon */}
          <div className="flex items-center gap-3" style={{ width: 80, justifyContent: 'flex-end' }}>
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
      <div className="flex lg:hidden items-center justify-between px-3 py-1.5" style={{ minHeight: 36 }}>
        {/* Hamburger / dot placeholder */}
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: 'var(--ink)'
            }}
          />
          <span
            style={{
              fontFamily: "'Manowar Murshidabad', 'Noto Serif Bengali', serif",
              fontWeight: 900,
              fontSize: 24,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              lineHeight: 1,
            }}
          >
            খেলারদেশ
          </span>
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
