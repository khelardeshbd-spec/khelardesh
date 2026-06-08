import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/admin/sponsors/[id] — update sponsor
 * DELETE /api/admin/sponsors/[id] — delete sponsor
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
    const { label, title, subtitle, ctaText, ctaUrl, placement, isActive, displayOrder } = body;

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: { label, title, subtitle, ctaText, ctaUrl, placement, isActive, displayOrder },
    });
    return NextResponse.json({ sponsor });
  } catch (error) {
    console.error('[PUT /api/admin/sponsors/[id]]', error);
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
    await prisma.sponsor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/sponsors/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
