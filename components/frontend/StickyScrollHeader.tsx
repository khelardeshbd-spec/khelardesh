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
    { label: 'ফুটবল', slug: 'football' },
    { label: 'বাংলাদেশের ফুটবল', slug: 'bd-football' },
    { label: 'ক্রিকেট', slug: 'cricket' },
    { label: 'বাংলাদেশের ক্রিকেট', slug: 'bd-cricket' },
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
        {/* Left Brand Identity: Very clean & small logo/text link */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span 
            style={{ 
              fontFamily: 'var(--font-headline)', 
              fontWeight: 'bold', 
              fontSize: '1.2rem',
              color: 'var(--live-red)' 
            }}
          >
            খেলারদেশ
          </span>
        </Link>

        {/* Center: Navigation Menu (Scrollable on mobile) */}
        <nav 
          className="scrollbar-none overflow-x-auto flex items-center gap-x-6 gap-y-1 ml-4 justify-end flex-1"
          style={{ whiteSpace: 'nowrap' }}
        >
          {navItems.map((item, idx) => {
            const href = item.slug === '' ? '/' : `/sport/${item.slug}`;
            const isActive = item.slug === '' ? pathname === '/' : pathname === `/sport/${item.slug}`;

            return (
              <Link
                key={idx}
                href={href}
                className="text-[13px] font-bold tracking-wide transition-colors duration-150 hover:underline"
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
