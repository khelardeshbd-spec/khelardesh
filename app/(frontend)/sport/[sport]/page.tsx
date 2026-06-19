import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import LeadStory from '@/components/frontend/LeadStory';
import ArticleCard from '@/components/frontend/ArticleCard';
import SponsorBlock from '@/components/frontend/SponsorBlock';
import Sidebar from '@/components/frontend/Sidebar';
import Masthead from '@/components/frontend/Masthead';
import BriefsColumn from '@/components/frontend/BriefsColumn';

export const dynamic = 'force-dynamic';




interface PageProps {
  params: { sport: string };
}

const SPORT_NAMES: Record<string, string> = {
  football: 'ফুটবল',
  cricket: 'ক্রিকেট',
  basketball: 'বাস্কেটবল',
  tennis: 'টেনিস',
  f1: 'F1',
  rugby: 'রাগবি',
  athletics: 'অ্যাথলেটিক্স',
  other: 'অন্যান্য',
};

const VALID_SPORTS = Object.keys(SPORT_NAMES);


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sportBn = SPORT_NAMES[params.sport];
  if (!sportBn) return { title: 'Sport Not Found' };
  return {
    title: `${sportBn} — খেলারদেশ`,
    description: `${sportBn} সংক্রান্ত সর্বশেষ খবর।`,
  };
}

/**
 * Sport-filtered feed page — Section 4
 * Same layout as homepage but filtered to one sport
 */
export default async function SportPage({ params }: PageProps) {
  if (!VALID_SPORTS.includes(params.sport)) notFound();

  const [{ data: leadArr }, { data: articles }, { data: scores }, { data: sponsors }] = await Promise.all([
    supabaseAdmin
      .from('Article')
      .select('*')
      .eq('sport', params.sport)
      .eq('isLead', true)
      .order('publishedAt', { ascending: false })
      .limit(1),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('sport', params.sport)
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

  const lead = leadArr?.[0] ?? null;
  const articlesList = articles ?? [];
  const scoresList = scores ?? [];
  const sponsorsList = sponsors ?? [];

  const inlineSponsors = sponsorsList.filter((s) => s.placement === 'inline');
  const sportBn = SPORT_NAMES[params.sport];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Desktop */}
      <div 
        className="hidden lg:grid max-w-[1200px] mx-auto px-6 pb-12 gap-8"
        style={{ gridTemplateColumns: '3fr 1fr' }}
      >
        {/* Main Column (Left): Sport heading & Feed */}
        <div className="pt-8">
          {/* Sport heading */}
          <div
            className="pb-2 mb-6"
            style={{ borderBottom: '1.5px solid var(--ink)' }}
          >
            <h1
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 900,
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                marginBottom: 4,
              }}
            >
              <span lang="bn">{sportBn}</span>
            </h1>
          </div>

          {lead && <div className="mb-8 mt-2"><LeadStory article={lead} /></div>}
          {articlesList.map((article, i) => (
            <div key={article.id}>
              <ArticleCard article={article} />
              {i === 2 && inlineSponsors[0] && (
                <SponsorBlock {...inlineSponsors[0]} />
              )}
            </div>
          ))}
          {articlesList.length === 0 && (
            <p style={{ color: 'var(--ink-muted)', fontFamily: "var(--font-body)", fontSize: 14, padding: '24px 0' }}>
              এই বিভাগে কোনো খবর নেই।
            </p>
          )}
        </div>

        {/* Right Column: Scores & Sponsors (independently scrollable) */}
        <div 
          style={{ 
            position: 'sticky', 
            top: '120px', 
            maxHeight: 'calc(100vh - 140px)', 
            overflowY: 'auto',
            paddingLeft: '4px'
          }}
          className="scrollbar-none pt-8"
        >
          <Sidebar scores={scoresList} sponsors={sponsorsList} />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden px-4 pb-12">
        {/* Sport heading */}
        <div
          className="pt-4 pb-2 mb-4"
          style={{ borderBottom: '1.5px solid var(--ink)' }}
        >
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 900,
              fontSize: '28px',
              color: 'var(--ink)',
              marginBottom: 4,
            }}
          >
            <span lang="bn">{sportBn}</span>
          </h1>
        </div>

        {lead && <div className="pt-4"><LeadStory article={lead} /></div>}
        {articlesList.map((article, i) => (
          <div key={article.id}>
            <ArticleCard article={article} />
            {i === 2 && inlineSponsors[0] && (
              <SponsorBlock {...inlineSponsors[0]} />
            )}
          </div>
        ))}
        {articlesList.length === 0 && (
          <p style={{ color: 'var(--ink-muted)', fontFamily: "var(--font-body)", fontSize: 14, paddingTop: 24 }} lang="bn">
            এই বিভাগে কোনো খবর নেই।
          </p>
        )}
      </div>
    </div>
  );
}
