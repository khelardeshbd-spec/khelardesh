import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';

export const metadata: Metadata = {
  title: 'ব্যবহারের শর্তাবলী ও ডিসক্লেইমার (Terms of Service) — খেলারদেশ',
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
      {/* Breadcrumbs Header */}
      <div className="w-full max-w-[850px] mx-auto px-4 lg:px-6 pt-6 pb-2">
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
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--ink-muted)]"
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

      <main className="max-w-[850px] mx-auto px-4 lg:px-6 py-6 pb-20 font-sans">
        <div className="bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-2xl p-6 sm:p-10 shadow-xs">
          
          <header className="border-b border-[var(--ink-border)] pb-6 mb-8">
            <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-[#d33f3f] rounded-full text-xs font-black tracking-wider uppercase inline-block mb-2">
              Legal & Terms of Use
            </span>
            <h1 
              lang="bn"
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--ink)]" 
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              ব্যবহারের শর্তাবলী এবং ডিসক্লেইমার
            </h1>
            <p className="text-xs text-[var(--ink-muted)] mt-2 font-mono">
              সর্বশেষ সংস্করণ: আগস্ট ২০২৬ | সকল পাঠক ও রেজিস্ট্রার্ড ব্যবহারকারীর জন্য প্রযোজ্য
            </p>
          </header>

          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[var(--ink-muted)]" style={{ fontFamily: 'var(--font-body)' }}>
            
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ১. সাধারণ শর্তাবলী (Acceptance of Terms)
              </h2>
              <p>
                <strong>খেলারদেশ</strong> (khelardesh.com) ওয়েবসাইট ব্রাউজ বা ব্যবহার করার মাধ্যমে আপনি এই ব্যবহারের শর্তাবলী এবং আমাদের গোপনীয়তা নীতি মেনে চলতে বাধ্য থাকবেন। এই শর্তাবলীর কোনো অংশে আপনার দ্বিমত থাকলে ওয়েবসাইট ব্যবহার থেকে বিরত থাকার অনুরোধ করা হচ্ছে।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ২. বৌদ্ধিক সম্পত্তি ও কপিরাইট (Intellectual Property)
              </h2>
              <p>
                খেলারদেশে প্রকাশিত সকল মূল সংবাদ, শিরোনাম, বিশ্লেষণ, বিশেষ প্রতিবেদন, লোগো এবং ডিজাইন খেলারদেশের মেধা সম্পদ। আমাদের অনুমতি ব্যতীত কোনো প্রতিবেদন হুবহু নকল বা ব্যবসায়িক উদ্দেশ্যে পুনর্প্রকাশ করা বেআইনি। সংবাদের অংশবিশেষ উদ্ধৃত করার ক্ষেত্রে অবশ্যই সক্রিয় লিঙ্কসহ খেলারদেশকে ক্রেডিট প্রদান করতে হবে।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৩. মন্তব্য ও ব্যবহারকারী আচরণ নীতিমালা (User Comments Code of Conduct)
              </h2>
              <p>
                খেলারদেশ পাঠকদের মতামত প্রকাশের স্বাধীনতাকে সম্মান করে। তবে মন্তব্যের ঘরে নিম্নলিখিত আচরণ সম্পূর্ণ নিষিদ্ধ:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li>যেকোনো ব্যক্তি, খেলোয়াড়, জাতি বা ধর্ম নিয়ে অবমাননাকর বা বিদ্বেষমূলক বক্তব্য।</li>
                <li>অশ্লীল, অশালীন বা কুরুচিপূর্ণ ভাষা ব্যবহার।</li>
                <li>স্প্যাম, ফিশিং লিংক বা অনুমোদনহীন বিজ্ঞাপনী প্রচার।</li>
              </ul>
              <p className="text-xs italic">
                খেলারদেশ কর্তৃপক্ষ কোনো কারণ দর্শানো ব্যতিরেকে যেকোনো আপত্তিকর মন্তব্য মুছে ফেলার ও সংশ্লিষ্ট ব্যবহারকারীকে ব্যান করার পূর্ণ অধিকার রাখে।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৪. দায়মুক্তি ও তথ্যের যথার্থতা (Disclaimer of Liability)
              </h2>
              <p>
                আমরা সর্বদা নির্ভুল ও সাম্প্রতিক সংবাদ পরিবেশনের সর্বোচ্চ চেষ্টা করি। তবে লাইভ ম্যাচ স্কোর, খেলোয়াড়দের পরিসংখ্যান বা তৃতীয় পক্ষের তথ্যে অপ্রত্যাশিত কোনো বিলম্ব বা প্রযুক্তিগত অসঙ্গতির জন্য খেলারদেশ কোনো প্রত্যক্ষ বা পরোক্ষ ক্ষতির দায় বহন করবে না।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৫. বিজ্ঞাপন ও বহিরাগত লিঙ্ক (External Links & Advertisements)
              </h2>
              <p>
                আমাদের ওয়েবসাইটে প্রদর্শিত বিজ্ঞাপনদাতাদের পণ্য, সেবা বা তাদের ওয়েবসাইটের কন্টেন্টের দায় সংশ্লিষ্ট বিজ্ঞাপন প্রদানকারী প্রতিষ্ঠানের। কোনো তৃতীয় পক্ষের লিঙ্কে প্রবেশ করার পূর্বে সংশ্লিষ্ট সাইটের শর্তাবলী যাচাই করার দায়িত্ব ব্যবহারকারীর।
              </p>
            </section>

            <section className="space-y-3 border-t border-[var(--ink-border)] pt-6">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৬. যোগাযোগ (Legal Inquiries)
              </h2>
              <p>
                আইনি বা ব্যবহারের শর্তাবলী সংক্রান্ত যেকোনো অনুসন্ধানের জন্য আমাদের সাথে যোগাযোগ করুন:
              </p>
              <div className="bg-[var(--bg-page)] border border-[var(--ink-border)] p-4 rounded-xl text-xs sm:text-sm space-y-1">
                <p><strong>ইমেইল:</strong> <a href="mailto:khelardeshbd@gmail.com" className="text-[#d33f3f] font-semibold hover:underline">khelardeshbd@gmail.com</a></p>
                <p><strong>ওয়েবসাইট:</strong> <a href="https://khelardesh.com" className="text-[#d33f3f] font-semibold hover:underline">khelardesh.com</a></p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  );
}
