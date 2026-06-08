import { redirect } from 'next/navigation';
import { getPrisma } from '@/lib/prisma';

import Link from 'next/link';


export const dynamic = 'force-dynamic';




/**
 * Admin Articles List — Section 11 / 4
 */
export default async function AdminArticlesPage() {
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin');

  const prisma = getPrisma();
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true, slug: true, headline: true, headlineBn: true,
      sport: true, isLead: true, publishedAt: true, byline: true,
    },
  });

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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif", fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>
            Articles
          </h1>
          <div className="flex gap-2">
            <Link href="/admin/articles/new" className="admin-btn-primary">+ New Article</Link>
            <Link href="/admin/dashboard" className="admin-btn-secondary">← Dashboard</Link>
          </div>
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
              {articles.map((a) => (
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
                    {new Date(a.publishedAt).toLocaleDateString('en-GB')}
                  </td>
                  <td style={tdStyle}>
                    <div className="flex gap-2 items-center">
                      <Link href={`/admin/articles/${a.id}`} style={{ color: 'var(--ink)', fontSize: 13 }} title="Edit">✎</Link>
                      <Link href={`/article/${a.slug}`} target="_blank" style={{ color: 'var(--ink-muted)', fontSize: 13 }} title="View">↗</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
