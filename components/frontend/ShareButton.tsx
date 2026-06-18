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
          className="absolute bottom-full mb-2 right-0 text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded shadow-sm whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-200"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          লিঙ্ক কপি করা হয়েছে!
        </span>
      )}
      <button
        onClick={handleShare}
        aria-label="শেয়ার করুন"
        title="শেয়ার করুন"
        className="w-8 h-8 rounded-full flex items-center justify-center border hover:bg-[var(--ink-ghost)] transition-colors cursor-pointer text-[var(--ink-muted)] hover:text-[var(--ink)] flex-shrink-0"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--ink-border)',
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 00-6 6v3" />
        </svg>
      </button>
    </div>
  );
}
