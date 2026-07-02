'use client';

import Link from 'next/link';
import Image from 'next/image';
import AdsterraAd from './AdsterraAd';

interface Article {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  deck?: string | null;
  sport?: string | null;
  mediaType?: string;
  mediaUrl?: string | null;
  byline?: string | null;
  publishedAt?: string;
}

interface LowerSectionProps {
  footballArticles: Article[];
  cricketArticles: Article[];
  interviewArticles: Article[];
  featureArticles: Article[];
  specialArticles: Article[];
  guestArticles: Article[];
  othersArticles: Article[];
  didYouKnowArticles?: Article[];
  onThisDayArticles?: Article[];
  hpBanner1?: { imageUrl?: string | null; ctaUrl?: string | null; useAdsterra?: boolean; adsterraCode?: string | null } | null;
  hpBanner2?: { imageUrl?: string | null; ctaUrl?: string | null; useAdsterra?: boolean; adsterraCode?: string | null } | null;
  hpBanner3?: { imageUrl?: string | null; ctaUrl?: string | null; useAdsterra?: boolean; adsterraCode?: string | null } | null;
  hpBanner4?: { imageUrl?: string | null; ctaUrl?: string | null; useAdsterra?: boolean; adsterraCode?: string | null } | null;
  hpBanner5?: { imageUrl?: string | null; ctaUrl?: string | null; useAdsterra?: boolean; adsterraCode?: string | null } | null;
  hpBanner6?: { imageUrl?: string | null; ctaUrl?: string | null; useAdsterra?: boolean; adsterraCode?: string | null } | null;
}

function sportLabel(sport?: string | null) {
  if (!sport) return 'সাধারণ';
  const map: Record<string, string> = {
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
    others: 'অন্যান্য',
    'did-you-know': 'আপনি জানেন কি?',
    'on-this-day': 'এই দিনে',
  };
  return map[sport.toLowerCase()] ?? sport;
}

function Kicker({ sport }: { sport?: string | null }) {
  return (
    <span style={{
      fontFamily: 'var(--font-body)',
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'var(--ink-muted)',
      display: 'block',
      marginBottom: 7,
    }}>
      {sportLabel(sport)}
    </span>
  );
}

function CardLead({ article }: { article: Article }) {
  const headline = article.headlineBn || article.headline;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 12 }}>
      <Kicker sport={article.sport} />
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
        {article.mediaUrl && (
          <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid var(--ink-border)', marginBottom: 12, position: 'relative' }}>
            <Image
              src={article.mediaUrl}
              alt={headline || 'Image'}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        <h2 style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 'clamp(1.15rem, 1.9vw, 1.55rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          color: 'var(--ink)',
          marginBottom: 12,
          letterSpacing: '-0.01em',
        }}>
          {headline}
        </h2>
        {article.deck && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--ink)',
            opacity: 0.85,
          }}>
            {article.deck}
          </p>
        )}
      </Link>
      <div style={{ marginTop: 'auto' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-muted)', fontStyle: 'italic' }}>
          {article.byline || 'স্টাফ রিপোর্টার'}
        </span>
      </div>
    </div>
  );
}

function CardStandard({ article }: { article: Article }) {
  const headline = article.headlineBn || article.headline;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 12 }}>
      <Kicker sport={article.sport} />
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 8 }}>
        {article.mediaUrl && (
          <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid var(--ink-border)', marginBottom: 8, position: 'relative' }}>
            <Image
              src={article.mediaUrl}
              alt={headline || 'Image'}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        <h3 style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '0.95rem',
          fontWeight: 700,
          lineHeight: 1.25,
          color: 'var(--ink)',
          margin: 0
        }}>
          {headline}
        </h3>
      </Link>
      <div style={{ marginTop: 'auto' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--ink-muted)', fontStyle: 'italic' }}>
          {article.byline || 'স্টাফ রিপোর্টার'}
        </span>
      </div>
    </div>
  );
}

