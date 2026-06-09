import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import LeadStory from '@/components/LeadStory';
import ArticleCard from '@/components/ArticleCard';
import SponsorBlock from '@/components/SponsorBlock';
import Sidebar from '@/components/Sidebar';
import Masthead from '@/components/Masthead';
import BriefsColumn from '@/components/BriefsColumn';

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
      {/* Sport heading */}
      <div
        className="px-4 lg:px-6 pt-6 pb-0 max-w-screen-xl mx-auto"
        style={{ borderBottom: '1.5px solid var(--ink)' }}
      >
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
            fontWeight: 900,
            fontSize: 'clamp(28px, 4vw, 48px)',
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            marginBottom: 4,
          }}
        >
          <span lang="bn">{sportBn}</span>
        </h1>
      </div>

      {/* Desktop */}
      <div 
        className="hidden lg:grid max-w-[1440px] mx-auto px-6 pt-4 pb-12 gap-6"
        style={{ gridTemplateColumns: '18fr 64fr 18fr' }}
      >
        {/* Left Column (18%): Logo at top (static header) & Independently scrollable scores */}
        <div 
          className="flex flex-col h-screen sticky top-0 pb-4 gap-4"
          style={{ overflow: 'hidden' }}
        >
          <div className="flex-shrink-0 pt-4">
            <Masthead />
          </div>
          <div className="flex-grow overflow-y-auto scrollbar-none pr-1">
            <Sidebar scores={scoresList} sponsors={sponsorsList} />
          </div>
        </div>

        {/* Middle Column (64%): Main article feed */}
        <div>
          {lead && <div className="mb-8 mt-2"><LeadStory article={lead} /></div>}
          {articlesList.map((article, i) => (
            <div key={article.id}>
              <ArticleCard article={article} />
              {(i + 1) % 3 === 0 && inlineSponsors[Math.floor(i / 3) % inlineSponsors.length] && (
                <SponsorBlock
                  {...inlineSponsors[Math.floor(i / 3) % inlineSponsors.length]}
                />
              )}
            </div>
          ))}
          {articlesList.length === 0 && (
            <p style={{ color: 'var(--ink-muted)', fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif", fontSize: 14, padding: '24px 0' }}>
              এই বিভাগে কোনো খবর নেই।
            </p>
          )}
        </div>

        {/* Right Column (18%): Briefs & Headlines (independently scrollable) */}
        <div 
          style={{ 
            position: 'sticky', 
            top: '20px', 
            maxHeight: 'calc(100vh - 40px)', 
            overflowY: 'auto',
            paddingLeft: '4px'
          }}
          className="scrollbar-none"
        >
          <BriefsColumn articles={articlesList} />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden px-4 pb-12">
        {lead && <div className="pt-4"><LeadStory article={lead} /></div>}
        {articlesList.map((article, i) => (
          <div key={article.id}>
            <ArticleCard article={article} />
            {(i + 1) % 3 === 0 && inlineSponsors[Math.floor(i / 3) % inlineSponsors.length] && (
              <SponsorBlock {...inlineSponsors[Math.floor(i / 3) % inlineSponsors.length]} />
            )}
          </div>
        ))}
        {articlesList.length === 0 && (
          <p style={{ color: 'var(--ink-muted)', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, paddingTop: 24 }}>
            এই বিভাগে কোনো খবর নেই।
          </p>
        )}
      </div>
    </div>
  );
}
