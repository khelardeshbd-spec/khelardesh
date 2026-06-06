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
 * Full-width 16:9 media block
 * Photo: <img loading="lazy" />
 * Video: <video autoPlay muted loop playsInline /> — ambient, no controls
 * Badge top-left: "▶ Video" or "Photo"
 * Optional caption: italic 10px --ink-muted
 * Kicker above headline: Hind Siliguri 10px uppercase --ink-muted
 * Headline: Playfair Display (EN) or Noto Serif Bengali (BN), italic allowed
 * Deck: Source Serif 4 / Hind Siliguri 13–14px weight 300 --ink-muted
 * Byline: Hind Siliguri 10px uppercase --ink-ghost
 */
export default function LeadStory({ article }: LeadStoryProps) {
  const { slug, headline, headlineBn, deck, kicker, mediaType, mediaUrl, mediaCaption, byline, publishedAt } = article;
  const displayHeadline = headlineBn || headline;
  const isBn = !!headlineBn;
  const isVideo = mediaType === 'video';
  const time = timeAgo(publishedAt, isBn ? 'bn' : 'en');
  const exactTime = formatDatetime(publishedAt);

  return (
    <article>
      <Link href={`/article/${slug}`} className="block group">
        {/* Media block — 16:9 ratio */}
        <div className="relative w-full" style={{ aspectRatio: '16/9', backgroundColor: 'var(--ink-ghost)', overflow: 'hidden' }}>
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
          {/* Media type badge */}
          <span
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'var(--ink)',
              color: 'var(--bg-page)',
              fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
              fontSize: 7,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '2px 5px',
              borderRadius: 1,
            }}
          >
            {isVideo ? '▶ Video' : 'Photo'}
          </span>
        </div>

        {/* Optional caption */}
        {mediaCaption && (
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 10,
              color: 'var(--ink-muted)',
              marginTop: 4,
              paddingLeft: 2,
            }}
          >
            {mediaCaption}
          </p>
        )}

        {/* Text block */}
        <div className="mt-3">
          {/* Kicker */}
          <p
            style={{
              fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
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

          {/* Headline */}
          <h2
            lang={isBn ? 'bn' : 'en'}
            style={{
              fontFamily: isBn
                ? "'Manowar Murshidabad', 'Noto Serif Bengali', serif"
                : "Georgia, 'Times New Roman', Times, serif",
              fontWeight: 700,
              fontStyle: isBn ? 'normal' : 'italic',
              fontSize: 'clamp(26px, 4vw, 36px)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              marginBottom: 8,
            }}
          >
            {displayHeadline}
          </h2>

          {/* English headline if separate */}
          {headlineBn && headline !== headlineBn && (
            <h3
              lang="en"
              style={{
                fontFamily: "Georgia, 'Times New Roman', Times, serif",
                fontWeight: 700,
                fontStyle: 'italic',
                fontSize: 'clamp(16px, 2vw, 20px)',
                color: 'var(--ink-muted)',
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              {headline}
            </h3>
          )}

          {/* Deck */}
          <p
            lang={isBn ? 'bn' : 'en'}
            style={{
              fontFamily: isBn ? "'Abu JM Akkas', 'Hind Siliguri', sans-serif" : "'Source Serif 4', Georgia, serif",
              fontWeight: 300,
              fontSize: 'clamp(13px, 1.5vw, 14px)',
              color: 'var(--ink-muted)',
              lineHeight: 1.6,
              marginBottom: 8,
            }}
          >
            {deck}
          </p>

          {/* Byline + time */}
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-ghost)',
              }}
            >
              {byline}
            </span>
            <span style={{ color: 'var(--ink-ghost)', fontSize: 10 }}>·</span>
            <time
              dateTime={new Date(publishedAt).toISOString()}
              title={exactTime}
              style={{
                fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                fontSize: 10,
                color: 'var(--ink-ghost)',
              }}
              lang={isBn ? 'bn' : 'en'}
            >
              {time}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
