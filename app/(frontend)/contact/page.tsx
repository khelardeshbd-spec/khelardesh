'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Send, MessageSquare, CheckCircle, AlertCircle, Globe } from 'lucide-react';
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

    // Simulate sending
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
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
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[var(--ink-muted)]"
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

      <main className="max-w-[900px] mx-auto px-4 lg:px-6 py-6 pb-20 font-sans">
        <article className="border-t-2 border-[var(--ink)] pt-6">
          
          {/* Header */}
          <header className="pb-6 mb-8 border-b border-[var(--ink-border)]">
            <h1 
              lang="bn"
              className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--ink)] leading-tight mb-2" 
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              যোগাযোগ ও সম্পাদকীয় অফিস
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              যেকোনো ক্রীড়া সংবাদ টিপস, তথ্য সংশোধন, বিজ্ঞাপন বা মতামতের জন্য আমাদের সাথে যোগাযোগ করুন।
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 5 cols: Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border border-[var(--ink-border)] bg-[var(--bg-surface)] rounded-xl p-5 space-y-5">
                <h3 className="text-base font-bold text-[var(--ink)] pb-3 border-b border-[var(--ink-border)]" style={{ fontFamily: 'var(--font-headline)' }}>
                  যোগাযোগের মাধ্যমসমূহ
                </h3>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-[var(--ink-muted)] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">অফিসিয়াল ইমেইল</h4>
                    <a href="mailto:khelardeshbd@gmail.com" className="text-xs sm:text-sm text-[#d33f3f] font-semibold hover:underline block mt-0.5">
                      khelardeshbd@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[var(--ink-muted)] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">সম্পাদকীয় নিউজরুম</h4>
                    <p className="text-xs text-[var(--ink-muted)] mt-0.5 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      ঢাকা নিউজরুম, ঢাকা ১২০৫, বাংলাদেশ।
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-start gap-3">
                  <Globe size={16} className="text-[var(--ink-muted)] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">সামাজিক মাধ্যম</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <a href="https://www.facebook.com/khelardeshbd" target="_blank" rel="noopener noreferrer" className="text-[#d33f3f] font-semibold hover:underline">
                        Facebook →
                      </a>
                      <a href="https://www.youtube.com/@joyspeaks9655" target="_blank" rel="noopener noreferrer" className="text-[#d33f3f] font-semibold hover:underline">
                        YouTube →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response commitment note */}
              <div className="border border-[var(--ink-border)] bg-[var(--bg-page)] rounded-xl p-4 text-xs text-[var(--ink-muted)] leading-relaxed">
                <p className="font-semibold text-[var(--ink)] mb-1">
                  প্রতিক্রিয়া প্রতিশ্রুতি:
                </p>
                আমাদের সম্পাদকীয় দল প্রাপ্ত প্রতিটি মেসেজ অত্যন্ত গুরুত্বের সাথে পর্যালোচনা করে এবং সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দেওয়া হয়।
              </div>
            </div>

            {/* Right 7 cols: Contact Form */}
            <div className="lg:col-span-7">
              <div className="border border-[var(--ink-border)] bg-[var(--bg-surface)] rounded-xl p-6 sm:p-7">
                <h3 className="text-base sm:text-lg font-bold text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-headline)' }}>
                  সরাসরি বার্তা বা সংবাদ টিপস পাঠান
                </h3>
                <p className="text-xs text-[var(--ink-muted)] mb-5" style={{ fontFamily: 'var(--font-body)' }}>
                  নিচের ফর্মটি পূরণ করে আপনার মতামত, ব্রেকিং নিউজ টিপস অথবা সংশোধনী অনুরোধ জানান।
                </p>

                {submitted ? (
                  <div className="py-10 text-center flex flex-col items-center gap-3 border border-[var(--ink-border)] bg-[var(--bg-page)] rounded-xl p-6">
                    <CheckCircle size={36} className="text-[var(--ink)]" />
                    <h4 className="text-base font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-headline)' }}>
                      আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!
                    </h4>
                    <p className="text-xs text-[var(--ink-muted)] max-w-sm" style={{ fontFamily: 'var(--font-body)' }}>
                      খেলারদেশের সাথে যোগাযোগ করার জন্য ধন্যবাদ। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-3 px-4 py-2 bg-[var(--ink)] text-[var(--bg-page)] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      আরেকটি বার্তা পাঠান
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 rounded-lg bg-[var(--bg-page)] border border-red-500 text-xs text-red-600 flex items-center gap-2">
                        <AlertCircle size={15} />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                          আপনার নাম *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: তানভীর আহমেদ"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--ink)]"
                          style={{ fontFamily: 'var(--font-body)' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                          ইমেইল ঠিকানা *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--ink)] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                        বার্তার বিষয়
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--ink)]"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        <option value="news_tip">ব্রেকিং নিউজ বা সংবাদ টিপস</option>
                        <option value="correction">তথ্য সংশোধনের অনুরোধ</option>
                        <option value="advertisement">বিজ্ঞাপন বা স্পন্সরশিপ অনুসন্ধান</option>
                        <option value="opinion">মতামত ও প্রতিক্রিয়া</option>
                        <option value="general">সাধারণ জিজ্ঞাসা</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                        বিস্তারিত বার্তা *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="আপনার বক্তব্য বা সংবাদ টিপস বিস্তারিত এখানে লিখুন..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--ink)] resize-y"
                        style={{ fontFamily: 'var(--font-body)' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 px-4 bg-[var(--ink)] text-[var(--bg-page)] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <Send size={14} />
                      {submitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </article>
      </main>

      <ScrollToTopButton />
    </div>
  );
}
