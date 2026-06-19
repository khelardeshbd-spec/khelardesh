'use client';

import Link from 'next/link';
import Image from 'next/image';

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
          fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)',
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
          fontSize: '1.05rem',
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

function CategorySection({ title, slug, articles }: { title: string, slug: string, articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const latestArticle = articles[0];
  const secondArticle = articles[1];
  const hasPoster = latestArticle && latestArticle.publishedAt 
    ? new Date(latestArticle.publishedAt).getTime() >= twoDaysAgo 
    : false;

  return (
    <div style={{ marginBottom: 36, paddingBottom: 16, borderBottom: '1px solid var(--ink-border)' }}>
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

      {/* Grid Container for 2 newses */}
      <div className={hasPoster ? "cat-grid-poster" : "cat-grid-standard"}>
        {hasPoster ? (
          <>
            <CardLead article={latestArticle} />
            {secondArticle ? (
              <CardStandard article={secondArticle} />
            ) : (
              <div />
            )}
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

      {/* Red Link at Bottom Right to View All */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <Link 
          href={`/sport/${slug}`} 
          style={{ 
            fontFamily: 'var(--font-body)', 
            fontSize: '12px', 
            fontWeight: 700, 
            color: 'var(--live-red)', 
            textDecoration: 'none' 
          }}
        >
          সব খবর দেখুন ›
        </Link>
      </div>
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

export default function LowerSection({
  footballArticles,
  cricketArticles,
  interviewArticles,
  featureArticles,
  specialArticles,
  guestArticles,
  othersArticles,
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
          <CategorySection title="ফুটবল" slug="football" articles={footballArticles} />
          <CategorySection title="ক্রিকেট" slug="cricket" articles={cricketArticles} />
          <CategorySection title="ইন্টারভিউ" slug="interview" articles={interviewArticles} />
          <CategorySection title="ফিচার" slug="feature" articles={featureArticles} />
          <CategorySection title="খেলার দেশ বিশেষ" slug="special" articles={specialArticles} />
          <CategorySection title="অতিথি কলাম" slug="guest-column" articles={guestArticles} />
        </div>

        {/* Sidebar Column */}
        {othersArticles.length > 0 && (
          <div className="hp-sidebar">
            <SidebarList articles={othersArticles} />
          </div>
        )}
      </div>
    </section>
  );
}
