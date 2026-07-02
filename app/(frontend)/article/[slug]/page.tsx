import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { formatDatetime, timeAgo } from '@/lib/timeAgo';
import BookmarkButton from '@/components/frontend/BookmarkButton';
import ShareButton from '@/components/frontend/ShareButton';
import ReadingProgressBar from './ReadingProgressBar';
import CommentSection from '@/components/frontend/CommentSection';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';
import ViewTracker from '@/components/frontend/ViewTracker';
import AdsterraAd from '@/components/frontend/AdsterraAd';

export const revalidate = 60; // ISR — revalidate every 60 seconds, much faster TTFB than force-dynamic

function safeB64Decode(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return '';
  }
}

interface PageProps {
  params: { slug: string };
}

const SPORT_LABELS: Record<string, string> = {
  football: 'Football', 'bd-football': 'Bangladesh Football',
  'club-football': 'Club Football', 'international-football': 'International Football',
  cricket: 'Cricket', 'bd-cricket': 'Bangladesh Cricket',
  basketball: 'Basketball', tennis: 'Tennis', f1: 'Formula One',
  interview: 'Interview', feature: 'Feature', special: 'Special',
  'guest-column': 'Guest Column', rugby: 'Rugby', athletics: 'Athletics',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: article } = await supabaseAdmin
    .from('Article')
    .select('headline, headlineBn, deck, mediaUrl, byline, publishedAt, updatedAt, sport, slug')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!article) return { title: 'Not Found' };

  const title = article.headlineBn || article.headline;
  const description = article.deck || `খেলারদেশে পড়ুন: ${title}`;
  const canonicalUrl = `https://khelardesh.com/article/${article.slug}`;
  const ogImage = article.mediaUrl || '/og-default.png';
  const sportLabel = article.sport ? SPORT_LABELS[article.sport] || 'Sports' : 'Sports';

  return {
    title,
    description,
    keywords: [
      'খেলারদেশ', 'sports news', sportLabel, 'Bangladesh sports',
      article.byline || 'khelardesh reporter',
    ],
    authors: article.byline ? [{ name: article.byline }] : [{ name: 'খেলারদেশ প্রতিনিধি' }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalUrl,
      siteName: 'খেলারদেশ',
      locale: 'bn_BD',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [article.byline || 'খেলারদেশ প্রতিনিধি'],
      section: sportLabel,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@khelardesh',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const [{ data: article }, { data: articles }] = await Promise.all([
    supabaseAdmin
      .from('Article')
      .select('*')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single(),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('isLead', false)
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(5)
  ]);

  if (!article) notFound();

  const {
    id, slug, headline, headlineBn, deck, body,
    kicker, sport, mediaType, mediaUrl, mediaCaption,
    byline, publishedAt,
  } = article;

  // Fetch composer profile image if available
  let composerPhotoUrl = null;
  if (byline) {
    const { data: composer } = await supabaseAdmin
      .from('Composer')
      .select('photoUrl')
      .eq('name', byline)
      .maybeSingle();
    if (composer) {
      composerPhotoUrl = composer.photoUrl;
    }
  }

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
      <ViewTracker articleId={id} />

      {/* JSON-LD: NewsArticle structured data for Google News rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: displayHeadline,
            description: deck || '',
            image: [mediaUrl || 'https://khelardesh.com/og-default.png'],
            datePublished: publishedAt,
            dateModified: publishedAt,
            author: {
              '@type': 'Person',
              name: byline || 'খেলারদেশ প্রতিনিধি',
            },
            publisher: {
              '@type': 'Organization',
              name: 'খেলারদেশ',
              logo: {
                '@type': 'ImageObject',
                url: 'https://khelardesh.com/images/khelardesh_logo.png',
                width: 600,
                height: 60,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://khelardesh.com/article/${slug}`,
            },
            url: `https://khelardesh.com/article/${slug}`,
            articleSection: categoryLabel,
            inLanguage: 'bn-BD',
            isAccessibleForFree: true,
          }),
        }}
      />

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
                {composerPhotoUrl ? (
                  <img src={composerPhotoUrl} alt={byline || 'Byline'} className="w-full h-full object-cover" />
                ) : (
                  byline ? byline.slice(0, 2) : 'KD'
                )}
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
                  {exactTime} ({time})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <ShareButton />
              <BookmarkButton article={articleForBookmark} />
              <Link
                href="#comments"
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
              </Link>
            </div>
          </div>

          {/* Paragraphs in Athletic Style */}
          <div className="editorial-body">
            {paragraphs.map((para: string, i: number) => {
              const showRecirculation = i === 1 && articlesList.length > 0;
              const recircleArticle = articlesList[0];

              const imgMatch = para.match(/^\[IMAGE:\s*(.*?)\s*\|\s*(.*?)\s*\]$/i);
              const adMatch = para.match(/^\[AD:\s*(.*?)\s*\|\s*(.*?)\s*\]$/i);
              const adsterraMatch = para.match(/^\[ADSTERRA:\s*(.*?)\s*\]$/i);
              const bulletsMatch = para.match(/^\[BULLETS:([\s\S]*)\]$/i);
              const quoteMatch = para.match(/^\[QUOTE:\s*([\s\S]*?)\s*\|\s*([\s\S]*?)\s*\]$/i);

              return (
                <div key={i}>
                  {imgMatch ? (
                    <div className="my-6">
                      <div className="w-full relative overflow-hidden rounded-md border border-[var(--ink-border)] bg-[var(--bg-surface)]" style={{ aspectRatio: '16/9' }}>
                        <img src={imgMatch[1]} alt={imgMatch[2] || 'Image'} className="w-full h-full object-cover" />
                      </div>
                      {imgMatch[2] && (
                        <p className="mt-1.5 text-xs text-[var(--ink-muted)] leading-relaxed italic text-center">
                          {imgMatch[2]}
                        </p>
                      )}
                    </div>
                  ) : adMatch ? (
                    <div className="my-6">
                      <a href={adMatch[2] || '#'} target="_blank" rel="noopener noreferrer" className="block w-full overflow-hidden rounded-md border border-[var(--ink-border)] bg-[var(--bg-surface)] hover:opacity-95 transition-opacity">
                        <img src={adMatch[1]} alt="Advertisement" className="w-full h-auto block" />
                      </a>
                    </div>
                  ) : adsterraMatch ? (
                    <div className="my-6">
                      <AdsterraAd htmlCode={adsterraMatch[1] ? safeB64Decode(adsterraMatch[1]) : ''} type="article" />
                    </div>
                  ) : bulletsMatch ? (
                    <ul
                      lang="bn"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '19px',
                        lineHeight: '1.75',
                        color: 'var(--ink)',
                        marginBottom: '1.6em',
                        paddingLeft: '1.4em',
                        listStyleType: 'disc',
                      }}
                    >
                      {bulletsMatch[1].split('|').map((item, idx) => (
                        item.trim() ? <li key={idx} style={{ marginBottom: '0.4em' }}>{item.trim()}</li> : null
                      ))}
                    </ul>
                  ) : quoteMatch ? (
                    <div lang="bn" style={{ marginBottom: '1.6em', position: 'relative' }}>
                      {/* Large decorative " symbol */}
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'block',
                          fontFamily: 'Georgia, serif',
                          fontSize: '80px',
                          lineHeight: 1,
                          color: '#a16207',
                          opacity: 0.18,
                          userSelect: 'none',
                          pointerEvents: 'none',
                          textAlign: 'center',
                          marginBottom: '-0.2em',
                        }}
                      >
                        &ldquo;
                      </span>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontWeight: 400,
                          fontSize: '19px',
                          lineHeight: '1.9',
                          color: 'var(--ink)',
                          margin: 0,
                          textAlign: 'center',
                        }}
                      >
                        {/* inline span with highlighter effect — box-decoration-break: clone makes each line highlighted independently */}
                        <span
                          style={{
                            background: '#fef08a',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '2px 6px',
                            lineHeight: '1.9',
                          } as React.CSSProperties}
                        >
                          {quoteMatch[1].trim()}
                        </span>
                      </p>
                      {quoteMatch[2].trim() && (
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            fontStyle: 'italic',
                            color: 'var(--ink-muted)',
                            fontWeight: 600,
                            textAlign: 'right',
                            marginTop: '0.4em',
                            marginBottom: 0,
                          }}
                        >
                          — {quoteMatch[2].trim()}
                        </p>
                      )}
                    </div>
                  ) : (
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
                  )}

                  {/* Removed inline recirculation */}
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
              {composerPhotoUrl ? (
                <img src={composerPhotoUrl} alt={byline || 'Byline'} className="w-full h-full object-cover" />
              ) : (
                byline ? byline.slice(0, 2) : 'KD'
              )}
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
          <div id="comments">
            <CommentSection articleSlug={slug} />
          </div>

        </article>

      </div>
      <ScrollToTopButton />
    </div>
  );
}
