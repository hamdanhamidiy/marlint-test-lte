'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileCheck2,
  Award,
  TrendingUp,
  History,
  BookOpen,
  KeyRound,
  User,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { useAuth } from '@/lib/context/AuthContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const mainNav = [
    {
      name: 'Dashboard',
      href: '/student/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Paket Ujian',
      href: '/student/tests',
      icon: FileCheck2,
    },
    {
      name: 'Sertifikat Resmi',
      href: '/student/certificates',
      icon: Award,
    },
    {
      name: 'Jenjang CEFR',
      href: '/student/level',
      icon: TrendingUp,
    },
    {
      name: 'Riwayat Nilai',
      href: '/student/history',
      icon: History,
    },
    {
      name: 'Materi SMCP',
      href: '/student/articles',
      icon: BookOpen,
      badge: 'Baru',
    },
  ];

  return (
    <aside className="w-full sm:w-64 bg-white/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-5 border-r border-slate-200/80 select-none h-full overflow-y-auto shrink-0 font-sans shadow-xs">
      <div className="space-y-6">
        {/* Brand Logo & Mobile Close Button */}
        <div className="flex items-center justify-between px-1 pt-1 pb-1">
          <Logo size="md" showSubtitle={true} subtitleText="LTE Cruise Training Center" href="/student/dashboard" />
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
              Menu Utama
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]/40" />
          </div>

          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/student/dashboard'
                  ? pathname === '/student/dashboard'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-out active:scale-[0.98] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white shadow-md shadow-sky-500/25 translate-x-1'
                      : 'text-slate-600 hover:text-[#0284C7] hover:bg-sky-50/90 hover:translate-x-1.5 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-all duration-300 ${
                        isActive
                          ? 'text-cyan-200'
                          : 'text-slate-400 group-hover:text-[#0284C7] group-hover:scale-110'
                      }`}
                    />
                    <span className="tracking-tight">{item.name}</span>
                  </div>

                  {/* Active glowing indicator or badge */}
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-xs shadow-cyan-300/80 animate-pulse" />
                  ) : item.badge ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs group-hover:scale-105 transition-transform duration-300">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings & Logout */}
      <div className="space-y-1.5 pt-4 border-t border-slate-100">
        <div className="px-3 mb-1">
          <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
            Pengaturan
          </span>
        </div>

        <Link
          href="/student/redeem"
          onClick={onCloseMobile}
          className="group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:text-amber-600 hover:bg-amber-50/80 hover:translate-x-1.5 hover:shadow-xs transition-all duration-300 ease-out"
        >
          <KeyRound className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:scale-110 transition-all duration-300" />
          <span>Aktivasi Token</span>
        </Link>

        <Link
          href="/student/profile"
          onClick={onCloseMobile}
          className="group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:text-[#0284C7] hover:bg-sky-50/90 hover:translate-x-1.5 hover:shadow-xs transition-all duration-300 ease-out"
        >
          <User className="w-4 h-4 text-slate-400 group-hover:text-[#0284C7] group-hover:scale-110 transition-all duration-300" />
          <span>Profil Pelaut</span>
        </Link>

        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            signOut();
          }}
          className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:translate-x-1.5 transition-all duration-300 ease-out text-left cursor-pointer mt-1"
        >
          <LogOut className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
