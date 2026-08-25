'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Layers,
  Award,
  Unlock,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

function RedeemContent() {
  const searchParams = useSearchParams();
  const { redeemToken, user } = useAuth();

  const [tokenCode, setTokenCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const executeRedeem = async (codeToRedeem: string) => {
    if (!codeToRedeem.trim()) return;

    try {
      setLoading(true);
      setStatus({ type: 'idle' });

      const res = await redeemToken(codeToRedeem.trim());
      if (res.success) {
        setStatus({
          type: 'success',
          message: res.message || 'Token akses berhasil diaktivasi! Seluruh paket ujian telah terbuka.',
        });
        setTokenCode('');
      } else {
        setStatus({
          type: 'error',
          message: res.message || 'Token tidak valid, kedaluwarsa, atau sudah mencapai batas penggunaan.',
        });
      }
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Terjadi kesalahan sistem.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill from URL query param
  useEffect(() => {
    const qToken = searchParams.get('token') || searchParams.get('code');
    if (qToken) {
      setTokenCode(qToken);
      executeRedeem(qToken);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeRedeem(tokenCode);
  };

  const handleFillSample = (sample: string) => {
    setTokenCode(sample);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 border border-amber-200 shadow-2xs">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
          Aktivasi Token Akses Ujian
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Masukkan kode voucher atau token lisensi resmi dari perusahaan pelayaran atau akademi maritim Anda untuk membuka paket ujian Marlins.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Kode Token Akses:
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-amber-600 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Contoh: MLT-SAMPLE-FULL-ACCESS"
                value={tokenCode}
                onChange={(e) => setTokenCode(e.target.value.toUpperCase())}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 uppercase tracking-wider"
              />
            </div>
            <p className="text-xs text-slate-400">
              Format kode diawali dengan prefix <strong className="text-amber-800 font-bold">MLT-</strong> diikuti karakter alfanumerik.
            </p>
          </div>

          {/* Status feedback */}
          {status.type === 'success' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2 font-medium animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>Aktivasi Berhasil!</span>
              </div>
              <p className="text-emerald-700 pl-7 leading-relaxed">{status.message}</p>
            </div>
          )}

          {status.type === 'error' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2.5 font-medium animate-in fade-in zoom-in-95 duration-150">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !tokenCode.trim()}
            className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Token...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Klaim & Aktifkan Paket Ujian</span>
              </>
            )}
          </button>
        </form>

        {/* Action Button after Success */}
        {status.type === 'success' && (
          <div className="pt-2 text-center">
            <Link
              href="/student/tests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5046E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Unlock className="w-4 h-4" />
              <span>Buka Katalog Ujian Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Preset Sample Voucher Codes */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider block">
            Voucher Sampel Pengujian (Klik untuk Pasang):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillSample('MLT-SAMPLE-FULL-ACCESS')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors text-left cursor-pointer space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-xs">MLT-SAMPLE-FULL-ACCESS</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">All 10 Tests</span>
              </div>
              <p className="text-[11px] text-slate-500">Voucher Akses Penuh Seluruh 10 Paket Ujian</p>
            </button>

            <button
              type="button"
              onClick={() => handleFillSample('MLT-MARITIME-2026')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors text-left cursor-pointer space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-xs">MLT-MARITIME-2026</span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Akademi</span>
              </div>
              <p className="text-[11px] text-slate-500">Lisensi Ujian Taruna Angkatan 2026</p>
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Ketentuan Hak Akses Voucher:</span>
        </p>
        <p className="text-slate-500 leading-relaxed">
          Setiap token akses yang berhasil diaktivasi akan membuka hak pengerjaan ujian secara permanen pada akun pelaut Anda. Sesi ujian dapat diulang dan hasil kelulusan akan diterbitkan dalam sertifikat resmi.
        </p>
      </div>
    </div>
  );
}

export default function RedeemTokenPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RedeemContent />
    </Suspense>
  );
}
