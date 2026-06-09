export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/articles/[slug]
 * Single article by slug
 */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { data: article, error } = await supabaseAdmin
      .from('Article')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('[GET /api/articles/[slug]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
