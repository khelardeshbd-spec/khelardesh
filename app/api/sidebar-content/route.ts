export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/sidebar-content?tab=trivia|history|fixture|tv
 * Public endpoint — returns active sidebar content items for the given tab
 * Used by the front-end BriefsColumn tabs
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tab = searchParams.get('tab')

    let query = supabaseAdmin
      .from('SidebarContent')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (tab) {
      query = query.eq('tab_type', tab) as typeof query
    }

    const { data: items, error } = await query

    if (error) {
      // Table might not have RLS policy yet — return empty gracefully
      console.warn('[GET /api/sidebar-content]', error.message)
      return NextResponse.json({ items: [] })
    }

    return NextResponse.json({ items: items ?? [] })
  } catch (error) {
    console.error('[GET /api/sidebar-content]', error)
    return NextResponse.json({ items: [] })
  }
}
