export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/articles/lead
 * Returns the current lead story
 */
export async function GET() {
  try {
    const { data: article, error } = await supabaseAdmin
      .from('Article')
      .select('*')
      .eq('isLead', true)
      .order('publishedAt', { ascending: false })
      .limit(1)
      .single()

    if (error || !article) {
      return NextResponse.json({ error: 'No lead story found' }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('[GET /api/articles/lead]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
