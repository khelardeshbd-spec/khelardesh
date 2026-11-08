export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { query } from '@/lib/db'

/**
 * GET /api/articles/lead
 * Returns the current lead story
 */
export async function GET() {
  try {
    let article: any = null;

    try {
      const rows = await query(
        `SELECT * FROM "Article" WHERE "isLead" = true AND status = 'published' ORDER BY "publishedAt" DESC LIMIT 1`
      );
      if (rows && rows.length > 0) article = rows[0];
    } catch (dbErr) {
      console.error('[GET /api/articles/lead] DB query error:', dbErr);
    }

    if (!article) {
      const { data, error } = await supabaseAdmin
        .from('Article')
        .select('*')
        .eq('isLead', true)
        .eq('status', 'published')
        .order('publishedAt', { ascending: false })
        .limit(1)
        .single();
      if (!error && data) article = data;
    }

    if (!article) {
      return NextResponse.json({ error: 'No lead story found' }, { status: 404 })
    }

    return NextResponse.json(
      { article },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('[GET /api/articles/lead]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
