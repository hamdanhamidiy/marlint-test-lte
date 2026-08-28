'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  LayoutDashboard,
  Award,
  CheckCircle2,
  FileCheck2,
  Utensils,
  Hotel,
  QrCode,
  Clock,
  Check,
  ArrowUpRight,
  Headphones,
  BookOpen,
  Anchor,
  Compass,
  ChevronRight,
  Layers,
  Sparkle,
} from 'lucide-react';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import Logo from '@/components/brand/Logo';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';

// Standard 6 packages seed data
const DEFAULT_6_TESTS: MarlintTest[] = [
  {
    id: 'test-1',
    test_number: 1,
    test_name: 'Marlins Test 1 – Cruise Hospitality & Maritime English',
    description: 'Placement & Diagnostic Maritime English Standard Assessment untuk staf F&B, Housekeeping, dan Guest Service.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    is_free: true,
    price: 0,
    is_active: true,
    created_at: new Date().toISOString(),
  } as MarlintTest,
  {
    id: 'test-2',
    test_number: 2,
    test_name: 'Marlins Test 2 – Deck & Engine Operations',
    description: 'Elementary maritime communication, deck work routines, safety commands, and engine room vocabulary.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    is_free: false,
    price: 49000,
    is_active: true,
    created_at: new Date().toISOString(),
  } as MarlintTest,
  {
    id: 'test-3',
    test_number: 3,
    test_name: 'Marlins Test 3 – Bridge Watchkeeping & COLREGs',
    description: 'VHF radio protocol, lookout procedures, compass bearings, and navigational watchkeeping communication.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    is_free: false,
    price: 49000,
    is_active: true,
    created_at: new Date().toISOString(),
  } as MarlintTest,
  {
    id: 'test-4',
    test_number: 4,
    test_name: 'Marlins Test 4 – Tanker Operations & IMDG Cargo Handling',
    description: 'Hazardous chemical communication, inert gas protocols, MSDS reading, and cargo transfer safety.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    is_free: false,
    price: 49000,
    is_active: true,
    created_at: new Date().toISOString(),
  } as MarlintTest,
  {
    id: 'test-5',
    test_number: 5,
    test_name: 'Marlins Test 5 – Offshore & Dynamic Positioning',
    description: 'Offshore support vessel logistics, DP station keeping communication, and helideck operations.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    is_free: false,
    price: 69000,
    is_active: true,
    created_at: new Date().toISOString(),
  } as MarlintTest,
  {
    id: 'test-6',
    test_number: 6,
    test_name: 'Marlins Test 6 – Container & Bulk Operations',
    description: 'Bulk carrier IMSBC code, container lashing communication, and maritime cyber security compliance.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    is_free: false,
    price: 69000,
    is_active: true,
    created_at: new Date().toISOString(),
  } as MarlintTest,
];

