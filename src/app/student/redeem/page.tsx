'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export default function RedeemTokenPage() {
  const { redeemToken } = useAuth();
  const [tokenCode, setTokenCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenCode.trim()) return;

    try {
      setLoading(true);
      setStatus({ type: 'idle' });

      const res = await redeemToken(tokenCode.trim());
      if (res.success) {
        setStatus({
          type: 'success',
          message: 'Token akses berhasil diaktivasi! Paket ujian Anda kini telah terbuka.',
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

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-2xs mb-3 border border-amber-200">
          <KeyRound className="w-7 h-7" />
        </div>
        <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900">
          Aktivasi Token Akses Ujian
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Masukkan kode voucher atau token akses yang Anda peroleh dari instansi / manning agency untuk membuka paket ujian Marlins.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-slate-100 shadow-2xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Kode Token Akses:
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-amber-600 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Contoh: MLT-A1B2C3D4E5F6"
                value={tokenCode}
                onChange={(e) => setTokenCode(e.target.value.toUpperCase())}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-slate-50 border border-slate-200 font-mono font-black text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 uppercase tracking-wider transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Format kode diawali dengan <strong className="text-amber-800 font-bold">MLT-</strong> diikuti karakter alfanumerik.
            </p>
          </div>

          {/* Status feedback */}
          {status.type === 'success' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === 'error' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !tokenCode.trim()}
            className="w-full py-3.5 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Memverifikasi Token...' : 'Klaim & Aktifkan Ujian'}</span>
          </button>
        </form>

        {status.type === 'success' && (
          <div className="pt-2 text-center">
            <Link
              href="/student/tests"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5046E5] text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:bg-[#4338CA] transition-all"
            >
              <span>Buka Katalog Ujian Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      <div className="p-5 rounded-[24px] bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2 font-medium">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#5046E5]" />
          <span>Informasi Aktivasi Token:</span>
        </p>
        <p className="text-slate-500 leading-relaxed">
          Token akses berlaku sesuai dengan jumlah maksimum tes dan batas masa aktif yang telah dikonfigurasi oleh administrator. Satu akun dapat mengaktifkan beberapa voucher resmi.
        </p>
      </div>
    </div>
  );
}
