'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, KeyRound, CheckCircle2, AlertCircle, Crown, Shield, Briefcase, Eye, EyeOff, Save, Camera, Loader2 } from 'lucide-react';

const ROLE_CONFIG = {
  super_admin: { label: '★ Super Admin', color: '#E74C3C', bg: '#E74C3C15', border: '#E74C3C30', icon: <Crown size={14} /> },
  admin: { label: 'Admin', color: '#3498DB', bg: '#3498DB15', border: '#3498DB30', icon: <Shield size={14} /> },
  employee: { label: 'Employee', color: '#27AE60', bg: '#27AE6015', border: '#27AE6030', icon: <Briefcase size={14} /> },
};

function Toast({ type, message, onClose }: { type: 'success' | 'error'; message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl"
      style={{
        background: type === 'success' ? '#27AE60' : '#C0392B',
        color: 'white',
        fontFamily: "'Hind Siliguri', sans-serif",
        fontSize: 13,
        minWidth: 260,
        animation: 'slideUp 0.25s ease',
      }}
    >
      {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

export default function ProfileClient() {
  const { data: session, update: updateSession } = useSession();
  const currentUser = session?.user as any;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Display name
  const [displayName, setDisplayName] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Password
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (currentUser?.displayName) setDisplayName(currentUser.displayName);
  }, [currentUser?.displayName]);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast('error', 'File size must be less than 3MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data?.url) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            avatarUrl: data.url,
          },
        });
        showToast('success', 'Profile picture updated successfully');
      } else {
        showToast('error', data.error || 'Failed to upload photo');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'An error occurred during upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSavingName(true);

    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: displayName.trim() }),
    });

    setSavingName(false);

    if (res.ok) {
      await updateSession({ ...session, user: { ...session?.user, displayName: displayName.trim(), name: displayName.trim() } });
      showToast('success', 'Display name updated successfully');
    } else {
      const data = await res.json();
      showToast('error', data.error || 'Failed to update name');
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPwd !== confirmPwd) {
      showToast('error', 'New passwords do not match');
      return;
    }
    if (newPwd.length < 8) {
      showToast('error', 'Password must be at least 8 characters');
      return;
    }

    setSavingPwd(true);

    const res = await fetch('/api/admin/profile/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
    });

    const data = await res.json();
    setSavingPwd(false);

    if (res.ok) {
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      showToast('success', 'Password changed. Please log in again.');
      setTimeout(() => signOut({ callbackUrl: '/admin' }), 2000);
    } else {
      showToast('error', data.error || 'Failed to change password');
    }
  }

  const roleKey = (currentUser?.role ?? 'employee') as keyof typeof ROLE_CONFIG;
  const roleConfig = ROLE_CONFIG[roleKey] ?? ROLE_CONFIG.employee;

  const nameChanged = displayName.trim() !== (currentUser?.displayName ?? '');

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      {/* Page header */}
      <div className="mb-8">
        <h1 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 24, color: 'var(--ink)' }}>
          My Profile
        </h1>
        <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)' }}>
          Update your display name and password
        </p>
      </div>

      {/* Avatar + identity card */}
      <div
        className="flex items-center gap-5 p-5 mb-6 rounded-lg"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)' }}
      >
        {/* Avatar circle */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="relative group overflow-hidden"
          style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: currentUser?.avatarUrl 
              ? 'var(--bg-page)' 
              : `linear-gradient(135deg, var(--ink) 0%, ${roleConfig.color} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: 'white',
            fontFamily: "var(--font-body)",
            boxShadow: `0 4px 20px ${roleConfig.color}40`,
            cursor: uploading ? 'not-allowed' : 'pointer',
            border: '2px solid var(--ink-border)',
          }}
        >
          {uploading ? (
            <Loader2 className="animate-spin" size={24} style={{ color: 'var(--ink)' }} />
          ) : currentUser?.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt="Avatar" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
            />
          ) : (
            (currentUser?.displayName || currentUser?.name || '?').charAt(0).toUpperCase()
          )}
          
          {/* Hover overlay */}
          {!uploading && (
            <div 
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200"
              style={{ borderRadius: '50%' }}
            >
              <Camera size={18} className="text-white mb-0.5" />
              <span style={{ fontSize: 9, color: 'white', fontWeight: 600, fontFamily: "'Hind Siliguri', sans-serif" }}>CHANGE</span>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
        />

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 20, color: 'var(--ink)' }}>
              {currentUser?.displayName || currentUser?.name}
            </span>
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: roleConfig.bg,
                color: roleConfig.color,
                border: `1px solid ${roleConfig.border}`,
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              {roleConfig.icon}
              {roleConfig.label}
            </span>
          </div>
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: 'var(--ink-muted)', marginTop: 3 }}>
            @{currentUser?.username ?? currentUser?.email}
          </p>
        </div>
      </div>

      {/* ── Display Name ── */}
      <div
        className="p-6 mb-4 rounded-lg"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <User size={16} style={{ color: 'var(--ink-muted)' }} />
          <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
            Display Name
          </h2>
        </div>

        <form onSubmit={handleSaveName} className="flex flex-col gap-4">
          <div>
            <label className="admin-label">Name shown in the admin panel</label>
            <input
              type="text"
              className="admin-input"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your display name"
              required
              maxLength={60}
            />
          </div>
          <div>
            <button
              type="submit"
              className="admin-btn-primary flex items-center gap-2"
              style={{
                height: 40, padding: '0 20px',
                opacity: (!nameChanged || savingName) ? 0.5 : 1,
              }}
              disabled={!nameChanged || savingName}
            >
              <Save size={14} />
              {savingName ? 'Saving...' : 'Save Name'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Change Password ── */}
      <div
        className="p-6 rounded-lg"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <KeyRound size={16} style={{ color: 'var(--ink-muted)' }} />
          <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
            Change Password
          </h2>
        </div>

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          {/* Current password */}
          <div>
            <label className="admin-label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrentPwd ? 'text' : 'password'}
                className="admin-input"
                value={currentPwd}
                onChange={e => setCurrentPwd(e.target.value)}
                required
                style={{ paddingRight: 40 }}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
              >
                {showCurrentPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="admin-label">New Password <span style={{ color: 'var(--ink-muted)', fontWeight: 400, fontSize: 10 }}>(min 8 chars)</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPwd ? 'text' : 'password'}
                className="admin-input"
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                required
                minLength={8}
                style={{ paddingRight: 40 }}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPwd(!showNewPwd)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
              >
                {showNewPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm new password */}
          <div>
            <label className="admin-label">Confirm New Password</label>
            <input
              type="password"
              className="admin-input"
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              required
              placeholder="Repeat new password"
              style={{
                borderColor: confirmPwd && newPwd !== confirmPwd ? '#C0392B' : undefined,
              }}
            />
            {confirmPwd && newPwd !== confirmPwd && (
              <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: '#C0392B', marginTop: 4 }}>
                Passwords do not match
              </p>
            )}
          </div>

          {/* Password strength indicator */}
          {newPwd && (
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    style={{
                      height: 3, flex: 1, borderRadius: 2,
                      background: newPwd.length >= i * 4
                        ? (newPwd.length < 8 ? '#E74C3C' : newPwd.length < 12 ? '#F39C12' : '#27AE60')
                        : 'var(--ink-ghost)',
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>
              <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, color: 'var(--ink-muted)' }}>
                {newPwd.length < 8 ? 'Too short' : newPwd.length < 12 ? 'Fair' : 'Strong'}
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="admin-btn-primary flex items-center gap-2"
              style={{
                height: 40, padding: '0 20px',
                opacity: savingPwd ? 0.6 : 1,
                background: '#C0392B',
              }}
              disabled={savingPwd}
            >
              <KeyRound size={14} />
              {savingPwd ? 'Changing...' : 'Change Password'}
            </button>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: 'var(--ink-muted)', marginTop: 8 }}>
              You will be logged out after changing your password.
            </p>
          </div>
        </form>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
