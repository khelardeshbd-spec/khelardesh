export const runtime = 'nodejs'
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';





/**
 * GET /api/articles/[slug]
 * Single article by slug
 */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const prisma = getPrisma();
    const article = await prisma.article.findUnique({
      where: { slug: params.slug },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('[GET /api/articles/[slug]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
