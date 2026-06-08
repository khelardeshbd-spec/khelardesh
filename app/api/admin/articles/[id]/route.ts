import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/admin/articles/[id] — update article
 * DELETE /api/admin/articles/[id] — delete article
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
      headline, headlineBn, deck, body: articleBody,
      kicker, sport, mediaType, mediaUrl, mediaCaption,
      byline, isLead,
    } = body;

    // Auto-unpin existing lead (Section 13 rule 13)
    if (isLead) {
      await prisma.article.updateMany({
        where: { isLead: true, id: { not: id } },
        data: { isLead: false },
      });
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        headline,
        headlineBn: headlineBn || null,
        deck,
        body: articleBody,
        kicker,
        sport,
        mediaType,
        mediaUrl,
        mediaCaption: mediaCaption || null,
        byline,
        isLead: isLead ?? false,
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error('[PUT /api/admin/articles/[id]]', error);
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
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/articles/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
