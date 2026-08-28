'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  FileCheck2,
  ExternalLink,
  Anchor,
  Sparkles,
  ArrowRight,
  UserCheck,
  Compass,
  Check,
  BookOpen,
  Headphones,
  FileText,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';

interface StatusDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreAverage?: number;
  totalTestsCompleted?: number;
  unlockedCount?: number;
  hasCertificate?: boolean;
}

export default function StatusDetailModal({
  isOpen,
  onClose,
  scoreAverage: propScoreAverage,
  totalTestsCompleted: propTotalTests,
  unlockedCount: propUnlockedCount,
  hasCertificate: propHasCert,
}: StatusDetailModalProps) {
  const { user, profile } = useAuth();
  const activeUserId = user?.id || profile?.id;

  // Real fetched stats
  const [dbScoreAvg, setDbScoreAvg] = useState<number | null>(null);
  const [dbTotalTests, setDbTotalTests] = useState<number | null>(null);
  const [dbUnlockedCount, setDbUnlockedCount] = useState<number | null>(null);
  const [dbHasCert, setDbHasCert] = useState<boolean | null>(null);
  const [highestScore, setHighestScore] = useState<number>(0);
  const [isPassedSTCWReal, setIsPassedSTCWReal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !activeUserId) return;

    async function fetchRealStats() {
      try {
        setLoading(true);

        // 1. Fetch Real Test Results
        const { data: results } = await supabase
          .from('student_results')
          .select('score, is_passed')
          .eq('student_id', activeUserId);

        let localResults: any[] = [];
        try {
          const raw = localStorage.getItem(`marlins_test_results_${activeUserId}`);
          if (raw) localResults = JSON.parse(raw);
        } catch {}

        const allResults = [...(results || []), ...localResults];
        if (allResults.length > 0) {
          const validScores = allResults.map((r) => r.score || 0);
          const avg = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
          const max = Math.max(...validScores);
          const passed = allResults.some((r) => r.is_passed === true || (r.score && r.score >= 70));

          setDbScoreAvg(avg);
          setDbTotalTests(allResults.length);
          setHighestScore(max);
          setIsPassedSTCWReal(passed);
        } else {
          setDbScoreAvg(0);
          setDbTotalTests(0);
          setHighestScore(0);
          setIsPassedSTCWReal(false);
        }

        // 2. Fetch Real Certificates
        const { data: certs } = await supabase
          .from('certificates')
          .select('id')
          .eq('user_id', activeUserId)
          .eq('is_valid', true);

        setDbHasCert(certs && certs.length > 0);

        // 3. Fetch Real Entitlements
        const { data: ents } = await supabase
          .from('test_entitlements')
          .select('test_number')
          .eq('user_id', activeUserId)
          .eq('is_active', true);

        let localEnts: number[] = [];
        try {
          const rawEnt = localStorage.getItem(`marlins_entitlements_${activeUserId}`);
          if (rawEnt) localEnts = JSON.parse(rawEnt);
        } catch {}

        const allUnlocked = new Set([1, ...(ents || []).map((e) => e.test_number), ...localEnts]);
        setDbUnlockedCount(allUnlocked.size);
      } catch (err) {
        console.warn('Error fetching status modal live data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRealStats();
  }, [isOpen, activeUserId]);

  if (!isOpen) return null;

  const displayName = profile?.full_name || 'Pelaut Indonesia';
  const levelCode = (profile?.level_code || 'A1').toUpperCase();
  const totalPoints = profile?.total_points || 320;

  // Resolve actual metric values
  const scoreAverage = propScoreAverage !== undefined ? propScoreAverage : (dbScoreAvg !== null ? dbScoreAvg : 10);
  const totalTestsCompleted = propTotalTests !== undefined ? propTotalTests : (dbTotalTests !== null ? dbTotalTests : 2);
  const unlockedCount = propUnlockedCount !== undefined ? propUnlockedCount : (dbUnlockedCount !== null ? dbUnlockedCount : 2);
  const hasCertificate = propHasCert !== undefined ? propHasCert : (dbHasCert !== null ? dbHasCert : false);
  const isPassedSTCW = scoreAverage >= 70 || isPassedSTCWReal;

  // Level roadmap targets
  const levelData: Record<string, { title: string; next: string; nextScore: number; rank: string; minScore: number; desc: string }> = {
    A1: { title: 'Beginner (Trainee)', next: 'A2', nextScore: 45, rank: 'Hotel Trainee / Ordinary Seaman', minScore: 0, desc: 'Pemahaman kosakata dasar instruksi darurat dan percakapan rutin kapal.' },
    A2: { title: 'Elementary (Ordinary Seaman)', next: 'B1', nextScore: 55, rank: 'Able Seafarer / Wiper / Galley Steward', minScore: 45, desc: 'Mampu merespons komunikasi radio standar dan prosedur keselamatan dasar.' },
    B1: { title: 'Intermediate (Able Seafarer)', next: 'B1+', nextScore: 65, rank: 'Senior Rating / Assistant Officer', minScore: 55, desc: 'Komunikasi operasional lancar untuk pekerjaan di dek, mesin, atau hotel departemen.' },
    'B1+': { title: 'Competent (Officer of the Watch)', next: 'B2', nextScore: 75, rank: 'Officer of the Watch (OOW / ANT-III / ATT-III)', minScore: 65, desc: 'Kompeten menggunakan SMCP dan navigasi VHF standar internasional IMO.' },
    B2: { title: 'Upper Intermediate (Chief Officer)', next: 'C1', nextScore: 85, rank: 'Chief Officer / 2nd Engineer (ANT-II / ATT-II)', minScore: 75, desc: 'Kepemimpinan tim dan penanganan situasi krisis maritim tingkat mahir.' },
    C1: { title: 'Advanced (Master Mariner)', next: 'C2', nextScore: 90, rank: 'Master Mariner / Chief Engineer (ANT-I / ATT-I)', minScore: 85, desc: 'Kemahiran penuh dalam negosiasi port authority, audit PSC, dan manajemen kapal.' },
    C2: { title: 'Mastery (Executive Maritime)', next: 'MAX', nextScore: 100, rank: 'Senior Marine Superintendent / Fleet Director', minScore: 90, desc: 'Penguasaan tingkat eksekutif standar internasional.' },
  };

  const currentLevelInfo = levelData[levelCode] || levelData['A1'];
  const progressPercent = Math.min(Math.max(Math.round((totalPoints / 800) * 100), 20), 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl border border-slate-200/90 overflow-hidden z-10 my-auto text-left animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="relative bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] p-5 sm:p-6 text-white overflow-hidden">
          {/* Background Watermark Anchor */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-15 hidden sm:block">
            <Anchor className="w-40 h-40 text-white stroke-1" />
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-cyan-200 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Standar STCW 2010 & IMO Model Course 3.17</span>
              </div>
              <h2 className="font-heading text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                Status Kualifikasi & Sertifikasi Pelaut
              </h2>
              <p className="text-xs text-cyan-100/90 leading-relaxed font-normal max-w-md">
                Ringkasan komprehensif kepatuhan standar maritim internasional, penjenjangan CEFR, dan validitas akun Anda.
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 border border-white/20 active:scale-95 shadow-xs"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[calc(85vh-160px)] overflow-y-auto">
          
          {/* Row 1: Profile & Verified Status Bar */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] via-[#0369A1] to-amber-500 p-0.5 shadow-xs shrink-0">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                  {profile?.photo_url ? (
                    <img src={profile.photo_url} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">👨‍✈️</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                    {displayName}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Terverifikasi</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {profile?.job_title || 'Hospitality & Cruise Seafarer'} • {profile?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/70">
              <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-200/80 shadow-2xs">
                Level {levelCode} ({totalPoints} XP)
              </span>
            </div>
          </div>

          {/* Row 2: Status Grid (STCW Compliance + CEFR Ladder) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Box 1: Status Kepatuhan STCW */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    STANDAR STCW 2010
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold inline-flex items-center gap-1 ${
                    isPassedSTCW
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {isPassedSTCW ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-amber-600" />}
                    <span>{isPassedSTCW ? 'STCW Compliant' : 'Evaluasi Berjalan'}</span>
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                  Passing Grade Kelulusan
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Ambang batas minimal evaluasi resmi perwira & rating kapal pesiar adalah <strong className="text-slate-800 font-bold">70%</strong>.
                </p>
              </div>

              {/* Score Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Rata-rata Skor Anda</span>
                  <span className="font-black text-slate-900">{scoreAverage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isPassedSTCW
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-amber-500 to-[#0284C7]'
                    }`}
                    style={{ width: `${Math.min(scoreAverage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>0%</span>
                  <span className="text-emerald-700 font-bold">Standar Lulus: 70%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Box 2: Jenjang CEFR & Progresi */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    JENJANG CEFR MARITIM
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] border border-sky-200/80 text-[10px] font-extrabold">
                    {levelCode} • {currentLevelInfo.title.split(' ')[0]}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {currentLevelInfo.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Kualifikasi jabatan: <span className="text-slate-800 font-semibold">{currentLevelInfo.rank}</span>.
                </p>
              </div>

              {/* Level progression meter */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Menuju Level {currentLevelInfo.next}</span>
                  <span className="font-bold text-[#0284C7]">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0284C7] to-[#0369A1] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Level {levelCode}</span>
                  <span className="text-[#0284C7] font-semibold">{totalPoints} / 800 XP</span>
                  <span>Level {currentLevelInfo.next}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: Status Lisensi & Sertifikat Realtime Strip */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Status Hak Akses & Kelulusan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Item 1: Lisensi Ujian */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                  <KeyRound className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Lisensi Paket</span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs">
                  {unlockedCount} dari 10 Terbuka
                </p>
                <span className="text-[10px] text-emerald-700 font-medium block">
                  Akses Aktif Permanen
                </span>
              </div>

              {/* Item 2: Evaluasi Selesai */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Riwayat Ujian</span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs">
                  {totalTestsCompleted} Sesi Selesai
                </p>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Terekam di Database
                </span>
              </div>

              {/* Item 3: e-Sertifikat */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>e-Sertifikat QR</span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs">
                  {hasCertificate ? 'Tersedia & Valid' : (isPassedSTCW ? 'Siap Diterbitkan' : 'Belum Diterbitkan')}
                </p>
                <span className={`text-[10px] font-medium block ${hasCertificate ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {hasCertificate ? 'Verifikasi Online Aktif' : 'Syarat: Skor ≥ 70%'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 4: Marlins 5 Maritime Competency Pillars Note */}
          <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-3 text-xs text-slate-600">
            <Compass className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900">
                Pilar Evaluasi Marlins Test Resmi:
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Mencakup 5 domain: Tata Bahasa Maritim (Grammar), Kosakata Perhotelan/Dek/Mesin (Vocabulary), Waktu & Angka SMCP, Pemahaman Prosedur (Reading), serta Komunikasi VHF Radio (Listening).
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href="/student/level"
            onClick={onClose}
            className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] inline-flex items-center gap-1.5 hover:underline"
          >
            <span>Buka Matriks CEFR Lengkap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              href="/student/certificates"
              onClick={onClose}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Sertifikat Saya</span>
            </Link>

            <Link
              href="/student/tests"
              onClick={onClose}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 cursor-pointer active:scale-95"
            >
              <span>Uji Kompetensi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

