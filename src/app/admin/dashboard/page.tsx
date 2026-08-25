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
import { formatDateIndo, formatPriceIDR } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';
import {
  MARLINS_60_STANDARD_QUESTIONS,
  MARLINS_TEST_2_STANDARD_QUESTIONS,
  MARLINS_TEST_3_STANDARD_QUESTIONS,
  MARLINS_TEST_4_STANDARD_QUESTIONS,
  MARLINS_TEST_5_STANDARD_QUESTIONS,
  MARLINS_TEST_6_STANDARD_QUESTIONS,
  MARLINS_TEST_7_STANDARD_QUESTIONS,
  MARLINS_TEST_8_STANDARD_QUESTIONS,
  MARLINS_TEST_9_STANDARD_QUESTIONS,
  MARLINS_TEST_10_STANDARD_QUESTIONS,
} from '@/lib/marlinsQuestionBank';

const TOTAL_STANDARD_QUESTIONS_COUNT =
  MARLINS_60_STANDARD_QUESTIONS.length +
  MARLINS_TEST_2_STANDARD_QUESTIONS.length +
  MARLINS_TEST_3_STANDARD_QUESTIONS.length +
  MARLINS_TEST_4_STANDARD_QUESTIONS.length +
  MARLINS_TEST_5_STANDARD_QUESTIONS.length +
  MARLINS_TEST_6_STANDARD_QUESTIONS.length +
  MARLINS_TEST_7_STANDARD_QUESTIONS.length +
  MARLINS_TEST_8_STANDARD_QUESTIONS.length +
  MARLINS_TEST_9_STANDARD_QUESTIONS.length +
  MARLINS_TEST_10_STANDARD_QUESTIONS.length;

