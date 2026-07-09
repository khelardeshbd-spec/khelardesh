export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionUser, requirePermission } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

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
 * GET /api/admin/articles — list all articles for admin/employee
 */
export async function GET() {
  const user = await getSessionUser()
  const err = requirePermission(user, 'view_articles')
  if (err) return err

  const { data: articles, error } = await supabaseAdmin
    .from('Article')
    .select('id, slug, headline, headlineBn, sport, isLead, publishedAt, byline, views, status')
    .order('publishedAt', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ articles: articles ?? [] })
}

/**
 * POST /api/admin/articles — create new article
 */
export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  const err = requirePermission(user, 'write_articles')
  if (err) return err

  try {
    const body = await request.json() as any
    const {
      headline, headlineBn, deck, body: articleBody,
      kicker, sport, mediaType, mediaUrl, mediaCaption,
      byline = 'Staff Reporter', isLead = false, status = 'published',
    } = body

    if (!headline || !articleBody || !sport || !mediaType || !mediaUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
        deck: deck || '',
        body: articleBody,
        kicker: kicker || '',
        sport,
        mediaType,
        mediaUrl,
        mediaCaption: mediaCaption || null,
        byline,
        isLead,
        status,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    await logActivity({
      actor: user!,
      action: status === 'draft' ? 'article.archive' : 'article.create',
      targetType: 'article',
      targetId: String(article.id),
      targetLabel: headline,
    })

    return NextResponse.json({ article }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/articles]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
