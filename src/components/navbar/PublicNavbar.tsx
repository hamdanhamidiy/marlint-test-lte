'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, UserCheck, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Logo from '@/components/brand/Logo';

export default function PublicNavbar() {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo with Modern Simple & Unique Identity */}
        <Logo size="md" showBadge={true} badgeText="WEB" href="/" />

        {/* Center: Navigation Links in modern pill container */}
        <nav className="hidden md:flex items-center bg-[#F1F3F9] p-1 rounded-full border border-slate-200/60 shadow-inner">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white transition-all shadow-2xs"
          >
            Beranda
          </Link>
          <Link
            href="/#tests"
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white transition-all"
          >
            Daftar Tes
          </Link>
          <Link
            href="/#features"
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white transition-all"
          >
            Fitur Ujian
          </Link>
          <Link
            href="/verify"
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-[#5046E5] hover:bg-white transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verifikasi Sertifikat</span>
          </Link>
        </nav>

        {/* Right: Auth Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {user ? (
            <Link
              href={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs text-white bg-[#5046E5] hover:bg-[#4338CA] shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Portal Admin' : 'Buka Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs text-white bg-[#5046E5] hover:bg-[#4338CA] shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
              >
                <span>Daftar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
