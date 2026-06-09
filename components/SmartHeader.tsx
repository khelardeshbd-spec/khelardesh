'use client';

import { useScrollDirection } from '@/hooks/useScrollDirection';
import Masthead from './Masthead';
import NavStrip from './NavStrip';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

/**
 * SmartHeader — Section 7 / 8
 * Wraps Masthead + NavStrip with disappearing scroll behavior on mobile
 * Desktop: Static topbar starting from where the live score column ends
 */
export default function SmartHeader() {
  const navVisible = useScrollDirection();

  return (
    <header
      id="smart-header"
      className="sticky lg:absolute top-0 lg:left-0 lg:right-0 lg:w-full lg:z-40 border-b border-[var(--ink-border)] bg-[var(--bg-page)] lg:bg-transparent lg:border-none transition-transform duration-250 max-lg:[transform:var(--nav-transform)]"
      style={{
        '--nav-transform': navVisible ? 'translateY(0)' : 'translateY(-100%)',
      } as React.CSSProperties}
    >
      {/* ── DESKTOP TOPBAR ── */}
      <div 
        className="hidden lg:grid max-w-[1440px] mx-auto px-6 gap-6 pt-4"
        style={{ gridTemplateColumns: '18fr 64fr 18fr' }}
      >
        {/* Left column spacer (18%): Empty because left column has its own header/logo */}
        <div />

        {/* Middle column (64%): Centered category navigation strip */}
        <div className="flex items-center justify-center border-b border-[var(--ink-border)] pb-2">
          <div className="w-full max-w-2xl">
            <NavStrip noBorder={true} />
          </div>
        </div>

        {/* Right column (18%): Theme Toggle & Search */}
        <div className="flex items-center justify-end gap-4 border-b border-[var(--ink-border)] pb-2">
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

      {/* Mobile: slim single row */}
      <div className="flex lg:hidden items-center justify-between px-3 py-1 bg-[var(--bg-page)]" style={{ minHeight: 46 }}>
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

