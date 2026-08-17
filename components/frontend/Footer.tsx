import Link from 'next/link';

export default function Footer() {
  return (
    <footer 
      className="w-full border-t border-[var(--ink-border)] bg-[var(--bg-surface)] mt-16 transition-colors duration-200"
      style={{ paddingBottom: 'max(80px, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <Link href="/" aria-label="খেলারদেশ" className="inline-block self-start">
              <img
                src="/logo.png"
                alt="খেলারদেশ"
                style={{
                  height: '52px',
                  objectFit: 'contain',
                  filter: 'var(--logo-filter, none)',
                  display: 'block'
                }}
              />
            </Link>
            <p 
              lang="bn"
              className="text-xs leading-relaxed text-[var(--ink-muted)] font-sans"
              style={{ fontFamily: "var(--font-body)" }}
            >
              স্বাধীন বাংলাদেশি স্পোর্টস নিউজ পোর্টাল। ফুটবল, ক্রিকেট ও অন্যান্য খেলাধুলার নির্ভরযোগ্য সংবাদ এবং লাইভ স্কোর আপডেট।
            </p>
          </div>

          {/* Column 2: Categories */}
          <div className="flex flex-col gap-3">
            <h3 
              lang="bn"
              className="text-sm font-bold text-[var(--ink)] tracking-wider" 
              style={{ fontFamily: "var(--font-body)" }}
            >
              ক্যাটাগরি
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'ফুটবল', href: '/sport/football' },
                { label: 'ক্রিকেট', href: '/sport/cricket' },
                { label: 'লাইভ স্কোর', href: '/scores' },
                { label: 'সংবাদ আর্কাইভ', href: '/archive' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    lang="bn"
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-xs text-[var(--ink-muted)] hover:text-[#d33f3f] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Info */}
          <div className="flex flex-col gap-3">
            <h3 
              lang="bn"
              className="text-sm font-bold text-[var(--ink)] tracking-wider" 
              style={{ fontFamily: "var(--font-body)" }}
            >
              প্রয়োজনীয় লিংক
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'আমাদের সম্পর্কে', href: '/about' },
                { label: 'যোগাযোগ', href: '/contact' },
                { label: 'গোপনীয়তা নীতি', href: '/privacy' },
                { label: 'ব্যবহারের শর্তাবলী', href: '/terms' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    lang="bn"
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-xs text-[var(--ink-muted)] hover:text-[#d33f3f] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="flex flex-col gap-4">
            <h3 
              lang="bn"
              className="text-sm font-bold text-[var(--ink)] tracking-wider" 
              style={{ fontFamily: "var(--font-body)" }}
            >
              আমাদের সাথে যুক্ত থাকুন
            </h3>
            <div className="flex items-center gap-4 text-[var(--ink)]">
              <a href="https://www.facebook.com/khelardeshbd" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#d33f3f] transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@joyspeaks9655" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#d33f3f] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.582 6.186a2.685 2.685 0 00-1.884-1.895C17.962 3.846 12 3.846 12 3.846s-5.961 0-7.698.445a2.684 2.684 0 00-1.884 1.895C1.968 7.935 1.968 12 1.968 12s0 4.065.45 5.814a2.684 2.684 0 001.884 1.895c1.737.445 7.698.445 7.698.445s5.962 0 7.698-.445a2.685 2.685 0 001.884-1.895c.45-1.749.45-5.814.45-5.814s0-4.065-.45-5.814zM9.98 15.196V8.804L15.467 12l-5.488 3.196z"/>
                </svg>
              </a>
            </div>
            
            <p 
              className="text-[10px] text-[var(--ink-muted)]"
              style={{ marginTop: 'auto' }}
            >
              Powered by{' '}
              <a 
                href="https://www.instagram.com/dullstudio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline font-semibold"
                style={{ color: 'var(--ink)' }}
              >
                DullStudio
              </a>
            </p>
          </div>

        </div>

        {/* Bottom copyright section */}
        <div className="border-t border-[var(--ink-border)] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p 
            lang="bn"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: 'var(--ink-muted)',
            }}
          >
            © ২০২৬ খেলারদেশ। সর্বস্বত্ব সংরক্ষিত।
          </p>
          
          <p className="text-[10px] text-[var(--ink-muted)]">
            Designed and Developed for sporting excellence.
          </p>
        </div>
        
      </div>
    </footer>
  );
}
