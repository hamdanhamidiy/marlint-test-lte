'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowRight,
  Compass,
  FileCheck2,
  Anchor,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { LevelInfo } from '@/lib/supabase/types';

export default function StudentLevelPage() {
  const { profile } = useAuth();
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLevels() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('levels')
          .select('*')
          .order('order_index', { ascending: true });

        if (data && data.length > 0) {
          setLevels(data as LevelInfo[]);
        } else {
          setLevels([
            { code: 'A1', name: 'Beginner (Trainee)', description: 'Kosakata dasar maritim dan komunikasi sederhana. Mampu memahami perintah kerja dasar di atas kapal.', order_index: 1, min_score: 0 },
            { code: 'A2', name: 'Elementary (Ordinary Seaman)', description: 'Ekspresi rutin harian kapal. Mampu berkomunikasi dalam tugas rutin geladak (Deck) dan kamar mesin (Engine).', order_index: 2, min_score: 45 },
            { code: 'B1', name: 'Intermediate (Able Seafarer Deck/Engine)', description: 'Bahasa Inggris maritim operasional standar. Memahami instruksi radio VHF dan prosedur keselamatan kerja.', order_index: 3, min_score: 55 },
            { code: 'B1+', name: 'Competent (Officer of the Watch - OOW)', description: 'Perintah komando operasional untuk perwira jaga navigasi anjungan dan kamar mesin (ANT/ATT III).', order_index: 4, min_score: 65 },
            { code: 'B2', name: 'Upper Intermediate (Chief Officer / 2nd Eng)', description: 'Pemahaman teks teknis, regulasi SOLAS/MARPOL, serta komunikasi darurat dan koordinasi bongkar muat.', order_index: 5, min_score: 75 },
            { code: 'C1', name: 'Advanced / Master Mariner (Management Level)', description: 'Kelancaran penuh komando operasional dan manajerial kapal untuk Nakhoda dan Kepala Kamar Mesin (ANT/ATT I).', order_index: 6, min_score: 85 },
          ]);
        }
      } catch (err) {
        console.error('Error loading levels:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLevels();
  }, []);

  const currentLevelCode = (profile?.level_code || 'A1').toUpperCase();
  const currentPoints = profile?.total_points || 0;
  const progressPercent = Math.min(Math.max(Math.round((currentPoints / 800) * 100), 35), 95);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const officerQualifications = [
    { rank: 'Management Level', standard: 'C1 / B2', roles: 'Master, Chief Mate, Chief Engineer, 2nd Engineer' },
    { rank: 'Operational Level', standard: 'B1+ / B1', roles: 'Officer in Charge of Navigational / Engineering Watch' },
    { rank: 'Support Level', standard: 'A2 / A1', roles: 'Able Seafarer, Ordinary Seaman, Wiper, Cook, Cadet' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#0B192C] p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/15">
        <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 hidden sm:block">
          <svg width="220" height="220" viewBox="0 0 100 100" fill="none">
            <path
              d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z"
              fill="white"
              fillOpacity="0.25"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>STANDAR CEFR MARITIM INTERNASIONAL IMO STCW</span>
          </div>

          <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
            Level Kemahiran Bahasa Inggris Anda
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
            Penjenjangan kompetensi bahasa Inggris pelaut berdasarkan standar Common European Framework of Reference (CEFR) untuk sertifikasi perwira dan rating kapal.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: CEFR Ladder Cards (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base sm:text-lg font-extrabold text-slate-900">
              Jenjang Kompetensi & Persyaratan Level
            </h2>
            <span className="text-xs text-slate-400 font-medium">6 Jenjang Standar</span>
          </div>

          <div className="space-y-3">
            {levels.map((lvl) => {
              const isCurrent = lvl.code.toUpperCase() === currentLevelCode;

              return (
                <div
                  key={lvl.code}
                  className={`p-4 sm:p-5 rounded-[24px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'border-[#5046E5] bg-[#EEF0FF]/50 shadow-xs ring-2 ring-[#5046E5]/20'
                      : 'border-slate-100 hover:border-slate-200 bg-white shadow-2xs'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl font-mono text-sm font-extrabold flex items-center justify-center shrink-0 shadow-2xs ${
                        isCurrent
                          ? 'bg-[#5046E5] text-white shadow-indigo-500/25 scale-105'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {lvl.code}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-sm font-extrabold text-slate-900">{lvl.name}</h3>
                        {isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#5046E5] text-white text-[9px] font-bold uppercase tracking-wider">
                            Level Anda
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 max-w-xl font-normal leading-relaxed">{lvl.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">SKOR MINIMAL</span>
                      <span className="font-mono text-xs font-bold text-slate-900">{lvl.min_score}%</span>
                    </div>

                    {isCurrent && (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-[#5046E5] flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Level Summary & STCW Matrix (1 Col) */}
        <div className="space-y-5 lg:sticky lg:top-6">
          {/* Current Level Card */}
          <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-2xs text-center space-y-4">
            <h3 className="font-heading text-sm font-extrabold text-slate-900">
              Pencapaian Level Saat Ini
            </h3>

            {/* Circular Progress Ring */}
            <div className="relative flex items-center justify-center mx-auto">
              <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#5046E5"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-black text-slate-900">{currentLevelCode}</span>
                <span className="text-[10px] font-bold text-[#5046E5]">{currentPoints} XP</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">
                {profile?.full_name || 'Capt. Budi Santoso'}
              </p>
              <p className="text-[11px] text-slate-400">
                {profile?.job_title || 'Chief Officer'} • Standar STCW
              </p>
            </div>

            <Link
              href="/student/tests"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold text-white bg-[#5046E5] hover:bg-[#4338CA] transition-all shadow-md shadow-indigo-500/20"
            >
              <span>Tingkatkan Level Ujian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* STCW Standard Matrix Card */}
          <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-2xs space-y-3">
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Anchor className="w-3.5 h-3.5 text-[#5046E5]" />
              <span>Matriks Standar Jabatan STCW</span>
            </h3>

            <div className="space-y-2.5">
              {officerQualifications.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.rank}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#EEF0FF] text-[#5046E5]">
                      {item.standard}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{item.roles}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
