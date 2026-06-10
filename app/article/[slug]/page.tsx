import { notFound } from 'next/navigation';
import Link from 'next/link';
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
  const isVideo = mediaType === 'video';
  const time = timeAgo(publishedAt, 'bn');
  const exactTime = formatDatetime(publishedAt);

  // Parse body into paragraphs (blank line separated)
  const paragraphs = (body || '')
    .split(/\n\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* Home Button / Breadcrumb */}
      <div className="w-full max-w-[680px] mx-auto px-4 lg:px-0 py-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-1 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          style={{ fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500 }}
        >
          <span>←</span> নীড়পাতা
        </Link>
      </div>

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
            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
            fontSize: 9, fontWeight: 500, letterSpacing: '0.04em',
            textTransform: 'uppercase', padding: '2px 5px', borderRadius: 1,
          }}
          lang="bn"
        >
          {isVideo ? '▶ ভিডিও' : 'ছবি'}
        </span>
      </div>

      {/* Caption */}
      {mediaCaption && (
        <div className="prose-field px-4 lg:px-0">
          <p
            style={{
              fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
              fontSize: 12,
              color: 'var(--ink-muted)', marginTop: 6,
            }}
            lang="bn"
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
            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
            fontSize: 12, fontWeight: 500,
            letterSpacing: '0.06em',
            color: 'var(--ink-muted)', marginBottom: 8,
          }}
          lang="bn"
        >
          {kicker}
        </p>

        {/* Headline */}
        <h1
          lang="bn"
          style={{
            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(26px, 4vw, 36px)',
            lineHeight: 1.15, letterSpacing: '-0.01em',
            color: 'var(--ink)', marginBottom: 10,
          }}
        >
          {displayHeadline}
        </h1>

        {/* English title removed */}

        {/* Deck */}
        <p
          lang="bn"
          style={{
            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
            fontWeight: 400, fontSize: 'clamp(16px, 1.5vw, 18px)',
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
              fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
              fontSize: 11, fontWeight: 500,
              letterSpacing: '0.04em',
              color: 'var(--ink-ghost)',
            }}
            lang="bn"
          >
            {byline}
          </span>
          <span style={{ color: 'var(--ink-ghost)', fontSize: 11 }}>·</span>
          <time
            dateTime={new Date(publishedAt).toISOString()}
            title={exactTime}
            style={{
              fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
              fontSize: 11, color: 'var(--ink-ghost)',
            }}
            lang="bn"
          >
            {time}
          </time>
        </div>

        {/* Body paragraphs */}
        <div>
          {paragraphs.map((para: string, i: number) => (
            <p
              key={i}
              lang="bn"
              style={{
                fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                fontWeight: 400,
                fontSize: 18,
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
