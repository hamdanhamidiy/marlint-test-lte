'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  ArrowRight,
  Lock,
  Unlock,
  ShieldCheck,
  Search,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';

export default function StudentTestsPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState<MarlintTest[]>([]);
  const [entitlements, setEntitlements] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'unlocked' | 'deck' | 'engine'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);

        const { data: testsData } = await supabase
          .from('marlint_tests')
          .select('*')
          .eq('is_active', true)
          .order('test_number', { ascending: true });

        if (testsData) {
          setTests(testsData as MarlintTest[]);
        }

        if (user) {
          const entSet = new Set<number>();
          try {
            const { data: entData } = await supabase
              .from('test_entitlements')
              .select('test_number')
              .eq('user_id', user.id)
              .eq('is_active', true);

            if (entData) {
              entData.forEach((e) => entSet.add(e.test_number));
            }
          } catch (e) {}

          if (typeof window !== 'undefined') {
            const localEnt = localStorage.getItem(`marlins_entitlements_${user.id}`);
            if (localEnt) {
              try {
                const arr = JSON.parse(localEnt);
                if (Array.isArray(arr)) {
                  arr.forEach((num) => entSet.add(Number(num)));
                }
              } catch (e) {}
            }
          }

          setEntitlements(entSet);
        }
      } catch (err) {
        console.error('Error loading tests:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTests();
  }, [user]);

  const filteredTests = tests.filter((t) => {
    const hasAccess = t.is_free || entitlements.has(t.test_number);
    let matchesFilter = true;

    if (activeFilter === 'free') {
      matchesFilter = t.is_free;
    } else if (activeFilter === 'unlocked') {
      matchesFilter = hasAccess;
    } else if (activeFilter === 'deck') {
      const text = (t.test_name + ' ' + (t.description || '')).toLowerCase();
      matchesFilter = text.includes('deck') || text.includes('navigation') || text.includes('1') || text.includes('3') || text.includes('5');
    } else if (activeFilter === 'engine') {
      const text = (t.test_name + ' ' + (t.description || '')).toLowerCase();
      matchesFilter = text.includes('engine') || text.includes('technical') || text.includes('2') || text.includes('4') || text.includes('6');
    }

    const matchesSearch =
      searchQuery === '' ||
      t.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(t.test_number).includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5 sm:space-y-6 min-w-0">
      {/* Page Header */}
      <div className="space-y-1.5 pt-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E0E7FF] text-[#4338CA] text-[11px] font-bold tracking-tight">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Standar Resmi IMO STCW & SMCP</span>
        </div>
        <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Katalog Paket Ujian Marlins
        </h1>
        <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xl">
          Daftar paket uji kompetensi Bahasa Inggris Maritim resmi untuk perwira dan rating kapal.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 pb-4 border-b border-slate-200/70">
        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nomor atau judul tes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
            }`}
          >
            Semua ({tests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('free')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'free'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
            }`}
          >
            Gratis
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('unlocked')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'unlocked'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
            }`}
          >
            Terbuka
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('deck')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'deck'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
            }`}
          >
            Deck (ANT)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('engine')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'engine'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
            }`}
          >
            Engine (ATT)
          </button>
        </div>
      </div>

      {/* Test List Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl text-slate-400 text-xs shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto animate-pulse">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <p className="font-semibold text-slate-700">Memuat katalog ujian resmi...</p>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl text-slate-500 text-xs shadow-xs space-y-3">
          <p className="font-medium">Tidak ada paket ujian yang sesuai dengan kriteria pencarian.</p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pencarian</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredTests.map((test) => {
            const hasAccess = test.is_free || entitlements.has(test.test_number);

            return (
              <div
                key={test.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-indigo-300/80 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between h-full group relative overflow-hidden"
              >
                {/* Top Header Row */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold tracking-tight">
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 shrink-0">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>{formatPriceIDR(test.price)}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors leading-snug line-clamp-1">
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

                  {/* Action Button */}
                  <Link
                    href={`/student/test/${test.test_number}`}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs group-hover:shadow-md ${
                      hasAccess
                        ? 'bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-indigo-500/15 group-hover:scale-[1.01] active:scale-[0.99]'
                        : 'bg-slate-900 hover:bg-slate-800 text-white group-hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                  >
                    <span>{hasAccess ? 'Mulai Ujian Sekarang' : 'Buka Akses Ujian'}</span>
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
