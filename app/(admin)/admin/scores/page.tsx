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
  displayOrder: number;
  sport_type?: string;
  home_team_logo?: string;
  away_team_logo?: string;
  last_synced_at?: string;
  is_pinned?: boolean;
  is_visible?: boolean;
  source_match_id?: string;
}

const EN_TO_BN_DIGITS: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

function toBengaliDigits(str: string | number): string {
  return String(str).replace(/[0-9]/g, (digit) => EN_TO_BN_DIGITS[digit]);
}

export default function AdminScoresPage() {
  const [scores, setScores] = useState<ScoreCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Manual entry form
  const [form, setForm] = useState({
    league: '', teamA: '', scoreA: '0', teamB: '', scoreB: '0',
    status: '', isLive: false, sport_type: 'football'
  });

  useEffect(() => { loadScores(); }, []);

  async function loadScores() {
    const res = await fetch('/api/admin/scores');
    const data = await res.json() as any;
    setScores(data.scores ?? []);
    setLoading(false);
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save manual score');
      setForm({ league: '', teamA: '', scoreA: '0', teamB: '', scoreB: '0', status: '', isLive: false, sport_type: 'football' });
      await loadScores();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setError('');
    try {
      const res = await fetch('/api/cron/sync-scores', {
        headers: { 'x-cron-secret': 'generate-a-random-string-here' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      await loadScores();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  }

  async function updateScoreFlags(id: number, updates: Partial<ScoreCard>) {
    await fetch(`/api/admin/scores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    setScores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this score card?')) return;
    await fetch(`/api/admin/scores/${id}`, { method: 'DELETE' });
    await loadScores();
  }

  const groupedScores = scores.reduce((acc, score) => {
    const sport = score.sport_type || 'other';
    if (!acc[sport]) acc[sport] = [];
    acc[sport].push(score);
    return acc;
  }, {} as Record<string, ScoreCard[]>);

  // Calculate last synced
  let lastSyncedText = 'কখনো সিঙ্ক হয়নি';
  const syncedTimes = scores.map(s => s.last_synced_at ? new Date(s.last_synced_at).getTime() : 0).filter(t => t > 0);
  if (syncedTimes.length > 0) {
    const latest = Math.max(...syncedTimes);
    const minsAgo = Math.floor((Date.now() - latest) / 60000);
    lastSyncedText = `${toBengaliDigits(minsAgo)} মিনিট আগে`;
  }

  const labelStyle = { fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--ink-muted)', display: 'block', marginBottom: 4 };
  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--ink-border)', background: 'var(--bg-surface)', color: 'var(--ink)', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, borderRadius: 2 };
  const thStyle = { fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ink-ghost)', padding: '6px 8px', textAlign: 'left' as const, borderBottom: '1px solid var(--ink-border)' };
  const tdStyle = { fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)', padding: '7px 8px', borderBottom: '0.5px solid var(--ink-border)', verticalAlign: 'middle' as const };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ fontFamily: "Kalpurush, sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>
            স্কোর ম্যানেজমেন্ট
          </h1>
          <a href="/admin/dashboard" className="admin-btn-secondary">← Dashboard</a>
        </div>

        {error && <div style={{ color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 12 }}>{error}</div>}

        {/* Sync Controls */}
        <section className="mb-8 p-5 bg-[var(--bg-surface)] border border-[var(--ink-border)] flex items-center justify-between">
          <div>
            <h2 style={labelStyle}>Sofascore Sync System</h2>
            <div className="text-sm font-['Hind_Siliguri'] text-[var(--ink)]">
              সর্বশেষ সিঙ্ক: <strong>{lastSyncedText}</strong>
            </div>
          </div>
          <button onClick={handleSync} disabled={syncing} className="admin-btn-primary bg-blue-700 border-blue-700 text-white">
            {syncing ? 'সিঙ্ক হচ্ছে...' : 'এখনই সিঙ্ক করুন'}
          </button>
        </section>

        {/* Manual Addition */}
        <details className="mb-8 p-5 bg-[var(--bg-surface)] border border-[var(--ink-border)] cursor-pointer">
          <summary style={labelStyle} className="mb-0 text-sm font-bold">ম্যানুয়াল স্কোর যোগ করুন (Local Matches)</summary>
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-4 mt-4 cursor-default" onClick={e => e.stopPropagation()}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Sport</label>
                <select style={inputStyle} value={form.sport_type} onChange={e => setForm({...form, sport_type: e.target.value})}>
                  <option value="football">Football</option>
                  <option value="bd-football">BD Football</option>
                  <option value="cricket">Cricket</option>
                  <option value="bd-cricket">BD Cricket</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>League / Tournament</label>
                <input type="text" style={inputStyle} value={form.league} onChange={e => setForm({...form, league: e.target.value})} required lang="bn" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Team A</label>
                <input type="text" style={inputStyle} value={form.teamA} onChange={e => setForm({...form, teamA: e.target.value})} required lang="bn" />
              </div>
              <div>
                <label style={labelStyle}>Score A</label>
                <input type="text" style={inputStyle} value={form.scoreA} onChange={e => setForm({...form, scoreA: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Team B</label>
                <input type="text" style={inputStyle} value={form.teamB} onChange={e => setForm({...form, teamB: e.target.value})} required lang="bn" />
              </div>
              <div>
                <label style={labelStyle}>Score B</label>
                <input type="text" style={inputStyle} value={form.scoreB} onChange={e => setForm({...form, scoreB: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Status (e.g. 67&apos; / Full Time)</label>
                <input type="text" style={inputStyle} value={form.status} onChange={e => setForm({...form, status: e.target.value})} />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isLive} onChange={e => setForm({...form, isLive: e.target.checked})} />
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)' }}>Live Match</span>
                </label>
              </div>
            </div>
            <button type="submit" className="admin-btn-primary self-start" disabled={saving}>
              {saving ? 'Saving...' : 'Add Score'}
            </button>
          </form>
        </details>

        {/* Grouped Scores */}
        {loading ? <p className="text-sm">Loading...</p> : Object.entries(groupedScores).map(([sport, items]) => (
          <section key={sport} className="mb-8">
            <h2 className="font-['Hind_Siliguri'] font-bold uppercase tracking-wider text-lg mb-2 text-[var(--ink)]">{sport}</h2>
            <div className="overflow-x-auto bg-white shadow-sm border border-[var(--ink-border)]">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Match</th>
                    <th style={thStyle}>League</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Order</th>
                    <th style={thStyle}>Visible</th>
                    <th style={thStyle}>Pin</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(s => (
                    <tr key={s.id}>
                      <td style={tdStyle}>
                        <div className="flex items-center gap-2 font-['Kalpurush'] text-sm">
                          {s.home_team_logo ? <img src={s.home_team_logo} width={24} height={24} className="rounded-full" alt="logo" /> : <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">{s.teamA.charAt(0)}</div>}
                          <span>{s.teamA}</span>
                          <span className="font-bold">{s.scoreA} - {s.scoreB}</span>
                          <span>{s.teamB}</span>
                          {s.away_team_logo ? <img src={s.away_team_logo} width={24} height={24} className="rounded-full" alt="logo" /> : <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">{s.teamB.charAt(0)}</div>}
                        </div>
                      </td>
                      <td style={tdStyle} className="font-['Kalpurush']">{s.league}</td>
                      <td style={tdStyle} className="font-['Kalpurush'] text-[var(--live-red)]">
                        {s.isLive && <span className="live-dot" />} {s.status}
                      </td>
                      <td style={tdStyle}>
                        <input type="number" className="w-16 p-1 border rounded" value={s.displayOrder} onChange={e => updateScoreFlags(s.id, { displayOrder: parseInt(e.target.value) || 0 })} />
                      </td>
                      <td style={tdStyle}>
                        <input type="checkbox" checked={s.is_visible ?? true} onChange={e => updateScoreFlags(s.id, { is_visible: e.target.checked })} />
                      </td>
                      <td style={tdStyle}>
                        <input type="checkbox" checked={s.is_pinned ?? false} onChange={e => updateScoreFlags(s.id, { is_pinned: e.target.checked })} />
                      </td>
                      <td style={tdStyle}>
                        {!s.source_match_id && <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:underline">Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
