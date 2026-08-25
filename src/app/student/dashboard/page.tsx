'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  FileCheck2,
  ShieldCheck,
  BookOpen,
  Lock,
  Unlock,
  Sparkles,
  Award,
  Clock,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest, StudentResult, Article } from '@/lib/supabase/types';
import { formatPriceIDR, formatDateIndo } from '@/lib/utils';
import RightStatsPanel from '@/components/dashboard/RightStatsPanel';

const TYPEWRITER_PHRASES = [
  'Siap melanjutkan evaluasi dan sertifikasi kompetensi Bahasa Inggris Maritim Anda hari ini?',
  'Uji kecakapan SMCP, VHF Radio, Navigation & Engineering English standar STCW.',
  'Raih sertifikat resmi Marlins Test yang diakui oleh perusahaan pelayaran global.',
];

export default function StudentDashboardPage() {
  const { profile, user } = useAuth();
  const [tests, setTests] = useState<MarlintTest[]>([]);
  const [entitlements, setEntitlements] = useState<Set<number>>(new Set());
  const [recentResults, setRecentResults] = useState<StudentResult[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Typewriter Animation State
  const [currentText, setCurrentText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && currentText === currentPhrase) {
      // Pause when full text is typed
      timer = setTimeout(() => setIsDeleting(true), 2600);
    } else if (isDeleting && currentText === '') {
      // Move to next phrase
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
    } else {
      const speed = isDeleting ? 20 : 38;
      timer = setTimeout(() => {
        setCurrentText(
          isDeleting
            ? currentPhrase.substring(0, currentText.length - 1)
            : currentPhrase.substring(0, currentText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { data: testsData } = await supabase
          .from('marlint_tests')
          .select('*')
          .eq('is_active', true)
          .order('test_number', { ascending: true })
          .limit(6);

        if (testsData) setTests(testsData as MarlintTest[]);

        if (user) {
          const [resultsRes, entRes] = await Promise.all([
            supabase
              .from('student_results')
              .select('*')
              .eq('student_id', user.id)
              .order('created_at', { ascending: false })
              .limit(5),
            supabase
              .from('test_entitlements')
              .select('test_number')
              .eq('user_id', user.id)
              .eq('is_active', true),
          ]);

          let resList: StudentResult[] = [];
          if (resultsRes.data && resultsRes.data.length > 0) {
            resList = resultsRes.data as StudentResult[];
          } else if (typeof window !== 'undefined') {
            const histStr = localStorage.getItem('marlins_history_results');
            if (histStr) {
              try {
                const arr = JSON.parse(histStr);
                if (Array.isArray(arr) && arr.length > 0) {
                  resList = arr.slice(0, 5);
                }
              } catch (e) {}
            }
          }

          setRecentResults(resList);
          if (entRes.data) {
            setEntitlements(new Set(entRes.data.map((e) => e.test_number)));
          }
        }

        const { data: articlesData } = await supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(4);

        if (articlesData) setArticles(articlesData as Article[]);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const getGreetingName = () => {
    if (!profile?.full_name) return 'Capt. Budi';
    const words = profile.full_name.split(' ');
    if (words.length > 1) {
      return `${words[0]} ${words[1]}`;
    }
    return words[0];
  };

  const greetingName = getGreetingName();

  const defaultSampleRows = [
    {
      id: 'def-1',
      title: 'Marlins Diagnostic & Placement Test Evaluation',
      date: 'Terjadwal',
      type: 'STANDAR CEFR',
      statusText: '88% LULUS',
      isPassed: true,
      score: 88,
      href: '/student/tests',
    },
    {
      id: 'def-2',
      title: 'Standard Marine VHF Radio Communication Protocols',
      date: 'Modul Rekomendasi',
      type: 'IMO SMCP',
      statusText: 'Materi Siap Pelajari',
      isPassed: null,
      score: null,
      href: '/student/articles',
    },
    {
      id: 'def-3',
      title: 'SOLAS & Life Saving Appliances English Terminology',
      date: 'Modul Referensi',
      type: 'SAFETY & LAW',
      statusText: 'Materi Terverifikasi',
      isPassed: null,
      score: null,
      href: '/student/articles',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Center Main Content Area */}
      <div className="flex-1 w-full space-y-6 min-w-0">

        {/* Modern Clean Executive Maritime Hero Card */}
        <div className="bg-white rounded-[26px] border border-slate-200/90 p-5 sm:p-6 lg:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4 relative overflow-hidden">
          
          {/* Subtle Top Ambient Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] via-[#EA580C] to-slate-900 opacity-90" />

          {/* Top Row: Official Status & Quick Metric Badges */}
          <div className="flex items-center justify-between gap-2.5 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
              <span className="font-bold text-slate-900">Platform Resmi</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Standar IMO STCW & SMCP</span>
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 text-[#0369A1] border border-sky-200/80 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                <span>Stopwatch</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 text-[#C2410C] border border-orange-200/80 shadow-2xs">
                <FileCheck2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                <span>60 Soal</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 text-white shadow-2xs">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Passing 70%</span>
              </div>
            </div>
          </div>

          {/* Center Row: Main Greeting & Typewriter Subtitle */}
          <div className="space-y-1 pt-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
              Halo, {greetingName}! <span className="animate-wave inline-block text-2xl sm:text-3xl ml-1">👋</span>
            </h1>

            {/* Dynamic Typewriter Subtitle */}
            <div className="min-h-[26px] flex items-center">
              <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
                <span>{currentText}</span>
                <span className="animate-cursor font-bold text-[#EA580C] text-sm ml-0.5">|</span>
              </p>
            </div>
          </div>

        </div>

        {/* Featured Marlins Test Cards Grid (3 Paket Utama) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Paket Ujian Marlins</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C2410C] border border-orange-200">
                  Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-normal truncate sm:whitespace-normal">
                Pilihan paket asesmen kompetensi maritim standar perwira & rating kapal
              </p>
            </div>
            <Link
              href="/student/tests"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors shrink-0 whitespace-nowrap"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full p-12 text-center bg-white border border-slate-200/80 rounded-3xl text-slate-400 text-xs shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <p className="font-semibold text-slate-700">Memuat paket ujian resmi...</p>
              </div>
            ) : (
              tests.slice(0, 3).map((test) => {
                const hasAccess = test.is_free || entitlements.has(test.test_number);
                const isTest1 = test.test_number === 1;

                return (
                  <div
                    key={test.id}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-300 ease-out flex flex-col justify-between h-full group relative overflow-hidden ${
                      isTest1
                        ? 'border-sky-300 shadow-[0_4px_20px_rgba(2,132,199,0.08)] hover:shadow-xl hover:border-sky-500 hover:-translate-y-1.5'
                        : 'border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-slate-300 hover:-translate-y-1'
                    }`}
                  >
                    {/* Top Tag & Access Indicator */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-tight ${
                            isTest1 ? 'bg-[#D8EEFD] text-[#0369A1]' : 'bg-slate-100 text-slate-700'
                          }`}>
                            Paket #{test.test_number}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            IMO STCW
                          </span>
                        </div>

                        {hasAccess ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 shrink-0 shadow-2xs">
                            <Unlock className="w-3 h-3 text-emerald-600" />
                            <span>{test.is_free ? 'Gratis' : 'Akses Terbuka'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C2410C] text-[11px] font-bold border border-orange-200 shrink-0">
                            <Lock className="w-3 h-3 text-[#EA580C]" />
                            <span>{formatPriceIDR(test.price)}</span>
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug line-clamp-1">
                          {test.test_name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal min-h-[2.25rem]">
                          {test.description || 'Evaluasi standar kompetensi Bahasa Inggris Maritim IMO STCW untuk perwira dan rating kapal.'}
                        </p>
                      </div>
                    </div>

                    {/* Details Row (Specs) & CTA Button */}
                    <div className="pt-4 mt-4 border-t border-slate-100 space-y-4">
                      {/* Inline specs with clean typography */}
                      <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-2xl bg-slate-50/90 border border-slate-100/90 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Waktu</span>
                          <span className="text-xs font-extrabold text-amber-600 mt-0.5">Stopwatch</span>
                        </div>
                        <div className="flex flex-col items-center justify-center border-x border-slate-200/70 px-1">
                          <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Soal</span>
                          <span className="text-xs font-extrabold text-slate-800 mt-0.5">{test.total_questions >= 60 ? test.total_questions : 60} butir</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Passing</span>
                          <span className="text-xs font-extrabold text-emerald-600 mt-0.5">{test.passing_grade}%</span>
                        </div>
                      </div>

                      {/* Action Button: Primary Blue for Test 1, Deep Black for Test 2 & 3 */}
                      <Link
                        href={`/student/test/${test.test_number}`}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs group-hover:shadow-md ${
                          isTest1
                            ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sky-500/20 group-hover:scale-[1.01] active:scale-[0.99]'
                            : 'bg-slate-950 hover:bg-slate-800 text-white group-hover:scale-[1.01] active:scale-[0.99]'
                        }`}
                      >
                        <span>{hasAccess ? 'Mulai Ujian Sekarang' : 'Buka Akses Ujian'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Riwayat Hasil & Modul Pembelajaran */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                Riwayat Hasil & Modul Pembelajaran
              </h2>
              <p className="text-xs text-slate-400">Hasil evaluasi tes dan materi referensi maritim Anda</p>
            </div>
            <Link
              href="/student/history"
              className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] shrink-0"
            >
              Lihat Semua
            </Link>
          </div>

          {/* Desktop Table View (md+ screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 font-semibold">Ujian / Materi</th>
                  <th className="pb-3 font-semibold">Kategori</th>
                  <th className="pb-3 font-semibold">Status / Nilai</th>
                  <th className="pb-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentResults.length > 0 ? (
                  recentResults.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{res.test_name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{formatDateIndo(res.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D8EEFD] text-[#0369A1] uppercase tracking-wider">
                          STANDAR CEFR
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0284C7] text-xs">{res.score}%</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              res.is_passed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {res.is_passed ? 'LULUS' : 'REMEDIAL'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/student/test/result/${res.attempt_id || res.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:border-[#0284C7] text-slate-400 hover:text-[#0284C7] hover:bg-sky-50 transition-colors shadow-2xs"
                          title="Lihat Rincian Hasil"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : articles.length > 0 ? (
                  articles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{art.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{formatDateIndo(art.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ECFEFF] text-[#06B6D4] uppercase tracking-wider">
                          {art.category || 'IMO SMCP'}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600 font-medium">
                        Materi Referensi Siap Baca
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/student/articles/${art.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:border-[#0284C7] text-slate-400 hover:text-[#0284C7] hover:bg-sky-50 transition-colors shadow-2xs"
                          title="Baca Materi"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  defaultSampleRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{row.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{row.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D8EEFD] text-[#0369A1] uppercase tracking-wider">
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="font-medium text-slate-700 text-xs">
                          {row.statusText}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={row.href}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:border-[#0284C7] text-slate-400 hover:text-[#0284C7] hover:bg-sky-50 transition-colors shadow-2xs"
                          title="Buka"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List (< md screens) */}
          <div className="block md:hidden space-y-2.5">
            {recentResults.length > 0 ? (
              recentResults.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-xs shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs leading-snug truncate">{res.test_name}</p>
                        <p className="text-[10px] text-slate-400">{formatDateIndo(res.created_at)}</p>
                      </div>
                    </div>
                    <span className="font-mono font-black text-[#4F46E5] text-xs shrink-0">{res.score}%</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#EEF0FF] text-[#4F46E5] uppercase tracking-wider">
                        STANDAR CEFR
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${res.is_passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                          }`}
                      >
                        {res.is_passed ? 'LULUS' : 'REMEDIAL'}
                      </span>
                    </div>

                    <Link
                      href={`/student/test/result/${res.attempt_id || res.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4F46E5] hover:text-[#4338CA] shrink-0"
                    >
                      <span>Lihat Hasil</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              defaultSampleRows.map((row) => (
                <div
                  key={row.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-xs shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs leading-snug truncate">{row.title}</p>
                        <p className="text-[10px] text-slate-400">{row.date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#EEF0FF] text-[#4F46E5] uppercase tracking-wider">
                      {row.type}
                    </span>
                    <Link
                      href={row.href}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4F46E5] hover:text-[#4338CA] shrink-0"
                    >
                      <span>Buka</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Right Sidebar Widgets Panel */}
      <RightStatsPanel />
    </div>
  );
}
