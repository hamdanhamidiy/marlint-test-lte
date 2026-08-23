'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  User,
  FileCheck2,
} from 'lucide-react';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import Logo from '@/components/brand/Logo';
import { supabase } from '@/lib/supabase/client';
import { formatDateIndo } from '@/lib/utils';

export default function CertificateVerificationPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      setResult(null);

      const { data, error } = await supabase.rpc('verify_certificate', {
        p_verification_code: code.trim().toUpperCase(),
      });

      if (data && data.is_valid) {
        setResult(data);
      } else {
        setResult({ is_valid: false });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setResult({ is_valid: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-[#5046E5] selection:text-white">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Public Certificate Verification Portal</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Verifikasi Keaslian Sertifikat Marlins
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Layanan pemeriksaan sertifikat resmi untuk perusahaan pelayaran, manning agencies, dan otoritas maritim pelabuhan internasional.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
          <form onSubmit={handleVerify} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Masukkan Kode Verifikasi Sertifikat:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: 1A2B3C4D..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-full bg-slate-50 border border-slate-200 font-mono font-bold text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] uppercase tracking-wider"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="px-8 py-3.5 rounded-full font-bold text-xs text-white bg-[#5046E5] hover:bg-[#4338CA] shadow-md shadow-indigo-500/20 transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi Sekarang'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Kode verifikasi tercantum di pojok bawah lembar sertifikat resmi Marlins.
            </p>
          </form>
        </div>

        {/* Result Display */}
        {searched && !loading && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {result?.is_valid ? (
              <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-emerald-200 shadow-xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-2xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">
                      Sertifikat Asli & Terverifikasi
                    </span>
                    <h3 className="font-heading text-lg font-extrabold text-slate-900">
                      Terdaftar Resmi di Database Marlins
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-semibold block">Nama Pelaut:</span>
                    <p className="font-heading font-extrabold text-slate-900 text-sm">{result.student_name}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-semibold block">Paket Ujian:</span>
                    <p className="font-heading font-extrabold text-slate-900 text-sm">
                      {result.test_name} (Test #{result.test_number})
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-semibold block">Skor & Level CEFR:</span>
                    <p className="font-mono font-bold text-[#5046E5] text-base">
                      {result.score}% • Level {result.level} (Grade {result.grade})
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-semibold block">Nomor Sertifikat:</span>
                    <p className="font-mono font-bold text-slate-900">{result.certificate_number}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white border border-rose-200 rounded-[32px] max-w-lg mx-auto space-y-3 shadow-xl">
                <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Sertifikat Tidak Ditemukan
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Kode verifikasi "{code.toUpperCase()}" tidak terdaftar di sistem kami atau telah dinyatakan tidak berlaku.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 font-medium">
          Marlins Maritime English Verification System • Standar IMO STCW
        </div>
      </footer>
    </div>
  );
}
