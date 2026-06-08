import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/admin/scores/[id] — update score card
 * DELETE /api/admin/scores/[id] — delete score card
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const {
      league, teamA, scoreA, teamB, scoreB,
      winnerTeam, status, isLive,
      sofascoreId, displayOrder,
    } = body;

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
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = parseInt(params.id, 10);
    await prisma.scoreCard.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/scores/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
