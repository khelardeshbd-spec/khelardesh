import Link from 'next/link';
import Image from 'next/image';
import CategoryColumnFeed from './CategoryColumnFeed';

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
  articles: Article[];
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

/* ─── Kicker label ─────────────────────────────── */
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

/* ─── CardLead: Large Featured Article ─── */
function CardLead({ article }: { article: Article }) {
  const headline = article.headlineBn || article.headline;
  return (
    <div style={{ gridArea: 'lead', display: 'flex', flexDirection: 'column' }}>
      <Kicker sport={article.sport} />
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
        {article.mediaUrl && (
          <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid var(--ink-border)', marginBottom: 12, position: 'relative' }}>
            <Image
              src={article.mediaUrl}
              alt={headline || 'Image'}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        <h2 style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
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
            fontSize: 14,
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

/* ─── CardStandard: Medium Article ─── */
function CardStandard({ article, area }: { article: Article, area: string }) {
  const headline = article.headlineBn || article.headline;
  return (
    <div style={{ gridArea: area, display: 'flex', flexDirection: 'column' }}>
      <Kicker sport={article.sport} />
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
        {article.mediaUrl && (
          <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid var(--ink-border)', marginBottom: 12, position: 'relative' }}>
            <Image
              src={article.mediaUrl}
              alt={headline || 'Image'}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        <h3 style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '1.2rem',
          fontWeight: 700,
          lineHeight: 1.25,
          color: 'var(--ink)',
        }}>
          {headline}
        </h3>
      </Link>
      <div style={{ marginTop: 'auto' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-muted)', fontStyle: 'italic' }}>
          {article.byline || 'স্টাফ রিপোর্টার'}
        </span>
      </div>
    </div>
  );
}

/* ─── CardList: Sidebar Feed ─── */
function CardList({ articles }: { articles: Article[] }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--ink-muted)',
        display: 'block',
        marginBottom: 8,
      }}>
        অন্যান্য
      </span>
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
                <Image src={article.mediaUrl} alt={headline || 'Image'} fill style={{ objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Kicker sport={article.sport} />
              <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
                <h4 style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: 'var(--ink)',
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

/* ─── Main Component ──────────────────────────── */
export default function LowerSection({ articles }: LowerSectionProps) {
  const a = articles;
  if (!a || a.length === 0) return null;

  // Distribute articles across the 3-column grid
  const lead = a[0];
  const sub1 = a[1];
  const sub2 = a[2];
  // the rest goes to list
  const list = a.slice(3, 8);

  return (
    <section aria-label="সংবাদ বিভাগ" style={{ marginBottom: 32 }}>
      {/* ─── Responsive Grid Styles ─── */}
      <style>{`
        .ls-grid-clean {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-areas:
            "lead lead strip"
            "sub1 sub2 strip";
          gap: 24px;
        }
        .ls-strip-container {
          grid-area: strip;
          border-left: 1px solid var(--ink-border);
          padding-left: 24px;
        }
        @media (max-width: 1023px) {
          .ls-grid-clean {
            grid-template-columns: 1fr 1fr;
            grid-template-areas:
              "lead lead"
              "sub1 sub2"
              "strip strip";
          }
          .ls-strip-container {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--ink-border);
            padding-top: 24px;
          }
        }
        @media (max-width: 639px) {
          .ls-grid-clean {
            grid-template-columns: 1fr;
            grid-template-areas:
              "lead"
              "sub1"
              "sub2"
              "strip";
          }
        }
      `}</style>

      {/* ─── Section Header ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
        borderTop: '1px solid var(--ink-border)',
        paddingTop: 8,
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          paddingRight: 8,
          borderRight: '1px solid var(--ink-border)',
        }}>
          সর্বশেষ
        </span>
        <span style={{ flex: 1, height: 1, backgroundColor: 'var(--ink-border)' }} />
      </div>

      {/* ─── Clean 3-Column Grid ─── */}
      <div className="ls-grid-clean">
        {lead && <CardLead article={lead} />}
        {sub1 && <CardStandard article={sub1} area="sub1" />}
        {sub2 && <CardStandard article={sub2} area="sub2" />}
        {list.length > 0 && (
          <div className="ls-strip-container">
            <CardList articles={list} />
          </div>
        )}
      </div>

      {/* ─── More Stories Below ─── */}
      <div style={{ marginTop: 32, borderTop: '1px solid var(--ink-border)', paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            paddingRight: 8,
            borderRight: '1px solid var(--ink-border)',
          }}>
            আরও পড়ুন
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'var(--ink-border)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }} className="more-stories-grid">
          <style>{`
            @media (max-width: 767px) {
              .more-stories-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
          <div style={{ borderRight: '1px solid var(--ink-border)', paddingRight: 20 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 12 }}>
              ফুটবল
            </span>
            <CategoryColumnFeed category="football" skipIds={[a[0]?.id, a[1]?.id, a[2]?.id, a[3]?.id, a[4]?.id, a[5]?.id, a[6]?.id, a[7]?.id].filter(Boolean) as number[]} />
          </div>
          <div style={{ borderRight: '1px solid var(--ink-border)', paddingRight: 20, paddingLeft: 4 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 12 }}>
              ক্রিকেট
            </span>
            <CategoryColumnFeed category="cricket" skipIds={[a[0]?.id, a[1]?.id, a[2]?.id, a[3]?.id, a[4]?.id, a[5]?.id, a[6]?.id, a[7]?.id].filter(Boolean) as number[]} />
          </div>
          <div style={{ paddingLeft: 4 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 12 }}>
              খেলার দেশ বিশেষ
            </span>
            <CategoryColumnFeed category="special" skipIds={[a[0]?.id, a[1]?.id, a[2]?.id, a[3]?.id, a[4]?.id, a[5]?.id, a[6]?.id, a[7]?.id].filter(Boolean) as number[]} />
          </div>
        </div>
      </div>
    </section>
  );
}
