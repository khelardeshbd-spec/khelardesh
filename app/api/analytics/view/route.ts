import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { articleId } = await request.json();

    if (!articleId || typeof articleId !== 'number') {
      return NextResponse.json({ error: 'Invalid articleId' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.rpc('increment_article_views', {
      article_id: articleId,
    });

    if (error) {
      console.error('Error incrementing view:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
