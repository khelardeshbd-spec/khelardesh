import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

/**
 * GET /api/admin/articles — list all articles for admin
 * POST /api/admin/articles — create new article
 * Both require auth
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      headline: true,
      headlineBn: true,
      sport: true,
      isLead: true,
      publishedAt: true,
      byline: true,
    },
  });
  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      headline, headlineBn, deck, body: articleBody,
      kicker, sport, mediaType, mediaUrl, mediaCaption,
      byline = 'Staff Reporter', isLead = false,
    } = body;

    if (!headline || !deck || !articleBody || !kicker || !sport || !mediaType || !mediaUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Auto-unpin existing lead if this article is set as lead (Section 13 rule 13)
    if (isLead) {
      await prisma.article.updateMany({
        where: { isLead: true },
        data: { isLead: false },
      });
    }

    // Generate unique slug
    const baseSlug = slugify(headline || headlineBn || 'article');
    const existing = await prisma.article.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    });
    const slug = existing.length > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

    const article = await prisma.article.create({
      data: {
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
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/articles]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
