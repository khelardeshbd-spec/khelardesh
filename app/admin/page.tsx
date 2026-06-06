'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Admin Login Page — Section 11.1
 * Clean minimal form. Username + Password.
 * Redirect to /admin/dashboard on success.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('ভুল ব্যবহারকারী নাম বা পাসওয়ার্ড।');
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      {/* Masthead */}
      <div className="mb-10 text-center">
        <p
          style={{
            fontFamily: "'Hind Siliguri', sans-serif",
            fontSize: 9, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--ink-muted)',
            marginBottom: 4,
          }}
        >
          Sports · Independent
        </p>
        <h1
          style={{
            fontFamily: "'Manowar Murshidabad', 'Noto Serif Bengali', serif",
            fontWeight: 900, fontSize: 48, letterSpacing: '-0.02em',
            lineHeight: 1, color: 'var(--ink)',
          }}
        >
          খেলারদেশ
        </h1>
        <p
          style={{
            fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
            fontSize: 10, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--ink-muted)',
            marginTop: 6, borderTop: '1px solid var(--ink-border)',
            paddingTop: 6,
          }}
        >
          Admin Panel
        </p>
      </div>

      {/* Login form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%', maxWidth: 320,
          backgroundColor: 'var(--bg-surface)',
          padding: '28px 24px',
          borderRadius: 2,
          border: '1px solid var(--ink-border)',
        }}
      >
        <div className="mb-5">
          <label htmlFor="username" className="admin-label">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            className="admin-input"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="admin-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="admin-input"
          />
        </div>

        {error && (
          <p
            style={{
              fontFamily: "'Hind Siliguri', sans-serif",
              fontSize: 12, color: '#C0392B',
              marginBottom: 12,
            }}
            lang="bn"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="admin-btn-primary w-full"
          disabled={loading}
          style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'লগইন হচ্ছে...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
