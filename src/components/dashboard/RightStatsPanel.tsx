'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

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

  const levelCode = profile?.level_code || 'A1';

  // Competency score bars for maritime English skills
  const chartBars = [
    { label: 'Grammar', value: 75, color: 'from-slate-700 to-slate-900' },
    { label: 'Listen', value: 85, color: 'from-blue-600 to-blue-800', isKey: true },
    { label: 'Vocab', value: 65, color: 'from-slate-700 to-slate-900' },
    { label: 'SMCP', value: 90, color: 'from-emerald-500 to-emerald-700', isKey: true },
    { label: 'Read', value: 70, color: 'from-slate-700 to-slate-900' },
  ];

  return (
    <aside className="w-full lg:w-72 xl:w-80 space-y-4 select-none shrink-0 font-sans">
      {/* Skill Bar Chart Widget */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-extrabold text-slate-950 tracking-tight">Kompetensi Maritim</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
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
                    className={`w-full max-w-[22px] rounded-t-md bg-gradient-to-t transition-all duration-300 ${bar.color} ${
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
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-0.5 pt-2 border-t border-slate-100">
          {chartBars.map((bar, idx) => (
            <span
              key={idx}
              className={`text-center flex-1 transition-colors ${
                bar.isKey ? 'font-extrabold text-slate-900' : 'font-medium text-slate-500'
              }`}
            >
              {bar.label}
            </span>
          ))}
        </div>
      </div>

      {/* Status Sertifikasi STCW 2010 */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">
            Status Sertifikasi
          </h3>
          <Link
            href="/student/certificates"
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
          >
            Sertifikat Saya ➔
          </Link>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Standar STCW 2010</p>
                <p className="text-[10px] text-slate-500">Perwira & Rating Kapal</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Passing 70%
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            <span className="text-slate-500 text-[11px]">Jenjang Kemahiran:</span>
            <span className="font-extrabold text-blue-600">Level {levelCode} Operational</span>
          </div>
        </div>

        <Link
          href="/student/level"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200/90 hover:bg-blue-50/50 hover:border-blue-300 transition-all text-xs font-bold text-slate-800 shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="group-hover:text-blue-600 transition-colors">Matriks Jenjang CEFR Maritim</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </aside>
  );
}
