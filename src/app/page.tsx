'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  LayoutDashboard,
  Award,
  CheckCircle2,
  QrCode,
  Clock,
  Check,
  ArrowUpRight,
  Headphones,
  BookOpen,
  Anchor,
  Compass,
  ChevronRight,
  FileCheck,
  Ship,
  Globe2,
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
    description: 'Placement & diagnostic assessment untuk staf F&B, Housekeeping, Front Office, dan Guest Service.',
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
    description: 'Komunikasi maritim dasar, perintah keselamatan kerja geladak, dan terminologi kamar mesin kapal.',
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
    description: 'Protokol radio VHF, navigasi anjungan, komunikasi jaga laut, dan aturan pencegahan tubrukan.',
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
    description: 'Komunikasi muatan berbahaya IMDG, protokol gas inert, lembar data keselamatan (MSDS), dan transfer kargo.',
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
    description: 'Operasi kapal pendukung lepas pantai (OSV), komunikasi station keeping DP, dan keselamatan helideck.',
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
    description: 'Penanganan muatan curah standar IMSBC, prosedur lashing kontainer, dan keamanan siber maritim.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    is_free: false,
    price: 69000,
    is_active: true,
    created_at: new Date().toISOString(),
  } as MarlintTest,
];

// Clean intersection scroll reveal hook
function useScrollReveal(threshold = 0.05) {
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
      { threshold, rootMargin: '0px 0px -30px 0px' }
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

  // Observers for subtle, formal scroll transitions
  const heroReveal = useScrollReveal(0.02);
  const featuresReveal = useScrollReveal(0.06);
  const testsReveal = useScrollReveal(0.06);
  const verifyReveal = useScrollReveal(0.06);

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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#0284C7] selection:text-white flex flex-col font-sans antialiased">
      <PublicNavbar />

      {/* =========================================================================
          HERO SECTION — Formal, Corporate Maritime Academic Standard
          ========================================================================= */}
      <section className="relative border-b border-slate-200/80 bg-gradient-to-b from-[#F8FAFC] to-white py-14 sm:py-20 lg:py-24">
        <div
          ref={heroReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 transition-all duration-700 ${
            heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
            <span className="font-bold text-[#0284C7]">LTE CRUISE</span>
            <span className="text-slate-300">|</span>
            <span>Hotel & Marine Training Center</span>
          </div>

          {/* Formal Main Title */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Standardized Marlins English Test
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Platform asesmen kemampuan Bahasa Inggris maritim resmi standar IMO STCW dan SMCP untuk peserta pelatihan perhotelan kapal pesiar dan pelaut niaga internasional.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/student/test/1'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-sm transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{user ? (isAdmin ? 'Buka Portal Admin' : 'Buka Dashboard Siswa') : 'Mulai Ujian Gratis (Tes #1)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-2xs transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verifikasi Keaslian Sertifikat</span>
            </Link>
          </div>

          {/* 4 Essential Accreditations */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Standar Ujian</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">IMO STCW 2010</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Format Soal</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">60 Butir / 60 Menit</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Batas Kelulusan</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">Passing Grade 70%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Validasi Dokumen</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">e-Sertifikat QR Resmi</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CORE STANDARDS SECTION — 3 Essential Pillars
          ========================================================================= */}
      <section id="features" className="py-16 md:py-20 bg-white">
        <div
          ref={featuresReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 transition-all duration-700 ${
            featuresReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-left md:text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Standar Kompetensi Evaluasi Marlins
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Kurikulum evaluasi disusun sesuai kebutuhan rekrutmen perusahaan pelayaran internasional (*cruise line & shipping agencies*).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0284C7]">
                <Ship className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Cruise Hospitality English
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Ujian interaktif kosakata dan instruksi kerja departemen Food & Beverage, Housekeeping, Culinary, dan Guest Service kapal pesiar.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0284C7]">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Audio Listening & VHF Radio
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Format audio percakapan asli radio VHF maritim, penyusunan kalimat acak, isian kata, dan identifikasi diagram teknis kapal.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0284C7]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                e-Sertifikat Terverifikasi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Penerbitan dokumen kelulusan instan berformat digital lengkap dengan QR Code validasi keaslian dokumen oleh agensi pengawakan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXAM CATALOG SECTION — 6 Test Packages
          ========================================================================= */}
      <section id="tests" className="py-16 md:py-20 bg-[#F8FAFC] border-y border-slate-200/80">
        <div
          ref={testsReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 transition-all duration-700 ${
            testsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Paket Ujian Marlins Test
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                Pilih paket evaluasi standar sesuai departemen kerja kapal Anda.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg self-start sm:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
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
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
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
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredTests.slice(0, 6).map((test) => (
              <div
                key={test.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#0284C7] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold font-mono">
                      Tes #{test.test_number}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700">
                      {test.is_free || test.test_number === 1 ? 'GRATIS' : formatPriceIDR(test.price || 49000)}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {test.test_name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">
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
                    <span>Pass: <strong className="text-slate-800 font-bold">{test.passing_grade || 70}%</strong></span>
                  </div>

                  <Link
                    href={`/student/test/${test.test_number}`}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-2xs transition-all"
                  >
                    <span>Mulai Ujian</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Full Catalog Navigation Link */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900">Kurikulum Lengkap:</span> Tersedia 10 paket ujian Marlins Test dari Placement hingga Master Level.
            </div>
            <Link
              href="/student/tests"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-[#0284C7] hover:text-white text-slate-800 text-xs font-bold transition-all shrink-0"
            >
              <span>Lihat Semua 10 Paket</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VERIFICATION SPOTLIGHT — Clean Formal Institutional Box
          ========================================================================= */}
      <section className="py-16 md:py-20 bg-white">
        <div
          ref={verifyReveal.ref}
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            verifyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="p-8 sm:p-10 rounded-2xl bg-[#0B192C] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-cyan-200 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Portal Verifikasi Agensi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Validasi Keaslian Dokumen Sertifikat
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Perusahaan pelayaran dan agen pengawakan dapat memverifikasi legalitas dan skor resmi kandidat secara realtime melalui nomor sertifikat atau pemindaian QR Code.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link
                href="/verify"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-white hover:bg-slate-100 shadow-sm transition-all"
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
          FOOTER — Clean Institutional Notice
          ========================================================================= */}
      <footer className="border-t border-slate-200 bg-[#F8FAFC] py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <Logo size="sm" showSubtitle={true} subtitleText="Hotel & Marine Training Center" variant="dark" />
          <p className="text-center sm:text-right">
            &copy; {new Date().getFullYear()} LTE Cruise - Hotel & Marine Training Center. Standardized Marlins Test System.
          </p>
        </div>
      </footer>
    </div>
  );
}



