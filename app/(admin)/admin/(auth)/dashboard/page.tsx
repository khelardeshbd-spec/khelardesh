import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import AdminShell from '../../AdminShell';
import DashboardClient from './DashboardClient';

import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getServerSession(getAuthOptions());
  if (!session) redirect('/admin');

  const user = session.user as any;
  if (user?.role === 'employee') {
    redirect('/admin/articles');
  }

  // Fetch articles and scorecards count
  const [{ data: articles }, { data: scores }] = await Promise.all([
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, sport, isLead, publishedAt, views')
      .order('publishedAt', { ascending: false })
      .limit(250),
    supabaseAdmin
      .from('ScoreCard')
      .select('id', { count: 'exact', head: true }),
  ]);

  const safeArticles = articles ?? [];
  const totalScoresCount = (scores as any)?.length ?? 0;

  return (
    <AdminShell>
      <DashboardClient 
        initialArticles={safeArticles} 
        totalScoresCount={totalScoresCount} 
      />
    </AdminShell>
  );
}
