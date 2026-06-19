'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface Article {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  deck: string;
  sport: string;
  mediaType: string;
  mediaUrl: string;
  byline: string;
  publishedAt: Date | string;
}

export default function BookmarkButton({ 
  article, 
  variant = 'default' 
}: { 
  article: Article; 
  variant?: 'default' | 'circle';
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('khelardesh_saved') || '[]');
      setIsSaved(saved.some((a: Article) => a.id === article.id));
    } catch (err) {
      console.error(err);
    }
  }, [article.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation if inside a Link
    
    if (!session) {
      setShowLoginModal(true);
      return;
    }

    try {
      let saved = JSON.parse(localStorage.getItem('khelardesh_saved') || '[]');
      if (isSaved) {
        saved = saved.filter((a: Article) => a.id !== article.id);
      } else {
        // ensure we don't save duplicate and keep it clean
        saved.push(article);
      }
      localStorage.setItem('khelardesh_saved', JSON.stringify(saved));
      setIsSaved(!isSaved);
      // Optional: dispatch custom event so other components could listen
      window.dispatchEvent(new Event('khelardesh_saved_changed'));
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  const buttonClasses = variant === 'circle'
    ? "w-8 h-8 rounded-full flex items-center justify-center border hover:bg-[var(--ink-ghost)] transition-colors cursor-pointer text-[var(--ink-muted)] hover:text-[var(--ink)] flex-shrink-0"
    : "text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors p-1";

  const buttonStyles = variant === 'circle'
    ? {
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--ink-border)',
      }
    : undefined;

  return (
    <>
      <button
        onClick={toggleBookmark}
        aria-label={isSaved ? "সংরক্ষণ বাতিল করুন" : "সংরক্ষণ করুন"}
        title={isSaved ? "সংরক্ষণ বাতিল করুন" : "সংরক্ষণ করুন"}
        className={buttonClasses}
        style={buttonStyles}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Modern Dialog/Modal Popup for Login Request */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
          onClick={() => setShowLoginModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative text-center animate-in zoom-in-95 duration-200 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer focus:outline-none"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Bookmark Icon circle wrapper */}
            <div className="w-12 h-12 bg-red-50 text-[#d33f3f] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            {/* Content text */}
            <h3 className="text-base font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
              সংরক্ষণ করতে লগইন করুন
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              খবরটি বুকমার্ক করে পরে পড়তে আপনার গুগল অ্যাকাউন্ট দিয়ে লগইন করুন।
            </p>

            {/* Action buttons list */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  signIn('google');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#d33f3f] hover:bg-[#b83232] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                গুগল দিয়ে লগইন করুন
              </button>
              
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-2.5 px-4 border border-gray-200 hover:bg-gray-50 text-gray-500 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
