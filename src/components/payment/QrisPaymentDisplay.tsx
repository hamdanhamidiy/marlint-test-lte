'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  DEFAULT_STATIC_QRIS,
  convertStaticToDynamicQris,
  parseQrisMerchantInfo,
} from '@/lib/qrisHelper';
import { formatPriceIDR } from '@/lib/utils';

interface QrisPaymentDisplayProps {
  amount: number;
  testName: string;
  invoiceId: string;
  onPaymentSuccess: () => void;
  processing?: boolean;
}

export default function QrisPaymentDisplay({
  amount,
  testName,
  invoiceId,
  onPaymentSuccess,
  processing = false,
}: QrisPaymentDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic payload string with automatic amount
  const [currentPayload, setCurrentPayload] = useState<string>('');

  // Countdown timer (15 minutes)
  const [timeLeft, setTimeLeft] = useState(900);

  // Compute QRIS payload and render canvas
  useEffect(() => {
    const payload = convertStaticToDynamicQris(DEFAULT_STATIC_QRIS, amount);
    setCurrentPayload(payload);

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        payload,
        {
          width: 280,
          margin: 1.5,
          color: {
            dark: '#0B192C',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (error) console.error('Error generating QRIS canvas:', error);
        }
      );
    }
  }, [amount]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadQr = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `QRIS-Marlins-${merchantInfo.merchantName.replace(/[^a-zA-Z0-9]/g, '_')}-${invoiceId}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const merchantInfo = parseQrisMerchantInfo(DEFAULT_STATIC_QRIS);

  return (
    <div className="space-y-4 font-sans select-none">
      
      {/* Main QRIS Card */}
      <div className="bg-white rounded-[26px] border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Top QRIS Header Band */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-5 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-white px-2 py-0.5 rounded-md flex items-center shadow-xs">
              <span className="font-heading font-black text-red-600 text-sm tracking-tight">QRIS</span>
            </div>
            <div>
              <span className="text-xs font-extrabold text-white block leading-tight">
                QRIS DINAMIS
              </span>
              <span className="text-[10px] text-white/80 font-medium">
                Bank Indonesia & ASPI
              </span>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold backdrop-blur-xs">
            <Clock className="w-3.5 h-3.5 text-rose-100" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 text-center space-y-4">
          
          {/* Official Merchant Information */}
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold tracking-wider uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Merchant Terverifikasi</span>
            </div>
            <h3 className="font-heading text-base sm:text-lg font-black text-slate-900 leading-snug">
              {merchantInfo.merchantName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              NMID: <strong className="font-mono text-slate-700">{merchantInfo.nmid}</strong> • {merchantInfo.merchantCity}
            </p>
          </div>

          {/* Total Tagihan Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 max-w-sm mx-auto space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                Total Tagihan
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                {testName}
              </span>
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
              {formatPriceIDR(amount)}
            </p>
            <div className="text-[11px] text-emerald-800 flex items-center justify-center gap-1 pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Nominal langsung muncul otomatis saat di-scan</span>
            </div>
          </div>

          {/* QR Code Canvas Box */}
          <div className="relative inline-block mx-auto p-3.5 bg-white border-2 border-dashed border-slate-300 rounded-3xl shadow-xs">
            <canvas ref={canvasRef} className="rounded-2xl max-w-full h-auto" />
            
            {/* Center Marlins Brand Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-9 h-9 rounded-xl bg-white border-2 border-red-500 shadow-md flex items-center justify-center font-heading font-black text-xs text-[#0284C7] p-0.5">
                MLT
              </div>
            </div>
          </div>

          {/* Supported Banking Apps Strip */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500 max-w-md mx-auto">
            <span className="px-2 py-0.5 rounded-md bg-slate-100">DANA</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">GoPay</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">BCA Mobile</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">Livin Mandiri</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">BRImo</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">BNI Mobile</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">OVO</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">ShopeePay</span>
          </div>

          {/* Single Action Button: Simpan Gambar QR */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Simpan Gambar QR</span>
            </button>
          </div>

          {/* Primary Confirmation Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onPaymentSuccess}
              disabled={processing}
              className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-emerald-600/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Pembayaran...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Saya Sudah Bayar / Konfirmasi Pembayaran</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
