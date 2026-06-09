export const runtime = 'nodejs'
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { formatDatetime, timeAgo } from '@/lib/timeAgo';

export const dynamic = 'force-dynamic';




interface PageProps {
  params: { slug: string };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: article } = await supabaseAdmin
    .from('Article')
    .select('headline, headlineBn, deck')
    .eq('slug', params.slug)
    .single()
  if (!article) return { title: 'Not Found' };
  const title = article.headlineBn || article.headline;
  return { title, description: article.deck };
}

/**
 * Article detail page — Section 10.9 / 4
 * Max content width: 680px, centered
 * No related articles, no comments, no share buttons
 */
export default async function ArticlePage({ params }: PageProps) {
  const { data: article } = await supabaseAdmin
    .from('Article')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!article) notFound();

  const {
    headline, headlineBn, deck, body,
    kicker, sport, mediaType, mediaUrl, mediaCaption,
    byline, publishedAt,
  } = article;

  const displayHeadline = headlineBn || headline;
  const isBn = !!headlineBn;
  const isVideo = mediaType === 'video';
  const time = timeAgo(publishedAt, isBn ? 'bn' : 'en');
  const exactTime = formatDatetime(publishedAt);

  // Parse body into paragraphs (blank line separated)
  const paragraphs = (body || '')
    .split(/\n\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* Full-width media */}
      <div
        className="w-full relative"
        style={{ aspectRatio: '16/9', backgroundColor: 'var(--ink-ghost)', overflow: 'hidden', maxHeight: 520 }}
      >
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
          />
        )}
        <span
          style={{
            position: 'absolute', top: 10, left: 10,
            backgroundColor: 'var(--ink)', color: 'var(--bg-page)',
            fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
            fontSize: 7, fontWeight: 500, letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '2px 5px', borderRadius: 1,
          }}
        >
          {isVideo ? '▶ Video' : 'Photo'}
        </span>
      </div>

      {/* Caption */}
      {mediaCaption && (
        <div className="prose-field px-4 lg:px-0">
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: 'italic', fontSize: 10,
              color: 'var(--ink-muted)', marginTop: 6,
            }}
          >
            {mediaCaption}
          </p>
        </div>
      )}

      {/* Article content — max 680px centered */}
      <article className="prose-field px-4 lg:px-0 mx-auto mt-6">
        {/* Kicker · Sport */}
        <p
          style={{
            fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
            fontSize: 10, fontWeight: 400,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--ink-muted)', marginBottom: 8,
          }}
          lang="bn"
        >
          {kicker}
        </p>

        {/* Headline */}
        <h1
          lang={isBn ? 'bn' : 'en'}
          style={{
            fontFamily: isBn
              ? "'Manowar Murshidabad', 'Noto Serif Bengali', serif"
              : "Georgia, 'Times New Roman', Times, serif",
            fontWeight: 700,
            fontStyle: !isBn ? 'italic' : 'normal',
            fontSize: 'clamp(26px, 4vw, 36px)',
            lineHeight: 1.15, letterSpacing: '-0.01em',
            color: 'var(--ink)', marginBottom: 10,
          }}
        >
          {displayHeadline}
        </h1>

        {/* English title if bilingual */}
        {headlineBn && headline !== headlineBn && (
          <h2
            lang="en"
            style={{
              fontFamily: "Georgia, 'Times New Roman', Times, serif",
              fontWeight: 700, fontStyle: 'italic',
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--ink-muted)', marginBottom: 10, lineHeight: 1.2,
            }}
          >
            {headline}
          </h2>
        )}

        {/* Deck */}
        <p
          lang={isBn ? 'bn' : 'en'}
          style={{
            fontFamily: isBn ? "'Abu JM Akkas', 'Hind Siliguri', sans-serif" : "'Source Serif 4', Georgia, serif",
            fontWeight: 300, fontSize: 'clamp(14px, 1.5vw, 16px)',
            color: 'var(--ink-muted)', lineHeight: 1.65,
            marginBottom: 12, borderBottom: '0.5px solid var(--ink-border)', paddingBottom: 12,
          }}
        >
          {deck}
        </p>

        {/* Byline + Timestamp */}
        <div className="flex items-center gap-2 mb-8">
          <span
            style={{
              fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
              fontSize: 10, fontWeight: 400,
              letterSpacing: '0.1em', textTransform: 'uppercase',
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
              fontSize: 10, color: 'var(--ink-ghost)',
            }}
            lang={isBn ? 'bn' : 'en'}
          >
            {time}
          </time>
        </div>

        {/* Body paragraphs */}
        <div>
          {paragraphs.map((para, i) => (
            <p
              key={i}
              lang={isBn ? 'bn' : 'en'}
              style={{
                fontFamily: isBn
                  ? "'Abu JM Akkas', 'Hind Siliguri', sans-serif"
                  : "'Source Serif 4', Georgia, serif",
                fontWeight: isBn ? 400 : 300,
                fontSize: isBn ? 16 : 'clamp(16px, 1.5vw, 18px)',
                lineHeight: 1.8,
                color: 'var(--ink)',
                marginBottom: '1.25em',
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
