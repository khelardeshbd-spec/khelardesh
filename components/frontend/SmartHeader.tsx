'use client';

import { useState, useEffect, useRef } from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { supabase } from '@/lib/supabase';
import Masthead from './Masthead';
import NavStrip, { NAV_ITEMS } from './NavStrip';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  deck: string;
}

/** SVG Search icon */
function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  );
}

/** SVG Hamburger icon */
function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

/** SVG Close icon */
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * SmartHeader — Section 7 / 8
 * Desktop: static topbar with search overlay
 * Mobile: slim bar (logo + search + hamburger) + horizontal NavStrip + slide-in drawer
 */
export default function SmartHeader() {
  const navVisible = useScrollDirection();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Track scroll for backdrop blur
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  // Close drawer on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsDrawerOpen(false); setIsSearchOpen(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setResults([]); return; }
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('Article')
          .select('id, slug, headline, headlineBn, deck')
          .or(`headline.ilike.%${searchQuery}%,headlineBn.ilike.%${searchQuery}%,deck.ilike.%${searchQuery}%`)
          .order('publishedAt', { ascending: false })
          .limit(6);
        if (data) setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside to close search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeSearch = () => { setIsSearchOpen(false); setSearchQuery(''); setResults([]); };
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header
        id="smart-header"
        className="sticky lg:absolute top-0 lg:left-0 lg:right-0 lg:w-full lg:z-45 transition-all duration-250 max-lg:[transform:var(--nav-transform)]"
        style={{
          '--nav-transform': navVisible ? 'translateY(0)' : 'translateY(-100%)',
          backgroundColor: scrolled
            ? 'color-mix(in srgb, var(--bg-page) 92%, transparent)'
            : 'var(--bg-page)',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--ink-border)' : 'none',
          zIndex: 50,
        } as React.CSSProperties}
      >
        {/* ── DESKTOP TOPBAR ── */}
        <div
          className="hidden lg:grid max-w-[1440px] mx-auto px-6 gap-6 pt-3"
          style={{ gridTemplateColumns: '200px 1fr 220px' }}
        >
          {/* Left spacer */}
          <div className="flex items-center gap-3 border-b border-[var(--ink-border)] pb-2">
            <Link href="/" aria-label="খেলারদেশ নীড়পাতা">
              <img src="/logo.png" alt="খেলারদেশ" style={{ height: 36, objectFit: 'contain', filter: 'var(--logo-filter, none)' }} />
            </Link>
          </div>

          {/* Middle: NavStrip or Search Input */}
          <div className="flex items-center justify-center border-b border-[var(--ink-border)] pb-2 relative" ref={searchRef}>
            {!isSearchOpen ? (
              <div className="w-full max-w-2xl">
                <NavStrip noBorder={true} />
              </div>
            ) : (
              <div className="w-full max-w-2xl relative flex items-center bg-[var(--bg-surface)] border border-[var(--ink)] px-3 py-1.5 gap-2" style={{ borderRadius: 2 }}>
                <SearchIcon size={14} />
                <input
                  type="text"
                  placeholder="খবর খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent outline-none text-[var(--ink)] text-sm"
                  style={{ fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif", fontSize: 14 }}
                  lang="bn"
                />
                {loading && (
                  <span style={{ fontFamily: "'Kalpurush', sans-serif", fontSize: 11, color: 'var(--ink-muted)', flexShrink: 0 }}>
                    খোঁজা হচ্ছে...
                  </span>
                )}
                <button
                  onClick={closeSearch}
                  className="text-[var(--ink)] flex-shrink-0 hover:opacity-70 transition-opacity"
                  aria-label="খোঁজ বন্ধ করুন"
                >
                  <CloseIcon />
                </button>

                {/* Search suggestions dropdown */}
                {searchQuery.trim() && (
                  <div
                    className="absolute left-0 right-0 top-full mt-2 border border-[var(--ink-border)] shadow-lg z-50 flex flex-col divide-y divide-[var(--ink-border)] overflow-hidden"
                    style={{ borderRadius: 2, backgroundColor: 'var(--bg-surface)' }}
                  >
                    {results.length > 0 ? (
                      results.map((article) => {
                        const headline = article.headlineBn || article.headline;
                        return (
                          <Link
                            key={article.id}
                            href={`/article/${article.slug}`}
                            onClick={closeSearch}
                            className="p-3 hover:bg-[var(--ink-ghost)] transition-colors flex flex-col text-left"
                            style={{ color: 'var(--ink)' }}
                          >
                            <span lang="bn" style={{ fontFamily: "'Kalpurush', sans-serif", fontWeight: 600, fontSize: 14 }} className="line-clamp-1">
                              {headline}
                            </span>
                            <span lang="bn" style={{ fontFamily: "'Kalpurush', sans-serif", fontSize: 11, color: 'var(--ink-muted)' }} className="line-clamp-1 mt-0.5">
                              {article.deck}
                            </span>
                          </Link>
                        );
                      })
                    ) : (
                      !loading && (
                        <div className="p-3 text-sm text-[var(--ink-muted)]" style={{ fontFamily: "'Kalpurush', sans-serif" }} lang="bn">
                          কোনো খবর পাওয়া যায়নি।
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: ThemeToggle + Saved + Search button */}
          <div className="flex items-center justify-end gap-3 border-b border-[var(--ink-border)] pb-2">
            <ThemeToggle />

            {/* Desktop Saved Folder Button */}
            <Link
              href="/saved"
              aria-label="সেভ করা খবর"
              className="flex items-center justify-center hover:opacity-75 transition-opacity"
              style={{ color: 'var(--ink)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </Link>

            <button
              onClick={() => { setIsSearchOpen(!isSearchOpen); setSearchQuery(''); }}
              aria-label="খবর খুঁজুন"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                backgroundColor: 'var(--bg-surface)',
                border: '0.5px solid var(--ink-border)',
                borderRadius: 20, padding: '6px 14px',
                color: 'var(--ink-muted)', cursor: 'pointer',
                fontSize: 12,
                fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif"
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
              খবর খুঁজুন…
            </button>
          </div>
        </div>

        {/* ── MOBILE TOP BAR ── */}
        <div className="flex lg:hidden items-center justify-between px-3 py-2 bg-transparent" style={{ minHeight: 50 }}>
          {/* Logo */}
          <Link href="/" aria-label="খেলারদেশ — নীড়পাতা">
            <img
              src="/logo.png"
              alt="খেলারদেশ"
              style={{ height: '40px', objectFit: 'contain', filter: 'var(--logo-filter, none)' }}
            />
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="খবর খুঁজুন"
              className="flex items-center justify-center hover:opacity-75 transition-opacity"
              style={{ color: 'var(--ink)', minWidth: 40, minHeight: 40 }}
            >
              <SearchIcon />
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="মেন্যু খুলুন"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-drawer"
              className="flex items-center justify-center hover:opacity-75 transition-opacity"
              style={{ color: 'var(--ink)', minWidth: 40, minHeight: 40 }}
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>

        {/* Mobile search bar (expands below top bar) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="lg:hidden px-3 pb-3 relative"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              ref={searchRef}
            >
              <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--ink)] px-3 py-2 gap-2" style={{ borderRadius: 2 }}>
                <SearchIcon size={14} />
              <input
                type="text"
                placeholder="খবর খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent outline-none text-[var(--ink)]"
                style={{ fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif", fontSize: 15 }}
                lang="bn"
              />
              <button onClick={closeSearch} aria-label="খোঁজ বন্ধ করুন" style={{ color: 'var(--ink)' }}>
                <CloseIcon />
              </button>
            </div>
            {searchQuery.trim() && (
              <div
                className="absolute left-3 right-3 top-full border border-[var(--ink-border)] shadow-xl z-50 flex flex-col divide-y divide-[var(--ink-border)] overflow-hidden"
                style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 2 }}
              >
                {results.length > 0 ? results.map((article) => {
                  const headline = article.headlineBn || article.headline;
                  return (
                    <Link
                      key={article.id}
                      href={`/article/${article.slug}`}
                      onClick={closeSearch}
                      className="p-3 hover:bg-[var(--ink-ghost)] transition-colors"
                      style={{ color: 'var(--ink)' }}
                    >
                      <span lang="bn" style={{ fontFamily: "'Kalpurush', sans-serif", fontWeight: 600, fontSize: 14 }} className="line-clamp-2 block">
                        {headline}
                      </span>
                    </Link>
                  );
                }) : !loading && (
                  <div className="p-3 text-sm" style={{ fontFamily: "'Kalpurush', sans-serif", color: 'var(--ink-muted)' }} lang="bn">
                    কোনো খবর পাওয়া যায়নি।
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
        </AnimatePresence>

        {/* Mobile horizontal NavStrip */}
        <div className="lg:hidden">
          <NavStrip />
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {/* Backdrop */}
      <div
        className="lg:hidden fixed inset-0 z-[70] transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: isDrawerOpen ? 1 : 0,
          pointerEvents: isDrawerOpen ? 'auto' : 'none',
        }}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="নেভিগেশন মেন্যু"
        className="lg:hidden fixed top-0 right-0 bottom-0 z-[80] flex flex-col overflow-hidden"
        style={{
          width: 'min(320px, 88vw)',
          backgroundColor: 'var(--bg-page)',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.2)',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--ink-border)] flex-shrink-0">
          <span
            lang="bn"
            style={{
              fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--ink)',
            }}
          >
            সব বিভাগ
          </span>
          <button
            onClick={closeDrawer}
            aria-label="মেন্যু বন্ধ করুন"
            className="flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{ color: 'var(--ink)', minWidth: 40, minHeight: 40 }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer nav content */}
        <div className="flex-1 overflow-y-auto">
          <NavStrip vertical={true} onNavigate={closeDrawer} />
        </div>

        {/* Drawer footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-[var(--ink-border)]">
          <p
            lang="bn"
            style={{
              fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
              fontSize: 11,
              color: 'var(--ink-muted)',
              textAlign: 'center',
            }}
          >
            © ২০২৬ খেলারদেশ
          </p>
        </div>
      </div>
    </>
  );
}
