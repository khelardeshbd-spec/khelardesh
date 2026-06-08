'use client';

import { useState, useEffect } from 'react';

interface Sponsor {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  placement: string;
  isActive: boolean;
  displayOrder: number;
}

/**
 * Sponsor Manager — Section 11.5
 * Table of sponsors with inline edit
 * Fields: Label · Title · Subtitle · CTA Text · CTA URL · Placement · Active toggle · Order
 */
export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const emptyForm = { label: 'Sponsor', title: '', subtitle: '', ctaText: '', ctaUrl: '', placement: 'inline', isActive: true, displayOrder: 0 };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadSponsors(); }, []);

  async function loadSponsors() {
    const res = await fetch('/api/admin/sponsors');
    const data = await res.json() as any;
    setSponsors(data.sponsors ?? []);
    setLoading(false);
  }

  function startEdit(s: Sponsor) {
    setEditId(s.id);
    setForm({ label: s.label, title: s.title, subtitle: s.subtitle, ctaText: s.ctaText, ctaUrl: s.ctaUrl, placement: s.placement, isActive: s.isActive, displayOrder: s.displayOrder });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = editId ? `/api/admin/sponsors/${editId}` : '/api/admin/sponsors';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) {
        const err = await res.json() as any;
        throw new Error(err.error);
      }
      setForm(emptyForm);
      setEditId(null);
      await loadSponsors();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this sponsor?')) return;
    await fetch(`/api/admin/sponsors/${id}`, { method: 'DELETE' });
    await loadSponsors();
  }

  async function toggleActive(s: Sponsor) {
    await fetch(`/api/admin/sponsors/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, isActive: !s.isActive }),
    });
    await loadSponsors();
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
            Sponsor Manager
          </h1>
          <a href="/admin/dashboard" className="admin-btn-secondary">← Dashboard</a>
        </div>

        {error && <div style={{ color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 12 }}>{error}</div>}

        {/* Form */}
        <section style={{ marginBottom: 32, padding: 20, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)', borderRadius: 2 }}>
          <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 16 }}>
            {editId ? `Editing Sponsor #${editId}` : 'New Sponsor'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Label</label>
                <input type="text" style={inputStyle} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Placement</label>
                <select style={inputStyle} value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}>
                  <option value="inline">Inline</option>
                  <option value="sidebar">Sidebar</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Title</label>
              <input type="text" style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required lang="bn" />
            </div>
            <div>
              <label style={labelStyle}>Subtitle / Tagline</label>
              <input type="text" style={inputStyle} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} required lang="bn" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>CTA Text</label>
                <input type="text" style={inputStyle} value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} required lang="bn" />
              </div>
              <div>
                <label style={labelStyle}>CTA URL</label>
                <input type="url" style={inputStyle} value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Display Order</label>
                <input type="number" style={inputStyle} value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value, 10) })} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)' }}>Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="admin-btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editId ? 'Update Sponsor' : 'Save Sponsor'}
              </button>
              {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); }} className="admin-btn-secondary">Cancel</button>}
            </div>
          </form>
        </section>

        {/* Sponsors table */}
        <section>
          <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12 }}>
            All Sponsors
          </h2>
          {loading ? (
            <p style={{ color: 'var(--ink-muted)', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12 }}>Loading...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Label</th>
                    <th style={thStyle}>Title</th>
                    <th style={thStyle}>Placement</th>
                    <th style={thStyle}>CTA</th>
                    <th style={thStyle}>Order</th>
                    <th style={thStyle}>Active</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((s) => (
                    <tr key={s.id}>
                      <td style={tdStyle}>{s.label}</td>
                      <td style={tdStyle} lang="bn">{s.title}</td>
                      <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>{s.placement}</td>
                      <td style={{ ...tdStyle, color: 'var(--ink-muted)' }} lang="bn">{s.ctaText}</td>
                      <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>{s.displayOrder}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => toggleActive(s)}
                          style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: 14, color: s.isActive ? '#2ecc71' : 'var(--ink-ghost)' }}
                          title={s.isActive ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                        >
                          {s.isActive ? '●' : '○'}
                        </button>
                      </td>
                      <td style={tdStyle}>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(s)} style={{ color: 'var(--ink)', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none' }}>✎</button>
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
