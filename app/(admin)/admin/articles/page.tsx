import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import AdminShell from '../AdminShell';
import ArticlesClient from './ArticlesClient';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin');

  // Fetch all articles till date
  const { data: articles } = await supabaseAdmin
    .from('Article')
    .select('id, slug, headline, headlineBn, sport, isLead, publishedAt, byline, views')
    .order('publishedAt', { ascending: false });

  const safeArticles = articles ?? [];

  return (
    <AdminShell>
      <ArticlesClient initialArticles={safeArticles} />
    </AdminShell>
  );
}
