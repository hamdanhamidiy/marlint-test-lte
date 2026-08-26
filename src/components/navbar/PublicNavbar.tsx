'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Logo from '@/components/brand/Logo';

export default function PublicNavbar() {
  const { user, isAdmin, isInstructor, isSuperAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo size="md" showBadge={false} showSubtitle={true} subtitleText="LTE Cruise Training Center" href="/" variant="dark" />

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center bg-[#F1F3F5] p-1 rounded-full border border-slate-200/60 shadow-2xs">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-[13px] font-medium text-slate-700 hover:text-black hover:bg-white transition-all duration-150"
          >
            Beranda
          </Link>
          <Link
            href="/#tests"
            className="px-4 py-1.5 rounded-full text-[13px] font-medium text-slate-700 hover:text-black hover:bg-white transition-all duration-150"
          >
            Daftar Tes
          </Link>
          <Link
            href="/#features"
            className="px-4 py-1.5 rounded-full text-[13px] font-medium text-slate-700 hover:text-black hover:bg-white transition-all duration-150"
          >
            Fitur Ujian
          </Link>
          <Link
            href="/verify"
            className="px-4 py-1.5 rounded-full text-[13px] font-medium text-slate-700 hover:text-black hover:bg-white transition-all duration-150 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verifikasi Sertifikat</span>
          </Link>
        </nav>

        {/* Right: Auth Action Buttons (Black pill style like Antigravity) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {user ? (
            <Link
              href={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
              className="group flex items-center gap-2 px-5 py-2 rounded-full font-medium text-[13px] text-white bg-black hover:bg-neutral-800 shadow-xs transition-all duration-150 hover:scale-[1.02]"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-200" />
              <span>
                {isSuperAdmin
                  ? 'Portal Super Admin'
                  : isInstructor
                  ? 'Portal Instruktur'
                  : isAdmin
                  ? 'Portal Admin'
                  : 'Buka Dashboard'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full text-[13px] font-medium text-slate-700 hover:text-black hover:bg-slate-100 transition-all duration-150"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="group flex items-center gap-1.5 px-5 py-2 rounded-full font-medium text-[13px] text-white bg-black hover:bg-neutral-800 shadow-xs transition-all duration-150 hover:scale-[1.02]"
              >
                <span>Daftar</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

