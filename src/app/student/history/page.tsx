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
  Ship,
  Shield,
  Users,
  Eye,
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
      if (!user) return;
      try {
        setLoading(true);

        // Load results strictly belonging to the logged-in student user.id
        const { data, error } = await supabase
          .from('student_results')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        let resList: StudentResult[] = [];
        if (data && data.length > 0) {
          resList = [...(data as StudentResult[])];
        }

        if (typeof window !== 'undefined') {
          // Check localStorage results ONLY if they strictly belong to this user.id
          const historyArrStr = localStorage.getItem('marlins_history_results');
          if (historyArrStr) {
            try {
              const arr = JSON.parse(historyArrStr);
              if (Array.isArray(arr)) {
                arr.forEach((item) => {
                  const aid = item.attempt_id || item.id;
                  // Only add if student_id strictly matches this user's id
                  if (item.student_id === user.id && aid && !resList.some((r) => r.attempt_id === aid || r.id === aid)) {
                    resList.push(normalizeHistoryItem(item, user.id));
                  }
                });
              }
            } catch (e) {}
          }

          // Scan single result keys only if matching user.id
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('marlins_result_') || key.startsWith('test_result_'))) {
              try {
                const item = JSON.parse(localStorage.getItem(key) || '');
                const aid = item.attempt_id || item.id;
                if (item.student_id === user.id && aid && !resList.some((r) => r.attempt_id === aid || r.id === aid)) {
                  resList.push(normalizeHistoryItem(item, user.id));
                }
              } catch (e) {}
            }
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
      const overallScore = item.overall_score !== undefined ? item.overall_score : item.score || 0;
      const totalScore = item.total_score !== undefined ? item.total_score : item.correct_answers || 0;
      const totalQ = item.total_questions || 60;
      const isPassed = item.is_passed !== undefined ? item.is_passed : overallScore >= (item.passing_grade || 70);
      const levelCode =
        item.level ||
        (overallScore >= 90 ? 'C2' : overallScore >= 80 ? 'C1' : overallScore >= 70 ? 'B2' : overallScore >= 55 ? 'B1+' : 'B1');

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
        test_name: item.test_name || 'Marlins Test 1 - Basic Maritime English',
        marlint_test_number: item.test_number || item.marlint_test_number || 1,
        test_mode: item.test_mode || 'standard',
        points_earned: item.points_earned || 50,
      };
    }

    loadHistory();
  }, [user]);

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
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* If Staff / Admin / Instructor is viewing, show helpful switch banner */}
      {isStaffRole && (
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-sky-900">
            <Shield className="w-5 h-5 text-[#0284C7] shrink-0" />
            <div>
              <span className="font-bold block">Masuk sebagai {profile?.role === 'super_admin' ? 'Super Administrator' : 'Instruktur'}</span>
              <span className="text-sky-700">Halaman ini menampilkan riwayat evaluasi Anda pribadi. Untuk melihat seluruh siswa, buka Panel Manajemen Siswa.</span>
            </div>
          </div>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold transition-colors shrink-0 shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manajemen Seluruh Siswa &rarr;</span>
          </Link>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
            <span className="font-bold text-slate-900">Rekam Jejak Resmi</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">Standar IMO STCW</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Riwayat Ujian Marlins Saya
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 max-w-2xl leading-relaxed">
            Catatan rekapitulasi skor kompetensi, analisis sub-kategori, dan riwayat evaluasi Bahasa Inggris Maritim Anda.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#F1F3F5] p-1.5 rounded-full border border-slate-200/70 shadow-2xs self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/70'
            }`}
          >
            Semua ({totalSessions})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('passed')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'passed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/70'
            }`}
          >
            Lulus ({passedSessions})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('failed')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'failed'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/70'
            }`}
          >
            Remedial ({totalSessions - passedSessions})
          </button>
        </div>
      </div>

      {/* 4 Clean Minimalist Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Sesi */}
        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Sesi
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalSessions}
            </span>
            <span className="text-xs text-slate-400 font-medium">sesi</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-normal">Sesi Ujian Resmi</p>
        </div>

        {/* Card 2: Rata-Rata Skor */}
        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Rata-Rata Skor
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0284C7]">
              {avgScore}%
            </span>
            <span className="text-xs text-slate-400 font-medium">rata-rata</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-normal">Standar Passing 70%</p>
        </div>

        {/* Card 3: Tingkat Kelulusan */}
        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Tingkat Kelulusan
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {passRate}%
            </span>
            <span className="text-xs text-slate-400 font-medium">lulus</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-normal">{passedSessions} Tes Berhasil Lulus</p>
        </div>

        {/* Card 4: Poin Kemahiran */}
        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Poin Kemahiran
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#EA580C]">
              {profile?.total_points || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">XP</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-normal">Standar Level {profile?.level_code || 'B1+'}</p>
        </div>
      </div>

      {/* History List Section */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-400 text-xs shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-700">Memuat riwayat ujian...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 sm:p-12 text-center space-y-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#EA580C] border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading text-lg font-bold text-slate-900">Belum Ada Riwayat Ujian</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
                Anda belum memiliki sesi ujian yang tercatat. Silakan mulai salah satu dari 10 Paket Ujian Marlins.
              </p>
            </div>
            <div>
              <Link
                href="/student/tests"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
              className="bg-white p-5 sm:p-6 rounded-[26px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Score Square Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold font-mono text-sm shrink-0 shadow-2xs ${
                    item.is_passed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <span className="text-base font-extrabold">{item.score}%</span>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider -mt-0.5">
                    {item.is_passed ? 'Lulus' : 'Remed'}
                  </span>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#0284C7] transition-colors truncate">
                      {item.test_name || `Marlins Test ${item.marlint_test_number || 1}`}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.is_passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.is_passed ? 'Lulus' : 'Remedial'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0369A1] font-bold text-[10px] border border-sky-200/80">
                      Level {item.level || 'B1+'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateIndo(item.created_at)}</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Benar: <strong className="text-slate-800 font-bold">{item.correct_answers}/{item.total_questions}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDuration(item.time_spent_seconds || 1800)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  href={`/student/test/review/${item.attempt_id}`}
                  className="px-4 py-2 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-[#0284C7] text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#0284C7]" />
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