// Modern Scroll Reveal Hook with progressive entry
function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      setIsVisible(true);
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);

    // Initial check in case already inside viewport
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setIsVisible(true);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export default function LandingPage() {
  const { user, isAdmin } = useAuth();
  const [tests, setTests] = useState<MarlintTest[]>(DEFAULT_6_TESTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'specialist'>('all');

  // Scroll reveal observers for smooth sectional storytelling
  const heroReveal = useScrollReveal(0.02);
  const statsReveal = useScrollReveal(0.08);
  const featuresReveal = useScrollReveal(0.08);
  const stepsReveal = useScrollReveal(0.08);
  const testsReveal = useScrollReveal(0.08);
  const certReveal = useScrollReveal(0.08);

  useEffect(() => {
    async function loadTests() {
      try {
        const { data } = await supabase
          .from('marlint_tests')
          .select('*')
          .eq('is_active', true)
          .order('test_number', { ascending: true })
          .limit(6);

        if (data && data.length > 0) {
          setTests(data.slice(0, 6) as MarlintTest[]);
        } else {
          setTests(DEFAULT_6_TESTS);
        }
      } catch (e) {
        console.error('Error loading tests:', e);
        setTests(DEFAULT_6_TESTS);
      }
    }

    loadTests();
  }, []);

  const filteredTests = tests.filter((t) => {
    if (activeFilter === 'free') return t.is_free || t.test_number === 1;
    if (activeFilter === 'specialist') return !t.is_free && t.test_number > 1;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FCFDFE] text-slate-900 selection:bg-[#0284C7] selection:text-white flex flex-col font-sans antialiased overflow-x-hidden">
      <PublicNavbar />

      {/* =========================================================================
          HERO SECTION — Minimalist, Clean, High Authority
          ========================================================================= */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 md:pt-24 md:pb-28 overflow-hidden">
        {/* Soft Background Ambient Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(2,132,199,0.09),transparent_70%)] pointer-events-none" />

        <div
          ref={heroReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 relative z-10 reveal-init ${
            heroReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          {/* Executive Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/90 shadow-2xs text-slate-700 text-xs font-semibold hover:border-sky-300 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
            <span className="font-extrabold text-[#0284C7] uppercase tracking-wider">LTE CRUISE</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">Standar Resmi Marlins Test</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-950 tracking-tight leading-[1.15] sm:leading-[1.1]">
              Standardized Marlins Test <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-slate-950 via-[#0369A1] to-[#0284C7] bg-clip-text text-transparent">
                Perhotelan & Kapal Pesiar
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Platform evaluasi kecakapan Bahasa Inggris standar internasional Marlins Test untuk peserta didik sekolah perhotelan dan calon kru kapal pesiar dunia.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 sm:pt-2">
            <Link
              href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/login'}
              className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:opacity-95 shadow-lg shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-200" />
              <span>{user ? (isAdmin ? 'Buka Portal Admin' : 'Buka Dashboard Siswa') : 'Mulai Ujian Sekarang'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/verify"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-sky-300 hover:text-[#0284C7] shadow-2xs transition-all duration-200"
            >
              <QrCode className="w-4 h-4 text-[#0284C7]" />
              <span>Verifikasi Sertifikat</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          {/* Trust Highlights Checklist */}
          <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Standar IMO STCW 2010</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Passing Grade 70% & CEFR</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>e-Sertifikat QR Digital</span>
            </span>
          </div>
        </div>

        {/* =========================================================================
            STATS STRIP — Crisp, Modern, High Contrast
            ========================================================================= */}
        <div
          ref={statsReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 reveal-init ${
            statsReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs text-center">
            <div className="p-3 space-y-1">
              <span className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 block">6 Paket Unggulan</span>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Kurikulum Terpadu</p>
            </div>
            <div className="p-3 space-y-1 border-l border-slate-100">
              <span className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0284C7] block">60 Butir</span>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Stopwatch 60 Menit</p>
            </div>
            <div className="p-3 space-y-1 border-l border-slate-100">
              <span className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-600 block">A1–C1</span>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Pemetaan CEFR</p>
            </div>
            <div className="p-3 space-y-1 border-l border-slate-100">
              <span className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-500 block">100% Valid</span>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">QR Code Terdaftar</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CORE FEATURES — 3 Essential Highlights Only
          ========================================================================= */}
      <section id="features" className="py-16 md:py-24 bg-slate-50/70 border-y border-slate-200/70">
        <div
          ref={featuresReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 reveal-init ${
            featuresReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-[11px] font-bold uppercase tracking-wider">
              <span>Keunggulan Platform</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
              Standar Evaluasi Bahasa Internasional
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Disusun untuk menguji pemahaman instruksi, komunikasi tamu, dan koordinasi kerja di atas kapal pesiar internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200/80 shadow-2xs card-modern-hover flex flex-col justify-between space-y-4 group">
              <div className="space-y-3.5">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors">
                  Cruise Hospitality & Maritime English
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Kosakata praktis dan dialog interaktif untuk departemen Food & Beverage, Housekeeping, Culinary, dan pelayanan tamu internasional.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Simulasi percakapan nyata</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200/80 shadow-2xs card-modern-hover flex flex-col justify-between space-y-4 group">
              <div className="space-y-3.5">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Headphones className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors">
                  7 Tipe Interaksi & Audio VHF
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Dilengkapi audio percakapan radio VHF, penyusunan kalimat acak, isian kata rumpang, dan pengenalan diagram teknis maritim.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Format evaluasi interaktif</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200/80 shadow-2xs card-modern-hover flex flex-col justify-between space-y-4 group">
              <div className="space-y-3.5">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors">
                  Sertifikasi & Verifikasi Instan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  e-Sertifikat kelulusan terbit seketika dengan QR Code resmi untuk validasi keaslian oleh agensi pelayaran internasional.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Validasi online 24/7 di portal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3 SIMPLE STEPS FLOW — Clean Process
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-white">
        <div
          ref={stepsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 reveal-init ${
            stepsReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Alur Mengikuti Evaluasi Ujian
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Tiga langkah mudah untuk menyelesaikan asesmen dan memperoleh sertifikat kelulusan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-[24px] bg-[#F8FAFC] border border-slate-200/80 space-y-3 relative card-modern-hover">
              <span className="w-8 h-8 rounded-full bg-[#0284C7] text-white text-xs font-mono font-extrabold flex items-center justify-center shadow-xs">
                1
              </span>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Pilih Paket Ujian
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Mulai dengan Placement Test gratis (Tes #1) atau aktifkan paket spesialisasi departemen menggunakan kode token / pembayaran QRIS.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-[24px] bg-[#F8FAFC] border border-slate-200/80 space-y-3 relative card-modern-hover">
              <span className="w-8 h-8 rounded-full bg-[#0284C7] text-white text-xs font-mono font-extrabold flex items-center justify-center shadow-xs">
                2
              </span>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Kerjakan 60 Soal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Jawab soal dalam durasi stopwatch 60 menit dengan navigasi fleksibel, audio listening, dan penyimpanan jawaban otomatis.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-[24px] bg-[#F8FAFC] border border-slate-200/80 space-y-3 relative card-modern-hover">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-mono font-extrabold flex items-center justify-center shadow-xs">
                3
              </span>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Dapatkan Sertifikat
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Lihat skor instan, pemetaan level CEFR (A1–C1), pembahasan ilmiah soal, dan unduh e-Sertifikat resmi standar STCW.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXAM CATALOG SHOWCASE — Exactly 6 Test Packages
          ========================================================================= */}
      <section id="tests" className="py-16 md:py-24 bg-slate-50/70 border-t border-slate-200/70">
        <div
          ref={testsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 reveal-init ${
            testsReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-[11px] font-bold uppercase tracking-wider">
                <span>Katalog Evaluasi</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Paket Ujian Marlins Test Pilihan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                Menampilkan 6 paket evaluasi standar IMO SMCP terpopuler sesuai jenjang karier kapal Anda.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-full self-start md:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#0284C7] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua (6)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('free')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'free'
                    ? 'bg-[#0284C7] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gratis
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('specialist')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'specialist'
                    ? 'bg-[#0284C7] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Spesialisasi
              </button>
            </div>
          </div>

          {/* Cards Grid — Strictly 6 Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTests.slice(0, 6).map((test, idx) => (
              <div
                key={test.id}
                className={`bg-white p-6 rounded-[24px] border border-slate-200/80 shadow-2xs card-modern-hover flex flex-col justify-between space-y-4 group reveal-delay-${idx + 1}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-[11px] font-mono font-bold">
                      Tes #{test.test_number}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700">
                      {test.is_free || test.test_number === 1 ? 'GRATIS' : formatPriceIDR(test.price || 49000)}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug">
                    {test.test_name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 font-normal leading-relaxed">
                    {test.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      60 Menit
                    </span>
                    <span>60 Soal</span>
                    <span>Pass: <strong className="text-emerald-600 font-bold">{test.passing_grade || 70}%</strong></span>
                  </div>

                  <Link
                    href={`/student/test/${test.test_number}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:opacity-95 shadow-md shadow-sky-500/20 transition-all active:scale-98"
                  >
                    <span>Mulai Ujian</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Link to All 10 Packages */}
          <div className="p-4 sm:p-5 rounded-[22px] bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                <span>Tersedia 10 Paket Ujian Lengkap Standar IMO STCW</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Akses seluruh paket mulai dari Foundation hingga Master Level di katalog portal siswa.
              </p>
            </div>

            <Link
              href="/student/tests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-[#0284C7] hover:text-white text-slate-800 text-xs font-bold transition-all shrink-0"
            >
              <span>Buka Semua 10 Paket</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CERTIFICATE VERIFICATION SPOTLIGHT — Clean Verification CTA
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-white">
        <div
          ref={certReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal-init ${
            certReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] p-7 sm:p-12 text-white shadow-xl shadow-sky-900/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-lg text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Validasi Resmi Agensi Pelayaran</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Verifikasi Keaslian Dokumen Sertifikat Marlins
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Perusahaan pelayaran dan agen pengawakan (*crewing agencies*) dapat langsung memverifikasi keaslian dokumen kelulusan kandidat secara realtime.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link
                href="/verify"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-lg transition-all hover:scale-105 active:scale-98"
              >
                <QrCode className="w-4 h-4 text-[#0284C7]" />
                <span>Buka Portal Verifikasi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER — Clean, Minimal, Professional
          ========================================================================= */}
      <footer className="border-t border-slate-200/80 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <Logo size="sm" showSubtitle={true} subtitleText="LTE Cruise Training Center" variant="dark" />
          <p className="text-center sm:text-right">
            &copy; {new Date().getFullYear()} LTE Cruise - Hotel & Marine Training Center. Standardized Marlins Test System.
          </p>
        </div>
      </footer>
    </div>
  );
}


