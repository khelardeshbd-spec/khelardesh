import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import AdminShell from '../AdminShell';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin');

  // Fetch articles and scorecards count
  const [{ data: articles }, { data: scores }] = await Promise.all([
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, sport, isLead, publishedAt')
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