// Compact card: headline + date on left, small thumbnail on right — like cricket section
function CardCompact({ article }: { article: Article }) {
  const headline = article.headlineBn || article.headline;
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  return (
    <div style={{
      borderTop: '1px solid var(--ink-border)',
      paddingTop: 10,
      marginTop: 10,
    }}>
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Text side */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.25,
            color: 'var(--ink)',
            margin: '0 0 6px 0',
          }}>
            {headline}
          </h3>
          {date && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--ink-muted)' }}>
              {date}
            </span>
          )}
        </div>
        {/* Thumbnail */}
        {article.mediaUrl && (
          <div style={{ flexShrink: 0, width: 80, height: 56, position: 'relative', overflow: 'hidden', border: '1px solid var(--ink-border)' }}>
            <Image
              src={article.mediaUrl}
              alt={headline || ''}
              fill
              sizes="80px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
      </Link>
    </div>
  );
}

function CategorySection({ title, slug, articles, banner }: { title: string, slug: string, articles: Article[], banner?: { imageUrl?: string | null; ctaUrl?: string | null; useAdsterra?: boolean; adsterraCode?: string | null } | null }) {
  if (!articles || articles.length === 0) return null;

  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const latestArticle = articles[0];
  const secondArticle = articles[1];
  const thirdArticle = articles[2];
  const fourthArticle = articles[3];
  const hasPoster = latestArticle && latestArticle.publishedAt 
    ? new Date(latestArticle.publishedAt).getTime() >= twoDaysAgo 
    : false;

  return (
    <div style={{ marginBottom: 36, paddingBottom: 16, borderBottom: '1px solid var(--ink-border)' }}>
      {/* Ad Banner — Adsterra or standard */}
      {banner && (banner.useAdsterra ? (
        <AdsterraAd htmlCode={banner.adsterraCode} type="homepage" />
      ) : banner.imageUrl ? (
        <a href={banner.ctaUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', marginBottom: 16 }}>
          <img src={banner.imageUrl} alt="Advertisement" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </a>
      ) : null)}

      {/* Category Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1.5px solid #121212',
        paddingBottom: 6,
        marginBottom: 16
      }}>
        <h2 style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '1.3rem',
          fontWeight: 800,
          color: '#121212',
          margin: 0
        }}>
          {title}
        </h2>
      </div>

      {/* Grid Container for newses */}
      <div className={hasPoster ? "cat-grid-poster" : "cat-grid-standard"}>
        {hasPoster ? (
          <>
            {/* Left: Lead article with big image */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardLead article={latestArticle} />
              {/* Second article as compact below lead on left */}
              {secondArticle && <CardCompact article={secondArticle} />}
              
              {/* Larger Red Link filling the empty space at the bottom of left column */}
              <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', justifyContent: 'flex-start' }}>
                <Link 
                  href={`/sport/${slug}`} 
                  style={{ 
                    fontFamily: 'var(--font-headline)', 
                    fontSize: '16px', 
                    fontWeight: 800, 
                    color: 'var(--live-red)', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  সব খবর দেখুন <span style={{ fontSize: '20px', lineHeight: 1 }}>›</span>
                </Link>
              </div>
            </div>
            {/* Right: compact list of articles */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {thirdArticle && <CardCompact article={thirdArticle} />}
              {fourthArticle && <CardCompact article={fourthArticle} />}
              {articles[4] && <CardCompact article={articles[4]} />}
              {articles[5] && <CardCompact article={articles[5]} />}
            </div>
          </>
        ) : (
          <>
            <CardStandard article={latestArticle} />
            {secondArticle ? (
              <CardStandard article={secondArticle} />
            ) : (
              <div />
            )}
          </>
        )}
      </div>

      {/* Fallback View All for non-poster layout */}
      {!hasPoster && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <Link 
            href={`/sport/${slug}`} 
            style={{ 
              fontFamily: 'var(--font-headline)', 
              fontSize: '16px', 
              fontWeight: 800, 
              color: 'var(--live-red)', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            সব খবর দেখুন <span style={{ fontSize: '20px', lineHeight: 1 }}>›</span>
          </Link>
        </div>
      )}
    </div>
  );
}

function SidebarList({ articles }: { articles: Article[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 800,
        textTransform: 'uppercase',
        color: '#121212',
        borderBottom: '2.5px solid #121212',
        paddingBottom: 6,
        marginBottom: 8
      }}>
        অন্যান্য খবর
      </h3>
      {articles.map((article, i) => {
        const headline = article.headlineBn || article.headline;
        return (
          <div
            key={article.id}
            style={{
              paddingBottom: 16,
              borderBottom: i < articles.length - 1 ? '1px solid var(--ink-border)' : 'none',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            {article.mediaUrl && (
              <div style={{ width: 64, height: 64, flexShrink: 0, overflow: 'hidden', border: '1px solid var(--ink-border)', position: 'relative' }}>
                <Image src={article.mediaUrl} alt={headline} fill style={{ objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Kicker sport={article.sport} />
              <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
                <h4 style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: 'var(--ink)',
                  margin: 0
                }}>
                  {headline}
                </h4>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PhotoCardSection({ title, slug, articles }: { title: string, slug: string, articles: Article[] }) {
  if (!articles || articles.length === 0) return null;
  const latestArticle = articles[0];
  const headline = latestArticle.headlineBn || latestArticle.headline;
  
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 800,
        textTransform: 'uppercase',
        color: '#121212',
        borderBottom: '2.5px solid #121212',
        paddingBottom: 6,
        marginBottom: 12
      }}>
        {title}
      </h3>
      <Link href={`/article/${latestArticle.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', border: '1px solid var(--ink-border)', marginBottom: 8, position: 'relative' }}>
          {latestArticle.mediaUrl ? (
            <Image
              src={latestArticle.mediaUrl}
              alt={headline || title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
          )}
        </div>
        <h4 style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '1rem',
          fontWeight: 700,
          lineHeight: 1.25,
          color: 'var(--ink)',
          margin: 0
        }}>
          {headline}
        </h4>
      </Link>
    </div>
  );
}

export default function LowerSection({
  footballArticles,
  cricketArticles,
  interviewArticles,
  featureArticles,
  specialArticles,
  guestArticles,
  othersArticles,
  didYouKnowArticles = [],
  onThisDayArticles = [],
  hpBanner1,
  hpBanner2,
  hpBanner3,
  hpBanner4,
  hpBanner5,
  hpBanner6,
}: LowerSectionProps) {
  return (
    <section aria-label="সংবাদ বিভাগ" style={{ marginBottom: 32, marginTop: 24 }}>
      <style>{`
        .hp-main-grid {
          display: grid;
          grid-template-columns: 2.8fr 1.2fr;
          gap: 32px;
        }
        .hp-sidebar {
          border-left: 1px solid var(--ink-border);
          padding-left: 24px;
        }
        .cat-grid-poster {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          align-items: start;
        }
        .cat-grid-standard {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 1023px) {
          .hp-main-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .hp-sidebar {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--ink-border);
            padding-top: 24px;
          }
        }
        @media (max-width: 767px) {
          .cat-grid-poster {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .cat-grid-standard {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>

      <div className="hp-main-grid">
        {/* Main Feed Column */}
        <div>
          {/* Order Constraint: Football -> Cricket -> Interview -> Feature -> Special -> Guest Column */}
          <CategorySection title="ফুটবল" slug="football" articles={footballArticles} banner={hpBanner1} />
          <CategorySection title="ক্রিকেট" slug="cricket" articles={cricketArticles} banner={hpBanner2} />
          <CategorySection title="ইন্টারভিউ" slug="interview" articles={interviewArticles} banner={hpBanner3} />
          <CategorySection title="ফিচার" slug="feature" articles={featureArticles} banner={hpBanner4} />
          <CategorySection title="খেলার দেশ বিশেষ" slug="special" articles={specialArticles} banner={hpBanner5} />
          <CategorySection title="অতিথি কলাম" slug="guest-column" articles={guestArticles} banner={hpBanner6} />
        </div>

        {/* Sidebar Column */}
        <div className="hp-sidebar">
          {onThisDayArticles.length > 0 && (
            <PhotoCardSection title="এই দিনে" slug="on-this-day" articles={onThisDayArticles} />
          )}
          {didYouKnowArticles.length > 0 && (
            <PhotoCardSection title="আপনি জানেন কি?" slug="did-you-know" articles={didYouKnowArticles} />
          )}
          {othersArticles.length > 0 && (
            <SidebarList articles={othersArticles} />
          )}
        </div>
      </div>
    </section>
  );
}
