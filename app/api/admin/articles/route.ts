export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
}

/**
 * GET /api/admin/articles — list all articles for admin
 * POST /api/admin/articles — create new article
 */
export async function GET() {
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: articles, error } = await supabaseAdmin
    .from('Article')
    .select('id, slug, headline, headlineBn, sport, isLead, publishedAt, byline')
    .order('publishedAt', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ articles: articles ?? [] })
}

export async function POST(request: Request) {
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json() as any
    const {
      headline, headlineBn, deck, body: articleBody,
      kicker, sport, mediaType, mediaUrl, mediaCaption,
      byline = 'Staff Reporter', isLead = false,
    } = body

    if (!headline || !deck || !articleBody || !kicker || !sport || !mediaType || !mediaUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Auto-unpin existing lead if this article is set as lead
    if (isLead) {
      await supabaseAdmin
        .from('Article')
        .update({ isLead: false })
        .eq('isLead', true)
    }

    // Generate unique slug
    const baseSlug = slugify(headline || headlineBn || 'article')
    const { data: existing } = await supabaseAdmin
      .from('Article')
      .select('slug')
      .like('slug', `${baseSlug}%`)
    const slug = (existing && existing.length > 0) ? `${baseSlug}-${Date.now()}` : baseSlug

    const { data: article, error } = await supabaseAdmin
      .from('Article')
      .insert({
        slug,
        headline,
        headlineBn: headlineBn || null,
        deck,
        body: articleBody,
        kicker,
        sport,
        mediaType,
        mediaUrl,
        mediaCaption: mediaCaption || null,
        byline,
        isLead,
        publishedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ article }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/articles]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
