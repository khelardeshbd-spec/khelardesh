'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Send, MessageSquare, CheckCircle, AlertCircle, Phone, Globe } from 'lucide-react';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('news_tip');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('অনুগ্রহ করে সমস্ত প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।');
      return;
    }

    setSubmitting(true);
    setError('');

    // Simulate sending / log submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 800);
  };

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
              যোগাযোগ
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto px-4 lg:px-6 py-6 pb-20">
        {/* Page Title */}
        <div className="pb-4 mb-8 border-b-2 border-[var(--ink)]">
          <h1
            lang="bn"
            className="text-3xl sm:text-4xl font-black text-[var(--ink)] mb-2"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            যোগাযোগ ও সম্পাদকীয় অফিস
          </h1>
          <p className="text-sm text-[var(--ink-muted)]" style={{ fontFamily: 'var(--font-body)' }}>
            যেকোনো ক্রীড়া সংবাদ টিপস, তথ্য সংশোধন, বিজ্ঞাপন বা মতামতের জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details & Info (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-xl p-6 space-y-5 shadow-xs">
              <h3 className="text-base font-bold text-[var(--ink)] pb-3 border-b border-[var(--ink-border)]" style={{ fontFamily: 'var(--font-headline)' }}>
                যোগাযোগের মাধ্যমসমূহ
              </h3>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#d33f3f] flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">অফিসিয়াল ইমেইল</h4>
                  <a href="mailto:khelardeshbd@gmail.com" className="text-xs sm:text-sm text-[#d33f3f] font-semibold hover:underline block mt-0.5">
                    khelardeshbd@gmail.com
                  </a>
                  <a href="mailto:editor@khelardesh.com" className="text-xs text-[var(--ink-muted)] hover:underline block mt-0.5">
                    editor@khelardesh.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">সম্পাদকীয় নিউজরুম</h4>
                  <p className="text-xs text-[var(--ink-muted)] mt-0.5 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    ঢাকা নিউজরুম, ঢাকা ১২০৫, বাংলাদেশ।
                  </p>
                </div>
              </div>

              {/* Website & Social */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Globe size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">সামাজিক মাধ্যম</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <a href="https://www.facebook.com/khelardeshbd" target="_blank" rel="noopener noreferrer" className="text-[#d33f3f] font-semibold hover:underline">
                      Facebook Page →
                    </a>
                    <a href="https://www.youtube.com/@joyspeaks9655" target="_blank" rel="noopener noreferrer" className="text-[#d33f3f] font-semibold hover:underline">
                      YouTube Channel →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Note on response time */}
            <div className="bg-amber-50/20 border border-amber-500/20 rounded-xl p-4 text-xs text-[var(--ink-muted)] leading-relaxed">
              <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                <MessageSquare size={14} /> প্রতিক্রিয়া প্রতিশ্রুতি:
              </p>
              আমাদের সম্পাদকীয় দল প্রাপ্ত প্রতিটি মেসেজ অত্যন্ত গুরুত্বের সাথে পর্যালোচনা করে এবং সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে ইমেইলের মাধ্যমে উত্তর দেওয়া হয়।
            </div>
          </div>

          {/* Interactive Contact Form (Right 7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                সরাসরি মেসেজ বা সংবাদ টিপস পাঠান
              </h3>
              <p className="text-xs text-[var(--ink-muted)] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                নিচের ফর্মটি পূরণ করে আপনার মতামত, ব্রেকিং নিউজ টিপস অথবা সংশোধনী অনুরোধ জমা দিন।
              </p>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center gap-3 bg-emerald-50/20 border border-emerald-500/30 rounded-xl p-6">
                  <CheckCircle size={44} className="text-emerald-500" />
                  <h4 className="text-base font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                    আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!
                  </h4>
                  <p className="text-xs text-[var(--ink-muted)] max-w-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    খেলারদেশের সাথে যোগাযোগ করার জন্য ধন্যবাদ। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 bg-[var(--ink)] text-[var(--bg-page)] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    আরেকটি বার্তা পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 flex items-center gap-2">
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[var(--ink-muted)] block mb-1">
                        আপনার নাম *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: তানভীর আহমেদ"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[#d33f3f]"
                        style={{ fontFamily: 'var(--font-body)' }}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--ink-muted)] block mb-1">
                        ইমেইল ঠিকানা *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[#d33f3f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--ink-muted)] block mb-1">
                      বার্তার বিষয় (Topic / Subject)
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[#d33f3f]"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <option value="news_tip">সংবাদ টিপস / তথ্য প্রদান (News Tip)</option>
                      <option value="correction">তথ্য সংশোধন অনুরোধ (Correction Request)</option>
                      <option value="sponsorship">বিজ্ঞাপন ও স্পন্সরশিপ (Advertising / Ads)</option>
                      <option value="copyright">কপিরাইট ও কন্টেন্ট অপসারণ (Copyright / Removal)</option>
                      <option value="feedback">সাধারণ মতামত বা পরামর্শ (General Feedback)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--ink-muted)] block mb-1">
                      আপনার বার্তা বিস্তারিত লিখুন *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="এখানে আপনার বার্তা বিস্তারিত লিখুন..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[#d33f3f] resize-none"
                      style={{ fontFamily: 'var(--font-body)' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#d33f3f] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {submitting ? (
                      <span>বার্তা পাঠানো হচ্ছে...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>বার্তা পাঠান (Send Message)</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  );
}
