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
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest, StudentResult, Article } from '@/lib/supabase/types';
import { formatPriceIDR, formatDateIndo } from '@/lib/utils';
import RightStatsPanel from '@/components/dashboard/RightStatsPanel';

import { getUserUnlockedTests } from '@/lib/entitlements';

const TYPEWRITER_PHRASES = [
  'Siap mengikuti evaluasi Marlins Test standar perhotelan & kapal pesiar hari ini?',
  'Uji kecakapan bahasa Inggris departemen Food & Beverage, Housekeeping, Guest Service & Maritim.',
  'Raih sertifikat resmi Marlins Test untuk lolos seleksi hotel & kapal pesiar internasional.',
];

export default function StudentDashboardPage() {
  const { profile, user, isSuperAdmin, isInstructor } = useAuth();
  const [tests, setTests] = useState<MarlintTest[]>([]);
  const [entitlements, setEntitlements] = useState<Set<number>>(new Set([1]));
  const [recentResults, setRecentResults] = useState<StudentResult[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const isStaff = isSuperAdmin || isInstructor || profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'instructor';

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

  const loadData = async (silent: boolean = false) => {
    try {
      if (!silent) setLoading(true);
      const activeId = user?.id || profile?.id;

      // Parallelize all queries into 1 single network trip
      const [testsRes, resultsRes, unlockedTests, articlesRes] = await Promise.all([
        supabase
          .from('marlint_tests')
          .select('*')
          .eq('is_active', true)
          .order('test_number', { ascending: true })
          .limit(6),
        user
          ? supabase
              .from('student_results')
              .select('*')
              .eq('student_id', user.id)
              .order('created_at', { ascending: false })
              .limit(5)
          : Promise.resolve({ data: null, error: null }),
        user
          ? getUserUnlockedTests(user.id, user.email, isStaff)
          : Promise.resolve(new Set<number>([1])),
        supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(4),
      ]);

      if (testsRes.data) setTests(testsRes.data as MarlintTest[]);

      if (resultsRes.data && resultsRes.data.length > 0) {
        const resList = [...(resultsRes.data as StudentResult[])];
        resList.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        setRecentResults(resList.slice(0, 5));

        if (typeof window !== 'undefined' && activeId) {
          localStorage.setItem(`marlins_history_results_${activeId}`, JSON.stringify(resList));
        }
      }

      setEntitlements(unlockedTests);
      if (articlesRes.data) setArticles(articlesRes.data as Article[]);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Realtime subscription for live sync with Admin / Payment changes
    if (user?.id) {
      const channel = supabase
        .channel(`dashboard_realtime_${user.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'test_entitlements', filter: `user_id=eq.${user.id}` },
          () => {
            loadData(true);
          }
        )
        .subscribe();

      // Listen to cross-tab broadcast
      let broadcast: BroadcastChannel | null = null;
      try {
        broadcast = new BroadcastChannel('marlins_entitlements_sync');
        broadcast.onmessage = (e) => {
          if (e.data?.type === 'ENTITLEMENT_GRANTED') {
            loadData();
          }
        };
      } catch {}

      return () => {
        supabase.removeChannel(channel);
        if (broadcast) broadcast.close();
      };
    }
  }, [user, profile]);

  const getGreetingName = () => {
    if (!profile?.full_name) return 'Siswa LTE Cruise';
    const words = profile.full_name.split(' ');
    if (words.length > 1) {
      return `${words[0]} ${words[1]}`;
    }
    return profile.full_name;
  };

  const greetingName = getGreetingName();

  const avgScore =
    recentResults.length > 0
      ? Math.round(recentResults.reduce((acc, curr) => acc + (curr.score || 0), 0) / recentResults.length)
      : (profile?.total_points ? Math.min(Math.round((profile.total_points / 800) * 100), 92) : 78);

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
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 items-start max-w-7xl mx-auto font-sans pb-16">
      {/* Center Main Content Area */}
      <div className="flex-1 w-full space-y-3.5 sm:space-y-5 min-w-0">

        {/* Executive Maritime Hero Card - Well-Proportioned & Mobile Ergonomic */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-[26px] bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] p-4 sm:p-6 lg:p-7 text-white shadow-md sm:shadow-lg shadow-sky-500/15">
          {/* Decorative Star Watermark */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-25 hidden sm:block">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
              <path
                d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z"
                fill="white"
                fillOpacity="0.25"
              />
            </svg>
          </div>

          <div className="relative z-10 space-y-2.5 sm:space-y-4">
            {/* Top Subtitle Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] sm:text-[11px] font-bold text-slate-100 backdrop-blur-xs w-fit max-w-full">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">LTE Cruise Training Center</span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <span className="text-slate-200 font-medium hidden sm:inline">Perhotelan & Kapal Pesiar</span>
            </div>

            {/* Main Greeting & Dynamic Typewriter */}
            <div className="space-y-1 sm:space-y-1.5">
              <h1 className="font-heading text-lg sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-2">
                <span>Halo, {greetingName}!</span>
                <span className="animate-wave inline-block text-xl sm:text-3xl ml-0.5">👋</span>
              </h1>

              <div className="min-h-[32px] sm:min-h-[24px] flex items-center">
                <p className="text-xs sm:text-sm text-slate-100 font-normal leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
                  <span>{currentText}</span>
                  <span className="font-bold text-amber-300 animate-pulse ml-0.5">|</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons - Ergonomic Touch Friendly */}
            <div className="pt-1.5 grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5">
              <Link
                href="/student/tests"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <Compass className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Pilih Paket Ujian Marlins</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/student/history"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all backdrop-blur-xs hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Lihat Riwayat Nilai</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-200" />
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Marlins Test Cards Grid (3 Paket Utama) */}
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight">
                  Paket Ujian Marlins
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>10 Paket</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-normal">
                Pilihan paket asesmen kompetensi maritim standar perwira & rating kapal
              </p>
            </div>
            <Link
              href="/student/tests"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors shrink-0 self-start sm:self-auto pt-0.5"
            >
              <span>Lihat Semua (10)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-3.5">
            {loading ? (
              <div className="col-span-full p-8 text-center bg-white border border-slate-200/80 rounded-2xl text-slate-400 text-xs shadow-xs space-y-2">
                <div className="w-7 h-7 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-spin">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className="font-semibold text-slate-700">Memuat paket ujian resmi...</p>
              </div>
            ) : (
              tests.slice(0, 3).map((test) => {
                const hasAccess = test.is_free || entitlements.has(test.test_number);
                const isTest1 = test.test_number === 1;
                const formattedTestName = test.test_name ? test.test_name.replace(/Marlint/gi, 'Marlins') : `Marlins Test ${test.test_number}`;

                return (
                  <div
                    key={test.id}
                    className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/80 hover-lift shadow-xs flex flex-col justify-between h-full group"
                  >
                    {/* Top Tag & Access Indicator */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-tight ${
                          isTest1 ? 'bg-sky-50 text-[#0284C7] border border-sky-100' : 'bg-slate-100 text-slate-700'
                        }`}>
                          Paket #{test.test_number}
                        </span>

                        {hasAccess ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
                            <Unlock className="w-3 h-3 text-emerald-600" />
                            <span>{test.is_free ? 'Gratis' : 'Akses Terbuka'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 shrink-0">
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>{formatPriceIDR(test.price)}</span>
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-slate-950 text-sm leading-snug group-hover:text-[#0284C7] transition-colors line-clamp-1">
                          {formattedTestName}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal min-h-[2rem]">
                          {test.description || 'Evaluasi standar kompetensi Bahasa Inggris Maritim IMO STCW untuk perwira dan rating kapal.'}
                        </p>
                      </div>
                    </div>

                    {/* Meta Specs & Action Button */}
                    <div className="pt-2.5 mt-2.5 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-0.5">
                        <span>{test.total_questions >= 60 ? test.total_questions : 60} Soal</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold">Pass: {test.passing_grade}%</span>
                        <span>•</span>
                        <span className="text-slate-600">Stopwatch</span>
                      </div>

                      <Link
                        href={hasAccess ? `/student/test/${test.test_number}` : `/student/checkout/${test.test_number}`}
                        className={`w-full flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-3.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] ${
                          hasAccess
                            ? 'bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] text-white shadow-sky-500/25'
                            : 'bg-gradient-to-r from-[#0B192C] via-[#1E293B] to-[#0B192C] hover:from-[#0369A1] hover:to-[#0284C7] text-white border border-slate-700/30'
                        }`}
                      >
                        <span>{hasAccess ? 'Mulai Ujian' : `Beli Akses (${formatPriceIDR(test.price)})`}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Riwayat Hasil & Modul Pembelajaran */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-3.5 sm:space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                Riwayat Hasil & Modul Pembelajaran
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-normal">Hasil evaluasi tes dan materi referensi maritim Anda</p>
            </div>
            <Link
              href="/student/history"
              className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] shrink-0 self-start sm:self-auto inline-flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Desktop Table View (md+ screens only) */}
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
                  recentResults.map((res) => {
                    const testTitle = res.test_name ? res.test_name.replace(/Marlint/gi, 'Marlins') : 'Marlins Test';
                    return (
                      <tr key={res.attempt_id || res.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                              <FileCheck2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900 leading-tight">{testTitle}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{formatDateIndo(res.created_at)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-[#0284C7] border border-sky-100 uppercase tracking-wider">
                            STANDAR CEFR
                          </span>
                        </td>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-slate-900 text-xs">{res.score}%</span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-2xs ${
                                res.is_passed
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/90'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200/90'
                              }`}
                            >
                              {res.is_passed ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>LULUS</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  <span>REMEDIAL</span>
                                </>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            href={`/student/test/result/${res.attempt_id || res.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 hover:border-[#0284C7] text-slate-400 hover:text-[#0284C7] hover:bg-sky-50 transition-all shadow-2xs"
                            title="Lihat Rincian Hasil"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : articles.length > 0 ? (
                  articles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 leading-tight">{art.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{formatDateIndo(art.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
                          {art.category || 'IMO SMCP'}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-[#0284C7] border border-sky-200/80">
                          <BookOpen className="w-3 h-3 text-[#0284C7]" />
                          <span>Modul Terverifikasi</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/student/articles/${art.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 hover:border-black text-slate-500 hover:text-black hover:bg-slate-100 transition-colors shadow-2xs"
                          title="Baca Modul"
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
                          <div className="w-8 h-8 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{row.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{row.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        {row.isPassed ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-slate-900 text-xs">{row.score}%</span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>LULUS</span>
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-[#0284C7] border border-sky-200/80">
                            <BookOpen className="w-3 h-3" />
                            <span>{row.statusText}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={row.href}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:border-black text-slate-500 hover:text-black hover:bg-slate-100 transition-colors shadow-2xs"
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

          {/* Mobile Card List (< md screens only) */}
          <div className="block md:hidden space-y-3">
            {recentResults.length > 0 ? (
              recentResults.map((res) => {
                const testTitle = res.test_name ? res.test_name.replace(/Marlint/gi, 'Marlins') : 'Marlins Test';
                return (
                  <div
                    key={res.attempt_id || res.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs hover:border-sky-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-extrabold text-slate-900 text-xs leading-snug break-words">{testTitle}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">{formatDateIndo(res.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-black text-slate-900 text-sm">{res.score}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-sky-50 text-[#0284C7] border border-sky-100 uppercase tracking-wider">
                          STANDAR CEFR
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            res.is_passed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {res.is_passed ? (
                            <>
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              <span>LULUS</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
                              <span>REMEDIAL</span>
                            </>
                          )}
                        </span>
                      </div>

                      <Link
                        href={`/student/test/result/${res.attempt_id || res.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] hover:text-[#0369A1] shrink-0"
                      >
                        <span>Lihat Hasil</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : articles.length > 0 ? (
              articles.map((art) => (
                <div
                  key={art.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs hover:border-sky-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-slate-900 text-xs leading-snug break-words">{art.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{formatDateIndo(art.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
                        {art.category || 'IMO SMCP'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-sky-50 text-[#0284C7] border border-sky-200/80">
                        <BookOpen className="w-2.5 h-2.5" />
                        <span>Modul Terverifikasi</span>
                      </span>
                    </div>

                    <Link
                      href={`/student/articles/${art.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] hover:text-[#0369A1] shrink-0"
                    >
                      <span>Baca Modul</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              defaultSampleRows.map((row) => (
                <div
                  key={row.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-slate-900 text-xs leading-snug break-words">{row.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{row.date}</p>
                      </div>
                    </div>
                    {row.score !== null && (
                      <span className="font-mono font-black text-slate-900 text-sm shrink-0">{row.score}%</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                      {row.type}
                    </span>
                    <Link
                      href={row.href}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] hover:text-[#0369A1] shrink-0"
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
      <RightStatsPanel scoreAverage={avgScore} totalTestsCompleted={recentResults.length} />
    </div>
  );
}
