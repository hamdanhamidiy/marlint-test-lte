'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  HelpCircle,
  FileCheck2,
  KeyRound,
  TrendingUp,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Plus,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Ship,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDateIndo } from '@/lib/utils';
import {
  MARLINS_60_STANDARD_QUESTIONS,
  MARLINS_TEST_2_STANDARD_QUESTIONS,
  MARLINS_TEST_3_STANDARD_QUESTIONS,
  MARLINS_TEST_4_STANDARD_QUESTIONS,
  MARLINS_TEST_5_STANDARD_QUESTIONS,
  MARLINS_TEST_6_STANDARD_QUESTIONS,
  MARLINS_TEST_7_STANDARD_QUESTIONS,
} from '@/lib/marlinsQuestionBank';

const TOTAL_STANDARD_QUESTIONS_COUNT =
  MARLINS_60_STANDARD_QUESTIONS.length +
  MARLINS_TEST_2_STANDARD_QUESTIONS.length +
  MARLINS_TEST_3_STANDARD_QUESTIONS.length +
  MARLINS_TEST_4_STANDARD_QUESTIONS.length +
  MARLINS_TEST_5_STANDARD_QUESTIONS.length +
  MARLINS_TEST_6_STANDARD_QUESTIONS.length +
  MARLINS_TEST_7_STANDARD_QUESTIONS.length;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: TOTAL_STANDARD_QUESTIONS_COUNT,
    totalTests: 10,
    totalAttempts: 0,
    totalCertificates: 0,
  });
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [testsSummary, setTestsSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);

        const [
          { count: uCount },
          { count: qCount },
          { count: tCount },
          { count: aCount },
          { count: cCount },
        ] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('questions').select('*', { count: 'exact', head: true }),
          supabase.from('marlint_tests').select('*', { count: 'exact', head: true }),
          supabase.from('test_attempts').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          totalUsers: uCount || 0,
          totalQuestions: Math.max(qCount || 0, TOTAL_STANDARD_QUESTIONS_COUNT),
          totalTests: tCount || 10,
          totalAttempts: aCount || 0,
          totalCertificates: cCount || 0,
        });

        // Load recent attempts
        const { data: attemptsData } = await supabase
          .from('test_attempts')
          .select('*, marlint_tests(test_name)')
          .order('created_at', { ascending: false })
          .limit(5);

        if (attemptsData) {
          setRecentAttempts(attemptsData);
        }

        // Load test packages summary
        const { data: testsData } = await supabase
          .from('marlint_tests')
          .select('*')
          .order('test_number', { ascending: true })
          .limit(7);

        if (testsData) {
          const adjusted = testsData.map((t) => {
            if (t.test_number <= 7) {
              return { ...t, total_questions: 60 };
            }
            return t;
          });
          setTestsSummary(adjusted);
        }
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  return (
    <div className="space-y-7 min-w-0 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
              <span className="font-bold text-slate-900">Admin Control Center</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Standar IMO STCW & SMCP</span>
            </div>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
            Ringkasan Sistem Marlins Test
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Pusat kendali evaluasi maritim, bank soal terstandar, registrasi perwira & siswa, dan sertifikasi digital.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/questions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Soal</span>
          </Link>
          <Link
            href="/admin/tokens"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Terbitkan Token</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric KPI Cards in Ocean Blue, Dark Orange & Deep Black */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Siswa Terdaftar
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center text-xs border border-sky-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {stats.totalUsers}
            </span>
            <Link
              href="/admin/students"
              className="text-[11px] text-[#0284C7] hover:text-[#0369A1] font-bold flex items-center gap-1 mt-0.5"
            >
              <span>Lihat Direktori Siswa</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bank Soal Aktif */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Bank Soal Aktif
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#C2410C] flex items-center justify-center text-xs border border-orange-100">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#C2410C] leading-tight">
              {stats.totalQuestions}
            </span>
            <Link
              href="/admin/questions"
              className="text-[11px] text-[#C2410C] hover:text-[#EA580C] font-bold flex items-center gap-1 mt-0.5"
            >
              <span>Kelola Bank Soal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Paket Ujian */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Paket Ujian
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center text-xs border border-slate-200">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {stats.totalTests}
            </span>
            <Link
              href="/admin/tests"
              className="text-[11px] text-slate-700 hover:text-slate-950 font-bold flex items-center gap-1 mt-0.5"
            >
              <span>Konfigurasi Ujian</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Sertifikat Terbit */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sertifikat Terbit
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs border border-amber-100">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-amber-600 leading-tight">
              {stats.totalCertificates}
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Dari {stats.totalAttempts} sesi pengerjaan</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Recent Activity Log (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-slate-950">
              Aktivitas Sesi Ujian Terbaru
            </h2>
            <span className="text-xs text-slate-500 font-medium">Sinkronisasi Database Realtime</span>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
            {recentAttempts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <FileCheck2 className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-500">Belum ada aktivitas sesi ujian tercatat.</p>
              </div>
            ) : (
              recentAttempts.map((att) => (
                <div
                  key={att.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-950">
                      {att.marlint_tests?.test_name || `Marlins Test #${att.test_number}`}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Skor: <strong className="text-emerald-700 font-bold">{att.score ?? '-'}%</strong> • Waktu: {formatDateIndo(att.started_at || att.created_at)} • Attempt: <span className="font-mono text-slate-600">{att.id.substring(0, 8)}...</span>
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                      att.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {att.status?.toUpperCase() || 'IN PROGRESS'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Quick Status & Test Packages Overview (Span 1) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-slate-950">
              Paket Ujian Marlins
            </h2>
            <Link
              href="/admin/tests"
              className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1"
            >
              <span>Kelola</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3.5">
            {testsSummary.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-950">
                    Paket #{t.test_number} • {t.test_name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                    t.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {t.is_active ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{t.duration} mnt • {t.total_questions} Soal</span>
                  <span className="font-bold text-[#EA580C]">
                    {t.is_free ? 'Gratis' : `Rp ${t.price?.toLocaleString('id-ID') || '49.000'}`}
                  </span>
                </div>
              </div>
            ))}

            <Link
              href="/admin/tests"
              className="w-full flex items-center justify-center py-2.5 rounded-full text-xs font-bold text-[#0284C7] bg-[#E0F2FE] hover:bg-[#BAE6FD] transition-colors shadow-2xs"
            >
              <span>Buka Konfigurasi Paket</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
