export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/articles
 * Paginated article feed
 * Query params: ?sport=football&page=1
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get('sport')
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const pageSize = 20
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, kicker, sport, mediaType, mediaUrl, mediaCaption, byline, isLead, publishedAt', { count: 'exact' })
      .order('isLead', { ascending: false })
      .order('publishedAt', { ascending: false })
      .range(from, to)

    if (sport) query = query.eq('sport', sport)

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
