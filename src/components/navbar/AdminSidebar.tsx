'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  HelpCircle,
  FileCheck2,
  KeyRound,
  Users,
  LogOut,
  ArrowLeft,
  Ship,
  Sparkles,
} from 'lucide-react';
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
    <aside className="w-64 bg-white border-r border-slate-200/90 shadow-2xs flex flex-col justify-between p-4.5 shrink-0 min-h-screen select-none font-sans">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/admin/dashboard" className="flex items-center gap-3 px-2 pt-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#EA580C] p-0.5 shadow-md shadow-sky-500/15 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0B192C] rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-black text-slate-950 tracking-tight">
                Marlins<span className="text-[#0284C7]">Test</span>
              </span>
            </div>
            <p className="text-[10px] text-[#EA580C] font-extrabold uppercase tracking-wider">Admin Control Center</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
            Manajemen Sistem
          </p>
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
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

      {/* Footer Profile & Logout */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <Link
          href="/student/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0284C7] hover:bg-sky-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lihat Portal Siswa</span>
        </Link>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-black text-slate-950 truncate">{profile?.full_name || 'Administrator'}</p>
            <p className="text-[10px] text-[#0284C7] uppercase font-bold tracking-wider">{profile?.role || 'Admin'}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Online" />
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
