import type { Metadata } from 'next';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import LeadStory from '@/components/frontend/LeadStory';
import HomeSlider from '@/components/frontend/HomeSlider';
import ArticleCard from '@/components/frontend/ArticleCard';
import ScoresStrip from '@/components/frontend/ScoresStrip';
import SponsorBlock from '@/components/frontend/SponsorBlock';
import Sidebar from '@/components/frontend/Sidebar';
import SkeletonCard from '@/components/frontend/SkeletonCard';
import BriefsColumn from '@/components/frontend/BriefsColumn';
import { MotionDiv } from '@/components/frontend/MotionDiv';
import { staggerContainer, fadeUp } from '@/lib/animations';
import InfiniteArticleFeed from '@/components/frontend/InfiniteArticleFeed';

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
    <div style={{ backgroundColor: '#ffffff', color: '#121212', minHeight: '100vh', padding: '8px 0', fontFamily: 'var(--font-body)' }}>
      <div className="max-w-[1200px] mx-auto bg-[#ffffff] px-6 py-2">
        
        {/* MASTHEAD: LOGO ON TOP & REORGANIZED CONTROLS */}
        <div className="w-full text-[#121212] mb-2">
          {/* Tier 1: Logo and Sponsors (Symmetrical Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center border-b border-[#e2e2e2] pb-2 mb-1.5">
            {/* Left Sponsor Block */}
            <div className="hidden lg:flex lg:col-span-3 h-[75px] bg-[#fafafa] text-[#121212] p-2 flex-col justify-center items-center border border-[#e2e2e2] rounded-[3px]">
              {sponsors[0] ? (
                <a href={sponsors[0].linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full h-full flex flex-col justify-center items-center">
                  {sponsors[0].logoUrl ? (
                    <img src={sponsors[0].logoUrl} alt={sponsors[0].name} className="max-h-[40px] w-auto object-contain" />
                  ) : (
                    <span className="text-xs font-bold">{sponsors[0].name}</span>
                  )}
                  <span className="text-[8px] text-gray-400 mt-1 uppercase font-sans">Sponsor</span>
                </a>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-gray-400 font-sans tracking-wider">ADVERTISEMENT</span>
                  <span className="text-[9px] text-gray-300 font-sans mt-0.5">বিজ্ঞাপন দিন</span>
                </div>
              )}
            </div>

            {/* Center Logo */}
            <div className="col-span-1 lg:col-span-6 text-center flex flex-col items-center">
              <img src="/images/khelardesh_logo.png" alt="খেলারদেশ" className="mx-auto select-none" style={{ maxWidth: '100%', height: 'auto', maxHeight: '75px' }} />
            </div>

            {/* Right Sponsor Block */}
            <div className="hidden lg:flex lg:col-span-3 h-[75px] bg-[#fafafa] text-[#121212] p-2 flex-col justify-center items-center border border-[#e2e2e2] rounded-[3px]">
              {sponsors[1] ? (
                <a href={sponsors[1].linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full h-full flex flex-col justify-center items-center">
                  {sponsors[1].logoUrl ? (
                    <img src={sponsors[1].logoUrl} alt={sponsors[1].name} className="max-h-[40px] w-auto object-contain" />
                  ) : (
                    <span className="text-xs font-bold">{sponsors[1].name}</span>
                  )}
                  <span className="text-[8px] text-gray-400 mt-1 uppercase font-sans">Sponsor</span>
                </a>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-gray-400 font-sans tracking-wider">ADVERTISEMENT</span>
                  <span className="text-[9px] text-gray-300 font-sans mt-0.5">বিজ্ঞাপন দিন</span>
                </div>
              )}
            </div>
          </div>

          {/* Tier 2: Controls & Info Bar */}
          <div className="grid grid-cols-3 items-center border-b border-[#e2e2e2] pb-1.5 mb-1.5 text-xs font-semibold uppercase">
            {/* Left: Icons */}
            <div className="flex items-center gap-5 justify-start">
              {/* Search */}
              <button className="hover:opacity-75 transition-opacity text-[#121212]" aria-label="Search">
                <svg className="w-[21px] h-[21px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>

            {/* Center: Bengali Date Info */}
            <div className="flex flex-col items-center text-center text-[11px] text-[#121212] justify-center">
              <span className="font-bold">শনিবার, ১৩ জুন, ২০২৬</span>
              <span className="text-gray-500 text-[10px] mt-0.5">আজকের পত্রিকা</span>
            </div>

            {/* Right: Subscribe & Login buttons in Bengali */}
            <div className="flex items-center gap-3 justify-end">
              <button className="border border-[#326891] text-[#326891] hover:bg-[#326891] hover:text-white transition-colors duration-150 px-4 py-1.5 rounded-[3px] font-extrabold text-[11px] tracking-wide">
                সাবস্ক্রিপশন
              </button>
              <button className="border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors duration-150 px-4 py-1.5 rounded-[3px] font-extrabold text-[11px] tracking-wide">
                লগইন
              </button>
            </div>
          </div>

          {/* Tier 3: Category Navigation Strip */}
          <div className="border-b border-[#e2e2e2] pb-1.5">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold">
              {[
                { label: 'মাঠ', slug: '' },
                { label: 'ফুটবল', slug: 'football' },
                { label: 'বাংলাদেশের ফুটবল', slug: 'bd-football' },
                { label: 'ক্রিকেট', slug: 'cricket' },
                { label: 'বাংলাদেশের ক্রিকেট', slug: 'bd-cricket' },
                { label: 'ইন্টারভিউ', slug: 'interview' },
                { label: 'ফিচার', slug: 'feature' },
                { label: 'খেলার দেশ বিশেষ', slug: 'special' },
                { label: 'অতিথি কলাম', slug: 'guest-column' },
                { label: 'অন্যান্য', slug: 'others' }
              ].map((item, idx) => {
                const isActive = item.slug === ''; // 'মাঠ' is active on homepage
                const href = item.slug === '' ? '/' : `/sport/${item.slug}`;
                return (
                  <Link 
                    key={idx} 
                    href={href}
                    className="cursor-pointer hover:underline"
                    style={{ color: isActive ? 'var(--live-red)' : '#121212' }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* TEASER ROW */}
        <div className="grid grid-cols-3 gap-0 border-b border-[#e2e2e2] pb-2 mb-2">
          {/* Teaser 1 */}
          <div className="text-center px-3 border-r border-[#e2e2e2] flex flex-col justify-start">
            <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-bold mb-0.5 text-gray-400">মাসের ফোটোগ্যালারী</h3>
            <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-2xl font-bold mb-1 leading-tight text-[#121212]">{articles[0]?.headlineBn || 'ল্যার্স ওয়ায়েস্টফেল্ট'}</h2>
            <p className="text-xs text-justify leading-relaxed font-normal text-[#555] mb-2">
              সার্থ ওয়ায়েস্টফেল্ট জীবন ও কাজের কথা নিয়ে একটি সুন্দর ফোটোগ্রাফিক প্রবন্ধ, সুইডেনের স্ক্যানেস্টার স্ক্যানার এবং ডিজাইনের ক্ষেত্রে উদ্ভূত। ছবি তোলার মাধ্যমে জীবনশৈলীর চিত্রগুলো যেন বাস্তবতার ছোঁয়া দেয়।
            </p>
            <div className="text-right mt-1">
              <Link href={`/article/${articles[0]?.slug || '#'}`} className="text-[11px] font-bold text-[#d33f3f] hover:underline">
                আরো পড়ুন
              </Link>
            </div>
          </div>
          {/* Teaser 2 */}
          <div className="text-center px-3 border-r border-[#e2e2e2] flex flex-col justify-start">
            <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-bold mb-0.5 text-gray-400">ব্রিটিশ বিপ্লব</h3>
            <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-2xl font-bold mb-1 leading-tight text-[#121212]">{articles[1]?.headlineBn || 'পিজে হার্ভে'}</h2>
            <p className="text-xs text-justify leading-relaxed font-normal text-[#555] mb-2">
              বেশ কয়েক বছর ধরে পিজে হার্ভে, যিনি নিজেকে সঙ্গীত দুনিয়ায় এক অনন্য স্থানে নিয়ে গেছেন, তার নতুন অ্যালবামটি নিয়ে আমরা আলোচনা করব। এই অ্যালবামটি আধুনিক সঙ্গীতের নতুন দিগন্ত উন্মোচন করে।
            </p>
            <div className="text-right mt-1">
              <Link href={`/article/${articles[1]?.slug || '#'}`} className="text-[11px] font-bold text-[#d33f3f] hover:underline">
                আরো পড়ুন
              </Link>
            </div>
          </div>
          {/* Teaser 3 */}
          <div className="text-center px-3 flex flex-col justify-start">
            <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-bold mb-0.5 text-gray-400">সিমা পরিপূরক</h3>
            <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-2xl font-bold mb-1 leading-tight text-[#121212]">{articles[2]?.headlineBn || 'মার্সেল জামা'}</h2>
            <p className="text-xs text-justify leading-relaxed font-normal text-[#555] mb-2">
              মার্সেল জামা এমন একজন প্রতিভাধর শিল্পী, যার চিত্রকর্মগুলো অত্যন্ত যত্ন সহকারে আঁকা। তার কাজের মধ্যে দিয়ে আমরা এক ভিন্ন জগতকে অনুভব করতে পারি যা অত্যন্ত বাস্তব ও মনোমুগ্ধকর।
            </p>
            <div className="text-right mt-1">
              <Link href={`/article/${articles[2]?.slug || '#'}`} className="text-[11px] font-bold text-[#d33f3f] hover:underline">
                আরো পড়ুন
              </Link>
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="grid grid-cols-12 gap-4 border-b border-[#e2e2e2] pb-4 mb-4">
          <div className="col-span-4 flex flex-col justify-between">
            <div>
              <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-bold mb-2 text-gray-400">যুক্তরাষ্ট্র থেকে</h3>
              <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.7rem', lineHeight: '1.15', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                {leads[0]?.headlineBn || 'বিশেষ: ভিভিয়ান মেয়ার, সবচেয়ে বড় গোপন রহস্য'}
              </h1>
              <p className="text-sm font-bold italic mb-3 text-gray-400">জেরেমি ওয়াটার দ্বারা</p>
              <p className="text-sm text-justify leading-relaxed columns-1">
                ভিভিয়ান মেয়ারের নাম, একজন নারী যিনি চিত্রকর হওয়ার পাশাপাশি একজন অসামান্য ফোটোগ্রাফার ছিলেন, তার সম্পর্কে অনেক কথাই জানা যায়নি। তার কাজগুলো দীর্ঘকাল ধরে লুকিয়ে ছিল। হঠাৎ করেই তার শত শত ফোটোগ্রাফ আবিষ্কার হয়, যা ফোটোগ্রাফি জগতে আলোড়ন সৃষ্টি করে। তার ছবিগুলোর মধ্যে এক অদ্ভুত গভীরতা ও অনুভূতি রয়েছে যা সাধারণ মানুষের জীবনযাত্রাকে নিপুণভাবে তুলে ধরে। এই আবিষ্কারের পর থেকে তাকে নিয়ে নানা রহস্য ও আলোচনা শুরু হয়েছে।
              </p>
            </div>
            <div className="text-right mt-3">
              <Link href={`/article/${leads[0]?.slug || '#'}`} className="text-[11px] font-bold text-[#d33f3f] hover:underline">
                আরো পড়ুন
              </Link>
            </div>
          </div>
          <div className="col-span-8 flex flex-col items-end">
            <div className="w-full h-[320px] lg:h-[395px] bg-gray-200 overflow-hidden border border-[#e2e2e2] p-1">
               {leads[0]?.slug === 'madrid-unravel-final-ten' ? (
                 <img src="/images/madrid_defeat_hero.png" className="w-full h-full object-cover" alt="Hero Image" />
               ) : leads[0]?.mediaUrl ? (
                 <img src={leads[0].mediaUrl} className="w-full h-full object-cover" alt="Hero Image" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-500 italic">ছবি নেই</div>
               )}
            </div>
            <span className="text-[9px] text-gray-400 mt-1 font-sans mr-1">{leads[0]?.mediaCaption || 'ছবি: নিউ ইয়র্ক টাইমস'}</span>
          </div>
        </div>

        {/* LOWER SECTION */}
        <div className="grid grid-cols-3 gap-0">
          {/* Column 1 */}
          <div className="border-r border-[#e2e2e2] pr-6">
             <h3 className="font-bold text-lg mb-3 border-b-2 border-[#121212] pb-1 uppercase tracking-wider">সিনেমা</h3>
             <div className="w-full h-48 mb-1 border border-[#e2e2e2] p-1">
               {articles[3]?.mediaUrl ? (
                  <img src={articles[3].mediaUrl} className="w-full h-full object-cover" alt="Cinema" />
               ) : (
                  <div className="w-full h-full bg-gray-200" />
               )}
             </div>
             <div className="text-[9px] text-gray-400 text-right mt-0.5 mb-3 font-sans">
               ছবি: সংগৃহীত
             </div>
             <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-[1.75rem] font-bold mb-3 leading-tight">
               {articles[3]?.headlineBn || 'ল\'একুমে দেস জোউর্স: ফরাসি মিশেল গন্ড্রির কাঙ্ক্ষিত প্রত্যাবর্তন'}
             </h2>
             <p className="text-sm font-bold italic mb-3 text-[#888888]">জুলিয়ান বেলট্রেন দ্বারা</p>
             <p className="text-xs text-justify leading-relaxed">
               মিশেল গন্ড্রি, যিনি তার অভিনব এবং পরাবাস্তব শৈলীর জন্য পরিচিত, অবশেষে &apos;ল&apos;একুমে দেস জোউর্স&apos;-এর মাধ্যমে আবার রূপালী পর্দায় ফিরে এসেছেন। বোরিস ভিয়ানের বিখ্যাত উপন্যাসের উপর ভিত্তি করে নির্মিত এই চলচ্চিত্রটি একটি স্বপ্নময় অথচ করুণ প্রেমের গল্প বলে। গন্ড্রির জাদুকরী পরিচালনায় এই ছবিটি দর্শকদের এক ভিন্ন জগতে নিয়ে যায়।
             </p>
             <div className="text-right mt-3 mb-6">
               <Link href={`/article/${articles[3]?.slug || '#'}`} className="text-[11px] font-bold text-[#d33f3f] hover:underline">
                 আরো পড়ুন
               </Link>
              </div>
           </div>
          
          {/* Column 2 */}
          <div className="border-r border-[#e2e2e2] px-6">
             <h3 className="font-bold text-lg mb-3 border-b-2 border-[#121212] pb-1 uppercase tracking-wider">সঙ্গীত</h3>
             <div className="w-full h-48 mb-1 border border-[#e2e2e2] p-1">
                <img src="/media/placeholder-bpl.jpg" className="w-full h-full object-cover" alt="Music" />
             </div>
             <div className="text-[9px] text-gray-400 text-right mt-0.5 mb-3 font-sans">
               ছবি: সংগৃহীত
             </div>
             <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-[1.75rem] font-bold mb-3 leading-tight">
               জার্মান শিল্পী কিটনের নতুন বই
             </h2>
             <p className="text-sm font-bold italic mb-4 text-[#888888]">মার্টিন লিক দ্বারা</p>
             <div className="text-[11px] text-justify columns-2 gap-4 leading-relaxed mb-6">
               <p className="mb-2">জার্মান শিল্পী কিটন সম্প্রতি তার নতুন বইটি প্রকাশ করেছেন, যা শিল্পপ্রেমীদের মধ্যে ব্যাপক সাড়া ফেলেছে। এই বইটিতে তার জীবনের নানা অভিজ্ঞতা, সৃজনশীলতার উৎস এবং শিল্পের প্রতি তার গভীর অনুরাগের কথা বর্ণনা করা হয়েছে।</p>
               <p className="mb-2">বইটিতে অনেক অপ্রকাশিত ছবি and স্কেচ রয়েছে, যা তার কাজের পেছনের পরিশ্রমকে তুলে ধরে। কিটনের মতে, শিল্প কেবল একটি পেশা নয়, এটি আত্মপ্রকাশের একটি মাধ্যম।</p>
               <p>তার এই নতুন বইটি কেবল শিল্পীদের জন্যই নয়, সাধারণ মানুষের জন্যও অনুপ্রেরণামূলক হতে পারে বলে সমালোচকরা মত প্রকাশ করেছেন।</p>
             </div>
             <div className="text-right mt-3 mb-6">
               <Link href="#" className="text-[11px] font-bold text-[#d33f3f] hover:underline">
                 আরো পড়ুন
               </Link>
             </div>
           </div>
          
          {/* Column 3 */}
          <div className="pl-6">
             <h3 className="font-bold text-lg mb-3 border-b-2 border-[#121212] pb-1 uppercase tracking-wider">সরাসরি</h3>
             <div className="w-full h-40 mb-1 border border-[#e2e2e2] p-1">
               {articles[4]?.mediaUrl ? (
                  <img src={articles[4].mediaUrl} className="w-full h-full object-cover" alt="Live Event" />
               ) : (
                  <div className="w-full h-full bg-gray-200" />
               )}
             </div>
             <div className="text-[9px] text-gray-400 text-right mt-0.5 mb-3 font-sans">
               ছবি: গেটি ইমেজ
             </div>
             <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-[1.75rem] font-bold mb-3 leading-tight">
               {articles[4]?.headlineBn || 'গ্রান রেক্সে দ্য ডিসেম্ব্রিস্টস'}
             </h2>
             <p className="text-sm font-bold italic mb-3 text-[#888888]">ক্যানিয়া কাওন দ্বারা</p>
             <p className="text-xs text-justify leading-relaxed">
               দ্য ডিসেম্ব্রিস্টস ব্যান্ডের সরাসরি পারফরম্যান্স সবসময়ই এক অনন্য অভিজ্ঞতা। গ্রান রেক্সে তাদের সাম্প্রতিক কনসার্টটি ছিল জাদুকরী। মঞ্চের সজ্জা, আলোর খেলা এবং তাদের মনোমুগ্ধকর সঙ্গীত দর্শকদের আবিষ্ট করে রেখেছিল। ব্যান্ডের লিড সিঙ্গার তার আবেগপূর্ণ কণ্ঠ দিয়ে প্রতিটি গানকে জীবন্ত করে তুলেছিলেন। এটি নিঃসন্দেহে বছরের অন্যতম সেরা কনসার্ট ছিল।
             </p>
             <div className="text-right mt-3 mb-6">
               <Link href={`/article/${articles[4]?.slug || '#'}`} className="text-[11px] font-bold text-[#d33f3f] hover:underline">
                 আরো পড়ুন
               </Link>
              </div>
           </div>
        </div>

        {/* INFINITE SCROLL FEED — sorted by date, big images */}
        <div className="mt-10 border-t-[3px] border-[#121212] pt-2">
          <InfiniteArticleFeed
            skipIds={[
              ...(leads.map((l: { id: number }) => l.id)),
              ...(articles.slice(0, 4).map((a: { id: number }) => a.id)),
            ]}
          />
        </div>
      </div>
    </div>
  );
}
