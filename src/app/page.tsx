'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  LayoutDashboard,
  Award,
  CheckCircle2,
  Utensils,
  QrCode,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Radio,
  Sparkles,
  Zap,
  Check,
  Compass,
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

export default function LandingPage() {
  const { user, isAdmin } = useAuth();
  const [tests, setTests] = useState<MarlintTest[]>(DEFAULT_6_TESTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'specialist'>('all');

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
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 selection:bg-[#0284C7] selection:text-white flex flex-col font-sans antialiased overflow-x-hidden">
      <PublicNavbar />

      {/* =========================================================================
          HERO SECTION — Modern Ambient Glow, Smooth Entrance & Clean Typography
          ========================================================================= */}
      <section className="relative pt-12 pb-14 sm:pt-20 sm:pb-24 overflow-hidden">
        {/* Soft Ambient Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(2,132,199,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute top-40 left-[10%] w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          
          {/* Animated Institutional Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-sky-200/90 text-slate-800 text-xs font-bold shadow-sm backdrop-blur-md hover:scale-[1.02] transition-transform duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#0284C7] font-extrabold">LTE CRUISE</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-medium">Standardized Marlins Assessment</span>
          </div>

          {/* Heading with Gradient Accent */}
          <div className="space-y-3.5">
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-slate-950 tracking-tight leading-[1.15]">
              Standardized Marlins Test <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-slate-950 via-[#0369A1] to-[#0284C7] bg-clip-text text-transparent">
                Perhotelan & Kapal Pesiar
              </span>
            </h1>

            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Platform evaluasi kecakapan Bahasa Inggris standar internasional Marlins Test untuk peserta didik sekolah perhotelan dan calon kru kapal pesiar dunia.
            </p>
          </div>

          {/* Action Buttons with Micro-interactions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/student/test/1'}
              className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-200" />
              <span>{user ? (isAdmin ? 'Buka Portal Admin' : 'Buka Dashboard Siswa') : 'Mulai Ujian Gratis (Paket #1)'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/verify"
              className="w-full sm:w-auto group flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-800 bg-white/95 hover:bg-white border border-slate-200/90 hover:border-sky-300 hover:text-[#0284C7] shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <QrCode className="w-4 h-4 text-[#0284C7] transition-transform group-hover:rotate-6" />
              <span>Verifikasi Sertifikat</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284C7] transition-colors" />
            </Link>
          </div>

          {/* 4 Clean Interactive Trust Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 text-left">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs backdrop-blur-xs hover:border-sky-300 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 border border-sky-100 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-slate-950 text-xs sm:text-sm block truncate">IMO STCW 2010</span>
                  <span className="text-[11px] text-slate-500 block truncate">Standar Resmi</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs backdrop-blur-xs hover:border-emerald-300 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-slate-950 text-xs sm:text-sm block truncate">CEFR A1–C1</span>
                  <span className="text-[11px] text-slate-500 block truncate">Peta Kemahiran</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs backdrop-blur-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-slate-950 text-xs sm:text-sm block truncate">60 Menit CBT</span>
                  <span className="text-[11px] text-slate-500 block truncate">Simulasi Waktu</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs backdrop-blur-xs hover:border-amber-300 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
                  <QrCode className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-slate-950 text-xs sm:text-sm block truncate">QR Digital</span>
                  <span className="text-[11px] text-slate-500 block truncate">Validasi 24/7</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CORE EVALUATION PILLARS — 3 Elegant Cards with Hover Animations
          ========================================================================= */}
      <section id="features" className="py-14 sm:py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
              <span>Keunggulan Platform</span>
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
            <div className="bg-[#F8FAFC] p-6 sm:p-7 rounded-[22px] border border-slate-200/80 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-white text-[#0284C7] border border-slate-200/90 flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all duration-300">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors">
                  Cruise Hospitality & Pelayanan Tamu
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Kosakata praktis dan dialog interaktif departemen Food & Beverage, Housekeeping, dan pelayanan tamu kapal pesiar internasional.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Simulasi percakapan operasional</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F8FAFC] p-6 sm:p-7 rounded-[22px] border border-slate-200/80 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-white text-[#0284C7] border border-slate-200/90 flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all duration-300">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors">
                  Keselamatan & Standar IMO SMCP
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Uji pemahaman instruksi darurat maritim, protokol komunikasi radio VHF, terminologi SOLAS, dan komando evakuasi keselamatan kapal.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Format audio & visual listening</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F8FAFC] p-6 sm:p-7 rounded-[22px] border border-slate-200/80 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-white text-[#0284C7] border border-slate-200/90 flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all duration-300">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors">
                  Sertifikasi & Verifikasi Instan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
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
          EXAM CATALOG SHOWCASE — 6 Test Packages
          ========================================================================= */}
      <section id="tests" className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-7">
          {/* Header & Interactive Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-[10px] font-bold uppercase tracking-wider">
                <span>Katalog Asesmen</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Paket Ujian Marlins Test Pilihan
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Pilih paket evaluasi kompetensi sesuai divisi kerja dan jenjang karier pelayaran Anda.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-2xl self-start sm:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua (6)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('free')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeFilter === 'free'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gratis
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('specialist')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeFilter === 'specialist'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Spesialisasi
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {filteredTests.slice(0, 6).map((test) => (
              <div
                key={test.id}
                className="bg-white p-5 rounded-[22px] border border-slate-200/90 shadow-2xs hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-200 flex flex-col justify-between space-y-3.5 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[10px] font-bold">
                      Paket #{test.test_number}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80">
                      {test.is_free || test.test_number === 1 ? 'GRATIS' : formatPriceIDR(test.price || 49000)}
                    </span>
                  </div>

                  <h3 className="font-heading text-sm sm:text-base font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors leading-snug">
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
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:opacity-95 shadow-sm transition-all duration-150 active:scale-98"
                  >
                    <span>Mulai Ujian</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Banner link to all 10 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                <span>Tersedia 10 Paket Ujian Lengkap di Portal Siswa</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Akses katalog lengkap untuk persiapan wawancara kapal pesiar dan sertifikasi kompetensi.
              </p>
            </div>

            <Link
              href="/student/tests"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-slate-100 hover:bg-[#0284C7] hover:text-white text-slate-800 text-xs font-bold transition-all shrink-0"
            >
              <span>Lihat Semua (10 Paket)</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VERIFICATION SPOTLIGHT — Executive Dark Oceanic Banner
          ========================================================================= */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] p-7 sm:p-10 text-white shadow-xl shadow-sky-950/15 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-2.5 max-w-lg text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
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
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 bg-white hover:bg-slate-100 shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
      <footer className="border-t border-slate-200 bg-[#F8FAFC] py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <Logo size="sm" showSubtitle={true} subtitleText="LTE Cruise Training Center" variant="dark" />
          <p className="text-center sm:text-right">
            &copy; {new Date().getFullYear()} LTE Cruise Training Center. Standardized Marlins Test System.
          </p>
        </div>
      </footer>
    </div>
  );
}
