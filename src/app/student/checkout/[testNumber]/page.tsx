'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  CreditCard,
  QrCode,
  Building2,
  Smartphone,
  Wallet,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Clock,
  Download,
  Printer,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';

// Standard fallback tests metadata
const DEFAULT_TEST_PRICES: Record<number, { name: string; price: number; desc: string }> = {
  1: { name: 'Marlint Test 1', price: 0, desc: 'Placement & Diagnostic Maritime English Standard Assessment' },
  2: { name: 'Marlint Test 2', price: 49000, desc: 'Elementary Maritime Communication & Safety SMCP' },
  3: { name: 'Marlint Test 3', price: 49000, desc: 'Intermediate Bridge & Engine Room VHF Radio Protocol' },
  4: { name: 'Marlint Test 4', price: 59000, desc: 'Advanced Navigation & Engineering Technical English' },
  5: { name: 'Marlint Test 5', price: 59000, desc: 'Offshore Operations & Dynamic Positioning Systems' },
  6: { name: 'Marlint Test 6', price: 69000, desc: 'Container & Bulk Carrier Operations (IMSBC & Cyber Risk)' },
  7: { name: 'Marlint Test 7', price: 69000, desc: 'Ro-Ro Passenger Safety, Polar Code & Green Shipping (CII)' },
  8: { name: 'Marlint Test 8', price: 79000, desc: 'Heavy Lift, Dry Docking, Ocean Towage & Bio-Fouling' },
  9: { name: 'Marlint Test 9', price: 79000, desc: 'Autonomous Ships (MASS), Modern GMDSS & BRM Forensics' },
  10: { name: 'Marlint Test 10', price: 99000, desc: 'Master & Chief Engineer Executive Capstone' },
};

