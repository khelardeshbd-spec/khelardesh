'use client';

import React, { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error copying link:', err);
      }
    }
  };

  return (
    <div className="relative flex items-center">
      {copied && (
        <span 
          className="absolute right-full mr-2 text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded shadow-sm whitespace-nowrap animate-in fade-in slide-in-from-right-1 duration-200"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          লিঙ্ক কপি করা হয়েছে!
        </span>
      )}
      <button
        onClick={handleShare}
        aria-label="খবরটি শেয়ার করুন"
        className="w-9 h-9 rounded-full flex items-center justify-center border hover:bg-[var(--ink-ghost)] transition-colors cursor-pointer"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--ink-border)',
          color: 'var(--ink)'
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l5.26-2.63m0 7.776l-5.26-2.63m8 2.812a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm-8.25-4a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25-4a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
        </svg>
      </button>
    </div>
  );
}
