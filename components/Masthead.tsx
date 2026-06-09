'use client';

/**
 * Masthead — Section 10.1
 * "FIELD" in Playfair Display 900
 * Desktop: centered 64px; Mobile: left-aligned 30px
 * Bottom border: 3px double --ink
 */
export default function Masthead() {
  return (
    <div className="masthead-border">
      {/* Tagline above title */}
      <p
        className="type-kicker text-center tracking-widest"
        style={{ fontSize: '10px', fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif", color: 'var(--ink-muted)', marginBottom: '2px' }}
      >
        Sports · Independent
      </p>
      {/* The খেলারদেশ logo image */}
      <div className="flex justify-center">
        <img
          src="/logo.png"
          alt="খেলারদেশ"
          style={{
            height: '160px',
            objectFit: 'contain',
            filter: 'var(--logo-filter, none)',
            marginTop: '-5px',
            marginBottom: '-5px'
          }}
        />
      </div>
    </div>
  );
}
