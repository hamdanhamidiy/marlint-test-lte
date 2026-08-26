'use client';

import React, { useEffect, useState } from 'react';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  X,
  Sparkles,
  Search,
  Trash2,
  AlertTriangle,
  Building,
  CheckCircle2,
  Users,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDateIndo } from '@/lib/utils';

export default function AdminTokensPage() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'exhausted'>('all');

  // Form states
  const [planType, setPlanType] = useState('full_access');
  const [maxTestNumber, setMaxTestNumber] = useState(10);
  const [maxUsage, setMaxUsage] = useState(1);
  const [organization, setOrganization] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('access_tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setTokens(data);
      }
    } catch (err) {
      console.error('Error loading tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  const handleApplyPreset = (preset: 'single' | 'class' | 'institution') => {
    if (preset === 'single') {
      setMaxUsage(1);
      setDescription('Voucher Mandiri Siswa');
    } else if (preset === 'class') {
      setMaxUsage(30);
      setDescription('Batch Ujian Kelas Siswa LTE Cruise (30 Siswa)');
    } else if (preset === 'institution') {
      setMaxUsage(100);
      setDescription('Lisensi Lembaga Sekolah Perhotelan & Kapal Pesiar (100 Siswa)');
    }
  };

  const handleIssueToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIssuing(true);
      setErrorMsg(null);

      const { data, error } = await supabase.rpc('issue_access_token', {
        p_plan_type: planType,
        p_max_test_number: Number(maxTestNumber),
        p_max_usage: Number(maxUsage),
        p_organization: organization.trim() || null,
        p_description: description.trim() || null,
      });

      if (error) {
        setErrorMsg(error.message || 'Gagal menerbitkan token.');
        return;
      }

      if (data && data.token_code) {
        setGeneratedCode(data.token_code);
        await loadTokens();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIssuing(false);
    }
  };

  const handleDeleteToken = async (id: string) => {
    try {
      setDeleting(true);
      const { error } = await supabase.from('access_tokens').delete().eq('id', id);
      if (error) throw error;
      setDeleteConfirmId(null);
      await loadTokens();
    } catch (err: any) {
      alert('Gagal menghapus token: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTokens = tokens.filter((tok) => {
    const isExhausted = tok.used_count >= tok.max_usage;
    if (statusFilter === 'active' && isExhausted) return false;
    if (statusFilter === 'exhausted' && !isExhausted) return false;

    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (tok.token_prefix && tok.token_prefix.toLowerCase().includes(s)) ||
      (tok.organization && tok.organization.toLowerCase().includes(s)) ||
      (tok.description && tok.description.toLowerCase().includes(s)) ||
      (tok.plan_type && tok.plan_type.toLowerCase().includes(s))
    );
  });

  const totalIssued = tokens.length;
  const totalActiveTokens = tokens.filter((t) => t.used_count < t.max_usage).length;
  const totalUsedSessions = tokens.reduce((acc, curr) => acc + (curr.used_count || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-7 min-w-0 font-sans pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
            <span className="font-bold text-slate-900">Manajemen Voucher & Token</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">Access Generator</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Access Token Generator
          </h1>

          <p className="text-xs sm:text-[14px] text-slate-500 font-normal max-w-2xl leading-relaxed">
            Terbitkan kode voucher ujian Marlins untuk instansi maritim, akademi pelayaran, dan siswa khusus secara realtime.
          </p>
        </div>

        <button
          onClick={() => {
            setGeneratedCode(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-[13px] text-white bg-[#EA580C] hover:bg-[#C2410C] shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Token Baru</span>
        </button>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Voucher Diterbitkan</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono">{totalIssued}</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center shadow-2xs">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Token Aktif</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">{totalActiveTokens}</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-[#0369A1] text-xs font-bold uppercase tracking-wider">Total Sesi Ujian Terpakai</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0284C7] font-mono">{totalUsedSessions}</span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari prefix token, nama instansi, atau keterangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-200/90 text-xs sm:text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] font-medium transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F1F3F5] p-1 rounded-full border border-slate-200/70 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/70'
            }`}
          >
            Semua ({tokens.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/70'
            }`}
          >
            Aktif ({totalActiveTokens})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('exhausted')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'exhausted'
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/70'
            }`}
          >
            Habis ({tokens.length - totalActiveTokens})
          </button>
        </div>
      </div>

      {/* Tokens List Cards */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-400 text-xs shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-orange-50 text-[#EA580C] flex items-center justify-center mx-auto animate-pulse">
            <KeyRound className="w-4 h-4" />
          </div>
          <p className="font-bold text-slate-700">Memuat daftar token akses...</p>
        </div>
      ) : filteredTokens.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-500 text-sm shadow-2xs space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center mx-auto border border-orange-100">
            <KeyRound className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-slate-900 text-base">Belum Ada Token Akses</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Klik tombol di atas untuk menerbitkan kode token voucher ujian baru.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredTokens.map((tok) => {
            const isExhausted = tok.used_count >= tok.max_usage;
            const usagePercent = Math.min(100, Math.round(((tok.used_count || 0) / (tok.max_usage || 1)) * 100));

            return (
              <div
                key={tok.id}
                className={`bg-white p-5 sm:p-6 rounded-[26px] border transition-all duration-200 space-y-3.5 ${
                  isExhausted
                    ? 'border-slate-200 bg-slate-50/50 opacity-75'
                    : 'border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-slate-300'
                }`}
              >
                {/* Top Row: Prefix, Status & Actions */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-[#C2410C] bg-orange-50 px-3 py-1 rounded-full border border-orange-200 shadow-2xs">
                      Prefix: {tok.token_prefix || 'MLT-****'}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        isExhausted
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isExhausted ? 'KUOTA HABIS' : 'AKTIF'}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700 uppercase">
                      {tok.plan_type?.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(tok.id)}
                      className="p-2 rounded-full text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer shadow-2xs"
                      title="Hapus / Cabut Token Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Middle Row: Description & Organization */}
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-extrabold text-slate-950">
                    {tok.organization ? `Instansi: ${tok.organization}` : tok.description || 'Token Mandiri Siswa'}
                  </p>
                  {tok.description && tok.organization && (
                    <p className="text-xs sm:text-[13px] text-slate-500 font-medium">{tok.description}</p>
                  )}
                </div>

                {/* Bottom Row: Usage Progress Bar & Meta */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-[13px] text-slate-500 font-medium">
                    <span>
                      Akses Paket: <strong className="text-slate-800 font-bold">s/d Paket #{tok.max_test_number}</strong>
                    </span>
                    <span>
                      Penggunaan: <strong className="text-slate-900 font-bold">{tok.used_count}/{tok.max_usage} Kuota</strong> ({usagePercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isExhausted ? 'bg-slate-400' : 'bg-gradient-to-r from-[#0284C7] to-[#EA580C]'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Diterbitkan: {formatDateIndo(tok.created_at)}</span>
                    <span className="font-mono text-slate-400">ID: {tok.id.substring(0, 8)}...</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-sm w-full p-6 sm:p-7 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-slate-950">
                Hapus / Cabut Token Ini?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Token ini akan dinonaktifkan permanen dan tidak dapat lagi digunakan oleh siswa untuk membuka paket ujian.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDeleteToken(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Issue Token */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#EA580C] font-bold text-base">
                <KeyRound className="w-5 h-5 text-[#EA580C]" />
                <span className="font-heading text-slate-950 font-black">Terbitkan Token Akses Baru</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {generatedCode ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-lg font-bold text-slate-950">Token Berhasil Dibuat!</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Salin dan simpan kode token ini sekarang. Demi keamanan, kode lengkap hanya ditampilkan satu kali.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-center justify-between gap-3">
                  <span className="font-mono text-base sm:text-lg font-black text-[#C2410C] tracking-wider">
                    {generatedCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedCode, 'new')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                  >
                    {copiedId === 'new' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === 'new' ? 'Tersalin' : 'Salin Token'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Tutup Jendela
                </button>
              </div>
            ) : (
              <form onSubmit={handleIssueToken} className="space-y-4">
                {/* Presets Row */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Pilih Preset Cepat:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('single')}
                      className="py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-[#0284C7] text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      1 Siswa (1x)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('class')}
                      className="py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-[#0284C7] text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Kelas (30x)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('institution')}
                      className="py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-[#0284C7] text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Institusi (100x)
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tipe Paket:</label>
                  <select
                    value={planType}
                    onChange={(e) => setPlanType(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                  >
                    <option value="full_access">Full Access (Semua Paket Tes)</option>
                    <option value="basic">Basic Plan (Tes 1-3)</option>
                    <option value="premium">Premium Enterprise</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Maksimum Nomor Tes:</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={maxTestNumber}
                      onChange={(e) => setMaxTestNumber(Number(e.target.value))}
                      required
                      className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Batas Kuota Pemakaian:</label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={maxUsage}
                      onChange={(e) => setMaxUsage(Number(e.target.value))}
                      required
                      className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Nama Instansi / Akademi (Opsional):</label>
                  <input
                    type="text"
                    placeholder="Contoh: Politeknik Pelayaran, PT Samudera..."
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Catatan / Deskripsi:</label>
                  <textarea
                    rows={2}
                    placeholder="Catatan batch penerbitan token..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-2xl border border-rose-200 font-medium">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={issuing}
                  className="w-full py-3 rounded-full font-bold text-xs text-white bg-[#EA580C] hover:bg-[#C2410C] shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  {issuing ? 'Menerbitkan...' : 'Generate Token Akses'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
