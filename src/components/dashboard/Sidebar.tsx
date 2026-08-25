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
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { useAuth } from '@/lib/context/AuthContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

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
    <aside className="w-full sm:w-64 bg-white flex flex-col justify-between p-5 border-r border-slate-100 select-none h-full overflow-y-auto shrink-0">
      <div className="space-y-6">
        {/* Logo at Top + Mobile Close Button */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <Logo size="md" showSubtitle={true} subtitleText="Maritime English Platform" href="/student/dashboard" />
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Section: MAIN NAVIGATION */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
            Menu Utama
          </p>
          <nav className="space-y-1.5">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-full text-[13px] transition-all duration-150 ${
                    isActive
                      ? 'bg-black text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs ${
                      isActive ? 'bg-neutral-800 text-white' : 'bg-black text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Section: SETTINGS & ACTIONS */}
      <div className="space-y-1.5 pt-4 border-t border-slate-100">
        <p className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
          Pengaturan
        </p>
        <Link
          href="/student/redeem"
          onClick={onCloseMobile}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-full text-[13px] font-medium text-slate-600 hover:text-black hover:bg-slate-100 transition-colors"
        >
          <KeyRound className="w-4 h-4 text-slate-500" />
          <span>Aktivasi Token</span>
        </Link>
        <Link
          href="/student/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-full text-[13px] font-medium text-slate-600 hover:text-black hover:bg-slate-100 transition-colors"
        >
          <User className="w-4 h-4 text-slate-500" />
          <span>Profil Pelaut</span>
        </Link>
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            signOut();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
