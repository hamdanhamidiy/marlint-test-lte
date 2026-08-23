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
  ArrowUpRight,
  Compass,
  Layers,
  LayoutDashboard,
  CheckCircle2,
  Users,
  Clock,
  Star,
  Anchor,
  Volume2,
  Move,
  Check,
} from 'lucide-react';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import Logo from '@/components/brand/Logo';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';

export default function LandingPage() {
  const { user, isAdmin } = useAuth();
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#4F46E5] selection:text-white flex flex-col">
      <PublicNavbar />

      {/* Hero Section (Inspired by World-Class Editorial Design / Hormn) */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
        
        {/* Soft Ambient Background Light */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-tr from-sky-200/40 via-indigo-100/30 to-amber-100/25 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
          
          {/* Trust Social Proof Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-xs">
                👨‍✈️
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-sky-100 flex items-center justify-center text-xs">
                👩‍✈️
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-100 flex items-center justify-center text-xs">
                👨‍🔧
              </div>
            </div>
            <span>• Terpercaya oleh 8,500+ Pelaut & Perwira Kapal</span>
          </div>

          {/* Main Editorial Headline */}
          <div className="space-y-3.5 max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[62px] font-black text-slate-900 tracking-tight leading-[1.08]">
              Kuasai Bahasa Inggris Maritim. <br />
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#0EA5E9] bg-clip-text text-transparent">
                Raih Standar Marlins Resmi.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Platform evaluasi resmi standar IMO STCW & SMCP untuk perwira & rating kapal internasional, dilengkapi sistem ujian interaktif 60 butir soal dan sertifikasi instan.
            </p>

            {/* Rating / TrustScore */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 pt-1">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span>TrustScore <strong>4.9 / 5</strong> (1,400+ Ulasan Terverifikasi)</span>
            </div>
          </div>

          {/* Main Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
            <Link
              href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/student/dashboard'}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-extrabold text-sm text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Buka Dashboard Siswa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verifikasi Sertifikat</span>
            </Link>
          </div>

          {/* Hormn-Style Editorial 4-Card Hero Showcase */}
          <div className="pt-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left">
              
              {/* Card 1: Ocean Sky Blue (Deck Navigation) */}
              <Link
                href="/student/test/1"
                className="group relative overflow-hidden rounded-[30px] bg-gradient-to-b from-[#60A5FA] to-[#3B82F6] text-white p-6 sm:p-7 flex flex-col justify-between min-h-[280px] shadow-lg shadow-blue-500/15 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-100/90">
                      Deck Department
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-blue-600 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-white leading-tight">
                    Navigasi & VHF Radio SMCP
                  </h3>
                </div>
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  Standar komunikasi anjungan, radio stasiun pandu, dan prosedur darurat pelayaran.
                </p>
              </Link>

              {/* Card 2: Sage Green (Engine Room) */}
              <Link
                href="/student/test/1"
                className="group relative overflow-hidden rounded-[30px] bg-gradient-to-b from-[#4ADE80] to-[#16A34A] text-white p-6 sm:p-7 flex flex-col justify-between min-h-[280px] shadow-lg shadow-emerald-500/15 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-100/90">
                      Engine Department
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-emerald-700 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-white leading-tight">
                    Permesinan & Technical English
                  </h3>
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                  Kosakata boiler, generator, pompa, kelistrikan, dan sistem keamanan kamar mesin.
                </p>
              </Link>

              {/* Card 3: Warm Terracotta / Sand (Cruise & Hospitality) */}
              <Link
                href="/student/test/1"
                className="group relative overflow-hidden rounded-[30px] bg-gradient-to-b from-[#FB923C] to-[#EA580C] text-white p-6 sm:p-7 flex flex-col justify-between min-h-[280px] shadow-lg shadow-orange-500/15 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-100/90">
                      Cruise & Hospitality
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-orange-600 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-white leading-tight">
                    Pelayanan Kapal Pesiar
                  </h3>
                </div>
                <p className="text-xs text-orange-100 font-medium leading-relaxed">
                  Standar pelayanan kabin, restaurant, bar, dan instruksi evakuasi penumpang.
                </p>
              </Link>

              {/* Card 4: Royal Lavender / Indigo (Official Assessment) */}
              <Link
                href="/student/test/1"
                className="group relative overflow-hidden rounded-[30px] bg-gradient-to-b from-[#A855F7] to-[#6D28D9] text-white p-6 sm:p-7 flex flex-col justify-between min-h-[280px] shadow-lg shadow-purple-500/15 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-100/90">
                      Marlins Test 1 (Gratis)
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-purple-700 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-white leading-tight">
                    60 Butir Soal Interaktif
                  </h3>
                </div>
                <p className="text-xs text-purple-100 font-medium leading-relaxed">
                  Drag & Drop, Gap Fill, Audio Listening, Gambar, dan Sertifikat Kelulusan Resmi Instan.
                </p>
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Value Props (Clean & Modern Bento Breakdown) */}
      <section id="features" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
              Standar Pengujian Maritim
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Format Soal Interaktif Sesuai Ujian Asli
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Sistem ujian kami mereplikasi struktur pengujian komputer Marlins Test internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-slate-200/70 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold">
                <Move className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Drag & Drop Labeling Bergambar
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Menjodohkan label nama perlengkapan kapal, galley, dan alat navigasi ke target gambar resolusi tinggi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-slate-200/70 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Audio Listening Pemutar Suara Asli
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Percakapan radio VHF, pengumuman darurat dari bridge kapten, dan instruksi pelabuhan dengan batas putar audio.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-slate-200/70 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Sertifikat Resmi & QR Verifikasi
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Sertifikat digital terbit otomatis dengan skor penjenjangan CEFR A1–C1 dan dapat diverifikasi online.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Tests Section */}
      <section id="tests" className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                Pilihan Evaluasi
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                Paket Ujian Marlins Resmi
              </h2>
            </div>

            <Link
              href="/student/tests"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] hover:text-[#4338CA]"
            >
              <span>Lihat Semua Paket</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tests.length === 0 ? (
              <div className="col-span-3 p-8 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-xs shadow-2xs">
                Memuat data paket ujian...
              </div>
            ) : (
              tests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-5 hover:border-indigo-300 hover:shadow-lg transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-[#4F46E5] text-xs font-extrabold">
                        Paket #{test.test_number}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        {test.is_free ? 'GRATIS' : formatPriceIDR(test.price)}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                      {test.test_name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 font-normal leading-relaxed">
                      {test.description || 'Evaluasi standar kompetensi Bahasa Inggris Maritim IMO STCW untuk perwira dan rating kapal.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>{test.duration} Menit</span>
                      <span>{test.total_questions >= 60 ? test.total_questions : 60} Soal</span>
                      <span>Passing: <strong className="text-emerald-600 font-bold">{test.passing_grade}%</strong></span>
                    </div>

                    <Link
                      href={`/student/test/${test.test_number}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
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
          <p>© {new Date().getFullYear()} Marlins Maritime English System. Standard IMO STCW & SMCP.</p>
        </div>
      </footer>
    </div>
  );
}
