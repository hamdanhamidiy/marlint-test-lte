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
  LogOut,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { useAuth } from '@/lib/context/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bank Soal', href: '/admin/questions', icon: HelpCircle },
    { name: 'Kelola Ujian', href: '/admin/tests', icon: FileCheck2 },
    { name: 'Token Akses', href: '/admin/tokens', icon: KeyRound },
    { name: 'Data Siswa', href: '/admin/students', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 shadow-2xs flex flex-col justify-between p-5 shrink-0 min-h-screen select-none font-sans">
      <div className="space-y-6">
        {/* Brand Logo with Official ADMIN Badge */}
        <div className="px-2 pt-1 pb-1">
          <Logo
            size="md"
            showBadge={true}
            badgeText="ADMIN"
            showSubtitle={true}
            subtitleText="Control Center"
            href="/admin/dashboard"
          />
        </div>

        {/* Section: MANAJEMEN SISTEM */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-2">
            Manajemen Sistem
          </p>
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0284C7]' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
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
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0284C7] hover:bg-sky-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lihat Portal Siswa</span>
        </Link>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2 shadow-2xs">
          <div className="min-w-0">
            <p className="text-xs font-black text-slate-950 truncate">{profile?.full_name || 'Administrator'}</p>
            <p className="text-[10px] text-[#EA580C] uppercase font-black tracking-wider">{profile?.role || 'Admin'}</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" title="Online & Connected" />
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
