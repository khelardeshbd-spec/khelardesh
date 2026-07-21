export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const EN_TO_BN_DIGITS: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

function toBengaliDigits(str: string | number | undefined | null): string {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[0-9]/g, (digit) => EN_TO_BN_DIGITS[digit]);
}

function mapSportType(sportName: string, event: any): string {
  const tName = event.tournament?.name || '';
  const home = event.homeTeam?.name || '';
  const away = event.awayTeam?.name || '';
  
  if (sportName === 'football') {
    if (tName.includes('Bangladesh') || tName.includes('BPL')) return 'bd-football';
    return 'football';
  }
  if (sportName === 'cricket') {
    if (home.includes('Bangladesh') || away.includes('Bangladesh')) return 'bd-cricket';
    return 'cricket';
  }
  return sportName;
}

function formatStartTime(timestamp: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return toBengaliDigits(`${hours}:${minutes}`);
}

function translateStatus(statusObj: any, startTimestamp: number): string {
  if (!statusObj) return '';
  const type = statusObj.type;
  
  switch (type) {
    case 'inprogress': return 'লাইভ';
    case 'halftime': return 'বিরতি';
    case 'finished': return 'পূর্ণ সময়';
    case 'postponed': return 'স্থগিত';
    case 'canceled': return 'বাতিল';
    case 'interrupted': return 'বাধাপ্রাপ্ত';
    case 'pause': return 'বিরতি';
    case 'notstarted': 
      return formatStartTime(startTimestamp);
    default:
      return statusObj.description || '';
  }
}

function isHotGame(event: any, sport: string): boolean {
  if (!event || !event.tournament) return false;
  
  const tournamentName = (event.tournament.name || '').toLowerCase();
  const homeTeam = (event.homeTeam?.name || '').toLowerCase();
  const awayTeam = (event.awayTeam?.name || '').toLowerCase();
  
  const majorCricketTeams = [
    'bangladesh', 'india', 'australia', 'england', 'pakistan', 
    'south africa', 'new zealand', 'sri lanka', 'west indies', 
    'afghanistan', 'ireland', 'zimbabwe'
  ];

  if (sport === 'cricket') {
    const isMajorInt = majorCricketTeams.some(team => homeTeam.includes(team)) ||
                       majorCricketTeams.some(team => awayTeam.includes(team));
    if (isMajorInt) return true;
    
    const isMajorLeague = 
      tournamentName.includes('ipl') || 
      tournamentName.includes('bpl') || 
      tournamentName.includes('premier league') ||
      tournamentName.includes('t20 world cup') ||
      tournamentName.includes('world cup') ||
      tournamentName.includes('asia cup') ||
      tournamentName.includes('big bash') ||
      tournamentName.includes('psl');
      
    return isMajorLeague;
  }
  
  if (sport === 'football') {
    if (homeTeam.includes('bangladesh') || awayTeam.includes('bangladesh')) return true;
    
    const isMajorTourney = 
      tournamentName.includes('premier league') || 
      tournamentName.includes('la liga') || 
      tournamentName.includes('laliga') || 
      tournamentName.includes('champions league') || 
      tournamentName.includes('europa league') || 
      tournamentName.includes('serie a') || 
      tournamentName.includes('bundesliga') || 
      tournamentName.includes('ligue 1') || 
      tournamentName.includes('world cup') || 
      tournamentName.includes('euro 20') || 
      tournamentName.includes('copa america') ||
      tournamentName.includes('afcon') ||
      tournamentName.includes('asian cup') ||
      tournamentName.includes('bpl') ||
      tournamentName.includes('bangladesh');
      
    return isMajorTourney;
  }
  
  return true;
}

async function fetchSofascore(endpoint: string) {
  try {
    const res = await fetch(`https://www.sofascore.com/api/v1${endpoint}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.sofascore.com/',
        'Origin': 'https://www.sofascore.com'
      },
      next: { revalidate: 15 } // cache response server-side for 15 seconds
    });
    if (!res.ok) {
      throw new Error(`SofaScore error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`[SofaScore Fetch Error] endpoint ${endpoint}:`, error);
    return null;
  }
}

async function fetchESPN() {
  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard`, {
      next: { revalidate: 15 }
    });
    if (!res.ok) throw new Error(`ESPN error ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`[ESPN Fetch Error]:`, error);
    return null;
  }
}

