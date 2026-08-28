'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  HelpCircle,
  FileCheck2,
  KeyRound,
  Users,
  GraduationCap,
  LogOut,
  ArrowLeft,
  X,
  Wallet,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { useAuth } from '@/lib/context/AuthContext';

interface AdminSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  isOpenMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { profile, signOut, isSuperAdmin, isInstructor } = useAuth();

  const isInstructorRole = profile?.role === 'instructor' || isInstructor;
  const isSuperAdminRole = profile?.role === 'super_admin' || isSuperAdmin;

  // Navigation Links
  const baseLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ...(isSuperAdminRole
      ? [{ name: 'Manajemen Instruktur', href: '/admin/instructors', icon: GraduationCap }]
      : []),
    { name: 'Data Siswa & Nilai', href: '/admin/students', icon: Users },
    { name: 'Pembayaran & Keuangan', href: '/admin/payments', icon: Wallet },
    { name: 'Bank Soal', href: '/admin/questions', icon: HelpCircle },
    { name: 'Kelola Ujian', href: '/admin/tests', icon: FileCheck2 },
    { name: 'Token Akses', href: '/admin/tokens', icon: KeyRound },
  ];

  const badgeText = isSuperAdminRole ? 'SUPER ADMIN' : isInstructorRole ? 'INSTRUKTUR' : 'ADMIN';
  const subtitleText = isSuperAdminRole ? 'Master Control' : isInstructorRole ? 'Instructor Portal' : 'Control Center';

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-slate-200/90 shadow-2xs flex flex-col justify-between p-5 select-none font-sans h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Logo & Mobile Close Button */}
        <div className="flex items-center justify-between px-2 pt-1 pb-1">
          <Logo
            size="md"
            showBadge={false}
            showSubtitle={true}
            subtitleText={subtitleText}
            href="/admin/dashboard"
          />
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Section: MANAJEMEN SISTEM */}
        {/* Section: MANAJEMEN SISTEM */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
              {isInstructorRole ? 'Modul Pengajaran & Ujian' : 'Manajemen Sistem'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
          </div>

          <nav className="space-y-1">
            {baseLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ease-out active:scale-[0.98] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white shadow-md shadow-sky-500/25 translate-x-1'
                      : 'text-slate-600 hover:text-[#0284C7] hover:bg-sky-50/80 hover:translate-x-1.5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-all duration-200 ${
                        isActive ? 'text-cyan-200' : 'text-slate-400 group-hover:text-[#0284C7] group-hover:scale-110'
                      }`}
                    />
                    <span className="tracking-tight">{item.name}</span>
                  </div>

                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-xs shadow-cyan-300/80 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Section: FOOTER & PROFILE */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <Link
          href="/student/dashboard"
          onClick={onCloseMobile}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:text-[#0284C7] hover:bg-sky-50/80 hover:translate-x-1.5 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-[#0284C7] group-hover:-translate-x-0.5 transition-all" />
          <span>Lihat Portal Siswa</span>
        </Link>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2 shadow-2xs">
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-slate-950 truncate">{profile?.full_name || 'Staff Marlins'}</p>
            <p
              className={`text-[10px] uppercase font-extrabold tracking-wider mt-0.5 ${
                isSuperAdminRole
                  ? 'text-purple-600'
                  : isInstructorRole
                  ? 'text-amber-600'
                  : 'text-blue-600'
              }`}
            >
              {profile?.role === 'instructor'
                ? 'Instruktur'
                : profile?.role === 'super_admin'
                ? 'Super Admin'
                : profile?.role || 'Admin'}
            </p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" title="Online & Connected" />
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:flex shrink-0 min-h-screen">
        {sidebarContent}
      </div>

      {/* Mobile Drawer (Collapsible) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-64 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
