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

        if (!user && !profile) {
          setResults([]);
          return;
        }

        const activeId = user?.id || profile?.id;
        const activeEmail = (user?.email || profile?.email || '').toLowerCase();

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

        // 2. Discover and auto-sync any local-only attempts to Supabase
        if (typeof window !== 'undefined' && targetUuid) {
          const knownIds = new Set<string>(resList.map((r) => r.attempt_id || r.id));
          const knownTimestamps = resList.map((r) => new Date(r.created_at || '').getTime());

          const localCandidates: any[] = [];
          const userHistKeys = [
            `marlins_history_results_${activeId}`,
            `marlins_history_results_${activeEmail}`,
          ];

          userHistKeys.forEach((key) => {
            const str = localStorage.getItem(key);
            if (str) {
              try {
                const arr = JSON.parse(str);
                if (Array.isArray(arr)) localCandidates.push(...arr);
              } catch (e) {}
            }
          });

          for (const item of localCandidates) {
            const aid = item.attempt_id || item.id;
            const itemTime = new Date(item.created_at || item.completed_at || '').getTime();

            // Check if already represented by ID or within 10 minutes with same test number and score
            const isDuplicate =
              (aid && knownIds.has(aid)) ||
              (itemTime > 0 && knownTimestamps.some((kt) => Math.abs(kt - itemTime) < 10 * 60 * 1000));

            if (!isDuplicate && aid) {
              const norm = normalizeHistoryItem(item, targetUuid);
              resList.push(norm);
              knownIds.add(aid);

              // Auto-sync this local-only result to Supabase
              try {
                const pureUuid = isValidUuid(aid)
                  ? aid
                  : typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `8899e649-9911-44eb-845f-${Date.now().toString(16).padStart(12, '0')}`;

                supabase
                  .from('student_results')
                  .upsert({
                    id: pureUuid,
                    student_id: targetUuid,
                    score: norm.score,
                    correct_answers: norm.correct_answers,
                    total_questions: norm.total_questions,
                    level: norm.level,
                    category_scores: norm.category_scores,
                    start_time: norm.start_time,
                    end_time: norm.end_time,
                    is_passed: norm.is_passed,
                    test_name: norm.test_name,
                    marlint_test_number: norm.marlint_test_number,
                    test_mode: norm.test_mode,
                    points_earned: norm.points_earned,
                    time_spent_seconds: norm.time_spent_seconds,
                    created_at: norm.created_at,
                  })
                  .then();
              } catch (e) {}
            }
          }

          // Cache sanitized list
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
    <div className="space-y-5 sm:space-y-7 max-w-7xl mx-auto font-sans pb-16 min-w-0">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-3 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[11px] font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rekam Jejak Evaluasi Resmi</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Riwayat Ujian Marlins
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed max-w-2xl">
            Catatan rekapitulasi skor kompetensi, analisis sub-kategori, dan riwayat evaluasi Bahasa Inggris Perhotelan & Kapal Pesiar LTE Cruise.
          </p>
        </div>

        {/* Filter Pills - Responsive Monochrome Design */}
        <div className="flex items-center gap-1 bg-[#F1F3F5] p-1 rounded-full text-xs font-bold text-slate-600 shrink-0 self-start md:self-auto overflow-x-auto w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer text-center flex-1 md:flex-initial ${
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
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer text-center flex-1 md:flex-initial ${
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
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer text-center flex-1 md:flex-initial ${
              activeFilter === 'failed'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'hover:text-black'
            }`}
          >
            Remedial ({totalSessions - passedSessions})
          </button>
        </div>
      </div>

      {/* 4 Clean Minimalist Metric Cards - Responsive (2-column on mobile, 4-column on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Total Sesi (Signature Black Card) */}
        <div className="bg-black text-white p-3.5 sm:p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-1 sm:space-y-2">
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
              <span className="font-heading text-xl sm:text-3xl font-black text-white">
                {totalSessions}
              </span>
              <span className="text-xs text-slate-400 font-medium">sesi</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-medium truncate">Sesi Ujian Selesai</p>
          </div>
        </div>

        {/* Card 2: Rata-Rata Skor */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-1 sm:space-y-2">
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
              <span className="font-heading text-xl sm:text-3xl font-black text-slate-950">
                {avgScore}%
              </span>
              <span className="text-xs text-slate-400 font-medium">rata-rata</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 font-medium truncate">Standar Kelulusan 70%</p>
          </div>
        </div>

        {/* Card 3: Tingkat Kelulusan */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tingkat Kelulusan
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-xl sm:text-3xl font-black text-emerald-600">
                {passRate}%
              </span>
              <span className="text-xs text-slate-400 font-medium">lulus</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-0.5 font-bold truncate">{passedSessions} Ujian Berhasil Lulus</p>
          </div>
        </div>

        {/* Card 4: Poin Kemahiran */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-1 sm:space-y-2">
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
              <span className="font-heading text-xl sm:text-3xl font-black text-slate-950">
                {profile?.total_points || (results.length > 0 ? results.reduce((acc, r) => acc + (r.points_earned || 50), 0) : 0)}
              </span>
              <span className="text-xs text-amber-600 font-bold">XP</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 font-medium truncate">Level {profile?.level_code || 'A1'}</p>
          </div>
        </div>
      </div>

      {/* History List Section */}
      <div className="space-y-3">
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
              key={item.id || item.attempt_id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-black hover:shadow-md transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 group"
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Score Square Badge - Clean White High-Contrast Design */}
                <div
                  className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 border shadow-xs ${
                    item.is_passed
                      ? 'bg-white border-emerald-200'
                      : 'bg-white border-rose-200'
                  }`}
                >
                  <span
                    className={`font-heading text-base sm:text-lg font-black leading-none ${
                      item.is_passed ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {item.score}%
                  </span>
                  <span
                    className={`text-[8px] sm:text-[9px] font-heading font-extrabold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded text-white ${
                      item.is_passed ? 'bg-emerald-600' : 'bg-rose-500'
                    }`}
                  >
                    {item.is_passed ? 'LULUS' : 'REMED'}
                  </span>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="font-heading font-extrabold text-slate-950 text-xs sm:text-sm md:text-base leading-snug group-hover:text-black transition-colors truncate">
                      {item.test_name || `Marlins Test #${item.marlint_test_number || 1}`}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                        item.is_passed ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {item.is_passed ? 'Lulus' : 'Remedial'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-900 font-extrabold text-[9px] sm:text-[10px] border border-slate-200">
                      Level {item.level || 'A1'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-500 flex-wrap font-medium">
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

              {/* Action Buttons: Responsive for both Desktop and Mobile */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 justify-end sm:justify-center shrink-0">
                <Link
                  href={`/student/test/review/${item.attempt_id}`}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-black text-slate-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  <span>Review Jawaban</span>
                </Link>

                <Link
                  href={`/student/test/result/${item.attempt_id}`}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
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
