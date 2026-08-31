'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  TrendingUp,
  Radio,
  Compass,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications, ExtendedNotificationItem } from '@/lib/context/NotificationContext';
import { supabase } from '@/lib/supabase/client';
import StatusDetailModal from './StatusDetailModal';

// Default search items for 0ms instantaneous results
const DEFAULT_TESTS_DATA = [
  { id: '1', test_number: 1, test_name: 'Marlins Test 1 - Foundation & Basic Maritime English', category: 'Foundation / General', is_free: true, price: 0, description: 'Simulasi dasar Bahasa Inggris Maritim untuk seluruh kru & pelaut pemula.' },
  { id: '2', test_number: 2, test_name: 'Marlins Test 2 - Elementary Maritime Communication', category: 'F&B Service & Bar', is_free: false, price: 49000, description: 'Komunikasi maritim level dasar untuk kru perhotelan & kapal pesiar.' },
  { id: '3', test_number: 3, test_name: 'Marlins Test 3 - Pre-Intermediate Maritime English', category: 'F&B Service & Guest', is_free: false, price: 49000, description: 'Kecakapan dialog interaktif tamu & operasional kapal pesiar.' },
  { id: '4', test_number: 4, test_name: 'Marlins Test 4 - Intermediate Housekeeping & Public Area', category: 'Housekeeping & Laundry', is_free: false, price: 49000, description: 'Bahasa Inggris perhotelan spesialisasi departemen Housekeeping & Laundry.' },
  { id: '5', test_number: 5, test_name: 'Marlins Test 5 - Upper Intermediate Hospitality & Deck', category: 'Housekeeping & Deck', is_free: false, price: 49000, description: 'Terminologi hospitality kabin dan keselamatan navigasi geladak.' },
  { id: '6', test_number: 6, test_name: 'Marlins Test 6 - Advanced Maritime Culinary & Galley Operations', category: 'Culinary & Galley', is_free: false, price: 49000, description: 'Standar kuliner maritim, kitchen hygiene & operasional galley.' },
  { id: '7', test_number: 7, test_name: 'Marlins Test 7 - Beverage Service, Wine & Barista English', category: 'F&B Service & Bar', is_free: false, price: 49000, description: 'Kosakata pelayanan minuman, racikan wine, dan percakapan bar cruise.' },
  { id: '8', test_number: 8, test_name: 'Marlins Test 8 - Food Safety, Sanitation & Galley Terminology', category: 'Culinary & Safety', is_free: false, price: 49000, description: 'HACCP, sanitasi makanan, dan kepatuhan audit kebersihan kapal.' },
  { id: '9', test_number: 9, test_name: 'Marlins Test 9 - Cabin Steward & Guest Relations English', category: 'Housekeeping & Guest', is_free: false, price: 49000, description: 'Penanganan komplain tamu kabin, briefing keselamatan, dan perhotelan.' },
  { id: '10', test_number: 10, test_name: 'Marlins Test 10 - Comprehensive Maritime English Master', category: 'Comprehensive Master', is_free: false, price: 49000, description: 'Evaluasi komprehensif tingkat mahir seluruh departemen kapal.' },
];

const DEFAULT_ARTICLES_DATA = [
  { id: 'art-1', title: 'Standard Marine Communication Phrases (SMCP) Essentials', category: 'Radio Communication', summary: 'Panduan lengkap frasa komunikasi standar IMO untuk percakapan radio VHF.' },
  { id: 'art-2', title: 'Essential Maritime Vocabulary: Deck & Engine Terminology', category: 'Vocabulary', summary: 'Daftar istilah kunci kosakata maritim seputar peralatan geladak dan kamar mesin.' },
  { id: 'art-3', title: 'Mastering Prepositions and Directions at Sea', category: 'Grammar & Navigation', summary: 'Memahami preposisi arah navigasi kapal: Ahead, Astern, Port, Starboard.' },
  { id: 'art-4', title: 'Emergency Drill Commands and Life-Saving Appliances (LSA)', category: 'Safety & Emergency', summary: 'Perintah baku saat latihan darurat kapal: Fire Drill, Abandon Ship, MOB.' },
];

