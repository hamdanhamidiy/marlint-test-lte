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
  Play,
  RotateCcw,
  Radio,
  HelpCircle,
  Ship,
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

  // Live Interactive Demo Question State on Landing Page
  const [demoSelected, setDemoSelected] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudioDemo = () => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Port Pilot to MV Ocean Star. What is your present maximum draft and air draft on arrival?'
      );
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

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
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 selection:bg-[#0284C7] selection:text-white flex flex-col font-sans">
      <PublicNavbar />

      {/* Hero Section: Asymmetric Cockpit with Live Interactive Test Demo */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-[#F0F5FA] via-[#F8FAFC] to-[#F7F9FC]">
        
        {/* Subtle Nautical Radar & Ambient Grid Motif */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[600px] h-[350px] bg-sky-200/30 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/4 right-10 w-[500px] h-[300px] bg-indigo-200/25 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Authoritative Editorial Presentation (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900">IMO STCW 2010</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">Standard Marine Communication Phrases (SMCP)</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-[52px] font-black text-slate-900 tracking-tight leading-[1.12]">
                  Standar Evaluasi <br />
                  <span className="bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#4F46E5] bg-clip-text text-transparent">
                    Bahasa Inggris Maritim
                  </span>{' '}
                  Pelaut & Perwira Kapal.
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-xl">
                  Simulasi 60 butir soal Marlins Test resmi dengan audio VHF anjungan kapal, drag & drop visual labeling, dan penerbitan sertifikat digital berstandar CEFR internasional.
                </p>
              </div>

              {/* Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 bg-white/80 border border-slate-200/60 px-3 py-2 rounded-xl shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>60 Butir Soal Interaktif Lengkap</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 border border-slate-200/60 px-3 py-2 rounded-xl shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Audio Radio VHF Anjungan Asli</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 border border-slate-200/60 px-3 py-2 rounded-xl shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Penilaian Otomatis Standar CEFR</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 border border-slate-200/60 px-3 py-2 rounded-xl shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>QR Verifikasi Sertifikat Resmi</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/student/test/1"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-lg shadow-sky-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Ship className="w-4 h-4" />
                  <span>Mulai Marlins Test 1 (Gratis)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={user ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/student/dashboard'}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#0284C7]" />
                  <span>Portal Siswa</span>
                </Link>
              </div>

              {/* Social Proof Stats */}
              <div className="flex items-center gap-4 pt-3 text-xs text-slate-500 font-medium">
                <div className="flex items-center text-amber-500 gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span><strong>4.9 / 5.0</strong> dari 8,500+ Pelaut Terdaftar</span>
              </div>

            </div>

            {/* Right Column: Live Interactive Marlins Question Terminal (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-4 relative">
                
                {/* Terminal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold text-slate-700 ml-1">Simulasi Soal Marlins #16</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284C7] text-[10px] font-extrabold border border-sky-100">
                    VHF Listening
                  </span>
                </div>

                {/* Audio Listening Control Widget */}
                <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span>VHF Channel 16 • Pilot Station</span>
                    </div>
                    <span>Max 3x Play</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePlayAudioDemo}
                      className="w-10 h-10 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      title="Putar Audio Radio"
                    >
                      {isPlayingAudio ? (
                        <span className="w-3 h-3 bg-white rounded-xs animate-ping" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{isPlayingAudio ? 'Memutar transmisi suara...' : 'Klik play untuk dengar audio'}</span>
                        <span className="font-mono">00:08</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r from-cyan-400 to-[#0284C7] transition-all duration-300 ${
                            isPlayingAudio ? 'w-full animate-pulse' : 'w-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pertanyaan:
                  </span>
                  <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                    According to the pilot radio transmission, what information is urgently requested from the vessel?
                  </p>
                </div>

                {/* Interactive Option Buttons */}
                <div className="space-y-2 text-left">
                  {[
                    { id: 'opt1', text: 'Maximum arrival draft and air draft', isCorrect: true },
                    { id: 'opt2', text: 'Total number of crew members onboard', isCorrect: false },
                    { id: 'opt3', text: 'Estimated fuel consumption at berth', isCorrect: false },
                    { id: 'opt4', text: 'Cargo manifest delivery date', isCorrect: false },
                  ].map((opt) => {
                    const isChosen = demoSelected === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDemoSelected(opt.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isChosen
                            ? opt.isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-400'
                              : 'bg-rose-50 border-rose-400 text-rose-900 ring-1 ring-rose-400'
                            : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isChosen
                                ? opt.isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-rose-600 text-white'
                                : 'bg-white border border-slate-300 text-slate-600'
                            }`}
                          >
                            {opt.id === 'opt1' ? 'A' : opt.id === 'opt2' ? 'B' : opt.id === 'opt3' ? 'C' : 'D'}
                          </span>
                          <span>{opt.text}</span>
                        </div>

                        {isChosen && (
                          <span className="text-[11px] font-bold shrink-0">
                            {opt.isCorrect ? '✓ Benar (+10 Pts)' : '✗ Coba Lagi'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback CTA */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Uji 60 soal lengkap sekarang:</span>
                  <Link
                    href="/student/test/1"
                    className="inline-flex items-center gap-1 font-bold text-[#0284C7] hover:underline"
                  >
                    <span>Mulai Test 1</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Department Pathways Section (Curated & Unique) */}
      <section className="py-16 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              Spesialisasi Departemen Kapal
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kompetensi Bahasa Sesuai Peran & Jabatan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Bank soal dikurasi secara terstruktur untuk memenuhi persyaratan kompetensi kerja di atas kapal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            
            {/* Deck Department */}
            <div className="p-6 rounded-3xl bg-[#F0F7FF] border border-[#BAE6FD] space-y-3.5 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center font-bold shadow-xs">
                  ⚓
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0369A1] block">
                  Deck Department
                </span>
                <h3 className="font-heading text-base font-bold text-slate-900 leading-snug">
                  Navigasi, Bridge & SMCP
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Prosedur olah gerak, VHF port pilot, collision regulations (COLREGs), dan instruksi mooring.
                </p>
              </div>
              <div className="pt-2 border-t border-sky-200/60 text-[11px] font-bold text-[#0284C7]">
                Deck Officer & Ratings
              </div>
            </div>

            {/* Engine Department */}
            <div className="p-6 rounded-3xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3.5 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center font-bold shadow-xs">
                  ⚙️
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#15803D] block">
                  Engine Department
                </span>
                <h3 className="font-heading text-base font-bold text-slate-900 leading-snug">
                  Permesinan & Technical English
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Auxiliary engines, generator, boiler, bunkering checklist, dan alarm kamar mesin.
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-200/60 text-[11px] font-bold text-[#15803D]">
                Engineer Officer & Oilers
              </div>
            </div>

            {/* Cruise & Hospitality */}
            <div className="p-6 rounded-3xl bg-[#FFFBEB] border border-[#FDE68A] space-y-3.5 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-bold shadow-xs">
                  🛎️
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B45309] block">
                  Cruise & Hospitality
                </span>
                <h3 className="font-heading text-base font-bold text-slate-900 leading-snug">
                  Cabin, Restaurant & Bar
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Pelayanan tamu internasional, penanganan keluhan (*guest service*), dan safety briefing.
                </p>
              </div>
              <div className="pt-2 border-t border-amber-200/60 text-[11px] font-bold text-[#B45309]">
                Cruise Hospitality Staff
              </div>
            </div>

            {/* Maritime Safety & Law */}
            <div className="p-6 rounded-3xl bg-[#F5F3FF] border border-[#DDD6FE] space-y-3.5 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-bold shadow-xs">
                  🦺
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6D28D9] block">
                  Safety & SOLAS
                </span>
                <h3 className="font-heading text-base font-bold text-slate-900 leading-snug">
                  Keselamatan & Fire Drill
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  LSA/FFA equipment, abandon ship drill, ISM Code, MARPOL, dan penanganan kondisi darurat.
                </p>
              </div>
              <div className="pt-2 border-t border-purple-200/60 text-[11px] font-bold text-[#6D28D9]">
                All Shipboard Personnel
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Tests Section */}
      <section id="tests" className="py-16 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                Bank Ujian Resmi
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                Pilihan Paket Marlins Test
              </h2>
            </div>

            <Link
              href="/student/tests"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#0369A1]"
            >
              <span>Lihat Semua Paket</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {tests.length === 0 ? (
              <div className="col-span-3 p-8 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-xs shadow-2xs">
                Memuat data paket ujian...
              </div>
            ) : (
              tests.map((test) => {
                const isTest1 = test.test_number === 1;

                return (
                  <div
                    key={test.id}
                    className={`bg-white p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-5 hover:-translate-y-1 ${
                      isTest1
                        ? 'border-sky-300 shadow-[0_4px_20px_rgba(2,132,199,0.08)] ring-1 ring-sky-300'
                        : 'border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          isTest1 ? 'bg-[#D8EEFD] text-[#0369A1]' : 'bg-slate-100 text-slate-700'
                        }`}>
                          Paket #{test.test_number}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700">
                          {test.is_free ? 'GRATIS' : formatPriceIDR(test.price)}
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
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
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                          isTest1
                            ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sky-500/20'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>{test.is_free ? 'Mulai Ujian Gratis' : 'Buka Akses Ujian'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 mt-auto text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <Logo size="sm" showSubtitle={true} subtitleText="Maritime English Assessment" />
          <p>© {new Date().getFullYear()} Marlins Maritime English Assessment Platform. IMO STCW Standard.</p>
        </div>
      </footer>
    </div>
  );
}
