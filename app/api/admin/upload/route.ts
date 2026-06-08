import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

/**
 * POST /api/admin/upload
 * Multipart file upload → saves to /public/media/
 * Returns { url: '/media/filename.ext' }
 * Accepts: jpg, png, webp, mp4
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Use: jpg, png, webp, mp4' },
        { status: 400 }
      );
    }

    const extMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'video/mp4': '.mp4',
    };
    const ext = extMap[file.type];
    const uniqueName = `${Date.now()}-${randomBytes(4).toString('hex')}${ext}`;

    const mediaDir = path.join(process.cwd(), 'public', 'media');
    await mkdir(mediaDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(mediaDir, uniqueName), buffer);

    return NextResponse.json({ url: `/media/${uniqueName}` });
  } catch (error) {
    console.error('[POST /api/admin/upload]', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
