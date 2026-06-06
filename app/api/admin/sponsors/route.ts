import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/sponsors — list all sponsors
 * POST /api/admin/sponsors — create sponsor
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sponsors = await prisma.sponsor.findMany({
    orderBy: { displayOrder: 'asc' },
  });
  return NextResponse.json({ sponsors });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      label = 'Sponsor', title, subtitle, ctaText,
      ctaUrl, placement = 'inline', isActive = true, displayOrder = 0,
    } = body;

    if (!title || !subtitle || !ctaText || !ctaUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sponsor = await prisma.sponsor.create({
      data: { label, title, subtitle, ctaText, ctaUrl, placement, isActive, displayOrder },
    });
    return NextResponse.json({ sponsor }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/sponsors]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
