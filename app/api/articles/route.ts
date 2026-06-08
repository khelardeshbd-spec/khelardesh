import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';





/**
 * GET /api/articles
 * Paginated article feed
 * Query params: ?sport=football&page=1
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const pageSize = 20;

    const where = sport ? { sport } : {};

    const prisma = getPrisma();
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: [{ isLead: 'desc' }, { publishedAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          slug: true,
          headline: true,
          headlineBn: true,
          deck: true,
          kicker: true,
          sport: true,
          mediaType: true,
          mediaUrl: true,
          mediaCaption: true,
          byline: true,
          isLead: true,
          publishedAt: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('[GET /api/articles]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
