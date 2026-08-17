import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Target, Users, BookOpen, Scale, Award, Mail, MapPin } from 'lucide-react';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে (About Us) — খেলারদেশ',
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
      <div className="w-full max-w-[900px] mx-auto px-4 lg:px-6 pt-6 pb-2">
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
              আমাদের সম্পর্কে
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto px-4 lg:px-6 py-6 pb-20">
        {/* Hero Section */}
        <div className="bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-2xl p-6 sm:p-10 mb-10 shadow-xs">
          <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-[#d33f3f] rounded-full text-xs font-black tracking-wider uppercase inline-block mb-3">
            Khelardesh Sports Media
          </span>
          <h1
            lang="bn"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--ink)] mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            খেলারদেশ: বাংলাদেশের স্বাধীন ক্রীড়া সংবাদ মাধ্যম
          </h1>
          <p
            lang="bn"
            className="text-base sm:text-lg leading-relaxed text-[var(--ink-muted)] max-w-[780px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <strong>খেলারদেশ</strong> (khelardesh.com) বাংলা ভাষাভাষী ক্রীড়াপ্রেমীদের জন্য একটি আধুনিক, নিরপেক্ষ ও তথ্যবহুল ডিজিটাল স্পোর্টস নিউজ পোর্টাল। ফুটবল, ক্রিকেট থেকে শুরু করে আন্তর্জাতিক ও স্থানীয় সমস্ত খেলার বস্তুনিষ্ঠ সংবাদ, গভীর বিশ্লেষণ, লাইভ স্কোর এবং বিশেষ প্রতিবেদন পরিবেশনে আমরা নিবেদিতপ্রাণ।
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[var(--bg-surface)] border border-[var(--ink-border)] p-6 rounded-xl shadow-2xs flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#d33f3f] flex items-center justify-center">
              <Target size={22} />
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
              আমাদের লক্ষ্য (Mission)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              সঠিক ও দ্রুততম সময়ে ক্রীড়াঙ্গনের নিরপেক্ষ সংবাদ বাংলাভাষী পাঠকদের কাছে পৌঁছে দেওয়া এবং দেশীয় ক্রীড়া প্রতিভাকে বিশ্বদরবারে তুলে ধরা।
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--ink-border)] p-6 rounded-xl shadow-2xs flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
              বস্তুনিষ্ঠতা (Accuracy)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              গুজব ও ভুয়া সংবাদের বিরুদ্ধে আমরা কঠোর। প্রতিটি খবর প্রকাশের পূর্বে একাধিক নির্ভরযোগ্য সূত্র ও অফিসিয়াল তথ্যের মাধ্যমে যাচাই করা হয়।
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--ink-border)] p-6 rounded-xl shadow-2xs flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Scale size={22} />
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
              সাংবাদিকতার নীতি (Ethics)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              আন্তর্জাতিক প্রেস মানদণ্ড ও ফেয়ার জার্নালিজম নীতি মেনে কোনো দল, সংস্থা বা ব্যক্তির প্রতি পক্ষপাতহীন স্বাধীন সংবাদ পরিবেশন।
            </p>
          </div>
        </div>

        {/* Editorial Standards & Fact Checking */}
        <section className="bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-xl p-6 sm:p-8 mb-10 space-y-6">
          <div className="flex items-center gap-2 border-b border-[var(--ink-border)] pb-3">
            <BookOpen size={20} className="text-[#d33f3f]" />
            <h2 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
              সম্পাদকীয় ও তথ্য যাচাই নীতিমালা (Editorial & Fact-Checking Policy)
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-[var(--ink-muted)]" style={{ fontFamily: 'var(--font-body)' }}>
            <div>
              <h4 className="font-bold text-[var(--ink)] mb-1">১. তথ্যের উৎস ও সত্যতা যাচাই:</h4>
              <p>
                খেলারদেশের সকল প্রতিবেদন সংশ্লিষ্ট ক্লাব, ফেডারেশন (যেমন: ফিফা, আইসিসি, বাফুফে, বিসিবি), প্রাতিষ্ঠানিক প্রেস রিলিজ এবং সরাসরি মাঠের রিপোর্টিংয়ের ওপর ভিত্তি করে রচিত হয়। অনানুষ্ঠানিক সূত্রের ক্ষেত্রে অন্তত দুটি নির্ভরযোগ্য স্বাধীন উৎস থেকে সত্যতা নিশ্চিত করা হয়।
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[var(--ink)] mb-1">২. ভুল সংশোধন নীতিমালা (Corrections Policy):</h4>
              <p>
                সাংবাদিকতায় স্বচ্ছতা নিশ্চিত করতে যদি কোনো প্রতিবেদনে তথ্যের অসঙ্গতি বা অনিচ্ছাকৃত ভুল পরিলক্ষিত হয়, তবে আমরা তা দ্রুত সংশোধন করি এবং খবরের নিচে স্পষ্টভাবে সংশোধনী নোট প্রকাশ করি।
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[var(--ink)] mb-1">৩. মত ও কলাম স্বাতন্ত্র্য (Opinion & Analysis):</h4>
              <p>
                বিশেষ বিশ্লেষণ ও অতিথি কলামসমূহ সংশ্লিষ্ট লেখকের নিজস্ব মতামত। সম্পাদকীয় টিম স্পষ্ট ব্যাজ ও বাইলাইন দিয়ে মতামত কন্টেন্টকে মূল সংবাদের চেয়ে আলাদা প্রদর্শন করে।
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[var(--ink)] mb-1">৪. মালিকানা ও অর্থায়ন (Ownership & Funding):</h4>
              <p>
                খেলারদেশ একটি স্বাধীন প্রকাশনা। ওয়েবসাইট পরিচালনা ও সাংবাদিকদের পারিশ্রমিক ডিজিটাল বিজ্ঞাপন ও স্পন্সরশিপের মাধ্যমে পরিচালিত হয়। কোনো বাণিজ্যিক বা রাজনৈতিক সংগঠন আমাদের সম্পাদকীয় সিদ্ধান্তে হস্তক্ষেপ করতে পারে না।
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Team & Newsroom */}
        <section className="bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-xl p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-2 border-b border-[var(--ink-border)] pb-3 mb-6">
            <Users size={20} className="text-[#d33f3f]" />
            <h2 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
              সম্পাদকীয় দল ও যোগাযোগ (Editorial Desk)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="p-4 rounded-lg bg-[var(--bg-page)] border border-[var(--ink-border)]">
              <h4 className="text-sm font-bold text-[var(--ink)] mb-1">খেলারদেশ সম্পাদকীয় পর্ষদ</h4>
              <p className="text-xs text-[var(--ink-muted)] mb-2">Editor-in-Chief & Senior Sports Analysts</p>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                জাতীয় ও আন্তর্জাতিক ক্রীড়া বিশেষজ্ঞ এবং অভিজ্ঞ ক্রীড়া সাংবাদিকদের সমন্বয়ে গঠিত খেলারদেশ সম্পাদনা পর্ষদ।
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-page)] border border-[var(--ink-border)]">
              <h4 className="text-sm font-bold text-[var(--ink)] mb-1">রিপোর্টিং ও ডিজিটাল মিডিয়া টিম</h4>
              <p className="text-xs text-[var(--ink-muted)] mb-2">Field Correspondents & Digital Editors</p>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                ঢাকা, চট্টগ্রামসহ দেশের বিভিন্ন প্রান্ত এবং আন্তর্জাতিক ম্যাচ ভেন্যু থেকে তাৎক্ষণিক সংবাদ সরবরাহকারী প্রতিনিধি দল।
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--ink-border)] flex items-center justify-between gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-2 text-[var(--ink-muted)]">
              <Mail size={15} className="text-[#d33f3f]" />
              <span>ইমেইল: <a href="mailto:khelardeshbd@gmail.com" className="font-bold text-[var(--ink)] hover:underline">khelardeshbd@gmail.com</a></span>
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 bg-[#d33f3f] text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              যোগাযোগ পেজে যান →
            </Link>
          </div>
        </section>
      </main>

      <ScrollToTopButton />
    </div>
  );
}
