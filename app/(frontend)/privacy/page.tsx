import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';

export const metadata: Metadata = {
  title: 'গোপনীয়তা নীতি — খেলারদেশ',
  description: 'খেলারদেশ স্পোর্টস নিউজ পোর্টালের বিস্তারিত গোপনীয়তা নীতি, গুগল অ্যাডসেন্স ও কুকিজ সংক্রান্ত নীতিমালা।',
  openGraph: {
    title: 'গোপনীয়তা নীতি — খেলারদেশ',
    description: 'খেলারদেশ স্পোর্টস নিউজ পোর্টালের গোপনীয়তা নীতি, গুগল অ্যাডসেন্স ও কুকিজ সংক্রান্ত নীতিমালা।',
    url: 'https://khelardesh.com/privacy',
    siteName: 'খেলারদেশ',
    locale: 'bn_BD',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'গোপনীয়তা নীতি — খেলারদেশ' }],
  },
};

export default function PrivacyPage() {
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
              গোপনীয়তা নীতি
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
              গোপনীয়তা নীতি ও কুকিজ নীতিমালা
            </h1>
            <p className="text-xs text-[var(--ink-muted)] font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              সর্বশেষ সংস্করণ: আগস্ট ২০২৬ | খেলারদেশ স্পোর্টস মিডিয়া
            </p>
          </header>

          {/* Content */}
          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[var(--ink)]" style={{ fontFamily: 'var(--font-body)' }}>
            
            {/* Section 1: Introduction */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ১. ভূমিকা
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                <strong>খেলারদেশ</strong> (khelardesh.com)-এ আপনাকে স্বাগত। আমরা আমাদের পাঠকদের ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে সম্পূর্ণ দায়বদ্ধ। এই গোপনীয়তা নীতিমালায় পরিষ্কারভাবে ব্যাখ্যা করা হয়েছে যে কীভাবে আমরা আপনার তথ্য সংগ্রহ, সংরক্ষণ ও প্রক্রিয়াজাত করি এবং বিজ্ঞাপন পরিবেশনকারী পার্টনারদের সাথে কুকিজ সংক্রান্ত তথ্যাদি পরিচালনা করি। ওয়েবসাইট ব্রাউজ করার মাধ্যমে আপনি এই নীতিমালায় সম্মত হচ্ছেন।
              </p>
            </section>

            {/* Section 2: Google AdSense & Cookies */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ২. গুগল অ্যাডসেন্স ও কুকিজ নীতিমালা
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                খেলারদেশ গুগল অ্যাডসেন্স (Google AdSense) ও অনুমোদিত থার্ড-পার্টি বিজ্ঞাপন নেটওয়ার্কের মাধ্যমে পাঠকদের প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শন করে থাকে।
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--ink-muted)]">
                <li>
                  <strong className="text-[var(--ink)]">গুগল কুকিজের ব্যবহার:</strong> গুগল একজন থার্ড-পার্টি ভেন্ডর হিসেবে আমাদের সাইটে বিজ্ঞাপন দেখানোর জন্য কুকিজ ব্যবহার করে।
                </li>
                <li>
                  <strong className="text-[var(--ink)]">DART Cookie:</strong> গুগল DART কুকির মাধ্যমে ব্যবহারকারীর পূর্ববর্তী ব্রাউজিং কার্যকলাপের ওপর ভিত্তি করে প্রাসঙ্গিক ক্রীড়া বিজ্ঞাপন পরিবেশন করে।
                </li>
                <li>
                  <strong className="text-[var(--ink)]">অপ্ট-আউট (Opt-out):</strong> পাঠকেরা চাইলে গুগলের বিজ্ঞাপন সেটিংস পেজ (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#d33f3f] underline font-semibold">Google Ads Settings</a>) ভিজিট করে পার্সোনালাইজড বিজ্ঞাপনের জন্য কুকির ব্যবহার নিয়ন্ত্রণ বা বন্ধ করতে পারেন।
                </li>
              </ul>
            </section>

            {/* Section 3: Third Party Advertising */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৩. থার্ড-পার্টি বিজ্ঞাপন ও অ্যানালিটিক্স
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                আমাদের ওয়েবসাইটে বিজ্ঞাপন পরিবেশনকারী নেটওয়ার্ক বা ট্র্যাফিক অ্যানালিটিক্স টুল সরাসরি আপনার ব্রাউজারে বিজ্ঞাপন লিঙ্ক পাঠাতে পারে। এই প্রক্রিয়ায় ব্রাউজিং অভিজ্ঞতা উন্নয়ন ও কার্যকারিতা পরিমাপের লক্ষ্যে তারা স্বয়ংক্রিয়ভাবে ব্যবহারকারীর আইপি (IP) ঠিকানা পেতে পারে। খেলারদেশ থার্ড-পার্টি বিজ্ঞাপনদাতাদের ব্যবহৃত কুকিজের ওপর সরাসরি নিয়ন্ত্রণ রাখে না।
              </p>
            </section>

            {/* Section 4: Log Files */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৪. লগ ফাইলসমূহ
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                স্ট্যান্ডার্ড ওয়েব সার্ভারের অংশ হিসেবে খেলারদেশ লগ ফাইল ব্যবহার করে। সংগৃহীত তথ্যের মধ্যে রয়েছে: আইপি ঠিকানা, ব্রাউজারের ধরন, ইন্টারনেট সার্ভিস প্রোভাইডার (ISP), তারিখ ও সময়ের স্ট্যাম্প, রেফারেল পেজ এবং ক্লিকের সংখ্যা। এই তথ্যগুলোর সাহায্যে ব্যক্তিগত পরিচয় প্রকাশ পায় না এবং এগুলো কেবল সাইট পারফরম্যান্স মনিটরিংয়ে ব্যবহৃত হয়।
              </p>
            </section>

            {/* Section 5: Data Collection & Security */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৫. তথ্য সুরক্ষা ও ব্যবহারকারী অধিকার
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-[var(--ink-muted)]">
                <li>
                  <strong className="text-[var(--ink)]">ব্যবহারকারী তথ্য:</strong> গুগল সাইন-ইন বা অ্যাকাউন্টের মাধ্যমে সংগৃহীত নাম ও ইমেইল শুধুমাত্র মন্তব্য এবং বুকমার্ক সুবিধা সক্রিয় রাখতে ব্যবহৃত হয়।
                </li>
                <li>
                  <strong className="text-[var(--ink)]">বাণিজ্যিক বিক্রয় নিষিদ্ধ:</strong> আমরা পাঠকদের কোনো ব্যক্তিগত তথ্য বা ইমেইল ঠিকানা কোনো তৃতীয় পক্ষের কাছে বিক্রি, ভাড়া বা বাণিজ্যিক উদ্দেশ্যে হস্তান্তর করি না।
                </li>
                <li>
                  <strong className="text-[var(--ink)]">ডেটা মুছে ফেলার অধিকার:</strong> ব্যবহারকারী যেকোনো সময় তাঁর প্রোফাইল তথ্য বা মন্তব্য ডাটাবেস থেকে মুছে ফেলার জন্য অনুরোধ জানাতে পারেন।
                </li>
              </ul>
            </section>

            {/* Section 6: Children's Privacy */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৬. শিশুদের গোপনীয়তা সুরক্ষা
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                খেলারদেশ জেনেশুনে ১৩ বছরের কম বয়সী শিশুদের কাছ থেকে কোনো ব্যক্তিগতভাবে শনাক্তযোগ্য তথ্য সংগ্রহ করে না। যদি কোনো অভিভাবক মনে করেন যে তাঁদের সন্তান আমাদের সাইটে তথ্য প্রদান করেছে, তবে সরাসরি যোগাযোগ করলে তাৎক্ষণিকভাবে তা ডাটাবেস থেকে মুছে ফেলা হবে।
              </p>
            </section>

            {/* Section 7: Copyright & Fair Use */}
            <section className="space-y-3 border-t border-[var(--ink-border)] pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৭. কপিরাইট এবং ফেয়ার ইউজ
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                খেলারদেশে ব্যবহৃত ছবি ও মাল্টিমিডিয়া কন্টেন্টসমূহ গণপ্রজাতন্ত্রী বাংলাদেশের কপিরাইট আইন (কপিরাইট অ্যাক্ট ২০০০) এবং আন্তর্জাতিক ফেয়ার ইউজ (Fair Use) নীতিমালার অধীনে সংবাদ ও পর্যালোচনার উদ্দেশ্যে ব্যবহৃত হয়। যেকোনো কন্টেন্ট সংক্রান্ত আপত্তিতে সরাসরি যোগাযোগ করলে যাচাই সাপেক্ষে দ্রুত ব্যবস্থা নেওয়া হবে।
              </p>
            </section>

            {/* Section 8: Contact */}
            <section className="space-y-3 border-t border-[var(--ink-border)] pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৮. যোগাযোগ
              </h2>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                গোপনীয়তা নীতি সংক্রান্ত যেকোনো প্রশ্ন বা ডেটা রিমুভাল রিকোয়েস্টের জন্য আমাদের সাথে যোগাযোগ করুন:
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
