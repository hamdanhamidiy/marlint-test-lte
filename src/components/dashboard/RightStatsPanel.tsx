'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Compass,
  GraduationCap,
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
  const [activeHoverBar, setActiveHoverBar] = useState<number | null>(null);

  const displayName = profile?.full_name || 'Budi Santoso (Perwira Pelaut)';
  const currentPoints = profile?.total_points || 540;
  const levelCode = profile?.level_code || 'A1';

  // Competency score bars for maritime English skills
  const chartBars = [
    { label: 'Grammar', value: 75, color: 'from-slate-700 to-slate-900', textColor: 'text-slate-800' },
    { label: 'Listen', value: 85, color: 'from-blue-600 to-blue-800', textColor: 'text-blue-600', isKey: true },
    { label: 'Vocab', value: 65, color: 'from-slate-700 to-slate-900', textColor: 'text-slate-800' },
    { label: 'SMCP', value: 90, color: 'from-emerald-500 to-emerald-700', textColor: 'text-emerald-600', isKey: true },
    { label: 'Read', value: 70, color: 'from-slate-700 to-slate-900', textColor: 'text-slate-800' },
  ];

  return (
    <aside className="w-full lg:w-80 bg-white rounded-3xl p-5 sm:p-5.5 border border-slate-200/80 space-y-4.5 select-none shrink-0 shadow-xs">
      {/* User Profile Card Summary */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-slate-900 to-slate-800 p-0.5 shadow-xs flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-800 overflow-hidden">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              (profile?.full_name || 'U').charAt(0).toUpperCase()
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-extrabold text-slate-950 truncate leading-snug">
              {displayName}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
            Level {levelCode} • <span className="text-amber-600 font-bold">{currentPoints} XP</span>
          </p>
        </div>

        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-100 shrink-0">
          Level {levelCode}
        </span>
      </div>

      {/* Bar Chart Widget (Kompetensi Bahasa Inggris Maritim) */}
      <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-extrabold text-slate-900 tracking-tight">Kompetensi Maritim</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
            {scoreAverage}% Rata-rata
          </span>
        </div>

        {/* Dynamic Visual Bar Chart with Smooth Transitions */}
        <div className="h-24 flex items-end justify-between px-1 pt-2">
          <div className="w-full flex items-end justify-around h-full gap-2">
            {chartBars.map((bar, idx) => {
              const isHovered = activeHoverBar === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveHoverBar(idx)}
                  onMouseLeave={() => setActiveHoverBar(null)}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <span
                    className={`transition-all duration-150 absolute -top-5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs pointer-events-none z-20 ${
                      isHovered
                        ? 'opacity-100 -translate-y-0.5 bg-slate-950 text-white'
                        : 'opacity-0 bg-slate-950 text-white'
                    }`}
                  >
                    {bar.value}%
                  </span>

                  {/* Animated colored bar */}
                  <div
                    className={`w-full max-w-[24px] rounded-t-lg bg-gradient-to-t transition-all duration-300 ${bar.color} ${
                      isHovered ? 'scale-105 shadow-sm' : 'opacity-90'
                    }`}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis competency labels */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-0.5 pt-2 border-t border-slate-200/60">
          {chartBars.map((bar, idx) => (
            <span
              key={idx}
              className={`text-center flex-1 transition-colors ${
                bar.isKey ? 'font-extrabold text-slate-900' : 'font-medium text-slate-600'
              }`}
            >
              {bar.label}
            </span>
          ))}
        </div>
      </div>

      {/* Status Sertifikasi Section */}
      <div className="space-y-3 pt-0.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Status Sertifikasi
          </h3>
          <Link
            href="/student/certificates"
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
          >
            Lihat Sertifikat
          </Link>
        </div>

        {/* CEFR & STCW Competency Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs shadow-2xs">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900 leading-tight">Standar STCW 2010</p>
                <p className="text-[10px] text-slate-500">Perwira & Rating Kapal</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              Passing 70%
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            <span className="text-slate-500 text-[11px] font-medium">Jenjang Kemahiran:</span>
            <span className="font-extrabold text-blue-600">Level {levelCode} Operational</span>
          </div>
        </div>

        {/* Action Links */}
        <div className="space-y-2 pt-0.5">
          <Link
            href="/student/level"
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200/90 hover:bg-blue-50/50 hover:border-blue-300 transition-all text-xs font-bold text-slate-900 shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span className="group-hover:text-blue-600 transition-colors">Matriks Jenjang CEFR Maritim</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/student/articles"
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-950 hover:bg-black transition-all shadow-xs hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Buka Modul Materi IMO SMCP</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
