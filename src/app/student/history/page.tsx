'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  TrendingUp,
  FileCheck2,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  BarChart3,
  CheckCircle,
  HelpCircle,
  Compass,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
  Flame,
  Target,
  Trophy,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { StudentResult } from '@/lib/supabase/types';
import { formatDateIndo, formatDuration } from '@/lib/utils';

export default function StudentHistoryPage() {
  const { user, profile, isSuperAdmin, isInstructor } = useAuth();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const isStaffRole =
    isSuperAdmin ||
    isInstructor ||
    profile?.role === 'admin' ||
    profile?.role === 'super_admin' ||
    profile?.role === 'instructor';

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        let resList: StudentResult[] = [];

        if (!user && !profile) {
          setResults([]);
          return;
        }

        const activeId = user?.id || profile?.id;
        const activeEmail = (user?.email || profile?.email || '').toLowerCase();

        // 1. Fetch from Supabase student_results table using valid UUID ONLY
        try {
          const isValidUuid = (str?: string | null): boolean =>
            !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

          const targetUuid = isValidUuid(activeId) ? activeId : null;

          if (targetUuid) {
            const { data: dbData } = await supabase
              .from('student_results')
              .select('*')
              .eq('student_id', targetUuid)
              .order('created_at', { ascending: false });

            if (dbData && dbData.length > 0) {
              resList = dbData.map((d: any) => normalizeHistoryItem(d, targetUuid));
            }
          }
        } catch (err) {
          console.warn('Supabase load history note:', err);
        }

        // 2. Discover test results stored in browser localStorage strictly for THIS USER
        if (typeof window !== 'undefined' && (activeId || activeEmail)) {
          const foundAttempts = new Set<string>(resList.map((r) => r.attempt_id || r.id));

          const userHistKeys = [
            `marlins_history_results_${activeId}`,
            `marlins_history_results_${activeEmail}`,
          ];

          userHistKeys.forEach((key) => {
            const historyArrStr = localStorage.getItem(key);
            if (historyArrStr) {
              try {
                const arr = JSON.parse(historyArrStr);
                if (Array.isArray(arr)) {
                  arr.forEach((item) => {
                    const aid = item.attempt_id || item.id;
                    if (aid && !foundAttempts.has(aid)) {
                      const norm = normalizeHistoryItem(item, activeId || '');
                      resList.push(norm);
                      foundAttempts.add(aid);
                    }
                  });
                }
              } catch (e) {}
            }
          });

          // Scan individual localStorage keys for this student
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;

            if (key.startsWith('marlins_result_') || key.startsWith('test_result_')) {
              try {
                const item = JSON.parse(localStorage.getItem(key) || '');
                const belongsToActiveUser =
                  (item.student_id && (item.student_id === activeId || item.student_email === activeEmail)) ||
                  (item.student_email && item.student_email.toLowerCase() === activeEmail);

                if (belongsToActiveUser) {
                  const aid =
                    item.attempt_id || item.id || key.replace('marlins_result_', '').replace('test_result_', '');
                  if (aid && !foundAttempts.has(aid)) {
                    const norm = normalizeHistoryItem({ ...item, attempt_id: aid }, activeId || '');
                    resList.push(norm);
                    foundAttempts.add(aid);
                  }
                }
              } catch (e) {}
            }
          }

          if (activeId) {
            try {
              localStorage.setItem(`marlins_history_results_${activeId}`, JSON.stringify(resList));
            } catch (e) {}
          }
        }

        // Sort descending by completion date initially
        resList.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        setResults(resList);
      } catch (err) {
        console.error('Error loading history:', err);
      } finally {
        setLoading(false);
      }
    }

    function normalizeHistoryItem(item: any, currentUserId: string): StudentResult {
      const aid = item.attempt_id || item.id || `att-${Date.now()}`;
      const overallScore =
        item.overall_score !== undefined ? item.overall_score : item.score !== undefined ? item.score : 0;
      const totalScore =
        item.total_score !== undefined
          ? item.total_score
          : item.correct_answers !== undefined
          ? item.correct_answers
          : 0;
      const totalQ = item.total_questions || 60;
      const isPassed = item.is_passed !== undefined ? item.is_passed : overallScore >= (item.passing_grade || 70);
      const levelCode =
        item.level ||
        (overallScore >= 90
          ? 'C2'
          : overallScore >= 80
          ? 'C1'
          : overallScore >= 70
          ? 'B2'
          : overallScore >= 55
          ? 'B1+'
          : overallScore >= 40
          ? 'B1'
          : 'A2');

      return {
        id: item.id || `res-${aid}`,
        student_id: item.student_id || currentUserId,
        attempt_id: aid,
        score: overallScore,
        correct_answers: totalScore,
        total_questions: totalQ,
        level: levelCode,
        category_scores: Array.isArray(item.category_scores)
          ? Object.fromEntries(item.category_scores.map((cs: any) => [cs.category, { correct: cs.correct, total: cs.total }]))
          : item.category_scores || {},
        time_spent_seconds: item.time_spent_seconds || 1800,
        is_passed: isPassed,
        start_time: item.start_time || new Date().toISOString(),
        end_time: item.end_time || new Date().toISOString(),
        created_at: item.completed_at || item.created_at || new Date().toISOString(),
        test_name:
          item.test_name ||
          `Marlins Test #${item.marlint_test_number || item.test_number || 1} - Cruise Hospitality & Maritime English`,
        marlint_test_number: item.test_number || item.marlint_test_number || 1,
        test_mode: item.test_mode || 'standard',
        points_earned: item.points_earned || 50,
      };
    }

    loadHistory();
  }, [user, profile]);

  const totalSessions = results.length;
  const passedSessions = results.filter((r) => r.is_passed).length;
  const failedSessions = totalSessions - passedSessions;
  const avgScore =
    totalSessions > 0 ? Math.round(results.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalSessions) : 0;
  const passRate = totalSessions > 0 ? Math.round((passedSessions / totalSessions) * 100) : 0;
  const highestScore = totalSessions > 0 ? Math.max(...results.map((r) => r.score || 0)) : 0;

  const totalXp = useMemo(() => {
    if (profile?.total_points && profile.total_points > 0) return profile.total_points;
    return results.reduce((acc, r) => acc + (r.points_earned || 50), 0);
  }, [profile, results]);

  // Filtered and Sorted Results
  const filteredAndSortedResults = useMemo(() => {
    let list = results.filter((r) => {
      if (activeFilter === 'passed') return r.is_passed;
      if (activeFilter === 'failed') return !r.is_passed;
      return true;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.test_name?.toLowerCase().includes(q) ||
          `marlins test ${r.marlint_test_number}`.includes(q) ||
          r.level?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'highest') {
      list.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => (a.score || 0) - (b.score || 0));
    } else {
      list.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
    }

    return list;
  }, [results, activeFilter, searchQuery, sortBy]);

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto font-sans pb-20 min-w-0">
      {/* Staff Switch Banner if viewing in student mode */}
      {isStaffRole && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-[13px] tracking-wide text-white block">
                Mode Siswa: {profile?.role === 'super_admin' ? 'Super Administrator' : 'Instruktur'}
              </span>
              <span className="text-slate-400 font-normal">
                Menampilkan riwayat ujian personal Anda. Untuk mengelola nilai seluruh siswa, beralih ke panel admin.
              </span>
            </div>
          </div>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold transition-all shrink-0 shadow-sm"
          >
            <Users className="w-3.5 h-3.5 text-slate-700" />
            <span>Manajemen Seluruh Siswa &rarr;</span>
          </Link>
        </div>
      )}

      {/* Hero Header & Identity Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#0d1527] to-slate-950 p-6 sm:p-8 text-white border border-slate-800/80 shadow-xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Rekam Evaluasi Resmi • LTE Cruise Maritime English</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Riwayat Nilai & Evaluasi Ujian
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Pantau rekapitulasi skor kompetensi standar ISF Marlins, analisis akurasi sub-kategori maritime English, dan perkembangan sertifikasi kelulusan Anda.
            </p>
          </div>

          {/* Quick User Badge & Call to Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-md overflow-hidden shrink-0 border border-white/20">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  (profile?.full_name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-white leading-tight">{profile?.full_name || 'Siswa Marlins'}</p>
                <p className="text-[11px] text-slate-400 font-medium">{profile?.job_title || 'F&B Service / Waiter'}</p>
              </div>
              <div className="ml-2 pl-3 border-l border-white/10 text-right">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">CEFR</span>
                <span className="text-xs font-black text-emerald-400">Level {profile?.level_code || 'A1'}</span>
              </div>
            </div>

            <Link
              href="/student/tests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Mulai Ujian Baru</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Sesi */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white p-4 sm:p-5 border border-slate-800/90 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Sesi Ujian</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">{totalSessions}</span>
              <span className="text-xs text-slate-400 font-medium">kali dikerjakan</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>{passedSessions} Lulus • {failedSessions} Remedial</span>
            </p>
          </div>
        </div>

        {/* Card 2: Rata-Rata Skor */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Rata-Rata Skor</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{avgScore}%</span>
              <span className="text-xs text-slate-400 font-medium">rata-rata</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    avgScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, avgScore)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Standar kelulusan institusi: 70%</p>
            </div>
          </div>
        </div>

        {/* Card 3: Tingkat Kelulusan */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tingkat Kelulusan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl sm:text-3xl font-black tracking-tight ${passRate >= 70 ? 'text-emerald-600' : 'text-slate-950'}`}>
                {passRate}%
              </span>
              <span className="text-xs text-slate-400 font-medium">lolos seleksi</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${passedSessions > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <strong className="text-slate-800 font-bold">{passedSessions}</strong> dari {totalSessions} sesi lulus
            </p>
          </div>
        </div>

        {/* Card 4: Poin Kemahiran & Rekor */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Poin Kemahiran</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{totalXp}</span>
              <span className="text-xs text-amber-600 font-black">XP</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span>Skor Terbaik: <strong className="text-slate-900 font-bold">{highestScore}%</strong></span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter, Search & Sort Control Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl text-xs font-bold text-slate-600 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-slate-950 text-white shadow-xs font-extrabold'
                : 'hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            Semua ({totalSessions})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('passed')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'passed'
                ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                : 'hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeFilter === 'passed' ? 'bg-white' : 'bg-emerald-500'}`} />
            <span>Lulus ({passedSessions})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('failed')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'failed'
                ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                : 'hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeFilter === 'failed' ? 'bg-white' : 'bg-rose-500'}`} />
            <span>Remedial ({failedSessions})</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5 flex-1 md:justify-end">
          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tes atau paket..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
            />
          </div>

          {/* Sort Select */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="newest">Waktu: Terbaru</option>
              <option value="highest">Skor: Tertinggi</option>
              <option value="lowest">Skor: Terendah</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto animate-spin">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-bold text-slate-800 text-sm">Memuat riwayat ujian resmi...</p>
            <p className="text-xs text-slate-400">Sinkronisasi data rekapitulasi nilai dengan database</p>
          </div>
        ) : filteredAndSortedResults.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-xs max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-50 text-slate-500 border border-slate-200 flex items-center justify-center mx-auto shadow-inner">
              <Compass className="w-7 h-7 text-slate-600" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-950">
                {searchQuery ? 'Tidak Ditemukan Riwayat yang Sesuai' : 'Belum Ada Riwayat Ujian'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {searchQuery
                  ? 'Coba ganti kata kunci pencarian Anda atau reset filter status.'
                  : 'Anda belum menyelesaikan simulasi ujian Marlins. Mulai uji kemampuan bahasa Inggris maritim Anda sekarang!'}
              </p>
            </div>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
              >
                Reset Pencarian
              </button>
            ) : (
              <Link
                href="/student/tests"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-black text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Lihat 10 Paket Ujian Marlins</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ) : (
          filteredAndSortedResults.map((item, idx) => {
            const isExpanded = expandedCardId === (item.id || item.attempt_id);
            const percentage = item.score || 0;
            const hasCategoryScores =
              item.category_scores && Object.keys(item.category_scores).length > 0;

            return (
              <div
                key={item.id || item.attempt_id || idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden group"
              >
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Side: Score Badge & Test Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Score Badge */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 border transition-transform group-hover:scale-105 shadow-xs ${
                        item.is_passed
                          ? 'bg-gradient-to-b from-emerald-950 to-slate-950 text-white border-emerald-500/30'
                          : 'bg-gradient-to-b from-slate-900 to-slate-950 text-white border-slate-800'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-black tracking-tight leading-none">
                        {percentage}%
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded-md ${
                          item.is_passed
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {item.is_passed ? 'LULUS' : 'REMEDIAL'}
                      </span>
                    </div>

                    {/* Test Info */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider border border-blue-100">
                          Marlins #{item.marlint_test_number || 1}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                            item.is_passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.is_passed ? 'Memenuhi Standar' : 'Perlu Remedial'}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[10px] border border-slate-200">
                          CEFR {item.level || 'A2'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-950 text-sm sm:text-base leading-snug truncate">
                        {item.test_name || `Marlins Test #${item.marlint_test_number || 1}`}
                      </h3>

                      {/* Metadata row */}
                      <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-500 flex-wrap font-medium pt-0.5">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDateIndo(item.created_at)}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>
                            Benar: <strong className="text-slate-900 font-bold">{item.correct_answers}</strong>/{item.total_questions} soal
                          </span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDuration(item.time_spent_seconds || 1800)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Action Buttons & Expand Toggle */}
                  <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-0 border-slate-100 justify-end shrink-0 flex-wrap sm:flex-nowrap">
                    {hasCategoryScores && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id || item.attempt_id || '')}
                        className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Lihat rincian kategori kemampuan"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Rincian</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <Link
                      href={`/student/test/review/${item.attempt_id || item.id}`}
                      className="px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>Review Soal</span>
                    </Link>

                    <Link
                      href={`/student/test/result/${item.attempt_id || item.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Analisis Rapor</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    </Link>
                  </div>
                </div>

                {/* Expandable Category Breakdown Drawer */}
                {isExpanded && hasCategoryScores && (
                  <div className="bg-slate-50/90 border-t border-slate-100 p-4 sm:p-5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span>Analisis Akurasi Sub-Kategori Ujian</span>
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">Standar ISF Marlins Maritime</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {Object.entries(item.category_scores).map(([catKey, catVal]: [string, any]) => {
                        const total = catVal.total || 0;
                        const correct = catVal.correct || 0;
                        const catPercent = total > 0 ? Math.round((correct / total) * 100) : 0;
                        const catPassed = catPercent >= 70;

                        return (
                          <div
                            key={catKey}
                            className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-700 capitalize truncate">
                                {catKey.replace(/_/g, ' ')}
                              </span>
                              <span
                                className={`text-[10px] font-black ${
                                  catPassed ? 'text-emerald-600' : 'text-amber-600'
                                }`}
                              >
                                {catPercent}%
                              </span>
                            </div>

                            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  catPassed ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, catPercent)}%` }}
                              />
                            </div>

                            <p className="text-[10px] text-slate-400 font-medium">
                              {correct}/{total} Benar
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
