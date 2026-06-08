import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';





/**
 * PUT /api/admin/sponsors/[id] — update sponsor
 * DELETE /api/admin/sponsors/[id] — delete sponsor
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
    const { label, title, subtitle, ctaText, ctaUrl, placement, isActive, displayOrder } = body;

    const prisma = getPrisma();
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
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = parseInt(params.id, 10);
    const prisma = getPrisma();
    await prisma.sponsor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/sponsors/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
