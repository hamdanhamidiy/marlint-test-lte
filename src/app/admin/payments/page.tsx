'use client';

import React, { useEffect, useState } from 'react';
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Search,
  Plus,
  Trash2,
  Download,
  ShieldCheck,
  QrCode,
  KeyRound,
  Users,
  AlertCircle,
  X,
  Sparkles,
  ArrowUpRight,
  Filter,
  Check,
  Clock,
  ExternalLink,
  Eye,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatPriceIDR, formatDateIndo } from '@/lib/utils';
import {
  grantTestEntitlement,
  revokeTestEntitlement,
  approveQrisPayment,
  rejectQrisPayment,
  EntitlementItem,
} from '@/lib/entitlements';

const TEST_NAMES: Record<number, string> = {
  1: 'Marlins Test 1 – Basic Maritime English',
  2: 'Marlins Test 2 – Elementary Maritime Communication',
  3: 'Marlins Test 3 – Intermediate VHF Radio Protocol',
  4: 'Marlins Test 4 – Advanced Navigation & Engineering',
  5: 'Marlins Test 5 – Offshore & Dynamic Positioning',
  6: 'Marlins Test 6 – Container & Bulk Carrier Operations',
  7: 'Marlins Test 7 – Ro-Ro Passenger Safety & Green Shipping',
  8: 'Marlins Test 8 – Heavy Lift & Bio-Fouling Standards',
  9: 'Marlins Test 9 – MASS & BRM Forensics',
  10: 'Marlins Test 10 – Master & Chief Engineer Capstone',
};

const TEST_PRICES: Record<number, number> = {
  1: 0,
  2: 49000,
  3: 49000,
  4: 49000,
  5: 69000,
  6: 69000,
  7: 69000,
  8: 89000,
  9: 89000,
  10: 99000,
};

