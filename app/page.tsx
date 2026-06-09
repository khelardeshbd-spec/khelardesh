import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import LeadStory from '@/components/LeadStory';
import ArticleCard from '@/components/ArticleCard';
import ScoresStrip from '@/components/ScoresStrip';
import SponsorBlock from '@/components/SponsorBlock';
import Sidebar from '@/components/Sidebar';
import SkeletonCard from '@/components/SkeletonCard';
import Masthead from '@/components/Masthead';
import BriefsColumn from '@/components/BriefsColumn';

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
  // Fetch data server-side via Supabase
  const [leadResult, articlesResult, scoresResult, sponsorsResult] = await Promise.allSettled([
    supabaseAdmin
      .from('Article')
      .select('*')
      .eq('isLead', true)
      .order('publishedAt', { ascending: false })
      .limit(1)
      .single(),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('isLead', false)
      .order('publishedAt', { ascending: false })
      .limit(20),
    supabaseAdmin
      .from('ScoreCard')
      .select('*')
      .order('isLive', { ascending: false })
      .order('displayOrder', { ascending: true }),
    supabaseAdmin
      .from('Sponsor')
      .select('*')
      .eq('isActive', true)
      .order('displayOrder', { ascending: true }),
  ]);

  const lead = leadResult.status === 'fulfilled' ? leadResult.value.data : null;
  const articles = articlesResult.status === 'fulfilled' ? (articlesResult.value.data ?? []) : [];
  const scores = scoresResult.status === 'fulfilled' ? (scoresResult.value.data ?? []) : [];
  const sponsors = sponsorsResult.status === 'fulfilled' ? (sponsorsResult.value.data ?? []) : [];

  const inlineSponsors = sponsors.filter((s) => s.placement === 'inline');

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* ── DESKTOP LAYOUT ≥ 1024px ── */}
      <div 
        className="hidden lg:grid max-w-[1440px] mx-auto px-6 pb-12 gap-6"
        style={{ gridTemplateColumns: '18fr 64fr 18fr' }}
      >
        {/* Left Column (18%): Logo at top (static header) & Independency scrollable scores */}
        <div 
          className="flex flex-col h-screen sticky top-0 pb-4 gap-4"
          style={{ overflow: 'hidden' }}
        >
          <div className="flex-shrink-0 pt-2">
            <Masthead />
          </div>
          <div className="flex-grow overflow-y-auto scrollbar-none pr-1">
            <Sidebar scores={scores} sponsors={sponsors} />
          </div>
        </div>

        {/* Middle Column (64%): Main article feed */}
        <div className="pt-28">
          {/* Lead story */}
          {lead && (
            <div className="mb-8 mt-2">
              <LeadStory article={lead} />
            </div>
          )}

          {/* More stories heading */}
          {articles.length > 0 && (
            <>
              <h2
                style={{
                  fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
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
                fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
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

        {/* Right Column (18%): Briefs & Headlines (also independently scrollable) */}
        <div 
          style={{ 
            position: 'sticky', 
            top: '120px', 
            maxHeight: 'calc(100vh - 140px)', 
            overflowY: 'auto',
            paddingLeft: '4px'
          }}
          className="scrollbar-none pt-28"
        >
          <BriefsColumn articles={articles} />
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
