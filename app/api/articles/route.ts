export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

import { parse as avroParse } from '@subhesadek/avro-phonetic'

/**
 * GET /api/articles
 * Paginated article feed (published only)
 * Query params: ?sport=football&page=1&pageSize=20&q=search+term&tag=barca&date=2026-08-18
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get('sport')
    const tag = searchParams.get('tag')?.trim() ?? ''
    const date = searchParams.get('date')?.trim() ?? ''
    const q = searchParams.get('q')?.trim() ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const rawPageSize = parseInt(searchParams.get('pageSize') ?? '20', 10)
    const pageSize = Math.min(100, Math.max(1, isNaN(rawPageSize) ? 20 : rawPageSize))
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, kicker, sport, mediaType, mediaUrl, mediaCaption, byline, isLead, publishedAt, tags', { count: 'exact' })
      .eq('status', 'published')
      .order('isLead', { ascending: false })
      .order('publishedAt', { ascending: false })
      .range(from, to)

    if (sport && sport !== 'all') {
      if (sport.includes(',')) {
        query = query.in('sport', sport.split(','))
      } else {
        query = query.eq('sport', sport)
      }
    }

    if (tag) {
      const cleanTag = tag.replace(/^#/, '')
      query = query.ilike('tags', `%${cleanTag}%`)
    }

    if (date) {
      const startDate = `${date}T00:00:00.000Z`
      const endDate = `${date}T23:59:59.999Z`
      query = query.gte('publishedAt', startDate).lte('publishedAt', endDate)
    }

    if (q) {
      const avroObj = avroParse(q)
      const avroQuery = avroObj?.bangla || q
      query = query.or(
        `headline.ilike.%${q}%,headlineBn.ilike.%${q}%,deck.ilike.%${q}%,tags.ilike.%${q}%,headline.ilike.%${avroQuery}%,headlineBn.ilike.%${avroQuery}%,deck.ilike.%${avroQuery}%,tags.ilike.%${avroQuery}%`
      )
    }

    const { data: articles, count, error } = await query
    if (error) throw error

    return NextResponse.json({
      articles: articles ?? [],
      pagination: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      },
    })
  } catch (error) {
    console.error('[GET /api/articles]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
