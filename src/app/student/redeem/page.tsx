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
  Unlock,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications } from '@/lib/context/NotificationContext';

function RedeemContent() {
  const searchParams = useSearchParams();
  const { redeemToken, user } = useAuth();
  const { addNotification } = useNotifications();

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
          message: res.message || 'Token akses berhasil diaktivasi! Paket ujian Anda telah terbuka.',
        });

        // Trigger Notification
        addNotification({
          user_id: user?.id || 'current_user',
          type: 'token_redeemed',
          category: 'token',
          title: `Token Lisensi ${codeToRedeem.trim().toUpperCase()} Berhasil Diaktivasi`,
          body: res.message || 'Paket ujian resmi Anda telah dibuka dan dapat diakses kapan saja.',
          action_url: '/student/tests',
          action_label: 'Buka Paket Ujian',
        });

        setTokenCode('');
      } else {
        setStatus({
          type: 'error',
          message: res.message || 'Kode token tidak valid, kedaluwarsa, atau sudah digunakan.',
        });
      }
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Terjadi kesalahan sistem saat memproses token.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill from URL query param if present
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

  const sampleTokens = [
    { code: 'MLT-SAMPLE-FULL-ACCESS', label: '10 Paket Ujian Penuh' },
    { code: 'MLT-MARITIME-2026', label: 'Lisensi Siswa 2026' },
  ];

  return (
    <div className="max-w-[490px] mx-auto space-y-6 font-sans py-4 sm:py-8">
      {/* Main Clean Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6 relative overflow-hidden text-center">
        
        {/* Subtle Top Ambient Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] opacity-90" />

        {/* Icon & Title */}
        <div className="space-y-2 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0284C7] border border-sky-200/70 flex items-center justify-center mx-auto shadow-2xs">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Aktivasi Token Ujian
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed">
            Masukkan kode lisensi atau voucher untuk membuka akses paket ujian Marlins.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 text-center uppercase tracking-wider">
              Kode Token Lisensi
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="CONTOH: MLT-XXXX-XXXX"
                value={tokenCode}
                onChange={(e) => setTokenCode(e.target.value.toUpperCase())}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 font-mono font-bold text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20 uppercase tracking-widest text-center transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Preset Sample Voucher Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Kode Voucher Tersedia
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {sampleTokens.map((st) => (
                <button
                  key={st.code}
                  type="button"
                  onClick={() => setTokenCode(st.code)}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200/80 text-[11px] font-mono font-bold text-[#0284C7] transition-all cursor-pointer inline-flex items-center gap-1"
                  title={`Klik untuk mengisi ${st.label}`}
                >
                  <span>{st.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Feedback Alerts */}
          {status.type === 'success' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2 font-medium animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-600" />
                <span>Aktivasi Berhasil!</span>
              </div>
              <p className="text-emerald-700 leading-relaxed">{status.message}</p>
              <div className="pt-1">
                <Link
                  href="/student/tests"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Buka Halaman Ujian Sekarang &rarr;</span>
                </Link>
              </div>
            </div>
          )}

          {status.type === 'error' && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2.5 font-medium animate-in fade-in zoom-in-95 duration-150">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-600" />
              <span>{status.message}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !tokenCode.trim()}
            className="w-full py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-sky-500/20 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Token...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Klaim & Aktifkan Paket</span>
              </>
            )}
          </button>
        </form>

        {/* Subtle Security Badge Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Akses ujian otomatis aktif permanen setelah aktivasi</span>
        </div>
      </div>
    </div>
  );
}

export default function RedeemTokenPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RedeemContent />
    </Suspense>
  );
}
