'use client';

import { useState, useEffect } from 'react';
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

  const loadSaved = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('khelardesh_saved') || '[]');
      setSavedArticles(saved);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadSaved();
    window.addEventListener('khelardesh_saved_changed', loadSaved);
    return () => window.removeEventListener('khelardesh_saved_changed', loadSaved);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="max-w-[800px] mx-auto px-4 lg:px-6 py-8 pb-12">
        <div className="hidden lg:block mb-8">
          <Masthead />
        </div>
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
    </div>
  );
}
