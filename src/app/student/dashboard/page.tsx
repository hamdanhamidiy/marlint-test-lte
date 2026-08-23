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
  CheckCircle2,
  Play,
  Layers,
  Compass,
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
      timer = setTimeout(() => setIsDeleting(true), 2800);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
    } else {
      const speed = isDeleting ? 18 : 35;
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

          if (resultsRes.data) setRecentResults(resultsRes.data as StudentResult[]);
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
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* Center Main Content Area */}
      <div className="flex-1 w-full space-y-6 sm:space-y-7 min-w-0">
        
        {/* Executive Header Greeting (Clean, Human, Professional) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Standar Resmi IMO STCW & SMCP • Marlins English
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Halo, {greetingName}! <span className="animate-wave inline-block ml-1">👋</span>
            </h1>
            <div className="min-h-[22px] flex items-center">
              <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
                <span>{currentText}</span>
                <span className="animate-cursor font-bold text-[#4F46E5] ml-0.5">|</span>
              </p>
            </div>
          </div>

          {/* Quick Header CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/student/test/1"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm shadow-indigo-500/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Mulai Marlins Test 1</span>
            </Link>
          </div>
        </div>

        {/* Featured Spotlight Card: Marlins Test 1 (Primary Assessment) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B192C] via-[#1E293B] to-[#1E1B4B] text-white p-6 sm:p-7 shadow-lg shadow-slate-900/10 border border-slate-800">
          {/* Ambient Background Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
                  Akses Terbuka (Gratis)
                </span>
                <span className="text-xs text-slate-300 font-semibold">•</span>
                <span className="text-xs text-slate-300 font-semibold">Paket Asesmen Utama #1</span>
              </div>

              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
                  Marlins English Test 1 — Standard Evaluation
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mt-1">
                  Uji komprehensif 60 butir soal: Grammar, Listening Audio, Drag & Drop Label, Kosakata Maritim, dan Waktu/Angka standar perwira kapal.
                </p>
              </div>

              {/* Spec Pills */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-1 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                  <Clock className="w-3.5 h-3.5 text-cyan-300" />
                  <span>60 Menit</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                  <Layers className="w-3.5 h-3.5 text-cyan-300" />
                  <span>60 Butir Soal</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Passing Grade 70%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 justify-center">
              <Link
                href="/student/test/1"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Mulai Ujian Sekarang</span>
                <ArrowRight className="w-4 h-4 text-[#4F46E5]" />
              </Link>
              <p className="text-[11px] text-slate-400 text-center font-medium">
                Hasil & Sertifikat Kelulusan Instan
              </p>
            </div>
          </div>
        </div>

        {/* Paket Ujian Marlins Lanjutan (Paket 2 & Paket 3) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Paket Ujian Lanjutan
              </h2>
              <p className="text-xs text-slate-400 font-normal">
                Tingkatkan kompetensi ke jenjang komunikasi maritim dan operasional tingkat lanjut
              </p>
            </div>
            <Link
              href="/student/tests"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors shrink-0"
            >
              <span>Lihat Semua Paket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full p-8 text-center bg-white border border-slate-200/80 rounded-2xl text-slate-400 text-xs shadow-xs">
                Memuat paket ujian...
              </div>
            ) : (
              tests.slice(1, 3).map((test) => {
                const hasAccess = test.is_free || entitlements.has(test.test_number);

                return (
                  <div
                    key={test.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between h-full group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold">
                          Paket #{test.test_number}
                        </span>
                        {hasAccess ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            <Unlock className="w-3 h-3" />
                            <span>Akses Terbuka</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>{formatPriceIDR(test.price)}</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-heading text-sm font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors leading-snug">
                          {test.test_name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1">
                          {test.description || 'Evaluasi standar kompetensi Bahasa Inggris Maritim IMO STCW.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="text-[11px] font-semibold text-slate-500">
                        <span>{test.duration} mnt</span> • <span>60 soal</span> • <span className="text-emerald-600 font-bold">{test.passing_grade}% pass</span>
                      </div>
                      <Link
                        href={`/student/test/${test.test_number}`}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          hasAccess
                            ? 'bg-indigo-50 text-[#4F46E5] hover:bg-indigo-100'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        <span>{hasAccess ? 'Mulai' : 'Buka Akses'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Riwayat Hasil & Modul Pembelajaran */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900">
                Riwayat Evaluasi & Materi Terverifikasi
              </h2>
              <p className="text-xs text-slate-400">Hasil evaluasi tes dan materi referensi maritim Anda</p>
            </div>
            <Link
              href="/student/history"
              className="text-xs font-bold text-[#4F46E5] hover:underline shrink-0"
            >
              Lihat Semua
            </Link>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 font-semibold">Ujian / Materi</th>
                  <th className="pb-3 font-semibold">Standar</th>
                  <th className="pb-3 font-semibold">Hasil / Status</th>
                  <th className="pb-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentResults.length > 0 ? (
                  recentResults.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-xs shrink-0">
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{res.test_name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{formatDateIndo(res.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF0FF] text-[#4F46E5] uppercase tracking-wider">
                          CEFR B1/B2
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#4F46E5] text-xs">{res.score}%</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
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
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 hover:border-[#4F46E5] text-slate-400 hover:text-[#4F46E5] hover:bg-indigo-50/50 transition-colors"
                          title="Lihat Rincian Hasil"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : articles.length > 0 ? (
                  articles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{art.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{formatDateIndo(art.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFEFF] text-[#06B6D4] uppercase tracking-wider">
                          {art.category || 'IMO SMCP'}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600 font-medium text-xs">
                        Materi Referensi Siap Baca
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/student/articles/${art.id}`}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 hover:border-[#4F46E5] text-slate-400 hover:text-[#4F46E5] hover:bg-indigo-50/50 transition-colors"
                          title="Baca Materi"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  defaultSampleRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-xs shrink-0">
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{row.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{row.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF0FF] text-[#4F46E5] uppercase tracking-wider">
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
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 hover:border-[#4F46E5] text-slate-400 hover:text-[#4F46E5] hover:bg-indigo-50/50 transition-colors"
                          title="Buka"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
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
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-xs shrink-0">
                        <FileCheck2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs leading-snug truncate">{res.test_name}</p>
                        <p className="text-[10px] text-slate-400">{formatDateIndo(res.created_at)}</p>
                      </div>
                    </div>
                    <span className="font-mono font-black text-[#4F46E5] text-xs shrink-0">{res.score}%</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {res.is_passed ? 'LULUS' : 'REMEDIAL'}
                    </span>

                    <Link
                      href={`/student/test/result/${res.attempt_id || res.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4F46E5]"
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
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-slate-900 text-xs leading-snug truncate">{row.title}</p>
                    <Link
                      href={row.href}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4F46E5]"
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
