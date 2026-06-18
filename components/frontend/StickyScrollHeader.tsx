'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StickyScrollHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setOpenDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll active category into view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [pathname]);

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
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(226, 226, 226, 0.8)',
        borderRadius: '9999px',
        transform: isVisible ? 'translateY(0)' : 'translateY(-120%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 py-1.5 flex items-center justify-between">
        {/* Left Brand Identity: text wordmark */}
        <Link href="/" className="flex items-center flex-shrink-0" aria-label="খেলারদেশ হোমপেজ">
          <img src="/images/khelardesh_logo.png" alt="খেলারদেশ" style={{ height: 20, objectFit: 'contain' }} />
        </Link>

        {/* Center: Navigation Menu */}
        <div className="relative flex-1 ml-4 overflow-hidden lg:overflow-visible flex items-center pr-2">
          <nav 
            className={`scrollbar-none ${openDropdown ? 'overflow-visible' : 'overflow-x-auto'} lg:overflow-visible flex items-center gap-x-6 justify-start lg:justify-end flex-1`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {navItems.map((item, idx) => {
              const href = item.slug === '' ? '/' : `/sport/${item.slug}`;
              const isActive = item.slug === '' 
                ? pathname === '/' 
                : pathname === `/sport/${item.slug}` || (!!item.subItems && item.subItems.some(sub => pathname === `/sport/${sub.slug}`));
              const isOpen = openDropdown === item.slug;

              if (item.subItems) {
                return (
                  <div key={idx} className="relative group py-2">
                    <Link
                      ref={isActive ? activeItemRef : undefined}
                      href={href}
                      onClick={(e) => {
                        if (window.innerWidth < 1024) {
                          e.preventDefault();
                          setOpenDropdown(openDropdown === item.slug ? null : item.slug);
                        }
                      }}
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
                    <div className={`absolute left-0 top-[100%] ${isOpen ? 'block' : 'hidden lg:group-hover:block'} bg-[var(--bg-surface)] border border-[var(--ink-border)] shadow-md rounded-[3px] py-1 min-w-[150px] z-50 dropdown-bridge`}>

                      {item.subItems.map((sub, sIdx) => {
                        const isSubActive = pathname === `/sport/${sub.slug}`;
                        return (
                          <Link
                            key={sIdx}
                            ref={isSubActive ? activeItemRef : undefined}
                            href={`/sport/${sub.slug}`}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-2 text-xs font-bold transition-colors"
                            style={{ 
                              fontFamily: 'var(--font-body)',
                              color: isSubActive ? 'var(--live-red)' : 'var(--ink)',
                              backgroundColor: isSubActive ? 'var(--ink-ghost)' : 'transparent'
                            }}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={idx}
                  ref={isActive ? activeItemRef : undefined}
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
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

