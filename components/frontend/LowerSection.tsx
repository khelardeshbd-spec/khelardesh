import Link from 'next/link';
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
    feature: 'ফিচার',
    interview: 'সাক্ষাৎকার',
    special: 'বিশেষ',
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

/* ─── Block A: Large Lead (image + big headline + deck) ─── */
function BlockLead({ article }: { article: Article }) {
  const headline = article.headlineBn || article.headline;
  return (
    <div style={{ gridArea: 'lead', borderBottom: '1px solid var(--ink-border)', paddingTop: 8 }}>
      <Kicker sport={article.sport} />
      {article.mediaUrl && (
        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', marginBottom: 8, border: '1px solid var(--ink-border)' }}>
          <img
            src={article.mediaUrl}
            alt={headline}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
        <h2 style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 'clamp(1.65rem, 2.8vw, 2.2rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          color: 'var(--ink)',
          marginBottom: 12,
          letterSpacing: '-0.01em',
        }}>
          {headline}
        </h2>
      </Link>
      {article.deck && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          lineHeight: 1.75,
          color: 'var(--ink)',
          opacity: 0.85,
          marginBottom: 12,
        }}>
          {article.deck}
        </p>
      )}
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--ink-muted)', fontStyle: 'italic' }}>
        {article.byline || 'স্টাফ রিপোর্টার'}
      </span>
    </div>
  );
}

/* ─── Block B: Horizontal Split (image left, text right) ─── */
function BlockHorizontal({ article }: { article: Article }) {
  const headline = article.headlineBn || article.headline;
  return (
    <div style={{ gridArea: 'mid', borderBottom: '1px solid var(--ink-border)', paddingBottom: 8 }}>
      <Kicker sport={article.sport} />
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {article.mediaUrl && (
          <div style={{ width: '45%', flexShrink: 0, aspectRatio: '3/2', overflow: 'hidden', border: '1px solid var(--ink-border)' }}>
            <img
              src={article.mediaUrl}
              alt={headline}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'var(--ink)',
            marginBottom: 8,
          }}>
            {headline}
          </h3>
          {article.deck && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              lineHeight: 1.6,
              color: 'var(--ink)',
              opacity: 0.75,
              WebkitLineClamp: 3,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {article.deck}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

/* ─── Block C: Text-Only Editorial (no image, drop-cap style) ─── */
function BlockTextOnly({ article }: { article: Article }) {
  const headline = article.headlineBn || article.headline;
  return (
    <div style={{ gridArea: 'text', borderBottom: '1px solid var(--ink-border)', paddingBottom: 8 }}>
      <Kicker sport={article.sport} />
      {article.mediaUrl && (
        <div style={{ width: '30%', flexShrink: 0, aspectRatio: '3/2', overflow: 'hidden', border: '1px solid var(--ink-border)', marginRight: 8 }}>
          <img src={article.mediaUrl} alt={headline} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
          fontWeight: 700,
          lineHeight: 1.25,
          color: 'var(--ink)',
          marginBottom: 10,
          fontStyle: 'italic',
        }}>
          {headline}
        </h3>
      </Link>
      {article.deck && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          lineHeight: 1.8,
          color: 'var(--ink)',
          opacity: 0.8,
        }}>
          {article.deck}
        </p>
      )}
      <div style={{ marginTop: 12, borderTop: '1px solid var(--ink-border)', paddingTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--ink-muted)', fontStyle: 'italic' }}>
          {article.byline || 'স্টাফ রিপোর্টার'}
        </span>
      </div>
    </div>
  );
}

/* ─── Block D: Sidebar Strip (headlines-only list) ─── */
function BlockStrip({ articles }: { articles: Article[] }) {
  return (
    <div style={{
      gridArea: 'strip',
      /* removed heavy left border for cleaner look */
      paddingLeft: 8,
      /* removed extra top border */
      paddingTop: 8,
    }}>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--ink-muted)',
        display: 'block',
        marginBottom: 14,
      }}>
        আরও খবর
      </span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {articles.map((article, i) => {
            const headline = article.headlineBn || article.headline;
            return (
              <div
                key={article.id}
                style={{
                  paddingBottom: 14,
                  marginBottom: 14,
                  borderBottom: i < articles.length - 1 ? '1px solid var(--ink-border)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {article.mediaUrl && (
                  <div style={{ width: 40, height: 40, overflow: 'hidden', borderRadius: 4, border: '1px solid var(--ink-border)' }}>
                    <img src={article.mediaUrl} alt={headline} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <Kicker sport={article.sport} />
                  <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
                    <h4 style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '0.95rem',
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
    </div>
  );
}

/* ─── Block E: Wide Horizontal Banner ─── */
function BlockWideBand({ article }: { article: Article }) {
  const headline = article.headlineBn || article.headline;
  return (
    <div style={{ gridArea: 'band', borderBottom: '1px solid var(--ink-border)', paddingTop: 8, paddingRight: 8 }}>
      <Kicker sport={article.sport} />
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 20, alignItems: 'center' }}>
        {article.mediaUrl && (
          <div style={{ width: '35%', flexShrink: 0, aspectRatio: '16/9', overflow: 'hidden', border: '1px solid var(--ink-border)' }}>
            <img
              src={article.mediaUrl}
              alt={headline}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'var(--ink)',
            marginBottom: 10,
          }}>
            {headline}
          </h3>
          {article.deck && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              lineHeight: 1.7,
              color: 'var(--ink)',
              opacity: 0.8,
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {article.deck}
            </p>
          )}
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--ink-muted)', fontStyle: 'italic', display: 'block', marginTop: 8 }}>
            {article.byline || 'স্টাফ রিপোর্টার'}
          </span>
        </div>
      </Link>
    </div>
  );
}

