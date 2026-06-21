import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'গোপনীয়তা নীতি ও কপিরাইট ডিসক্লেইমার — খেলারদেশ',
  description: 'খেলারদেশ স্পোর্টস নিউজ পোর্টালের গোপনীয়তা নীতি এবং কপিরাইট সংক্রান্ত নিয়ম ও শর্তাবলী।',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--ink)] py-12 px-6 font-sans">
      <div className="max-w-[800px] mx-auto bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-xl p-8 md:p-12 shadow-sm">
        
        {/* Header */}
        <header className="border-b border-[var(--ink-border)] pb-6 mb-8">
          <h1 
            lang="bn"
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--ink)]" 
            style={{ fontFamily: 'var(--font-body)' }}
          >
            গোপনীয়তা নীতি এবং কপিরাইট ডিসক্লেইমার
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-2 font-mono">
            সর্বশেষ আপডেট: জুন ২২, ২০২৬
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-sm md:text-base leading-relaxed text-[var(--ink-muted)]">
          
          {/* Section 1: Introduction */}
          <section className="space-y-3">
            <h2 
              lang="bn"
              className="text-lg font-bold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              ১. ভূমিকা (Introduction)
            </h2>
            <p lang="bn">
              <strong>খেলারদেশ</strong> (khelardesh.com)-এ আপনাকে স্বাগত জানাই। আমরা আমাদের পাঠকদের গোপনীয়তা রক্ষা করতে প্রতিজ্ঞাবদ্ধ। এই গোপনীয়তা নীতিতে বিস্তারিত আলোচনা করা হয়েছে কীভাবে আমরা আপনার তথ্য সংগ্রহ, ব্যবহার এবং সংরক্ষণ করি। আমাদের ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি এই নীতিমালার শর্তাবলীতে সম্মতি প্রদান করছেন।
            </p>
          </section>

          {/* Section 2: Data Collection */}
          <section className="space-y-3">
            <h2 
              lang="bn"
              className="text-lg font-bold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              ২. তথ্য সংগ্রহ ও ব্যবহার (Data Collection)
            </h2>
            <p lang="bn">
              আমরা প্রধানত নিম্নলিখিত ক্ষেত্রে অত্যন্ত সীমিত এবং প্রয়োজনীয় তথ্য সংগ্রহ করি:
            </p>
            <ul lang="bn" className="list-disc pl-6 space-y-2">
              <li>
                <strong>অ্যাকাউন্ট ও লগইন তথ্য:</strong> আপনি যখন খেলারদেশ অ্যাকাউন্টে সাইন-ইন করেন (যেমন Google বা ইমেলের মাধ্যমে), তখন আমরা আপনার নাম, ইমেল ঠিকানা এবং প্রোফাইল ছবি সংগ্রহ করি। এই তথ্য শুধুমাত্র আপনার অ্যাকাউন্ট পরিচালনা এবং মন্তব্য করার সুবিধা দেওয়ার জন্য ব্যবহৃত হয়।
              </li>
              <li>
                <strong>ডাটাবেস সংরক্ষণ (Supabase):</strong> আপনার সংগৃহীত প্রোফাইল এবং মন্তব্য সংক্রান্ত সকল তথ্য অত্যন্ত সুরক্ষিতভাবে আমাদের ক্লাউড ডাটাবেস পার্টনার <strong>Supabase</strong>-এ সংরক্ষিত থাকে।
              </li>
              <li>
                <strong>কুকিজ (Cookies):</strong> আমরা ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে এবং লগইন সেশন সক্রিয় রাখতে প্রয়োজনীয় সেশন কুকিজ ব্যবহার করি।
              </li>
            </ul>
          </section>

          {/* Section 3: Copyright & Fair Use - CRITICAL FOR USER */}
          <section className="space-y-4 bg-red-50/10 border border-red-500/20 rounded-lg p-5">
            <h2 
              lang="bn"
              className="text-lg font-bold text-red-600 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              ৩. কপিরাইট এবং ফেয়ার ইউজ ডিসক্লেইমার (Copyright & Fair Use Disclaimer)
            </h2>
            <p lang="bn" className="text-[var(--ink)]">
              খেলারদেশ একটি সম্পূর্ণ অলাভজনক ও স্বাধীন ক্রীড়া সংবাদ পরিবেশনকারী মাধ্যম। ক্রীড়া সাংবাদিকতা, জনস্বার্থ এবং সংবাদ পর্যালোচনার খাতিরে আমাদের প্রতিবেদনে বিভিন্ন সময় তৃতীয় পক্ষের ছবি, গ্রাফিক্স বা ভিজ্যুয়াল মিডিয়া ব্যবহৃত হতে পারে।
            </p>
            <ul lang="bn" className="list-disc pl-6 space-y-2 text-xs md:text-sm">
              <li>
                <strong>ফেয়ার ইউজ (Fair Use):</strong> এই ওয়েবসাইটে ব্যবহৃত কপিরাইটযুক্ত ছবি বা কন্টেন্টসমূহ <strong>গণপ্রজাতন্ত্রী বাংলাদেশের কপিরাইট আইন (কপিরাইট অ্যাক্ট ২০০০)</strong> এবং আন্তর্জাতিক আইনের অধীনে <strong>সংবাদ পরিবেশন, সমালোচনা, প্রতিবেদন এবং শিক্ষামূলক উদ্দেশ্যে (Fair Use / ফেয়ার ইউজ)</strong> ব্যবহার করা হয়ে থাকে।
              </li>
              <li>
                <strong>মালিকানা স্বত্ব:</strong> খেলারদেশ এই ধরনের কোনো কন্টেন্ট বা ছবির মালিকানা দাবি করে না। সকল কপিরাইট ও ক্রেডিট মূল স্বত্বাধিকারী বা এজেন্সির অনুকূলে সংরক্ষিত।
              </li>
              <li>
                <strong>ছবি অপসারণের অনুরোধ (Removal Requests):</strong> আপনি যদি কোনো ছবির মূল কপিরাইট বা স্বত্বাধিকারী হন এবং আমাদের সাইটে আপনার কোনো কন্টেন্টের ব্যবহার নিয়ে আপত্তি বা অসন্তুষ্টি থাকে, তবে আমাদের সাথে ইমেলের মাধ্যমে যোগাযোগ করুন। আমরা আপনার মালিকানা যাচাই সাপেক্ষে ছবি বা কন্টেন্টটি অবিলম্বে অপসারণ বা যথাযথ ক্রেডিট প্রদানের প্রতিশ্রুতি দিচ্ছি।
              </li>
            </ul>
            <p lang="bn" className="text-xs font-semibold">
              কন্টেন্ট অপসারণের জন্য সরাসরি আমাদের ইমেলে যোগাযোগ করুন: <a href="mailto:khelardeshbd@gmail.com" className="text-[#d33f3f] underline hover:text-red-700">khelardeshbd@gmail.com</a>
            </p>
          </section>

          {/* Section 4: Data Security */}
          <section className="space-y-3">
            <h2 
              lang="bn"
              className="text-lg font-bold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              ৪. তথ্য নিরাপত্তা (Data Security)
            </h2>
            <p lang="bn">
              আমরা আপনার ব্যক্তিগত তথ্যের নিরাপত্তা নিশ্চিত করতে সর্বাধুনিক নিরাপত্তা ব্যবস্থা গ্রহণ করি। আমরা কখনো আপনার ব্যক্তিগত তথ্য বা ইমেল ঠিকানা অন্য কোনো বাণিজ্যিক প্রতিষ্ঠানের কাছে বিক্রি, বিনিময় বা ভাড়া দেই না। তবে দেশের প্রচলিত আইন অনুযায়ী আইনি বাধ্যবাধকতা থাকলে তথ্য প্রকাশ করতে হতে পারে।
            </p>
          </section>

          {/* Section 5: Cookies and External Analytics */}
          <section className="space-y-3">
            <h2 
              lang="bn"
              className="text-lg font-bold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              ৫. বিজ্ঞাপন এবং থার্ড পার্টি লিঙ্ক (Third-Party links & Ads)
            </h2>
            <p lang="bn">
              আমাদের সাইটে বিভিন্ন স্পন্সরদের বিজ্ঞাপন বা ব্যানার প্রদর্শিত হতে পারে। এছাড়া আমাদের প্রতিবেদনে বাইরের কোনো ওয়েবসাইটের লিঙ্ক দেওয়া থাকতে পারে। খেলারদেশ বহিরাগত কোনো ওয়েবসাইট বা থার্ড-পার্টি অ্যাপের গোপনীয়তা নীতি বা কন্টেন্টের জন্য দায়ী নয়।
            </p>
          </section>

          {/* Section 6: Contact */}
          <section className="space-y-3">
            <h2 
              lang="bn"
              className="text-lg font-bold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              ৬. যোগাযোগ (Contact Us)
            </h2>
            <p lang="bn">
              এই গোপনীয়তা নীতি, কপিরাইট ডিসক্লেইমার বা আমাদের ওয়েবসাইটের কার্যক্রম সম্পর্কে যেকোনো প্রশ্ন বা মতামতের জন্য সরাসরি আমাদের সাথে নিম্নোক্ত ঠিকানায় যোগাযোগ করুন:
            </p>
            <div className="bg-[var(--bg-page)] border border-[var(--ink-border)] p-4 rounded-lg text-sm space-y-1">
              <p><strong>ইমেল:</strong> <a href="mailto:khelardeshbd@gmail.com" className="text-[#d33f3f] hover:underline">khelardeshbd@gmail.com</a></p>
              <p><strong>ওয়েবসাইট:</strong> <a href="https://khelardesh.com" className="text-[#d33f3f] hover:underline">khelardesh.com</a></p>
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
