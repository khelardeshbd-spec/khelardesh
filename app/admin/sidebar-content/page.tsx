'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../../AdminShell';

type TabType = 'trivia' | 'history' | 'fixture' | 'tv';

interface SidebarItem {
  id: number;
  tab_type: TabType;
  content: Record<string, string>;
  display_order: number;
  active: boolean;
  event_date?: string | null;
}

const TAB_CONFIG: Record<TabType, { label: string; fields: { key: string; label: string; placeholder: string }[] }> = {
  trivia: {
    label: 'আপনি জানেন কি?',
    fields: [
      { key: 'fact', label: 'Fact (Bengali)', placeholder: 'বাংলাদেশ ফুটবল দল ১৯৭৩ সালে...' },
      { key: 'category', label: 'Category Tag', placeholder: 'বাংলাদেশ ফুটবল' },
    ],
  },
  history: {
    label: 'ইতিহাসের পাতা থেকে',
    fields: [
      { key: 'year', label: 'Year (Bengali)', placeholder: '১৯৮৬' },
      { key: 'event', label: 'Event (Bengali)', placeholder: 'ম্যারাডোনার হ্যান্ড অব গড গোলে...' },
      { key: 'sport', label: 'Sport', placeholder: 'football' },
    ],
  },
  fixture: {
    label: 'আজকের খেলা',
    fields: [
      { key: 'league', label: 'League', placeholder: 'বাংলাদেশ প্রিমিয়ার লিগ' },
      { key: 'homeTeam', label: 'Home Team', placeholder: 'আবাহনী' },
      { key: 'awayTeam', label: 'Away Team', placeholder: 'মোহামেডান' },
      { key: 'time', label: 'Kickoff Time', placeholder: '৬:০০ PM' },
      { key: 'status', label: 'Status', placeholder: 'upcoming / live / finished' },
    ],
  },
  tv: {
    label: 'টিভিতে যা দেখবেন',
    fields: [
      { key: 'time', label: 'Time', placeholder: '৩:৩০ PM' },
      { key: 'event', label: 'Event', placeholder: 'চ্যাম্পিয়নস লিগ: বায়ার্ন vs রিয়াল মাদ্রিদ' },
      { key: 'channel', label: 'Channel', placeholder: 'Sony Sports' },
      { key: 'sport', label: 'Sport', placeholder: 'football' },
    ],
  },
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Hind Siliguri', sans-serif",
  fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--ink-muted)',
  display: 'block', marginBottom: 4,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px',
  border: '1px solid var(--ink-border)',
  background: 'var(--bg-surface)', color: 'var(--ink)',
  fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, borderRadius: 2,
};
const thStyle: React.CSSProperties = {
  fontFamily: "'Hind Siliguri', sans-serif",
  fontSize: 9, fontWeight: 500, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--ink-ghost)',
  padding: '6px 8px', textAlign: 'left',
  borderBottom: '1px solid var(--ink-border)',
};
const tdStyle: React.CSSProperties = {
  fontFamily: "'Hind Siliguri', sans-serif",
  fontSize: 12, color: 'var(--ink)',
  padding: '7px 8px',
  borderBottom: '0.5px solid var(--ink-border)',
  verticalAlign: 'middle',
};

