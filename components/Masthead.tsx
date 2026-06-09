'use client';

/**
 * Masthead — Section 10.1
 * "FIELD" in Playfair Display 900
 * Desktop: centered 64px; Mobile: left-aligned 30px
 * Bottom border: 3px double --ink
 */
export default function Masthead() {
  return (
    <div className="flex flex-col items-start w-full" style={{ maxWidth: '240px' }}>
      {/* The খেলারদেশ logo image */}
      <img
        src="/logo.png"
        alt="খেলারদেশ"
        style={{
          height: '190px',
          objectFit: 'contain',
          filter: 'var(--logo-filter, none)',
          marginLeft: '-30px',
          display: 'block'
        }}
      />
      {/* Tagline below logo */}
      <p
        className="type-kicker tracking-widest"
        style={{ 
          fontSize: '10px', 
          fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif", 
          color: 'var(--ink-muted)',
          paddingLeft: '12px',
          marginTop: '-24px',
          textTransform: 'uppercase'
        }}
      >
        SPORTS · INDEPENDENT
      </p>
    </div>
  );
}