export async function GET() {
  try {
    // 1. Fetch real-time live and scheduled scores from Sofascore
    const endpoints = [
      { sport: 'football', type: 'live', url: '/sport/football/events/live' },
      { sport: 'football', type: 'today', url: '/sport/football/events/scheduled/today' },
      { sport: 'cricket', type: 'live', url: '/sport/cricket/events/live' },
      { sport: 'cricket', type: 'today', url: '/sport/cricket/events/scheduled/today' }
    ];

    const [results, espnData] = await Promise.all([
      Promise.allSettled(
        endpoints.map(ep => fetchSofascore(ep.url).then(data => ({ ...ep, data })))
      ),
      fetchESPN()
    ]);

    const apiMatches: any[] = [];
    const seenMatchIds = new Set<string>();

    // Process ESPN Data (reliable fallback for soccer)
    if (espnData && espnData.events) {
      espnData.events.forEach((event: any) => {
        if (!event || seenMatchIds.has(String(event.id))) return;
        
        const comp = event.competitions?.[0];
        if (!comp) return;

        const home = comp.competitors?.find((c: any) => c.homeAway === 'home');
        const away = comp.competitors?.find((c: any) => c.homeAway === 'away');
        if (!home || !away) return;

        seenMatchIds.add(String(event.id));

        const isLive = event.status?.type?.state === 'in';
        const isFinished = event.status?.type?.state === 'post';
        const statusText = isLive ? (event.status?.displayClock || event.status?.type?.shortDetail) : (isFinished ? 'FT' : formatStartTime(new Date(event.date).getTime() / 1000));

        let leagueName = event.season?.slug || 'Soccer';
        // Clean up the ESPN league slug (e.g. "2026-argentine-supercopa" -> "Argentine Supercopa")
        leagueName = leagueName.replace(/^\d{4}-/, '').split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        apiMatches.push({
          id: String(event.id),
          league: leagueName,
          startTime: event.date,
          home: {
            name: home.team?.name || '',
            score: toBengaliDigits(home.score),
            logo: home.team?.logo || '',
            isWinner: home.winner === true,
          },
          away: {
            name: away.team?.name || '',
            score: toBengaliDigits(away.score),
            logo: away.team?.logo || '',
            isWinner: away.winner === true,
          },
          isLive,
          isFinished,
          statusText,
          sport_type: 'football',
        });
      });
    }

    // Process Sofascore Data (multi-sport)
    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value.data) {
        const events = res.value.data.events || [];
        const sport = res.value.sport;
        
        events.forEach((event: any) => {
          if (!event || seenMatchIds.has(String(event.id))) return;
          if (!isHotGame(event, sport)) return;

          seenMatchIds.add(String(event.id));

          const isLive = event.status?.type === 'inprogress';
          const isFinished = event.status?.type === 'finished';
          let statusText = translateStatus(event.status, event.startTimestamp);
          if (isLive && event.time?.played) {
            statusText = toBengaliDigits(`${event.time.played}'`);
          }

          // Fetch correct current scores or display scores
          const rawScoreA = event.homeScore?.current ?? event.homeScore?.display ?? '০';
          const rawScoreB = event.awayScore?.current ?? event.awayScore?.display ?? '০';

          apiMatches.push({
            id: String(event.id),
            league: event.tournament?.name || '',
            startTime: new Date(event.startTimestamp * 1000).toISOString(),
            home: {
              name: event.homeTeam?.name || '',
              score: toBengaliDigits(rawScoreA),
              logo: `https://api.sofascore.com/api/v1/team/${event.homeTeam?.id}/image`,
              isWinner: event.winnerCode === 1,
            },
            away: {
              name: event.awayTeam?.name || '',
              score: toBengaliDigits(rawScoreB),
              logo: `https://api.sofascore.com/api/v1/team/${event.awayTeam?.id}/image`,
              isWinner: event.winnerCode === 2,
            },
            isLive,
            isFinished,
            statusText,
            sport_type: mapSportType(sport, event),
          });
        });
      }
    });

    // 2. Fetch custom database scorecards
    const { data: dbCards, error: dbError } = await supabaseAdmin
      .from('ScoreCard')
      .select('*')
      .eq('is_visible', true);

    if (dbError) {
      console.error('[Supabase DB Error] fetching scorecards:', dbError);
    }

    const finalMatches = [...apiMatches];

    if (dbCards && dbCards.length > 0) {
      dbCards.forEach(card => {
        // Skip duplicate matches that we already fetched in real-time
        if (card.source_match_id && seenMatchIds.has(String(card.source_match_id))) {
          return;
        }
        
        // Filter out stale manual test records (created or updated more than 24 hours ago)
        const isStale = Date.now() - new Date(card.updatedAt || card.createdAt).getTime() > 24 * 60 * 60 * 1000;
        if (isStale) return;

        const isFinished = !card.isLive && (
          card.status === 'পূর্ণ সময়' || 
          card.status === 'FT' || 
          (card.winnerTeam !== null && card.winnerTeam !== '')
        );

        finalMatches.push({
          id: String(card.id),
          league: card.league,
          startTime: card.last_synced_at || card.updatedAt || card.createdAt || new Date().toISOString(),
          home: {
            name: card.teamA,
            score: card.scoreA,
            logo: card.home_team_logo || '',
            isWinner: card.winnerTeam === 'A',
          },
          away: {
            name: card.teamB,
            score: card.scoreB,
            logo: card.away_team_logo || '',
            isWinner: card.winnerTeam === 'B',
          },
          isLive: card.isLive,
          isFinished,
          statusText: card.status,
          sport_type: card.sport_type || 'other',
        });
      });
    }

    // Sort matches: live first, then chronologically
    finalMatches.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    const response = NextResponse.json({ source: 'hybrid', matches: finalMatches });
    response.headers.set('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
    return response;
  } catch (error) {
    console.error('[GET /api/scores] Error:', error);
    return NextResponse.json(
      { error: 'failed to fetch live scores' },
      { status: 503 }
    );
  }
}
