export const runtime = 'nodejs'
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';





/**
 * GET /api/scores
 * All active score cards
 * Sort: live first, then by displayOrder (Section 13 rule 12)
 */
export async function GET() {
  try {
    const prisma = getPrisma();
    const scores = await prisma.scoreCard.findMany({
      orderBy: [
        { isLive: 'desc' },
        { displayOrder: 'asc' },
      ],
    });
    return NextResponse.json({ scores });
  } catch (error) {
    console.error('[GET /api/scores]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
