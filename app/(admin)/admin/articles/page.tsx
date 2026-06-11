import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import AdminShell from '../AdminShell';


export const dynamic = 'force-dynamic';




/**
 * Admin Articles List — Section 11 / 4
 */
export default async function AdminArticlesPage() {
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin');

  const { data: articles } = await supabaseAdmin
    .from('Article')
    .select('id, slug, headline, headlineBn, sport, isLead, publishedAt, byline')
    .order('publishedAt', { ascending: false })

  const safeArticles = articles ?? []

  const thStyle = {
    fontFamily: "'Hind Siliguri', sans-serif",
    fontSize: 9, fontWeight: 500, letterSpacing: '0.12em',
    textTransform: 'uppercase' as const, color: 'var(--ink-ghost)',
    padding: '6px 10px', textAlign: 'left' as const,
    borderBottom: '1px solid var(--ink-border)',
  };
  const tdStyle = {
    fontFamily: "'Hind Siliguri', sans-serif",
    fontSize: 12, color: 'var(--ink)', padding: '8px 10px',
    borderBottom: '0.5px solid var(--ink-border)', verticalAlign: 'middle' as const,
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--ink)' }}>
            Articles
          </h1>
          <Link href="/admin/articles/new" className="admin-btn-primary">+ New Article</Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Headline</th>
                <th style={thStyle}>Sport</th>
                <th style={thStyle}>Lead</th>
                <th style={thStyle}>Byline</th>
                <th style={thStyle}>Published</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeArticles.map((a) => (
                <tr key={a.id}>
                  <td style={tdStyle}>
                    <Link href={`/admin/articles/${a.id}`} style={{ color: 'var(--ink)', textDecoration: 'underline', textDecorationColor: 'var(--ink-border)' }} lang="bn">
                      {a.headlineBn || a.headline}
                    </Link>
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>{a.sport}</td>
                  <td style={tdStyle}>
                    {a.isLead ? <span style={{ color: '#C0392B', fontWeight: 600 }}>●</span> : <span style={{ color: 'var(--ink-ghost)' }}>○</span>}
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>{a.byline}</td>
                  <td style={{ ...tdStyle, color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(a.publishedAt).toLocaleDateString('bn-BD')}
                  </td>
                  <td style={tdStyle}>
                    <div className="flex gap-2 items-center">
                      <Link href={`/admin/articles/${a.id}`} style={{ color: 'var(--ink)', fontSize: 13 }} title="Edit">✎</Link>
                      <Link href={`/article/${a.slug}`} target="_blank" style={{ color: 'var(--ink-muted)', fontSize: 13 }} title="View live">↗</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
