'use client';

import { useState, useEffect, useRef } from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { supabase } from '@/lib/supabase';
import Masthead from './Masthead';
import NavStrip from './NavStrip';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

interface SearchResult {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  deck: string;
}

/**
 * SmartHeader — Section 7 / 8
 * Wraps Masthead + NavStrip with disappearing scroll behavior on mobile
 * Desktop: Static topbar starting from where the live score column ends
 */
export default function SmartHeader() {
  const navVisible = useScrollDirection();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search query fetching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('Article')
          .select('id, slug, headline, headlineBn, deck')
          .or(`headline.ilike.%${searchQuery}%,headlineBn.ilike.%${searchQuery}%,deck.ilike.%${searchQuery}%`)
          .order('publishedAt', { ascending: false })
          .limit(6);
        if (data) {
          setResults(data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside to close search suggestions
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

  return (
    <header
      id="smart-header"
      className="sticky lg:absolute top-0 lg:left-0 lg:right-0 lg:w-full lg:z-45 border-b border-[var(--ink-border)] bg-[var(--bg-page)] lg:bg-transparent lg:border-none transition-transform duration-250 max-lg:[transform:var(--nav-transform)]"
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

        {/* Middle column (64%): Centered category navigation strip or search input */}
        <div className="flex items-center justify-center border-b border-[var(--ink-border)] pb-2 relative" ref={searchRef}>
          {!isSearchOpen ? (
            <div className="w-full max-w-2xl">
              <NavStrip noBorder={true} />
            </div>
          ) : (
            <div className="w-full max-w-2xl relative flex items-center bg-[var(--bg-surface)] border border-[var(--ink)] rounded px-3 py-1.5 gap-2">
              <input
                type="text"
                placeholder="খবর খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent outline-none text-[var(--ink)] text-sm"
                style={{ fontFamily: "'Kalpurush', sans-serif" }}
              />
              {loading && (
                <span className="text-[10px] text-[var(--ink-muted)] flex-shrink-0" style={{ fontFamily: "'Kalpurush', sans-serif" }}>
                  খোঁজা হচ্ছে...
                </span>
              )}
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }} 
                className="text-[var(--ink)] text-sm font-semibold flex-shrink-0 hover:opacity-70"
              >
                ✕
              </button>

              {/* Suggestions Dropdown overlay */}
              {searchQuery.trim() && (
                <div 
                  className="absolute left-0 right-0 top-full mt-2 border border-[var(--ink-border)] shadow-lg z-50 flex flex-col divide-y divide-[var(--ink-border)] overflow-hidden"
                  style={{ borderRadius: '2px', backgroundColor: 'var(--bg-surface)' }}
                >
                  {results.length > 0 ? (
                    results.map((article) => {
                      const headline = article.headlineBn || article.headline;
                      return (
                        <Link
                          key={article.id}
                          href={`/article/${article.slug}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-3 hover:bg-[var(--ink-ghost)] transition-colors flex flex-col text-left"
                          style={{ color: 'var(--ink)' }}
                        >
                          <span className="font-semibold text-sm line-clamp-1">{headline}</span>
                          <span className="text-[11px] text-[var(--ink-muted)] line-clamp-1 mt-0.5">{article.deck}</span>
                        </Link>
                      );
                    })
                  ) : (
                    !loading && (
                      <div className="p-3 text-sm text-[var(--ink-muted)] text-left" style={{ fontFamily: "'Kalpurush', sans-serif" }}>
                        কোনো খবর পাওয়া যায়নি।
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column (18%): Theme Toggle & Search Button */}
        <div className="flex items-center justify-end gap-4 border-b border-[var(--ink-border)] pb-2">
          <ThemeToggle />
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setSearchQuery('');
            }}
            aria-label="Search"
            style={{ color: 'var(--ink)', fontSize: 16, lineHeight: 1 }}
            className="hover:opacity-75 transition-opacity"
          >
            {isSearchOpen ? '✕' : '🔍'}
          </button>
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

