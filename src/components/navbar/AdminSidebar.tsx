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
    <aside className="w-64 bg-white border-r border-slate-200/90 shadow-sm flex flex-col justify-between p-4 shrink-0 min-h-screen">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/admin/dashboard" className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-700 p-0.5 shadow-md shadow-purple-500/15">
            <div className="w-full h-full bg-[#0A2540] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <span className="font-heading text-lg font-black text-slate-900">
              MARLINS<span className="text-purple-600">ADMIN</span>
            </span>
            <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">Control Center</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-800 border border-purple-200 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
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
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lihat Portal Siswa</span>
        </Link>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-bold text-slate-900 truncate">{profile?.full_name || 'Administrator'}</p>
          <p className="text-[10px] text-purple-700 uppercase font-bold">{profile?.role || 'Admin'}</p>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
