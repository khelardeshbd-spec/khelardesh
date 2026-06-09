'use client';

/**
 * Masthead — Section 10.1
 * "FIELD" in Playfair Display 900
 * Desktop: centered 64px; Mobile: left-aligned 30px
 * Bottom border: 3px double --ink
 */
export default function Masthead() {
  return (
    <div className="flex flex-col items-start pt-2">
      {/* The খেলারদেশ logo image */}
      <img
        src="/logo.png"
        alt="খেলারদেশ"
        style={{
          height: '140px',
          objectFit: 'contain',
          filter: 'var(--logo-filter, none)',
          marginLeft: '-15px'
        }}
      />
      {/* Tagline below logo */}
      <p
        className="type-kicker tracking-widest mt-1"
        style={{ 
          fontSize: '9.5px', 
          fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif", 
          color: 'var(--ink-muted)',
          paddingLeft: '12px'
        }}
      >
        SPORTS · INDEPENDENT
      </p>
    </div>
  );
}
