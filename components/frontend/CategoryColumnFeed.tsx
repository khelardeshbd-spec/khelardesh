'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { timeAgo, formatDatetime } from '@/lib/timeAgo';

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
  publishedAt: string;
}

const SPORT_LABELS: Record<string, string> = {
  football: 'ফুটবল',
  cricket: 'ক্রিকেট',
  basketball: 'বাস্কেটবল',
  tennis: 'টেনিস',
  f1: 'ফর্মুলা ওয়ান',
  rugby: 'রাগবি',
  athletics: 'অ্যাথলেটিক্স',
  interview: 'ইন্টারভিউ',
  feature: 'ফিচার',
  special: 'খেলার দেশ বিশেষ',
  'guest-column': 'অতিথি কলাম',
  'bd-football': 'বাংলাদেশের ফুটবল',
  'bd-cricket': 'বাংলাদেশের ক্রিকেট',
  'international-football': 'আন্তর্জাতিক ফুটবল',
  'club-football': 'ক্লাব ফুটবল',
  'world-cup-2026': 'ফুটবল বিশ্বকাপ ২০২৬',
  'table-tennis': 'টেবিল টেনিস',
  golf: 'গল্ফ',
  other: 'অন্যান্য',
};

interface Props {
  category: string;
  skipIds?: number[];
  initialPage?: number;
}

function ColumnArticleCard({ article }: { article: Article }) {
  const displayHeadline = article.headlineBn || article.headline;
  const time = timeAgo(article.publishedAt, 'bn');
  const exactTime = formatDatetime(article.publishedAt);

  return (
    <article
      style={{
        borderTop: '1px solid #e2e2e2',
        paddingTop: '1rem',
        marginTop: '1rem',
        animation: 'fadeInUp 0.35s ease both',
      }}
    >
      <Link
        href={`/article/${article.slug}`}
        className="group block hover:opacity-90 transition-opacity"
        aria-label={`পড়ুন: ${displayHeadline}`}
      >
        {/* Big image in column context */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            marginBottom: '0.75rem',
            border: '1px solid #e2e2e2',
            padding: '2px',
            backgroundColor: '#f5f5f5',
          }}
        >
          {article.mediaUrl ? (
            <img
              src={article.mediaUrl}
              alt={displayHeadline}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.3s ease',
              }}
              className="group-hover:scale-[1.02]"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e2e2' }} />
          )}
        </div>

        {/* Headline */}
        <h2
          lang="bn"
          style={{
            fontFamily: 'var(--font-headline)',
            fontWeight: 700,
            fontSize: '1.25rem',
            lineHeight: 1.25,
            color: '#121212',
            marginBottom: '0.5rem',
          }}
          className="group-hover:text-[#d33f3f] transition-colors"
        >
          {displayHeadline}
        </h2>

        {/* Deck */}
        {article.deck && (
          <p
            lang="bn"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 12,
              color: '#555555',
              lineHeight: 1.5,
              marginBottom: '0.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.deck}
          </p>
        )}

        {/* Byline + time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              color: '#888888',
            }}
            title={exactTime}
          >
            {article.byline} · {time}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 700,
              color: '#d33f3f',
            }}
          >
            আরো পড়ুন
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function CategoryColumnFeed({ category, skipIds = [], initialPage = 1 }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?sport=${category}&page=${page}`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      const incoming: Article[] = (data.articles ?? []).filter(
        (a: Article) => !skipIds.includes(a.id)
      );
      setArticles((prev) => {
        // De-duplicate by id
        const existingIds = new Set(prev.map((a) => a.id));
        return [...prev, ...incoming.filter((a) => !existingIds.has(a.id))];
      });
      const { pagination } = data;
      if (page >= pagination.totalPages) setHasMore(false);
      setPage((p) => p + 1);
    } catch {
      // silently fail — user can scroll down again to retry
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, skipIds, category]);

  // IntersectionObserver to trigger load when sentinel enters view
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  // Load first batch immediately
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%', marginTop: '1rem' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Article list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {articles.map((article) => (
          <ColumnArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #e2e2e2', paddingTop: '1rem' }}>
          {[1, 2].map((i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  backgroundColor: '#f0f0f0',
                  marginBottom: 12,
                  animation: 'pulse 1.4s ease-in-out infinite',
                }}
              />
              <div style={{ height: 14, backgroundColor: '#f0f0f0', marginBottom: 8, width: '35%', animation: 'pulse 1.4s ease-in-out infinite' }} />
              <div style={{ height: 18, backgroundColor: '#f0f0f0', marginBottom: 6, animation: 'pulse 1.4s ease-in-out infinite' }} />
              <div style={{ height: 18, backgroundColor: '#f0f0f0', marginBottom: 6, width: '80%', animation: 'pulse 1.4s ease-in-out infinite' }} />
            </div>
          ))}
        </div>
      )}

      {/* End of feed */}
      {!hasMore && articles.length > 0 && (
        <p
          lang="bn"
          style={{
            fontFamily: 'var(--font-body)',
            textAlign: 'center',
            fontSize: 11,
            color: '#aaaaaa',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}
        >
          — আর কোনো খবর নেই —
        </p>
      )}
    </div>
  );
}
