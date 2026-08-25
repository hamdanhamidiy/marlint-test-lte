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

  // Competency score bars for maritime English skills in sleek dark monochrome
  const chartBars = [
    { height: 75, label: 'Grammar', value: '75%' },
    { height: 85, label: 'Listen', value: '85%' },
    { height: 60, label: 'Vocab', value: '60%' },
    { height: 90, isHighlight: true, label: 'SMCP', value: '90%' },
    { height: 70, label: 'Read', value: '70%' },
  ];

  return (
    <aside className="w-full lg:w-80 bg-white rounded-[28px] p-5 sm:p-6 border border-slate-200/90 space-y-5 select-none shrink-0 shadow-2xs">
      {/* User Profile Card Summary */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-11 h-11 rounded-full bg-black p-0.5 shadow-xs flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center text-base overflow-hidden">
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
            <span className="text-slate-400 text-xs">⚓</span>
          </div>
          <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
            Level {levelCode} • <span className="text-slate-900 font-bold">{currentPoints} XP</span>
          </p>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200 shrink-0">
          {levelCode}
        </span>
      </div>

      {/* Bar Chart Widget (Kompetensi Bahasa Inggris Maritim) */}
      <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-200/80 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-900 tracking-tight">Kompetensi Maritim</span>
          <span className="text-xs text-slate-900 font-bold px-2.5 py-0.5 rounded-full bg-slate-200/80 border border-slate-300/80">
            {scoreAverage}% Rata-rata
          </span>
        </div>

        {/* Dynamic Visual Bar Chart with Clean Dark / Slate Bars */}
        <div className="h-24 flex items-end justify-between px-1.5 pt-2">
          <div className="w-full flex items-end justify-around h-full gap-2">
            {chartBars.map((bar, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
                title={`${bar.label}: ${bar.value}`}
              >
                {/* Tooltip on hover */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 text-[9px] font-bold font-mono bg-black text-white px-1.5 py-0.5 rounded-md pointer-events-none z-20">
                  {bar.value}
                </span>

                {/* Animated colored bar */}
                <div
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 group-hover:scale-105 cursor-pointer shadow-2xs ${
                    bar.isHighlight
                      ? 'bg-black hover:bg-neutral-800'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  style={{ height: `${bar.height}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* X-axis competency labels */}
        <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold px-1 pt-2 border-t border-slate-200/60">
          <span className="text-center flex-1">Grammar</span>
          <span className="text-center flex-1">Listen</span>
          <span className="text-center flex-1">Vocab</span>
          <span className="text-center flex-1 font-bold text-black">SMCP</span>
          <span className="text-center flex-1">Read</span>
        </div>
      </div>

      {/* Sertifikasi & Standar Maritim Section */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">
            Status Sertifikasi
          </h3>
          <Link
            href="/student/certificates"
            className="text-[11px] font-bold text-slate-900 hover:underline"
          >
            Lihat Sertifikat
          </Link>
        </div>

        {/* CEFR & STCW Competency Card */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Standar STCW 2010</p>
                <p className="text-[10px] text-slate-500">Perwira & Rating Kapal</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-bold">
              Passing 70%
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            <span className="text-slate-500 text-[11px]">Jenjang Bahasa:</span>
            <span className="font-bold text-black">Level {levelCode} Operational</span>
          </div>
        </div>

        {/* Action Links */}
        <div className="space-y-2 pt-1">
          <Link
            href="/student/level"
            className="w-full flex items-center justify-between px-4 py-3 rounded-full border border-slate-200/90 hover:bg-slate-50 hover:border-black transition-colors text-xs font-bold text-slate-800 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-black" />
              <span>Matriks Jenjang CEFR Maritim</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Link
            href="/student/articles"
            className="w-full flex items-center justify-center py-3 rounded-full text-xs font-bold text-white bg-black hover:bg-neutral-800 transition-all shadow-xs"
          >
            <span>Buka Modul Materi IMO SMCP</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
