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
  /** IDs of articles already rendered above so we can skip duplicates */
  skipIds?: number[];
  /** Start from page 1 by default */
  initialPage?: number;
}

function ArticleRow({ article }: { article: Article }) {
  const displayHeadline = article.headlineBn || article.headline;
  const sportLabel = SPORT_LABELS[article.sport] ?? article.sport;
  const time = timeAgo(article.publishedAt, 'bn');
  const exactTime = formatDatetime(article.publishedAt);

  return (
    <article
      style={{
        borderBottom: '1px solid #e2e2e2',
        paddingBottom: '2rem',
        marginBottom: '2rem',
        animation: 'fadeInUp 0.35s ease both',
      }}
    >
      <Link
        href={`/article/${article.slug}`}
        className="group block"
        aria-label={`পড়ুন: ${displayHeadline}`}
      >
        {/* Uniform image area */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            marginBottom: '0.75rem',
            border: '1px solid #e2e2e2',
            padding: '3px',
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
            <div className="w-full h-full bg-[#f3f1ec] flex items-center justify-center text-gray-400 italic text-xs font-normal">
              ছবি নেই
            </div>
          )}
        </div>

        {/* Category label */}
        <span
          lang="bn"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            letterSpacing: '0.05em',
            color: '#dc2626',
            fontWeight: 600,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 4,
          }}
        >
          {sportLabel}
        </span>

        {/* Headline — Uniformly sized & clamped */}
        <h2
          lang="bn"
          style={{
            fontFamily: 'var(--font-headline)',
            fontWeight: 700,
            fontSize: '1.4rem',
            lineHeight: 1.3,
            color: '#121212',
            marginBottom: '0.5rem',
            letterSpacing: '-0.01em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.6em',
          }}
          className="group-hover:underline"
        >
          {displayHeadline}
        </h2>

        {/* Deck — Uniformly sized & clamped, strictly normal weight */}
        <p
          lang="bn"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 14,
            color: '#555555',
            lineHeight: 1.6,
            marginBottom: '0.6rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '4.8em',
          }}
        >
          {article.deck || 'খেলারদেশ স্পোর্টস নিউজ ডেস্ক থেকে বিস্তারিত খবর আসছে...'}
        </p>

        {/* Byline + time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 400,
              color: '#888888',
            }}
            title={exactTime}
          >
            {article.byline} · {time}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
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

export default function InfiniteArticleFeed({ skipIds = [], initialPage = 1 }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?page=${page}`);
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
  }, [page, loading, hasMore, skipIds]);

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
    <div style={{ width: '100%' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Section divider */}
      <div
        style={{
          borderTop: '3px solid #121212',
          borderBottom: '1px solid #e2e2e2',
          marginBottom: '1.5rem',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2
          lang="bn"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#121212',
          }}
        >
          আরও খবর -
        </h2>
        <span
          lang="bn"
          style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#888888' }}
        >
          তারিখ অনুযায়ী সাজানো
        </span>
      </div>

      {/* Article grid — 2 columns on desktop */}
      {articles.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0 2.5rem',
          }}
        >
          {articles.map((article) => (
            <ArticleRow key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {/* Loading skeleton */}
      {loading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0 2.5rem',
            marginTop: articles.length === 0 ? 0 : '0.5rem',
          }}
        >
          {[1, 2].map((i) => (
            <div key={i} style={{ marginBottom: '2rem' }}>
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
              <div style={{ height: 22, backgroundColor: '#f0f0f0', marginBottom: 6, animation: 'pulse 1.4s ease-in-out infinite' }} />
              <div style={{ height: 22, backgroundColor: '#f0f0f0', marginBottom: 6, width: '80%', animation: 'pulse 1.4s ease-in-out infinite' }} />
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
            fontSize: 12,
            color: '#aaaaaa',
            paddingTop: '1.5rem',
            paddingBottom: '2rem',
            borderTop: '1px solid #e2e2e2',
          }}
        >
          — সকল নিবন্ধ দেখানো হয়েছে —
        </p>
      )}
    </div>
  );
}
