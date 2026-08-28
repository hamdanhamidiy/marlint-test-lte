'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  LayoutDashboard,
  Award,
  CheckCircle2,
  FileCheck2,
  Utensils,
  QrCode,
  Clock,
  ArrowUpRight,
  Headphones,
  Compass,
  ChevronRight,
  Radio,
  BookOpen,
  Sparkles,
  Flag,
  Info,
  Timer,
} from 'lucide-react';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import Logo from '@/components/brand/Logo';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';

// Standard 6 official packages
const DEFAULT_6_TESTS: MarlintTest[] = [
  {
    id: 'test-1',
    test_number: 1,
    test_name: 'Marlins Test 1 – Cruise Hospitality & Maritime English',
    description: 'Placement & Diagnostic assessment untuk departemen Food & Beverage, Housekeeping, dan Guest Service.',
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
    description: 'Komunikasi operasional dek kapal, perintah keselamatan, dan terminologi kamar mesin standar IMO STCW.',
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
    description: 'Protokol radio komunikasi VHF, prosedur lookout, navigasi anjungan, dan koordinasi alur pelayaran.',
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
    description: 'Komunikasi penanganan kargo berbahaya, protokol gas inert, lembar MSDS, dan keselamatan transfer muatan.',
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
    description: 'Logistik kapal pendukung lepas pantai, komunikasi station-keeping DP, dan prosedur helideck maritim.',
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
    description: 'Kepatuhan kode IMSBC bulk carrier, komunikasi lashing kontainer, dan protokol terminal pelabuhan.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    is_free: false,
    price: 69000,
    is_active: true,
    created_at: new Date().toISOString(),
  } as MarlintTest,
];

