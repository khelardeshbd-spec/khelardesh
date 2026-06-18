'use client';

import { signIn } from 'next-auth/react';

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn('google')}
      className="text-blue-600 hover:text-blue-800 transition-colors font-bold text-[11px] sm:text-xs tracking-wider cursor-pointer bg-transparent border-0 p-0"
    >
      লগইন
    </button>
  );
}
