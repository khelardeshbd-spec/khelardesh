/**
 * SkeletonCard — Section 13 rule 7
 * Skeleton placeholder matching ArticleCard shape (animated pulse)
 */
export default function SkeletonCard() {
  return (
    <div
      className="flex gap-3 py-3"
      style={{ borderBottom: '0.5px solid var(--ink-border)' }}
      aria-hidden="true"
    >
      {/* Thumbnail placeholder */}
      <div
        className="skeleton flex-shrink-0"
        style={{ width: 84, height: 63 }}
      />

      {/* Text placeholders */}
      <div className="flex flex-col gap-1.5 flex-1 justify-center">
        {/* Sport label */}
        <div className="skeleton" style={{ height: 7, width: 48 }} />
        {/* Headline line 1 */}
        <div className="skeleton" style={{ height: 12, width: '90%' }} />
        {/* Headline line 2 */}
        <div className="skeleton" style={{ height: 12, width: '70%' }} />
        {/* Snippet */}
        <div className="skeleton" style={{ height: 9, width: '80%' }} />
        {/* Time */}
        <div className="skeleton" style={{ height: 7, width: 40 }} />
      </div>
    </div>
  );
}
