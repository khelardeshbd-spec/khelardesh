import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে — খেলারদেশ',
  description: 'খেলারদেশ স্পোর্টস নিউজ পোর্টাল সম্পর্কে জানুন — আমাদের সম্পাদকীয় নীতিমালা, লক্ষ্য, টিম এবং সাংবাদিকতার আদর্শ।',
  openGraph: {
    title: 'আমাদের সম্পর্কে — খেলারদেশ',
    description: 'খেলারদেশের লক্ষ্য, সম্পাদকীয় স্বাধীনতা, টিম ও ক্রীড়া সাংবাদিকতার মানদণ্ড।',
    url: 'https://khelardesh.com/about',
    siteName: 'খেলারদেশ',
    locale: 'bn_BD',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'আমাদের সম্পর্কে — খেলারদেশ' }],
  },
};

export default function AboutPage() {
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
              আমাদের সম্পর্কে
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
              খেলারদেশ: বাংলাদেশের স্বাধীন ক্রীড়া সংবাদ মাধ্যম
            </h1>
            <p className="text-xs text-[var(--ink-muted)] font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              প্রতিষ্ঠা: ২০২৪ | ঢাকা, বাংলাদেশ
            </p>
          </header>

          {/* Intro Prose */}
          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[var(--ink)]" style={{ fontFamily: 'var(--font-body)' }}>
            
            <section className="space-y-3">
              <p className="text-base sm:text-lg leading-relaxed text-[var(--ink)]">
                <strong>খেলারদেশ</strong> (khelardesh.com) বাংলা ভাষাভাষী ক্রীড়াপ্রেমীদের জন্য একটি আধুনিক, বস্তুনিষ্ঠ ও দায়িত্বশীল ডিজিটাল স্পোর্টস নিউজ পোর্টাল। ফুটবল, ক্রিকেট থেকে শুরু করে আন্তর্জাতিক ও স্থানীয় সমস্ত খেলার নির্ভরযোগ্য সংবাদ, গভীর বিশ্লেষণ, লাইভ স্কোর এবং বিশেষ প্রতিবেদন পরিবেশনে আমরা নিবেদিতপ্রাণ।
              </p>
            </section>

            {/* Core Values */}
            <section className="space-y-4 pt-2">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                আমাদের মূল নীতি ও অঙ্গীকার
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="border border-[var(--ink-border)] bg-[var(--bg-surface)] p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-headline)' }}>
                    ১. বস্তুনিষ্ঠতা ও সত্যতা
                  </h3>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                    গুজব ও ভুয়া সংবাদের বিরুদ্ধে আমরা কঠোর। প্রতিটি খবর প্রকাশের পূর্বে অফিসিয়াল তথ্যের মাধ্যমে যাচাই করা হয়।
                  </p>
                </div>

                <div className="border border-[var(--ink-border)] bg-[var(--bg-surface)] p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-headline)' }}>
                    ২. স্বাধীন সাংবাদিকতা
                  </h3>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                    কোনো দল, সংস্থা বা বাণিজ্যিক মহলের প্রভাবমুক্ত থেকে সম্পূর্ণ নিরপেক্ষ ক্রীড়া বিশ্লেষণ পরিবেশন।
                  </p>
                </div>

                <div className="border border-[var(--ink-border)] bg-[var(--bg-surface)] p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-headline)' }}>
                    ৩. দেশীয় ক্রীড়ার বিকাশ
                  </h3>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                    পাড়ামহল্লা থেকে শুরু করে তৃণমূল পর্যায়ের দেশীয় ক্রীড়া প্রতিভাদের বিশ্বদরবারে তুলে ধরা।
                  </p>
                </div>
              </div>
            </section>

            {/* Editorial Standards & Fact Checking */}
            <section className="space-y-3 border-t border-[var(--ink-border)] pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                সম্পাদকীয় ও তথ্য যাচাই নীতিমালা
              </h2>
              <div className="space-y-3 text-[var(--ink-muted)] text-xs sm:text-sm">
                <p>
                  <strong className="text-[var(--ink)]">তথ্যের উৎস:</strong> খেলারদেশের সকল প্রতিবেদন সংশ্লিষ্ট ক্লাব, ফেডারেশন (যেমন: ফিফা, আইসিসি, বাফুফে, বিসিবি), প্রাতিষ্ঠানিক প্রেস রিলিজ এবং সরাসরি মাঠের রিপোর্টিংয়ের ওপর ভিত্তি করে রচিত হয়।
                </p>
                <p>
                  <strong className="text-[var(--ink)]">ভুল সংশোধন:</strong> সাংবাদিকতায় স্বচ্ছতা নিশ্চিত করতে যদি কোনো প্রতিবেদনে তথ্যের অসঙ্গতি পরিলক্ষিত হয়, তবে আমরা তা দ্রুত সংশোধন করে স্পষ্ট সংশোধনী প্রকাশ করি।
                </p>
                <p>
                  <strong className="text-[var(--ink)]">মালিকানা ও অর্থায়ন:</strong> খেলারদেশ একটি স্বাধীন ডিজিটাল স্পোর্টস নিউজ আউটলেট। ওয়েবসাইট পরিচালনা ও সাংবাদিকদের পারিশ্রমিক ডিজিটাল বিজ্ঞাপন ও স্পন্সরশিপের মাধ্যমে পরিচালিত হয়। কোনো বাণিজ্যিক বা রাজনৈতিক সংগঠন আমাদের সম্পাদকীয় সিদ্ধান্তে হস্তক্ষেপ করতে পারে না।
                </p>
              </div>
            </section>

            {/* Newsroom & Contact */}
            <section className="space-y-3 border-t border-[var(--ink-border)] pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                নিউজরুম ও যোগাযোগ
              </h2>
              <div className="text-xs sm:text-sm text-[var(--ink-muted)] space-y-1">
                <p><strong className="text-[var(--ink)]">সম্পাদকীয় যোগাযোগ:</strong> <a href="mailto:khelardeshbd@gmail.com" className="text-[#d33f3f] font-semibold hover:underline">khelardeshbd@gmail.com</a></p>
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
