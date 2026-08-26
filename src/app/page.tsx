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
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
            <span className="font-bold text-[#0284C7]">LTE CRUISE TRAINING CENTER</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-semibold">Sekolah Perhotelan & Kapal Pesiar</span>
          </div>

          {/* Heading */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-[62px] font-extrabold text-black tracking-tight leading-[1.1]">
              Marlins English Test <br />
              <span className="bg-gradient-to-r from-black via-slate-800 to-[#0284C7] bg-clip-text text-transparent">
                Perhotelan & Kapal Pesiar
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Platform resmi evaluasi dan asesmen Bahasa Inggris standar Marlins Test untuk siswa sekolah perhotelan & kapal pesiar LTE Cruise Training Center (divisi Food & Beverage, Housekeeping, Culinary, dan Guest Service).
            </p>
          </div>

          {/* CTA Buttons - Signature Black Pill Button */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/login'}
              className="group flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-black hover:bg-neutral-800 shadow-md shadow-black/10 transition-all duration-150 hover:scale-[1.02]"
            >
              <LayoutDashboard className="w-4.5 h-4.5 text-slate-200" />
              <span>{user ? (isAdmin ? 'Buka Portal Pengelolaan' : 'Buka Dashboard Siswa') : 'Mulai Ujian Sekarang'}</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/verify"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all duration-150 hover:border-slate-300"
            >
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
              <span>Verifikasi Sertifikat</span>
            </Link>
          </div>

          {/* Key Stat Badges */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-slate-200/70 shadow-2xs hover:border-slate-300 transition-all hover:bg-white">
              <span className="font-mono text-2xl font-bold text-black">10 Paket</span>
              <p className="text-[13px] text-slate-600 font-medium mt-1">Ujian Standar Marlins</p>
            </div>
            <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-slate-200/70 shadow-2xs hover:border-slate-300 transition-all hover:bg-white">
              <span className="font-mono text-2xl font-bold text-[#0284C7]">Cruise Ready</span>
              <p className="text-[13px] text-slate-600 font-medium mt-1">Perhotelan & Kapal Pesiar</p>
            </div>
            <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-slate-200/70 shadow-2xs hover:border-slate-300 transition-all hover:bg-white">
              <span className="font-mono text-2xl font-bold text-emerald-600">100% Instant</span>
              <p className="text-[13px] text-slate-600 font-medium mt-1">Grading & E-Sertifikat</p>
            </div>
            <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-slate-200/70 shadow-2xs hover:border-slate-300 transition-all hover:bg-white">
              <span className="font-mono text-2xl font-bold text-[#EA580C]">IMO STCW</span>
              <p className="text-[13px] text-slate-600 font-medium mt-1">Standar Internasional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Showcase Section */}
      <section id="features" className="py-20 md:py-28 bg-[#FAFAFC] border-t border-b border-slate-200/60">
        <div
          ref={featuresReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 transition-all duration-700 ${
            featuresReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider block">
              Kurikulum & Fitur Unggulan
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
              Standar Kompetensi Perhotelan & Kapal Pesiar
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Sistem ujian Marlins terintegrasi yang dirancang khusus untuk siswa LTE Cruise (Hotel & Marine Training Center).
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
              <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center font-bold shadow-xs">
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
              <div className="w-12 h-12 rounded-2xl bg-[#EA580C] text-white flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-black group-hover:text-[#EA580C] transition-colors">
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
                <span className="text-[11px] font-bold text-[#EA580C] uppercase tracking-wider block mb-1">
                  LTE Cruise Portal
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-black">
                  Dashboard Siswa & Calon Kru Kapal Pesiar
                </h2>
              </div>

              <Link
                href="/student/dashboard"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-black text-white hover:bg-neutral-800 transition-all shadow-xs"
              >
                <span>Buka Dashboard Siswa</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Preview Banner - Maritime Blue / Navy Theme */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#0F172A] p-7 sm:p-9 text-white shadow-md">
              <div className="relative z-10 max-w-xl space-y-4">
                <span className="text-[11px] font-bold tracking-widest text-sky-200 uppercase block">
                  LTE Cruise • Hotel Marine Training Center
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Sistem Ujian Marlins Test Resmi
                </h3>
                <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
                  Latihan soal interaktif, asah kemampuan mendengarkan instruksi bahasa Inggris di kapal pesiar, dan dapatkan sertifikat resmi.
                </p>
                <div className="pt-2">
                  <Link
                    href="/student/tests"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-xs font-bold shadow-md hover:bg-neutral-900 transition-all hover:scale-105"
                  >
                    <span>Mulai Ujian Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 3 Quick Cards Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex items-center gap-3 hover:border-slate-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0284C7] flex items-center justify-center font-bold">
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
                  <span className="text-[10px] text-slate-400 font-medium block">Hospitality Vocab</span>
                  <h4 className="text-xs font-bold text-slate-900">F&B & Housekeeping</h4>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex items-center gap-3 hover:border-slate-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Safety & Protocols</span>
                  <h4 className="text-xs font-bold text-slate-900">IMO SMCP Standards</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tests Section */}
      <section id="tests" className="py-20 md:py-28 bg-[#FAFAFC] border-t border-slate-200/60">
        <div
          ref={testsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 transition-all duration-700 ${
            testsReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
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
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-5 hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-mono font-bold border border-slate-200">
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
                      className="group/btn w-full flex items-center justify-center gap-2.5 py-3 rounded-full text-xs font-bold text-white bg-black hover:bg-neutral-800 shadow-xs transition-all hover:scale-[1.02]"
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
