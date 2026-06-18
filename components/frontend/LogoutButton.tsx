'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-[10px] text-gray-400 hover:text-gray-600 transition-all font-bold tracking-wider cursor-pointer bg-transparent border-0 p-0"
    >
      লগআউট
    </button>
  );
}
