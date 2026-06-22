'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

interface ProfileMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleMenu}
        className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center overflow-hidden transition-all duration-200 cursor-pointer shadow-sm focus:outline-none"
        aria-label="ইউজার মেনু"
      >
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-white border border-gray-150 shadow-lg py-2 z-[999] origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* User Account Details (If logged in) */}
          {user ? (
            <div className="px-4 py-2 border-b border-gray-100 text-left">
              <p className="text-xs font-bold text-gray-800 truncate">{user.name || 'ব্যবহারকারী'}</p>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</p>
            </div>
          ) : (
            <div className="px-4 py-2 border-b border-gray-100 text-left">
              <p className="text-xs font-bold text-gray-800">স্বাগতম</p>
              <p className="text-[10px] text-gray-400 mt-0.5">খেলারদেশে যোগ দিন</p>
            </div>
          )}

          {/* Menu Items */}
          <div className="py-1">
            {/* Login / Logout Options */}
            {user ? (
              <button
                onClick={() => { setIsOpen(false); signOut(); }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                লগআউট
              </button>
            ) : (
              <button
                onClick={() => { setIsOpen(false); signIn('google'); }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3H3m12 0l3-3m0 0l3 3m-3-3v12" />
                </svg>
                লগইন করুন
              </button>
            )}

            <div className="border-t border-gray-100 my-1" />

            {/* Saved Articles */}
            <Link
              href="/saved"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              সংরক্ষিত খবর
            </Link>

            {/* Notifications */}
            {user && (
              <Link
                href="/alerts"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                নোটিফিকেশন
              </Link>
            )}

            {/* Contact Us */}
            <a
              href="mailto:khelardeshbd@gmail.com"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 hover:bg-gray-50 flex items-start gap-2.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5 mt-0.5 text-gray-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">যোগাযোগ করুন</span>
                <span className="text-[9px] text-gray-400 mt-0.5 font-medium leading-[1.3]">বিজ্ঞাপন কিংবা ব্যবসায়িক তথ্যের জন্য</span>
              </div>
            </a>

          </div>
        </div>
      )}
    </div>
  );
}
