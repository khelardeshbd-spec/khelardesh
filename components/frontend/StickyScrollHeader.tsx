'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StickyScrollHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'মাঠ', slug: '' },
    { 
      label: 'ফুটবল', 
      slug: 'football',
      subItems: [
        { label: 'দেশের ফুটবল', slug: 'bd-football' },
        { label: 'বিদেশের ফুটবল', slug: 'international-football' },
        { label: 'পাড়া মহল্লার ফুটবল', slug: 'club-football' } // Mapping club-football as neighborhood sport
      ]
    },
    { 
      label: 'ক্রিকেট', 
      slug: 'cricket',
      subItems: [
        { label: 'দেশের ক্রিকেট', slug: 'bd-cricket' },
        { label: 'বিদেশের ক্রিকেট', slug: 'international-cricket' },
        { label: 'পাড়া মহল্লার ক্রিকেট', slug: 'local-cricket' }
      ]
    },
    { label: 'ইন্টারভিউ', slug: 'interview' },
    { label: 'ফিচার', slug: 'feature' },
    { label: 'খেলার দেশ বিশেষ', slug: 'special' },
    { label: 'অতিথি কলাম', slug: 'guest-column' },
    { label: 'অন্যান্য', slug: 'others' }
  ];


  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--ink-border)',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-2.5 flex items-center justify-between">
        {/* Left Brand Identity: text wordmark */}
        <Link href="/" className="flex items-center flex-shrink-0" aria-label="খেলারদেশ নীড়পাতা">
          <span
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.15rem',
              fontWeight: 400,
              color: '#1a5c2e',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            খেলারদেশ
          </span>
        </Link>

        {/* Center: Navigation Menu */}
        <nav 
          className="scrollbar-none overflow-x-auto flex items-center gap-x-6 ml-4 justify-end flex-1"
          style={{ whiteSpace: 'nowrap' }}
        >
          {navItems.map((item, idx) => {
            const href = item.slug === '' ? '/' : `/sport/${item.slug}`;
            const isActive = item.slug === '' ? pathname === '/' : pathname === `/sport/${item.slug}`;

            if (item.subItems) {
              return (
                <div key={idx} className="relative group py-2">
                  <Link
                    href={href}
                    className="text-[13px] font-bold tracking-wide transition-colors duration-150 hover:underline flex items-center gap-1"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: isActive ? 'var(--live-red)' : 'var(--ink)',
                    }}
                  >
                    {item.label}
                    <span className="text-[9px]">▼</span>
                  </Link>
                  
                  {/* Dropdown menu */}
                  <div className="absolute left-0 mt-1 hidden group-hover:block bg-[var(--bg-surface)] border border-[var(--ink-border)] shadow-md rounded-[3px] py-1 min-w-[150px] z-50">
                    {item.subItems.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        href={`/sport/${sub.slug}`}
                        className="block px-4 py-2 text-xs font-bold text-[var(--ink)] hover:bg-[var(--ink-ghost)] transition-colors"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={idx}
                href={href}
                className="text-[13px] font-bold tracking-wide transition-colors duration-150 hover:underline py-2"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: isActive ? 'var(--live-red)' : 'var(--ink)',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

