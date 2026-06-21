'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HomeNav() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleScroll() {
      setOpenDropdown(null);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { label: 'মাঠ', slug: '' },
    {
      label: 'ফুটবল',
      slug: 'football',
      subItems: [
        { label: 'দেশের ফুটবল', slug: 'bd-football' },
        { label: 'বিদেশের ফুটবল', slug: 'international-football' },
        { label: 'পাড়া মহল্লার ফুটবল', slug: 'club-football' }
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
    { label: 'এই দিনে', slug: 'on-this-day' },
    { 
      label: 'অন্যান্য', 
      slug: 'other',
      subItems: [
        { label: 'বাস্কেটবল', slug: 'basketball' },
        { label: 'রাগবি', slug: 'rugby' },
        { label: 'ফর্মুলা ওয়ান', slug: 'f1' },
        { label: 'টেবিল টেনিস', slug: 'table-tennis' },
        { label: 'গল্ফ', slug: 'golf' },
      ]
    }
  ];

  return (
    <div className="border-b border-[#e2e2e2] pb-1.5" ref={navRef}>
      <div className="flex flex-wrap justify-center items-center gap-x-3.5 md:gap-x-5 lg:gap-x-8 gap-y-2.5 text-xs md:text-[13px] font-semibold">
        {navItems.map((item, idx) => {
          const href = item.slug === '' ? '/' : `/sport/${item.slug}`;
          const isActive = item.slug === '' 
            ? pathname === '/' 
            : pathname === `/sport/${item.slug}` || (!!item.subItems && item.subItems.some(sub => pathname === `/sport/${sub.slug}`));
          const isOpen = openDropdown === item.slug;

          if (item.subItems) {
            return (
              <div
                key={idx}
                className="relative h-full flex items-center"
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
                <Link
                  href={href}
                  onClick={() => setOpenDropdown(null)}
                  className="cursor-pointer hover:underline flex items-center relative py-1"
                  style={{ color: isActive ? 'var(--live-red)' : '#121212' }}
                >
                  {item.label}
                  {isActive && <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[var(--live-red)] rounded-full" />}
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDropdown(isOpen ? null : item.slug);
                  }}
                  className="flex items-center justify-center h-[32px] px-1.5 cursor-pointer -mr-1.5"
                  aria-label={`${item.label} সাব-মেন্যু`}
                  aria-expanded={isOpen}
                >
                  <svg
                    width="10" height="10" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      color: isActive ? 'var(--live-red)' : '#121212',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className={`absolute left-0 top-[100%] ${isOpen ? 'block' : 'hidden'} bg-[#ffffff] border border-[#e2e2e2] shadow-md rounded-[3px] py-1 min-w-[150px] z-50 dropdown-bridge`}>
                  {item.subItems.map((sub, sIdx) => {
                    const isSubActive = pathname === `/sport/${sub.slug}`;
                    return (
                      <Link
                        key={sIdx}
                        href={`/sport/${sub.slug}`}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2 text-xs font-bold hover:bg-gray-100 transition-colors"
                        style={{ color: isSubActive ? 'var(--live-red)' : '#121212' }}
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
            <div key={idx} className="flex items-center">
              <Link
                href={href}
                className="cursor-pointer hover:underline relative py-1"
                style={{ color: isActive ? 'var(--live-red)' : '#121212' }}
              >
                {item.label}
                {isActive && <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[var(--live-red)] rounded-full" />}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
