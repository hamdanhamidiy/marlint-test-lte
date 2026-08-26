'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  User,
  FileCheck2,
  ExternalLink,
  Printer,
  Sparkles,
  Building2,
  Clock,
  BookOpen,
  Anchor,
  HelpCircle,
} from 'lucide-react';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import Logo from '@/components/brand/Logo';
import { supabase } from '@/lib/supabase/client';
import { formatDateIndo } from '@/lib/utils';

function VerificationContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const performVerification = async (searchStr: string) => {
    if (!searchStr.trim()) return;

    const queryCode = searchStr.trim().toUpperCase();

    try {
      setLoading(true);
      setSearched(true);
      setResult(null);

      // 1. Try Supabase RPC
      try {
        const { data: rpcData } = await supabase.rpc('verify_certificate', {
          p_verification_code: queryCode,
        });

        if (rpcData && rpcData.is_valid) {
          setResult(rpcData);
          return;
        }
      } catch (e) {}

      // 2. Try direct Supabase certificates table query
      try {
        const { data: tableData } = await supabase
          .from('certificates')
          .select('*')
          .or(`verification_code.eq.${queryCode},certificate_number.eq.${queryCode},id.eq.${queryCode}`)
          .eq('is_valid', true)
          .maybeSingle();

        if (tableData) {
          setResult(tableData);
          return;
        }
      } catch (e) {}

      // 3. Fallback check local certificates storage
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('marlins_cert_') || key.startsWith('marlins_cert_id_'))) {
            try {
              const item = JSON.parse(localStorage.getItem(key) || '');
              if (
                item &&
                (item.verification_code?.toUpperCase() === queryCode ||
                  item.certificate_number?.toUpperCase() === queryCode ||
                  item.id?.toUpperCase() === queryCode)
              ) {
                setResult(item);
                return;
              }
            } catch (e) {}
          }
        }
      }

      setResult({ is_valid: false });
    } catch (err) {
      console.error('Verification error:', err);
      setResult({ is_valid: false });
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify if code/cert/id is in URL query parameters
  useEffect(() => {
    const qCode = searchParams.get('code') || searchParams.get('cert') || searchParams.get('id');
    if (qCode) {
      setCode(qCode);
      performVerification(qCode);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(code);
  };

  const handleQuickSample = (sampleCode: string) => {
    setCode(sampleCode);
    performVerification(sampleCode);
  };

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official Public Certificate Verification Portal</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Verifikasi Keaslian Sertifikat Marlins
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Pusat validasi keaslian dokumen sertifikasi Bahasa Inggris Maritim resmi standar IMO STCW bagi perusahaan pelayaran, agen pengawakan (*manning agencies*), dan otoritas pelabuhan global.
        </p>
      </div>

      {/* Search Box Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Masukkan Nomor Sertifikat atau Kode Verifikasi:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Contoh: MARLINS-1-892144 atau VER-88219044"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] uppercase tracking-wider"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="px-7 py-3.5 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verifikasi Keaslian</span>
                </>
              )}
            </button>
          </div>

          {/* Helper / Preset Hints */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
            <span>Kode verifikasi tercantum di pojok bawah lembar sertifikat resmi.</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-bold text-slate-400">Contoh Kode:</span>
              <button
                type="button"
                onClick={() => handleQuickSample('MARLINS-1-892144')}
                className="font-mono text-[#0284C7] hover:underline cursor-pointer font-semibold"
              >
                MARLINS-1-892144
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Verification Result Display */}
      {searched && !loading && (
        <div className="animate-in fade-in zoom-in-95 duration-200 space-y-6">
          {result && result.is_valid !== false ? (
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
                      VALID & OFFICIAL STCW CERTIFICATE
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold">
                      Sertifikat Terverifikasi Asli & Sah
                    </h2>
                    <p className="text-emerald-100 text-xs mt-0.5">
                      Tercatat secara resmi dalam basis data pengujian kompetensi Marlins Maritime English.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Bukti</span>
                  </button>

                  {result.id && (
                    <Link
                      href={`/student/certificates/${result.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Lembar Asli</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Nama Kandidat</span>
                    <p className="font-heading font-bold text-slate-900 text-sm sm:text-base">{result.student_name || 'Budi Santoso'}</p>
                    <p className="text-xs text-slate-500">{result.student_email || 'Kandidat Perwira'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Paket Ujian</span>
                    <p className="font-heading font-bold text-slate-900 text-sm">{result.test_name}</p>
                    <p className="text-xs text-slate-500 font-mono">Test #{result.test_number || 1}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Skor & Level CEFR</span>
                    <p className="font-mono font-bold text-emerald-600 text-lg sm:text-xl">
                      {result.score}%
                    </p>
                    <p className="text-xs font-semibold text-slate-700">
                      Level {result.level || 'B2'} • {result.grade || 'Merit'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Nomor Sertifikat</span>
                    <p className="font-mono font-bold text-slate-900 text-xs sm:text-sm truncate" title={result.certificate_number}>
                      {result.certificate_number}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">Kode: {result.verification_code || 'VER-VALID'}</p>
                  </div>
                </div>

                {/* Sub-Category Competency Breakdown */}
                {result.category_scores && Object.keys(result.category_scores).length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-slate-900 text-sm">
                        Analisis Penguasaan 6 Kompetensi Maritim:
                      </h4>
                      <span className="text-xs text-slate-500">Standar IMO STCW A-II/1</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(result.category_scores).map(([cat, score]: [string, any]) => {
                        const total = score.total || 10;
                        const correct = score.correct || 0;
                        const pct = Math.round((correct / total) * 100);
                        const catLabel =
                          cat === 'listening_comprehension'
                            ? 'Listening'
                            : cat === 'grammar'
                            ? 'Grammar'
                            : cat === 'vocabulary'
                            ? 'Vocabulary'
                            : cat === 'time_and_numbers'
                            ? 'Time & Numbers'
                            : cat === 'pronunciation'
                            ? 'Pronunciation'
                            : cat === 'reading_comprehension'
                            ? 'Reading'
                            : cat;

                        return (
                          <div key={cat} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-slate-700 capitalize">{catLabel}</span>
                              <span className="font-mono text-slate-900">{pct}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pct >= 80 ? 'bg-emerald-500' : pct >= 65 ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tanggal Penerbitan: <strong>{formatDateIndo(result.issued_at || result.completion_date || new Date().toISOString())}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lembaga Penguji: <strong>Marlins Testing & Assessment Board</strong></span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-10 text-center border border-rose-200 rounded-3xl max-w-lg mx-auto space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Sertifikat Tidak Ditemukan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Kode verifikasi atau nomor sertifikat <strong className="font-mono text-slate-800">"{code.toUpperCase()}"</strong> tidak terdaftar dalam database kami atau telah dinyatakan kedaluwarsa/tidak berlaku.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-1">
                <span className="font-bold text-slate-800 block">Saran Pemeriksaan:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Pastikan tidak ada salah ketik pada nomor registrasi atau kode QR.</li>
                  <li>Periksa format standar: <code className="font-bold text-slate-800">MARLINS-X-XXXXXX</code> atau <code className="font-bold text-slate-800">VER-XXXXXXXX</code>.</li>
                  <li>Jika Anda meyakini ini adalah kekeliruan, hubungi lembaga maritim penerbit sertifikat.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default function CertificateVerificationPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-[#0284C7] selection:text-white font-sans">
      <PublicNavbar />

      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-8 h-8 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <VerificationContent />
      </Suspense>

      <footer className="border-t border-slate-200/80 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 font-medium">
          Marlins Maritime English Verification System • Standar IMO STCW & CEFR International
        </div>
      </footer>
    </div>
  );
}
