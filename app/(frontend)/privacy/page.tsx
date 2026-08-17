import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';

export const metadata: Metadata = {
  title: 'গোপনীয়তা নীতি (Privacy Policy) — খেলারদেশ',
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
              গোপনীয়তা নীতি
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-[850px] mx-auto px-4 lg:px-6 py-6 pb-20 font-sans">
        <div className="bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-2xl p-6 sm:p-10 shadow-xs">
          
          {/* Header */}
          <header className="border-b border-[var(--ink-border)] pb-6 mb-8">
            <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-[#d33f3f] rounded-full text-xs font-black tracking-wider uppercase inline-block mb-2">
              Privacy & Cookie Policy
            </span>
            <h1 
              lang="bn"
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--ink)]" 
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              গোপনীয়তা নীতি ও কুকিজ নীতিমালা
            </h1>
            <p className="text-xs text-[var(--ink-muted)] mt-2 font-mono">
              সর্বশেষ সংস্করণ: আগস্ট ২০২৬ | কার্যকর: সকল পাঠক ও ব্যবহারকারী
            </p>
          </header>

          {/* Content */}
          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[var(--ink-muted)]" style={{ fontFamily: 'var(--font-body)' }}>
            
            {/* Section 1: Introduction */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ১. ভূমিকা (Introduction)
              </h2>
              <p>
                <strong>খেলারদেশ</strong> (khelardesh.com)-এ আপনাকে স্বাগত। আমরা আমাদের পাঠকদের ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতিমালায় ব্যাখ্যা করা হয়েছে যে কীভাবে আমরা আপনার তথ্য সংগ্রহ, সংরক্ষণ, প্রক্রিয়াজাত এবং বিজ্ঞাপন পরিবেশনকারী পার্টনারদের সাথে কুকিজ সংক্রান্ত তথ্যাদি পরিচালনা করি। আমাদের ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি এই নীতিমালার শর্তাবলীতে সম্মত হচ্ছেন।
              </p>
            </section>

            {/* Section 2: Google AdSense & DoubleClick DART Cookies */}
            <section className="space-y-3 bg-red-50/10 border border-red-500/20 rounded-xl p-5">
              <h2 className="text-lg font-bold text-[#d33f3f]" style={{ fontFamily: 'var(--font-headline)' }}>
                ২. গুগল অ্যাডসেন্স ও ডাবলক্লিক ডার্ট কুকিজ (Google AdSense & DoubleClick DART Cookies)
              </h2>
              <p className="text-[var(--ink)]">
                খেলারদেশ গুগল অ্যাডসেন্স (Google AdSense) ও অন্যান্য অনুমোদিত থার্ড-পার্টি বিজ্ঞাপন নেটওয়ার্কের মাধ্যমে বিজ্ঞাপন প্রদর্শন করে থাকে।
              </p>
              <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm text-[var(--ink-muted)]">
                <li>
                  <strong>গুগল কুকিজের ব্যবহার:</strong> গুগল একজন থার্ড-পার্টি ভেন্ডর হিসেবে আমাদের সাইটে বিজ্ঞাপন দেখানোর জন্য কুকিজ ব্যবহার করে।
                </li>
                <li>
                  <strong>DART Cookie:</strong> গুগল DART কুকিজের মাধ্যমে খেলারদেশ ও ইন্টারনেটের অন্যান্য ওয়েবসাইটে ব্যবহারকারীর পূর্ববর্তী ব্রাউজিং কার্যকলাপের ওপর ভিত্তি করে প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শন করে।
                </li>
                <li>
                  <strong>অপ্ট-আউট (Opt-out):</strong> পাঠকেরা চাইলে গুগলের বিজ্ঞাপন সেটিংস পেজ (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#d33f3f] underline font-semibold">Google Ads Settings</a>) ভিজিট করে পার্সোনালাইজড বিজ্ঞাপনের জন্য DART কুকির ব্যবহার বন্ধ করতে পারেন।
                </li>
              </ul>
            </section>

            {/* Section 3: Third Party Advertising & Analytics */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৩. থার্ড-পার্টি বিজ্ঞাপন ও অ্যানালিটিক্স পার্টনার (Third-Party Ads & Analytics)
              </h2>
              <p>
                আমাদের ওয়েবসাইটে বিজ্ঞাপন পরিবেশনকারী থার্ড-পার্টি বিজ্ঞাপন সার্ভার বা অ্যাড নেটওয়ার্কসমূহ (যেমন: Adsterra, Google AdSense ইত্যাদি) সরাসরি আপনার ব্রাউজারে বিজ্ঞাপন এবং লিঙ্ক পাঠাতে পারে। এই প্রক্রিয়া চলাকালে তারা স্বয়ংক্রিয়ভাবে আপনার আইপি (IP) ঠিকানা পেতে পারে।
              </p>
              <p>
                বিজ্ঞাপন প্রচারের কার্যকারিতা পরিমাপ করতে বা বিজ্ঞাপনের বিষয়বস্তু ব্যক্তিগতকৃত করতে কুকিজ, জাভাস্ক্রিপ্ট বা ওয়েব বীকন প্রযুক্তি ব্যবহৃত হতে পারে। খেলারদেশ থার্ড-পার্টি বিজ্ঞাপনদাতাদের ব্যবহৃত কুকিজের ওপর প্রত্যক্ষ নিয়ন্ত্রণ রাখে না।
              </p>
            </section>

            {/* Section 4: Log Files */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৪. লগ ফাইলসমূহ (Log Files)
              </h2>
              <p>
                খেলারদেশ একটি আদর্শ পদ্ধতির অংশ হিসেবে লগ ফাইল ব্যবহার করে। এই ফাইলগুলো ওয়েবসাইটে ভিজিটরদের ট্র্যাফিক বিশ্লেষণ করার জন্য রাখা হয়। সংগৃহীত তথ্যের মধ্যে রয়েছে: ইন্টারনেট প্রোটোকল (IP) ঠিকানা, ব্রাউজারের ধরন, ইন্টারনেট সার্ভিস প্রোভাইডার (ISP), তারিখ ও সময়ের স্ট্যাম্প, রেফারেল/প্রস্থান পৃষ্ঠা এবং ক্লিকের সংখ্যা। এই তথ্যগুলোর সাথে ব্যক্তিগতভাবে শনাক্তযোগ্য কোনো তথ্যের যোগসূত্র নেই।
              </p>
            </section>

            {/* Section 5: Data Collection & User Account */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৫. সংগৃহীত তথ্য ও ব্যবহার (Personal Data Collection)
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>লগইন ও মন্তব্য সুবিধা:</strong> আপনি যখন খেলারদেশে সাইন-ইন করেন (Google বা ইমেলের মাধ্যমে), তখন আমরা আপনার নাম, ইমেল এবং প্রোফাইল ছবি সংগ্রহ করি যা শুধুমাত্র মন্তব্য ও বুকমার্ক সুবিধা সক্রিয় রাখার জন্য ব্যবহৃত হয়।
                </li>
                <li>
                  <strong>নিরাপদ ক্লাউড ডাটাবেস (Supabase):</strong> সকল ডাটাবেস এন্ট্রি এনক্রিপ্টেড ক্লাউড সার্ভারে অত্যন্ত সুরক্ষিতভাবে সংরক্ষিত থাকে।
                </li>
                <li>
                  <strong>তথ্য বিক্রয় নিষেধ:</strong> আমরা কখনো কোনো পাঠকের ব্যক্তিগত তথ্য বা ইমেল ঠিকানা বাণিজ্যিক লাভের জন্য তৃতীয় পক্ষের কাছে বিক্রি, লিজ বা হস্তান্তর করি না।
                </li>
              </ul>
            </section>

            {/* Section 6: GDPR & CCPA Privacy Rights */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৬. ব্যবহারকারীর তথ্য অধিকার (GDPR & CCPA Data Rights)
              </h2>
              <p>
                আমাদের প্রত্যেক ব্যবহারকারীর নিজস্ব তথ্যের ওপর সম্পূর্ণ অধিকার রয়েছে:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li><strong>অ্যাক্সেস অধিকার:</strong> আপনার ব্যক্তিগত তথ্যের কপি চেয়ে অনুরোধ করার অধিকার।</li>
                <li><strong>সংশোধনের অধিকার:</strong> কোনো ভুল তথ্য সংশোধনের আবেদন করার অধিকার।</li>
                <li><strong>তথ্য অপসারণ (Right to Erasure):</strong> আপনার প্রোফাইল বা মন্তব্য ডেটা ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলার অনুরোধ করার অধিকার।</li>
              </ul>
            </section>

            {/* Section 7: Children's Privacy (COPPA) */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৭. শিশুদের তথ্যের নিরাপত্তা (Children's Information - COPPA)
              </h2>
              <p>
                ১৩ বছরের কম বয়সী শিশুদের অনলাইন সুরক্ষা নিশ্চিত করা আমাদের অন্যতম দায়িত্ব। খেলারদেশ জেনেশুনে ১৩ বছরের কম বয়সী শিশুদের কাছ থেকে কোনো ব্যক্তিগতভাবে শনাক্তযোগ্য তথ্য সংগ্রহ করে না। যদি কোনো অভিভাবক মনে করেন যে তাঁদের সন্তান আমাদের সাইটে এ ধরনের তথ্য প্রদান করেছে, তবে অবিলম্বে আমাদের সাথে যোগাযোগ করুন, আমরা তাৎক্ষণিকভাবে তা রেকর্ড থেকে মুছে ফেলব।
              </p>
            </section>

            {/* Section 8: Copyright & Fair Use */}
            <section className="space-y-3 border-t border-[var(--ink-border)] pt-6">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৮. কপিরাইট এবং ফেয়ার ইউজ (Copyright & Fair Use)
              </h2>
              <p>
                খেলারদেশে ব্যবহৃত ছবি ও মাল্টিমিডিয়া কন্টেন্টসমূহ <strong>গণপ্রজাতন্ত্রী বাংলাদেশের কপিরাইট আইন (কপিরাইট অ্যাক্ট ২০০০)</strong> এবং আন্তর্জাতিক আইনের অধীনে সংবাদ পরিবেশন ও পর্যালোচনার খাতিরে (Fair Use) ব্যবহৃত হয়ে থাকে। কোনো কন্টেন্ট নিয়ে আপত্তি থাকলে আমাদের ইমেইলে যোগাযোগ করলে যাচাই সাপেক্ষে তা দ্রুত অপসারণ বা ক্রেডিট সংশোধন করা হবে।
              </p>
            </section>

            {/* Section 9: Contact */}
            <section className="space-y-3 border-t border-[var(--ink-border)] pt-6">
              <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ৯. যোগাযোগ ও প্রাইভেসি সাপোর্ট (Privacy Inquiries)
              </h2>
              <p>
                গোপনীয়তা নীতি সম্পর্কে যেকোনো প্রশ্ন, ডেটা মুছে ফেলার অনুরোধ বা সহায়তার জন্য যোগাযোগ করুন:
              </p>
              <div className="bg-[var(--bg-page)] border border-[var(--ink-border)] p-4 rounded-xl text-xs sm:text-sm space-y-1.5">
                <p><strong>ইমেইল:</strong> <a href="mailto:khelardeshbd@gmail.com" className="text-[#d33f3f] font-semibold hover:underline">khelardeshbd@gmail.com</a></p>
                <p><strong>ওয়েবসাইট:</strong> <a href="https://khelardesh.com" className="text-[#d33f3f] font-semibold hover:underline">khelardesh.com</a></p>
                <p><strong>অফিস:</strong> ঢাকা নিউজরুম, ঢাকা ১২০৫, বাংলাদেশ।</p>
              </div>
            </section>

          </div>

        </div>
      </main>

      <ScrollToTopButton />
    </div>
  );
}
