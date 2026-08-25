'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { getLevelBadge } from '@/lib/utils';

interface RightStatsPanelProps {
  scoreAverage?: number;
  totalTestsCompleted?: number;
}

export default function RightStatsPanel({
  scoreAverage = 78,
  totalTestsCompleted = 3,
}: RightStatsPanelProps) {
  const { profile } = useAuth();

  const displayName = profile?.full_name || 'Budi Santoso (Perwira Pelaut)';
  const currentPoints = profile?.total_points || 540;
  const levelCode = profile?.level_code || 'B1+';

  // Competency score bars for maritime English skills in solid black & maritime blue
  const chartBars = [
    { height: 75, label: 'Grammar', value: '75%', color: 'bg-slate-300 hover:bg-slate-400' },
    { height: 85, label: 'Listen', value: '85%', color: 'bg-slate-800 hover:bg-black' },
    { height: 60, label: 'Vocab', value: '60%', color: 'bg-slate-300 hover:bg-slate-400' },
    { height: 90, isHighlight: true, label: 'SMCP', value: '90%', color: 'bg-[#0284C7] hover:bg-[#0369A1] shadow-sm shadow-sky-500/30' },
    { height: 70, label: 'Read', value: '70%', color: 'bg-slate-300 hover:bg-slate-400' },
  ];

  return (
    <aside className="w-full lg:w-80 bg-white rounded-[26px] p-5 border border-slate-200/90 space-y-4 select-none shrink-0 shadow-2xs">
      {/* User Profile Card Summary */}
      <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0284C7] via-slate-900 to-[#EA580C] p-0.5 shadow-xs flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center text-sm overflow-hidden">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              '👨‍✈️'
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-heading text-sm font-bold text-slate-900 truncate leading-snug">
              {displayName}
            </h3>
            <span className="text-amber-500 text-xs">⚓</span>
          </div>
          <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
            Level {levelCode} • <span className="text-[#EA580C] font-bold">{currentPoints} XP</span>
          </p>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0369A1] text-[10px] font-bold border border-sky-200 shrink-0">
          {levelCode}
        </span>
      </div>

      {/* Bar Chart Widget (Kompetensi Bahasa Inggris Maritim) */}
      <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-900 tracking-tight">Kompetensi Maritim</span>
          <span className="text-xs text-[#C2410C] font-bold px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 shadow-2xs">
            {scoreAverage}% Rata-rata
          </span>
        </div>

        {/* Dynamic Visual Bar Chart with Fixed Height Container */}
        <div className="h-24 flex items-end justify-between px-1.5 pt-2">
          <div className="w-full flex items-end justify-around h-full gap-2">
            {chartBars.map((bar, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
                title={`${bar.label}: ${bar.value}`}
              >
                {/* Tooltip on hover */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 text-[9px] font-bold font-mono bg-slate-950 text-white px-1.5 py-0.5 rounded-md pointer-events-none z-20 shadow-xs">
                  {bar.value}
                </span>

                {/* Animated colored bar */}
                <div
                  className={`w-full max-w-[26px] rounded-t-lg transition-all duration-300 group-hover:scale-105 cursor-pointer shadow-2xs ${bar.color}`}
                  style={{ height: `${bar.height}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* X-axis competency labels */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-1 pt-2 border-t border-slate-200/60">
          <span className="text-center flex-1 font-medium text-slate-700">Grammar</span>
          <span className="text-center flex-1 font-bold text-slate-900">Listen</span>
          <span className="text-center flex-1 font-medium text-slate-700">Vocab</span>
          <span className="text-center flex-1 font-bold text-[#0284C7]">SMCP</span>
          <span className="text-center flex-1 font-medium text-slate-700">Read</span>
        </div>
      </div>

      {/* Sertifikasi & Standar Maritim Section */}
      <div className="space-y-3 pt-0.5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">
            Status Sertifikasi
          </h3>
          <Link
            href="/student/certificates"
            className="text-[11px] font-bold text-[#0284C7] hover:text-[#0369A1] hover:underline"
          >
            Lihat Sertifikat
          </Link>
        </div>

        {/* CEFR & STCW Competency Card */}
        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-[#EA580C] flex items-center justify-center text-xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Standar STCW 2010</p>
                <p className="text-[10px] text-slate-500">Perwira & Rating Kapal</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              Passing 70%
            </span>
          </div>

          <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-xs">
            <span className="text-slate-600 text-[11px] font-medium">Jenjang Bahasa:</span>
            <span className="font-bold text-[#0284C7]">Level {levelCode} Operational</span>
          </div>
        </div>

        {/* Action Links */}
        <div className="space-y-2 pt-0.5">
          <Link
            href="/student/level"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-full border border-slate-200/90 hover:bg-sky-50/50 hover:border-[#0284C7] transition-all text-xs font-bold text-slate-900 shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0284C7]" />
              <span className="group-hover:text-[#0284C7] transition-colors">Matriks Jenjang CEFR Maritim</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/student/articles"
            className="w-full flex items-center justify-center py-2.5 rounded-full text-xs font-bold text-white bg-black hover:bg-neutral-800 transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Buka Modul Materi IMO SMCP</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
