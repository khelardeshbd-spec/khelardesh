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

    let articles: any[] = [];
    let count: number = 0;

    try {
      const { data, count: exactCount, error } = await query;
      if (error) throw error;
      articles = data ?? [];
      count = exactCount ?? 0;
    } catch (supaErr) {
      console.warn('[GET /api/articles] Supabase failed, falling back to PostgreSQL:', supaErr);
      const { query: dbQuery } = await import('@/lib/db');
      const conditions: string[] = [`status = 'published'`];
      const params: any[] = [];
      let paramIdx = 1;

      if (sport && sport !== 'all') {
        const sports = sport.includes(',') ? sport.split(',') : [sport];
        conditions.push(`sport = ANY($${paramIdx})`);
        params.push(sports);
        paramIdx++;
      }

      if (tag) {
        const cleanTag = tag.replace(/^#/, '');
        conditions.push(`tags ILIKE $${paramIdx}`);
        params.push(`%${cleanTag}%`);
        paramIdx++;
      }

      if (date) {
        conditions.push(`"publishedAt" >= $${paramIdx} AND "publishedAt" <= $${paramIdx + 1}`);
        params.push(`${date}T00:00:00.000Z`, `${date}T23:59:59.999Z`);
        paramIdx += 2;
      }

      if (q) {
        const avroObj = avroParse(q);
        const avroQuery = avroObj?.bangla || q;
        conditions.push(`(headline ILIKE $${paramIdx} OR "headlineBn" ILIKE $${paramIdx} OR deck ILIKE $${paramIdx} OR tags ILIKE $${paramIdx} OR headline ILIKE $${paramIdx + 1} OR "headlineBn" ILIKE $${paramIdx + 1})`);
        params.push(`%${q}%`, `%${avroQuery}%`);
        paramIdx += 2;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const countRes = await dbQuery<{ count: string }>(`SELECT COUNT(*) FROM "Article" ${whereClause}`, params);
      count = parseInt(countRes[0]?.count || '0', 10);

      const dataRes = await dbQuery(
        `SELECT id, slug, headline, "headlineBn", deck, kicker, sport, "mediaType", "mediaUrl", "mediaCaption", byline, "isLead", "publishedAt", tags 
         FROM "Article" ${whereClause} 
         ORDER BY "isLead" DESC, "publishedAt" DESC 
         LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        [...params, pageSize, from]
      );
      articles = dataRes ?? [];
    }

    const cacheHeaders = q
      ? { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30' }
      : { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }

    return NextResponse.json(
      {
        articles: articles ?? [],
        pagination: {
          page,
          pageSize,
          total: count ?? 0,
          totalPages: Math.ceil((count ?? 0) / pageSize),
        },
      },
      { headers: cacheHeaders }
    )
  } catch (error) {
    console.error('[GET /api/articles]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
