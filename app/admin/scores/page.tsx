'use client';

import { useState, useEffect } from 'react';

interface ScoreCard {
  id: number;
  league: string;
  teamA: string;
  scoreA: string;
  teamB: string;
  scoreB: string;
  winnerTeam?: string | null;
  status: string;
  isLive: boolean;
  sofascoreId?: string | null;
  displayOrder: number;
}

interface SofaScoreSearchResult {
  id: number;
  homeTeam: { name: string };
  awayTeam: { name: string };
  homeScore?: { current: number };
  awayScore?: { current: number };
  status: { type: string; description: string };
  tournament: { name: string };
  time?: { played: number };
}

/**
 * Score Manager — Section 11.4
 * Two sections: Manual entry form + SofaScore Quick-Add
 * Lists all score cards with edit/delete
 */
export default function AdminScoresPage() {
  const [scores, setScores] = useState<ScoreCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SofaScoreSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const [form, setForm] = useState({
    league: '', teamA: '', scoreA: '0', teamB: '', scoreB: '0',
    winnerTeam: '', status: '', isLive: false, sofascoreId: '', displayOrder: 0,
  });

  useEffect(() => { loadScores(); }, []);

  async function loadScores() {
    const res = await fetch('/api/admin/scores');
    const data = await res.json();
    setScores(data.scores ?? []);
    setLoading(false);
  }

  function resetForm() {
    setForm({ league: '', teamA: '', scoreA: '0', teamB: '', scoreB: '0', winnerTeam: '', status: '', isLive: false, sofascoreId: '', displayOrder: 0 });
    setEditId(null);
  }

  function editScore(s: ScoreCard) {
    setEditId(s.id);
    setForm({
      league: s.league, teamA: s.teamA, scoreA: s.scoreA, teamB: s.teamB,
      scoreB: s.scoreB, winnerTeam: s.winnerTeam ?? '', status: s.status,
      isLive: s.isLive, sofascoreId: s.sofascoreId ?? '', displayOrder: s.displayOrder,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = editId ? `/api/admin/scores/${editId}` : '/api/admin/scores';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, winnerTeam: form.winnerTeam || null, sofascoreId: form.sofascoreId || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      resetForm();
      await loadScores();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this score card?')) return;
    await fetch(`/api/admin/scores/${id}`, { method: 'DELETE' });
    await loadScores();
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/proxy/sofascore?endpoint=/search/all?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results?.events ?? []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function fillFromSofaScore(event: SofaScoreSearchResult) {
    const isLive = event.status.type === 'inprogress';
    const statusText = isLive ? `${event.time?.played ?? '?'}'` : event.status.description;
    setForm({
      league: event.tournament.name,
      teamA: event.homeTeam.name,
      scoreA: String(event.homeScore?.current ?? 0),
      teamB: event.awayTeam.name,
      scoreB: String(event.awayScore?.current ?? 0),
      winnerTeam: '',
      status: statusText,
      isLive,
      sofascoreId: String(event.id),
      displayOrder: 0,
    });
    setSearchResults([]);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const labelStyle = { fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--ink-muted)', display: 'block', marginBottom: 4 };
  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--ink-border)', background: 'var(--bg-surface)', color: 'var(--ink)', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, borderRadius: 2 };
  const thStyle = { fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ink-ghost)', padding: '6px 8px', textAlign: 'left' as const, borderBottom: '1px solid var(--ink-border)' };
  const tdStyle = { fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)', padding: '7px 8px', borderBottom: '0.5px solid var(--ink-border)', verticalAlign: 'middle' as const };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif", fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>
            Score Manager
          </h1>
          <a href="/admin/dashboard" className="admin-btn-secondary">← Dashboard</a>
        </div>

        {error && <div style={{ color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 12 }}>{error}</div>}

        {/* Manual Score Entry */}
        <section style={{ marginBottom: 32, padding: 20, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)', borderRadius: 2 }}>
          <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 16 }}>
            {editId ? `Editing Score #${editId}` : 'Manual Score Entry'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label style={labelStyle}>League</label>
              <input type="text" style={inputStyle} value={form.league} onChange={(e) => setForm({ ...form, league: e.target.value })} required lang="bn" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Team A</label>
                <input type="text" style={inputStyle} value={form.teamA} onChange={(e) => setForm({ ...form, teamA: e.target.value })} required lang="bn" />
              </div>
              <div>
                <label style={labelStyle}>Score A</label>
                <input type="text" style={inputStyle} value={form.scoreA} onChange={(e) => setForm({ ...form, scoreA: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Team B</label>
                <input type="text" style={inputStyle} value={form.teamB} onChange={(e) => setForm({ ...form, teamB: e.target.value })} required lang="bn" />
              </div>
              <div>
                <label style={labelStyle}>Score B</label>
                <input type="text" style={inputStyle} value={form.scoreB} onChange={(e) => setForm({ ...form, scoreB: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Winner</label>
                <div className="flex gap-3 pt-1">
                  {['A', 'B', ''].map((w) => (
                    <label key={w || 'draw'} className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" name="winnerTeam" value={w} checked={form.winnerTeam === w} onChange={() => setForm({ ...form, winnerTeam: w })} />
                      <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)' }}>
                        {w === '' ? 'Draw' : `Team ${w}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <input type="text" style={inputStyle} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="Full Time / 67' / Upcoming" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>SofaScore ID — optional</label>
                <input type="text" style={inputStyle} value={form.sofascoreId} onChange={(e) => setForm({ ...form, sofascoreId: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Order</label>
                <input type="number" style={inputStyle} value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value, 10) })} />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isLive} onChange={(e) => setForm({ ...form, isLive: e.target.checked })} />
                <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)' }}>Live</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="admin-btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editId ? 'Update Score' : 'Save Score'}
              </button>
              {editId && <button type="button" onClick={resetForm} className="admin-btn-secondary">Cancel Edit</button>}
            </div>
          </form>
        </section>

        {/* SofaScore Quick-Add */}
        <section style={{ marginBottom: 32, padding: 20, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)', borderRadius: 2 }}>
          <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12 }}>
            SofaScore Quick-Add
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              style={{ ...inputStyle, flex: 1 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search match..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="admin-btn-secondary" disabled={searching}>
              {searching ? '...' : 'Search SofaScore'}
            </button>
          </div>
          {searchResults.length > 0 && (
            <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid var(--ink-border)', borderRadius: 1 }}>
              {searchResults.map((event) => (
                <div
                  key={event.id}
                  onClick={() => fillFromSofaScore(event)}
                  style={{
                    padding: '8px 12px', cursor: 'pointer',
                    borderBottom: '0.5px solid var(--ink-border)',
                    fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12,
                    color: 'var(--ink)',
                  }}
                  className="hover:opacity-70"
                >
                  <span style={{ color: 'var(--ink-muted)', fontSize: 10, marginRight: 6 }}>{event.tournament.name}</span>
                  {event.homeTeam.name} {event.homeScore?.current ?? '—'} – {event.awayScore?.current ?? '—'} {event.awayTeam.name}
                  <span style={{ color: 'var(--ink-ghost)', fontSize: 9, marginLeft: 8 }}>ID: {event.id}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Score cards table */}
        <section>
          <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12 }}>
            All Score Cards
          </h2>
          {loading ? (
            <p style={{ color: 'var(--ink-muted)', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12 }}>Loading...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>League</th>
                    <th style={thStyle}>Teams</th>
                    <th style={thStyle}>Score</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Live</th>
                    <th style={thStyle}>Order</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((s) => (
                    <tr key={s.id} style={{ backgroundColor: editId === s.id ? 'var(--bg-surface)' : 'transparent' }}>
                      <td style={tdStyle} lang="bn">{s.league}</td>
                      <td style={tdStyle} lang="bn">{s.teamA} vs {s.teamB}</td>
                      <td style={tdStyle}>{s.scoreA}–{s.scoreB}</td>
                      <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>{s.status}</td>
                      <td style={tdStyle}>
                        {s.isLive ? <span className="live-dot" /> : <span style={{ color: 'var(--ink-ghost)' }}>—</span>}
                      </td>
                      <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>{s.displayOrder}</td>
                      <td style={tdStyle}>
                        <div className="flex gap-2">
                          <button onClick={() => editScore(s)} style={{ color: 'var(--ink)', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none' }}>✎</button>
                          <button onClick={() => handleDelete(s.id)} style={{ color: '#C0392B', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
