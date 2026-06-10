import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import AdminLogout from '../AdminLogout';
import AdminShell from '../AdminShell';


export const dynamic = 'force-dynamic';




/**
 * Admin Dashboard — Section 11.2
 * Recent articles table + Live scores table
 * Quick action buttons: New Article, New Score, New Sponsor
 */
export default async function AdminDashboardPage() {
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin');

  const [{ data: articles }, { data: scores }, { data: countRes }] = await Promise.all([
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, sport, isLead, publishedAt')
      .order('publishedAt', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('ScoreCard')
      .select('*')
      .order('isLive', { ascending: false })
      .order('displayOrder', { ascending: true }),
    supabaseAdmin
      .from('Article')
      .select('id', { count: 'exact', head: true }),
  ]);

  const totalArticles = (countRes as any)?.length ?? 0;

  const safeArticles = articles ?? []
  const safeScores = scores ?? []

  const headingStyle = {
    fontFamily: "'Hind Siliguri', sans-serif",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--ink-muted)',
    marginBottom: 12,
  };

  const thStyle = {
    fontFamily: "'Hind Siliguri', sans-serif",
    fontSize: 9,
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--ink-ghost)',
    padding: '6px 10px',
    textAlign: 'left' as const,
    borderBottom: '1px solid var(--ink-border)',
  };

  const tdStyle = {
    fontFamily: "'Hind Siliguri', sans-serif",
    fontSize: 12,
    color: 'var(--ink)',
    padding: '8px 10px',
    borderBottom: '0.5px solid var(--ink-border)',
    verticalAlign: 'middle' as const,
  };

  return (
    <AdminShell>
      <div style={{ padding: '24px', maxWidth: 960, margin: '0 auto' }}>
        {/* Stats row */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)', borderRadius: 2, minWidth: 140 }}>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>Total Articles</p>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 32, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{safeArticles.length}+</p>
          </div>
          <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)', borderRadius: 2, minWidth: 140 }}>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>Live Scores</p>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 32, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{safeScores.filter(s => s.isLive).length}</p>
          </div>
          <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)', borderRadius: 2, minWidth: 140 }}>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>Lead Stories</p>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 32, fontWeight: 700, color: 'var(--live-red)', lineHeight: 1 }}>{safeArticles.filter(a => a.isLead).length}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <Link href="/admin/articles/new" className="admin-btn-primary">+ New Article</Link>
          <Link href="/admin/scores" className="admin-btn-secondary">Manage Scores</Link>
          <Link href="/admin/sponsors" className="admin-btn-secondary">Manage Sponsors</Link>
          <Link href="/admin/sidebar-content" className="admin-btn-secondary">Sidebar Content</Link>
        </div>

        {/* Recent Articles */}
        <section className="mb-10">
          <h2 style={headingStyle}>Recent Articles</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Headline</th>
                  <th style={thStyle}>Sport</th>
                  <th style={thStyle}>Lead</th>
                  <th style={thStyle}>Published</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArticles.map((a) => (
                  <tr key={a.id}>
                    <td style={tdStyle}>
                      <Link
                        href={`/admin/articles/${a.id}`}
                        style={{ color: 'var(--ink)', textDecoration: 'underline', textDecorationColor: 'var(--ink-border)' }}
                        lang="bn"
                      >
                        {a.headlineBn || a.headline}
                      </Link>
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>
                      {a.sport}
                    </td>
                    <td style={tdStyle}>
                      {a.isLead ? (
                        <span style={{ color: '#C0392B', fontWeight: 600 }}>●</span>
                      ) : (
                        <span style={{ color: 'var(--ink-ghost)' }}>○</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(a.publishedAt).toLocaleDateString('en-GB')}
                    </td>
                    <td style={tdStyle}>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/articles/${a.id}`}
                          style={{ color: 'var(--ink)', fontSize: 13 }}
                          title="Edit"
                        >
                          ✎
                        </Link>
                        <Link
                          href={`/article/${a.slug}`}
                          target="_blank"
                          style={{ color: 'var(--ink-muted)', fontSize: 13 }}
                          title="View"
                        >
                          ↗
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <Link href="/admin/articles" style={{ color: 'var(--ink-muted)', fontSize: 11, textDecoration: 'underline' }}>
              View all articles →
            </Link>
          </div>
        </section>

        {/* Live Scores */}
        <section>
          <h2 style={headingStyle}>Live Scores</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>League</th>
                  <th style={thStyle}>Teams</th>
                  <th style={thStyle}>Score</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Live</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeScores.map((s) => (
                  <tr key={s.id}>
                    <td style={{ ...tdStyle, color: 'var(--ink-muted)' }} lang="bn">{s.league}</td>
                    <td style={tdStyle} lang="bn">{s.teamA} vs {s.teamB}</td>
                    <td style={tdStyle}>{s.scoreA}–{s.scoreB}</td>
                    <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>{s.status}</td>
                    <td style={tdStyle}>
                      {s.isLive ? (
                        <span className="live-dot" />
                      ) : (
                        <span style={{ color: 'var(--ink-ghost)', fontSize: 11 }}>—</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <Link href="/admin/scores" style={{ color: 'var(--ink)', fontSize: 13 }}>✎</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <Link href="/admin/scores" style={{ color: 'var(--ink-muted)', fontSize: 11, textDecoration: 'underline' }}>
              Manage scores →
            </Link>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
