'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  FileCheck2,
  Award,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Compass,
  Layers,
  Code2,
  LayoutDashboard,
  CheckCircle2,
  Users,
} from 'lucide-react';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import Logo from '@/components/brand/Logo';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';

export default function LandingPage() {
  const { user, isAdmin, signInAsDemo } = useAuth();
  const [tests, setTests] = useState<MarlintTest[]>([]);

  useEffect(() => {
    async function loadSampleTests() {
      try {
        const { data } = await supabase
          .from('marlint_tests')
          .select('*')
          .eq('is_active', true)
          .order('test_number', { ascending: true })
          .limit(3);

        if (data) {
          setTests(data as MarlintTest[]);
        }
      } catch (e) {
        console.error('Error loading tests for landing:', e);
      }
    }

    loadSampleTests();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#5046E5] selection:text-white flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Soft background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-indigo-200/50 via-purple-100/40 to-cyan-100/40 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-indigo-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-[#5046E5]" />
            <span>Platform Standar Uji Kemahiran Bahasa Inggris Maritim Pelaut</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Marlins English Language <br />
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
                Test for Seafarers
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Persiapkan dan evaluasi kompetensi Bahasa Inggris Maritim Anda dengan format soal standar IMO SMCP, penilaian otomatis realtime, serta dashboard modern terpadu.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/student/dashboard'}
              className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm sm:text-base text-white bg-[#5046E5] hover:bg-[#4338CA] shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Buka Dashboard Siswa</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/verify"
              className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verifikasi Sertifikat</span>
            </Link>
          </div>

          {/* Key Stat Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <span className="font-mono text-2xl font-black text-[#5046E5]">8+ Tipe</span>
              <p className="text-xs text-slate-500 font-semibold mt-1">Soal Interaktif Maritim</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <span className="font-mono text-2xl font-black text-indigo-700">CEFR A1–C1</span>
              <p className="text-xs text-slate-500 font-semibold mt-1">Standar Penjenjangan</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <span className="font-mono text-2xl font-black text-emerald-600">100% Instant</span>
              <p className="text-xs text-slate-500 font-semibold mt-1">Grading & Sertifikat</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <span className="font-mono text-2xl font-black text-amber-600">IMO SMCP</span>
              <p className="text-xs text-slate-500 font-semibold mt-1">Standar Komunikasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Dashboard Live Preview Showcase */}
      <section className="py-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#5046E5] uppercase tracking-wider block">
                  New Modern Interface
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                  Tampilan Dashboard Modern & Simpel
                </h2>
              </div>

              <Link
                href="/student/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#EEF0FF] text-[#5046E5] hover:bg-[#E0E4FF] transition-all"
              >
                <span>Eksplor Dashboard Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Preview Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6366F1] via-[#5046E5] to-[#3730A3] p-6 sm:p-8 text-white shadow-md">
              <div className="relative z-10 max-w-lg space-y-3">
                <span className="text-[10px] font-bold tracking-widest text-indigo-200 uppercase block">
                  Online Course
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  Sharpen Your Skills with Professional Online Courses
                </h3>
                <Link
                  href="/student/tests"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E1B4B] text-white text-xs font-bold shadow-md hover:scale-105 transition-all"
                >
                  <span>Join Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* 3 Quick Cards Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">2/8 watched</span>
                  <h4 className="text-xs font-bold text-slate-900">UI/UX Design</h4>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#EC4899] flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">3/8 watched</span>
                  <h4 className="text-xs font-bold text-slate-900">Branding</h4>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ECFEFF] text-[#06B6D4] flex items-center justify-center font-bold">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">6/12 watched</span>
                  <h4 className="text-xs font-bold text-slate-900">Front End</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tests Section */}
      <section id="tests" className="py-16 bg-slate-50/70 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                Paket Ujian Marlins Unggulan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Pilih paket tes untuk mengukur kesiapan menghadapi standar IMO STCW pelayaran internasional.
              </p>
            </div>

            <Link
              href="/student/tests"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5046E5] hover:text-[#4338CA]"
            >
              <span>Lihat Semua Paket</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tests.length === 0 ? (
              <div className="col-span-3 p-8 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-xs shadow-2xs">
                Memuat data ujian...
              </div>
            ) : (
              tests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between space-y-5 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-indigo-50 text-[#5046E5] text-xs font-mono font-bold border border-indigo-100">
                        Tes #{test.test_number}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        {test.is_free ? 'GRATIS' : formatPriceIDR(test.price)}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-[#5046E5] transition-colors">
                      {test.test_name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 font-normal">
                      {test.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>{test.duration} Menit</span>
                      <span>{test.total_questions} Soal</span>
                      <span>Pass: <strong className="text-emerald-600 font-bold">{test.passing_grade}%</strong></span>
                    </div>

                    <Link
                      href={`/student/test/${test.test_number}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold text-white bg-[#5046E5] hover:bg-[#4338CA] shadow-md shadow-indigo-500/20 transition-all"
                    >
                      <span>Mulai Ujian</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <Logo size="sm" showSubtitle={true} subtitleText="Maritime English Platform" />
          <p>© {new Date().getFullYear()} Marlins Maritime System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