export default function AdminPaymentsPage() {
  const [entitlements, setEntitlements] = useState<EntitlementItem[]>([]);
  const [usersList, setUsersList] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'qris' | 'token' | 'manual'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'revoked'>('all');

  // Modal Buka Akses Manual
  const [modalOpen, setModalOpen] = useState(false);
  const [granting, setGranting] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedTestNum, setSelectedTestNum] = useState(2);
  const [grantReason, setGrantReason] = useState('Pembayaran Kasir / Transfer Bank Manual');
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState(false);

  // Modal Revoke
  const [revokeConfirmId, setRevokeConfirmId] = useState<string | null>(null);
  const [revoking, setRevoking] = useState(false);

  // Modal Proof Preview
  const [previewProofUrl, setPreviewProofUrl] = useState<string | null>(null);

  // Action states for Approval/Reject
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Fetch all users for student dropdown & enrichment
      const { data: usersData } = await supabase
        .from('users')
        .select('id, full_name, email')
        .order('full_name', { ascending: true });

      const userMap = new Map<string, { full_name: string; email: string }>();
      if (usersData) {
        setUsersList(usersData);
        usersData.forEach((u) => {
          userMap.set(u.id, { full_name: u.full_name || 'Siswa', email: u.email || '' });
        });
      }

      // 2. Fetch all test entitlements from Supabase
      const { data: entData, error: entErr } = await supabase
        .from('test_entitlements')
        .select('*')
        .order('granted_at', { ascending: false });

      let combined: EntitlementItem[] = [];

      if (entData && entData.length > 0) {
        combined = entData.map((e: any) => {
          const userMeta = userMap.get(e.user_id);
          let parsedMeta: any = {};
          if (e.revoke_reason && e.revoke_reason.startsWith('{')) {
            try {
              parsedMeta = JSON.parse(e.revoke_reason);
            } catch {}
          }

          return {
            id: e.id,
            user_id: e.user_id,
            marlint_test_id: e.marlint_test_id,
            test_number: e.test_number,
            source: e.source || 'qris_checkout',
            source_id: parsedMeta.invoice_id || e.source_id || `INV-${e.id.substring(0, 8)}`,
            is_active: e.is_active === true,
            granted_at: e.granted_at || e.created_at || new Date().toISOString(),
            revoked_at: e.revoked_at,
            revoke_reason: e.revoke_reason,
            student_name: userMeta?.full_name || parsedMeta.sender_name || 'Siswa Marlins',
            student_email: userMeta?.email || '',
            sender_name: parsedMeta.sender_name || '',
            sender_phone: parsedMeta.sender_phone || '',
            proof_url: parsedMeta.proof_url || null,
            amount: parsedMeta.amount || TEST_PRICES[e.test_number] || 49000,
          };
        });
      }

      // Sort descending by date
      combined.sort((a, b) => new Date(b.granted_at).getTime() - new Date(a.granted_at).getTime());
      setEntitlements(combined);
    } catch (err) {
      console.error('Error loading payments data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('admin_payments_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'test_entitlements' },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleApprovePayment = async (item: EntitlementItem) => {
    try {
      setActionLoadingId(item.id);
      const res = await approveQrisPayment(item.id, item.user_id, item.test_number);
      if (!res.success) throw new Error(res.error);
      await loadData();
    } catch (err: any) {
      alert('Gagal menyetujui pembayaran: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectPayment = async (item: EntitlementItem) => {
    const confirmReject = confirm(`Tolak pembayaran dari ${item.student_name} (${formatPriceIDR(TEST_PRICES[item.test_number] || 49000)})?`);
    if (!confirmReject) return;

    try {
      setActionLoadingId(item.id);
      const res = await rejectQrisPayment(item.id, 'Pembayaran tidak valid / tidak masuk mutasi rekening');
      if (!res.success) throw new Error(res.error);
      await loadData();
    } catch (err: any) {
      alert('Gagal menolak transaksi: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleGrantManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      setModalError('Pilih siswa penerima akses.');
      return;
    }

    try {
      setGranting(true);
      setModalError(null);

      const invoiceId = `MANUAL-${Date.now()}-${selectedTestNum}`;
      const res = await grantTestEntitlement(
        selectedStudentId,
        selectedTestNum,
        'manual_admin',
        invoiceId
      );

      if (!res.success) {
        throw new Error(res.error || 'Gagal menambahkan akses ujian.');
      }

      setModalSuccess(true);
      await loadData();
      setTimeout(() => {
        setModalOpen(false);
        setModalSuccess(false);
        setSelectedStudentId('');
      }, 1200);
    } catch (err: any) {
      setModalError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setGranting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      setRevoking(true);
      const res = await revokeTestEntitlement(id, 'Dicabut oleh Administrator pada panel keuangan');
      if (!res.success) throw new Error(res.error);
      setRevokeConfirmId(null);
      await loadData();
    } catch (err: any) {
      alert('Gagal mencabut akses: ' + err.message);
    } finally {
      setRevoking(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'No',
      'ID Entitlement',
      'Invoice / Ref ID',
      'Nama Siswa',
      'Email Siswa',
      'Pengirim / No HP',
      'Nomor Ujian',
      'Nama Paket',
      'Nominal (IDR)',
      'Metode',
      'Status',
      'Tanggal Transaksi',
    ];

    const rows = filteredList.map((item, index) => {
      const price = TEST_PRICES[item.test_number] || 49000;
      const statusLabel = item.source === 'qris_pending' && !item.is_active ? 'PENDING' : item.is_active ? 'LUNAS / AKTIF' : 'DICABUT';
      return [
        index + 1,
        `"${item.id}"`,
        `"${item.source_id || '-'}"`,
        `"${item.student_name || 'Siswa'}"`,
        `"${item.student_email || '-'}"`,
        `"${item.sender_name || '-'} (${item.sender_phone || '-'})"`,
        item.test_number,
        `"${TEST_NAMES[item.test_number] || `Paket #${item.test_number}`}"`,
        price,
        item.source.includes('qris') ? 'QRIS Dinamis' : item.source === 'voucher_token' ? 'Voucher Token' : 'Buka Akses Manual',
        statusLabel,
        `"${formatDateIndo(item.granted_at)}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_Marlins_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pending queue
  const pendingRequests = entitlements.filter((e) => e.source === 'qris_pending' && !e.is_active);

  // Filter list for table
  const filteredList = entitlements.filter((item) => {
    if (statusFilter === 'pending' && (item.is_active || item.source !== 'qris_pending')) return false;
    if (statusFilter === 'active' && !item.is_active) return false;
    if (statusFilter === 'revoked' && (item.is_active || item.source === 'qris_pending')) return false;

    if (sourceFilter === 'qris' && !item.source.includes('qris')) return false;
    if (sourceFilter === 'token' && item.source !== 'voucher_token') return false;
    if (sourceFilter === 'manual' && item.source !== 'manual_admin' && item.source !== 'super_admin_grant') return false;

    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.student_name?.toLowerCase().includes(q) ||
      item.student_email?.toLowerCase().includes(q) ||
      item.sender_name?.toLowerCase().includes(q) ||
      item.source_id?.toLowerCase().includes(q) ||
      String(item.test_number).includes(q) ||
      (TEST_NAMES[item.test_number] || '').toLowerCase().includes(q)
    );
  });

  // KPI Calculations
  const activeTransactions = entitlements.filter((e) => e.is_active);
  const totalRevenue = activeTransactions.reduce((acc, curr) => {
    return acc + (TEST_PRICES[curr.test_number] || 0);
  }, 0);
  const qrisRevenue = activeTransactions
    .filter((e) => e.source.includes('qris'))
    .reduce((acc, curr) => acc + (TEST_PRICES[curr.test_number] || 0), 0);
  const totalSuccessful = activeTransactions.length;

  return (
    <div className="space-y-6 sm:space-y-7 min-w-0 font-sans pb-16 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-900">Manajemen Pembayaran & Keuangan</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">Realtime Approval</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Pembayaran & Pendapatan Ujian
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-2xl leading-relaxed">
            Verifikasi konfirmasi transfer QRIS siswa, pantau arus kas masuk, dan kelola lisensi hak akses paket ujian Marlins.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setModalError(null);
              setModalSuccess(false);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buka Akses Manual</span>
          </button>
        </div>
      </div>

      {/* PENDING CONFIRMATION QUEUE BANNER */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <h3 className="font-extrabold text-amber-950 text-sm sm:text-base">
                  {pendingRequests.length} Konfirmasi Pembayaran Menunggu Verifikasi
                </h3>
                <p className="text-xs text-amber-800 font-normal">
                  Siswa telah mentransfer QRIS dan mengirimkan data konfirmasi. Periksa mutasi dan klik verifikasi untuk membuka akses ujian.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 font-bold text-xs">
              Antrean Baru
            </span>
          </div>

          {/* Pending Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {pendingRequests.map((item) => {
              const price = TEST_PRICES[item.test_number] || 49000;
              const isLoadingThis = actionLoadingId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] font-bold text-[10px] border border-sky-100">
                          Paket #{item.test_number}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs mt-1">
                          {item.student_name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {item.student_email}
                        </p>
                      </div>
                      <span className="font-mono font-black text-sm text-emerald-700">
                        {formatPriceIDR(price)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pengirim:</span>
                        <span className="font-bold text-slate-800">{item.sender_name || 'Tidak dicantumkan'}</span>
                      </div>
                      {item.sender_phone && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">WhatsApp:</span>
                          <span className="font-medium text-slate-700">{item.sender_phone}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Invoice:</span>
                        <span className="font-mono text-slate-600">{item.source_id}</span>
                      </div>
                    </div>

                    {item.proof_url && (
                      <button
                        type="button"
                        onClick={() => setPreviewProofUrl(item.proof_url || null)}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Bukti Struk Transfer</span>
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isLoadingThis}
                      onClick={() => handleRejectPayment(item)}
                      className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      disabled={isLoadingThis}
                      onClick={() => handleApprovePayment(item)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-98"
                    >
                      {isLoadingThis ? (
                        <span>Memproses...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Verifikasi & Buka Akses</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4 Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Pendapatan Bruto */}
        <div className="bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white p-5 rounded-2xl shadow-md shadow-sky-500/15 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-200">
              Total Nilai Lisensi
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formatPriceIDR(totalRevenue)}
            </span>
            <p className="text-[11px] text-cyan-100/90 mt-0.5 font-medium">Akumulasi Seluruh Akses Aktif</p>
          </div>
        </div>

        {/* Pendapatan QRIS Otomatis */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Transaksi QRIS Terverifikasi
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              {formatPriceIDR(qrisRevenue)}
            </span>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-bold">Lunas & Masuk Kas</p>
          </div>
        </div>

        {/* Total Transaksi Lunas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Paket Berhasil Dibeli
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {totalSuccessful}
              </span>
              <span className="text-xs text-slate-400 font-medium">transaksi</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Entitlement Aktif</p>
          </div>
        </div>

        {/* Rata-Rata Order */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Rata-Rata Pembelian
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {totalSuccessful > 0 ? formatPriceIDR(Math.round(totalRevenue / totalSuccessful)) : 'Rp 0'}
            </span>
            <p className="text-[11px] text-purple-700 mt-0.5 font-bold">Nilai Rata-Rata per Sesi</p>
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari invoice, nama siswa, email, atau nama pengirim..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] font-medium transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          
          {/* Method Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 shrink-0">
            <button
              type="button"
              onClick={() => setSourceFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                sourceFilter === 'all' ? 'bg-[#0284C7] text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Semua Metode
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter('qris')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                sourceFilter === 'qris' ? 'bg-[#0284C7] text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              QRIS
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter('manual')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                sourceFilter === 'manual' ? 'bg-[#0284C7] text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Manual Admin
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Semua Status
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Pending ({pendingRequests.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Aktif / Lunas
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('revoked')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'revoked' ? 'bg-rose-600 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Dicabut
            </button>
          </div>

        </div>
      </div>

      {/* Transactions & Entitlements Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
              <CreditCard className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-700">Memuat data transaksi & keuangan...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Wallet className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900">Belum ada riwayat pembayaran yang cocok.</p>
            <p className="text-slate-400">Pembayaran QRIS siswa atau pembukaan akses manual akan otomatis tercatat di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Invoice & Tanggal</th>
                  <th className="py-3.5 px-4">Siswa / Peserta</th>
                  <th className="py-3.5 px-4">Pengirim / Catatan</th>
                  <th className="py-3.5 px-4">Paket Ujian</th>
                  <th className="py-3.5 px-4">Metode</th>
                  <th className="py-3.5 px-4">Nominal</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredList.map((item) => {
                  const price = TEST_PRICES[item.test_number] || 49000;
                  const isQris = item.source.includes('qris');
                  const isManual = item.source === 'manual_admin' || item.source === 'super_admin_grant';
                  const isPending = item.source === 'qris_pending' && !item.is_active;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Invoice & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block truncate max-w-[160px]">
                          {item.source_id || `ENT-${item.id.substring(0, 8)}`}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {formatDateIndo(item.granted_at)}
                        </span>
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block truncate max-w-[160px]">
                          {item.student_name}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                          {item.student_email || item.user_id.substring(0, 12) + '...'}
                        </span>
                      </td>

                      {/* Sender Info / Notes */}
                      <td className="py-3.5 px-4">
                        {item.sender_name ? (
                          <div>
                            <span className="font-semibold text-slate-900 block truncate max-w-[150px]">
                              {item.sender_name}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {item.sender_phone || 'QRIS Transfer'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Test Package */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] font-extrabold text-[10px] border border-sky-100">
                            Paket #{item.test_number}
                          </span>
                          <span className="font-medium text-slate-700 truncate max-w-[150px]">
                            {TEST_NAMES[item.test_number]?.split('–')[1] || 'Evaluasi Standar'}
                          </span>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isQris
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isManual
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isQris && <QrCode className="w-3 h-3" />}
                          {isManual && <ShieldCheck className="w-3 h-3" />}
                          <span>{isQris ? 'QRIS Dinamis' : isManual ? 'Manual Admin' : 'Voucher Token'}</span>
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900">
                          {formatPriceIDR(price)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isPending
                              ? 'bg-amber-100 text-amber-800'
                              : item.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPending ? 'PENDING' : item.is_active ? 'LUNAS / AKTIF' : 'DICABUT'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApprovePayment(item)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                            >
                              Verifikasi
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectPayment(item)}
                              className="px-2 py-1 rounded-lg text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : item.is_active ? (
                          <button
                            type="button"
                            onClick={() => setRevokeConfirmId(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                            title="Cabut Akses Ujian Siswa Ini"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Cabut</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Nonaktif</span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PREVIEW BUKTI TRANSFER */}
      {previewProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Bukti Struk Transfer Siswa</h3>
              <button
                type="button"
                onClick={() => setPreviewProofUrl(null)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[70vh] flex items-center justify-center bg-slate-50">
              <img src={previewProofUrl} alt="Bukti Transfer" className="max-w-full h-auto object-contain" />
            </div>
            <button
              type="button"
              onClick={() => setPreviewProofUrl(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}

      {/* Modal Buka Akses Manual */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-7 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#0284C7]">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-extrabold text-slate-900 text-base">Buka Akses Ujian Siswa Manual</span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Akses Ujian Berhasil Diaktifkan!</h3>
                <p className="text-xs text-slate-500">Siswa kini dapat langsung membuka dan memulai paket ujian yang dipilih.</p>
              </div>
            ) : (
              <form onSubmit={handleGrantManual} className="space-y-4">
                
                {/* Select Student */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Pilih Siswa / Akun Peserta:</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
                  >
                    <option value="">-- Pilih Siswa Terdaftar --</option>
                    {usersList.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.full_name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Test Package */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Pilih Paket Ujian:</label>
                  <select
                    value={selectedTestNum}
                    onChange={(e) => setSelectedTestNum(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
                  >
                    {Object.entries(TEST_NAMES).map(([num, name]) => (
                      <option key={num} value={num}>
                        {name} – {formatPriceIDR(TEST_PRICES[Number(num)] || 49000)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reason Note */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Alasan / Catatan Admin:</label>
                  <input
                    type="text"
                    value={grantReason}
                    onChange={(e) => setGrantReason(e.target.value)}
                    placeholder="Contoh: Pembayaran Tunai Kampus, Beasiswa Instansi..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>

                {modalError && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
                    {modalError}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={granting}
                    className="flex-1 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {granting ? 'Memproses...' : 'Aktifkan Akses Sekarang'}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Revoke Confirmation */}
      {revokeConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Cabut Akses Ujian Ini?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Akses ujian siswa akan segera dikunci kembali di halaman dasbor dan katalog ujian.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRevokeConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={revoking}
                onClick={() => handleRevoke(revokeConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                {revoking ? 'Mencabut...' : 'Ya, Cabut Akses'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
