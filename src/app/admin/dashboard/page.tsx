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
  Wallet,
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
          { count: sCount },
          { count: cCount },
        ] = await Promise.all([
          supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .neq('role', 'instructor')
            .neq('role', 'super_admin')
            .neq('role', 'admin'),
          supabase.from('questions').select('*', { count: 'exact', head: true }),
          supabase.from('marlint_tests').select('*', { count: 'exact', head: true }),
          supabase.from('test_attempts').select('*', { count: 'exact', head: true }),
          supabase.from('student_results').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true }),
        ]);

        const totalAtts = Math.max(aCount || 0, sCount || 0);

        setStats({
          totalUsers: uCount || 0,
          totalQuestions: Math.max(qCount || 0, TOTAL_STANDARD_QUESTIONS_COUNT),
          totalTests: tCount || 10,
          totalAttempts: totalAtts,
          totalCertificates: cCount || 0,
        });

        // Load recent attempts from student_results or test_attempts
        let attemptsList: any[] = [];
        const { data: resultsData } = await supabase
          .from('student_results')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (resultsData && resultsData.length > 0) {
          attemptsList = resultsData.map((r: any) => ({
            id: r.id,
            score: r.score,
            is_passed: r.is_passed,
            created_at: r.created_at,
            test_number: r.marlint_test_number || 1,
            marlint_tests: {
              test_name: r.test_name || `Marlins Test 1 - Cruise Hospitality & Maritime English`,
            },
          }));
        } else {
          const { data: attemptsData } = await supabase
            .from('test_attempts')
            .select('*, marlint_tests(test_name)')
            .order('created_at', { ascending: false })
            .limit(5);

          if (attemptsData) {
            attemptsList = attemptsData;
          }
        }

        setRecentAttempts(attemptsList);

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

    const channel = supabase
      .channel('admin_dashboard_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'student_results' },
        () => {
          loadAdminData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => {
          loadAdminData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6 sm:space-y-7 min-w-0 font-sans pb-16 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold text-[#0284C7] shadow-2xs flex-wrap">
              <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse shrink-0"></span>
              <span className="font-bold text-[#0369A1] truncate">
                {isSuperAdmin
                  ? 'Super Admin Master Control'
                  : isInstructor
                  ? 'Portal Instruktur Penguji'
                  : 'Admin Control Center'}
              </span>
              <span className="text-sky-300 hidden sm:inline">•</span>
              <span className="text-slate-500 font-medium hidden sm:inline">Standar IMO STCW & SMCP</span>
            </div>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Ringkasan Sistem Marlins Test
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            {isInstructor
              ? 'Pusat pengelolaan bank soal maritim terstandar, komposisi paket ujian 1–10, dan penerbitan token akses siswa.'
              : 'Pusat kendali evaluasi maritim, bank soal terstandar, direktori siswa, dan sertifikasi digital.'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 flex-wrap">
          <Link
            href="/admin/payments"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:text-emerald-700 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>Keuangan & QRIS</span>
          </Link>
          <Link
            href="/admin/questions"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white shadow-md shadow-sky-500/20 hover:opacity-95 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-200" />
            <span>Tambah Soal</span>
          </Link>
          <Link
            href="/admin/tokens"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold bg-white hover:bg-sky-50/80 text-slate-800 border border-slate-200/90 shadow-2xs hover:border-sky-300 hover:text-[#0284C7] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-[#0284C7]" />
            <span>Terbitkan Token</span>
          </Link>
        </div>
      </div>

      {/* Instructor Notice Banner */}
      {isInstructor && (
        <div className="p-4 sm:p-5 rounded-[26px] bg-gradient-to-r from-sky-50/80 to-blue-50/80 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-sky-950 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-950">Mode Instruktur Aktif</p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Anda memiliki akses penuh untuk mengelola <strong>Bank Soal</strong>, <strong>Paket Ujian (1–10)</strong>, dan <strong>Token Akses Siswa</strong>.
              </p>
            </div>
          </div>
          <Link
            href="/admin/questions"
            className="self-start sm:self-auto shrink-0 px-4 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs transition-all shadow-xs"
          >
            Kelola Soal &rarr;
          </Link>
        </div>
      )}

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
        {/* Total Students */}
        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Siswa
            </span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100/80 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-heading text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {stats.totalUsers}
            </span>
            {canManageStudents ? (
              <Link
                href="/admin/students"
                className="text-xs text-[#0284C7] hover:text-[#0369A1] font-bold flex items-center gap-1 mt-1 truncate"
              >
                <span>Direktori Siswa</span>
                <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <p className="text-xs text-slate-400 font-medium mt-1">Super Admin</p>
            )}
          </div>
        </div>

        {/* Bank Soal Aktif */}
        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bank Soal
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0369A1] flex items-center justify-center border border-blue-100/80 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-heading text-2xl sm:text-3xl font-black text-[#0284C7] leading-tight">
              {stats.totalQuestions}
            </span>
            <Link
              href="/admin/questions"
              className="text-xs text-[#0284C7] hover:text-[#0369A1] font-bold flex items-center gap-1 mt-1 truncate"
            >
              <span>Kelola Soal</span>
              <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Paket Ujian */}
        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Paket Ujian
            </span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100/80 group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-heading text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {stats.totalTests}
            </span>
            <Link
              href="/admin/tests"
              className="text-xs text-[#0284C7] hover:text-[#0369A1] font-bold flex items-center gap-1 mt-1 truncate"
            >
              <span>Konfigurasi Ujian</span>
              <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Sertifikat Terbit */}
        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sertifikat
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/80 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-heading text-2xl sm:text-3xl font-black text-emerald-600 leading-tight">
              {stats.totalCertificates}
            </span>
            <p className="text-xs text-slate-400 font-medium mt-1 truncate">Dari {stats.totalAttempts} sesi ujian</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        
        {/* Left Column: Recent Activity Log (Span 2) */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading text-base sm:text-lg font-bold text-slate-950">
              Aktivitas Sesi Ujian Terbaru
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Realtime Sync
            </span>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-3">
            {recentAttempts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-100">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">Belum ada aktivitas sesi ujian tercatat.</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Siswa yang menyelesaikan ujian akan otomatis muncul di sini secara realtime.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentAttempts.map((attempt) => {
                  const testTitle = attempt.marlint_tests?.test_name
                    ? attempt.marlint_tests.test_name.replace(/Marlint/gi, 'Marlins')
                    : `Marlins Test ${attempt.test_number || 1}`;

                  return (
                    <div key={attempt.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] border border-sky-100/80 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          <FileCheck2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">
                            {testTitle}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {formatDateIndo(attempt.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-mono font-black text-sm text-slate-900 block">
                            {attempt.score !== null ? `${attempt.score}%` : 'Aktif'}
                          </span>
                          {attempt.is_passed !== null && (
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${
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
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading text-base sm:text-lg font-bold text-slate-950">
              Paket Ujian Marlins
            </h2>
            <Link
              href="/admin/tests"
              className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors flex items-center gap-1"
            >
              <span>Kelola</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-[28px] border border-slate-200/80 shadow-xs space-y-2.5">
            {testsSummary.map((test) => {
              const formattedName = test.test_name ? test.test_name.replace(/Marlint/gi, 'Marlins') : `Marlins Test ${test.test_number}`;

              return (
                <div
                  key={test.id}
                  className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">
                      Paket #{test.test_number} • {formattedName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      60 mnt • {test.total_questions || 60} Soal
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      AKTIF
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">
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
