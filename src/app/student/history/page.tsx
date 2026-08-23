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
    <div className="space-y-6 min-w-0 font-sans">
      {/* Page Header (Clean, Formal & Professional) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
            <span className="font-bold text-slate-900">Rekam Jejak Evaluasi Resmi</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">Standar IMO STCW</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Riwayat Ujian Marlins Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
            Catatan rekapitulasi skor kompetensi, analisis sub-kategori, dan hasil evaluasi Bahasa Inggris Maritim Anda.
          </p>
        </div>

        {/* Filter Pills with Deep Black & Clean Borders */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Semua ({results.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('passed')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'passed'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Lulus ({passedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('failed')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'failed'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Remedial ({totalAttempts - passedCount})
          </button>
        </div>
      </div>

      {/* Summary KPI Metric Cards (4 Cards in Ocean Blue, Dark Orange & Deep Black) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sessions */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Sesi
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center text-xs border border-sky-100">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {totalAttempts}
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Sesi Ujian Resmi</p>
          </div>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Rata-Rata Skor
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#C2410C] flex items-center justify-center text-xs border border-orange-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#C2410C] leading-tight">
              {avgScore}%
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Standar Passing 70%</p>
          </div>
        </div>

        {/* Card 3: Pass Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tingkat Kelulusan
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-600 leading-tight">
              {totalAttempts > 0 ? `${passRate}%` : '100%'}
            </span>
            <p className="text-[11px] text-slate-500 font-medium">{passedCount} Tes Berhasil Lulus</p>
          </div>
        </div>

        {/* Card 4: Experience Points / Level */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Poin Kemahiran
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs border border-amber-100">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {profile?.total_points || 480} <span className="text-sm font-sans font-bold text-amber-600">XP</span>
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Standar Level {profile?.level_code || 'B1+'}</p>
          </div>
        </div>
      </div>

      {/* Results List or Clean Empty State */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl text-slate-400 text-xs shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <p className="font-semibold text-slate-700">Memuat riwayat ujian resmi...</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto shadow-2xs border border-sky-200/70">
            <FileCheck2 className="w-8 h-8" />
          </div>
          
          <div className="space-y-1.5">
            <h3 className="font-heading text-lg font-bold text-slate-950">
              {activeFilter !== 'all' ? 'Tidak Ada Riwayat dengan Filter Ini' : 'Belum Ada Riwayat Ujian'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {activeFilter !== 'all'
                ? 'Silakan ubah filter status untuk meninjau hasil evaluasi lainnya.'
                : 'Mulai sesi evaluasi pertama Anda untuk mengukur kecakapan Bahasa Inggris Maritim standar IMO STCW & SMCP.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/student/test/1"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Ship className="w-4 h-4" />
              <span>Mulai Marlins Test 1 (Gratis)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/student/articles"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-all cursor-pointer"
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
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start sm:items-center gap-4">
                {/* Score badge */}
                <div
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-base shrink-0 shadow-2xs ${
                    res.is_passed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <span>{res.score}%</span>
                  <span className="text-[8px] font-sans font-bold uppercase tracking-wider">
                    {res.is_passed ? 'Lulus' : 'Remed'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug">
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
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0369A1] text-[10px] font-bold uppercase tracking-wider border border-sky-200">
                      {res.level || 'CEFR B1'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateIndo(res.created_at)}</span>
                    </span>
                    <span>Benar: <strong className="text-slate-800 font-bold">{res.correct_answers}/{res.total_questions}</strong></span>
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#0284C7] bg-sky-50 hover:bg-sky-100 border border-sky-200/80 transition-all shadow-2xs cursor-pointer"
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
