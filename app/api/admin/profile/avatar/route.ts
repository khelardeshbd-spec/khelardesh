import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionUser } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Limit file size to 3MB
    if (file.size > 3 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 3MB' }, { status: 400 });
    }

    const isImage = file.type.startsWith('image/') && !file.type.includes('svg');
    const ext = isImage ? 'webp' : (file.name.split('.').pop() || 'png');
    const bucket = process.env.SUPABASE_BUCKET_NAME || 'khelardesh';
    const filePath = `avatars/${user.id}.${ext}`;
    let buffer = Buffer.from(await file.arrayBuffer());
    let contentType = file.type;

    if (isImage) {
      // @ts-ignore
      const sharp = (await import('sharp')).default;
      buffer = await sharp(buffer)
        .resize(400, 400, { fit: 'cover', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      contentType = 'image/webp';
    }

    // Upload to Supabase storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase avatar upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to save photo to storage' }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // Update database row
    const table = user.role === 'employee' ? 'EmployeeUser' : 'AdminUser';
    const { error: dbError } = await supabaseAdmin
      .from(table)
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (dbError) {
      console.error('Database update error for avatar:', dbError);
      return NextResponse.json({ error: 'Failed to update database profile' }, { status: 500 });
    }

    // Log action
    await logActivity({
      actor: user,
      action: 'article.update', // Closest action type
      targetType: 'profile',
      targetId: user.id,
      targetLabel: 'Update avatar photo',
    });

    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    console.error('Unexpected avatar upload error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
