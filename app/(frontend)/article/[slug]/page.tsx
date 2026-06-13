import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { formatDatetime, timeAgo } from '@/lib/timeAgo';
import ScoresStrip from '@/components/frontend/ScoresStrip';
import BriefsColumn from '@/components/frontend/BriefsColumn';
import BookmarkButton from '@/components/frontend/BookmarkButton';
import ReadingProgressBar from './ReadingProgressBar';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: article } = await supabaseAdmin
    .from('Article')
    .select('headline, headlineBn, deck')
    .eq('slug', params.slug)
    .single();
  if (!article) return { title: 'Not Found' };
  const title = article.headlineBn || article.headline;
  return { title, description: article.deck };
}

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

  const articleForBookmark = {
    id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt
  };

  // Parse body into paragraphs
  const paragraphs = (body || '')
    .split(/\n\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  const articlesList = articles ?? [];

  // Get a readable sport/category label
  const categoryLabel = sport ? sport.toUpperCase() : (kicker || 'খেলাধুলা');

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#121212' }}>
      {/* Scroll Progress Bar at the top */}
      <ReadingProgressBar />

      {/* Back button */}
      <div className="w-full max-w-[1140px] mx-auto px-4 lg:px-6 pt-6 pb-2">
        <Link 
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-gray-500 hover:text-black transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <span>←</span> Back to home
        </Link>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 lg:px-6 lg:grid lg:grid-cols-[680px_1fr] gap-12 pb-16">
        
        {/* Main Editorial Article Column */}
        <article className="min-w-0">
          
          {/* Category/Kicker */}
          <div className="mb-3">
            <span 
              className="text-xs font-bold uppercase tracking-wider text-[#1a5c2e]" 
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Headline */}
          <h1
            lang="bn"
            style={{
              fontFamily: "var(--font-headline)",
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 48px)',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              color: '#121212',
              marginBottom: '16px',
            }}
          >
            {displayHeadline}
          </h1>

          {/* Deck (Subheadline) */}
          {deck && (
            <p
              lang="bn"
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 400,
                fontSize: 'clamp(18px, 2vw, 21px)',
                color: '#555555',
                lineHeight: 1.5,
                marginBottom: '24px',
              }}
            >
              {deck}
            </p>
          )}

          {/* Byline and Timestamp row */}
          <div className="flex items-center justify-between border-t border-b border-gray-100 py-3.5 mb-8">
            <div className="flex items-center gap-3">
              {/* Author circular avatar */}
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden text-xs font-bold text-gray-600">
                {byline ? byline.slice(0, 2) : 'KD'}
              </div>
              <div className="flex flex-col">
                <span 
                  className="text-sm font-bold text-gray-900 leading-tight" 
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {byline || 'খেলারদেশ প্রতিনিধি'}
                </span>
                <span 
                  className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5" 
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  <span>{time}</span>
                  <span className="text-[10px]">·</span>
                  <span title={exactTime}>{exactTime}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BookmarkButton article={articleForBookmark} />
            </div>
          </div>

          {/* Hero Image / Video */}
          <div className="w-full mb-6">
            <div
              className="w-full relative rounded-md overflow-hidden bg-gray-50 border border-gray-100"
              style={{ aspectRatio: '16/9' }}
            >
              {isVideo ? (
                <video
                  src={mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={displayHeadline}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {mediaCaption && (
              <p
                className="mt-3 text-xs text-gray-500 leading-relaxed italic"
                style={{ fontFamily: "var(--font-body)" }}
                lang="bn"
              >
                {mediaCaption}
              </p>
            )}
          </div>

          {/* Paragraphs in Athletic Style */}
          <div className="editorial-body">
            {paragraphs.map((para: string, i: number) => {
              // Inject a subtle inline recirculation box after the second paragraph if we have enough paragraphs
              const showRecirculation = i === 1 && articlesList.length > 0;
              const recircleArticle = articlesList[0];

              return (
                <div key={i}>
                  <p
                    lang="bn"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 400, // Explicit normal weight per user guidance
                      fontSize: '19px',
                      lineHeight: '1.75',
                      color: '#292929',
                      marginBottom: '1.6em',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {para}
                  </p>

                  {showRecirculation && (
                    <div className="my-8 p-5 border-y border-x border-gray-100 bg-gray-50/50 rounded-lg flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">WHAT TO READ NEXT</span>
                      <Link 
                        href={`/article/${recircleArticle.slug}`} 
                        className="text-base font-bold text-gray-900 hover:text-[#1a5c2e] transition-colors leading-snug"
                        style={{ fontFamily: 'var(--font-headline)' }}
                      >
                        {recircleArticle.headlineBn || recircleArticle.headline}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom bio info */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden text-sm font-bold text-gray-600 flex-shrink-0">
              {byline ? byline.slice(0, 2) : 'KD'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-950" style={{ fontFamily: 'var(--font-body)' }}>
                {byline || 'খেলারদেশ রিপোর্টার'}
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                খেলাধুলার সব খবর ও বিশ্লেষণ সবার আগে পেতে চোখ রাখুন খেলারদেশে।
              </p>
            </div>
          </div>

        </article>

        {/* Right Sidebar */}
        <div className="hidden lg:block pt-4">
          <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-none flex flex-col gap-8">
            <div>
              <ScoresStrip />
            </div>
            <BriefsColumn articles={articlesList} />
          </div>
        </div>

      </div>
    </div>
  );
}
