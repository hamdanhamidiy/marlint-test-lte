'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Anchor,
  LayoutDashboard,
  FileCheck2,
  Award,
  TrendingUp,
  History,
  BookOpen,
  KeyRound,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export default function StudentNavbar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Ujian Marlins', href: '/student/tests', icon: FileCheck2 },
    { name: 'Sertifikat', href: '/student/certificates', icon: Award },
    { name: 'Level CEFR', href: '/student/level', icon: TrendingUp },
    { name: 'Riwayat', href: '/student/history', icon: History },
    { name: 'Materi', href: '/student/articles', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <Link href="/student/dashboard" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 via-blue-800 to-slate-900 flex items-center justify-center text-white shadow-xs">
            <Anchor className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-200" />
          </div>
          <div>
            <div className="flex items-center gap-1 leading-none">
              <span className="font-heading text-sm font-extrabold tracking-tight text-slate-900">
                MARLINS<span className="text-blue-600">TEST</span>
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-semibold tracking-tight uppercase">Maritime English</p>
          </div>
        </Link>

        {/* Center: Clean Segmented Pill Navigation */}
        <nav className="hidden lg:flex items-center bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/80">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/student/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Level Badge, and Profile Menu */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Token Redemption Button */}
          <Link
            href="/student/redeem"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <span>Klaim Token</span>
          </Link>

          {/* Level & Points Badge */}
          <div className="flex items-center bg-slate-900 text-white rounded-lg px-2.5 py-1 text-xs gap-2 font-mono shadow-xs">
            <span className="font-bold text-cyan-300">
              {profile?.level_code || 'A1'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-200 font-semibold">
              {profile?.total_points || 0} XP
            </span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all text-xs"
            >
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-700 to-slate-900 flex items-center justify-center font-bold text-[10px] text-white">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'P'}
              </div>
              <span className="font-semibold text-slate-800 max-w-[100px] truncate">
                {profile?.full_name?.split(' ')[0] || 'Pelaut'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl p-1.5 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-100 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{profile?.full_name}</p>
                  <p className="text-[11px] text-blue-700 font-semibold truncate">{profile?.job_title || 'Seafarer'}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{profile?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/student/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Data Profil Pelaut</span>
                  </Link>
                  <Link
                    href="/verify"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Verifikasi Sertifikat</span>
                  </Link>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-md">
          <div className="p-3 rounded-xl bg-slate-900 text-white mb-2">
            <p className="text-xs font-bold">{profile?.full_name}</p>
            <p className="text-[11px] text-cyan-300">{profile?.job_title || 'Seafarer'}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/15 text-white">
                Level {profile?.level_code || 'A1'}
              </span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {profile?.total_points || 0} XP
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive
                      ? 'bg-slate-100 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <Link
              href="/student/redeem"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>Klaim Token Ujian</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
