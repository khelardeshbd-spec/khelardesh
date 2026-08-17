import Link from 'next/link';

export default function Footer() {
  return (
    <footer 
      className="w-full border-t border-[var(--ink-border)] bg-[var(--bg-page)] mt-16 transition-colors duration-200"
      style={{ paddingBottom: 'max(80px, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand Identity & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <Link href="/" aria-label="খেলারদেশ" className="inline-block flex-shrink-0">
            <img
              src="/logo.png"
              alt="খেলারদেশ"
              style={{
                height: '42px',
                objectFit: 'contain',
                filter: 'var(--logo-filter, none)',
                display: 'block'
              }}
            />
          </Link>
          <div className="flex flex-col">
            <p 
              lang="bn"
              className="text-xs font-semibold text-[var(--ink)] tracking-wide"
              style={{ fontFamily: "var(--font-body)" }}
            >
              © ২০২৬ খেলারদেশ। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <p 
              className="text-[11px] text-[var(--ink-muted)] mt-0.5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Powered by{' '}
              <a 
                href="https://www.instagram.com/dullstudio" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline font-semibold text-[var(--ink)]"
              >
                DullStudio
              </a>
            </p>
          </div>
        </div>

        {/* Center: Essential Navigation Links */}
        <nav aria-label="ফুটার লিংকসমূহ" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            { label: 'আমাদের সম্পর্কে', href: '/about' },
            { label: 'যোগাযোগ', href: '/contact' },
            { label: 'গোপনীয়তা নীতি', href: '/privacy' },
            { label: 'ব্যবহারের শর্তাবলী', href: '/terms' },
            { label: 'আর্কাইভ', href: '/archive' },
          ].map((link) => (
            <Link 
              key={link.label}
              href={link.href}
              lang="bn"
              style={{ fontFamily: "var(--font-body)" }}
              className="text-xs font-bold text-[var(--ink)] hover:text-[#d33f3f] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Social icons */}
        <div className="flex items-center gap-4 text-[var(--ink)] flex-shrink-0">
          <a 
            href="https://www.facebook.com/khelardeshbd" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Facebook" 
            className="hover:text-[#d33f3f] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </a>
          <a 
            href="https://www.youtube.com/@joyspeaks9655" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="YouTube" 
            className="hover:text-[#d33f3f] transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.582 6.186a2.685 2.685 0 00-1.884-1.895C17.962 3.846 12 3.846 12 3.846s-5.961 0-7.698.445a2.684 2.684 0 00-1.884 1.895C1.968 7.935 1.968 12 1.968 12s0 4.065.45 5.814a2.684 2.684 0 001.884 1.895c1.737.445 7.698.445 7.698.445s5.962 0 7.698-.445a2.685 2.685 0 001.884-1.895c.45-1.749.45-5.814.45-5.814s0-4.065-.45-5.814zM9.98 15.196V8.804L15.467 12l-5.488 3.196z"/>
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
}
