import Link from 'next/link';

export default function Footer() {
  return (
    <footer 
      className="w-full border-t border-[var(--ink-border)] bg-[var(--bg-surface)] mt-12"
      style={{ paddingBottom: 'max(80px, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link href="/" aria-label="খেলারদেশ">
            <img
              src="/logo.png"
              alt="খেলারদেশ"
              style={{
                height: '36px',
                objectFit: 'contain',
                filter: 'var(--logo-filter, none)',
                display: 'block'
              }}
            />
          </Link>
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
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {['সম্পর্কে', 'যোগাযোগ', 'গোপনীয়তা'].map((link) => (
            <Link 
              key={link}
              href={`/${link === 'সম্পর্কে' ? 'about' : link === 'যোগাযোগ' ? 'contact' : 'privacy'}`}
              lang="bn"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--ink)',
              }}
              className="hover:text-[var(--ink-muted)] transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Social SVGs */}
        <div className="flex items-center gap-4 text-[var(--ink)]">
          <a href="#" aria-label="Facebook" className="hover:opacity-70 transition-opacity">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </a>
          <a href="#" aria-label="YouTube" className="hover:opacity-70 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.582 6.186a2.685 2.685 0 00-1.884-1.895C17.962 3.846 12 3.846 12 3.846s-5.961 0-7.698.445a2.684 2.684 0 00-1.884 1.895C1.968 7.935 1.968 12 1.968 12s0 4.065.45 5.814a2.684 2.684 0 001.884 1.895c1.737.445 7.698.445 7.698.445s5.962 0 7.698-.445a2.685 2.685 0 001.884-1.895c.45-1.749.45-5.814.45-5.814s0-4.065-.45-5.814zM9.98 15.196V8.804L15.467 12l-5.488 3.196z"/>
            </svg>
          </a>
        </div>
        
      </div>
    </footer>
  );
}
