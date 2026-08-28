'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileCheck2,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Headphones,
  BookOpen,
  Volume2,
  Calendar,
  Layers,
  Award,
  Lock,
  Unlock,
  KeyRound,
  Info,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { getCategoryInfo, formatPriceIDR } from '@/lib/utils';
import { getUserUnlockedTests } from '@/lib/entitlements';

export default function TestOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile, isSuperAdmin, isInstructor } = useAuth();
  const testNumber = parseInt(params.testNumber as string, 10);

  const [test, setTest] = useState<MarlintTest | null>(null);
  const [hasEntitlement, setHasEntitlement] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isStaff = isSuperAdmin || isInstructor || profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'instructor';

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        const [testRes, unlockedTests] = await Promise.all([
          supabase
            .from('marlint_tests')
            .select('*')
            .eq('test_number', testNumber)
            .eq('is_active', true)
            .maybeSingle(),
          getUserUnlockedTests(user?.id || profile?.id, user?.email || profile?.email, isStaff),
        ]);

        if (testRes.error || !testRes.data) {
          setErrorMsg('Tes tidak ditemukan atau belum aktif.');
          return;
        }

        setTest(testRes.data as MarlintTest);
        setHasEntitlement(unlockedTests.has(testNumber) || testRes.data.is_free || testNumber === 1);
      } catch (e: any) {
        setErrorMsg(e.message || 'Gagal memuat detail tes.');
      } finally {
        setLoading(false);
      }
    }

    if (testNumber) {
      loadTest();
    }
  }, [testNumber, user, profile, isSuperAdmin, isInstructor]);

  const handleStartAttempt = async () => {
    if (!user || !test) return;

    // Strict access check
    if (!test.is_free && !hasEntitlement) {
      router.push(`/student/checkout/${test.test_number}`);
      return;
    }

    try {
      setStarting(true);
      setErrorMsg(null);

      const { data, error } = await supabase.rpc('start_test_attempt', {
        p_test_number: test.test_number,
      });

      if (error) {
        if (error.message.includes('TEST_ACCESS_REQUIRED') && !test.is_free && !hasEntitlement) {
          router.push(`/student/checkout/${test.test_number}`);
          return;
        } else {
          router.push(`/student/test/take/session-test-${test.test_number}-${Date.now()}`);
          return;
        }
      }

      if (data && data.attempt_id) {
        router.push(`/student/test/take/${data.attempt_id}`);
      } else {
        router.push(`/student/test/take/session-test-${test.test_number}-${Date.now()}`);
      }
    } catch (err: any) {
      router.push(`/student/test/take/session-test-${test?.test_number || 1}-${Date.now()}`);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white border border-slate-200/90 rounded-3xl shadow-xs space-y-3 font-sans">
        <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
          <FileCheck2 className="w-5 h-5" />
        </div>
        <p className="text-sm font-bold text-slate-800">Menyiapkan Informasi Ujian #{testNumber}...</p>
        <p className="text-xs text-slate-400">Sinkronisasi data standar IMO STCW Marlins...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200/90 rounded-3xl max-w-md mx-auto space-y-4 shadow-xs font-sans">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Ujian Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">{errorMsg || 'Ujian yang Anda cari tidak tersedia.'}</p>
        <Link
          href="/student/tests"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0284C7] text-white font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>
    );
  }

  const displayTotalQuestions = test.total_questions && test.total_questions >= 60 ? test.total_questions : 60;
  const composition =
    test.question_composition && Object.keys(test.question_composition).length > 0 && test.total_questions >= 60
      ? test.question_composition
      : {
          grammar: 15,
          vocabulary: 15,
          time_and_numbers: 10,
          reading_comprehension: 10,
          listening_comprehension: 10,
        };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'listening':
      case 'listening_comprehension':
        return Headphones;
      case 'grammar':
        return Layers;
      case 'pronunciation':
        return Volume2;
      case 'time_numbers':
      case 'time_and_numbers':
      case 'time & numbers':
        return Calendar;
      case 'reading':
      case 'reading_comprehension':
        return BookOpen;
      default:
        return FileCheck2;
    }
  };

  const formattedTestName = test.test_name ? test.test_name.replace(/Marlint/gi, 'Marlins') : `Marlins Test ${test.test_number}`;

  return (
    <div className="max-w-4xl mx-auto space-y-5 font-sans pb-16 min-w-0">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/student/tests"
          className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-bold text-slate-600 hover:text-[#0284C7] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Katalog Ujian</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Standar STCW 2010</span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden divide-y divide-slate-100">
        
        {/* Header Section */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            
            {/* Title and Badges */}
            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-xs font-extrabold">
                  Paket #{test.test_number}
                </span>

                {test.is_free ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-2xs">
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Akses Gratis</span>
                  </span>
                ) : hasEntitlement ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-2xs">
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Akses Terbuka</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#C2410C] text-xs font-bold border border-orange-200 shadow-2xs">
                    <Lock className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>{formatPriceIDR(test.price)}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
                {formattedTestName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal max-w-2xl">
                {test.description ||
                  'Evaluasi standar kompetensi Bahasa Inggris Maritim IMO STCW untuk menguji pemahaman tata bahasa, kosakata kapal, angka & waktu maritim, instruksi keselamatan, serta simulasi percakapan radio VHF.'}
              </p>
            </div>

            {/* 3 Metric Badges */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0 self-start md:self-auto w-full md:w-auto">
              <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[80px]">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Waktu</span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-600 mt-0.5 block">Stopwatch</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[80px]">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Soal</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 block">{displayTotalQuestions} Butir</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[80px]">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Passing</span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-600 mt-0.5 block">{test.passing_grade}%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0284C7]" />
              <span>Komposisi Kategori Soal:</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Total {displayTotalQuestions} Butir Soal Terstandar
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(composition).map(([cat, count]) => {
              const info = getCategoryInfo(cat);
              const CatIcon = getCategoryIcon(cat);

              return (
                <div
                  key={cat}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl ${info.bg} ${info.color} flex items-center justify-center shrink-0 shadow-2xs`}>
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-tight truncate">{info.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Standar IMO Marlins</p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0 shadow-2xs">
                    {count} Soal
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions Section */}
        <div className="p-6 sm:p-8 space-y-3.5 bg-slate-50/50">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span>Petunjuk Pelaksanaan Ujian:</span>
          </h3>

          <ul className="space-y-2.5 text-xs text-slate-600 font-normal leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
              <span>
                Tes berlangsung dengan <strong className="text-slate-900 font-bold">Stopwatch Penghitung Waktu</strong>. Catatan durasi penyelesaian akan dicantumkan pada hasil evaluasi.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
              <span>
                Pertanyaan tipe audio (Listening & Pronunciation) dapat diputar ulang hingga <strong className="text-slate-900 font-bold">2 kali pemutaran</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
              <span>
                Hasil asesmen kompetensi, diagram radar 5-kategori, dan sertifikat kelulusan diterbitkan langsung setelah Anda menekan tombol submit.
              </span>
            </li>
          </ul>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border-t border-b border-rose-100 text-rose-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
            {errorMsg.includes('voucher') || errorMsg.includes('token') || errorMsg.includes('Redeem') ? (
              <Link
                href="/student/redeem"
                className="px-3 py-1 rounded-md bg-amber-500 text-white font-semibold text-xs shrink-0"
              >
                Aktivasi Token
              </Link>
            ) : null}
          </div>
        )}

        {/* Clean Responsive Footer CTA Bar */}
        <div className="p-5 sm:p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Evaluasi Kompetensi Maritim • Sekolah Perhotelan & Kapal Pesiar LTE Cruise</span>
          </div>

          {/* Action Buttons Container */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 flex-wrap sm:flex-nowrap">
            
            {/* If test is locked */}
            {!test.is_free && !hasEntitlement ? (
              <>
                <Link
                  href="/student/redeem"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200 shadow-2xs active:scale-95"
                >
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Klaim Token</span>
                </Link>

                <Link
                  href={`/student/checkout/${test.test_number}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all cursor-pointer shadow-md shadow-sky-500/20 hover:scale-[1.02] active:scale-98"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Beli Akses Ujian ({formatPriceIDR(test.price)})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              /* If test is free or already unlocked */
              <button
                type="button"
                onClick={handleStartAttempt}
                disabled={starting}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all cursor-pointer shadow-md shadow-sky-500/20 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
              >
                {starting ? (
                  <span>Menyiapkan Lembar Ujian...</span>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-cyan-200" />
                    <span>Mulai Ujian Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

