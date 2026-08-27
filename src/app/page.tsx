'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Compass,
  Layers,
  LayoutDashboard,
  Award,
  CheckCircle2,
  FileCheck2,
  Utensils,
  Hotel,
  QrCode,
  Clock,
  Globe2,
  Check,
  TrendingUp,
} from 'lucide-react';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import Logo from '@/components/brand/Logo';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';

// Simple hook for fade-in-up on scroll
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export default function LandingPage() {
  const { user, isAdmin } = useAuth();
  const [tests, setTests] = useState<MarlintTest[]>([]);

  // Scroll reveal refs
  const heroReveal = useScrollReveal();
  const statsReveal = useScrollReveal();
  const dashReveal = useScrollReveal();
  const featuresReveal = useScrollReveal();
  const testsReveal = useScrollReveal();

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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#0284C7] selection:text-white flex flex-col font-sans">
      <PublicNavbar />

      {/* Hero Section - Formal, Authoritative & Prestigious */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-36 bg-gradient-to-b from-slate-50/50 via-white to-white">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-sky-200/20 via-blue-100/20 to-teal-100/15 blur-[140px] pointer-events-none rounded-full" />

        <div
          ref={heroReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 transition-all duration-700 ${
            heroReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {/* Executive Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-xs sm:text-[13px] font-semibold shadow-xs hover:border-sky-300 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-ping" />
            <span className="font-extrabold text-[#0284C7] tracking-wider uppercase">LTE CRUISE TRAINING CENTER</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Hotel & Marine Training Academy</span>
          </div>

          {/* Heading */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-[64px] font-extrabold text-slate-950 tracking-tight leading-[1.08]">
              Standardized Marlins Test <br />
              <span className="bg-gradient-to-r from-slate-950 via-[#0369A1] to-[#0284C7] bg-clip-text text-transparent">
                Perhotelan & Kapal Pesiar
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Platform resmi asesmen Bahasa Inggris standar Marlins Test untuk peserta didik sekolah perhotelan & calon kru kapal pesiar internasional (Food & Beverage, Housekeeping, Culinary, dan Guest Service).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/login'}
              className="group flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:opacity-95 shadow-lg shadow-sky-500/25 transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-xl hover:shadow-sky-500/30 active:scale-[0.97]"
            >
              <LayoutDashboard className="w-4.5 h-4.5 text-cyan-200 group-hover:rotate-6 transition-transform duration-300" />
              <span>{user ? (isAdmin ? 'Buka Portal Admin' : 'Buka Dashboard Siswa') : 'Mulai Ujian Sekarang'}</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/verify"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-slate-800 bg-white hover:bg-sky-50/50 border border-slate-200/90 hover:border-sky-300 hover:text-[#0284C7] shadow-xs transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-md active:scale-[0.97]"
            >
              <QrCode className="w-4.5 h-4.5 text-[#0284C7]" />
              <span>Verifikasi Sertifikat</span>
            </Link>
          </div>
        </div>

        {/* Minimalist Professional Stats Strip */}
        <div
          ref={statsReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 transition-all duration-700 delay-100 ${
            statsReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-[28px] bg-white border border-slate-200/90 shadow-sm text-center">
            <div className="space-y-1">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950">10 Paket</span>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Standar IMO STCW</p>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0284C7]">60 Soal</span>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Evaluasi Stopwatch</p>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-600">CEFR A1–C1</span>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Skor Kelulusan</p>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-500">100% Valid</span>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Sertifikat Resmi QR</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Numbered Badges & Modern Card Hover */}
      <section id="features" className="py-20 md:py-28 bg-[#F8FAFC] border-t border-b border-slate-200/80">
        <div
          ref={featuresReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 transition-all duration-700 ${
            featuresReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[#0284C7] text-xs font-bold uppercase tracking-wider">
              <span>Keunggulan Platform</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Standar Evaluasi Bahasa Internasional
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              Dirancang secara komprehensif untuk melatih kecakapan percakapan maritim, pemahaman instruksi, dan kepatuhan keselamatan kerja di kapal pesiar internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="pro-card p-8 space-y-5 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <Utensils className="w-5 h-5 text-cyan-300" />
                  </div>
                  <span className="text-xs font-bold font-mono tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    01
                  </span>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-slate-950 group-hover:text-[#0284C7] transition-colors duration-200">
                  Hospitality & Cruise English
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Kosakata dan dialog interaktif terapan untuk departemen Food & Beverage, Housekeeping, Culinary, Front Desk, dan layanan tamu internasional.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#0284C7]">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Simulasi percakapan nyata di kapal</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="pro-card p-8 space-y-5 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold font-mono tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    02
                  </span>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-slate-950 group-hover:text-[#0284C7] transition-colors duration-200">
                  Kalkulasi CEFR & Skor Instan
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Penilaian otomatis komprehensif setelah selesai ujian dengan pemetaan level CEFR (A1–C1) untuk kelayakan rekrutmen perusahaan kapal pesiar internasional.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#0284C7]">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Hasil instan dan analisis butir soal</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="pro-card p-8 space-y-5 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold font-mono tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    03
                  </span>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-slate-950 group-hover:text-amber-600 transition-colors duration-200">
                  Sertifikat Resmi Terverifikasi
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Sertifikat kelulusan digital resmi LTE Cruise dilengkapi QR Code terenkripsi untuk validasi keaslian oleh agensi pelayaran internasional.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-600">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Terintegrasi dengan sistem verifikasi publik</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Dashboard Live Preview Showcase */}
      <section className="py-20 md:py-28 bg-white">
        <div
          ref={dashReveal.ref}
          className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            dashReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="bg-[#F8FAFC] rounded-[32px] p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/70 pb-6">
              <div>
                <span className="text-[11px] font-extrabold text-[#0284C7] uppercase tracking-wider block mb-1">
                  PORTAL SISWA TERPADU
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950">
                  Dashboard Siswa & Calon Kru Kapal Pesiar
                </h2>
              </div>

              <Link
                href="/student/dashboard"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white hover:opacity-95 transition-all duration-200 shadow-md shadow-sky-500/20"
              >
                <span>Buka Dashboard Siswa</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Preview Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] p-8 sm:p-10 text-white shadow-md">
              <div className="relative z-10 max-w-xl space-y-4">
                <span className="text-[11px] font-extrabold tracking-widest text-cyan-200 uppercase block">
                  LTE CRUISE • HOTEL & MARINE TRAINING CENTER
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Sistem Ujian Marlins Test Resmi
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  Latihan soal interaktif, asah kemampuan mendengarkan instruksi bahasa Inggris di kapal pesiar, dan dapatkan sertifikat kelulusan standar industri.
                </p>
                <div className="pt-2">
                  <Link
                    href="/student/tests"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold shadow-md transition-all duration-200 hover:scale-105"
                  >
                    <span>Mulai Ujian Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 3 Quick Cards Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:border-sky-300 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Listening & Orders</span>
                  <h4 className="text-xs font-bold text-slate-900">Maritime Communication</h4>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:border-sky-300 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center font-bold shrink-0">
                  <Hotel className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Hospitality Standard</span>
                  <h4 className="text-xs font-bold text-slate-900">F&B & Housekeeping</h4>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:border-sky-300 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Verifikasi QR Code</span>
                  <h4 className="text-xs font-bold text-slate-900">Validitas Sertifikat</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Packages Catalog Preview */}
      <section id="tests" className="py-20 md:py-28 bg-[#F8FAFC]">
        <div
          ref={testsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 transition-all duration-700 ${
            testsReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[#0284C7] text-xs font-bold uppercase tracking-wider">
                <span>Katalog Evaluasi</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Paket Ujian Marlins Test
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-normal">
                Pilih paket evaluasi standar Marlins Test untuk kesiapan karier perhotelan & kapal pesiar internasional.
              </p>
            </div>

            <Link
              href="/student/tests"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors"
            >
              <span>Lihat Semua Paket</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tests.length === 0 ? (
              <div className="col-span-3 p-10 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-xs shadow-2xs">
                Memuat data ujian...
              </div>
            ) : (
              tests.map((test) => (
                <div
                  key={test.id}
                  className="pro-card p-6 flex flex-col justify-between space-y-5 group hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/15 hover:-translate-y-1.5 transition-all duration-300 ease-out"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100 text-xs font-mono font-bold group-hover:bg-sky-100 transition-colors duration-300">
                        Tes #{test.test_number}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        {test.is_free ? 'GRATIS' : formatPriceIDR(test.price)}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors duration-200">
                      {test.test_name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 font-normal leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>Stopwatch Waktu</span>
                      <span>{test.total_questions || 60} Soal</span>
                      <span>Pass: <strong className="text-emerald-600 font-bold">{test.passing_grade}%</strong></span>
                    </div>

                    <Link
                      href={`/student/test/${test.test_number}`}
                      className="group/btn w-full flex items-center justify-center gap-2.5 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:opacity-95 shadow-md shadow-sky-500/20 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Mulai Ujian</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-slate-500 font-medium">
          <Logo size="sm" showSubtitle={true} subtitleText="Hotel & Marine Training Center" variant="dark" />
          <p>&copy; {new Date().getFullYear()} LTE Cruise - Hotel & Marine Training Center. Marlins Test System.</p>
        </div>
      </footer>
    </div>
  );
}
