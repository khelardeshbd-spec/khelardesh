import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';

export const metadata: Metadata = {
  title: 'ব্যবহারের শর্তাবলী — খেলারদেশ',
  description: 'খেলারদেশ স্পোর্টস নিউজ পোর্টালের ব্যবহারের শর্তাবলী, মন্তব্য নীতিমালা এবং আইনি ডিসক্লেইমার।',
  openGraph: {
    title: 'ব্যবহারের শর্তাবলী — খেলারদেশ',
    description: 'খেলারদেশ স্পোর্টস নিউজ পোর্টালের ব্যবহারের নিয়ম ও আইনি শর্তাবলী।',
    url: 'https://khelardesh.com/terms',
    siteName: 'খেলারদেশ',
    locale: 'bn_BD',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ব্যবহারের শর্তাবলী — খেলারদেশ' }],
  },
};

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', color: 'var(--ink)' }}>
      {/* Breadcrumb Header */}
      <div className="w-full max-w-[800px] mx-auto px-4 lg:px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--ink-ghost)] transition-colors bg-[var(--bg-surface)] border border-[var(--ink-border)] px-3 py-1.5 rounded-full"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            ফিরে যান
          </Link>

          <div
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[var(--ink-muted)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Link href="/" className="hover:text-[var(--ink)] transition-colors">
              মাঠ
            </Link>
            <span>/</span>
            <span className="text-[#d33f3f] font-bold">
              ব্যবহারের শর্তাবলী
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-[800px] mx-auto px-4 lg:px-6 py-6 pb-20 font-sans">
        <article className="border-t-2 border-[var(--ink)] pt-6">
          
          {/* Header */}
          <header className="pb-6 mb-8 border-b border-[var(--ink-border)]">
            <h1 
              lang="bn"
              className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--ink)] leading-tight mb-2" 
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              ব্যবহারের শর্তাবলী এবং ডিসক্লেইমার
            </h1>
            <p className="text-xs text-[var(--ink-muted)] font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              সর্বশেষ সংস্করণ: আগস্ট ২০২৬ | খেলারদেশ স্পোর্টস মিডিয়া
            </p>
          </header>

          {/* Content */}
          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[var(--ink)]" style={{ fontFamily: 'var(--font-body)' }}>
            
            {/* Section 1: General Terms */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ১. সাধারণ শর্তাবলী
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                <strong>খেলারদেশ</strong> (khelardesh.com) ওয়েবসাইট ব্রাউজ বা ব্যবহার করার মাধ্যমে আপনি এই ব্যবহারের শর্তাবলী এবং আমাদের গোপনীয়তা নীতি মেনে চলতে সম্মত হচ্ছেন। এই শর্তাবলীর কোনো অংশে আপনার দ্বিমত থাকলে ওয়েবসাইট ব্যবহার থেকে বিরত থাকার অনুরোধ করা হচ্ছে।
              </p>
            </section>

            {/* Section 2: Intellectual Property */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ২. বৌদ্ধিক সম্পত্তি ও কপিরাইট
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                খেলারদেশে প্রকাশিত সকল মূল সংবাদ, শিরোনাম, বিশ্লেষণ, বিশেষ প্রতিবেদন, লোগো এবং ডিজাইন খেলারদেশের নিজস্ব মেধা সম্পদ। আমাদের অনুমতি ব্যতীত কোনো প্রতিবেদন হুবহু নকল বা বাণিজ্যিক উদ্দেশ্যে পুনর্প্রকাশ করা আইনত দণ্ডনীয়। সংবাদের অংশবিশেষ উদ্ধৃত করার ক্ষেত্রে অবশ্যই সক্রিয় হাইপারলিংকসহ খেলারদেশকে স্পষ্ট ক্রেডিট প্রদান করতে হবে।
              </p>
            </section>

            {/* Section 3: User Comments Policy */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৩. মন্তব্য ও ব্যবহারকারী আচরণ নীতিমালা
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                খেলারদেশ পাঠকদের মতামত প্রকাশের স্বাধীনতাকে শ্রদ্ধা জানায়। তবে গঠনমূলক আলোচনার স্বার্থে নিম্নলিখিত কার্যকলাপ সম্পূর্ণ নিষিদ্ধ:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-[var(--ink-muted)]">
                <li>যেকোনো ব্যক্তি, খেলোয়াড়, জাতি বা ধর্ম নিয়ে অবমাননাকর বা বিদ্বেষমূলক বক্তব্য।</li>
                <li>অশ্লীল, অশালীন বা কুরুচিপূর্ণ ভাষা ব্যবহার।</li>
                <li>স্প্যামিং, ফিশিং লিংক বা অননুমোদিত বাণিজ্যিক বিজ্ঞাপন পোস্ট করা।</li>
              </ul>
              <p className="text-[var(--ink-muted)] text-xs mt-1">
                নীতিমালা লঙ্ঘনকারী যেকোনো মন্তব্য পূর্ব নোটিশ ছাড়া মুছে ফেলা বা সংশ্লিষ্ট ব্যবহারকারীকে ব্যান করার অধিকার খেলারদেশ সংরক্ষণ করে।
              </p>
            </section>

            {/* Section 4: Live Scores Disclaimer */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৪. লাইভ স্কোর ও তথ্যের নির্ভুলতা
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                আমরা সর্বোচ্চ নির্ভুলতা ও দ্রুততার সাথে লাইভ স্কোর ও খেলার ফলাফল পরিবেশন করার চেষ্টা করি। তবে ইন্টারনেট নেটওয়ার্ক বা প্রযুক্তিগত বিলম্বের কারণে সাময়িক কোনো অসঙ্গতির জন্য খেলারদেশ কর্তৃপক্ষ কোনো আর্থিক বা পরোক্ষ ক্ষতির দায় বহন করবে না।
              </p>
            </section>

            {/* Section 5: External Links */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৫. বহিরাগত লিংক ও বিজ্ঞাপন
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                আমাদের প্রতিবেদনে বা বিজ্ঞাপনী ব্যানারসমূহে প্রদর্শিত তৃতীয় পক্ষের ওয়েবসাইটের কন্টেন্ট বা তাদের গোপনীয়তা নীতির ওপর আমাদের কোনো নিয়ন্ত্রণ নেই। ব্যবহারকারীদের সংশ্লিষ্ট ওয়েবসাইটের শর্তাবলী যাচাই করার পরামর্শ দেওয়া হচ্ছে।
              </p>
            </section>

            {/* Section 6: Policy Changes & Contact */}
            <section className="space-y-3 border-t border-[var(--ink-border)] pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৬. শর্তাবলী পরিবর্তন ও যোগাযোগ
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                খেলারদেশ কর্তৃপক্ষ যেকোনো সময় এই শর্তাবলী পরিমার্জন বা হালনাগাদ করার অধিকার রাখে। শর্তাবলী বা আইনি বিষয় সংক্রান্ত যেকোনো অনুসন্ধানের জন্য আমাদের সাথে যোগাযোগ করুন:
              </p>
              <div className="text-xs sm:text-sm text-[var(--ink-muted)] space-y-1">
                <p><strong className="text-[var(--ink)]">ইমেইল:</strong> <a href="mailto:khelardeshbd@gmail.com" className="text-[#d33f3f] font-semibold hover:underline">khelardeshbd@gmail.com</a></p>
                <p><strong className="text-[var(--ink)]">অফিসিয়াল ঠিকানা:</strong> খেলারদেশ নিউজরুম, ঢাকা ১২০৫, বাংলাদেশ।</p>
              </div>
            </section>

          </div>

        </article>
      </main>

      <ScrollToTopButton />
    </div>
  );
}
