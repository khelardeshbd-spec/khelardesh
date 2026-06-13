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

interface Props {
  category: string;
  skipIds?: number[];
  initialPage?: number;
}

// ─── Per-category dummy articles ────────────────────────────────────────────
const DUMMY: Record<string, Article[]> = {
  cinema: [
    {
      id: -101,
      slug: '#',
      headline: 'Pedro Almodóvar Returns with a Raw New Drama',
      headlineBn: 'পেদ্রো আলমোদোভারের নতুন ছবি: আবেগ ও বাস্তবতার মেলবন্ধন',
      deck: 'স্প্যানিশ পরিচালকের নতুন কাজ ভেনিস চলচ্চিত্র উৎসবে দারুণ সাড়া ফেলেছে।',
      sport: 'cinema',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&q=80',
      byline: 'রাহেলা পারভীন',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: -102,
      slug: '#',
      headline: 'Cannes 2026: The Best Films You Might Have Missed',
      headlineBn: 'কান ২০২৬: যে ছবিগুলো আপনি মিস করেছেন',
      deck: 'এই বছরের কান উৎসবে প্রদর্শিত সেরা পাঁচটি অপ্রচলিত ছবির বিশেষ পর্যালোচনা।',
      sport: 'cinema',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
      byline: 'জুলিয়ান বেলট্রেন',
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: -103,
      slug: '#',
      headline: 'Animation Reimagined: Studio Ghibli\'s Bold New Direction',
      headlineBn: 'স্টুডিও ঘিবলির সাহসী নতুন অ্যানিমেশন জগৎ',
      deck: 'জাপানের কিংবদন্তি অ্যানিমেশন স্টুডিও এবার তাদের সবচেয়ে উচ্চাকাঙ্ক্ষী প্রকল্পে হাত দিয়েছে।',
      sport: 'cinema',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      byline: 'মার্তিন সাঁতিয়াগো',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  music: [
    {
      id: -201,
      slug: '#',
      headline: 'Billie Eilish Announces Surprise Album Drop',
      headlineBn: 'বিলি আইলিশের অপ্রত্যাশিত নতুন অ্যালবাম প্রকাশ',
      deck: 'মাত্র ৪৮ ঘণ্টার নোটিশে মুক্তি পেল বিলির পঞ্চম স্টুডিও অ্যালবাম, ভক্তরা রীতিমতো হতবাক।',
      sport: 'music',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
      byline: 'নাদিয়া রহমান',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: -202,
      slug: '#',
      headline: 'The Rise of Bangladeshi Indie Music on Global Platforms',
      headlineBn: 'গ্লোবাল স্ট্রিমিং প্ল্যাটফর্মে বাংলাদেশি ইন্ডি সংগীতের উত্থান',
      deck: 'স্পটিফাই ও অ্যাপল মিউজিকে বাংলাদেশি শিল্পীদের শ্রোতা সংখ্যা গত বছরে ২৩০% বেড়েছে।',
      sport: 'music',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      byline: 'তানভীর আহমেদ',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: -203,
      slug: '#',
      headline: 'Jazz Festival Dhaka 2026: A Night to Remember',
      headlineBn: 'জ্যাজ ফেস্টিভ্যাল ঢাকা ২০২৬: এক অবিস্মরণীয় সন্ধ্যা',
      deck: 'পুরান ঢাকার ঐতিহাসিক প্রেক্ষাপটে আন্তর্জাতিক জ্যাজ শিল্পীদের এই আয়োজন হয়ে উঠেছিল এক অনন্য অভিজ্ঞতা।',
      sport: 'music',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80',
      byline: 'কামরুল হাসান',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  live: [
    {
      id: -301,
      slug: '#',
      headline: 'Real Madrid vs Man City: Champions League Final Preview',
      headlineBn: 'রিয়াল মাদ্রিদ বনাম ম্যান সিটি: চ্যাম্পিয়নস লিগ ফাইনালের আগাম পর্যালোচনা',
      deck: 'আজ রাত ১১টায় শুরু হবে মৌসুমের সবচেয়ে বড় ম্যাচ — আমাদের বিশ্লেষণ পড়ুন।',
      sport: 'live',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
      byline: 'সিফো মখিজি',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: -302,
      slug: '#',
      headline: 'World Athletics Championships: Day 3 Highlights',
      headlineBn: 'বিশ্ব অ্যাথলেটিক্স চ্যাম্পিয়নশিপ: তৃতীয় দিনের সেরা মুহূর্তগুলো',
      deck: '১০০ মিটার হার্ডলসে নতুন বিশ্বরেকর্ড এবং হাই জাম্পে অবাক করা ফলাফল।',
      sport: 'live',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&q=80',
      byline: 'আনা পেরেজ',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: -303,
      slug: '#',
      headline: 'Wimbledon 2026: Nadal\'s Fairytale Comeback Continues',
      headlineBn: 'উইম্বলডন ২০২৬: নাদালের রূপকথার প্রত্যাবর্তন অব্যাহত',
      deck: 'তৃতীয় রাউন্ডে টপ সিডকে হারিয়ে নাদাল আবার প্রমাণ করলেন কেন তিনি কিংবদন্তি।',
      sport: 'live',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=800&q=80',
      byline: 'লুইস ফার্নান্দো',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

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
        {/* Big image */}
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
            style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#888888' }}
            title={exactTime}
          >
            {article.byline} · {time}
          </span>
          <span
            style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, color: '#d33f3f' }}
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
  const [usedFallback, setUsedFallback] = useState(false);
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

      if (incoming.length === 0 && page === 1 && !usedFallback) {
        // No real articles found — show dummy placeholder content
        const dummies = (DUMMY[category] ?? []).filter((a) => !skipIds.includes(a.id));
        setArticles(dummies);
        setHasMore(false);
        setUsedFallback(true);
      } else {
        setArticles((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          return [...prev, ...incoming.filter((a) => !existingIds.has(a.id))];
        });
        const { pagination } = data;
        if (page >= pagination.totalPages) setHasMore(false);
        setPage((p) => p + 1);
      }
    } catch {
      // On error, show dummy content if nothing loaded yet
      if (articles.length === 0) {
        const dummies = (DUMMY[category] ?? []).filter((a) => !skipIds.includes(a.id));
        setArticles(dummies);
        setUsedFallback(true);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, loading, hasMore, skipIds, category]);

  // IntersectionObserver — trigger load when sentinel enters view
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
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
              <div style={{ width: '100%', aspectRatio: '16 / 9', backgroundColor: '#f0f0f0', marginBottom: 12, animation: 'pulse 1.4s ease-in-out infinite' }} />
              <div style={{ height: 14, backgroundColor: '#f0f0f0', marginBottom: 8, width: '35%', animation: 'pulse 1.4s ease-in-out infinite' }} />
              <div style={{ height: 18, backgroundColor: '#f0f0f0', marginBottom: 6, animation: 'pulse 1.4s ease-in-out infinite' }} />
              <div style={{ height: 18, backgroundColor: '#f0f0f0', marginBottom: 6, width: '80%', animation: 'pulse 1.4s ease-in-out infinite' }} />
            </div>
          ))}
        </div>
      )}

      {/* End of feed */}
      {!hasMore && articles.length > 0 && !usedFallback && (
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

      {/* Fallback notice */}
      {usedFallback && (
        <p
          lang="bn"
          style={{
            fontFamily: 'var(--font-body)',
            textAlign: 'center',
            fontSize: 10,
            color: '#cccccc',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            borderTop: '1px dashed #e8e8e8',
            marginTop: '1rem',
          }}
        >
          — নমুনা প্রবন্ধ —
        </p>
      )}
    </div>
  );
}