type PaymentMethod = 'qris' | 'bca_va' | 'mandiri_va' | 'bni_va' | 'bri_va' | 'gopay' | 'ovo' | 'cc';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const testNumber = parseInt(params.testNumber as string, 10) || 2;

  const [test, setTest] = useState<MarlintTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris');

  // Checkout modal & payment process states
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [copiedVA, setCopiedVA] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [paidAt, setPaidAt] = useState('');

  // Countdown timer for pending payment (15 minutes)
  const [countdown, setCountdown] = useState(900);

  useEffect(() => {
    async function loadTestInfo() {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('marlint_tests')
          .select('*')
          .eq('test_number', testNumber)
          .maybeSingle();

        if (data) {
          setTest(data as MarlintTest);
        } else {
          const fallback = DEFAULT_TEST_PRICES[testNumber] || DEFAULT_TEST_PRICES[2];
          setTest({
            id: `test-pkg-${testNumber}`,
            test_number: testNumber,
            test_name: fallback.name,
            description: fallback.desc,
            duration: 60,
            total_questions: 60,
            passing_grade: 70,
            is_active: true,
            is_free: testNumber === 1,
            price: fallback.price,
            created_at: new Date().toISOString(),
          } as MarlintTest);
        }
      } catch (err) {
        const fallback = DEFAULT_TEST_PRICES[testNumber] || DEFAULT_TEST_PRICES[2];
        setTest({
          id: `test-pkg-${testNumber}`,
          test_number: testNumber,
          test_name: fallback.name,
          description: fallback.desc,
          duration: 60,
          total_questions: 60,
          passing_grade: 70,
          is_active: true,
          is_free: testNumber === 1,
          price: fallback.price,
          created_at: new Date().toISOString(),
        } as MarlintTest);
      } finally {
        setLoading(false);
      }
    }

    loadTestInfo();
  }, [testNumber]);

  // Generate unique Invoice number
  useEffect(() => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    setInvoiceId(`INV-MLT-${dateStr}-${testNumber}${randomSuffix}`);
  }, [testNumber]);

  // Ticking countdown
  useEffect(() => {
    if (!showPaymentModal || isPaid) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showPaymentModal, isPaid]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyVA = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleInitiatePayment = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmPaymentSuccess = async () => {
    try {
      setProcessing(true);
      const currentTime = new Date().toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      setPaidAt(currentTime);

      // 1. Grant Entitlement locally in LocalStorage
      if (user?.id) {
        const entKey = `marlins_entitlements_${user.id}`;
        let currentEnts: number[] = [];
        try {
          const raw = localStorage.getItem(entKey);
          if (raw) currentEnts = JSON.parse(raw);
        } catch (e) {}

        if (!currentEnts.includes(testNumber)) {
          currentEnts.push(testNumber);
          localStorage.setItem(entKey, JSON.stringify(currentEnts));
        }

        // Save transaction history
        const txKey = `marlins_transactions_${user.id}`;
        let currentTxs: any[] = [];
        try {
          const rawTx = localStorage.getItem(txKey);
          if (rawTx) currentTxs = JSON.parse(rawTx);
        } catch (e) {}

        currentTxs.unshift({
          invoice_id: invoiceId,
          test_number: testNumber,
          test_name: test?.test_name || `Marlins Test #${testNumber}`,
          amount: test?.price || 49000,
          payment_method: selectedMethod,
          status: 'PAID',
          created_at: new Date().toISOString(),
        });
        localStorage.setItem(txKey, JSON.stringify(currentTxs));

        // 2. Grant Entitlement in Supabase
        try {
          await supabase.from('test_entitlements').upsert({
            user_id: user.id,
            test_number: testNumber,
            is_active: true,
            granted_by: 'payment_checkout',
            created_at: new Date().toISOString(),
          });
        } catch (supaErr) {
          console.warn('Supabase entitlement sync fallback to local cache:', supaErr);
        }
      }

      setIsPaid(true);
    } catch (err) {
      console.error('Error confirming payment:', err);
    } finally {
      setProcessing(false);
    }
  };

  const price = test?.price || DEFAULT_TEST_PRICES[testNumber]?.price || 49000;
  const vaNumber = `8801 ${testNumber.toString().padStart(2, '0')}98 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-600">Menyiapkan checkout pembayaran resmi...</p>
      </div>
    );
  }

  // --- VIEW 1: SUCCESSFUL PAYMENT SCREEN (STRUK RESMI) ---
  if (isPaid) {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6 font-sans">
        {/* Receipt Container */}
        <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6 relative overflow-hidden text-center">
          
          {/* Subtle Top Ambient Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-[#0284C7]" />

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
              Pembayaran Lunas
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Akses Ujian Berhasil Diaktifkan!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Hak pengerjaan <strong className="text-slate-800 font-bold">{test?.test_name}</strong> kini aktif permanen pada akun pelaut Anda.
            </p>
          </div>

          {/* Receipt Data Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-left space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <span className="text-slate-500 font-sans">No. Transaksi / Invoice</span>
              <span className="font-bold text-slate-900">{invoiceId}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <span className="text-slate-500 font-sans">Paket Ujian</span>
              <span className="font-bold text-slate-900">Marlins #{testNumber} (60 Soal STCW)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <span className="text-slate-500 font-sans">Waktu Pembayaran</span>
              <span className="font-bold text-slate-800">{paidAt || 'Baru Saja'}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <span className="text-slate-500 font-sans">Metode Pembayaran</span>
              <span className="font-bold text-[#0284C7] uppercase">{selectedMethod.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-sm font-bold">
              <span className="font-sans text-slate-700">Total Dibayar</span>
              <span className="text-emerald-700 font-extrabold">{formatPriceIDR(price)}</span>
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="space-y-2.5 pt-2">
            <Link
              href={`/student/test/${testNumber}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-bold text-white bg-black hover:bg-neutral-800 transition-all shadow-md active:scale-98"
            >
              <Unlock className="w-4 h-4 text-emerald-400" />
              <span>Mulai Ujian Marlins #{testNumber} Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/student/tests"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span>Kembali ke Katalog Ujian</span>
            </Link>
          </div>

          <p className="text-[11px] text-slate-400">
            Bukti pembayaran resmi diterbitkan secara elektronik dan tersimpan di sistem sertifikasi maritim.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-12">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          href={`/student/test/${testNumber}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0284C7] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Detail Ujian</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gateway Pembayaran Maritim Terenkripsi 256-Bit</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Payment Channel Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                Pilih Metode Pembayaran
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih metode pembayaran instan resmi untuk mengaktifkan lisensi ujian.
              </p>
            </div>

            {/* Method Groups */}
            <div className="space-y-3">
              {/* Option 1: QRIS (Recommended) */}
              <div
                onClick={() => setSelectedMethod('qris')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  selectedMethod === 'qris'
                    ? 'border-[#0284C7] bg-sky-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">QRIS (Semua Bank & E-Wallet)</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase">
                        Instan
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      BCA Mobile, Livin Mandiri, BRImo, BNI, GoPay, OVO, Dana, ShopeePay
                    </p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                  selectedMethod === 'qris' ? 'border-[#0284C7] bg-[#0284C7]' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'qris' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Option 2: Virtual Account Bank */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                  Virtual Account Bank (Verifikasi Otomatis)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'va_bca', name: 'BCA VA', logo: 'BCA' },
                    { id: 'va_mandiri', name: 'Mandiri VA', logo: 'MANDIRI' },
                    { id: 'va_bri', name: 'BRI VA', logo: 'BRI' },
                  ].map((bank) => (
                    <div
                      key={bank.id}
                      onClick={() => setSelectedMethod(bank.id as any)}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedMethod === bank.id
                          ? 'border-[#0284C7] bg-sky-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        <span className="font-bold text-xs text-slate-800">{bank.name}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === bank.id ? 'border-[#0284C7] bg-[#0284C7]' : 'border-slate-300'
                      }`}>
                        {selectedMethod === bank.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option 3: E-Wallet */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                  E-Wallet & Dompet Digital
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'ewallet_gopay', name: 'GoPay' },
                    { id: 'ewallet_ovo', name: 'OVO' },
                    { id: 'ewallet_dana', name: 'DANA' },
                  ].map((ew) => (
                    <div
                      key={ew.id}
                      onClick={() => setSelectedMethod(ew.id as any)}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedMethod === ew.id
                          ? 'border-[#0284C7] bg-sky-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-slate-500" />
                        <span className="font-bold text-xs text-slate-800">{ew.name}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === ew.id ? 'border-[#0284C7] bg-[#0284C7]' : 'border-slate-300'
                      }`}>
                        {selectedMethod === ew.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Pay CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5 sticky top-6">
            <h2 className="font-heading text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Ringkasan Pesanan
            </h2>

            {/* Test Info Card */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] border border-sky-100 text-[10px] font-bold">
                    Paket #{testNumber}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">
                    {test?.test_name || `Marlins Test ${testNumber}`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Standar IMO STCW & SMCP (60 Butir Soal)
                  </p>
                </div>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {formatPriceIDR(price)}
                </span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Harga Lisensi Ujian</span>
                <span className="font-mono font-medium text-slate-800">{formatPriceIDR(price)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Biaya Layanan & Administrasi</span>
                <span className="text-emerald-600 font-bold">GRATIS (Rp 0)</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Pembayaran</span>
                <span className="font-mono text-lg font-extrabold text-[#0284C7]">{formatPriceIDR(price)}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleInitiatePayment}
              className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-sky-500/25 hover:scale-[1.01] active:scale-98"
            >
              <CreditCard className="w-4 h-4 text-white" />
              <span>Bayar Sekarang ({formatPriceIDR(price)})</span>
            </button>

            {/* Token Voucher Alternative Hint */}
            <div className="text-center pt-1">
              <Link
                href="/student/redeem"
                className="text-xs font-semibold text-[#0284C7] hover:underline"
              >
                Punya voucher lisensi akademi? Masukkan Kode Token di sini &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* --- PAYMENT POPUP MODAL (QRIS & VA SIMULATION) --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pembayaran Ujian</p>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  {selectedMethod === 'qris' ? 'Scan QRIS Instan' : 'Transfer Virtual Account'}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(countdown)}</span>
              </div>
            </div>

            {/* Dynamic Content based on method */}
            {selectedMethod === 'qris' ? (
              <div className="text-center space-y-3">
                {/* QRIS Code Box */}
                <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white border-2 border-dashed border-slate-300 rounded-2xl mx-auto p-3 flex flex-col items-center justify-center shadow-inner relative">
                  {/* Decorative QR Mockup */}
                  <div className="w-full h-full bg-slate-900 rounded-xl p-2.5 flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-full bg-white rounded-lg p-2 flex flex-col items-center justify-between">
                      <div className="flex justify-between w-full">
                        <div className="w-8 h-8 bg-black rounded-xs" />
                        <div className="w-8 h-8 bg-black rounded-xs" />
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-tr from-[#0284C7] to-[#EA580C] rounded-md flex items-center justify-center text-white font-bold text-xs">
                        MLT
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="w-8 h-8 bg-black rounded-xs" />
                        <div className="w-4 h-4 bg-slate-400 rounded-xs" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">
                    Buka BCA Mobile, Livin, GoPay, OVO, atau Dana
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Scan kode QR di atas untuk menyelesaikan transaksi otomatis.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Nomor Virtual Account
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-base sm:text-lg font-black text-slate-900 tracking-wider">
                      {vaNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyVA(vaNumber.replace(/\s/g, ''))}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      {copiedVA ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-[11px] text-sky-800 space-y-1">
                  <p className="font-bold">Panduan Pembayaran m-Banking:</p>
                  <p>1. Pilih menu Transfer &gt; Virtual Account</p>
                  <p>2. Masukkan nomor VA di atas</p>
                  <p>3. Tagihan {formatPriceIDR(price)} akan otomatis muncul</p>
                </div>
              </div>
            )}

            {/* Total to pay strip */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Nominal Tagihan:</span>
              <span className="font-mono text-sm font-extrabold text-[#0284C7]">{formatPriceIDR(price)}</span>
            </div>

            {/* Action Simulator Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmPaymentSuccess}
                disabled={processing}
                className="w-full py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-98"
              >
                {processing ? (
                  <span>Memverifikasi Pembayaran...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>⚡ Simulasi Pembayaran Berhasil</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Batalkan & Pilih Metode Lain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
