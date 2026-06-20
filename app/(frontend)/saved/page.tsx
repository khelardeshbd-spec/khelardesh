'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import ArticleCard from '@/components/frontend/ArticleCard';
import Masthead from '@/components/frontend/Masthead';

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

export default function SavedPage() {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: session, status } = useSession();

  const loadSaved = () => {
    if (!session) {
      setSavedArticles([]);
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem('khelardesh_saved') || '[]');
      setSavedArticles(saved);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
    window.addEventListener('khelardesh_saved_changed', loadSaved);
    return () => window.removeEventListener('khelardesh_saved_changed', loadSaved);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadSaved();
    }
  }, [mounted, session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowLoginModal(true);
    }
  }, [status]);

  if (!mounted || status === 'loading') return null;

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Back button / Breadcrumbs */}
      <div className="w-full max-w-[800px] mx-auto px-4 lg:px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--ink-ghost)] transition-colors bg-[var(--bg-surface)] border border-[var(--ink-border)] px-3 py-1.5 rounded-full"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            ফিরে যান
          </Link>
          
          <div 
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--ink-muted)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Link href="/" className="hover:text-[var(--ink)] transition-colors">
              মাঠ
            </Link>
            <span>/</span>
            <span className="text-[#1a5c2e]">
              সংরক্ষিত খবর
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 lg:px-6 py-4 pb-12">
        <h1
          lang="bn"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 900,
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: 'var(--ink)',
            borderBottom: '1.5px solid var(--ink)',
            paddingBottom: 8,
            marginBottom: 24,
          }}
        >
          সংরক্ষিত খবর
        </h1>

        {savedArticles.length > 0 ? (
          <div className="flex flex-col">
            {savedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[var(--ink-muted)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <p
              lang="bn"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
              }}
            >
              কোনো সংরক্ষিত নিবন্ধ নেই। পছন্দের নিবন্ধে বুকমার্ক আইকনে ক্লিক করুন।
            </p>
          </div>
        )}
      </div>

      {/* Modern Dialog/Modal Popup for Login Request */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
          onClick={() => setShowLoginModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative text-center animate-in zoom-in-95 duration-200 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ whiteSpace: 'normal' }}
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
              সংরক্ষিত খবর দেখতে লগইন করুন
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              আপনার বুকমার্ক করা খবরগুলো দেখতে এবং নতুন নিবন্ধ সংরক্ষণ করতে আপনার গুগল অ্যাকাউন্ট দিয়ে লগইন করুন।
            </p>

            {/* Action button */}
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
          </div>
        </div>
      )}
    </div>
  );
}
