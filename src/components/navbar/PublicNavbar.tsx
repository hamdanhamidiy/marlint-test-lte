'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Logo from '@/components/brand/Logo';

export default function PublicNavbar() {
  const { user, isAdmin, isInstructor, isSuperAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Logo
          size="md"
          showBadge={false}
          showSubtitle={true}
          subtitleText="LTE Cruise Training Center"
          href="/"
          variant="dark"
          className="shrink-0"
        />

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-full border border-slate-200/70 shadow-2xs backdrop-blur-xs">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#0284C7] hover:bg-white transition-all duration-200"
          >
            Beranda
          </Link>
          <Link
            href="/#tests"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#0284C7] hover:bg-white transition-all duration-200"
          >
            Paket Ujian
          </Link>
          <Link
            href="/#features"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#0284C7] hover:bg-white transition-all duration-200"
          >
            Standar Evaluasi
          </Link>
          <Link
            href="/verify"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-white transition-all duration-200 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verifikasi Sertifikat</span>
          </Link>
        </nav>

        {/* Right: Auth Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {user ? (
            <Link
              href={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
              className="group flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 rounded-full font-bold text-xs text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] shadow-md shadow-sky-500/20 hover:opacity-95 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-200 shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {isSuperAdmin
                  ? 'Super Admin'
                  : isInstructor
                  ? 'Instruktur'
                  : isAdmin
                  ? 'Portal Admin'
                  : 'Dashboard'}
              </span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 hidden sm:inline-block" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all duration-150"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="group flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-xs text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] shadow-md shadow-sky-500/20 hover:opacity-95 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Daftar</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

