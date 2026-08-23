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
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { StudentResult } from '@/lib/supabase/types';
import { formatDateIndo, formatDuration } from '@/lib/utils';

export default function StudentHistoryPage() {
  const { user, profile } = useAuth();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'passed' | 'failed'>('all');

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('student_results')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setResults(data as StudentResult[]);
        }
      } catch (err) {
        console.error('Error loading history:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [user]);

  const filteredResults = results.filter((r) => {
    if (activeFilter === 'passed') return r.is_passed;
    if (activeFilter === 'failed') return !r.is_passed;
    return true;
  });

  const totalAttempts = results.length;
  const passedCount = results.filter((r) => r.is_passed).length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts)
      : profile?.total_points ? 82 : 0;
  const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;

  return (
    <div className="space-y-5 sm:space-y-6 min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E0E7FF] text-[#4338CA] text-[11px] font-bold tracking-tight">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Rekam Jejak Asesmen Resmi IMO STCW</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Riwayat Ujian Marlins Saya
          </h1>
          <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xl">
            Catatan evaluasi skor kompetensi dan hasil pengerjaan ujian Bahasa Inggris Maritim Anda.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
            }`}
          >
            Semua ({results.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('passed')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'passed'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
            }`}
          >
            Lulus ({passedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('failed')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'failed'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
            }`}
          >
            Remedial ({totalAttempts - passedCount})
          </button>
        </div>
      </div>

      {/* Summary KPI Metric Cards (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Sessions */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Sesi
            </span>
            <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
              <FileCheck2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {totalAttempts}
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Sesi Ujian Resmi</p>
          </div>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Rata-Rata Skor
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl font-black text-[#4F46E5] leading-tight">
              {avgScore}%
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Standar Passing 70%</p>
          </div>
        </div>

        {/* Card 3: Pass Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Kelulusan
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl font-black text-emerald-600 leading-tight">
              {totalAttempts > 0 ? `${passRate}%` : '100%'}
            </span>
            <p className="text-[10px] text-slate-400 font-medium">{passedCount} Tes Lulus</p>
          </div>
        </div>

        {/* Card 4: Experience Points */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Poin Kemahiran
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl font-black text-amber-600 leading-tight">
              {profile?.total_points || 480} XP
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Level {profile?.level_code || 'B1+'}</p>
          </div>
        </div>
      </div>

      {/* Results List or Empty State */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl text-slate-400 text-xs shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto animate-pulse">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <p className="font-semibold text-slate-700">Memuat riwayat ujian...</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xs text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto shadow-2xs border border-indigo-100">
            <FileCheck2 className="w-7 h-7" />
          </div>
          
          <div className="space-y-1">
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
              {activeFilter !== 'all' ? 'Tidak Ada Riwayat dengan Filter Ini' : 'Belum Ada Riwayat Ujian'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              {activeFilter !== 'all'
                ? 'Silakan ubah filter kategori untuk melihat hasil ujian lainnya.'
                : 'Mulai sesi ujian pertama Anda untuk mengukur kemampuan Bahasa Inggris Maritim standar IMO STCW.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <Link
              href="/student/tests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] text-white font-bold text-xs shadow-sm hover:shadow-md hover:bg-[#4338CA] transition-all cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Buka Katalog Ujian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/student/articles"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Pelajari Materi Dulu</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((res) => (
            <div
              key={res.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300/80 hover:shadow-md transition-all group"
            >
              <div className="flex items-start sm:items-center gap-4">
                {/* Score badge */}
                <div
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-base shrink-0 shadow-xs ${
                    res.is_passed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                  }`}
                >
                  <span>{res.score}%</span>
                  <span className="text-[8px] font-sans font-bold uppercase tracking-wider">
                    {res.is_passed ? 'Lulus' : 'Remed'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors leading-snug">
                      {res.test_name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        res.is_passed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {res.is_passed ? 'LULUS' : 'REMEDIAL'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#4F46E5] text-[10px] font-bold uppercase tracking-wider">
                      {res.level || 'CEFR B1'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateIndo(res.created_at)}</span>
                    </span>
                    <span>Benar: <strong className="text-slate-700 font-bold">{res.correct_answers}/{res.total_questions}</strong></span>
                    {res.time_spent_seconds > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatDuration(res.time_spent_seconds)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                <Link
                  href={`/student/test/result/${res.attempt_id || res.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#4F46E5] bg-[#EEF0FF] hover:bg-[#E0E4FF] transition-all shadow-2xs"
                >
                  <span>Lihat Analisis Hasil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
