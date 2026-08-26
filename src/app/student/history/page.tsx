'use client';

import React, { useEffect, useState } from 'react';
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
  RotateCcw,
  Sparkles,
  Users,
  Eye,
  Check,
  Flame,
  Layers,
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
        const currentUserId = user?.id || profile?.id || 'a1c181cd-4d43-49b7-9814-d724ba27ea2e';

        // 1. Query Supabase
        if (user?.id) {
          try {
            const { data } = await supabase
              .from('student_results')
              .select('*')
              .eq('student_id', user.id)
              .order('created_at', { ascending: false });

            if (data && data.length > 0) {
              resList = [...(data as StudentResult[])];
            }
          } catch (err) {
            console.warn('Supabase load history error:', err);
          }
        }

        // 2. Scan LocalStorage for any test results on this browser & device
        if (typeof window !== 'undefined') {
          const foundAttempts = new Set<string>(resList.map((r) => r.attempt_id || r.id));

          // A. Check marlins_history_results
          const historyArrStr = localStorage.getItem('marlins_history_results');
          if (historyArrStr) {
            try {
              const arr = JSON.parse(historyArrStr);
              if (Array.isArray(arr)) {
                arr.forEach((item) => {
                  const aid = item.attempt_id || item.id;
                  if (aid && !foundAttempts.has(aid)) {
                    const norm = normalizeHistoryItem(item, currentUserId);
                    resList.push(norm);
                    foundAttempts.add(aid);
                  }
                });
              }
            } catch (e) {}
          }

          // B. Scan all individual localStorage keys (marlins_result_*, test_result_*, marlins_review_*)
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;

            if (key.startsWith('marlins_result_') || key.startsWith('test_result_')) {
              try {
                const item = JSON.parse(localStorage.getItem(key) || '');
                const aid = item.attempt_id || item.id || key.replace('marlins_result_', '').replace('test_result_', '');
                if (aid && !foundAttempts.has(aid)) {
                  const norm = normalizeHistoryItem({ ...item, attempt_id: aid }, currentUserId);
                  resList.push(norm);
                  foundAttempts.add(aid);
                }
              } catch (e) {}
            } else if (key.startsWith('marlins_review_')) {
              try {
                const reviewPayload = JSON.parse(localStorage.getItem(key) || '');
                const aid = reviewPayload.attempt_id || key.replace('marlins_review_', '');
                if (aid && !foundAttempts.has(aid)) {
                  const resData = reviewPayload.result || {
                    attempt_id: aid,
                    score: reviewPayload.score || 0,
                    test_name: reviewPayload.test_name,
                    test_number: reviewPayload.test_number,
                    created_at: reviewPayload.completed_at,
                  };
                  const norm = normalizeHistoryItem(resData, currentUserId);
                  resList.push(norm);
                  foundAttempts.add(aid);
                }
              } catch (e) {}
            }
          }

          // Backfill and sync localStorage with normalized array
          if (resList.length > 0) {
            try {
              localStorage.setItem('marlins_history_results', JSON.stringify(resList));
            } catch (e) {}
          }
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
        test_name: item.test_name || `Marlins Test #${item.marlint_test_number || item.test_number || 1} - Cruise Hospitality & Maritime English`,
        marlint_test_number: item.test_number || item.marlint_test_number || 1,
        test_mode: item.test_mode || 'standard',
        points_earned: item.points_earned || 50,
      };
    }

    loadHistory();
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
      {/* If Staff / Admin / Instructor is viewing, show switch banner */}
      {isStaffRole && (
        <div className="p-4 rounded-2xl bg-black text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-extrabold font-heading block text-[13px]">
                Masuk sebagai {profile?.role === 'super_admin' ? 'Super Administrator' : 'Instruktur'}
              </span>
              <span className="text-slate-300 font-medium">
                Halaman ini menampilkan riwayat sesi Anda pribadi. Untuk melihat seluruh siswa, buka Panel Manajemen Siswa.
              </span>
            </div>
          </div>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black font-extrabold transition-colors shrink-0 shadow-xs hover:bg-slate-100"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manajemen Seluruh Siswa &rarr;</span>
          </Link>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[11px] font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rekam Jejak Evaluasi Resmi</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Riwayat Ujian Marlins
          </h1>
          <p className="text-xs sm:text-[14px] text-slate-500 font-normal leading-relaxed max-w-2xl">
            Catatan rekapitulasi skor kompetensi, analisis sub-kategori, dan riwayat evaluasi Bahasa Inggris Perhotelan & Kapal Pesiar LTE Cruise.
          </p>
        </div>

        {/* Filter Pills - High Contrast Black Aesthetic */}
        <div className="flex items-center gap-1 bg-[#F1F3F5] p-1 rounded-full text-xs font-bold text-slate-600 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'hover:text-black'
            }`}
          >
            Semua ({totalSessions})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('passed')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeFilter === 'passed'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'hover:text-black'
            }`}
          >
            Lulus ({passedSessions})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('failed')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeFilter === 'failed'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'hover:text-black'
            }`}
          >
            Remedial ({totalSessions - passedSessions})
          </button>
        </div>
      </div>

      {/* 4 Clean Minimalist Metric Cards - Executive Monochrome Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Sesi (Pitch Black Hero Card) */}
        <div className="bg-black text-white p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Sesi
            </span>
            <span className="p-1.5 rounded-lg bg-white/10 text-white">
              <Layers className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-2xl sm:text-3xl font-black text-white">
                {totalSessions}
              </span>
              <span className="text-xs text-slate-400 font-medium">sesi</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Sesi Ujian Selesai</p>
          </div>
        </div>

        {/* Card 2: Rata-Rata Skor */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Rata-Rata Skor
            </span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
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
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tingkat Kelulusan
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-2xl sm:text-3xl font-black text-emerald-600">
                {passRate}%
              </span>
              <span className="text-xs text-slate-400 font-medium">lulus</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-bold">{passedSessions} Ujian Berhasil Lulus</p>
          </div>
        </div>

        {/* Card 4: Poin Kemahiran */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Poin Kemahiran
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
                {profile?.total_points || 0}
              </span>
              <span className="text-xs text-amber-600 font-bold">XP</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Level {profile?.level_code || 'A1'}</p>
          </div>
        </div>
      </div>

      {/* History List Section */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="p-12 text-center bg-white border border-slate-200/90 rounded-2xl text-slate-400 text-xs shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-black flex items-center justify-center mx-auto animate-pulse">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-800">Memuat riwayat ujian...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-black flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-slate-950">Belum Ada Riwayat Ujian</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Anda belum memiliki sesi ujian yang tercatat. Silakan mulai salah satu dari 10 Paket Ujian Marlins.
              </p>
            </div>
            <div>
              <Link
                href="/student/tests"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Mulai Ujian Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          filteredResults.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-black hover:shadow-md transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                {/* Score Square Badge with Outfit font */}
                <div
                  className={`w-13 h-13 rounded-2xl flex flex-col items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                    item.is_passed
                      ? 'bg-black text-white'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  <span className="font-heading text-base font-black leading-none">{item.score}%</span>
                  <span className="text-[9px] font-heading font-extrabold uppercase tracking-wider mt-1 opacity-80">
                    {item.is_passed ? 'LULUS' : 'REMED'}
                  </span>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-extrabold text-slate-950 text-sm sm:text-base leading-snug group-hover:text-black transition-colors truncate">
                      {item.test_name || `Marlins Test #${item.marlint_test_number || 1}`}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.is_passed ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {item.is_passed ? 'Lulus' : 'Remedial'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-900 font-extrabold text-[10px] border border-slate-200">
                      Level {item.level || 'A1'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateIndo(item.created_at)}</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>
                      Benar: <strong className="text-slate-900 font-bold">{item.correct_answers}/{item.total_questions}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDuration(item.time_spent_seconds || 1800)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Clean Monochrome */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  href={`/student/test/review/${item.attempt_id}`}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-black text-slate-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  <span>Review Jawaban</span>
                </Link>

                <Link
                  href={`/student/test/result/${item.attempt_id}`}
                  className="px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
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
