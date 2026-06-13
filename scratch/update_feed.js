const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'components', 'frontend', 'InfiniteArticleFeed.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldArticleRow = `function ArticleRow({ article }: { article: Article }) {
  const displayHeadline = article.headlineBn || article.headline;
  const sportLabel = SPORT_LABELS[article.sport] ?? article.sport;
  const time = timeAgo(article.publishedAt, 'bn');
  const exactTime = formatDatetime(article.publishedAt);

  return (
    <article
      style={{
        borderBottom: '1px solid #e2e2e2',
        paddingBottom: '2rem',
        marginBottom: '2rem',
        animation: 'fadeInUp 0.35s ease both',
      }}
    >
      <Link
        href={\`/article/\${article.slug}\`}
        className="group block"
        aria-label={\`পড়ুন: \${displayHeadline}\`}
      >
        {/* Big image */}
        {article.mediaUrl && (
          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              overflow: 'hidden',
              marginBottom: '0.75rem',
              border: '1px solid #e2e2e2',
              padding: '3px',
              backgroundColor: '#f5f5f5',
            }}
          >
            <img
              src={article.mediaUrl}
              alt={displayHeadline}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.3s ease',
              }}
              className="group-hover:scale-[1.02]"
            />
          </div>
        )}

        {/* Category label */}
        <span
          lang="bn"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            letterSpacing: '0.05em',
            color: '#dc2626',
            fontWeight: 600,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 4,
          }}
        >
          {sportLabel}
        </span>

        {/* Headline */}
        <h2
          lang="bn"
          style={{
            fontFamily: 'var(--font-headline)',
            fontWeight: 700,
            fontSize: '1.6rem',
            lineHeight: 1.2,
            color: '#121212',
            marginBottom: '0.5rem',
            letterSpacing: '-0.01em',
          }}
          className="group-hover:underline"
        >
          {displayHeadline}
        </h2>

        {/* Deck */}
        {article.deck && (
          <p
            lang="bn"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 14,
              color: '#555555',
              lineHeight: 1.6,
              marginBottom: '0.6rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.deck}
          </p>
        )}

        {/* Byline + time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: '#888888',
            }}
            title={exactTime}
          >
            {article.byline} · {time}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 700,
              color: '#d33f3f',
            }}
          >
            আরো পড়ুন
          </span>
        </div>
      </Link>
    </article>
  );
}`;

const newArticleRow = `function ArticleRow({ article }: { article: Article }) {
  const displayHeadline = article.headlineBn || article.headline;
  const sportLabel = SPORT_LABELS[article.sport] ?? article.sport;
  const time = timeAgo(article.publishedAt, 'bn');
  const exactTime = formatDatetime(article.publishedAt);

  return (
    <article
      style={{
        borderBottom: '1px solid #e2e2e2',
        paddingBottom: '2rem',
        marginBottom: '2rem',
        animation: 'fadeInUp 0.35s ease both',
      }}
    >
      <Link
        href={\`/article/\${article.slug}\`}
        className="group block"
        aria-label={\`পড়ুন: \${displayHeadline}\`}
      >
        {/* Uniform image area */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            marginBottom: '0.75rem',
            border: '1px solid #e2e2e2',
            padding: '3px',
            backgroundColor: '#f5f5f5',
          }}
        >
          {article.mediaUrl ? (
            <img
              src={article.mediaUrl}
              alt={displayHeadline}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.3s ease',
              }}
              className="group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full bg-[#f3f1ec] flex items-center justify-center text-gray-400 italic text-xs font-normal">
              ছবি নেই
            </div>
          )}
        </div>

        {/* Category label */}
        <span
          lang="bn"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            letterSpacing: '0.05em',
            color: '#dc2626',
            fontWeight: 600,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 4,
          }}
        >
          {sportLabel}
        </span>

        {/* Headline — Uniformly sized & clamped */}
        <h2
          lang="bn"
          style={{
            fontFamily: 'var(--font-headline)',
            fontWeight: 700,
            fontSize: '1.4rem',
            lineHeight: 1.3,
            color: '#121212',
            marginBottom: '0.5rem',
            letterSpacing: '-0.01em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.6em',
          }}
          className="group-hover:underline"
        >
          {displayHeadline}
        </h2>

        {/* Deck — Uniformly sized & clamped, strictly normal weight */}
        <p
          lang="bn"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 14,
            color: '#555555',
            lineHeight: 1.6,
            marginBottom: '0.6rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '4.8em',
          }}
        >
          {article.deck || 'খেলারদেশ স্পোর্টস নিউজ ডেস্ক থেকে বিস্তারিত খবর আসছে...'}
        </p>

        {/* Byline + time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 400,
              color: '#888888',
            }}
            title={exactTime}
          >
            {article.byline} · {time}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 700,
              color: '#d33f3f',
            }}
          >
            আরো পড়ুন
          </span>
        </div>
      </Link>
    </article>
  );
}`;

if (content.includes(oldArticleRow)) {
  content = content.replace(oldArticleRow, newArticleRow);
  console.log("Successfully replaced ArticleRow");
} else {
  console.log("Failed to find exact ArticleRow content");
}

// 2. Replace section title
const oldTitle = `        <h2
          lang="bn"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#121212',
          }}
        >
          সর্বশেষ খবর
        </h2>`;

const newTitle = `        <h2
          lang="bn"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#121212',
          }}
        >
          আরও খবর -
        </h2>`;

if (content.includes(oldTitle)) {
  content = content.replace(oldTitle, newTitle);
  console.log("Successfully replaced Section Title");
} else {
  console.log("Failed to find exact Title content");
}

fs.writeFileSync(filePath, content, 'utf8');
