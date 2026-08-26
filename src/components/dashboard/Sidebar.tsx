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
    <aside className="w-full sm:w-60 bg-white flex flex-col justify-between p-4 sm:p-5 border-r border-slate-200/80 select-none h-full overflow-y-auto shrink-0 font-sans">
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
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1.5">
            Menu Utama
          </p>
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
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-md text-[8px] font-extrabold bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings & Logout */}
      <div className="space-y-1 pt-4 border-t border-slate-100">
        <p className="px-3 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">
          Pengaturan
        </p>
        <Link
          href="/student/redeem"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-colors"
        >
          <KeyRound className="w-4 h-4 text-slate-400" />
          <span>Aktivasi Token</span>
        </Link>
        <Link
          href="/student/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-colors"
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Profil Pelaut</span>
        </Link>
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            signOut();
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/80 transition-colors text-left cursor-pointer mt-1"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
