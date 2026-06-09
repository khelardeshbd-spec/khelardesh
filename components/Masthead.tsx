'use client';

/**
 * Masthead — Section 10.1
 * "FIELD" in Playfair Display 900
 * Desktop: centered 64px; Mobile: left-aligned 30px
 * Bottom border: 3px double --ink
 */
export default function Masthead() {
  return (
    <div className="flex flex-col items-start" style={{ minWidth: '180px' }}>
      {/* The খেলারদেশ logo image */}
      <img
        src="/logo.png"
        alt="খেলারদেশ"
        style={{
          height: '110px',
          objectFit: 'contain',
          filter: 'var(--logo-filter, none)',
          marginLeft: '-15px',
          display: 'block'
        }}
      />
      {/* Tagline below logo */}
      <p
        className="type-kicker tracking-widest"
        style={{ 
          fontSize: '8px', 
          fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif", 
          color: 'var(--ink-muted)',
          paddingLeft: '12px',
          marginTop: '-6px',
          textTransform: 'uppercase'
        }}
      >
        SPORTS · INDEPENDENT
      </p>
    </div>
  );
}
