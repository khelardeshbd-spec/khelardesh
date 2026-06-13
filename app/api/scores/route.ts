export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

const TARGET_LEAGUES = [47, 42, 87, 54, 55, 53, 9476]

interface MatchData {
  id: string
  home: string
  away: string
  homeScore: number | null
  awayScore: number | null
  isLive: boolean
  minute: string | null
  utcTime?: string
}

interface LeagueData {
  league: string
  leagueId: number
  matches: MatchData[]
}

async function fromFotMob(dateStr: string): Promise<LeagueData[]> {
  const { default: Fotmob } = await import('@max-xoo/fotmob')
  const fotmob = new Fotmob()

  console.log('[fromFotMob] Fetching matches for date:', dateStr)
  const data = await fotmob.getMatchesByDate(dateStr)

  if (!data || !data.leagues) {
    throw new Error('Invalid response from FotMob API')
  }

  const filteredLeagues = data.leagues.filter((league: any) =>
    TARGET_LEAGUES.includes(Number(league.id))
  )

  return filteredLeagues.map((league: any) => {
    const matches: MatchData[] = (league.matches || []).map((m: any) => {
      const homeScore = m.home?.score !== undefined ? Number(m.home.score) : null
      const awayScore = m.away?.score !== undefined ? Number(m.away.score) : null
      const isLive = !!m.status?.ongoing
      const minute = m.status?.liveTime?.short ?? null
      const utcTime = m.status?.utcTime || ''

      return {
        id: String(m.id),
        home: m.home?.name || '',
        away: m.away?.name || '',
        homeScore: isNaN(homeScore as any) ? null : homeScore,
        awayScore: isNaN(awayScore as any) ? null : awayScore,
        isLive,
        minute,
        utcTime,
      }
    })

    return {
      league: league.name || '',
      leagueId: Number(league.id),
      matches,
    }
  })
}

async function fromFlashscore() {
  console.log('[fromFlashscore] Fetching matches from Flashscore fallback')
  const url = 'https://local.flashscore.com/x/feed/f_1_0_1_en_1'
  const response = await fetch(url, {
    headers: {
      'X-Fsign': 'SW9D1eZo',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Referer': 'https://www.flashscore.com/',
      'Accept': 'text/plain',
    },
  })

  if (!response.ok) {
    throw new Error(`Flashscore fetch failed with status: ${response.status}`)
  }

  const text = await response.text()
  const blocks = text.split('~AA')
  const matches = []

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i]
    const fields = block.split(/[¬|]/)

    const rawIdField = fields[0] || ''
    const id = rawIdField.startsWith('÷') ? rawIdField.slice(1) : rawIdField

    let home = ''
    let away = ''
    let homeScore: number | null = null
    let awayScore: number | null = null
    let isLive = false
    let minute: string | null = null
    let status = ''

    for (const field of fields) {
      const key = field.slice(0, 2)
      let val = field.slice(2)
      if (val.startsWith('÷')) {
        val = val.slice(1)
      }

      if (key === 'AE') {
        home = val
      } else if (key === 'AF') {
        away = val
      } else if (key === 'AG') {
        homeScore = val !== '' ? parseInt(val, 10) : null
        if (isNaN(homeScore as any)) homeScore = null
      } else if (key === 'AH') {
        awayScore = val !== '' ? parseInt(val, 10) : null
        if (isNaN(awayScore as any)) awayScore = null
      } else if (key === 'AD') {
        status = val
      } else if (key === 'AC') {
        minute = val
      }
    }

    // AD status codes: "1" = scheduled, "2" = live, "4" = HT, "5" = finished
    isLive = status === '2' || status === '4'

    matches.push({
      id,
      home,
      away,
      homeScore,
      awayScore,
      isLive,
      minute: isLive ? (minute ? `${minute}'` : 'Live') : null,
    })
  }

  return {
    source: 'flashscore' as const,
    matches,
  }
}

export async function GET() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  
  try {
    const data = await fromFotMob(dateStr)
    const response = NextResponse.json({ source: 'fotmob', data })
    response.headers.set('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
    return response
  } catch (fotMobError) {
    console.error('[GET /api/scores] FotMob failed, falling back to Flashscore:', fotMobError)
    try {
      const data = await fromFlashscore()
      const response = NextResponse.json({ source: 'flashscore', data })
      response.headers.set('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
      return response
    } catch (flashscoreError) {
      console.error('[GET /api/scores] Both sources failed:', flashscoreError)
      return NextResponse.json(
        { error: 'all sources failed' },
        { status: 503 }
      )
    }
  }
}
