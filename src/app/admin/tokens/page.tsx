'use client';

import React, { useEffect, useState } from 'react';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  X,
  Sparkles,
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>Manajemen Token & Voucher Akses</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
            Access Token Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Terbitkan kode voucher ujian Marlins untuk instansi maritim, akademi pelayaran, dan siswa khusus.
          </p>
        </div>

        <button
          onClick={() => {
            setGeneratedCode(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/20 transition-all hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Token Baru</span>
        </button>
      </div>

      {/* Tokens List */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Memuat daftar token akses...
        </div>
      ) : tokens.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Belum ada token akses yang diterbitkan.
        </div>
      ) : (
        <div className="space-y-3">
          {tokens.map((tok) => {
            const isExhausted = tok.used_count >= tok.max_usage;

            return (
              <div
                key={tok.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-amber-700">
                      Prefix: {tok.token_prefix || 'MLT-****'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        isExhausted
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isExhausted ? 'HABIS' : 'AKTIF'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                      {tok.plan_type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-900 font-bold">
                    {tok.organization ? `Instansi: ${tok.organization}` : tok.description || 'Token Mandiri Siswa'}
                  </p>

                  <p className="text-[11px] text-slate-500 font-medium">
                    Akses Tes: s/d #{tok.max_test_number} • Penggunaan: {tok.used_count}/{tok.max_usage}x • Dibuat: {formatDateIndo(tok.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Issue Token */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <span>Terbitkan Token Akses Baru</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {generatedCode ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">Token Berhasil Dibuat!</h3>
                <p className="text-xs text-slate-600">
                  Salin dan simpan kode token ini sekarang. Demi keamanan, kode lengkap hanya ditampilkan sekali.
                </p>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3">
                  <span className="font-mono text-base sm:text-lg font-black text-amber-900 tracking-wider">
                    {generatedCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedCode, 'new')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700"
                  >
                    {copiedId === 'new' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === 'new' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                >
                  Tutup Jendela
                </button>
              </div>
            ) : (
              <form onSubmit={handleIssueToken} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Tipe Paket:</label>
                  <select
                    value={planType}
                    onChange={(e) => setPlanType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                  >
                    <option value="full_access">Full Access (Semua Tes)</option>
                    <option value="basic">Basic Plan (Tes 1-3)</option>
                    <option value="premium">Premium Enterprise</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Maksimum Nomor Tes:</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={maxTestNumber}
                      onChange={(e) => setMaxTestNumber(Number(e.target.value))}
                      required
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Batas Kuota Pemakaian:</label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={maxUsage}
                      onChange={(e) => setMaxUsage(Number(e.target.value))}
                      required
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Nama Instansi / Akademi (Opsional):</label>
                  <input
                    type="text"
                    placeholder="Contoh: Politeknik Ilmu Pelayaran, PT Samudera..."
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Catatan / Deskripsi:</label>
                  <textarea
                    rows={2}
                    placeholder="Catatan batch penerbitan token..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 font-medium"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={issuing}
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/20 transition-all"
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
