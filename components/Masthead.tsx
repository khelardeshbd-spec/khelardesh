'use client';

/**
 * Masthead — Section 10.1
 * "FIELD" in Playfair Display 900
 * Desktop: centered 64px; Mobile: left-aligned 30px
 * Bottom border: 3px double --ink
 */
export default function Masthead() {
  return (
    <div className="flex flex-col items-start" style={{ minWidth: '220px' }}>
      {/* The খেলারদেশ logo image */}
      <img
        src="/logo.png"
        alt="খেলারদেশ"
        style={{
          height: '160px',
          objectFit: 'contain',
          filter: 'var(--logo-filter, none)',
          marginLeft: '-22px',
          display: 'block'
        }}
      />
      {/* Tagline below logo */}
      <p
        className="type-kicker tracking-widest"
        style={{ 
          fontSize: '9.5px', 
          fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif", 
          color: 'var(--ink-muted)',
          paddingLeft: '14px',
          marginTop: '-12px',
          textTransform: 'uppercase'
        }}
      >
        SPORTS · INDEPENDENT
      </p>
    </div>
  );
}
