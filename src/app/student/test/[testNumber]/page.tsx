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
          const { data: entData } = await supabase
            .from('test_entitlements')
            .select('id')
            .eq('user_id', user.id)
            .eq('test_number', testNumber)
            .eq('is_active', true)
            .maybeSingle();

          setHasEntitlement(!!entData || data.is_free);
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

    try {
      setStarting(true);
      setErrorMsg(null);

      const { data, error } = await supabase.rpc('start_test_attempt', {
        p_test_number: test.test_number,
      });

      if (error) {
        if (error.message.includes('TEST_ACCESS_REQUIRED') && !test.is_free && !hasEntitlement) {
          setErrorMsg('Tes ini membutuhkan token akses atau aktivasi. Silakan klaim voucher di menu Redeem.');
          return;
        } else {
          // Direct fallback for instant demo testing
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

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top Navigation Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/tests"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#5046E5] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Katalog Ujian</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Standar STCW 2010</span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
        {/* Header Section */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-[#5046E5] text-[11px] font-bold border border-indigo-100">
                  Marlins #{test.test_number}
                </span>

                {test.is_free ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                    <Unlock className="w-3 h-3" />
                    <span>Akses Gratis</span>
                  </span>
                ) : hasEntitlement ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                    <Unlock className="w-3 h-3" />
                    <span>Sudah Diaktivasi</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>{formatPriceIDR(test.price)}</span>
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                {test.test_name}
              </h1>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Durasi</span>
                <span className="text-xs font-bold text-[#5046E5]">{test.duration} mnt</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Soal</span>
                <span className="text-xs font-bold text-slate-900">{displayTotalQuestions} butir</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Passing</span>
                <span className="text-xs font-bold text-emerald-600">{test.passing_grade}%</span>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
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
              <span>Waktu ujian ({test.duration} menit) akan langsung berjalan setelah menekan tombol mulai.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-50 text-[#5046E5] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Gunakan earphone/headphone untuk soal audio listening komunikasi radio VHF.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-50 text-[#5046E5] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Jawaban tersimpan otomatis secara realtime dan ujian otomatis tersubmit jika waktu habis.</span>
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
            Estimasi waktu pengerjaan: {test.duration} Menit • Hasil instan realtime
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!test.is_free && !hasEntitlement && (
              <Link
                href="/student/redeem"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Punya Token?</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleStartAttempt}
              disabled={starting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#5046E5] hover:bg-[#4338CA] transition-all cursor-pointer disabled:opacity-50"
            >
              {starting ? (
                <span>Menyiapkan Ujian...</span>
              ) : (
                <>
                  <span>Mulai Ujian Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
