'use client';

/**
 * Masthead — Section 10.1
 * "FIELD" in Playfair Display 900
 * Desktop: centered 64px; Mobile: left-aligned 30px
 * Bottom border: 3px double --ink
 */
export default function Masthead() {
  return (
    <div className="masthead-border pb-1">
      {/* Tagline above title */}
      <p
        className="type-kicker text-center tracking-widest mb-0.5"
        style={{ fontSize: '10px', fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif", color: 'var(--ink-muted)' }}
      >
        Sports · Independent
      </p>
      {/* The খেলারদেশ logo image */}
      <div className="flex justify-center py-1">
        <img
          src="/logo.png"
          alt="খেলারদেশ"
          style={{
            height: '110px',
            objectFit: 'contain',
            filter: 'var(--logo-filter, none)'
          }}
        />
      </div>
    </div>
  );
}
