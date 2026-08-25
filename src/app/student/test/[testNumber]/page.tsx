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
  const { user } = useAuth();
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

        if (user) {
          let hasAccess = data.is_free;
          try {
            const { data: entData } = await supabase
              .from('test_entitlements')
              .select('id')
              .eq('user_id', user.id)
              .eq('test_number', testNumber)
              .eq('is_active', true)
              .maybeSingle();

            if (entData) hasAccess = true;
          } catch (e) {}

          if (typeof window !== 'undefined') {
            const localEnt = localStorage.getItem(`marlins_entitlements_${user.id}`);
            if (localEnt) {
              try {
                const arr = JSON.parse(localEnt);
                if (Array.isArray(arr) && arr.map(Number).includes(Number(testNumber))) {
                  hasAccess = true;
                }
              } catch (e) {}
            }
          }

          setHasEntitlement(hasAccess);
        }
      } catch (e: any) {
        setErrorMsg(e.message || 'Gagal memuat detail tes.');
      } finally {
        setLoading(false);
      }
    }

    if (testNumber) {
      loadTest();
    }
  }, [testNumber, user]);

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
        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#5046E5] flex items-center justify-center mx-auto animate-pulse">
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5046E5] text-white font-semibold text-xs transition-colors"
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] via-[#EA580C] to-slate-900 opacity-90" />

        {/* Header Section */}
        <div className="p-6 sm:p-7 space-y-4 pt-7">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D8EEFD] text-[#0369A1] text-[11px] font-extrabold">
                  Paket #{test.test_number}
                </span>

                {test.is_free ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 shadow-2xs">
                    <Unlock className="w-3 h-3 text-emerald-600" />
                    <span>Akses Gratis</span>
                  </span>
                ) : hasEntitlement ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 shadow-2xs">
                    <Unlock className="w-3 h-3 text-emerald-600" />
                    <span>Sudah Diaktivasi</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C2410C] text-[11px] font-bold border border-orange-200 shadow-2xs">
                    <Lock className="w-3 h-3 text-[#EA580C]" />
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
              <Layers className="w-3.5 h-3.5 text-[#5046E5]" />
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#5046E5]" />
            <span>Petunjuk Pelaksanaan Ujian:</span>
          </h3>

          <ul className="space-y-2 text-xs text-slate-600 font-normal leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-50 text-[#5046E5] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Stopwatch pencatat waktu pengerjaan akan langsung berjalan setelah Anda menekan tombol mulai ujian.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-50 text-[#5046E5] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Gunakan earphone/headphone untuk soal audio listening komunikasi radio VHF.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-50 text-[#5046E5] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Jawaban tersimpan otomatis secara realtime dan Anda dapat mengirim lembar ujian kapan saja setelah selesai menjawab seluruh soal.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span>Sertifikat resmi kompetensi diterbitkan otomatis apabila mencapai nilai kelulusan minimal <strong>{test.passing_grade}%</strong>.</span>
            </li>
          </ul>
        </div>

        {/* Error notification if any */}
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
            Sistem Stopwatch Pencatat Waktu Pengerjaan • Standar IMO STCW & SMCP
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* If test is locked */}
            {!test.is_free && !hasEntitlement ? (
              <>
                <Link
                  href="/student/redeem"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Punya Token?</span>
                </Link>

                <Link
                  href={`/student/checkout/${test.test_number}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-black hover:bg-neutral-800 transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-98"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-[#0284C7] hover:bg-[#0369A1] transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-98 disabled:opacity-50"
              >
                {starting ? (
                  <span>Menyiapkan Ujian...</span>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-white" />
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
