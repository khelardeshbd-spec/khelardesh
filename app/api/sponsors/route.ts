import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/sponsors
 * Active sponsors, optionally filtered by placement
 * Query: ?placement=inline | ?placement=sidebar
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement');

    const where: { isActive: boolean; placement?: string } = { isActive: true };
    if (placement) where.placement = placement;

    const sponsors = await prisma.sponsor.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ sponsors });
  } catch (error) {
    console.error('[GET /api/sponsors]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
