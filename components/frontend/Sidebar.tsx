import Link from 'next/link';
import ScoreCard from './ScoreCard';
import SponsorBlock from './SponsorBlock';

interface Score {
  id: number;
  league: string;
  teamA: string;
  scoreA: string;
  teamB: string;
  scoreB: string;
  winnerTeam?: string | null;
  status: string;
  isLive: boolean;
  displayOrder: number;
  home_team_logo?: string;
  away_team_logo?: string;
}

interface Sponsor {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
}

interface SidebarProps {
  scores: Score[];
  sponsors: Sponsor[];
}

/**
 * Sidebar — Section 4 (desktop ≥1024px)
 * - Scores section with "সব স্কোর দেখুন →" link
 * - Sponsor block
 */
export default function Sidebar({ scores, sponsors }: SidebarProps) {
  const sorted = [...scores].sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    return a.displayOrder - b.displayOrder;
  });

  const hasLive = sorted.some((s) => s.isLive);

  const sidebarSponsor = sponsors.find(
    (s) => s.label.toLowerCase().includes('sidebar') || s.label === 'Sponsor'
  );

  return (
    <aside className="flex flex-col gap-6" aria-label="Sidebar">
      {/* Scores section */}
      <section>
        {/* Section heading */}
        <div
          className="flex items-center justify-between"
          style={{
            borderBottom: '1px solid var(--ink-border)',
            paddingBottom: 6,
            marginBottom: 10,
          }}
        >
          <h2
            style={{
              fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--ink-muted)',
            }}
            lang="bn"
          >
            {hasLive ? (
              <span className="flex items-center gap-1.5">
                <span className="live-dot" style={{ width: 6, height: 6 }} />
                লাইভ স্কোর
              </span>
            ) : (
              'স্কোর'
            )}
          </h2>
          <Link
            href="/scores"
            style={{
              fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
              fontSize: 9,
              color: 'var(--ink-muted)',
              textDecoration: 'none',
            }}
            lang="bn"
            className="hover:underline"
          >
            সব →
          </Link>
        </div>

        {sorted.length > 0 ? (
          <div className="flex flex-col gap-2">
            {sorted.map((score) => (
              <ScoreCard
                key={score.id}
                league={score.league}
                teamA={score.teamA}
                scoreA={score.scoreA}
                teamB={score.teamB}
                scoreB={score.scoreB}
                winnerTeam={score.winnerTeam}
                status={score.status}
                isLive={score.isLive}
                home_team_logo={score.home_team_logo}
                away_team_logo={score.away_team_logo}
              />
            ))}
          </div>
        ) : (
          <p
            style={{
              fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
              fontSize: 12,
              color: 'var(--ink-ghost)',
              textAlign: 'center',
              padding: '12px 0',
            }}
            lang="bn"
          >
            কোনো লাইভ ম্যাচ নেই
          </p>
        )}
      </section>

      {/* Sponsor block */}
      {sidebarSponsor && (
        <SponsorBlock
          label={sidebarSponsor.label}
          title={sidebarSponsor.title}
          subtitle={sidebarSponsor.subtitle}
          ctaText={sidebarSponsor.ctaText}
          ctaUrl={sidebarSponsor.ctaUrl}
        />
      )}
    </aside>
  );
}
