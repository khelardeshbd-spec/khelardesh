import type { Metadata } from 'next';
import { getPrisma } from '@/lib/prisma';
import LeadStory from '@/components/LeadStory';
import ArticleCard from '@/components/ArticleCard';
import ScoresStrip from '@/components/ScoresStrip';
import SponsorBlock from '@/components/SponsorBlock';
import Sidebar from '@/components/Sidebar';
import SkeletonCard from '@/components/SkeletonCard';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';




export const metadata: Metadata = {
  title: 'খেলারদেশ — স্পোর্টস · স্বতন্ত্র',
  description: 'স্বাধীন বাংলাদেশি স্পোর্টস নিউজ। ফুটবল, ক্রিকেট, বাস্কেটবল, টেনিস, F1 এবং আরও অনেক কিছু।',
};

export const revalidate = 30; // ISR every 30 seconds

/**
 * Homepage — Section 4 / 8
 * Mobile: Lead → Scores strip → Story feed (sponsor every 3rd)
 * Desktop: 2fr main + 1fr sidebar
 */
export default async function HomePage() {
  const prisma = getPrisma();
  // Fetch data server-side
  const [leadResult, articlesResult, scoresResult, sponsorsResult] = await Promise.allSettled([
    prisma.article.findFirst({
      where: { isLead: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.article.findMany({
      where: { isLead: false },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      select: {
        id: true, slug: true, headline: true, headlineBn: true,
        deck: true, sport: true, mediaType: true, mediaUrl: true,
        byline: true, publishedAt: true,
      },
    }),
    prisma.scoreCard.findMany({
      orderBy: [{ isLive: 'desc' }, { displayOrder: 'asc' }],
    }),
    prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  const lead = leadResult.status === 'fulfilled' ? leadResult.value : null;
  const articles = articlesResult.status === 'fulfilled' ? articlesResult.value : [];
  const scores = scoresResult.status === 'fulfilled' ? scoresResult.value : [];
  const sponsors = sponsorsResult.status === 'fulfilled' ? sponsorsResult.value : [];

  const inlineSponsors = sponsors.filter((s) => s.placement === 'inline');

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* ── DESKTOP LAYOUT ≥ 1024px ── */}
      <div className="hidden lg:grid max-w-screen-xl mx-auto px-6 pt-6 pb-12 gap-8"
        style={{ gridTemplateColumns: '2fr 1fr' }}>

        {/* Main column */}
        <div>
          {/* Lead story */}
          {lead && (
            <div className="mb-8">
              <LeadStory article={lead} />
            </div>
          )}

          {/* More stories heading */}
          {articles.length > 0 && (
            <>
              <h2
                style={{
                  fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                  fontSize: 8,
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  borderBottom: '1px solid var(--ink-border)',
                  paddingBottom: 6,
                  marginBottom: 0,
                }}
              >
                আরও খবর
              </h2>
              {/* Story feed with sponsor every 3 stories */}
              {articles.map((article, i) => (
                <div key={article.id}>
                  <ArticleCard article={article} />
                  {(i + 1) % 3 === 0 && inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length] && (
                    <SponsorBlock
                      label={inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length].label}
                      title={inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length].title}
                      subtitle={inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length].subtitle}
                      ctaText={inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length].ctaText}
                      ctaUrl={inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length].ctaUrl}
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {/* Load more */}
          <div className="mt-8 text-center">
            <a
              href="/?page=2"
              style={{
                fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--ink-border)',
                textUnderlineOffset: 3,
              }}
            >
              আরও লোড করুন
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <Sidebar scores={scores} sponsors={sponsors} />
        </div>
      </div>

      {/* ── MOBILE LAYOUT < 1024px ── */}
      <div className="lg:hidden">
        {/* Lead story */}
        {lead && (
          <div className="px-4 pt-4 pb-4">
            <LeadStory article={lead} />
          </div>
        )}

        {/* Scores strip */}
        {scores.length > 0 && (
          <div className="mb-2">
            <ScoresStrip scores={scores} />
          </div>
        )}

        {/* Story feed */}
        <div className="px-4">
          {articles.length > 0 && (
            <h2
              style={{
                fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                fontSize: 8,
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                borderBottom: '1px solid var(--ink-border)',
                paddingBottom: 5,
                marginBottom: 0,
                marginTop: 12,
              }}
            >
              আরও খবর
            </h2>
          )}

          {articles.map((article, i) => (
            <div key={article.id}>
              <ArticleCard article={article} />
              {(i + 1) % 3 === 0 && inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length] && (
                <SponsorBlock
                  label={inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length].label}
                  title={inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length].title}
                  subtitle={inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length].subtitle}
                  ctaText={inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length].ctaText}
                  ctaUrl={inlineSponsors[(Math.floor(i / 3)) % inlineSponsors.length].ctaUrl}
                />
              )}
            </div>
          ))}

          {/* Load more */}
          <div className="py-8 text-center">
            <a
              href="/?page=2"
              style={{
                fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--ink-border)',
                textUnderlineOffset: 3,
              }}
            >
              আরও লোড করুন
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