/* ─── Main Component ──────────────────────────── */
export default function LowerSection({ articles }: LowerSectionProps) {
  const a = articles;
  if (!a || a.length === 0) return null;

  // Assign articles to blocks: 0=Lead, 1=Horizontal, 2=TextOnly, 3-5=Strip, 6=WideBand
  const lead     = a[0];
  const horiz    = a[1];
  const textOnly = a[2];
  const strip    = a.slice(3, 7);
  const band     = a[7] ?? a[3];

  return (
    <section aria-label="সংবাদ বিভাগ" style={{ marginBottom: 32 }}>
      {/* ─── Responsive Grid Styles ─── */}
      <style>{`
        .ls-grid {
          display: grid;
          /* Proportional columns – strip shrinks on wide screens */
          grid-template-columns: 2fr 1fr 1fr minmax(180px, 1fr);
          grid-template-rows: auto auto auto;
          grid-template-areas:
            "lead lead mid  strip"
            "lead lead text strip"
            "band band band strip";
          gap: 0 12px;
          row-gap: 16px;
        }
        @media (max-width: 1023px) {
          .ls-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-areas:
              "lead lead"
              "mid  text"
              "band band"
              "strip strip";
          }
        }
        @media (max-width: 900px) {
          /* Collapse strip to full‑width horizontal band on medium screens */
          .ls-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
              "lead"
              "mid"
              "band"
              "text"
              "strip";
          }
        }
        @media (max-width: 639px) {
          .ls-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
              "lead"
              "mid"
              "band"
              "text"
              "strip";
          }
        }
        @media (max-width: 1023px) {
          .ls-strip { border-left: none !important; padding-left: 0 !important; border-top: 3px solid var(--ink) !important; }
        }
      `}</style>

      {/* ─── Section Header ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        borderTop: '4px double var(--ink)',
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

      {/* ─── Editorial Grid ─── */}
      <div className="ls-grid">
        {lead     && <BlockLead      article={lead} />}
        {horiz    && <BlockHorizontal article={horiz} />}
        {textOnly && <BlockTextOnly   article={textOnly} />}
        {strip.length > 0 && <BlockStrip articles={strip} />}
        {band     && <BlockWideBand   article={band} />}
      </div>

      {/* ─── More Stories Below ─── */}
      <div style={{ marginTop: 32, borderTop: '4px double var(--ink)', paddingTop: 8 }}>
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
              অন্যান্য
            </span>
            <CategoryColumnFeed category="other" skipIds={[a[0]?.id, a[1]?.id, a[2]?.id, a[3]?.id, a[4]?.id, a[5]?.id, a[6]?.id, a[7]?.id].filter(Boolean) as number[]} />
          </div>
        </div>
      </div>
    </section>
  );
}
