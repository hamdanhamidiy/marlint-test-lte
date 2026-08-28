'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileCheck2,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Users,
  Layers,
  History,
  Check,
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

  const isStaffRole = isSuperAdmin || isInstructor || profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'instructor';

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

        // 1. Fetch from Supabase student_results table for THIS USER ONLY
        const isValidUuid = (str?: string | null): boolean =>
          !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

        const targetUuid = isValidUuid(activeId) ? activeId : null;

        if (targetUuid) {
          try {
            const { data: dbData } = await supabase
              .from('student_results')
              .select('*')
              .eq('student_id', targetUuid)
              .order('created_at', { ascending: false });

            if (dbData && dbData.length > 0) {
              resList = dbData.map((d: any) => normalizeHistoryItem(d, targetUuid));
            }
          } catch (err) {
            console.warn('Supabase load history note:', err);
          }
        }

        // Supabase is the SINGLE SOURCE OF TRUTH
        if (typeof window !== 'undefined' && activeId) {
          localStorage.setItem(`marlins_history_results_${activeId}`, JSON.stringify(resList));
        }

        // Sort descending by completion date
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
      const overallScore = item.overall_score !== undefined ? item.overall_score : item.score !== undefined ? item.score : 0;
      const totalScore = item.total_score !== undefined ? item.total_score : item.correct_answers !== undefined ? item.correct_answers : 0;
      const totalQ = item.total_questions || 60;
      const isPassed = item.is_passed !== undefined ? item.is_passed : overallScore >= (item.passing_grade || 70);
      const levelCode =
        item.level ||
        (overallScore >= 90 ? 'C2' : overallScore >= 80 ? 'C1' : overallScore >= 70 ? 'B2' : overallScore >= 55 ? 'B1+' : overallScore >= 40 ? 'B1' : 'A2');

      const rawName = item.test_name || `Marlins Test #${item.marlint_test_number || item.test_number || 1} – Cruise Hospitality & Maritime English`;
      const cleanName = rawName.replace(/Marlint/gi, 'Marlins');

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
        test_name: cleanName,
        marlint_test_number: item.test_number || item.marlint_test_number || 1,
        test_mode: item.test_mode || 'standard',
        points_earned: item.points_earned || 50,
      };
    }

    loadHistory();

    const activeId = user?.id || profile?.id;
    if (activeId) {
      const channel = supabase
        .channel(`history_realtime_${activeId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'student_results', filter: `student_id=eq.${activeId}` },
          () => {
            loadHistory();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, profile]);

  const totalSessions = results.length;
  const passedSessions = results.filter((r) => r.is_passed).length;
  const avgScore =
    totalSessions > 0
      ? Math.round(results.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalSessions)
      : 0;
  const passRate = totalSessions > 0 ? Math.round((passedSessions / totalSessions) * 100) : 0;

  const filteredResults = results.filter((r) => {
    if (activeFilter === 'passed') return r.is_passed;
    if (activeFilter === 'failed') return !r.is_passed;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16 min-w-0">
      
      {/* Staff Switch Banner */}
      {isStaffRole && (
        <div className="p-4 rounded-2xl bg-[#0B192C] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-extrabold block text-xs sm:text-sm">
                Akses sebagai {profile?.role === 'super_admin' ? 'Super Administrator' : 'Instruktur'}
              </span>
              <span className="text-slate-300 font-normal">
                Halaman ini menampilkan riwayat sesi ujian pribadi Anda.
              </span>
            </div>
          </div>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#0B192C] font-extrabold transition-all shrink-0 hover:bg-slate-100 shadow-2xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manajemen Seluruh Siswa &rarr;</span>
          </Link>
        </div>
      )}

      {/* Header Section with Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B192C] text-white text-[11px] font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rekam Jejak Evaluasi Resmi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Riwayat Ujian Marlins
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-2xl">
            Catatan rekapitulasi skor kompetensi, analisis sub-kategori, dan riwayat evaluasi Bahasa Inggris Perhotelan & Kapal Pesiar LTE Cruise.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Semua ({totalSessions})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('passed')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'passed'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Lulus ({passedSessions})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('failed')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'failed'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Remedial ({totalSessions - passedSessions})
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Total Sesi */}
        <div className="bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white p-4 sm:p-5 rounded-2xl shadow-md shadow-sky-500/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-200">
              Total Sesi
            </span>
            <span className="p-1.5 rounded-lg bg-white/10 text-white">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {totalSessions}
              </span>
              <span className="text-xs text-cyan-100 font-medium">sesi</span>
            </div>
            <p className="text-[11px] text-cyan-100/90 mt-0.5 font-medium">Sesi Ujian Selesai</p>
          </div>
        </div>

        {/* Card 2: Rata-Rata Skor */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Rata-Rata Skor
            </span>
            <span className="p-1.5 rounded-lg bg-sky-50 text-[#0284C7]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {avgScore}%
              </span>
              <span className="text-xs text-slate-400 font-medium">rata-rata</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Standar Kelulusan 70%</p>
          </div>
        </div>

        {/* Card 3: Tingkat Kelulusan */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Tingkat Kelulusan
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                {passRate}%
              </span>
              <span className="text-xs text-slate-400 font-medium">lulus</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-bold">
              {passedSessions} dari {totalSessions} Sesi Lulus
            </p>
          </div>
        </div>

        {/* Card 4: Poin Kemahiran */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Poin Kemahiran
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {profile?.total_points || (results.length > 0 ? results.reduce((acc, r) => acc + (r.points_earned || 50), 0) : 0)}
              </span>
              <span className="text-xs text-slate-400 font-medium">XP</span>
            </div>
            <p className="text-[11px] text-amber-700 mt-0.5 font-bold">
              Level {profile?.level_code || 'A1'} Operational
            </p>
          </div>
        </div>

      </div>

      {/* Test History Results List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="p-12 text-center bg-white border border-slate-200/90 rounded-2xl text-slate-400 text-xs shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
              <History className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-700">Memuat riwayat ujian...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200/90 rounded-2xl text-slate-500 text-xs shadow-xs space-y-3">
            <p className="text-sm font-semibold text-slate-800">
              Belum ada riwayat ujian pada kategori ini.
            </p>
            <Link
              href="/student/tests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-sky-500/20 active:scale-95"
            >
              <span>Mulai Ujian Kompetensi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          filteredResults.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              {/* Left Score Box & Details */}
              <div className="flex items-center gap-3.5 sm:gap-4.5 min-w-0">
                
                {/* Score Pill Card */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center border shadow-xs shrink-0 select-none ${
                    item.is_passed
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-700'
                      : 'bg-rose-50/60 border-rose-200 text-rose-600'
                  }`}
                >
                  <span className="text-base sm:text-lg font-black tracking-tight leading-none">
                    {item.score}%
                  </span>
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded-md ${
                      item.is_passed ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.is_passed ? 'LULUS' : 'REMED'}
                  </span>
                </div>

                {/* Test Information */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-[#0284C7] transition-colors truncate">
                      {item.test_name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                        item.is_passed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.is_passed ? 'Lulus' : 'Remedial'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-extrabold text-[10px] border border-slate-200">
                      Level {item.level || 'A1'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-slate-500 flex-wrap font-medium">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateIndo(item.created_at)}</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>
                      Jawaban Benar: <strong className="text-slate-900 font-bold">{item.correct_answers}/{item.total_questions}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDuration(item.time_spent_seconds || 1800)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 justify-end sm:justify-center shrink-0">
                <Link
                  href={`/student/test/review/${item.attempt_id}`}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Review Jawaban</span>
                </Link>

                <Link
                  href={`/student/test/result/${item.attempt_id}`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Analisis Nilai</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