export default function AdminDashboardPage() {
  const { profile, isSuperAdmin, isInstructor, canManageStudents } = useAuth();
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
          .limit(10);

        if (testsData) {
          const adjusted = testsData.map((t) => {
            if (t.test_number <= 10) {
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
    <div className="space-y-5 sm:space-y-6 lg:space-y-7 min-w-0 font-sans pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 sm:pb-4 border-b border-slate-200/80">
        <div className="space-y-2">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs flex-wrap">
              <span
                className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${
                  isSuperAdmin ? 'bg-purple-600' : isInstructor ? 'bg-amber-500' : 'bg-[#EA580C]'
                }`}
              ></span>
              <span className="font-bold text-slate-900 truncate">
                {isSuperAdmin
                  ? 'Super Admin Master Control'
                  : isInstructor
                  ? 'Portal Instruktur Penguji'
                  : 'Admin Control Center'}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-500 font-medium hidden sm:inline">Standar IMO STCW & SMCP</span>
            </div>
          </div>

          <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Ringkasan Sistem Marlins Test
          </h1>

          <p className="text-xs sm:text-[14px] text-slate-500 font-normal max-w-2xl leading-relaxed">
            {isInstructor
              ? 'Pusat pengelolaan bank soal maritim terstandar, komposisi paket ujian 1–10, dan penerbitan token akses siswa.'
              : 'Pusat kendali evaluasi maritim, bank soal terstandar, direktori siswa, dan sertifikasi digital.'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/admin/questions"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold bg-black hover:bg-neutral-800 text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Soal</span>
          </Link>
          <Link
            href="/admin/tokens"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Terbitkan Token</span>
          </Link>
        </div>
      </div>

      {/* Instructor Notice Banner */}
      {isInstructor && (
        <div className="p-4 rounded-[22px] bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-[13px] text-amber-900">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-amber-950">Mode Instruktur Aktif</p>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Anda memiliki akses penuh untuk mengelola <strong>Bank Soal</strong>, <strong>Paket Ujian (1–10)</strong>, dan <strong>Token Akses</strong>.
              </p>
            </div>
          </div>
          <Link
            href="/admin/questions"
            className="self-start sm:self-auto shrink-0 px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Kelola Soal &rarr;
          </Link>
        </div>
      )}

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {/* Total Students */}
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[22px] sm:rounded-[26px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] sm:min-h-[140px] hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Siswa
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center text-xs border border-sky-100 shadow-2xs">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 leading-tight">
              {stats.totalUsers}
            </span>
            {canManageStudents ? (
              <Link
                href="/admin/students"
                className="text-[11px] sm:text-xs text-[#0284C7] hover:text-[#0369A1] font-bold flex items-center gap-1 mt-0.5 sm:mt-1 truncate"
              >
                <span>Direktori Siswa</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </Link>
            ) : (
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 sm:mt-1">
                Super Admin
              </p>
            )}
          </div>
        </div>

        {/* Bank Soal Aktif */}
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[22px] sm:rounded-[26px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] sm:min-h-[140px] hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bank Soal
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-orange-50 text-[#C2410C] flex items-center justify-center text-xs border border-orange-100 shadow-2xs">
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-black text-[#C2410C] leading-tight">
              {stats.totalQuestions}
            </span>
            <Link
              href="/admin/questions"
              className="text-[11px] sm:text-xs text-[#C2410C] hover:text-[#EA580C] font-bold flex items-center gap-1 mt-0.5 sm:mt-1 truncate"
            >
              <span>Kelola Soal</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </Link>
          </div>
        </div>

        {/* Paket Ujian */}
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[22px] sm:rounded-[26px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] sm:min-h-[140px] hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Paket Ujian
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center text-xs border border-slate-200 shadow-2xs">
              <FileCheck2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 leading-tight">
              {stats.totalTests}
            </span>
            <Link
              href="/admin/tests"
              className="text-[11px] sm:text-xs text-slate-800 hover:text-black font-bold flex items-center gap-1 mt-0.5 sm:mt-1 truncate"
            >
              <span>Konfigurasi Ujian</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </Link>
          </div>
        </div>

        {/* Sertifikat Terbit */}
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[22px] sm:rounded-[26px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] sm:min-h-[140px] hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sertifikat
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs border border-amber-100 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-black text-amber-600 leading-tight">
              {stats.totalCertificates}
            </span>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 sm:mt-1 truncate">Dari {stats.totalAttempts} sesi</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        
        {/* Left Column: Recent Activity Log (Span 2) */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base sm:text-lg font-bold text-slate-950">
              Aktivitas Sesi Ujian Terbaru
            </h2>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Realtime Sync</span>
          </div>

          <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[22px] sm:rounded-[26px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
            {recentAttempts.length === 0 ? (
              <div className="text-center py-10 sm:py-12 text-slate-400 space-y-2">
                <FileCheck2 className="w-8 h-8 sm:w-9 sm:h-9 mx-auto text-slate-300" />
                <p className="text-xs sm:text-[13px] font-bold text-slate-600">Belum ada aktivitas sesi ujian tercatat.</p>
                <p className="text-[11px] sm:text-xs text-slate-400">Siswa yang menyelesaikan ujian akan otomatis muncul di sini.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentAttempts.map((attempt) => {
                  const testTitle = attempt.marlint_tests?.test_name
                    ? attempt.marlint_tests.test_name.replace(/Marlint/gi, 'Marlins')
                    : `Marlins Test ${attempt.test_number || 1}`;

                  return (
                    <div key={attempt.id} className="py-3 sm:py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2.5 sm:gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">
                            {testTitle}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                            {formatDateIndo(attempt.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-mono font-bold text-xs sm:text-[13px] text-slate-900 block">
                            {attempt.score !== null ? `${attempt.score}%` : 'Aktif'}
                          </span>
                          {attempt.is_passed !== null && (
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              attempt.is_passed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {attempt.is_passed ? 'LULUS' : 'REMEDIAL'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 10 Paket Ujian Marlins List */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base sm:text-lg font-bold text-slate-950">
              Paket Ujian Marlins
            </h2>
            <Link
              href="/admin/tests"
              className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors"
            >
              Kelola &rarr;
            </Link>
          </div>

          <div className="bg-white p-3.5 sm:p-4.5 lg:p-5 rounded-[22px] sm:rounded-[26px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2 sm:space-y-2.5">
            {testsSummary.map((test) => {
              const formattedName = test.test_name ? test.test_name.replace(/Marlint/gi, 'Marlins') : `Marlins Test ${test.test_number}`;

              return (
                <div
                  key={test.id}
                  className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between gap-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">
                      Paket #{test.test_number} • {formattedName}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                      60 mnt • {test.total_questions || 60} Soal
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      AKTIF
                    </span>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-0.5">
                      {test.is_free ? 'Gratis' : formatPriceIDR(test.price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
