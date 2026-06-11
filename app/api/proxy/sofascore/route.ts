import { NextRequest, NextResponse } from 'next/server';

/**
 * SofaScore Proxy — Section 9
 * GET /api/proxy/sofascore?endpoint=/sport/football/events/live
 *
 * Caches live data for 30s, scheduled for 5min
 * All calls are server-side to avoid CORS issues
 */

const CACHE = new Map<string, { data: unknown; ts: number }>();
const TTL_LIVE = 30_000;    // 30 seconds for live games
const TTL_SCHED = 300_000;  // 5 minutes for scheduled events

export async function GET(req: NextRequest) {
  const endpoint = req.nextUrl.searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: 'missing endpoint parameter' }, { status: 400 });
  }

  // Validate endpoint to prevent SSRF
  const allowedPrefixes = [
    '/sport/',
    '/event/',
    '/unique-tournament/',
    '/search/',
  ];
  const isAllowed = allowedPrefixes.some((prefix) => endpoint.startsWith(prefix));
  if (!isAllowed) {
    return NextResponse.json({ error: 'endpoint not permitted' }, { status: 403 });
  }

  const isLive = endpoint.includes('/live');
  const ttl = isLive ? TTL_LIVE : TTL_SCHED;

  // Check cache
  const cached = CACHE.get(endpoint);
  if (cached && Date.now() - cached.ts < ttl) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(`https://www.sofascore.com/api/v1${endpoint}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.sofascore.com/',
        'Origin': 'https://www.sofascore.com'
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream SofaScore returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    CACHE.set(endpoint, { data, ts: Date.now() });
    return NextResponse.json(data);
  } catch (error) {
    console.error('[SofaScore proxy error]', error);
    return NextResponse.json({ error: 'Failed to reach SofaScore' }, { status: 502 });
  }
}
