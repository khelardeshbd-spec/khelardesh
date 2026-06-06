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
  f1: 'F1',
  rugby: 'রাগবি',
  athletics: 'অ্যাথলেটিক্স',
  other: 'অন্যান্য',
};

/**
 * ArticleCard — Section 10.4
 * [84×63 thumb]  Sport label  9.5px Hind Siliguri --ink-muted
 *                Headline     Playfair / Noto Serif BN 15px bold
 *                Snippet      Source Serif 4 / Hind 12px 300 --ink-muted
 *                X hrs ago    10px --ink-ghost
 * Thumb has Photo / ▶ Video badge
 * Full row is a Link
 * Separated by 0.5px --ink-border rule
 */
export default function ArticleCard({ article }: ArticleCardProps) {
  const { slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt } = article;
  const displayHeadline = headlineBn || headline;
  const isBn = !!headlineBn;
  const sportLabel = SPORT_LABELS[sport] ?? sport;
  const time = timeAgo(publishedAt, isBn ? 'bn' : 'en');
  const exactTime = formatDatetime(publishedAt);
  const isVideo = mediaType === 'video';

  return (
    <article
      style={{
        borderBottom: '0.5px solid var(--ink-border)',
      }}
    >
      <Link
        href={`/article/${slug}`}
        className="flex gap-3 py-3 px-0 hover:opacity-80 transition-opacity duration-150"
        aria-label={`Read: ${displayHeadline}`}
      >
        {/* Thumbnail */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{ width: 84, height: 63, backgroundColor: 'var(--ink-ghost)' }}
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
          {/* Media badge */}
          <span className="media-badge">
            {isVideo ? '▶ Video' : 'Photo'}
          </span>
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
          {/* Sport label */}
          <span
            className="type-kicker"
            lang="bn"
            style={{
              fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
              fontSize: 9.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
            }}
          >
            {sportLabel}
          </span>

          {/* Headline */}
          <h2
            className={isBn ? 'type-story-bn' : 'type-story-en'}
            lang={isBn ? 'bn' : 'en'}
            style={{
              fontFamily: isBn
                ? "'Manowar Murshidabad', 'Noto Serif Bengali', serif"
                : "Georgia, 'Times New Roman', Times, serif",
              fontWeight: isBn ? 600 : 700,
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

          {/* Snippet */}
          <p
            style={{
              fontFamily: isBn ? "'Abu JM Akkas', 'Hind Siliguri', sans-serif" : "'Source Serif 4', Georgia, serif",
              fontWeight: 300,
              fontSize: 12,
              color: 'var(--ink-muted)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginTop: 2,
            }}
            lang={isBn ? 'bn' : 'en'}
          >
            {deck}
          </p>

          {/* Time ago */}
          <time
            dateTime={new Date(publishedAt).toISOString()}
            title={exactTime}
            style={{
              fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
              fontSize: 10,
              color: 'var(--ink-ghost)',
              marginTop: 2,
            }}
            lang={isBn ? 'bn' : 'en'}
          >
            {time}
          </time>
        </div>
      </Link>
    </article>
  );
}
