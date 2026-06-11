'use client';
import { signOut } from 'next-auth/react';

export default function AdminLogout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin' })}
      className="admin-btn-secondary"
    >
      Log out
    </button>
  );
}