export default function AdminSidebarContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>('trivia');
  const [items, setItems] = useState<SidebarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [eventDate, setEventDate] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sidebar-content?tab=${activeTab}`);
      const data = await res.json() as any;
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditId(null);
    setFieldValues({});
    setEventDate('');
    setDisplayOrder(0);
    setIsActive(true);
  }

  function startEdit(item: SidebarItem) {
    setEditId(item.id);
    setFieldValues(item.content ?? {});
    setEventDate(item.event_date ?? '');
    setDisplayOrder(item.display_order);
    setIsActive(item.active);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = editId ? `/api/admin/sidebar-content/${editId}` : '/api/admin/sidebar-content';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tab_type: activeTab,
          content: fieldValues,
          display_order: displayOrder,
          active: isActive,
          event_date: eventDate || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json() as any;
        throw new Error(err.error ?? 'Save failed');
      }
      resetForm();
      await loadItems();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error saving');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this item?')) return;
    await fetch(`/api/admin/sidebar-content/${id}`, { method: 'DELETE' });
    await loadItems();
  }

  async function toggleActive(item: SidebarItem) {
    await fetch(`/api/admin/sidebar-content/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, active: !item.active }),
    });
    await loadItems();
  }

  const config = TAB_CONFIG[activeTab];

  return (
    <AdminShell>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--ink)', marginBottom: 20 }}>
          Sidebar Content
        </h1>

        {/* Tab selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(Object.keys(TAB_CONFIG) as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); resetForm(); }}
              lang="bn"
              style={{
                fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                fontSize: 13, fontWeight: activeTab === tab ? 700 : 400,
                padding: '6px 14px',
                backgroundColor: activeTab === tab ? 'var(--ink)' : 'var(--bg-surface)',
                color: activeTab === tab ? 'var(--bg-page)' : 'var(--ink-muted)',
                border: '1px solid var(--ink-border)',
                borderRadius: 2, cursor: 'pointer',
              }}
            >
              {TAB_CONFIG[tab].label}
            </button>
          ))}
        </div>

        {error && <div style={{ color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 12 }}>{error}</div>}

        {/* Entry form */}
        <section style={{ marginBottom: 32, padding: 20, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)', borderRadius: 2 }}>
          <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 16 }}>
            {editId ? `Editing Item #${editId}` : `Add to "${config.label}"`}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {config.fields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={fieldValues[key] ?? ''}
                  onChange={(e) => setFieldValues({ ...fieldValues, [key]: e.target.value })}
                  placeholder={placeholder}
                  required={key === config.fields[0].key}
                  lang="bn"
                />
              </div>
            ))}

            {/* Date (for fixture and tv) */}
            {(activeTab === 'fixture' || activeTab === 'tv') && (
              <div>
                <label style={labelStyle}>Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Display Order</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10))}
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)' }}>Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="admin-btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editId ? 'Update' : 'Add Item'}
              </button>
              {editId && (
                <button type="button" onClick={resetForm} className="admin-btn-secondary">Cancel</button>
              )}
            </div>
          </form>
        </section>

        {/* Items table */}
        <section>
          <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12 }}>
            {config.label} — Items
          </h2>
          {loading ? (
            <p style={{ color: 'var(--ink-muted)', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12 }}>Loading...</p>
          ) : items.length === 0 ? (
            <p style={{ color: 'var(--ink-muted)', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12 }}>No items yet. Add one above.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Content</th>
                    <th style={thStyle}>Order</th>
                    {(activeTab === 'fixture' || activeTab === 'tv') && <th style={thStyle}>Date</th>}
                    <th style={thStyle}>Active</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const firstField = config.fields[0].key;
                    return (
                      <tr key={item.id} style={{ backgroundColor: editId === item.id ? 'var(--bg-surface)' : 'transparent' }}>
                        <td style={tdStyle} lang="bn">{item.content?.[firstField] ?? '—'}</td>
                        <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>{item.display_order}</td>
                        {(activeTab === 'fixture' || activeTab === 'tv') && (
                          <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>{item.event_date ?? '—'}</td>
                        )}
                        <td style={tdStyle}>
                          <button
                            onClick={() => toggleActive(item)}
                            style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: 14, color: item.active ? '#2ecc71' : 'var(--ink-ghost)' }}
                          >
                            {item.active ? '●' : '○'}
                          </button>
                        </td>
                        <td style={tdStyle}>
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(item)} style={{ color: 'var(--ink)', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none' }}>✎</button>
                            <button onClick={() => handleDelete(item.id)} style={{ color: '#C0392B', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
