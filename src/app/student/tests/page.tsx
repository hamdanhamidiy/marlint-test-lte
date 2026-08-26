'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Lock,
  Unlock,
  ArrowRight,
  FileCheck2,
  Clock,
  Award,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';

export default function StudentTestsCatalogPage() {
  const { user, profile, isSuperAdmin, isInstructor } = useAuth();
  const [tests, setTests] = useState<MarlintTest[]>([]);
  const [entitlements, setEntitlements] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'unlocked' | 'fb' | 'housekeeping' | 'culinary'>('all');

  useEffect(() => {
    async function loadTestsAndEntitlements() {
      try {
        setLoading(true);

        const { data: testData } = await supabase
          .from('marlint_tests')
          .select('*')
          .eq('is_active', true)
          .order('test_number', { ascending: true });

        if (testData && testData.length > 0) {
          setTests(testData as MarlintTest[]);
        }

        const isStaff = isSuperAdmin || isInstructor || profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'instructor';
        if (isStaff) {
          setEntitlements(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
          return;
        }

        const entSet = new Set<number>([1]); // Test 1 is default free

        if (user || profile) {
          const userIds = [user?.id, profile?.id].filter(Boolean);
          const userEmails = [user?.email, profile?.email].filter(Boolean);

          try {
            if (userIds.length > 0) {
              const { data: entData } = await supabase
                .from('test_entitlements')
                .select('test_number, is_active')
                .in('user_id', userIds)
                .eq('is_active', true);

              if (entData) {
                entData.forEach((e) => entSet.add(e.test_number));
              }
            }
          } catch (e) {}

          if (typeof window !== 'undefined') {
            const checkKeys = [
              ...userIds.map((id) => `marlins_entitlements_${id}`),
              ...userEmails.map((em) => `marlins_entitlements_${em?.toLowerCase()}`),
              'marlins_entitlements_all',
            ];

            checkKeys.forEach((k) => {
              const localEnt = localStorage.getItem(k);
              if (localEnt) {
                try {
                  const arr = JSON.parse(localEnt);
                  if (Array.isArray(arr)) {
                    arr.forEach((num) => entSet.add(Number(num)));
                  }
                } catch (e) {}
              }
            });
          }
        }

        setEntitlements(entSet);
      } catch (err) {
        console.error('Error loading tests catalog:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTestsAndEntitlements();
  }, [user, profile, isSuperAdmin, isInstructor]);

  const filteredTests = tests.filter((t) => {
    const isFree = t.is_free;
    const isUnlocked = isFree || entitlements.has(t.test_number);
    const formattedName = t.test_name ? t.test_name.replace(/Marlint/gi, 'Marlins') : '';

    let matchesFilter = true;
    if (activeFilter === 'free') matchesFilter = isFree;
    else if (activeFilter === 'unlocked') matchesFilter = isUnlocked;
    else if (activeFilter === 'fb') matchesFilter = [1, 2, 3, 7].includes(t.test_number);
    else if (activeFilter === 'housekeeping') matchesFilter = [4, 5, 9].includes(t.test_number);
    else if (activeFilter === 'culinary') matchesFilter = [6, 8, 10].includes(t.test_number);

    const matchesSearch =
      formattedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(t.test_number).includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5 sm:space-y-6 min-w-0 max-w-7xl mx-auto font-sans pb-12">
      {/* Page Header */}
      <div className="space-y-1.5 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sekolah Perhotelan & Kapal Pesiar LTE Cruise</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Katalog Paket Ujian Marlins (Test 1–10)
        </h1>
        <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed max-w-xl">
          Daftar 10 paket simulasi asesmen Bahasa Inggris standar perhotelan internasional & kru kapal pesiar LTE Cruise.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 pb-4 border-b border-slate-200/70">
        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nomor atau judul paket ujian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200/90 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Semua ({tests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('free')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'free'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Gratis
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('unlocked')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'unlocked'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Terbuka
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('fb')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'fb'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            F&B Service & Bar
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('housekeeping')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'housekeeping'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Housekeeping & Laundry
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('culinary')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'culinary'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Culinary & Galley
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-400 text-xs shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <p className="font-bold text-slate-700">Memuat katalog ujian resmi...</p>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-500 text-xs shadow-xs space-y-3">
          <p className="font-medium text-slate-700">Tidak ada paket ujian yang sesuai dengan kriteria pencarian.</p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pencarian</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTests.map((test) => {
            const hasAccess = test.is_free || entitlements.has(test.test_number);
            const isTest1 = test.test_number === 1;
            const formattedTestName = test.test_name ? test.test_name.replace(/Marlint/gi, 'Marlins') : `Marlins Test ${test.test_number}`;

            return (
              <div
                key={test.id}
                className={`bg-white rounded-[26px] p-5 sm:p-6 border transition-all duration-300 ease-out flex flex-col justify-between h-full group relative overflow-hidden ${
                  isTest1
                    ? 'border-sky-300/80 shadow-[0_4px_20px_rgba(2,132,199,0.06)] hover:shadow-xl hover:border-[#0284C7] hover:-translate-y-1'
                    : 'border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-slate-400 hover:-translate-y-1'
                }`}
              >
                {/* Top Header Row */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/80 shrink-0 shadow-2xs">
                        <Unlock className="w-3 h-3 text-emerald-600" />
                        <span>{test.is_free ? 'Gratis' : 'Akses Terbuka'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C2410C] text-[11px] font-bold border border-orange-200 shrink-0 shadow-2xs">
                        <Lock className="w-3 h-3 text-[#EA580C]" />
                        <span>{formatPriceIDR(test.price)}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className={`font-heading text-base font-bold text-slate-900 transition-colors leading-snug line-clamp-1 ${
                      isTest1 ? 'group-hover:text-[#0284C7]' : 'group-hover:text-[#EA580C]'
                    }`}>
                      {formattedTestName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal min-h-[2.25rem]">
                      {test.description || 'Evaluasi standar kompetensi Bahasa Inggris Maritim IMO STCW untuk perwira dan rating kapal.'}
                    </p>
                  </div>
                </div>

                {/* Details Row (Specs) & CTA Button */}
                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3.5">
                  {/* Inline specs with clean typography */}
                  <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-2xl bg-slate-50/90 border border-slate-100/90 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">Waktu</span>
                      <span className="text-xs font-extrabold text-amber-600 mt-0.5">Stopwatch</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-x border-slate-200/70 px-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">Soal</span>
                      <span className="text-xs font-extrabold text-slate-800 mt-0.5">{test.total_questions >= 60 ? test.total_questions : 60} butir</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">Passing</span>
                      <span className="text-xs font-extrabold text-emerald-600 mt-0.5">{test.passing_grade}%</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={hasAccess ? `/student/test/${test.test_number}` : `/student/checkout/${test.test_number}`}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                      hasAccess
                        ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sky-500/20'
                        : 'bg-black hover:bg-neutral-800 text-white shadow-slate-900/10'
                    }`}
                  >
                    <span>{hasAccess ? 'Mulai Ujian Sekarang' : `Beli Akses (${formatPriceIDR(test.price)})`}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
