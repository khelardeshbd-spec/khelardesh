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
      {/* The খেলারদেশ wordmark */}
      <h1
        className="type-masthead text-center"
        style={{
          fontFamily: "'Manowar Murshidabad', 'Noto Serif Bengali', serif",
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: 'var(--ink)',
        }}
      >
        খেলারদেশ
      </h1>
    </div>
  );
}
