'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  UserPlus, MoreVertical, CheckCircle2, XCircle,
  Trash2, Shield, ShieldOff, Eye, EyeOff, X, Settings
} from 'lucide-react';

interface Employee {
  id: string;
  username: string;
  display_name: string;
  is_active: boolean;
  permissions: Record<string, boolean>;
  created_at: string;
}

interface NewEmployeeForm {
  username: string;
  password: string;
  displayName: string;
  permissions: { 
    write_articles: boolean; 
    view_articles: boolean;
    edit_published_articles: boolean;
    edit_drafts: boolean;
    delete_articles: boolean;
    delete_drafts: boolean;
  };
}

const PERM_LABELS: Record<string, string> = {
  write_articles: 'Write Articles',
  view_articles: 'View Articles',
  edit_published_articles: 'Edit Published',
  edit_drafts: 'Edit Drafts',
  delete_articles: 'Delete Published',
  delete_drafts: 'Delete Drafts',
};

// Fixed-position dropdown menu that escapes overflow:hidden containers
function FixedDropdown({
  anchorRef,
  onClose,
  children,
}: {
  anchorRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [anchorRef]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 w-44 bg-white border border-[var(--ink-border)] rounded-md shadow-xl py-1 text-left"
        style={{ top: pos.top, right: pos.right }}
      >
        {children}
      </div>
    </>
  );
}

