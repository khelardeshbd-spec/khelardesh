import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { formatDatetime, timeAgo } from '@/lib/timeAgo';
import BookmarkButton from '@/components/frontend/BookmarkButton';
import ShareButton from '@/components/frontend/ShareButton';
import ReadingProgressBar from './ReadingProgressBar';
import BottomNav from '@/components/frontend/BottomNav';
import CommentSection from '@/components/frontend/CommentSection';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';

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
  const [{ data: article }, { data: articles }] = await Promise.all([
    supabaseAdmin
      .from('Article')
      .select('*')
      .eq('slug', params.slug)
      .single(),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('isLead', false)
      .order('publishedAt', { ascending: false })
      .limit(5)
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

  const paragraphs = (body || '')
    .split(/\n\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  const articlesList = articles ?? [];
  const sportMap: Record<string, string> = {
    football: 'ফুটবল',
    'bd-football': 'দেশের ফুটবল',
    'international-football': 'আন্তর্জাতিক ফুটবল',
    'club-football': 'ক্লাব ফুটবল',
    cricket: 'ক্রিকেট',
    'bd-cricket': 'বাংলাদেশের ক্রিকেট',
    interview: 'ইন্টারভিউ',
    feature: 'ফিচার',
    special: 'খেলার দেশ বিশেষ',
    'guest-column': 'অতিথি কলাম',
    basketball: 'বাস্কেটবল',
    rugby: 'রাগবি',
    f1: 'ফর্মুলা ওয়ান',
    'table-tennis': 'টেবিল টেনিস',
    golf: 'গল্ফ'
  };
  const categoryLabel = sport && sportMap[sport.toLowerCase()] ? sportMap[sport.toLowerCase()] : (kicker || 'খেলাধুলা');

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', color: 'var(--ink)' }}>
      {/* Scroll Progress Bar at the top */}
      <ReadingProgressBar />

      {/* Back button / Breadcrumbs */}
      <div className="w-full max-w-[680px] mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--ink-ghost)] transition-colors bg-[var(--bg-surface)] border border-[var(--ink-border)] px-3 py-1.5 rounded-full"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            ফিরে যান
          </Link>
          
          <div 
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--ink-muted)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Link href="/" className="hover:text-[var(--ink)] transition-colors">
              মাঠ
            </Link>
            <span>/</span>
            <Link href={sport ? `/sport/${sport}` : '#'} className="text-[#1a5c2e] hover:text-[var(--ink)] transition-colors">
              {categoryLabel}
            </Link>
          </div>
        </div>
      </div>


      <div className="max-w-[680px] mx-auto px-4 pb-16">
        
        {/* Main Editorial Article Column */}
        <article className="min-w-0">
          
          {/* Headline */}
          <h1
            lang="bn"
            style={{
              fontFamily: "var(--font-headline)",
              fontWeight: 800,
              fontSize: 'clamp(28px, 4.5vw, 42px)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              marginBottom: '16px',
              marginTop: '20px',
            }}
          >
            {displayHeadline}
          </h1>

          {/* Hero Image / Video */}
          <div className="w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0 mb-6">
            <div
              className="w-full relative overflow-hidden sm:rounded-md border-b sm:border"
              style={{ 
                aspectRatio: '16/9',
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--ink-border)'
              }}
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
            {/* Deck displayed below image with normal font, smaller size and dark color */}
            {deck && (
              <p
                lang="bn"
                className="mt-3 px-4 sm:px-0 text-sm text-[var(--ink)] leading-relaxed"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
              >
                {deck}
              </p>
            )}
            {mediaCaption && (
              <p
                className="mt-1.5 px-4 sm:px-0 text-xs text-[var(--ink-muted)] leading-relaxed italic"
                style={{ fontFamily: "var(--font-body)" }}
                lang="bn"
              >
                {mediaCaption}
              </p>
            )}
          </div>

          {/* Byline, metadata, and Actions combined in one single row */}
          <div className="flex items-center justify-between border-t border-b border-[var(--ink-border)] py-2.5 mb-8 gap-2 w-full flex-nowrap whitespace-nowrap">
            <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
              {/* Author circular avatar */}
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center border overflow-hidden text-[10px] font-bold flex-shrink-0"
                style={{ 
                  backgroundColor: 'var(--bg-surface)', 
                  borderColor: 'var(--ink-border)',
                  color: 'var(--ink)'
                }}
              >
                {byline ? byline.slice(0, 2) : 'KD'}
              </div>
              {/* Stacked Name and Date/Time */}
              <div className="flex flex-col min-w-0 text-left">
                <span 
                  className="text-xs text-[var(--ink)] font-semibold leading-tight" 
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  By <span className="font-bold">{byline || 'খেলারদেশ প্রতিনিধি'}</span>
                </span>
                <span 
                  className="text-[10px] text-[var(--ink-muted)] mt-0.5 leading-none" 
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {time} · {exactTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <ShareButton />
              <BookmarkButton article={articleForBookmark} variant="circle" />
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center border hover:bg-[var(--ink-ghost)] transition-colors cursor-pointer text-[var(--ink-muted)] hover:text-[var(--ink)] flex-shrink-0"
                style={{ 
                  backgroundColor: 'var(--bg-surface)', 
                  borderColor: 'var(--ink-border)' 
                }}
                title="মন্তব্য"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.598.598 0 01-.78-.78l.893-2.61a8.887 8.887 0 01-1.023-3.33C4.5 7.444 8.53 3.75 13.5 3.75S21 7.444 21 12z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Paragraphs in Athletic Style */}
          <div className="editorial-body">
            {paragraphs.map((para: string, i: number) => {
              const showRecirculation = i === 1 && articlesList.length > 0;
              const recircleArticle = articlesList[0];

              return (
                <div key={i}>
                  <p
                    lang="bn"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      fontSize: '19px',
                      lineHeight: '1.75',
                      color: 'var(--ink)',
                      marginBottom: '1.6em',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {para}
                  </p>

                  {showRecirculation && (
                    <div 
                      className="my-8 p-5 border rounded-lg flex flex-col gap-1.5"
                      style={{
                        borderColor: 'var(--ink-border)',
                        backgroundColor: 'var(--bg-surface)'
                      }}
                    >
                      <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--ink-muted)]">WHAT TO READ NEXT</span>
                      <Link 
                        href={`/article/${recircleArticle.slug}`} 
                        className="text-base font-bold text-[var(--ink)] hover:text-[#1a5c2e] transition-colors leading-snug"
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
          <div className="mt-12 pt-8 border-t border-[var(--ink-border)] flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center border overflow-hidden text-sm font-bold flex-shrink-0"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--ink-border)',
                color: 'var(--ink)'
              }}
            >
              {byline ? byline.slice(0, 2) : 'KD'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-body)' }}>
                {byline || 'খেলারদেশ রিপোর্টার'}
              </h4>
              <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                খেলাধুলার সব খবর ও বিশ্লেষণ সবার আগে পেতে চোখ রাখুন খেলারদেশে।
              </p>
            </div>
          </div>

          {/* Comment Section */}
          <CommentSection articleSlug={slug} />

        </article>

      </div>
      <ScrollToTopButton />
    </div>
  );
}
