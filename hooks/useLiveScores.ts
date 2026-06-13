'use client'

import useSWR from 'swr'

export type Match = {
  id: string
  home: string
  away: string
  homeScore: number | null
  awayScore: number | null
  isLive: boolean
  minute: string | null
  utcTime?: string
}

export type ScoreData = {
  league: string
  leagueId: number
  matches: Match[]
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  return res.json()
})

export function useLiveScores() {
  const { data: response, error, isLoading } = useSWR('/api/scores', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    dedupingInterval: 25000,
  })

  // Format data to ScoreData[] shape regardless of the source
  let formattedData: ScoreData[] | undefined = undefined

  if (response) {
    if (response.source === 'fotmob') {
      formattedData = response.data
    } else if (response.source === 'flashscore') {
      const flashscoreMatches = response.data?.matches || []
      formattedData = [
        {
          league: 'Live Scores',
          leagueId: 0,
          matches: flashscoreMatches,
        },
      ]
    }
  }

  return {
    data: formattedData,
    isLoading,
    isError: !!error,
    source: response?.source as 'fotmob' | 'flashscore' | undefined,
  }
}
