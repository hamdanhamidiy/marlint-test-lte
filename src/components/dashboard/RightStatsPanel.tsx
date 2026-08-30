'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import StatusDetailModal from './StatusDetailModal';

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
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const levelCode = (profile?.level_code || 'A1').toUpperCase();
  const isPassedSTCW = scoreAverage >= 70;

  // Competency score bars for maritime English skills
  const chartBars = [
    { label: 'Grammar', value: 75, color: 'from-slate-700 to-slate-900', keyCategory: false },
    { label: 'Listen', value: 85, color: 'from-[#0284C7] to-[#0369A1]', keyCategory: true },
    { label: 'Vocab', value: 65, color: 'from-slate-700 to-slate-900', keyCategory: false },
    { label: 'SMCP', value: 90, color: 'from-emerald-500 to-teal-700', keyCategory: true },
    { label: 'Read', value: 70, color: 'from-slate-700 to-slate-900', keyCategory: false },
  ];

  return (
    <>
      <aside className="w-full lg:w-72 xl:w-80 space-y-4 select-none shrink-0 font-sans">
        
        {/* Widget 1: Status Sertifikasi & Kualifikasi Pelaut (Modern Executive Card) */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-slate-200/90 space-y-3.5 shadow-2xs hover-lift relative overflow-hidden">
          {/* Subtle Ambient Accent Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C]" />

          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
              <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">
                Status Sertifikasi
              </h3>
            </div>
            
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(true)}
              className="text-[11px] font-bold text-[#0284C7] hover:text-[#0369A1] inline-flex items-center gap-0.5 cursor-pointer transition-colors"
              title="Lihat Rincian Status"
            >
              <span>Detail</span>
              <Info className="w-3 h-3" />
            </button>
          </div>

          {/* Live Status Badge Container */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
            
            {/* Live Indicator Strip */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Terverifikasi & Aktif</span>
              </div>
              
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                STCW 2010
              </span>
            </div>

            {/* Standard & Threshold Details */}
            <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium text-[11px]">Standar Kelulusan:</span>
                <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                  isPassedSTCW
                    ? 'bg-emerald-100/80 text-emerald-800'
                    : 'bg-amber-100/80 text-amber-800'
                }`}>
                  Passing 70%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium text-[11px]">Jenjang Kemahiran:</span>
                <span className="font-extrabold text-[#0284C7] text-xs">
                  Level {levelCode} Operational
                </span>
              </div>
            </div>

            {/* Progress status meter */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Rata-Rata Asesmen</span>
                <span className="font-bold text-slate-900">{scoreAverage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPassedSTCW ? 'bg-gradient-to-r from-emerald-500 to-[#0284C7]' : 'bg-gradient-to-r from-amber-500 to-[#0284C7]'
                  }`}
                  style={{ width: `${Math.min(scoreAverage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2 pt-0.5">
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Rincian Status Pelaut</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <Link
              href="/student/level"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200/90 hover:bg-sky-50/50 hover:border-sky-300 transition-all text-xs font-bold text-slate-700 hover:text-[#0284C7] shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#0284C7]" />
                <span className="group-hover:text-[#0284C7] transition-colors">Matriks Jenjang CEFR</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>

        {/* Widget 2: Maritime Competency Chart Widget (Clean & Modern Bar Chart) */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-slate-200/90 space-y-3 shadow-2xs hover-lift">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#0284C7]" />
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
                      className={`transition-all duration-150 absolute -top-6 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shadow-md pointer-events-none z-20 ${
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
                  bar.keyCategory ? 'font-extrabold text-slate-900' : 'font-medium text-slate-500'
                }`}
              >
                {bar.label}
              </span>
            ))}
          </div>
        </div>

      </aside>

      {/* Status Detail Modal */}
      <StatusDetailModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        scoreAverage={scoreAverage}
        totalTestsCompleted={totalTestsCompleted}
      />
    </>
  );
}
