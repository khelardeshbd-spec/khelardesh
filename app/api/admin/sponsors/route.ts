export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/sponsors — list all sponsors
 * POST /api/admin/sponsors — create sponsor
 */
export async function GET() {
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: sponsors, error } = await supabaseAdmin
    .from('Sponsor')
    .select('*')
    .order('displayOrder', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sponsors: sponsors ?? [] })
}

export async function POST(request: Request) {
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json() as any
    const {
      label = 'Sponsor', title, subtitle, ctaText,
      ctaUrl, placement = 'inline', isActive = true, displayOrder = 0,
    } = body

    if (!title || !subtitle || !ctaText || !ctaUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: sponsor, error } = await supabaseAdmin
      .from('Sponsor')
      .insert({ label, title, subtitle, ctaText, ctaUrl, placement, isActive, displayOrder })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ sponsor }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/sponsors]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
