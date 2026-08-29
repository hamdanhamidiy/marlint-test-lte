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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#0284C7] selection:text-white flex flex-col font-sans antialiased overflow-x-hidden">
      <PublicNavbar />

      {/* =========================================================================
          HERO SECTION — Clean, Minimal, Corporate & 100% Mobile Responsive
          ========================================================================= */}
      <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-20 bg-gradient-to-b from-white via-sky-50/20 to-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5 sm:space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span>LTE Cruise Training Center</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-semibold">Standardized Marlins Assessment</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.2]">
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <Link
              href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/student/test/1'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] shadow-md shadow-sky-500/20 hover:opacity-95 transition-all active:scale-98"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-200" />
              <span>{user ? (isAdmin ? 'Buka Portal Admin' : 'Buka Dashboard Siswa') : 'Mulai Ujian Gratis (Paket #1)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/verify"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-sky-300 hover:text-[#0284C7] shadow-2xs transition-all"
            >
              <QrCode className="w-4 h-4 text-[#0284C7]" />
              <span>Verifikasi Sertifikat</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          {/* Key Trust Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-4 text-left">
            <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 border border-sky-100">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-xs block truncate">IMO STCW 2010</span>
                <span className="text-[10px] text-slate-500 block truncate">Standar Resmi</span>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-xs block truncate">CEFR A1–C1</span>
                <span className="text-[10px] text-slate-500 block truncate">Peta Kemahiran</span>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-xs block truncate">60 Menit CBT</span>
                <span className="text-[10px] text-slate-500 block truncate">Simulasi Waktu</span>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-xs block truncate">QR Digital</span>
                <span className="text-[10px] text-slate-500 block truncate">Validasi 24/7</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CORE EVALUATION PILLARS — 3 Clean Cards
          ========================================================================= */}
      <section id="features" className="py-12 sm:py-16 bg-white border-b border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-1.5 max-w-lg mx-auto">
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              Standar Evaluasi Kompetensi Maritim
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Dirancang untuk mengukur kecakapan bahasa dan kesiapan kerja kru kapal pesiar internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-[#F8FAFC] p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white text-[#0284C7] border border-slate-200 flex items-center justify-center shadow-2xs">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                  Cruise Hospitality & Pelayanan Tamu
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Kosakata praktis dan dialog interaktif departemen Food & Beverage, Housekeeping, dan pelayanan tamu kapal pesiar internasional.
                </p>
              </div>
              <div className="pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Simulasi percakapan operasional</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F8FAFC] p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white text-[#0284C7] border border-slate-200 flex items-center justify-center shadow-2xs">
                  <Radio className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                  Keselamatan & Standar IMO SMCP
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Uji pemahaman instruksi darurat maritim, protokol komunikasi radio VHF, terminologi SOLAS, dan komando evakuasi keselamatan kapal.
                </p>
              </div>
              <div className="pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Format audio & visual listening</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F8FAFC] p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white text-[#0284C7] border border-slate-200 flex items-center justify-center shadow-2xs">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                  Sertifikasi & Verifikasi Instan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Penerbitan e-Sertifikat kelulusan ber-QR Code dengan pemetaan level CEFR (A1–C1) yang dapat divalidasi langsung oleh agensi pelayaran.
                </p>
              </div>
              <div className="pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-[#0284C7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Otentikasi QR Code resmi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXAM CATALOG SHOWCASE — 6 Test Packages
          ========================================================================= */}
      <section id="tests" className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Header & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                Paket Ujian Marlins Test Pilihan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih paket evaluasi kompetensi sesuai divisi kerja dan jenjang karier pelayaran Anda.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl self-start sm:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#0284C7] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('free')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'free'
                    ? 'bg-[#0284C7] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gratis
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('specialist')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'specialist'
                    ? 'bg-[#0284C7] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Spesialisasi
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.slice(0, 6).map((test) => (
              <div
                key={test.id}
                className="bg-white p-4.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold">
                      Paket #{test.test_number}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
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

                <div className="pt-2.5 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      60 Menit
                    </span>
                    <span>60 Soal</span>
                    <span>Pass: <strong className="text-emerald-700 font-bold">{test.passing_grade || 70}%</strong></span>
                  </div>

                  <Link
                    href={`/student/test/${test.test_number}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:opacity-95 shadow-xs transition-all active:scale-98"
                  >
                    <span>Mulai Ujian</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Banner link to all 10 */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Tersedia 10 Paket Ujian Lengkap di Portal Siswa</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Akses katalog lengkap untuk persiapan wawancara kapal pesiar dan sertifikasi kompetensi.
              </p>
            </div>

            <Link
              href="/student/tests"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-100 hover:bg-[#0284C7] hover:text-white text-slate-800 text-xs font-bold transition-all shrink-0"
            >
              <span>Lihat Semua (10 Paket)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VERIFICATION SPOTLIGHT — Clean Institutional Banner
          ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] p-6 sm:p-8 text-white shadow-lg shadow-sky-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Otentikasi Dokumen Resmi</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white leading-tight">
                Verifikasi Keaslian Sertifikat Marlins
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Perusahaan pelayaran dan agensi pengawakan kapal (*crewing agencies*) dapat langsung memvalidasi keaslian dokumen kelulusan kandidat secara instan melalui sistem QR terpusat.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link
                href="/verify"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-white hover:bg-slate-100 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
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
