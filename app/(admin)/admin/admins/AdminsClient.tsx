'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldOff, Crown, User2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface AdminAccount {
  id: string;
  username: string;
  display_name: string;
  role: 'super_admin' | 'admin';
  is_blocked: boolean;
  created_at: string;
}

export default function AdminsClient() {
  const { data: session } = useSession();
  const currentUser = session?.user as any;
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/admins')
      .then(r => r.json())
      .then(d => setAdmins(d.admins ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleBlock(admin: AdminAccount) {
    const action = admin.is_blocked ? 'unblock' : 'block';
    if (!confirm(`${action === 'block' ? 'Block' : 'Unblock'} admin "${admin.display_name}"?`)) return;

    setTogglingId(admin.id);
    const res = await fetch(`/api/admin/admins/${admin.id}/block`, { method: 'POST' });
    const data = await res.json();
    setTogglingId(null);

    if (res.ok) {
      setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, is_blocked: data.is_blocked } : a));
    } else {
      alert(data.error || 'Failed to update');
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <div className="mb-8">
        <h1 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 24, color: 'var(--ink)' }}>
          Admin Accounts
        </h1>
        <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)' }}>
          The 3 admin accounts of খেলারদেশ. Super admin can block/unblock regular admins.
        </p>
      </div>

      <div className="border overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--ink-border)', borderRadius: 6 }}>
        {loading ? (
          <div className="p-12 text-center" style={{ color: 'var(--ink-muted)', fontSize: 13 }}>Loading...</div>
        ) : (
          admins.map((admin, idx) => (
            <div
              key={admin.id}
              style={{ borderBottom: idx < admins.length - 1 ? '0.5px solid var(--ink-border)' : undefined }}
              className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--ink-ghost)] transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: admin.role === 'super_admin'
                      ? 'linear-gradient(135deg, #2C3E50, #E74C3C)'
                      : admin.is_blocked ? '#7F8C8D' : 'var(--ink)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {admin.role === 'super_admin'
                    ? <Crown size={16} color="white" />
                    : <User2 size={16} color="white" />
                  }
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
                      {admin.display_name}
                    </span>
                    <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: 'var(--ink-muted)' }}>
                      @{admin.username}
                    </span>
                    {/* Role badge */}
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        background: admin.role === 'super_admin' ? '#E74C3C15' : '#3498DB15',
                        color: admin.role === 'super_admin' ? '#E74C3C' : '#3498DB',
                        border: `1px solid ${admin.role === 'super_admin' ? '#E74C3C30' : '#3498DB30'}`,
                        fontFamily: "'Hind Siliguri', sans-serif",
                      }}
                    >
                      {admin.role === 'super_admin' ? '★ Super Admin' : 'Admin'}
                    </span>
                    {/* Blocked badge */}
                    {admin.is_blocked && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          background: '#C0392B20',
                          color: '#C0392B',
                          border: '1px solid #C0392B30',
                          fontFamily: "'Hind Siliguri', sans-serif",
                        }}
                      >
                        Blocked
                      </span>
                    )}
                    {/* Current user badge */}
                    {currentUser?.username === admin.username && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          background: '#27AE6015',
                          color: '#27AE60',
                          border: '1px solid #27AE6030',
                          fontFamily: "'Hind Siliguri', sans-serif",
                        }}
                      >
                        You
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
                    Joined {new Date(admin.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                  </p>
                </div>
              </div>

              {/* Block/Unblock (super admin only, not for self or other super_admin) */}
              {isSuperAdmin && admin.role !== 'super_admin' && currentUser?.username !== admin.username && (
                <button
                  onClick={() => handleBlock(admin)}
                  disabled={togglingId === admin.id}
                  className="flex items-center gap-1.5 text-xs font-semibold rounded transition-colors"
                  style={{
                    padding: '6px 14px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                    border: `1px solid ${admin.is_blocked ? '#27AE6040' : '#C0392B40'}`,
                    background: admin.is_blocked ? '#27AE6010' : '#C0392B10',
                    color: admin.is_blocked ? '#27AE60' : '#C0392B',
                    cursor: togglingId === admin.id ? 'not-allowed' : 'pointer',
                    opacity: togglingId === admin.id ? 0.5 : 1,
                  }}
                >
                  {admin.is_blocked ? <Shield size={12} /> : <ShieldOff size={12} />}
                  {admin.is_blocked ? 'Unblock' : 'Block'}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {!isSuperAdmin && (
        <p
          className="mt-4 text-center text-xs"
          style={{ fontFamily: "'Hind Siliguri', sans-serif", color: 'var(--ink-muted)' }}
        >
          Only the Super Admin can block or unblock admin accounts.
        </p>
      )}
    </div>
  );
}
