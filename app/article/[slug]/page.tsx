import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { formatDatetime, timeAgo } from '@/lib/timeAgo';
import ScoresStrip from '@/components/ScoresStrip';
import BriefsColumn from '@/components/BriefsColumn';
import BookmarkButton from '@/components/BookmarkButton';

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
 * Layout: Main article (2/3) + Right sidebar (1/3) with ScoresStrip & BriefsColumn
 */
export default async function ArticlePage({ params }: PageProps) {
  const [{ data: article }, { data: scores }, { data: articles }] = await Promise.all([
    supabaseAdmin
      .from('Article')
      .select('*')
      .eq('slug', params.slug)
      .single(),
    supabaseAdmin
      .from('ScoreCard')
      .select('*')
      .eq('is_visible', true)
      .order('isLive', { ascending: false })
      .order('displayOrder', { ascending: true }),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('isLead', false)
      .order('publishedAt', { ascending: false })
      .limit(20)
  ]);

  if (!article) notFound();

  const {
    id, slug, headline, headlineBn, deck, body,
    kicker, sport, mediaType, mediaUrl, mediaCaption,
    byline, publishedAt,
  } = article;

  const displayHeadline = headlineBn || headline;
  const isVideo = mediaType === 'video';
  const time = timeAgo(publishedAt, 'bn');
  const exactTime = formatDatetime(publishedAt);

  // For the bookmark button we just need the basic article format
  const articleForBookmark = {
    id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt
  };

  // Parse body into paragraphs (blank line separated)
  const paragraphs = (body || '')
    .split(/\n\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  const scoresList = scores ?? [];
  const articlesList = articles ?? [];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', paddingBottom: 64 }}>
      
      {/* Home Button / Breadcrumb */}
      <div className="w-full max-w-[1080px] mx-auto px-4 lg:px-6 py-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-1 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          style={{ fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500 }}
        >
          <span>←</span> নীড়পাতা
        </Link>
      </div>

      {/* Desktop Grid Layout */}
      <div className="max-w-[1080px] mx-auto px-0 lg:px-6 lg:grid lg:grid-cols-[64fr_36fr] gap-12 lg:pb-12">
        
        {/* Main Article Content (64%) */}
        <div>
          {/* Full-width media inside main column */}
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

          {/* Article content */}
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

            {/* Byline + Timestamp + Bookmark Toggle */}
            <div className="flex items-center justify-between gap-2 mb-8 border-b border-[var(--ink-border)] pb-4">
              <div className="flex items-center gap-2">
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
              <BookmarkButton article={articleForBookmark} />
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

        {/* Right Sidebar (36%) */}
        <div className="px-4 lg:px-0 pt-8 lg:pt-0">
          <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-none flex flex-col gap-6">
            {scoresList.length > 0 && (
              <div>
                <ScoresStrip scores={scoresList} />
              </div>
            )}
            <BriefsColumn articles={articlesList} />
          </div>
        </div>
      </div>
    </div>
  );
}
