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
        test_name: item.test_name || 'Marlins Test 1 - Cruise Hospitality & Maritime English',
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
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-indigo-900">
            <Shield className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <span className="font-bold block">Anda sedang masuk sebagai {profile?.role === 'super_admin' ? 'Super Administrator' : 'Instruktur'}</span>
              <span className="text-indigo-700">Halaman ini hanya menampilkan rekam jejak ujian Anda pribadi. Untuk memantau seluruh nilai siswa, buka Panel Manajemen Siswa.</span>
            </div>
          </div>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shrink-0 shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Lihat Nilai Seluruh Siswa →</span>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
            <span className="font-bold text-slate-900">Rekam Jejak Resmi</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">Standar IMO STCW</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Riwayat Ujian Marlins Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            Catatan rekapitulasi skor kompetensi, analisis sub-kategori, dan hasil evaluasi Bahasa Inggris Maritim Anda.
          </p>
        </div>

        {/* Filter Pills - Antigravity Style */}
        <div className="flex items-center gap-1.5 bg-[#F1F3F5] p-1 rounded-full border border-slate-200/60 shadow-2xs self-start md:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/60'
            }`}
          >
            Semua ({totalSessions})
          </button>
          <button
            onClick={() => setActiveFilter('passed')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'passed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/60'
            }`}
          >
            Lulus ({passedSessions})
          </button>
          <button
            onClick={() => setActiveFilter('failed')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'failed'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/60'
            }`}
          >
            Remedial ({totalSessions - passedSessions})
          </button>
        </div>
      </div>

      {/* 4 Clean Minimalist Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sesi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Sesi
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">
              {totalSessions}
            </span>
            <span className="text-xs text-slate-400 font-medium">sesi</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-normal">Sesi Ujian Resmi</p>
        </div>

        {/* Card 2: Rata-Rata Skor */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Rata-Rata Skor
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#0284C7]">
              {avgScore}%
            </span>
            <span className="text-xs text-slate-400 font-medium">rata-rata</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-normal">Standar Passing 70%</p>
        </div>

        {/* Card 3: Tingkat Kelulusan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Tingkat Kelulusan
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-emerald-600">
              {passRate}%
            </span>
            <span className="text-xs text-slate-400 font-medium">lulus</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-normal">{passedSessions} Tes Berhasil Lulus</p>
        </div>

        {/* Card 4: Poin Kemahiran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Poin Kemahiran
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#EA580C]">
              {profile?.total_points || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">XP</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-normal">Standar Level {profile?.level_code || 'B1'}</p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center bg-white border border-slate-200/80 rounded-2xl text-slate-500 text-xs shadow-2xs">
            <div className="w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="font-medium">Memuat rekam jejak ujian...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl text-slate-500 text-xs space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-900 text-base">Belum Ada Riwayat Ujian</p>
              <p className="text-slate-500 max-w-sm mx-auto text-xs leading-relaxed font-normal">
                Anda belum memiliki sesi ujian yang tercatat. Silakan mulai salah satu dari 10 Paket Ujian Marlins.
              </p>
            </div>
            <div>
              <Link
                href="/student/tests"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs shadow-xs transition-all hover:scale-[1.02]"
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
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold font-mono text-sm shrink-0 ${
                    item.is_passed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <span>{item.score}%</span>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider -mt-0.5">
                    {item.is_passed ? 'Lulus' : 'Remed'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {item.test_name || `Marlins Test ${item.marlint_test_number || 1}`}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        item.is_passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.is_passed ? 'Lulus' : 'Remedial'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0369A1] font-mono text-[10px] font-bold border border-sky-200/80">
                      {item.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateIndo(item.created_at)}</span>
                    </span>
                    <span>•</span>
                    <span>Benar: <strong>{item.correct_answers}/{item.total_questions}</strong></span>
                    <span>•</span>
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
                  className="px-4 py-2 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Review Jawaban</span>
                </Link>

                <Link
                  href={`/student/test/result/${item.attempt_id}`}
                  className="px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 hover:scale-[1.02]"
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
