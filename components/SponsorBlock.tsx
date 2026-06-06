/**
 * SponsorBlock — Section 10.8
 * "Sponsor" / "পার্টনার"   8px Hind Siliguri uppercase --ink-ghost
 * Title                     Playfair 13px bold
 * Italic tagline            11px Source Serif 4 300 --ink-muted
 * [CTA button]              9px Hind Siliguri uppercase, 0.5px --ink border
 * Left border: 2px solid --ink
 * Background: --bg-surface
 * No images, no animation
 * Clearly labelled
 */

interface SponsorBlockProps {
  label?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
}

export default function SponsorBlock({
  label = 'Sponsor',
  title,
  subtitle,
  ctaText,
  ctaUrl,
}: SponsorBlockProps) {
  return (
    <aside
      aria-label={`Sponsored content: ${title}`}
      style={{
        borderLeft: '2px solid var(--ink)',
        backgroundColor: 'var(--bg-surface)',
        padding: '10px 14px',
        marginBlock: 12,
      }}
    >
      {/* Sponsor label */}
      <p
        style={{
          fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
          fontSize: 8,
          fontWeight: 400,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--ink-ghost)',
          marginBottom: 4,
        }}
      >
        {label}
      </p>

      {/* Title */}
      <p
        style={{
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--ink)',
          marginBottom: 3,
          lineHeight: 1.3,
        }}
        lang="bn"
      >
        {title}
      </p>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 11,
          color: 'var(--ink-muted)',
          marginBottom: 8,
          lineHeight: 1.5,
        }}
        lang="bn"
      >
        {subtitle}
      </p>

      {/* CTA */}
      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sponsor-cta-link"
        style={{
          display: 'inline-block',
          fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          border: '0.5px solid var(--ink)',
          padding: '3px 8px',
          borderRadius: 1,
          transition: 'opacity 0.15s ease',
        }}
        lang="bn"
      >
        {ctaText}
      </a>
    </aside>
  );
}