const QUICK_SHORTCUTS = [
  { title: 'Klaim Token Voucher', subtitle: 'Aktivasi akses paket ujian dengan voucher', href: '/student/redeem', icon: KeyRound, badge: 'Aktivasi' },
  { title: 'Katalog Paket Ujian (Test 1–10)', subtitle: 'Pilihan simulasi asesmen Marlins Test', href: '/student/tests', icon: FileCheck2, badge: 'Katalog' },
  { title: 'Sertifikat Resmi Saya', subtitle: 'Cek & unduh sertifikat berstandar STCW 2010', href: '/student/certificates', icon: Award, badge: 'Sertifikat' },
  { title: 'Riwayat Hasil & Evaluasi', subtitle: 'Lihat progres skor dan analisis kemampuan', href: '/student/history', icon: Clock, badge: 'Riwayat' },
  { title: 'Matriks Jenjang CEFR', subtitle: 'Panduan level kemahiran A1–C2 Maritim', href: '/student/level', icon: TrendingUp, badge: 'Level' },
  { title: 'Materi & Modul SMCP', subtitle: 'Kumpulan materi pembelajaran & referensi', href: '/student/articles', icon: BookOpen, badge: 'Materi' },
];

const POPULAR_SEARCH_TAGS = [
  'Marlins Test 1',
  'SMCP Radio',
  'F&B Service',
  'Housekeeping',
  'Emergency Drill',
  'Klaim Token',
  'Sertifikat Resmi',
];

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
  const router = useRouter();
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

  // Search state
  const [localQuery, setLocalQuery] = useState(searchValue || '');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [availableTests, setAvailableTests] = useState(DEFAULT_TESTS_DATA);
  const [availableArticles, setAvailableArticles] = useState(DEFAULT_ARTICLES_DATA);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'test' | 'cert_token' | 'system'>('all');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync search value if controlled prop changes
  useEffect(() => {
    if (searchValue !== undefined && searchValue !== localQuery) {
      setLocalQuery(searchValue);
    }
  }, [searchValue]);

  // Load latest tests & articles from Supabase in background
  useEffect(() => {
    async function fetchSearchDatasets() {
      try {
        const [testsRes, articlesRes] = await Promise.all([
          supabase
            .from('marlint_tests')
            .select('id, test_number, test_name, is_free, price, description')
            .eq('is_active', true)
            .order('test_number', { ascending: true }),
          supabase
            .from('articles')
            .select('id, title, category, summary')
            .eq('is_published', true)
            .order('created_at', { ascending: false }),
        ]);

        if (testsRes.data && testsRes.data.length > 0) {
          setAvailableTests(testsRes.data as any);
        }
        if (articlesRes.data && articlesRes.data.length > 0) {
          setAvailableArticles(articlesRes.data as any);
        }
      } catch (err) {
        console.error('Error prefetching search datasets:', err);
      }
    }

    fetchSearchDatasets();
  }, []);

  // Close menus on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setDropdownOpen(false);
        setNotifOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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

  // Live Search Filtering Logic
  const queryTrimmed = localQuery.trim().toLowerCase();

  const matchingTests = availableTests.filter((t) => {
    if (!queryTrimmed) return false;
    const name = (t.test_name || '').toLowerCase().replace(/marlint/g, 'marlins');
    const desc = (t.description || '').toLowerCase();
    const cat = (t.category || '').toLowerCase();
    const num = String(t.test_number);
    return name.includes(queryTrimmed) || desc.includes(queryTrimmed) || cat.includes(queryTrimmed) || num === queryTrimmed;
  });

  const matchingArticles = availableArticles.filter((a) => {
    if (!queryTrimmed) return false;
    const title = (a.title || '').toLowerCase();
    const summary = (a.summary || '').toLowerCase();
    const cat = (a.category || '').toLowerCase();
    return title.includes(queryTrimmed) || summary.includes(queryTrimmed) || cat.includes(queryTrimmed);
  });

  const matchingShortcuts = QUICK_SHORTCUTS.filter((s) => {
    if (!queryTrimmed) return false;
    const title = s.title.toLowerCase();
    const sub = s.subtitle.toLowerCase();
    return title.includes(queryTrimmed) || sub.includes(queryTrimmed);
  });

  const totalResultsCount = matchingTests.length + matchingArticles.length + matchingShortcuts.length;

  const handleInputChange = (val: string) => {
    setLocalQuery(val);
    if (onSearchChange) onSearchChange(val);
    setIsSearchOpen(true);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!localQuery.trim()) return;

    setIsSearchOpen(false);

    // If query looks like an article or matches only articles, navigate to articles
    if (matchingArticles.length > 0 && matchingTests.length === 0) {
      router.push(`/student/articles?search=${encodeURIComponent(localQuery.trim())}`);
    } else {
      router.push(`/student/tests?search=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    if (onSearchChange) onSearchChange('');
  };

  const handleSelectTag = (tag: string) => {
    setLocalQuery(tag);
    if (onSearchChange) onSearchChange(tag);
    setIsSearchOpen(true);
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
      <header className="flex items-center justify-between gap-2 sm:gap-4 py-1 select-none font-sans">
        {/* Left: Mobile menu toggle + Interactive Live Search Bar */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-1 max-w-2xl min-w-0" ref={searchRef}>
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shrink-0 cursor-pointer shadow-2xs active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <div className="relative w-full min-w-0">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              
              <input
                type="text"
                placeholder="Cari ujian / materi..."
                value={localQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-8 sm:pl-11 pr-8 sm:pr-10 py-1.5 sm:py-2.5 rounded-full bg-[#F4F6F9] border border-slate-200/70 text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20 transition-all shadow-inner"
              />

              {localQuery.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center transition-colors cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>

            {/* Live Interactive Search Results Popover */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 mt-2 w-full min-w-[300px] sm:min-w-[480px] max-w-[560px] bg-white rounded-2xl sm:rounded-[22px] shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
                
                {/* Search Header Info */}
                <div className="px-4 py-2.5 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-cyan-300" />
                    <span className="text-xs font-bold tracking-tight">
                      {queryTrimmed ? `Hasil Pencarian: "${localQuery}"` : 'Pencarian Cepat & Rekomendasi'}
                    </span>
                  </div>
                  {queryTrimmed && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-cyan-100 backdrop-blur-xs">
                      {totalResultsCount} Ditemukan
                    </span>
                  )}
                </div>

                {/* Popover Content Scroll Area */}
                <div className="max-h-[380px] sm:max-h-[420px] overflow-y-auto divide-y divide-slate-100 p-2">
                  
                  {/* Case 1: Empty Query - Show Recommended Tags & Quick Shortcuts */}
                  {!queryTrimmed && (
                    <div className="space-y-3.5 p-2">
                      {/* Popular Tags */}
                      <div>
                        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-1">
                          Paling Sering Dicari
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_SEARCH_TAGS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleSelectTag(tag)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-[#0284C7] hover:border-sky-200 border border-slate-200/60 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Search className="w-3 h-3 text-slate-400" />
                              <span>{tag}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Shortcuts */}
                      <div>
                        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-1">
                          Akses & Navigasi Cepat
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {QUICK_SHORTCUTS.slice(0, 4).map((s) => {
                            const IconComponent = s.icon;
                            return (
                              <Link
                                key={s.href}
                                href={s.href}
                                onClick={() => setIsSearchOpen(false)}
                                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-sky-50/70 border border-transparent hover:border-sky-200/70 transition-all group"
                              >
                                <div className="w-7 h-7 rounded-lg bg-sky-100 text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                                  <IconComponent className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-slate-800 group-hover:text-[#0284C7] truncate">
                                    {s.title}
                                  </p>
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {s.subtitle}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Case 2: Query has matches */}
                  {queryTrimmed && totalResultsCount > 0 && (
                    <div className="space-y-3 p-1">
                      {/* Matching Tests Group */}
                      {matchingTests.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between px-2 pt-1 pb-1">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <FileCheck2 className="w-3 h-3 text-[#0284C7]" />
                              <span>Paket Ujian Marlins ({matchingTests.length})</span>
                            </span>
                            <Link
                              href={`/student/tests?search=${encodeURIComponent(queryTrimmed)}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="text-[10px] font-bold text-[#0284C7] hover:underline"
                            >
                              Lihat Semua
                            </Link>
                          </div>

                          <div className="space-y-1">
                            {matchingTests.map((t) => {
                              const isTest1 = t.test_number === 1;
                              const testTitle = (t.test_name || `Marlins Test ${t.test_number}`).replace(/marlint/gi, 'Marlins');

                              return (
                                <Link
                                  key={t.id || t.test_number}
                                  href={`/student/test/${t.test_number}`}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-sky-50/70 border border-transparent hover:border-sky-200/80 transition-all group"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
                                      #{t.test_number}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] truncate">
                                        {testTitle}
                                      </p>
                                      <p className="text-[10px] text-slate-500 truncate">
                                        {t.category || t.description || 'Paket asesmen bahasa Inggris maritim'}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="shrink-0 flex items-center gap-2">
                                    {t.is_free || isTest1 ? (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                        Gratis
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/70">
                                        Rp 49.000
                                      </span>
                                    )}
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all" />
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Matching Articles Group */}
                      {matchingArticles.length > 0 && (
                        <div className="space-y-1 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between px-2 pt-1 pb-1">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <BookOpen className="w-3 h-3 text-indigo-600" />
                              <span>Materi & Modul Pembelajaran ({matchingArticles.length})</span>
                            </span>
                            <Link
                              href={`/student/articles?search=${encodeURIComponent(queryTrimmed)}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="text-[10px] font-bold text-[#0284C7] hover:underline"
                            >
                              Lihat Semua
                            </Link>
                          </div>

                          <div className="space-y-1">
                            {matchingArticles.map((a) => (
                              <Link
                                key={a.id}
                                href={`/student/articles`}
                                onClick={() => setIsSearchOpen(false)}
                                className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-sky-50/70 border border-transparent hover:border-sky-200/80 transition-all group"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] truncate">
                                      {a.title}
                                    </p>
                                    <p className="text-[10px] text-slate-500 truncate">
                                      {a.category} • {a.summary || 'Panduan bahasa Inggris maritim'}
                                    </p>
                                  </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matching Quick Shortcuts Group */}
                      {matchingShortcuts.length > 0 && (
                        <div className="space-y-1 pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Aksi & Fitur Cepat ({matchingShortcuts.length})</span>
                          </span>

                          <div className="space-y-1">
                            {matchingShortcuts.map((s) => {
                              const IconComponent = s.icon;
                              return (
                                <Link
                                  key={s.href}
                                  href={s.href}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-sky-50/70 border border-transparent hover:border-sky-200/80 transition-all group"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
                                      <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] truncate">
                                        {s.title}
                                      </p>
                                      <p className="text-[10px] text-slate-500 truncate">
                                        {s.subtitle}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-100 text-slate-600">
                                    {s.badge}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Case 3: Zero results */}
                  {queryTrimmed && totalResultsCount === 0 && (
                    <div className="py-8 px-4 text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Search className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Tidak ada hasil untuk &quot;{localQuery}&quot;
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Coba cari dengan kata kunci lain seperti &quot;Test 1&quot;, &quot;SMCP&quot;, &quot;Housekeeping&quot;, atau &quot;Token&quot;.
                        </p>
                      </div>
                      <div className="pt-1 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          Hapus Kata Kunci
                        </button>
                        <Link
                          href="/student/tests"
                          onClick={() => setIsSearchOpen(false)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] to-[#0369A1] shadow-xs hover:opacity-95 transition-opacity"
                        >
                          Buka Katalog Ujian
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Footer Action */}
                {queryTrimmed && (
                  <div className="p-2.5 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      Tekan <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[10px] shadow-2xs">Enter ↵</kbd> untuk hasil lengkap
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Cari di Katalog</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions, Token shortcut, Notification Center & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Token Voucher Shortcut Button (Ocean Blue Gradient) */}
          <Link
            href="/student/redeem"
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all duration-200 shadow-md shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-300" />
            <span>Klaim Token</span>
          </Link>

          {/* Learning Materials Button (Hidden on small mobile to save space) */}
          <Link
            href="/student/articles"
            className="hidden sm:flex w-9 h-9 rounded-full bg-white border border-slate-200/80 items-center justify-center text-slate-700 hover:text-[#0284C7] hover:bg-sky-50/80 hover:scale-105 active:scale-95 transition-all shadow-xs relative"
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
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-150 flex items-center justify-center relative cursor-pointer shadow-xs active:scale-95 ${
                notifOpen
                  ? 'bg-sky-50 border-[#0284C7] text-[#0284C7] ring-2 ring-sky-500/20'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:text-[#0284C7] hover:bg-sky-50/70 hover:scale-105'
              }`}
              title="Pusat Notifikasi"
              aria-label="Buka notifikasi"
            >
              <Bell className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${unreadCount > 0 ? 'text-[#0284C7]' : 'text-slate-600'}`} />
              
              {/* Dynamic Notification Badge with pulse effect */}
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-extrabold flex items-center justify-center px-0.5 shadow-sm ring-2 ring-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notifOpen && (
              <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2.5 w-auto sm:w-[420px] max-w-[calc(100vw-24px)] bg-white rounded-2xl sm:rounded-[26px] shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50 font-sans">
                
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
              className="flex items-center gap-2 p-0.5 sm:p-1 sm:pl-1.5 sm:pr-3.5 rounded-full bg-white hover:bg-sky-50/40 border border-slate-200/90 text-slate-800 transition-all duration-200 shadow-xs cursor-pointer hover:border-sky-300 hover:scale-[1.01]"
            >
              {/* Avatar with Vibrant Gradient Ring & Live Status Dot */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0284C7] via-[#0369A1] to-amber-500 p-0.5 shadow-xs">
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

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
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
