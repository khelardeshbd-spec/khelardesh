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
      {/* Tagline removed as per request to remove English */}
    </div>
  );
}
