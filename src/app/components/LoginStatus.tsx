'use client';

import { useSession } from 'next-auth/react';

export default function LoginStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full border border-sky-200 text-sm text-slate-400">
        <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-sky-500 animate-spin" />
      </div>
    );
  }

  if (session?.user) {
    const userName = session.user.name || session.user.email || '사용자';
    const initial = userName.charAt(0).toUpperCase();

    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-full border border-sky-200 shadow-sm">
        <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
          {initial}
        </div>
        <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
          {userName}
        </span>
      </div>
    );
  }

  return (
    <a
      href="https://plancraft.co.kr/login"
      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/80 hover:bg-white text-slate-700 hover:text-sky-700 rounded-full border border-sky-200 hover:border-sky-400 text-sm font-medium transition-all shadow-sm hover:shadow"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      로그인
    </a>
  );
}