// Modern Scroll Reveal Hook
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
  const [demoSelectedOption, setDemoSelectedOption] = useState<string>('Seven – zero – four – two');

  const heroReveal = useScrollReveal(0.02);
  const statsReveal = useScrollReveal(0.06);
  const featuresReveal = useScrollReveal(0.08);
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#0284C7] selection:text-white flex flex-col font-sans antialiased overflow-x-hidden">
      <PublicNavbar />

      {/* =========================================================================
          HERO SECTION — Clean, High-End & Interactive Maritime Portal
          ========================================================================= */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-20 overflow-hidden bg-gradient-to-b from-white via-sky-50/20 to-[#F8FAFC] border-b border-slate-200/70">
        {/* Soft Background Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(2,132,199,0.08),transparent_70%)] pointer-events-none" />

        <div
          ref={heroReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-7 relative z-10 reveal-init ${
            heroReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-700 text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span className="text-[#0284C7] font-extrabold">LTE CRUISE</span>
            <span className="text-slate-300">•</span>
            <span>Standar Resmi Marlins Test STCW</span>
          </div>

          {/* Main Hero Header */}
          <div className="space-y-3.5 max-w-3xl mx-auto">
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-[50px] font-extrabold text-slate-950 tracking-tight leading-[1.15]">
              Standardized Marlins Test <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-slate-950 via-[#0369A1] to-[#0284C7] bg-clip-text text-transparent">
                Perhotelan & Kapal Pesiar
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Platform evaluasi kecakapan Bahasa Inggris standar internasional Marlins Test untuk peserta didik sekolah perhotelan dan calon kru kapal pesiar dunia.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/student/test/1'}
              className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:opacity-95 shadow-lg shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-200" />
              <span>{user ? (isAdmin ? 'Buka Portal Admin' : 'Buka Dashboard Siswa') : 'Mulai Ujian Gratis (Tes #1)'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/verify"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-sky-300 hover:text-[#0284C7] shadow-2xs transition-all duration-200"
            >
              <QrCode className="w-4 h-4 text-[#0284C7]" />
              <span>Verifikasi Sertifikat</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          {/* =========================================================================
              MODERN INTERACTIVE CBT EXAM PREVIEW (Ultra-Clean & Responsive)
              ========================================================================= */}
          <div className="pt-4 sm:pt-8 max-w-2xl mx-auto text-left">
            <div className="bg-white rounded-2xl sm:rounded-[26px] border border-slate-200/90 p-4.5 sm:p-7 shadow-md shadow-slate-200/50 space-y-4 relative">
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-slate-900 text-white text-[11px] font-black tracking-wider">
                    SOAL 1
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold">
                    Time & Numbers
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center gap-1">
                    <Flag className="w-3 h-3 text-slate-400" />
                    Ragu
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-sky-50 text-[#0284C7] border border-sky-200 text-[11px] font-bold">
                    Daftar Soal 0/60
                  </span>
                </div>
              </div>

              {/* Instruction Banner */}
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center gap-2 text-xs text-[#0369A1] font-medium">
                <Info className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>Look at the question and select the correct time, quantity, or number.</span>
              </div>

              {/* Question Prompt */}
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                How do you say the cabin number &ldquo;7042&rdquo; in English standard maritime radiotelephony (SMCP)?
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 pt-0.5">
                {[
                  { label: 'A', text: 'Seven – zero – four – two' },
                  { label: 'B', text: 'Seventy – forty-two' },
                  { label: 'C', text: 'Seven hundred forty-two' },
                  { label: 'D', text: 'Seven thousand and forty-two' },
                ].map((opt) => {
                  const isSelected = demoSelectedOption === opt.text;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setDemoSelectedOption(opt.text)}
                      className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/90 border-[#0284C7] text-slate-950 font-bold shadow-2xs ring-1 ring-[#0284C7]'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-lg font-mono text-xs font-black flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#0284C7] text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-xs sm:text-sm truncate">{opt.text}</span>
                      </div>

                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#0284C7] border-[#0284C7]' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Card Navigation */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-semibold text-slate-500">
                <span className="text-slate-400">← Sebelumnya</span>
                <span className="font-mono text-slate-700">Soal 1 / 60</span>
                <Link
                  href="/student/test/1"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white font-bold text-xs hover:opacity-95 shadow-2xs"
                >
                  <span>Mulai Ujian</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STATS METRICS STRIP
            ========================================================================= */}
        <div
          ref={statsReveal.ref}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 reveal-init ${
            statsReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
            <div className="p-2 space-y-0.5">
              <span className="font-heading text-lg sm:text-xl font-black text-slate-950 block">6 Paket</span>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pilihan Ujian</p>
            </div>
            <div className="p-2 space-y-0.5 border-l border-slate-100">
              <span className="font-heading text-lg sm:text-xl font-black text-[#0284C7] block">60 Menit</span>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Stopwatch Resmi</p>
            </div>
            <div className="p-2 space-y-0.5 border-l border-slate-100">
              <span className="font-heading text-lg sm:text-xl font-black text-emerald-600 block">A1–C1</span>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Standar CEFR</p>
            </div>
            <div className="p-2 space-y-0.5 border-l border-slate-100">
              <span className="font-heading text-lg sm:text-xl font-black text-amber-600 block">QR Resmi</span>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Verifikasi 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CORE EVALUATION PILLARS — 3 Concise Highlights
          ========================================================================= */}
      <section id="features" className="py-14 md:py-20 bg-white border-b border-slate-200/70">
        <div
          ref={featuresReveal.ref}
          className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 reveal-init ${
            featuresReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
              <span>Keunggulan Penilaian</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Standar Evaluasi Kompetensi Maritim
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Dirancang untuk mengukur kecakapan bahasa dan kesiapan kerja kru kapal pesiar internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col justify-between space-y-3.5 group">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#0284C7] border border-slate-200/80 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors">
                  Cruise Hospitality & Pelayanan Tamu
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Kosakata praktis dan dialog interaktif departemen Food & Beverage, Housekeeping, dan pelayanan tamu berstandar internasional.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Simulasi percakapan operasional</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col justify-between space-y-3.5 group">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#0284C7] border border-slate-200/80 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors">
                  Keselamatan & Standar IMO SMCP
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Uji pemahaman instruksi darurat maritim, protokol komunikasi radio VHF, terminologi SOLAS, dan komando evakuasi keselamatan kapal.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Format audio & visual listening</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col justify-between space-y-3.5 group">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#0284C7] border border-slate-200/80 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors">
                  Sertifikasi & Verifikasi Instan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Penerbitan e-Sertifikat kelulusan ber-QR Code dengan pemetaan level CEFR (A1–C1) yang dapat divalidasi langsung oleh agensi pelayaran.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Otentikasi QR Code resmi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXAM CATALOG SHOWCASE — Structured Test Packages
          ========================================================================= */}
      <section id="tests" className="py-14 md:py-20 bg-[#F8FAFC] border-b border-slate-200/70">
        <div
          ref={testsReveal.ref}
          className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 reveal-init ${
            testsReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-[10px] font-bold uppercase tracking-wider">
                <span>Katalog Asesmen</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Paket Ujian Marlins Test Pilihan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Pilih paket evaluasi kompetensi sesuai divisi kerja dan jenjang karier pelayaran Anda.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-full self-start md:self-auto shadow-2xs">
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

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTests.slice(0, 6).map((test) => (
              <div
                key={test.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold">
                      Paket #{test.test_number}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                      {test.is_free || test.test_number === 1 ? 'GRATIS' : formatPriceIDR(test.price || 49000)}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors leading-snug">
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
                    <span>Pass: <strong className="text-emerald-700 font-bold">{test.passing_grade || 70}%</strong></span>
                  </div>

                  <Link
                    href={`/student/test/${test.test_number}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:opacity-95 shadow-sm transition-all active:scale-98"
                  >
                    <span>Mulai Ujian</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Catalog Footer Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                <span>Tersedia 10 Paket Ujian Resmi di Portal Siswa</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Akses katalog lengkap untuk persiapan wawancara kapal pesiar dan sertifikasi kompetensi.
              </p>
            </div>

            <Link
              href="/student/tests"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-[#0284C7] hover:text-white text-slate-800 text-xs font-bold transition-all shrink-0"
            >
              <span>Lihat Semua Paket (10)</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VERIFICATION SPOTLIGHT — Clean Institutional Banner
          ========================================================================= */}
      <section className="py-14 md:py-18 bg-white">
        <div
          ref={certReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal-init ${
            certReveal.isVisible ? 'reveal-active' : ''
          }`}
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[24px] bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] p-6 sm:p-10 text-white shadow-xl shadow-sky-900/10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-2.5 max-w-lg text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Otentikasi Dokumen Resmi</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Verifikasi Keaslian Sertifikat Marlins
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Perusahaan pelayaran dan agensi pengawakan kapal (*crewing agencies*) dapat langsung memvalidasi keaslian dokumen kelulusan kandidat secara instan melalui sistem QR terpusat.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link
                href="/verify"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-slate-950 bg-white hover:bg-slate-100 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          FOOTER — Clean, Formal, Enterprise
          ========================================================================= */}
      <footer className="border-t border-slate-200 bg-[#F8FAFC] py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <Logo size="sm" showSubtitle={true} subtitleText="LTE Cruise Training Center" variant="dark" />
          <p className="text-center sm:text-right">
            &copy; {new Date().getFullYear()} LTE Cruise - Hotel & Marine Training Center. Standardized Marlins Test System.
          </p>
        </div>
      </footer>
    </div>
  );
}
