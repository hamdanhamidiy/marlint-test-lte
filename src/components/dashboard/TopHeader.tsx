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
  FileCheck2,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  Inbox,
  X,
  RotateCcw,
  RefreshCw,
  BellOff,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications, ExtendedNotificationItem } from '@/lib/context/NotificationContext';
import StatusDetailModal from './StatusDetailModal';

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
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refreshRealtimeNotifications,
    loading: notifLoading,
  } = useNotifications();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'test' | 'cert_token' | 'system'>('all');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = profile?.full_name || 'Pelaut Indonesia';
  const levelCode = (profile?.level_code || 'A1').toUpperCase();

  // Helper for human-readable relative timestamp
  const getRelativeTime = (dateStr: string) => {
    try {
      const now = Date.now();
      const diff = Math.max(0, now - new Date(dateStr).getTime());
      const mins = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (mins < 1) return 'Baru saja';
      if (mins < 60) return `${mins} mnt lalu`;
      if (hours < 24) return `${hours} jam lalu`;
      if (days === 1) return 'Kemarin';
      return `${days} hari lalu`;
    } catch {
      return 'Baru saja';
    }
  };

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'unread') return !n.is_read;
    if (notifFilter === 'test') return n.category === 'test' || n.type.includes('test');
    if (notifFilter === 'cert_token') return n.category === 'certificate' || n.category === 'token' || n.type.includes('cert');
    if (notifFilter === 'system') return n.category === 'system' || n.category === 'article' || n.type.includes('system');
    return true;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshRealtimeNotifications();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  // Render Category Icon with refined color styling
  const renderNotifIcon = (item: ExtendedNotificationItem) => {
    const category = item.category || 'system';

    switch (category) {
      case 'test':
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <FileCheck2 className="w-4 h-4" />
          </div>
        );
      case 'certificate':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Award className="w-4 h-4" />
          </div>
        );
      case 'token':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <KeyRound className="w-4 h-4" />
          </div>
        );
      case 'article':
        return (
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <BookOpen className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
          </div>
        );
    }
  };

  const getCategoryBadge = (item: ExtendedNotificationItem) => {
    const category = item.category || 'system';
    switch (category) {
      case 'test':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-sky-50 text-[#0284C7] border border-sky-200/60">Ujian</span>;
      case 'certificate':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">Sertifikat</span>;
      case 'token':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">Akses</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">Sistem</span>;
    }
  };

  return (
    <>
      <header className="flex items-center justify-between gap-2.5 sm:gap-4 py-1 select-none font-sans">
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

        {/* Right: Actions, Token shortcut, Notification Center & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Token Voucher Shortcut Button (Ocean Blue Gradient) */}
          <Link
            href="/student/redeem"
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all duration-200 shadow-md shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-300" />
            <span>Klaim Token</span>
          </Link>

          {/* Learning Materials Button */}
          <Link
            href="/student/articles"
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-[#0284C7] hover:bg-sky-50/80 hover:scale-105 active:scale-95 transition-all shadow-xs relative"
            title="Materi SMCP"
          >
            <BookOpen className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0284C7] ring-2 ring-white" />
          </Link>

          {/* Interactive Notification Bell Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className={`w-9 h-9 rounded-full border transition-all duration-150 flex items-center justify-center relative cursor-pointer shadow-xs active:scale-95 ${
                notifOpen
                  ? 'bg-sky-50 border-[#0284C7] text-[#0284C7] ring-2 ring-sky-500/20'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:text-[#0284C7] hover:bg-sky-50/70 hover:scale-105'
              }`}
              title="Pusat Notifikasi"
              aria-label="Buka notifikasi"
            >
              <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-[#0284C7]' : 'text-slate-600'}`} />
              
              {/* Dynamic Notification Badge with pulse effect */}
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center px-1 shadow-sm ring-2 ring-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-slate-300 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notifOpen && (
              <div className="absolute right-0 mt-2.5 w-[340px] sm:w-[420px] bg-white rounded-[26px] shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50 font-sans">
                
                {/* Header Row */}
                <div className="p-4 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-xs">
                      <Bell className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm tracking-tight text-white leading-none">
                        Pusat Notifikasi
                      </h3>
                      <p className="text-[10px] text-cyan-200/90 font-medium mt-0.5">
                        Aktivitas & Hasil Asesmen Maritim
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-[11px] font-bold bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg text-white inline-flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs shadow-2xs"
                        title="Tandai semua notifikasi telah dibaca"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-cyan-200" />
                        <span>Baca Semua</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="px-3 pt-2.5 pb-2 bg-[#F8FAFC] border-b border-slate-100 flex items-center gap-1 overflow-x-auto text-[11px] font-bold text-slate-500">
                  <button
                    type="button"
                    onClick={() => setNotifFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      notifFilter === 'all'
                        ? 'bg-white text-[#0284C7] shadow-2xs font-extrabold border border-slate-200/80'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Semua ({notifications.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifFilter('unread')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      notifFilter === 'unread'
                        ? 'bg-white text-[#0284C7] shadow-2xs font-extrabold border border-slate-200/80'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Belum Dibaca ({unreadCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifFilter('test')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      notifFilter === 'test'
                        ? 'bg-white text-[#0284C7] shadow-2xs font-extrabold border border-slate-200/80'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Ujian
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifFilter('cert_token')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      notifFilter === 'cert_token'
                        ? 'bg-white text-[#0284C7] shadow-2xs font-extrabold border border-slate-200/80'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Sertifikat & Akses
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifFilter('system')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      notifFilter === 'system'
                        ? 'bg-white text-[#0284C7] shadow-2xs font-extrabold border border-slate-200/80'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Sistem
                  </button>
                </div>

                {/* Notifications Scrollable List */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => !item.is_read && markAsRead(item.id)}
                        className={`p-3.5 sm:p-4 hover:bg-slate-50 transition-all flex items-start gap-3 group relative cursor-pointer ${
                          !item.is_read ? 'bg-sky-50/40 border-l-3 border-[#0284C7]' : 'bg-white'
                        }`}
                      >
                        {/* Icon */}
                        {renderNotifIcon(item)}

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {getCategoryBadge(item)}
                              <h4
                                className={`text-xs leading-snug truncate ${
                                  !item.is_read
                                    ? 'font-extrabold text-slate-950'
                                    : 'font-semibold text-slate-800'
                                }`}
                              >
                                {item.title}
                              </h4>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-300" />
                              {getRelativeTime(item.created_at)}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {item.body}
                          </p>

                          {/* Action Button & Dismiss Controls */}
                          <div className="pt-1.5 flex items-center justify-between">
                            {item.action_url ? (
                              <Link
                                href={item.action_url}
                                onClick={() => {
                                  markAsRead(item.id);
                                  setNotifOpen(false);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#0284C7] hover:text-[#0369A1] group/link"
                              >
                                <span>{item.action_label || 'Buka Rincian'}</span>
                                <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                              </Link>
                            ) : <span />}

                            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              {!item.is_read && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(item.id);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                  title="Tandai sudah dibaca"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(item.id);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Hapus notifikasi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Unread Indicator */}
                        {!item.is_read && (
                          <span className="w-2 h-2 rounded-full bg-[#0284C7] ring-2 ring-white shrink-0 mt-1 shadow-xs" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center space-y-2">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
                        <Inbox className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">Tidak ada notifikasi</p>
                      <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto leading-relaxed">
                        Hasil evaluasi ujian maritim dan sertifikat resmi Anda akan muncul di sini.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="p-2.5 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="text-slate-600 hover:text-[#0284C7] font-semibold inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white transition-all cursor-pointer border border-transparent hover:border-slate-200"
                    title="Muat data realtime terbaru dari database"
                  >
                    <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-[#0284C7]' : ''}`} />
                    <span>{refreshing ? 'Memperbarui...' : 'Segarkan Data'}</span>
                  </button>

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Bersihkan Semua</span>
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* User Profile Pill with Live Status Indicator */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 sm:pr-3.5 rounded-full bg-white hover:bg-sky-50/40 border border-slate-200/90 text-slate-800 transition-all duration-200 shadow-xs cursor-pointer hover:border-sky-300 hover:scale-[1.01]"
            >
              {/* Avatar with Vibrant Gradient Ring & Live Status Dot */}
              <div className="relative">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#0284C7] via-[#0369A1] to-amber-500 p-0.5 shadow-xs">
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
                {/* Micro green pulse dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="text-left hidden sm:block">
                <p className="font-bold text-xs text-slate-900 max-w-[120px] truncate leading-tight">
                  {displayName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[10px] font-extrabold text-[#0284C7] leading-none">
                    Level {levelCode}
                  </p>
                  <span className="text-slate-300 text-[10px]">•</span>
                  <span className="text-[9px] font-bold text-emerald-600 leading-none">
                    Aktif
                  </span>
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl p-2 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-100 z-50">
                <div className="px-3 py-2.5 border-b border-slate-100 bg-[#F8FAFC] rounded-xl mb-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold">
                      TERVERIFIKASI
                    </span>
                  </div>
                  <p className="text-[11px] text-[#0284C7] font-semibold truncate mt-0.5">
                    {profile?.job_title || 'Seafarer'} • {profile?.total_points || 320} XP
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                    {profile?.email}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setStatusModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-sky-50/80 hover:text-[#0284C7] transition-colors cursor-pointer text-left font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Status Kualifikasi STCW</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-[#0284C7]">
                      Level {levelCode}
                    </span>
                  </button>

                  <Link
                    href="/student/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-sky-50/80 hover:text-[#0284C7] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profil & Biodata Pelaut</span>
                  </Link>

                  <Link
                    href="/student/certificates"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-sky-50/80 hover:text-[#0284C7] transition-colors"
                  >
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sertifikat Resmi Saya</span>
                  </Link>

                  <Link
                    href="/student/redeem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-sky-50/80 hover:text-[#0284C7] transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    <span>Klaim Token Voucher</span>
                  </Link>

                  <Link
                    href="/verify"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-sky-50/80 hover:text-[#0284C7] transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Verifikasi Ijazah QR</span>
                  </Link>
                </div>

                <div className="p-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
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

      {/* Status Detail Modal Triggered from Header Profile */}
      <StatusDetailModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      />
    </>
  );
}
