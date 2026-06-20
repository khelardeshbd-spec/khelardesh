'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface LogEntry {
  id: string;
  actor_id: string;
  actor_display_name: string;
  actor_role: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  target_label: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  'article.create': '#27AE60',
  'article.update': '#3498DB',
  'article.delete': '#E74C3C',
  'article.publish': '#27AE60',
  'article.archive': '#F39C12',
  'employee.create': '#9B59B6',
  'employee.update_permissions': '#3498DB',
  'employee.activate': '#27AE60',
  'employee.deactivate': '#F39C12',
  'employee.delete': '#E74C3C',
  'admin.block': '#C0392B',
  'admin.unblock': '#27AE60',
  'auth.login': '#7F8C8D',
  'auth.logout': '#7F8C8D',
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Admin',
  admin: 'Admin',
  employee: 'Employee',
};

function ActionBadge({ action }: { action: string }) {
  const color = ACTION_COLORS[action] ?? '#7F8C8D';
  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
      style={{
        background: color + '20',
        color,
        border: `1px solid ${color}30`,
        fontFamily: "'Hind Siliguri', sans-serif",
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {action.replace('.', ' › ')}
    </span>
  );
}

function formatRelativeTime(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { dateStyle: 'medium' });
}

export default function ActivityClient() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = useCallback(async (p = page) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: '30' });
    if (actionFilter) params.set('action', actionFilter);

    const res = await fetch(`/api/admin/activity?${params}`);
    const data = await res.json();

    setLogs(data.logs ?? []);
    setTotal(data.total ?? 0);
    setTotalPages(data.totalPages ?? 1);
    setLoading(false);
    setRefreshing(false);
  }, [page, actionFilter]);

  useEffect(() => {
    fetchLogs(page);
  }, [page, actionFilter]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchLogs(page);
  }

  const actionTypes = Object.keys(ACTION_COLORS);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 24, color: 'var(--ink)' }}>
            Activity Log
          </h1>
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)' }}>
            Immutable audit trail — {total.toLocaleString()} total events recorded. Read-only.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="admin-btn-secondary flex items-center gap-2"
          style={{ height: 40, padding: '0 16px', opacity: refreshing ? 0.6 : 1 }}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div
        className="p-4 border mb-6 flex flex-col md:flex-row gap-3 items-center"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--ink-border)', borderRadius: 6 }}
      >
        <div className="flex items-center gap-2">
          <Filter size={13} style={{ color: 'var(--ink-muted)' }} />
          <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: 'var(--ink-muted)', fontWeight: 600 }}>
            FILTER BY ACTION
          </span>
        </div>
        <select
          value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(1); }}
          className="admin-input"
          style={{ maxWidth: 240, height: 36, fontSize: 12, fontFamily: "'Hind Siliguri', sans-serif" }}
        >
          <option value="">All Actions</option>
          {actionTypes.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        {actionFilter && (
          <button
            onClick={() => { setActionFilter(''); setPage(1); }}
            className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Log entries */}
      <div className="border overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--ink-border)', borderRadius: 6 }}>
        {loading ? (
          <div className="p-12 text-center" style={{ color: 'var(--ink-muted)', fontSize: 13 }}>Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center" style={{ color: 'var(--ink-muted)', fontSize: 13, fontFamily: "'Hind Siliguri', sans-serif" }}>
            No activity recorded yet.
          </div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={log.id}
              style={{ borderBottom: idx < logs.length - 1 ? '0.5px solid var(--ink-border)' : undefined }}
              className="px-5 py-3.5 hover:bg-[var(--ink-ghost)] transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Timeline dot */}
                <div
                  style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                    background: ACTION_COLORS[log.action] ?? '#7F8C8D',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {/* Actor */}
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>
                      {log.actor_display_name}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                      style={{
                        fontFamily: "'Hind Siliguri', sans-serif",
                        background: 'var(--ink-ghost)',
                        color: 'var(--ink-muted)',
                      }}
                    >
                      {ROLE_LABELS[log.actor_role] ?? log.actor_role}
                    </span>
                    {/* Action badge */}
                    <ActionBadge action={log.action} />
                    {/* Target */}
                    {log.target_label && (
                      <span
                        className="text-xs truncate max-w-xs"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif", color: 'var(--ink-muted)' }}
                        title={log.target_label}
                      >
                        → {log.target_label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[11px]"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif", color: 'var(--ink-muted)' }}
                      title={new Date(log.created_at).toLocaleString('en-GB')}
                    >
                      {formatRelativeTime(log.created_at)}
                      {' · '}
                      {new Date(log.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="admin-btn-secondary flex items-center gap-1.5"
            style={{ height: 36, padding: '0 14px', opacity: page <= 1 ? 0.4 : 1, fontSize: 12 }}
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="admin-btn-secondary flex items-center gap-1.5"
            style={{ height: 36, padding: '0 14px', opacity: page >= totalPages ? 0.4 : 1, fontSize: 12 }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
