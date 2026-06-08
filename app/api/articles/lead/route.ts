import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';





/**
 * GET /api/articles/lead
 * Returns the current lead story
 */
export async function GET() {
  try {
    const prisma = getPrisma();
    const article = await prisma.article.findFirst({
      where: { isLead: true },
      orderBy: { publishedAt: 'desc' },
    });

    if (!article) {
      return NextResponse.json({ error: 'No lead story found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('[GET /api/articles/lead]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
