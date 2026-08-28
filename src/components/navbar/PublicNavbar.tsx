'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Logo from '@/components/brand/Logo';

export default function PublicNavbar() {
  const { user, isAdmin, isInstructor, isSuperAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
        <Logo
          size="md"
          showBadge={false}
          showSubtitle={true}
          subtitleText="Hotel & Marine Training Center"
          href="/"
          variant="dark"
          className="shrink-0"
        />

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-slate-50 transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/#tests"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-slate-50 transition-colors"
          >
            Paket Ujian
          </Link>
          <Link
            href="/#features"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-slate-50 transition-colors"
          >
            Standar Kompetensi
          </Link>
          <Link
            href="/verify"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verifikasi Sertifikat</span>
          </Link>
        </nav>

        {/* Right: Auth Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <Link
              href={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-2xs transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {isSuperAdmin
                  ? 'Super Admin'
                  : isInstructor
                  ? 'Instruktur'
                  : isAdmin
                  ? 'Portal Admin'
                  : 'Dashboard Siswa'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-2xs transition-all"
              >
                <span>Daftar</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

