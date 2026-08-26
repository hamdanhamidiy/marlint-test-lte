'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Compass,
  Layers,
  Code2,
  LayoutDashboard,
  Award,
  CheckCircle2,
  FileCheck2,
  Ship,
  Utensils,
  Hotel,
  QrCode,
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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#EA580C] selection:text-white flex flex-col font-sans">
      <PublicNavbar />

      {/* Hero Section - LTE Cruise Hotel & Marine Training Theme */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-36 bg-white">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-sky-100/40 via-blue-50/30 to-orange-50/20 blur-[120px] pointer-events-none rounded-full" />

        <div
          ref={heroReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 transition-all duration-700 ${
            heroReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200/80 text-slate-800 text-xs sm:text-[13px] font-medium shadow-2xs hover:border-slate-300 transition-colors">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold text-[#0284C7]">LTE CRUISE TRAINING CENTER</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-semibold">Sekolah Perhotelan & Kapal Pesiar</span>
          </div>

          {/* Heading */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-[62px] font-extrabold text-black tracking-tight leading-[1.1]">
              Marlins English Test <br />
              <span className="bg-gradient-to-r from-black via-[#0369A1] to-[#0284C7] bg-clip-text text-transparent">
                Perhotelan & Kapal Pesiar
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Platform resmi evaluasi dan asesmen Bahasa Inggris standar Marlins Test untuk siswa sekolah perhotelan & kapal pesiar LTE Cruise Training Center (divisi Food & Beverage, Housekeeping, Culinary, dan Guest Service).
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/login'}
              className="group flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] shadow-md shadow-sky-500/25 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LayoutDashboard className="w-4.5 h-4.5 text-slate-200" />
              <span>{user ? (isAdmin ? 'Buka Portal Pengelolaan' : 'Buka Dashboard Siswa') : 'Mulai Ujian Sekarang'}</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/verify"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-slate-800 bg-white hover:bg-sky-50/50 border border-slate-200/90 hover:border-[#0284C7] hover:text-[#0284C7] shadow-2xs transition-all duration-150 hover:scale-[1.02]"
            >
              <QrCode className="w-4.5 h-4.5 text-[#0284C7]" />
              <span>Verifikasi Sertifikat</span>
            </Link>
          </div>
        </div>

        {/* Minimalist Stats Strip */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs text-center">
            <div className="space-y-1">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-black">10 Paket</span>
              <p className="text-xs text-slate-500 font-medium">Ujian Standar STCW</p>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-600">60 Soal</span>
              <p className="text-xs text-slate-500 font-medium">Evaluasi Stopwatch</p>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0284C7]">CEFR A1–C1</span>
              <p className="text-xs text-slate-500 font-medium">Standar Kelulusan</p>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-500">100% Valid</span>
              <p className="text-xs text-slate-500 font-medium">Sertifikat Resmi QR</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-[#F8F9FA] border-t border-b border-slate-200/80">
        <div
          ref={featuresReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 transition-all duration-700 ${
            featuresReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
              Fitur Standar Asesmen Marlins Test
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              Dirancang khusus untuk melatih kecakapan percakapan dan kepatuhan standar keselamatan kerja di kapal pesiar internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-black group-hover:text-[#0284C7] transition-colors">
                Hospitality & Cruise English
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kosakata dan dialog interaktif khusus departemen Food & Beverage, Housekeeping, Galley, Front Desk, dan layanan tamu kapal pesiar.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center font-bold shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-black group-hover:text-[#0284C7] transition-colors">
                Kalkulasi CEFR & Skor Instan
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Penilaian otomatis langsung setelah ujian dengan pemetaan level CEFR (A1–C1) untuk kelayakan rekrutmen perusahaan kapal pesiar internasional.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-black group-hover:text-amber-600 transition-colors">
                Sertifikat Resmi LTE Cruise
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sertifikat kelulusan digital resmi dengan QR code unik untuk verifikasi keaslian oleh agensi kapal pesiar dan hotel internasional.
              </p>
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
          <div className="bg-[#F8F9FA] rounded-[32px] p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/70 pb-6">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                  LTE Cruise Portal
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-black">
                  Dashboard Siswa & Calon Kru Kapal Pesiar
                </h2>
              </div>

              <Link
                href="/student/dashboard"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white hover:from-[#0369A1] hover:to-[#075985] transition-all shadow-md shadow-sky-500/25"
              >
                <span>Buka Dashboard Siswa</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Preview Banner - Royal Indigo Gradient */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] p-7 sm:p-9 text-white shadow-md">
              <div className="relative z-10 max-w-xl space-y-4">
                <span className="text-[11px] font-bold tracking-widest text-cyan-200 uppercase block">
                  LTE Cruise • Hotel Marine Training Center
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Sistem Ujian Marlins Test Resmi
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Latihan soal interaktif, asah kemampuan mendengarkan instruksi bahasa Inggris di kapal pesiar, dan dapatkan sertifikat resmi.
                </p>
                <div className="pt-2">
                  <Link
                    href="/student/tests"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-md transition-all hover:scale-105"
                  >
                    <span>Mulai Ujian Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 3 Quick Cards Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex items-center gap-3 hover:border-sky-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Listening & Guest Orders</span>
                  <h4 className="text-xs font-bold text-slate-900">Cruise Communication</h4>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex items-center gap-3 hover:border-slate-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center font-bold">
                  <Hotel className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Hospitality Standards</span>
                  <h4 className="text-xs font-bold text-slate-900">F&B & Housekeeping</h4>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex items-center gap-3 hover:border-slate-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Verifikasi QR Code</span>
                  <h4 className="text-xs font-bold text-slate-900">Validitas Sertifikat</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Packages Catalog Preview */}
      <section className="py-20 md:py-28 bg-[#F8F9FA]">
        <div
          ref={testsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 transition-all duration-700 ${
            testsReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
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
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-5 hover:border-sky-300 hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100 text-xs font-mono font-bold">
                        Tes #{test.test_number}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        {test.is_free ? 'GRATIS' : formatPriceIDR(test.price)}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
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
                      className="group/btn w-full flex items-center justify-center gap-2.5 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Mulai Ujian</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-slate-500">
          <Logo size="sm" showSubtitle={true} subtitleText="Hotel & Marine Training Center" variant="dark" />
          <p>&copy; {new Date().getFullYear()} LTE Cruise - Hotel & Marine Training Center. Marlins Test System.</p>
        </div>
      </footer>
    </div>
  );
}
