'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  ShieldCheck,
  Clock,
  Download,
  Copy,
  Check,
  Sparkles,
  Settings2,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Smartphone,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  convertStaticToDynamicQris,
  parseQrisMerchantInfo,
  DEFAULT_STATIC_QRIS,
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

  // Custom QRIS string saved by the owner
  const [staticQrisInput, setStaticQrisInput] = useState<string>('');
  const [activeStaticQris, setActiveStaticQris] = useState<string>(DEFAULT_STATIC_QRIS);
  const [showConfig, setShowConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  // Dynamic payload
  const [dynamicPayload, setDynamicPayload] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Countdown timer (15 minutes)
  const [timeLeft, setTimeLeft] = useState(900);

  // Load custom QRIS from localStorage if configured
  useEffect(() => {
    try {
      const saved = localStorage.getItem('marlins_merchant_static_qris');
      if (saved && saved.startsWith('000201')) {
        setActiveStaticQris(saved);
        setStaticQrisInput(saved);
      }
    } catch {}
  }, []);

  // Compute dynamic QRIS whenever amount or static QRIS changes
  useEffect(() => {
    const dynamicStr = convertStaticToDynamicQris(activeStaticQris, amount);
    setDynamicPayload(dynamicStr);

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        dynamicStr,
        {
          width: 260,
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
  }, [activeStaticQris, amount]);

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

  const handleSaveCustomQris = (e: React.FormEvent) => {
    e.preventDefault();
    if (staticQrisInput.trim().startsWith('000201')) {
      setActiveStaticQris(staticQrisInput.trim());
      try {
        localStorage.setItem('marlins_merchant_static_qris', staticQrisInput.trim());
      } catch {}
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 3000);
    }
  };

  const handleResetDefaultQris = () => {
    setActiveStaticQris(DEFAULT_STATIC_QRIS);
    setStaticQrisInput('');
    try {
      localStorage.removeItem('marlins_merchant_static_qris');
    } catch {}
  };

  const handleCopyPayload = () => {
    if (dynamicPayload) {
      navigator.clipboard.writeText(dynamicPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  const handleDownloadQr = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `QRIS-Marlins-${invoiceId}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const merchantInfo = parseQrisMerchantInfo(activeStaticQris);

  return (
    <div className="space-y-5 font-sans select-none">
      
      {/* Main QRIS Bill Card */}
      <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden relative">
        
        {/* Top QRIS Header Band (Red/White ASPI Standard) */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* QRIS White Logo Text */}
            <div className="bg-white px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <span className="font-heading font-black text-red-600 text-sm tracking-tight">QRIS</span>
            </div>
            <span className="text-[11px] font-bold text-white/90">
              Standar Pembayaran Nasional (Bank Indonesia)
            </span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold backdrop-blur-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Merchant & Transaction Details */}
        <div className="p-5 sm:p-6 text-center space-y-4">
          
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              MERCHANT RESMI
            </span>
            <h3 className="font-heading text-base sm:text-lg font-black text-slate-900 leading-tight">
              {merchantInfo.merchantName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              NMID: ID1024358901234 • {merchantInfo.merchantCity}
            </p>
          </div>

          {/* Locked Exact Amount Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200/80 max-w-sm mx-auto shadow-inner space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Tagihan (Nominal Terkunci Otomatis)
            </span>
            <p className="font-mono text-2xl sm:text-3xl font-black text-[#0284C7] tracking-tight">
              {formatPriceIDR(amount)}
            </p>
            <span className="text-[10px] text-emerald-700 font-bold inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Nominal akan otomatis muncul saat di-scan (Tidak perlu ketik manual)</span>
            </span>
          </div>

          {/* QR Code Canvas Box */}
          <div className="relative inline-block mx-auto p-3.5 bg-white border-2 border-dashed border-slate-300/90 rounded-3xl shadow-sm">
            <canvas ref={canvasRef} className="rounded-2xl max-w-full h-auto" />
            
            {/* Center GPN / Marlins Brand Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-red-500 shadow-md flex items-center justify-center font-heading font-black text-xs text-[#0284C7] p-0.5">
                MLT
              </div>
            </div>
          </div>

          {/* Supported Banking & E-Wallets App Icons Text */}
          <div className="space-y-1.5 pt-1">
            <p className="text-xs font-bold text-slate-800">
              Bisa di-scan menggunakan seluruh aplikasi m-Banking & E-Wallet:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-extrabold text-slate-600">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">BCA Mobile</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Livin Mandiri</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">BRImo</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">BNI Mobile</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">GoPay</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">OVO</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">DANA</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">ShopeePay</span>
            </div>
          </div>

          {/* Action Buttons: Download QR & Copy Payload */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Simpan Gambar QR</span>
            </button>

            <button
              type="button"
              onClick={handleCopyPayload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPayload ? 'String Disalin' : 'Salin String QRIS'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-bold transition-all cursor-pointer"
              title="Atur String QRIS Statis Sendiri"
            >
              <Settings2 className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Gunakan QRIS Milik Sendiri</span>
              {showConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Simulation / Instant Verification Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onPaymentSuccess}
              disabled={processing}
              className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99]"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Pembayaran QRIS...</span>
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

      {/* --- CUSTOM QRIS STATIC TO DYNAMIC CONFIGURATOR BOX --- */}
      {showConfig && (
        <div className="p-5 sm:p-6 bg-white rounded-[26px] border border-sky-200 shadow-lg space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                <Settings2 className="w-3.5 h-3.5" />
                <span>Fitur Generator QRIS Dinamis Otomatis</span>
              </div>
              <h4 className="font-heading text-sm sm:text-base font-extrabold text-slate-900">
                Punya QRIS Biasa (Statis)? Tempelkan String / Hasil Scan di Sini
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Sistem kami akan secara otomatis menyuntikkan <strong className="text-slate-800 font-bold">Tag 54 ({amount})</strong> dan menghitung ulang <strong className="text-slate-800 font-bold">CRC16 EMVCo</strong> sehingga QRIS statis Anda otomatis menjadi QRIS Dinamis dengan nominal tagihan tepat!
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveCustomQris} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                String QRIS Statis Anda (Diawali 000201...)
              </label>
              <textarea
                rows={3}
                value={staticQrisInput}
                onChange={(e) => setStaticQrisInput(e.target.value)}
                placeholder="Contoh: 00020101021126670016ID.CO.QRIS.WWW01189360050300000889900215ID10243589012340303UME5204581253033605802ID5920NAMA TOKO ANDA6008DENPASAR6105802346304ABCD"
                className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20"
              />
              <p className="text-[11px] text-slate-400">
                *Tip: Anda bisa mendapatkan string ini dengan men-scan QRIS statis Anda menggunakan aplikasi barcode scanner di HP.
              </p>
            </div>

            {configSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>QRIS Anda berhasil disimpan! QR code di atas kini terhubung langsung ke rekening/merchant Anda dengan nominal {formatPriceIDR(amount)}.</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleResetDefaultQris}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
              >
                Gunakan QRIS Default LTE Cruise
              </button>

              <button
                type="submit"
                disabled={!staticQrisInput.trim()}
                className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-xs"
              >
                Terapkan & Generate QRIS Dinamis
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
