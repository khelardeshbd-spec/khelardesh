import Link from 'next/link';
import { timeAgo, formatDatetime } from '@/lib/timeAgo';

interface Article {
  slug: string;
  headline: string;
  headlineBn?: string | null;
  deck: string;
  kicker: string;
  sport: string;
  mediaType: string;
  mediaUrl: string;
  mediaCaption?: string | null;
  byline: string;
  publishedAt: Date | string;
}

interface LeadStoryProps {
  article: Article;
}

/**
 * LeadStory — Section 10.5
 * Bengali-first: headlineBn is always primary H2
 * English title (if different) shown as muted subtitle beneath
 * Media badge in Bengali: 'ভিডিও' or 'ছবি'
 */
export default function LeadStory({ article }: LeadStoryProps) {
  const { slug, headline, headlineBn, deck, kicker, mediaType, mediaUrl, mediaCaption, byline, publishedAt } = article;
  const displayHeadline = headlineBn || headline;
  const isVideo = mediaType === 'video';
  const time = timeAgo(publishedAt, 'bn');
  const exactTime = formatDatetime(publishedAt);

  return (
    <article className="clay-card mb-4 p-4 overflow-hidden">
      <Link href={`/article/${slug}`} className="block group">
        {/* Media block — 16:9 ratio */}
        <div className="relative w-full rounded-md" style={{ aspectRatio: '16/9', backgroundColor: 'var(--ink-ghost)', overflow: 'hidden' }}>
          {isVideo ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={mediaUrl}
              alt={displayHeadline}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              className="group-hover:scale-[1.01] transition-transform duration-500"
            />
          )}
          {/* Media type badge — Bengali only */}
          <span
            lang="bn"
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'var(--ink)',
              color: 'var(--bg-page)',
              fontFamily: "var(--font-body)",
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.08em',
              padding: '2px 6px',
              borderRadius: 1,
            }}
          >
            {isVideo ? '▶ ভিডিও' : 'ছবি'}
          </span>
        </div>

        {/* Caption below image */}
        {mediaCaption && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: 'italic',
              fontSize: 11,
              color: 'var(--ink-muted)',
              marginTop: 4,
              paddingLeft: 2,
            }}
            lang="bn"
          >
            {mediaCaption}
          </p>
        )}

        {/* Text block */}
        <div className="mt-3">
          {/* Kicker */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              marginBottom: 6,
            }}
            lang="bn"
          >
            {kicker}
          </p>

          {/* PRIMARY: Bengali headline */}
          <h2
            lang="bn"
            style={{
              fontFamily: "var(--font-headline)",
              fontWeight: 700,
              fontSize: 'clamp(22px, 3.5vw, 34px)',
              lineHeight: 1.25,
              color: 'var(--ink)',
              marginBottom: headlineBn && headline !== headlineBn ? 4 : 8,
            }}
          >
            {displayHeadline}
          </h2>

          {/* SECONDARY: English headline — only if it's different, shown as muted subtitle */}
          {headlineBn && headline !== headlineBn && (
            <p
              lang="en"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 'clamp(13px, 1.5vw, 15px)',
                color: 'var(--ink-muted)',
                marginBottom: 8,
                lineHeight: 1.3,
                fontWeight: 400,
              }}
            >
              {headline}
            </p>
          )}

          {/* Deck */}
          <p
            lang="bn"
            style={{
              fontFamily: "var(--font-headline)",
              fontWeight: 400,
              fontSize: 'clamp(14px, 1.5vw, 15px)',
              color: 'var(--ink-muted)',
              lineHeight: 1.65,
              marginBottom: 8,
            }}
          >
            {deck}
          </p>

          {/* Byline + time */}
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#888888',
              }}
            >
              {byline}
            </span>
            <span style={{ color: 'var(--ink-ghost)', fontSize: 10 }}>·</span>
            <time
              dateTime={new Date(publishedAt).toISOString()}
              title={exactTime}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                color: 'var(--ink-ghost)',
              }}
              lang="bn"
            >
              {time}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
