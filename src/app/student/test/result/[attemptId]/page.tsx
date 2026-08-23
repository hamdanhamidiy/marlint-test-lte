'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
  Calendar,
  Layers,
  Headphones,
  Volume2,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { StudentResult, Certificate } from '@/lib/supabase/types';
import { getCategoryInfo, getLevelBadge, formatDateIndo } from '@/lib/utils';

export default function TestResultPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const attemptId = params.attemptId as string;

  const [result, setResult] = useState<StudentResult | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      try {
        setLoading(true);

        const { data: resData } = await supabase
          .from('student_results')
          .select('*')
          .or(`attempt_id.eq.${attemptId},id.eq.${attemptId}`)
          .maybeSingle();

        if (resData) {
          const res = resData as StudentResult;
          setResult(res);

          if (res.is_passed) {
            confetti({
              particleCount: 90,
              spread: 60,
              origin: { y: 0.6 },
            });

            const { data: certData } = await supabase
              .from('certificates')
              .select('*')
              .eq('result_id', res.id)
              .maybeSingle();

            if (certData) {
              setCertificate(certData as Certificate);
            }
          }
        }
      } catch (err) {
        console.error('Error loading result:', err);
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      loadResult();
    }
  }, [attemptId]);

  if (loading) {
    return (
      <div className="p-16 text-center bg-white border border-slate-100 rounded-[32px] max-w-md mx-auto space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#5046E5] flex items-center justify-center mx-auto animate-pulse">
          <Award className="w-7 h-7 animate-bounce" />
        </div>
        <h2 className="font-heading text-base font-extrabold text-slate-900">Mengkalkulasi Hasil Ujian...</h2>
        <p className="text-xs text-slate-400">Menghitung level CEFR dan evaluasi kompetensi maritim...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-10 text-center bg-white border border-slate-100 rounded-[32px] max-w-lg mx-auto space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <XCircle className="w-7 h-7" />
        </div>
        <h2 className="font-heading text-base font-extrabold text-slate-900">Hasil Ujian Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">Data hasil untuk sesi ini belum tersedia.</p>
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5046E5] text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:bg-[#4338CA] transition-all"
        >
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>
    );
  }

  const levelInfo = getLevelBadge(result.level);
  const categories = result.category_scores || {};

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Hero Card */}
      <div
        className={`p-6 sm:p-10 rounded-[32px] border text-center space-y-6 shadow-sm relative overflow-hidden ${
          result.is_passed
            ? 'border-emerald-100 bg-gradient-to-b from-emerald-50/70 via-white to-white'
            : 'border-rose-100 bg-gradient-to-b from-rose-50/70 via-white to-white'
        }`}
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-white border border-slate-200/80 shadow-2xs text-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5046E5]" />
            <span>{result.test_name}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {result.is_passed ? '🎉 Selamat, Anda Lulus Ujian Marlins!' : 'Hasil Ujian Belum Memenuhi Passing Grade'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
            {result.is_passed
              ? 'Anda berhasil mencapai passing grade standar Marlins English Language Test for Seafarers IMO STCW 2010.'
              : 'Jangan berkecil hati. Pelajari kembali materi modul maritim dan ikuti kembali tes untuk meningkatkan skor kompetensi Anda.'}
          </p>
        </div>

        {/* 4 Score & Badges Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Skor Akhir</span>
            <span className="font-mono text-3xl font-extrabold text-[#5046E5]">{result.score}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Level CEFR</span>
            <span className="font-mono text-3xl font-extrabold text-indigo-700">{result.level}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Jawaban Benar</span>
            <span className="font-mono text-2xl font-extrabold text-emerald-600">
              {result.correct_answers} / {result.total_questions}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Poin Kemahiran</span>
            <span className="font-mono text-2xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              +{result.points_earned} XP
            </span>
          </div>
        </div>

        {/* Action Button: View Certificate if passed */}
        {result.is_passed && certificate && (
          <div className="pt-2">
            <Link
              href={`/student/certificates/${certificate.id}`}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
            >
              <Award className="w-5 h-5" />
              <span>Lihat & Cetak Sertifikat Resmi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Competency Breakdown by Category */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div>
          <h2 className="font-heading text-base sm:text-lg font-extrabold text-slate-900">
            Analisis Penguasaan Kategori Bahasa Inggris Maritim
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Rincian performa kompetensi pada setiap modul pengujian standar Marlins
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(categories).map(([catKey, scoreDetail]) => {
            const info = getCategoryInfo(catKey);
            const CatIcon = getCategoryIcon(catKey);
            const percent = scoreDetail.total > 0 ? Math.round((scoreDetail.correct / scoreDetail.total) * 100) : 0;

            return (
              <div
                key={catKey}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3.5 ${info.bg} ${info.border}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-2xs">
                      <CatIcon className={`w-4 h-4 ${info.color}`} />
                    </div>
                    <span className={`text-xs sm:text-sm font-extrabold ${info.color}`}>{info.name}</span>
                  </div>
                  <span className="font-mono text-base font-extrabold text-slate-900">{percent}%</span>
                </div>

                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5046E5] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Skor: <strong>{scoreDetail.correct}</strong> dari {scoreDetail.total} benar</span>
                  <span className={`font-bold ${percent >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {percent >= 70 ? '✓ Menguasai' : 'Perlu Peningkatan'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link
          href="/student/tests"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Kembali ke Katalog Tes</span>
        </Link>

        <Link
          href="/student/dashboard"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-full text-xs font-extrabold text-white bg-[#5046E5] hover:bg-[#4338CA] shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
        >
          <span>Ke Dashboard Siswa</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
