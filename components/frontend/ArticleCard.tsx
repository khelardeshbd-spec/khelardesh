'use client';

import Link from 'next/link';
import { timeAgo, formatDatetime } from '@/lib/timeAgo';
import BookmarkButton from './BookmarkButton';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';

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

interface ArticleCardProps {
  article: Article;
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

/**
 * ArticleCard — thumbnail + headline + deck + time
 * Full Bengali, Kalpurush font throughout
 * Media badge in Bengali: 'ভিডিও' or 'ছবি'
 */
export default function ArticleCard({ article }: ArticleCardProps) {
  const { slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, publishedAt } = article;
  const displayHeadline = headlineBn || headline;
  const sportLabel = SPORT_LABELS[sport] ?? sport;
  const time = timeAgo(publishedAt, 'bn');
  const exactTime = formatDatetime(publishedAt);
  const isVideo = mediaType === 'video';

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="clay-card mb-4 overflow-hidden"
    >
      <Link
        href={`/article/${slug}`}
        className="flex gap-3 p-3 hover:opacity-80 transition-opacity duration-150"
        aria-label={`পড়ুন: ${displayHeadline}`}
      >
        {/* Thumbnail */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{ width: 84, height: 63, backgroundColor: 'var(--ink-ghost)', borderRadius: 8 }}
        >
          {mediaUrl ? (
            <img
              src={mediaUrl}
              alt={displayHeadline}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="skeleton" style={{ width: '100%', height: '100%' }} />
          )}
          {/* Media badge — Bengali */}
          <span
            lang="bn"
            style={{
              position: 'absolute',
              top: 4,
              left: 4,
              backgroundColor: 'var(--ink)',
              color: 'var(--bg-page)',
              fontFamily: "var(--font-body)",
              fontSize: 8,
              fontWeight: 500,
              letterSpacing: '0.06em',
              padding: '1px 4px',
              borderRadius: 1,
            }}
          >
            {isVideo ? '▶ ভিডিও' : 'ছবি'}
          </span>
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
          {/* Sport label */}
          <span
            lang="bn"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: '0.05em',
              color: '#dc2626',
              fontWeight: 600,
            }}
          >
            {sportLabel}
          </span>

          {/* Headline */}
          <h2
            lang="bn"
            style={{
              fontFamily: "var(--font-headline)",
              fontWeight: 600,
              fontSize: 15,
              lineHeight: 1.3,
              color: 'var(--ink)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {displayHeadline}
          </h2>

          {/* Deck */}
          <p
            lang="bn"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: 12,
              color: 'var(--ink-muted)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginTop: 2,
            }}
          >
            {deck}
          </p>

          {/* Time ago + Bookmark Toggle */}
          <div className="flex items-center justify-between mt-2">
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              color: '#888888',
            }}>
              {time} · {article.byline}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-[#d33f3f]">আরো পড়ুন</span>
              <BookmarkButton article={article} />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
