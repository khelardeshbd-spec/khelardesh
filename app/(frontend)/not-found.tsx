import Link from 'next/link';

export const metadata = {
  title: '৪০৪ — পাতাটি খুঁজে পাওয়া যায়নি',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-12" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Logo */}
      <Link href="/" aria-label="খেলারদেশ">
        <img
          src="/logo.png"
          alt="খেলারদেশ"
          style={{
            height: '48px',
            objectFit: 'contain',
            filter: 'var(--logo-filter, none)',
            display: 'block',
            marginBottom: '32px'
          }}
        />
      </Link>

      {/* Massive 404 */}
      <h1 
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 'clamp(80px, 15vw, 120px)',
          fontWeight: 900,
          color: 'var(--live-red)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          marginBottom: '16px'
        }}
        lang="bn"
      >
        ৪০৪
      </h1>

      {/* Error Message */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 500,
          color: 'var(--ink)',
          marginBottom: '40px',
          textAlign: 'center'
        }}
        lang="bn"
      >
        পাতাটি খুঁজে পাওয়া যায়নি।
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link 
          href="/"
          className="flex items-center justify-center min-w-[160px] py-3 px-6 transition-opacity hover:opacity-80"
          style={{
            backgroundColor: 'var(--ink)',
            color: 'var(--bg-page)',
            fontFamily: "var(--font-body)",
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 2
          }}
          lang="bn"
        >
          নীড়পাতায় ফিরুন
        </Link>
        <Link 
          href="/search"
          className="flex items-center justify-center min-w-[160px] py-3 px-6 transition-opacity hover:opacity-80"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--ink)',
            border: '1px solid var(--ink)',
            fontFamily: "var(--font-body)",
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 2
          }}
          lang="bn"
        >
          খোঁজ করুন
        </Link>
      </div>
    </div>
  );
}
