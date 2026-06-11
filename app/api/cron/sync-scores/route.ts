import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic execution for CRON
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds

const SPORTS = [
  'football',
  'cricket',
  'basketball',
  'tennis',
  'table-tennis',
  'rugby',
  'motorsport'
];

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
  if (sportName === 'motorsport') return 'f1';
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

export async function GET(req: NextRequest) {
  // Validate CRON_SECRET
  const authHeader = req.headers.get('x-cron-secret');
  if (authHeader !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ensure BASE_URL exists (used for internal proxy fetch)
  const proto = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('host');
  const baseUrl = process.env.NEXTAUTH_URL || `${proto}://${host}`;

  async function fetchSportEvents(sport: string, type: 'live' | 'scheduled/today') {
    const url = `${baseUrl}/api/proxy/sofascore?endpoint=/sport/${sport}/events/${type}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${sport} ${type} returned ${res.status}`);
    const data = await res.json();
    return { sport, type, events: data.events || [] };
  }

  try {
    // 1. Fetch live matches
    const livePromises = SPORTS.map(sport => fetchSportEvents(sport, 'live'));
    const liveResults = await Promise.allSettled(livePromises);

    // 2. Fetch scheduled today
    const scheduledPromises = SPORTS.map(sport => fetchSportEvents(sport, 'scheduled/today'));
    const scheduledResults = await Promise.allSettled(scheduledPromises);

    const allEvents: any[] = [];
    let successCount = 0;
    let failCount = 0;

    const processResult = (result: PromiseSettledResult<any>) => {
      if (result.status === 'fulfilled') {
        successCount++;
        allEvents.push(...result.value.events.map((e: any) => ({ ...e, _sportContext: result.value.sport })));
      } else {
        failCount++;
        console.error('[CRON Sync Error]', result.reason);
      }
    };

    liveResults.forEach(processResult);
    scheduledResults.forEach(processResult);

    if (successCount === 0) {
      console.error('সিঙ্ক ব্যর্থ হয়েছে');
      return NextResponse.json({ error: 'সিঙ্ক ব্যর্থ হয়েছে - All API calls failed' }, { status: 500 });
    }

    // 3. Upsert into Supabase
    // We only insert or update based on source_match_id
    const upsertPayload = allEvents.map(event => {
      const sportName = event._sportContext;
      const isLive = event.status?.type === 'inprogress';
      
      let statusText = translateStatus(event.status, event.startTimestamp);
      if (isLive && event.time?.played) {
        statusText = toBengaliDigits(`${event.time.played}'`);
      }

      return {
        source_match_id: String(event.id),
        sport_type: mapSportType(sportName, event),
        league: event.tournament?.name || '',
        teamA: event.homeTeam?.name || '',
        scoreA: toBengaliDigits(event.homeScore?.current ?? event.homeScore?.display ?? '০'),
        teamB: event.awayTeam?.name || '',
        scoreB: toBengaliDigits(event.awayScore?.current ?? event.awayScore?.display ?? '০'),
        home_team_logo: `https://api.sofascore.com/api/v1/team/${event.homeTeam?.id}/image`,
        away_team_logo: `https://api.sofascore.com/api/v1/team/${event.awayTeam?.id}/image`,
        status: statusText,
        isLive,
        last_synced_at: new Date().toISOString(),
      };
    });

    if (upsertPayload.length > 0) {
      const { error } = await supabaseAdmin
        .from('ScoreCard')
        .upsert(upsertPayload, { onConflict: 'source_match_id', ignoreDuplicates: false });

      if (error) {
        console.error('Supabase Upsert Error:', error);
        return NextResponse.json({ error: 'Database upsert failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: upsertPayload.length,
      apiStats: { success: successCount, failed: failCount }
    });

  } catch (error) {
    console.error('[CRON FATAL]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
