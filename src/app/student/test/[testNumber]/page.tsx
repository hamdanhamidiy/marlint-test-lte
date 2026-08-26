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
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { getCategoryInfo, formatPriceIDR } from '@/lib/utils';

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

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('marlint_tests')
          .select('*')
          .eq('test_number', testNumber)
          .eq('is_active', true)
          .maybeSingle();

        if (error || !data) {
          setErrorMsg('Tes tidak ditemukan atau belum aktif.');
          return;
        }

        setTest(data as MarlintTest);

        const isStaff = isSuperAdmin || isInstructor || profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'instructor';
        if (isStaff) {
          setHasEntitlement(true);
          return;
        }

        let hasAccess = data.is_free || Number(testNumber) === 1;

        if (user || profile) {
          const userIds = [user?.id, profile?.id].filter(Boolean);
          const userEmails = [user?.email, profile?.email].filter(Boolean);
          const currentTestNum = Number(testNumber);

          // 1. Check profile.department_track
          if (profile?.department_track && profile.department_track.startsWith('[')) {
            try {
              const parsed = JSON.parse(profile.department_track);
              if (Array.isArray(parsed) && parsed.map(Number).includes(currentTestNum)) {
                hasAccess = true;
              }
            } catch (e) {}
          }

          // 2. Check users table directly in Supabase
          try {
            const { data: uData } = await supabase
              .from('users')
              .select('department_track')
              .or(`id.eq.${user?.id || profile?.id},email.eq.${user?.email || profile?.email}`)
              .maybeSingle();

            if (uData?.department_track && uData.department_track.startsWith('[')) {
              const parsed = JSON.parse(uData.department_track);
              if (Array.isArray(parsed) && parsed.map(Number).includes(currentTestNum)) {
                hasAccess = true;
              }
            }
          } catch (e) {}

          // 3. Check test_entitlements table
          try {
            if (userIds.length > 0) {
              const { data: entData } = await supabase
                .from('test_entitlements')
                .select('id, test_number, is_active')
                .or(`user_id.in.(${userIds.map((id) => `"${id}"`).join(',')}),user_id.in.(${userEmails.map((em) => `"${em}"`).join(',')})`)
                .eq('test_number', currentTestNum)
                .eq('is_active', true);

              if (entData && entData.length > 0) hasAccess = true;
            }
          } catch (e) {}

          // 4. Check local storage
          if (typeof window !== 'undefined') {
            const checkKeys = [
              ...userIds.map((id) => `marlins_entitlements_${id}`),
              ...userEmails.map((em) => `marlins_entitlements_${em?.toLowerCase()}`),
              'marlins_entitlements_all',
            ];

            checkKeys.forEach((k) => {
              const localEnt = localStorage.getItem(k);
              if (localEnt) {
                try {
                  const arr = JSON.parse(localEnt);
                  if (Array.isArray(arr) && arr.map(Number).includes(currentTestNum)) {
                    hasAccess = true;
                  }
                } catch (e) {}
              }
            });
          }
        }

        setHasEntitlement(hasAccess);
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
          // Direct fallback session
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
      <div className="max-w-3xl mx-auto p-10 text-center bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-3">
        <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
          <FileCheck2 className="w-4 h-4" />
        </div>
        <p className="text-xs font-semibold text-slate-800">Menyiapkan Informasi Ujian #{testNumber}...</p>
        <p className="text-[11px] text-slate-400">Sinkronisasi data standar IMO Marlins...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl max-w-md mx-auto space-y-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-slate-900">Ujian Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">{errorMsg || 'Ujian yang Anda cari tidak tersedia.'}</p>
        <Link
          href="/student/tests"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0284C7] text-white font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>
    );
  }

  const displayTotalQuestions = (test.total_questions && test.total_questions >= 60) ? test.total_questions : 60;
  const composition = (test.question_composition && Object.keys(test.question_composition).length > 0 && test.total_questions >= 60)
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
        return Headphones;
      case 'grammar':
        return Layers;
      case 'pronunciation':
        return Volume2;
      case 'time_numbers':
      case 'time & numbers':
        return Calendar;
      case 'reading':
        return BookOpen;
      default:
        return FileCheck2;
    }
  };

  const formattedTestName = test.test_name ? test.test_name.replace(/Marlint/gi, 'Marlins') : `Marlins Test ${test.test_number}`;

  return (
    <div className="max-w-3xl mx-auto space-y-5 font-sans pb-12">
      {/* Top Navigation Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/tests"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0284C7] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Katalog Ujian</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-[11px] font-bold text-slate-700 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Standar STCW 2010</span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-slate-100 relative">
        
        {/* Top Ambient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] opacity-90" />

        {/* Header Section */}
        <div className="p-6 sm:p-7 space-y-4 pt-7">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-[11px] font-extrabold">
                  Paket #{test.test_number}
                </span>

                {test.is_free ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 shadow-2xs">
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Akses Gratis</span>
                  </span>
                ) : hasEntitlement ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 shadow-2xs">
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sudah Diaktivasi</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C2410C] text-[11px] font-bold border border-orange-200 shadow-2xs">
                    <Lock className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>{formatPriceIDR(test.price)}</span>
                  </span>
                )}
              </div>

              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {formattedTestName}
              </h1>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
              <div className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Waktu</span>
                <span className="text-xs font-extrabold text-amber-600">Stopwatch</span>
              </div>
              <div className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Soal</span>
                <span className="text-xs font-extrabold text-slate-900">{displayTotalQuestions} butir</span>
              </div>
              <div className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Passing</span>
                <span className="text-xs font-extrabold text-emerald-600">{test.passing_grade}%</span>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
              {test.description || 'Evaluasi standar kompetensi Bahasa Inggris Maritim IMO STCW untuk menguji pemahaman tata bahasa, kosakata kapal, angka & waktu maritim, instruksi keselamatan, serta simulasi percakapan radio VHF.'}
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Komposisi Kategori Soal:</span>
            </h3>
            <span className="text-[11px] font-medium text-slate-400">
              Total {displayTotalQuestions} Soal
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Object.entries(composition).map(([cat, count]) => {
              const info = getCategoryInfo(cat);
              const CatIcon = getCategoryIcon(cat);

              return (
                <div
                  key={cat}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${info.bg} ${info.color} flex items-center justify-center shrink-0`}>
                      <CatIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 leading-tight">{info.name}</p>
                      <p className="text-[10px] text-slate-400">Standar Marlins</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-700 shrink-0">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-5 sm:p-6 space-y-3 bg-[#F9FAFC]/60">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Petunjuk Pelaksanaan Ujian:</span>
          </h3>

          <ul className="space-y-2 text-xs text-slate-600 font-normal leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>
                Tes berlangsung dengan <strong className="text-slate-800">Stopwatch</strong>. Catatan waktu selesai digunakan untuk verifikasi kelulusan.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>
                Pertanyaan tipe audio (Listening) dapat diputar ulang hingga <strong className="text-slate-800">2 kali putar</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>
                Hasil evaluasi, analisis sub-kategori kompetensi, dan sertifikat resmi akan diterbitkan secara otomatis setelah sesi diselesaikan.
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

        {/* Action Button Bar */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-normal">
            Sistem Stopwatch Pencatat Waktu Pengerjaan • Evaluasi Perhotelan & Kapal Pesiar LTE Cruise
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* If test is locked */}
            {!test.is_free && !hasEntitlement ? (
              <>
                <Link
                  href="/student/redeem"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full font-bold text-xs bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Punya Token?</span>
                </Link>

                <Link
                  href={`/student/checkout/${test.test_number}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all cursor-pointer shadow-md shadow-sky-500/25 hover:scale-[1.01] active:scale-98"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Beli Akses Ujian ({formatPriceIDR(test.price)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              /* If test is free or already unlocked */
              <button
                type="button"
                onClick={handleStartAttempt}
                disabled={starting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all cursor-pointer shadow-md shadow-sky-500/25 hover:scale-[1.01] active:scale-98 disabled:opacity-50"
              >
                {starting ? (
                  <span>Menyiapkan Ujian...</span>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-cyan-200" />
                    <span>Mulai Ujian Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
