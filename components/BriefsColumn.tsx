import Link from 'next/link';

interface Article {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  sport: string;
}

interface BriefsColumnProps {
  articles: Article[];
}

export default function BriefsColumn({ articles }: BriefsColumnProps) {
  // Take 6 articles for short brief updates
  const briefs = articles.slice(0, 6);

  return (
    <div className="flex flex-col gap-6" aria-label="Briefs & Headlines">
      <section>
        <h2
          style={{
            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            borderBottom: '1px solid var(--ink-border)',
            paddingBottom: 4,
            marginBottom: 10,
          }}
        >
          সংক্ষিপ্ত ও শিরোনাম
        </h2>
        <div className="flex flex-col gap-5">
          {briefs.map((article) => {
            const displayTitle = article.headlineBn || article.headline;
            const isBn = !!article.headlineBn;
            return (
              <Link key={article.id} href={`/article/${article.slug}`} className="group block">
                <p
                  style={{
                    fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                    fontSize: 8,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    color: 'var(--ink-muted)',
                    marginBottom: 2,
                  }}
                >
                  {article.sport.toUpperCase()}
                </p>
                <h3
                  lang={isBn ? 'bn' : 'en'}
                  style={{
                    fontFamily: isBn
                      ? "'Manowar Murshidabad', 'Noto Serif Bengali', serif"
                      : "Georgia, 'Times New Roman', Times, serif",
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                  }}
                  className="group-hover:underline"
                >
                  {displayTitle}
                </h3>
              </Link>
            );
          })}
          {briefs.length === 0 && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="skeleton" style={{ height: 8, width: '60%' }} />
                  <div className="skeleton" style={{ height: 10, width: '100%' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
