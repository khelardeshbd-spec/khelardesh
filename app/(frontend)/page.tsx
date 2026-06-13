import type { Metadata } from 'next';
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
    <div style={{ backgroundColor: '#f4ece2', color: '#1a1a1a', minHeight: '100vh', padding: '24px 0', fontFamily: 'var(--font-body)' }}>
      <div className="max-w-[1100px] mx-auto bg-[#f4ece2] px-8 py-6 shadow-2xl" style={{ border: '1px solid #d3c9b8' }}>
        
        {/* MASTHEAD: 3-TIER NYT-INSPIRED */}
        <div className="w-full text-[#1a1a1a] mb-6">
          {/* Tier 1: Top Bar */}
          <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-2 mb-4 text-xs font-semibold tracking-wider uppercase">
            <div className="flex items-center gap-6">
              {/* Sections / Hamburger */}
              <button className="flex items-center gap-1.5 hover:opacity-75 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <span>SECTIONS</span>
              </button>
              
              {/* Search */}
              <div className="relative flex items-center group">
                <button className="flex items-center gap-1.5 hover:opacity-75 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>SEARCH</span>
                </button>
              </div>
            </div>

            {/* Right: Subscribe & Account */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 border-r border-[#1a1a1a] pr-4">
                <div className="text-right">
                  <span className="block font-bold text-[10px] text-red-600 animate-pulse">SUBSCRIBE NOW</span>
                  <span className="block text-[9px] text-[#555] lowercase font-normal">১ মাস ফ্রি ট্রায়াল</span>
                </div>
                <div className="w-7 h-9 border border-[#1a1a1a] flex items-center justify-center bg-white text-[8px] font-bold shadow-sm">
                  KHEL
                </div>
              </div>
              <button className="flex items-center gap-2 hover:opacity-75 transition-opacity">
                <span className="text-[11px] font-bold">LOG IN</span>
                <div className="w-7 h-7 rounded-full bg-[#1a1a1a] text-[#f4ece2] flex items-center justify-center font-bold text-[10px]">
                  K
                </div>
              </button>
            </div>
          </div>

          {/* Tier 2: Logo and Promos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center mb-4">
            {/* Left Promo Block */}
            <div className="hidden lg:flex lg:col-span-3 h-[90px] bg-black text-[#f4ece2] p-3 flex-col justify-between border border-[#1a1a1a]">
              <div className="text-[10px] font-bold tracking-widest text-gray-400">THE DAILY 360</div>
              <div className="text-xs font-semibold leading-tight">বিশ্ব ক্রীড়াঙ্গনের সব খবর এক নজরে প্রতিদিন</div>
            </div>

            {/* Center Logo */}
            <div className="col-span-1 lg:col-span-6 text-center flex flex-col items-center">
              <img src="/images/khelardesh_logo.png" alt="খেলারদেশ" className="mx-auto mb-2 select-none" style={{ maxWidth: '100%', height: 'auto', maxHeight: '110px' }} />
            </div>

            {/* Right Promo Block */}
            <div className="hidden lg:flex lg:col-span-3 h-[90px] bg-white text-black p-3 flex-col justify-between border border-[#1a1a1a] shadow-sm">
              <div className="text-[9px] font-bold tracking-wider text-gray-500 uppercase font-sans">SPORTS JOURNALISM BY</div>
              <div className="text-sm font-bold tracking-tight leading-none uppercase">খেলারদেশ</div>
              <div className="text-[8px] text-gray-500 uppercase font-sans">Powered by Next.js & Supabase</div>
            </div>
          </div>

          {/* Date & Info Strip */}
          <div className="border-t border-b border-[#1a1a1a] py-1.5 mb-5 flex flex-wrap justify-between items-center text-[11px] font-medium text-[#222]">
            <div className="flex items-center gap-3">
              <span className="font-bold">রবিবার, ৯ সেপ্টেম্বর ২০২৩</span>
              <span className="text-gray-400">|</span>
              <span className="hover:underline cursor-pointer">আজকের পত্রিকা</span>
              <span className="text-gray-400">|</span>
              <span className="hover:underline cursor-pointer">ভিডিও</span>
            </div>
            
            <div className="flex items-center gap-4 mt-1 sm:mt-0 font-semibold">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span className="text-red-600 font-bold uppercase tracking-wider text-[10px]">LIVE</span>
                <span className="text-xs">বাংলাদেশ ২ - ১ ভারত</span>
              </span>
              <span className="text-gray-400">|</span>
              <span>ঢাকা ৩০°C ☀️</span>
              <span className="text-gray-400">|</span>
              <span className="text-xs uppercase tracking-wider">সংখ্যা: # ০০০১</span>
            </div>
          </div>

          {/* Quote Banner */}
          <div className="text-center px-4 mb-4">
            <p className="text-[11px] font-medium tracking-wide italic text-gray-700">
              “নিজের সম্পর্কে তিনি কী বলেন তা নিয়ে পুনরায় ভাবুন, তিনি নিজেকে কতটা প্রশংসা করেন, যত বেশি প্রশংসা পান, তত বেশি তিনি ক্ষুদ্র হন।”
            </p>
          </div>

          {/* Tier 3: Category Navigation Strip */}
          <div className="border-t-2 border-b-[4px] border-[#1a1a1a] py-2">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider">
              {['মাঠ', 'ফুটবল', 'বাংলাদেশের ফুটবল', 'ক্রিকেট', 'বাংলাদেশের ক্রিকেট', 'ইন্টারভিউ', 'ফিচার', 'খেলার দেশ বিশেষ', 'অতিথি কলাম', 'অন্যান্য'].map((cat, idx) => (
                <span key={idx} className="cursor-pointer hover:underline text-[#1a1a1a]">{cat}</span>
              ))}
            </div>
          </div>
        </div>

        {/* TEASER ROW */}
        <div className="grid grid-cols-3 gap-0 border-b-[3px] border-[#1a1a1a] pb-6 mb-6">
          {/* Teaser 1 */}
          <div className="text-center px-6 border-r-[1.5px] border-[#1a1a1a]">
            <h3 className="text-sm font-bold mb-2">মাসের ফোটোগ্যালারী</h3>
            <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-2xl font-bold mb-3 leading-tight">{articles[0]?.headlineBn || 'ল্যার্স ওয়ায়েস্টফেল্ট'}</h2>
            <p className="text-xs text-justify leading-relaxed">
              সার্থ ওয়ায়েস্টফেল্ট জীবন ও কাজের কথা নিয়ে একটি সুন্দর ফোটোগ্রাফিক প্রবন্ধ, সুইডেনের স্ক্যানেস্টার স্ক্যানার এবং ডিজাইনের ক্ষেত্রে উদ্ভূত। ছবি তোলার মাধ্যমে জীবনশৈলীর চিত্রগুলো যেন বাস্তবতার ছোঁয়া দেয়।
            </p>
          </div>
          {/* Teaser 2 */}
          <div className="text-center px-6 border-r-[1.5px] border-[#1a1a1a]">
            <h3 className="text-sm font-bold mb-2">ব্রিটিশ বিপ্লব</h3>
            <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-2xl font-bold mb-3 leading-tight">{articles[1]?.headlineBn || 'পিজে হার্ভে'}</h2>
            <p className="text-xs text-justify leading-relaxed">
              বেশ কয়েক বছর ধরে পিজে হার্ভে, যিনি নিজেকে সঙ্গীত দুনিয়ায় এক অনন্য স্থানে নিয়ে গেছেন, তার নতুন অ্যালবামটি নিয়ে আমরা আলোচনা করব। এই অ্যালবামটি আধুনিক সঙ্গীতের নতুন দিগন্ত উন্মোচন করে।
            </p>
          </div>
          {/* Teaser 3 */}
          <div className="text-center px-6">
            <h3 className="text-sm font-bold mb-2">সিমা পরিপূরক</h3>
            <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-2xl font-bold mb-3 leading-tight">{articles[2]?.headlineBn || 'মার্সেল জামা'}</h2>
            <p className="text-xs text-justify leading-relaxed">
              মার্সেল জামা এমন একজন প্রতিভাধর শিল্পী, যার চিত্রকর্মগুলো অত্যন্ত যত্ন সহকারে আঁকা। তার কাজের মধ্যে দিয়ে আমরা এক ভিন্ন জগতকে অনুভব করতে পারি যা অত্যন্ত বাস্তব ও মনোমুগ্ধকর।
            </p>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="grid grid-cols-12 gap-8 border-b-[3px] border-[#1a1a1a] pb-8 mb-8">
          <div className="col-span-4 flex flex-col">
            <h3 className="text-sm font-bold mb-3">যুক্তরাষ্ট্র থেকে</h3>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '3.8rem', lineHeight: '1.05', marginBottom: '16px', letterSpacing: '-0.01em' }}>
              {leads[0]?.headlineBn || 'বিশেষ: ভিভিয়ান মেয়ার, সবচেয়ে বড় গোপন রহস্য'}
            </h1>
            <p className="text-sm font-bold italic mb-5">জেরেমি ওয়াটার দ্বারা</p>
            <p className="text-sm text-justify leading-relaxed columns-1">
              ভিভিয়ান মেয়ারের নাম, একজন নারী যিনি চিত্রকর হওয়ার পাশাপাশি একজন অসামান্য ফোটোগ্রাফার ছিলেন, তার সম্পর্কে অনেক কথাই জানা যায়নি। তার কাজগুলো দীর্ঘকাল ধরে লুকিয়ে ছিল। হঠাৎ করেই তার শত শত ফোটোগ্রাফ আবিষ্কার হয়, যা ফোটোগ্রাফি জগতে আলোড়ন সৃষ্টি করে। তার ছবিগুলোর মধ্যে এক অদ্ভুত গভীরতা ও অনুভূতি রয়েছে যা সাধারণ মানুষের জীবনযাত্রাকে নিপুণভাবে তুলে ধরে। এই আবিষ্কারের পর থেকে তাকে নিয়ে নানা রহস্য ও আলোচনা শুরু হয়েছে।
            </p>
          </div>
          <div className="col-span-8">
            <div className="w-full h-full min-h-[450px] bg-gray-200 overflow-hidden border border-[#1a1a1a] p-1">
               {leads[0]?.mediaUrl ? (
                 <img src={leads[0].mediaUrl} className="w-full h-full object-cover grayscale sepia-[.3] contrast-125" alt="Hero Image" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-500 italic">ছবি নেই</div>
               )}
            </div>
          </div>
        </div>

        {/* LOWER SECTION */}
        <div className="grid grid-cols-3 gap-0">
          {/* Column 1 */}
          <div className="border-r-[1.5px] border-[#1a1a1a] pr-6">
             <h3 className="font-bold text-lg mb-3 border-b-2 border-[#1a1a1a] pb-1 uppercase tracking-wider">সিনেমা</h3>
             <div className="w-full h-48 mb-4 border border-[#1a1a1a] p-1">
               {articles[3]?.mediaUrl ? (
                  <img src={articles[3].mediaUrl} className="w-full h-full object-cover grayscale sepia-[.3] contrast-125" alt="Cinema" />
               ) : (
                  <div className="w-full h-full bg-gray-200" />
               )}
             </div>
             <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-[1.75rem] font-bold mb-3 leading-tight">
               {articles[3]?.headlineBn || 'ল\'একুমে দেস জোউর্স: ফরাসি মিশেল গন্ড্রির কাঙ্ক্ষিত প্রত্যাবর্তন'}
             </h2>
             <p className="text-sm font-bold italic mb-3">জুলিয়ান বেলট্রেন দ্বারা</p>
             <p className="text-xs text-justify leading-relaxed">
               মিশেল গন্ড্রি, যিনি তার অভিনব এবং পরাবাস্তব শৈলীর জন্য পরিচিত, অবশেষে &apos;ল&apos;একুমে দেস জোউর্স&apos;-এর মাধ্যমে আবার রূপালী পর্দায় ফিরে এসেছেন। বোরিস ভিয়ানের বিখ্যাত উপন্যাসের উপর ভিত্তি করে নির্মিত এই চলচ্চিত্রটি একটি স্বপ্নময় অথচ করুণ প্রেমের গল্প বলে। গন্ড্রির জাদুকরী পরিচালনায় এই ছবিটি দর্শকদের এক ভিন্ন জগতে নিয়ে যায়।
             </p>
          </div>
          
          {/* Column 2 */}
          <div className="border-r-[1.5px] border-[#1a1a1a] px-6">
             <h3 className="font-bold text-lg mb-3 border-b-2 border-[#1a1a1a] pb-1 uppercase tracking-wider">সঙ্গীত</h3>
             <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-[2.2rem] font-bold mb-3 leading-[1.1]">
               জার্মান শিল্পী কিটনের নতুন বই
             </h2>
             <p className="text-sm font-bold italic mb-4">মার্টিন লিক দ্বারা</p>
             <div className="text-[11px] text-justify columns-2 gap-4 leading-relaxed">
               <p className="mb-2">জার্মান শিল্পী কিটন সম্প্রতি তার নতুন বইটি প্রকাশ করেছেন, যা শিল্পপ্রেমীদের মধ্যে ব্যাপক সাড়া ফেলেছে। এই বইটিতে তার জীবনের নানা অভিজ্ঞতা, সৃজনশীলতার উৎস এবং শিল্পের প্রতি তার গভীর অনুরাগের কথা বর্ণনা করা হয়েছে।</p>
               <p className="mb-2">বইটিতে অনেক অপ্রকাশিত ছবি এবং স্কেচ রয়েছে, যা তার কাজের পেছনের পরিশ্রমকে তুলে ধরে। কিটনের মতে, শিল্প কেবল একটি পেশা নয়, এটি আত্মপ্রকাশের একটি মাধ্যম।</p>
               <p>তার এই নতুন বইটি কেবল শিল্পীদের জন্যই নয়, সাধারণ মানুষের জন্যও অনুপ্রেরণামূলক হতে পারে বলে সমালোচকরা মত প্রকাশ করেছেন।</p>
             </div>
          </div>
          
          {/* Column 3 */}
          <div className="pl-6">
             <h3 className="font-bold text-lg mb-3 border-b-2 border-[#1a1a1a] pb-1 uppercase tracking-wider">সরাসরি</h3>
             <div className="w-full h-40 mb-4 border border-[#1a1a1a] p-1">
               {articles[4]?.mediaUrl ? (
                  <img src={articles[4].mediaUrl} className="w-full h-full object-cover grayscale sepia-[.3] contrast-125" alt="Live Event" />
               ) : (
                  <div className="w-full h-full bg-gray-200" />
               )}
             </div>
             <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-[1.75rem] font-bold mb-3 leading-tight">
               {articles[4]?.headlineBn || 'গ্রান রেক্সে দ্য ডিসেম্ব্রিস্টস'}
             </h2>
             <p className="text-sm font-bold italic mb-3">ক্যানিয়া কাওন দ্বারা</p>
             <p className="text-xs text-justify leading-relaxed">
               দ্য ডিসেম্ব্রিস্টস ব্যান্ডের সরাসরি পারফরম্যান্স সবসময়ই এক অনন্য অভিজ্ঞতা। গ্রান রেক্সে তাদের সাম্প্রতিক কনসার্টটি ছিল জাদুকরী। মঞ্চের সজ্জা, আলোর খেলা এবং তাদের মনোমুগ্ধকর সঙ্গীত দর্শকদের আবিষ্ট করে রেখেছিল। ব্যান্ডের লিড সিঙ্গার তার আবেগপূর্ণ কণ্ঠ দিয়ে প্রতিটি গানকে জীবন্ত করে তুলেছিলেন। এটি নিঃসন্দেহে বছরের অন্যতম সেরা কনসার্ট ছিল।
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