function EmployeeRow({
  emp,
  isLast,
  editingPermsId,
  onTogglePerms,
  onToggleActive,
  onDelete,
  onUpdatePerms,
}: {
  emp: Employee;
  isLast: boolean;
  editingPermsId: string | null;
  onTogglePerms: (id: string) => void;
  onToggleActive: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
  onUpdatePerms: (emp: Employee, perms: Record<string, boolean>) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ borderBottom: !isLast ? '0.5px solid var(--ink-border)' : undefined }}>
      <div className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--ink-ghost)] transition-colors">
        {/* Avatar + Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: emp.is_active ? 'var(--ink)' : 'var(--ink-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ color: 'var(--bg-page)', fontSize: 13, fontWeight: 700 }}>
              {emp.display_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
                {emp.display_name}
              </span>
              <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: 'var(--ink-muted)' }}>
                @{emp.username}
              </span>
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                style={{
                  background: emp.is_active ? '#27AE6015' : '#7F8C8D20',
                  color: emp.is_active ? '#27AE60' : '#7F8C8D',
                  border: `1px solid ${emp.is_active ? '#27AE6030' : '#7F8C8D30'}`,
                  fontFamily: "'Hind Siliguri', sans-serif",
                }}
              >
                {emp.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {Object.entries(PERM_LABELS).map(([key, label]) => (
                <span
                  key={key}
                  className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    background: emp.permissions[key] ? '#3498DB15' : 'var(--ink-ghost)',
                    color: emp.permissions[key] ? '#3498DB' : 'var(--ink-muted)',
                    fontFamily: "'Hind Siliguri', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {emp.permissions[key] ? <CheckCircle2 size={9} /> : <XCircle size={9} />}
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onTogglePerms(emp.id)}
            className="p-1.5 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)]"
            title="Edit permissions"
          >
            <Settings size={14} />
          </button>
          <button
            ref={btnRef}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
            className="p-1.5 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)]"
            title="More actions"
          >
            <MoreVertical size={14} />
          </button>

          {menuOpen && (
            <FixedDropdown anchorRef={btnRef} onClose={() => setMenuOpen(false)}>
              <button
                onClick={() => { onToggleActive(emp); setMenuOpen(false); }}
                className="w-full px-3 py-2 text-xs text-left hover:bg-[var(--ink-ghost)] flex items-center gap-2 text-slate-700 border-none bg-transparent cursor-pointer font-semibold"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {emp.is_active ? <ShieldOff size={12} /> : <Shield size={12} />}
                {emp.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => { onDelete(emp); setMenuOpen(false); }}
                className="w-full px-3 py-2 text-xs text-left hover:bg-red-50 flex items-center gap-2 text-red-600 border-none bg-transparent cursor-pointer font-semibold"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                <Trash2 size={12} />
                Delete Account
              </button>
            </FixedDropdown>
          )}
        </div>
      </div>

      {/* Permission Editor (inline) */}
      {editingPermsId === emp.id && (
        <div
          className="px-4 pb-4"
          style={{ borderTop: '0.5px solid var(--ink-border)', background: 'var(--bg-page)' }}
        >
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: 'var(--ink-muted)', marginBottom: 8, marginTop: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Permissions
          </p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(PERM_LABELS).map(([key, label]) => {
              const current = emp.permissions[key] ?? false;
              return (
                <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={current}
                    onChange={async (e) => {
                      const newPerms = { ...emp.permissions, [key]: e.target.checked };
                      await onUpdatePerms(emp, newPerms);
                    }}
                    className="admin-checkbox"
                  />
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: 'var(--ink)' }}>
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeamClient() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [editingPermsId, setEditingPermsId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<NewEmployeeForm>({
    username: '',
    password: '',
    displayName: '',
    permissions: { 
      write_articles: true, 
      view_articles: true,
      edit_published_articles: false,
      edit_drafts: true,
      delete_articles: false,
      delete_drafts: true,
    },
  });

  useEffect(() => { fetchEmployees(); }, []);

  async function fetchEmployees() {
    setLoading(true);
    const res = await fetch('/api/admin/team');
    const data = await res.json();
    setEmployees(data.employees ?? []);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');

    const res = await fetch('/api/admin/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
        displayName: form.displayName,
        permissions: form.permissions,
      }),
    });

    const data = await res.json();
    setCreating(false);

    if (!res.ok) { setCreateError(data.error || 'Failed to create employee'); return; }

    setEmployees(prev => [data.employee, ...prev]);
    setShowCreate(false);
    setForm({ 
      username: '', password: '', displayName: '', 
      permissions: { 
        write_articles: true, 
        view_articles: true,
        edit_published_articles: false,
        edit_drafts: true,
        delete_articles: false,
        delete_drafts: true,
      } 
    });
  }

  const handleToggleActive = useCallback(async (emp: Employee) => {
    const res = await fetch(`/api/admin/team/${emp.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !emp.is_active }),
    });
    if (res.ok) setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, is_active: !emp.is_active } : e));
  }, []);

  const handleDelete = useCallback(async (emp: Employee) => {
    if (!confirm(`Delete "${emp.display_name}" (@${emp.username})? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/team/${emp.id}`, { method: 'DELETE' });
    if (res.ok) setEmployees(prev => prev.filter(e => e.id !== emp.id));
  }, []);

  const handleUpdatePerms = useCallback(async (emp: Employee, newPerms: Record<string, boolean>) => {
    const res = await fetch(`/api/admin/team/${emp.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissions: newPerms }),
    });
    if (res.ok) setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, permissions: newPerms } : e));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 24, color: 'var(--ink)' }}>
            Employee Accounts
          </h1>
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)' }}>
            Manage employee access — create accounts, set permissions, and control access
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="admin-btn-primary flex items-center gap-2"
          style={{ height: 42, padding: '0 20px' }}
        >
          <UserPlus size={16} />
          <span>New Employee</span>
        </button>
      </div>

      {/* Employee list — no overflow:hidden so dropdowns are never clipped */}
      <div className="border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--ink-border)', borderRadius: 6 }}>
        {loading ? (
          <div className="p-12 text-center" style={{ color: 'var(--ink-muted)', fontSize: 13, fontFamily: "'Hind Siliguri', sans-serif" }}>
            Loading...
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center" style={{ color: 'var(--ink-muted)', fontSize: 13, fontFamily: "'Hind Siliguri', sans-serif" }}>
            No employee accounts yet. Create one to get started.
          </div>
        ) : (
          employees.map((emp, idx) => (
            <EmployeeRow
              key={emp.id}
              emp={emp}
              isLast={idx === employees.length - 1}
              editingPermsId={editingPermsId}
              onTogglePerms={(id) => setEditingPermsId(editingPermsId === id ? null : id)}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
              onUpdatePerms={handleUpdatePerms}
            />
          ))
        )}
      </div>

      {/* Create Employee Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
        >
          <div
            className="w-full max-w-md rounded-lg shadow-2xl"
            style={{ backgroundColor: 'var(--bg-page)', border: '1px solid var(--ink-border)' }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--ink-border)' }}>
              <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>
                New Employee Account
              </h2>
              <button onClick={() => setShowCreate(false)} style={{ color: 'var(--ink-muted)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
              <div>
                <label className="admin-label">Display Name</label>
                <input type="text" className="admin-input" value={form.displayName}
                  onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                  placeholder="Rahim Ahmed" required />
              </div>
              <div>
                <label className="admin-label">Username <span style={{ color: 'var(--ink-muted)', fontWeight: 400, fontSize: 10 }}>(lowercase letters/numbers/_)</span></label>
                <input type="text" className="admin-input" value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                  placeholder="rahim_ahmed" required />
              </div>
              <div>
                <label className="admin-label">Password <span style={{ color: 'var(--ink-muted)', fontWeight: 400, fontSize: 10 }}>(min 8 chars)</span></label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} className="admin-input"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required minLength={8} style={{ paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <p className="admin-label" style={{ marginBottom: 8 }}>Permissions</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(PERM_LABELS).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox"
                        checked={form.permissions[key as keyof typeof form.permissions] ?? false}
                        onChange={e => setForm(f => ({ ...f, permissions: { ...f.permissions, [key]: e.target.checked } }))}
                        className="admin-checkbox" />
                      <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: 'var(--ink)' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {createError && (
                <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#C0392B' }}>{createError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="admin-btn-secondary flex-1" style={{ height: 42 }}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary flex-1" style={{ height: 42, opacity: creating ? 0.6 : 1 }} disabled={creating}>
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
