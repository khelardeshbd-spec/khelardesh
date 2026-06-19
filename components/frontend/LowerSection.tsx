'use client';

import { useState, useRef, useEffect } from 'react';
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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 24 }}>
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

function CategoryDropdown({ articles, hasPoster }: { articles: Article[], hasPoster: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayArticles = hasPoster ? articles.slice(1) : articles;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (displayArticles.length === 0) return null;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: '1px solid var(--ink-border)',
          borderRadius: '4px',
          padding: '4px 10px',
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--ink)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: '#fafafa',
          transition: 'all 0.2s ease',
        }}
      >
        অন্যান্য খবর <span style={{ fontSize: '8px', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▼</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 4px)',
          backgroundColor: '#ffffff',
          border: '1px solid var(--ink-border)',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          width: '260px',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 100,
          padding: '6px 0',
        }}>
          {displayArticles.map((art) => (
            <Link
              key={art.id}
              href={`/article/${art.slug}`}
              onClick={() => setIsOpen(false)}
              style={{
                display: 'block',
                padding: '8px 12px',
                textDecoration: 'none',
                color: 'var(--ink)',
                borderBottom: '1px solid #f5f5f5',
                fontSize: '12px',
                lineHeight: '1.4',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
              }}
            >
              {art.headlineBn || art.headline}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CategorySection({ title, articles }: { title: string, articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const latestArticle = articles[0];
  const hasPoster = latestArticle && latestArticle.publishedAt 
    ? new Date(latestArticle.publishedAt).getTime() >= twoDaysAgo 
    : false;

  return (
    <div style={{ marginBottom: 32 }}>
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
        <CategoryDropdown articles={articles} hasPoster={hasPoster} />
      </div>

      {/* Big Poster layout if within 2 days */}
      {hasPoster ? (
        <CardLead article={latestArticle} />
      ) : (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--ink-muted)',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '16px 0',
          border: '1px dashed var(--ink-border)',
          borderRadius: '4px'
        }}>
          গত দুই দিনের কোনো খবর নেই। অন্যান্য খবরের জন্য মেনুটি দেখুন।
        </p>
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
      `}</style>

      <div className="hp-main-grid">
        {/* Main Feed Column */}
        <div>
          {/* Order Constraint: Football -> Cricket -> Interview -> Feature -> Special -> Guest Column */}
          <CategorySection title="ফুটবল" articles={footballArticles} />
          <CategorySection title="ক্রিকেট" articles={cricketArticles} />
          <CategorySection title="ইন্টারভিউ" articles={interviewArticles} />
          <CategorySection title="ফিচার" articles={featureArticles} />
          <CategorySection title="খেলার দেশ বিশেষ" articles={specialArticles} />
          <CategorySection title="অতিথি কলাম" articles={guestArticles} />
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
