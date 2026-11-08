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

  let articles: any[] = []
  try {
    const { data, error } = await supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, sport, isLead, publishedAt, byline, views, status, mediaUrl, tags')
      .order('publishedAt', { ascending: false })
    if (error) throw error
    articles = data ?? []
  } catch (supaErr) {
    console.warn('[GET /api/admin/articles] Supabase error, falling back to PostgreSQL:', supaErr)
    const { query } = await import('@/lib/db')
    articles = await query(
      `SELECT id, slug, headline, "headlineBn", sport, "isLead", "publishedAt", byline, views, status, "mediaUrl", tags 
       FROM "Article" 
       ORDER BY "publishedAt" DESC`
    )
  }

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
      tags = null,
    } = body

    if (!headline || !articleBody || !sport || !mediaType || !mediaUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate unique slug
    const baseSlug = slugify(headline || headlineBn || 'article')
    let slug = baseSlug
    try {
      const { data: existing } = await supabaseAdmin
        .from('Article')
        .select('slug')
        .like('slug', `${baseSlug}%`)
      if (existing && existing.length > 0) slug = `${baseSlug}-${Date.now()}`
    } catch {
      slug = `${baseSlug}-${Date.now()}`
    }

    let article: any = null
    const nowIso = new Date().toISOString()

    try {
      const { data, error } = await supabaseAdmin
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
          tags: tags || null,
          status,
          publishedAt: nowIso,
          updatedAt: nowIso,
        })
        .select()
        .single()

      if (error) throw error
      article = data
    } catch (supaErr) {
      console.warn('[POST /api/admin/articles] Supabase insert failed, falling back to PostgreSQL:', supaErr)
      const { query } = await import('@/lib/db')
      const rows = await query(
        `INSERT INTO "Article" (
          slug, headline, "headlineBn", deck, body, kicker, sport, 
          "mediaType", "mediaUrl", "mediaCaption", byline, "isLead", 
          tags, status, "publishedAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *`,
        [
          slug,
          headline,
          headlineBn || null,
          deck || '',
          articleBody,
          kicker || '',
          sport,
          mediaType,
          mediaUrl,
          mediaCaption || null,
          byline,
          Boolean(isLead),
          tags || null,
          status,
          nowIso,
          nowIso,
        ]
      )
      article = rows[0]
    }

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
