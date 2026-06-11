import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import LeadStory from '@/components/frontend/LeadStory';
import HomeSlider from '@/components/frontend/HomeSlider';
import ArticleCard from '@/components/frontend/ArticleCard';
import ScoresStrip from '@/components/frontend/ScoresStrip';
import SponsorBlock from '@/components/frontend/SponsorBlock';
import Sidebar from '@/components/frontend/Sidebar';
import SkeletonCard from '@/components/frontend/SkeletonCard';
import Masthead from '@/components/frontend/Masthead';
import BriefsColumn from '@/components/frontend/BriefsColumn';

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
      .limit(4),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('isLead', false)
      .order('publishedAt', { ascending: false })
      .limit(20),
    supabaseAdmin
      .from('ScoreCard')
      .select('*')
      .eq('is_visible', true)
      .order('isLive', { ascending: false })
      .order('displayOrder', { ascending: true }),
    supabaseAdmin
      .from('Sponsor')
      .select('*')
      .eq('isActive', true)
      .order('displayOrder', { ascending: true }),
  ]);

  const leads = leadResult.status === 'fulfilled' ? (leadResult.value.data ?? []) : [];
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
        {/* Left Column (18%): Logo at top & BriefsColumn */}
        <div 
          className="flex flex-col h-screen sticky top-0 pb-4 gap-4"
          style={{ overflow: 'hidden' }}
        >
          <div className="flex-shrink-0 pt-2">
            <Masthead />
          </div>
          <div className="flex-grow overflow-y-auto scrollbar-none pr-1">
            <BriefsColumn articles={articles} />
          </div>
        </div>

        {/* Middle Column (64%): Main article feed */}
        <div className="pt-28">
          {/* Lead story Slider */}
          {leads.length > 0 && (
            <div className="mb-8 mt-2">
              <HomeSlider articles={leads} />
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
                  {i === 2 && inlineSponsors[0] && (
                    <SponsorBlock
                      label={inlineSponsors[0].label}
                      title={inlineSponsors[0].title}
                      subtitle={inlineSponsors[0].subtitle}
                      ctaText={inlineSponsors[0].ctaText}
                      ctaUrl={inlineSponsors[0].ctaUrl}
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

        {/* Right Column (18%): Scores & Sponsors (also independently scrollable) */}
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
          <Sidebar scores={scores} sponsors={sponsors} />
        </div>
      </div>

      {/* ── MOBILE LAYOUT < 1024px ── */}
      <div className="lg:hidden">
        {/* Lead story Slider */}
        {leads.length > 0 && (
          <div className="px-4 pt-4 pb-4">
            <HomeSlider articles={leads} />
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
                fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                borderBottom: '1px solid var(--ink-border)',
                paddingBottom: 5,
                marginBottom: 0,
                marginTop: 12,
              }}
              lang="bn"
            >
              আরও খবর
            </h2>
          )}

          {articles.map((article, i) => (
            <div key={article.id}>
              <ArticleCard article={article} />
              {i === 2 && inlineSponsors[0] && (
                <SponsorBlock
                  label={inlineSponsors[0].label}
                  title={inlineSponsors[0].title}
                  subtitle={inlineSponsors[0].subtitle}
                  ctaText={inlineSponsors[0].ctaText}
                  ctaUrl={inlineSponsors[0].ctaUrl}
                />
              )}
            </div>
          ))}

          {/* Load more */}
          <div className="py-8 text-center">
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
              lang="bn"
            >
              আরও লোড করুন
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
