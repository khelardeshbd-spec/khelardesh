'use client';

import { useState } from 'react';
import Link from 'next/link';
import ArticleCard from './ArticleCard';

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

interface Props {
  initialArticles: Article[];
  sport: string;
  sportsToQuery: string[];
  sportBn: string;
}

export default function CategoryFeedWithLoadMore({ initialArticles, sport, sportsToQuery, sportBn }: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length >= 20);

  const loadMoreArticles = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const sportsParam = sportsToQuery.join(',');
      const res = await fetch(`/api/articles?sport=${encodeURIComponent(sportsParam)}&page=${nextPage}&pageSize=20`);
      
      if (!res.ok) throw new Error('Failed to load');
      
      const data = await res.json() as any;
      const newArticles = data.articles ?? [];

      if (newArticles.length === 0 || newArticles.length < 20) {
        setHasMore(false);
      }

      setArticles(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        const filtered = newArticles.filter((a: Article) => !existingIds.has(a.id));
        return [...prev, ...filtered];
      });

      setPage(nextPage);
    } catch (err) {
      console.error('Error loading more articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Articles List */}
      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {articles.length === 0 && (
        <div className="text-center py-12 text-[var(--ink-muted)]" style={{ fontFamily: 'var(--font-body)' }}>
          এই বিভাগে কোনো খবর পাওয়া যায়নি।
        </div>
      )}

      {/* Load More Button & Archive Promo */}
      <div className="mt-8 pt-6 border-t border-[var(--ink-border)] flex flex-col items-center gap-4">
        {hasMore ? (
          <button
            type="button"
            onClick={loadMoreArticles}
            disabled={loading}
            className="px-6 py-3 bg-[var(--bg-surface)] hover:bg-[var(--ink)] hover:text-[var(--bg-page)] text-[var(--ink)] font-bold text-sm rounded-full border border-[var(--ink-border)] transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>আরও খবর লোড হচ্ছে...</span>
              </>
            ) : (
              <span>আরও খবর দেখুন ↓</span>
            )}
          </button>
        ) : (
          articles.length > 0 && (
            <p className="text-xs text-[var(--ink-muted)] italic" style={{ fontFamily: 'var(--font-body)' }}>
              এই বিভাগের সব সাম্প্রতিক খবর প্রদর্শিত হয়েছে।
            </p>
          )
        )}

        {/* Dedicated Archive banner */}
        <div className="w-full mt-2 p-4 rounded-xl border border-[var(--ink-border)] bg-[var(--bg-surface)] flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h4 className="text-sm font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-body)' }}>
              {sportBn}-এর পুরোনো বা নির্দিষ্ট দিনের সংবাদ খুঁজছেন?
            </h4>
            <p className="text-xs text-[var(--ink-muted)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
              তারিখ অনুযায়ী সমস্ত সংবাদ দেখতে খেলারদেশ আর্কাইভ ব্যবহার করুন।
            </p>
          </div>
          <Link
            href={`/archive?sport=${encodeURIComponent(sport)}`}
            className="px-4 py-2 bg-[#d33f3f] text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors flex-shrink-0"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {sportBn} আর্কাইভ দেখুন →
          </Link>
        </div>
      </div>
    </div>
  );
}
