'use client'

import useSWR from 'swr'

export type ESPNMatch = {
  id: string
  league: string
  home: {
    name: string
    score: number | null
    logo: string
    isWinner: boolean
  }
  away: {
    name: string
    score: number | null
    logo: string
    isWinner: boolean
  }
  isLive: boolean
  isFinished: boolean
  statusText: string
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

  let matches: ESPNMatch[] = []
  if (response?.matches) {
    matches = response.matches
  }

  return {
    data: matches,
    isLoading,
    isError: !!error,
  }
}
