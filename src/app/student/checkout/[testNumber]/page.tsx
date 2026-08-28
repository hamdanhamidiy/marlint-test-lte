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
  Clock,
  Zap,
  Upload,
  X,
  Check,
  Phone,
  User,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';
import { submitQrisPaymentRequest } from '@/lib/entitlements';
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
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [senderName, setSenderName] = useState(profile?.full_name || '');
  const [senderPhone, setSenderPhone] = useState(profile?.phone_number || '');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Status: 'checkout' | 'pending' | 'verified'
  const [paymentStatus, setPaymentStatus] = useState<'checkout' | 'pending' | 'verified'>('checkout');
  const [invoiceId, setInvoiceId] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [pendingEntitlementId, setPendingEntitlementId] = useState<string | null>(null);

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

        // Check if user already has an active entitlement or pending request
        if (user?.id) {
          const { data: entData } = await supabase
            .from('test_entitlements')
            .select('*')
            .eq('user_id', user.id)
            .eq('test_number', testNumber)
            .order('granted_at', { ascending: false })
            .limit(1);

          if (entData && entData.length > 0) {
            const ent = entData[0];
            let parsedMeta: any = {};
            if (ent.revoke_reason && ent.revoke_reason.startsWith('{')) {
              try {
                parsedMeta = JSON.parse(ent.revoke_reason);
              } catch {}
            }
            const realInvoice = parsedMeta.invoice_id || ent.source_id || `INV-${ent.id.substring(0, 8)}`;
            if (parsedMeta.sender_name) setSenderName(parsedMeta.sender_name);
            if (parsedMeta.sender_phone) setSenderPhone(parsedMeta.sender_phone);

            if (ent.is_active) {
              setPaymentStatus('verified');
              setInvoiceId(realInvoice);
            } else if (ent.source === 'qris_pending') {
              setPaymentStatus('pending');
              setInvoiceId(realInvoice);
              setPendingEntitlementId(ent.id);
            }
          }
        }
      } catch (err) {
        console.error('Error loading test info:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTestInfo();
  }, [testNumber, user]);

  // Generate unique Invoice number
  useEffect(() => {
    if (!invoiceId) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      setInvoiceId(`INV-QRIS-${dateStr}-${testNumber}${randomSuffix}`);
    }
  }, [testNumber, invoiceId]);

  // Realtime listener for Admin Approval
  useEffect(() => {
    if (user?.id && paymentStatus === 'pending') {
      const channel = supabase
        .channel(`checkout_approval_${user.id}_${testNumber}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'test_entitlements',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.new && payload.new.test_number === testNumber && payload.new.is_active === true) {
              setPaymentStatus('verified');
              addNotification({
                user_id: user.id,
                type: 'payment_success',
                category: 'token',
                title: `Pembayaran Paket #${testNumber} Terverifikasi!`,
                body: `Admin telah memverifikasi pembayaran Anda. Paket ujian kini aktif dan siap dikerjakan.`,
                action_url: `/student/test/${testNumber}`,
                action_label: 'Mulai Ujian Sekarang',
              });
            }
          }
        )
        .subscribe();

      // Also listen to cross-tab BroadcastChannel
      let broadcast: BroadcastChannel | null = null;
      try {
        broadcast = new BroadcastChannel('marlins_entitlements_sync');
        broadcast.onmessage = (e) => {
          if (e.data?.type === 'ENTITLEMENT_GRANTED' && e.data?.testNumber === testNumber) {
            setPaymentStatus('verified');
          }
        };
      } catch {}

      return () => {
        supabase.removeChannel(channel);
        if (broadcast) broadcast.close();
      };
    }
  }, [user, testNumber, paymentStatus]);

  const handleOpenConfirmModal = () => {
    if (!senderName && profile?.full_name) {
      setSenderName(profile.full_name);
    }
    setErrorMsg(null);
    setModalConfirmOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorMsg('Ukuran gambar maksimal 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPaymentForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) {
      setErrorMsg('Masukkan nama pengirim / pemilik rekening / e-wallet.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const activeUserId = user?.id || profile?.id;
      if (!activeUserId) {
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
      }

      const res = await submitQrisPaymentRequest(
        activeUserId,
        testNumber,
        invoiceId,
        {
          sender_name: senderName.trim(),
          sender_phone: senderPhone.trim() || profile?.phone_number || '',
          proof_url: proofImage,
          amount: price,
          note: `Pembayaran QRIS Paket #${testNumber} via Checkout Web`,
        }
      );

      if (!res.success) {
        throw new Error(res.error || 'Gagal mengirim konfirmasi pembayaran.');
      }

      setPendingEntitlementId(res.entitlementId || null);
      setSubmittedAt(
        new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
      );
      setPaymentStatus('pending');
      setModalConfirmOpen(false);

      // Send student notification
      addNotification({
        user_id: activeUserId,
        type: 'payment_pending',
        category: 'token',
        title: `Konfirmasi Pembayaran Paket #${testNumber} Terkirim`,
        body: `Pembayaran ${formatPriceIDR(price)} sedang diverifikasi oleh admin. Halaman akan otomatis membuka akses setelah diverifikasi.`,
        action_url: `/student/checkout/${testNumber}`,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmitting(false);
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

  // --- VIEW 1: VERIFIED / SUCCESSFUL RECEIPT ---
  if (paymentStatus === 'verified') {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6 font-sans">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6 relative overflow-hidden text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
              Pembayaran Terverifikasi Lunas
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Akses Ujian Berhasil Diaktifkan!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Hak asesmen <strong className="text-slate-900 font-bold">{formattedTestName}</strong> kini telah aktif pada akun pelaut Anda.
            </p>
          </div>

          {/* Receipt Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-slate-500">No. Transaksi / Invoice</span>
              <span className="font-mono font-bold text-slate-900">{invoiceId}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-slate-500">Paket Ujian</span>
              <span className="font-bold text-slate-900">{formattedTestName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-slate-500">Metode Pembayaran</span>
              <span className="font-bold text-emerald-700">QRIS Dinamis Terverifikasi</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-sm font-bold">
              <span className="text-slate-700">Total Pembayaran</span>
              <span className="text-emerald-700 font-extrabold">{formatPriceIDR(price)}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-2.5 pt-2">
            <Link
              href={`/student/test/${testNumber}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all shadow-md shadow-sky-500/20 active:scale-98"
            >
              <Unlock className="w-4 h-4 text-cyan-200" />
              <span>Mulai Ujian #{testNumber} Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/student/tests"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span>Kembali ke Katalog Ujian</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // --- VIEW 2: PENDING ADMIN VERIFICATION SCREEN ---
  if (paymentStatus === 'pending') {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6 font-sans">
        <div className="bg-white rounded-3xl border border-amber-200 shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden text-center">
          
          {/* Animated Spinner Icon */}
          <div className="relative w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
            <Clock className="w-8 h-8 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Menunggu Verifikasi Admin</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Konfirmasi Pembayaran Diterima
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Admin sedang mencocokkan mutasi rekening Anda. Begitu disetujui, halaman ini akan <strong className="text-slate-900 font-bold">otomatis terbuka</strong> tanpa perlu direfresh.
            </p>
          </div>

          {/* Details Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-slate-500">No. Invoice</span>
              <span className="font-mono font-bold text-slate-900">{invoiceId}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-slate-500">Paket Ujian</span>
              <span className="font-bold text-slate-900">{formattedTestName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-slate-500">Nama Pengirim</span>
              <span className="font-bold text-slate-900">{senderName || profile?.full_name || 'Siswa'}</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-sm font-bold">
              <span className="text-slate-700">Total Nominal</span>
              <span className="text-amber-700 font-extrabold">{formatPriceIDR(price)}</span>
            </div>
          </div>

          {/* Realtime Pulse Live Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="font-medium">Mendengarkan verifikasi realtime dari server...</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <Link
              href="/student/dashboard"
              className="w-full sm:flex-1 py-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Kembali ke Dasbor</span>
            </Link>

            <a
              href={`https://wa.me/6281234567890?text=Halo%20Admin%2C%20saya%20sudah%20membayar%20QRIS%20Marlins%20${encodeURIComponent(formattedTestName)}%20No%20Invoice%3A%20${invoiceId}%20atas%20nama%20${encodeURIComponent(senderName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 rounded-2xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Konfirmasi via WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    );
  }

  // --- VIEW 3: ACTIVE CHECKOUT PAGE ---
  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-16 min-w-0">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          href={`/student/test/${testNumber}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0284C7] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Detail Ujian</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sistem Pembayaran QRIS Resmi Bank Indonesia</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: QRIS Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <QrisPaymentDisplay
            amount={price}
            testName={formattedTestName}
            invoiceId={invoiceId}
            onPaymentSuccess={handleOpenConfirmModal}
            processing={submitting}
          />
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
            
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h2 className="font-extrabold text-base sm:text-lg text-slate-950">
                Ringkasan Tagihan
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                QRIS Dinamis
              </span>
            </div>

            {/* Test Info Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] border border-sky-100 text-[10px] font-bold">
                Paket #{testNumber}
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                {formattedTestName}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Standar Asesmen IMO STCW & SMCP (60 Butir Soal Evaluasi)
              </p>
            </div>

            {/* Price Details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Harga Lisensi Ujian</span>
                <span className="font-bold text-slate-800">{formatPriceIDR(price)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Biaya Transaksi QRIS</span>
                <span className="text-emerald-600 font-bold">GRATIS (Rp 0)</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Verifikasi Akses</span>
                <span className="text-slate-800 font-semibold">Verifikasi Admin Realtime</span>
              </div>
              
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-extrabold text-slate-900">Total Pembayaran</span>
                <span className="font-black text-xl text-[#0284C7]">{formatPriceIDR(price)}</span>
              </div>
            </div>

            {/* Step Guide */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-sky-900">
                <Zap className="w-4 h-4 text-[#0284C7]" />
                <span>3 Langkah Pembayaran:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-sky-800 leading-relaxed font-normal">
                <li>Scan QRIS dengan aplikasi <strong>m-Banking / E-Wallet</strong> Anda.</li>
                <li>Pastikan nominal <strong>{formatPriceIDR(price)}</strong> sudah sesuai dan selesaikan transfer.</li>
                <li>Klik tombol hijau <strong>"Saya Sudah Bayar"</strong> lalu isi nama rekening pengirim untuk verifikasi.</li>
              </ol>
            </div>

            {/* Voucher Token Alternative */}
            <div className="text-center pt-2 border-t border-slate-100">
              <Link
                href="/student/redeem"
                className="text-xs font-bold text-[#0284C7] hover:underline"
              >
                Punya voucher token akademi? Klaim di sini &rarr;
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* MODAL KONFIRMASI PEMBAYARAN */}
      {modalConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-md w-full p-6 sm:p-7 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Konfirmasi Pembayaran QRIS</span>
              </div>
              <button
                type="button"
                onClick={() => setModalConfirmOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitPaymentForm} className="space-y-3.5 text-xs">
              
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Nominal Transfer:</span>
                <p className="text-lg font-black text-emerald-800">{formatPriceIDR(price)}</p>
              </div>

              {/* Nama Pengirim */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Nama Pemilik Rekening / Akun E-Wallet Pengirim <span className="text-rose-500">*</span>:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Hamdan / DANA - Budi"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* No WhatsApp */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  No. WhatsApp Aktif (Opsional):
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Upload Bukti Transfer */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Unggah Bukti Struk Transfer (Opsional):
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition-all text-center">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-600">
                    {proofImage ? 'Ganti Foto Bukti Transfer' : 'Pilih Screenshot Struk Pembayaran'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {proofImage && (
                  <p className="text-[10px] text-emerald-700 font-bold text-center">
                    ✓ Gambar bukti struk berhasil dipilih
                  </p>
                )}
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
                  {errorMsg}
                </p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalConfirmOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Mengirim Data...' : 'Kirim Konfirmasi'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

