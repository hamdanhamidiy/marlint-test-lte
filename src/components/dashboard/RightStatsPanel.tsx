'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MoreVertical,
  UserPlus,
  Check,
  Award,
  BookOpen,
  Anchor,
  TrendingUp,
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
  const [followedMentors, setFollowedMentors] = useState<Set<string>>(new Set());

  const toggleFollow = (name: string) => {
    setFollowedMentors((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const displayName = profile?.full_name || 'Capt. Budi Santoso';
  const levelInfo = getLevelBadge(profile?.level_code || 'A1');
  const currentPoints = profile?.total_points || 480;

  const maritimeMentors = [
    {
      id: 'm1',
      name: 'Capt. Padhang Satrio, M.Mar',
      role: 'Master Mariner • Lead Examiner',
      avatar: '👨‍✈️',
      bgColor: 'bg-amber-100',
    },
    {
      id: 'm2',
      name: 'Zakir Horizontal, C/E',
      role: 'Chief Engineer • Marine Tech',
      avatar: '👨‍🔧',
      bgColor: 'bg-rose-100',
    },
    {
      id: 'm3',
      name: 'Leonardo Samsul, M.Pd',
      role: 'Maritime English Specialist',
      avatar: '🧔',
      bgColor: 'bg-indigo-100',
    },
  ];

  // Competency score bars
  const chartBars = [
    { height: 65, label: 'Grammar' },
    { height: 80, label: 'Listen' },
    { height: 50, label: 'Vocab' },
    { height: 90, isHighlight: true, label: 'SMCP' },
    { height: 70, label: 'Read' },
  ];

  return (
    <aside className="w-full lg:w-80 bg-white rounded-3xl p-6 border border-slate-200/80 space-y-6 select-none shrink-0 shadow-2xs">
      {/* User Profile Card Summary */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-100 to-indigo-100 p-0.5 shadow-xs flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-xl overflow-hidden">
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
            <h3 className="font-heading text-sm font-bold text-slate-900 truncate">
              {displayName}
            </h3>
            <span className="text-amber-500 text-xs">⚓</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
            Level {profile?.level_code || 'B1+'} • {currentPoints} XP
          </p>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] text-[10px] font-bold border border-indigo-100 shrink-0">
          {profile?.level_code || 'B1+'}
        </span>
      </div>

      {/* Bar Chart Widget (Kompetensi Bahasa Inggris Maritim) */}
      <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-200/70 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-700 tracking-tight">Kompetensi Maritim</span>
          <span className="text-xs text-[#4F46E5] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/80">
            {scoreAverage}% Rata-rata
          </span>
        </div>

        <div className="relative h-24 flex items-end justify-between px-2 pt-2">
          {/* Vertical rounded bars */}
          <div className="w-full flex items-end justify-around h-full z-10">
            {chartBars.map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end" title={`${bar.label}: ${bar.height}%`}>
                <div
                  className={`w-6 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                    bar.isHighlight
                      ? 'bg-gradient-to-t from-[#4F46E5] to-[#6366F1] shadow-xs'
                      : 'bg-[#D6DCFA] hover:bg-[#C2CBF8]'
                  }`}
                  style={{ height: `${bar.height}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* X-axis competency labels */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-1 pt-1 border-t border-slate-200/60">
          <span>Grammar</span>
          <span>Listen</span>
          <span>Vocab</span>
          <span className="font-bold text-[#4F46E5]">SMCP</span>
          <span>Read</span>
        </div>
      </div>

      {/* Maritime Examiners & Mentors Section */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">
            Instruktur Maritim
          </h3>
          <Link
            href="/student/articles"
            className="text-[11px] font-semibold text-[#4F46E5] hover:text-[#4338CA]"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="space-y-2.5">
          {maritimeMentors.map((mentor) => {
            const isFollowed = followedMentors.has(mentor.name);
            return (
              <div
                key={mentor.id}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div
                    className={`w-8 h-8 rounded-full ${mentor.bgColor} flex items-center justify-center text-sm shadow-xs shrink-0 relative`}
                  >
                    {mentor.avatar}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate leading-snug">
                      {mentor.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{mentor.role}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFollow(mentor.name)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                    isFollowed
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shadow-2xs'
                  }`}
                >
                  {isFollowed ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Mengikuti</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Ikuti</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* See All Materials Button */}
        <Link
          href="/student/articles"
          className="w-full flex items-center justify-center py-2.5 rounded-full text-xs font-bold text-[#4F46E5] bg-[#EEF0FF] hover:bg-[#E0E7FF] transition-colors shadow-2xs"
        >
          <span>Buka Semua Materi IMO SMCP</span>
        </Link>
      </div>
    </aside>
  );
}
