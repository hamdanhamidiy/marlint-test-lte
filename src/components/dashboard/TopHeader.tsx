'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Bell,
  ChevronDown,
  User,
  ShieldCheck,
  KeyRound,
  LogOut,
  Menu,
  Award,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

interface TopHeaderProps {
  onOpenMobileMenu?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export default function TopHeader({
  onOpenMobileMenu,
  searchValue = '',
  onSearchChange,
}: TopHeaderProps) {
  const { profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = profile?.full_name || 'Pelaut Indonesia';

  return (
    <header className="flex items-center justify-between gap-2.5 sm:gap-4 py-1 select-none">
      {/* Left: Mobile menu toggle + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-2xl min-w-0">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-full min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari ujian atau materi..."
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-full bg-[#F4F6F9] border border-slate-200/70 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right: Actions, Token shortcut & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Token Voucher Shortcut Button (Modern Blue-Indigo Gradient) */}
        <Link
          href="/student/redeem"
          className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-300" />
          <span>Klaim Token</span>
        </Link>

        {/* Learning Materials Button */}
        <Link
          href="/student/articles"
          className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 hover:scale-105 active:scale-95 transition-all shadow-xs relative"
          title="Materi SMCP"
        >
          <BookOpen className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </Link>

        {/* Notification Bell Button */}
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-amber-600 hover:bg-amber-50/70 hover:scale-105 active:scale-95 transition-all shadow-xs relative cursor-pointer"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
        </button>

        {/* User Profile Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 sm:pr-3.5 rounded-full bg-white hover:bg-blue-50/40 border border-slate-200/90 text-slate-800 transition-all duration-200 shadow-xs cursor-pointer hover:border-blue-300 hover:scale-[1.01]"
          >
            {/* Avatar with Vibrant Gradient Ring */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-xs">
              <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center text-xs font-bold text-slate-800 overflow-hidden">
                {profile?.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>👨‍✈️</span>
                )}
              </div>
            </div>

            <div className="text-left hidden sm:block">
              <p className="font-bold text-xs text-slate-900 max-w-[120px] truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] font-bold text-blue-600 leading-none mt-0.5">
                Level {profile?.level_code || 'A1'}
              </p>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl p-2 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-100 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[11px] text-[#5046E5] font-semibold truncate">
                  {profile?.job_title || 'Seafarer'} • {profile?.total_points || 0} XP
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                  {profile?.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/student/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-[#5046E5] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profil & Biodata Pelaut</span>
                </Link>
                <Link
                  href="/student/certificates"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-[#5046E5] transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sertifikat Resmi Saya</span>
                </Link>
                <Link
                  href="/student/redeem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-[#5046E5] transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Klaim Token Voucher</span>
                </Link>
                <Link
                  href="/verify"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-[#5046E5] transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verifikasi Keaslian Sertifikat</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#FF6464] hover:bg-rose-50/70 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
