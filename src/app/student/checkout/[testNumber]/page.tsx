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
  QrCode,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Download,
  Printer,
  AlertCircle,
  HelpCircle,
  Clock,
  BadgePercent,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';
import QrisPaymentDisplay from '@/components/payment/QrisPaymentDisplay';

// Standard fallback tests metadata
const DEFAULT_TEST_PRICES: Record<number, { name: string; price: number; desc: string }> = {
  1: { name: 'Marlins Test 1', price: 0, desc: 'Placement & Diagnostic Maritime English Standard Assessment' },
  2: { name: 'Marlins Test 2', price: 49000, desc: 'Elementary Maritime Communication & Safety SMCP' },
  3: { name: 'Marlins Test 3', price: 49000, desc: 'Intermediate Bridge & Engine Room VHF Radio Protocol' },
  4: { name: 'Marlins Test 4', price: 59000, desc: 'Advanced Navigation & Engineering Technical English' },
  5: { name: 'Marlins Test 5', price: 59000, desc: 'Offshore Operations & Dynamic Positioning Systems' },
  6: { name: 'Marlins Test 6', price: 69000, desc: 'Container & Bulk Carrier Operations (IMSBC & Cyber Risk)' },
  7: { name: 'Marlins Test 7', price: 69000, desc: 'Ro-Ro Passenger Safety, Polar Code & Green Shipping (CII)' },
  8: { name: 'Marlins Test 8', price: 79000, desc: 'Heavy Lift, Dry Docking, Ocean Towage & Bio-Fouling' },
  9: { name: 'Marlins Test 9', price: 79000, desc: 'Autonomous Ships (MASS), Modern GMDSS & BRM Forensics' },
  10: { name: 'Marlins Test 10', price: 99000, desc: 'Master & Chief Engineer Executive Capstone' },
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const { addNotification } = useNotifications();
  const testNumber = parseInt(params.testNumber as string, 10) || 2;

  const [test, setTest] = useState<MarlintTest | null>(null);
  const [loading, setLoading] = useState(true);

  // Payment states
  const [processing, setProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [paidAt, setPaidAt] = useState('');

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
    setInvoiceId(`INV-QRIS-${dateStr}-${testNumber}${randomSuffix}`);
  }, [testNumber]);

  const handleConfirmPaymentSuccess = async () => {
    try {
      setProcessing(true);
      const currentTime = new Date().toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      setPaidAt(currentTime);

      const activeUserId = user?.id || profile?.id || 'demo_student';

      // 1. Grant Entitlement in LocalStorage
      if (typeof window !== 'undefined') {
        const entKey = `marlins_entitlements_${activeUserId}`;
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
        const txKey = `marlins_transactions_${activeUserId}`;
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
          payment_method: 'QRIS',
          status: 'PAID',
          created_at: new Date().toISOString(),
        });
        localStorage.setItem(txKey, JSON.stringify(currentTxs));
      }

      // 2. Grant Entitlement in Supabase
      if (user?.id) {
        try {
          await supabase.from('test_entitlements').upsert({
            user_id: user.id,
            test_number: testNumber,
            is_active: true,
            granted_by: 'qris_checkout',
            created_at: new Date().toISOString(),
          });
        } catch (supaErr) {
          console.warn('Supabase entitlement sync fallback to local cache:', supaErr);
        }
      }

      // 3. Dispatch Notification to user's inbox
      addNotification({
        user_id: activeUserId,
        type: 'payment_success',
        category: 'token',
        title: `Pembayaran QRIS Paket #${testNumber} Lunas`,
        body: `Pembayaran ${formatPriceIDR(test?.price || 49000)} untuk ${test?.test_name || `Marlins Test #${testNumber}`} telah berhasil diverifikasi. Akses ujian kini aktif!`,
        action_url: `/student/test/${testNumber}`,
        action_label: 'Mulai Ujian Sekarang',
      });

      setIsPaid(true);
    } catch (err) {
      console.error('Error confirming payment:', err);
    } finally {
      setProcessing(false);
    }
  };

  const price = test?.price || DEFAULT_TEST_PRICES[testNumber]?.price || 49000;
  const formattedTestName = test?.test_name ? test.test_name.replace(/Marlint/gi, 'Marlins') : `Marlins Test #${testNumber}`;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3 font-sans">
        <div className="w-10 h-10 border-3 border-[#0284C7] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-600">Menyiapkan QRIS pembayaran dinamis resmi...</p>
      </div>
    );
  }

  // --- VIEW 1: SUCCESSFUL PAYMENT RECEIPT (STRUK LUNAS ELEKTRONIK) ---
  if (isPaid) {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6 font-sans">
        <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6 relative overflow-hidden text-center">
          
          {/* Subtle Top Ambient Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#0284C7]" />

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
              Pembayaran QRIS Lunas
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Akses Ujian Berhasil Diaktifkan!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Hak asesmen <strong className="text-slate-800 font-bold">{formattedTestName}</strong> kini aktif permanen pada akun pelaut Anda.
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
              <span className="font-bold text-slate-900">{formattedTestName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <span className="text-slate-500 font-sans">Waktu Transaksi</span>
              <span className="font-bold text-slate-800">{paidAt || 'Baru Saja'}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <span className="text-slate-500 font-sans">Metode Pembayaran</span>
              <span className="font-bold text-red-600 uppercase">QRIS (Bank Indonesia)</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-sm font-bold">
              <span className="font-sans text-slate-700">Total Tagihan Dibayar</span>
              <span className="text-emerald-700 font-extrabold">{formatPriceIDR(price)}</span>
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="space-y-2.5 pt-2">
            <Link
              href={`/student/test/${testNumber}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all shadow-md shadow-sky-500/20 active:scale-98"
            >
              <Unlock className="w-4 h-4 text-cyan-200" />
              <span>Mulai Ujian #{testNumber} Sekarang</span>
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
            Bukti pembayaran resmi diterbitkan secara elektronik dan tersinkronisasi di sistem sertifikasi maritim.
          </p>
        </div>
      </div>
    );
  }

  // --- VIEW 2: QRIS ONLY CHECKOUT PAGE ---
  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-12 select-none">
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
          <span>Sistem Pembayaran QRIS Nasional Terenkripsi 256-Bit</span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: QRIS Display & Interactive Generator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <QrisPaymentDisplay
            amount={price}
            testName={formattedTestName}
            invoiceId={invoiceId}
            onPaymentSuccess={handleConfirmPaymentSuccess}
            processing={processing}
          />
        </div>

        {/* Right Column: Order Summary & Info (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
            
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-slate-900">
                Ringkasan Pesanan
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-black uppercase">
                QRIS Instan
              </span>
            </div>

            {/* Test Info Card */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] border border-sky-100 text-[10px] font-bold">
                    Paket #{testNumber}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">
                    {formattedTestName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-normal">
                    Standar Asesmen IMO STCW & SMCP (60 Butir Soal Evaluasi)
                  </p>
                </div>
                <span className="font-mono text-sm font-bold text-slate-900 shrink-0">
                  {formatPriceIDR(price)}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Harga Lisensi Ujian</span>
                <span className="font-mono font-medium text-slate-800">{formatPriceIDR(price)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Biaya Transaksi QRIS</span>
                <span className="text-emerald-600 font-bold">GRATIS (Rp 0)</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Verifikasi Akses</span>
                <span className="text-slate-800 font-semibold">Otomatis Aktif Permanen</span>
              </div>
              
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Pembayaran</span>
                <span className="font-mono text-xl font-black text-[#0284C7]">{formatPriceIDR(price)}</span>
              </div>
            </div>

            {/* Step-by-Step Payment Instructions */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-sky-900">
                <Zap className="w-4 h-4 text-[#0284C7]" />
                <span>Cara Bayar dengan QRIS:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-sky-800 leading-relaxed">
                <li>Buka aplikasi m-Banking atau E-Wallet apa saja di HP Anda.</li>
                <li>Pilih menu <strong>Scan / Bayar QRIS</strong>.</li>
                <li>Arahkan kamera ke QR Code di samping.</li>
                <li>Nominal <strong>{formatPriceIDR(price)}</strong> otomatis tertera tanpa perlu ketik manual.</li>
                <li>Konfirmasi PIN, lalu klik tombol verifikasi di bawah.</li>
              </ol>
            </div>

            {/* Token Voucher Alternative Hint */}
            <div className="text-center pt-1 border-t border-slate-100">
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
    </div>
  );
}
