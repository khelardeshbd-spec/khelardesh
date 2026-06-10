import Link from 'next/link';
import PhotoCardWidget from './PhotoCardWidget';

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

  const photoCards = [
    { title: 'আপনি জানেন কি?', href: '#', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&q=80' },
    { title: 'ইতিহাসের পাতা থেকে', href: '#', imageUrl: 'https://images.unsplash.com/photo-1508344928928-7137b29de216?w=500&q=80' },
    { title: 'আজকের খেলা', href: '#', imageUrl: 'https://images.unsplash.com/photo-1518605368461-1e12961e69b5?w=500&q=80' },
    { title: 'টিভিতে যা দেখবেন', href: '#', imageUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&q=80' },
  ];

  return (
    <div className="flex flex-col gap-8" aria-label="Latest News & Widgets">
      {/* Latest Articles */}
      <section>
        <h2
          style={{
            fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            borderBottom: '1px solid var(--ink-border)',
            paddingBottom: 4,
            marginBottom: 10,
          }}
        >
          সবশেষ
        </h2>
        <div className="flex flex-col gap-5">
          {briefs.map((article) => {
            const displayTitle = article.headlineBn || article.headline;
            return (
              <Link key={article.id} href={`/article/${article.slug}`} className="group block">
                <p
                  style={{
                    fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                    fontSize: 9,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    color: 'var(--ink-muted)',
                    marginBottom: 2,
                  }}
                  lang="bn"
                >
                  {article.sport}
                </p>
                <h3
                  lang="bn"
                  style={{
                    fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
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

      {/* Photo Cards */}
      <section className="flex flex-col gap-4">
        {photoCards.map((card, i) => (
          <PhotoCardWidget key={i} title={card.title} href={card.href} imageUrl={card.imageUrl} />
        ))}
      </section>
    </div>
  );
}
