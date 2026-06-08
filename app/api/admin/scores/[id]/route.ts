import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';





/**
 * PUT /api/admin/scores/[id] — update score card
 * DELETE /api/admin/scores/[id] — delete score card
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = parseInt(params.id, 10);
    const body = await request.json() as any;
    const {
      league, teamA, scoreA, teamB, scoreB,
      winnerTeam, status, isLive,
      sofascoreId, displayOrder,
    } = body;

    const prisma = getPrisma();
    const score = await prisma.scoreCard.update({
      where: { id },
      data: {
        league, teamA, scoreA, teamB, scoreB,
        winnerTeam: winnerTeam || null,
        status, isLive,
        sofascoreId: sofascoreId || null,
        displayOrder,
      },
    });
    return NextResponse.json({ score });
  } catch (error) {
    console.error('[PUT /api/admin/scores/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = parseInt(params.id, 10);
    const prisma = getPrisma();
    await prisma.scoreCard.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/scores/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
