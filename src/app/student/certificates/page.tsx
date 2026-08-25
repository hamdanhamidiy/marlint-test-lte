'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  ShieldCheck,
  Calendar,
  Eye,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  QrCode,
  FileText,
  Download,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Certificate } from '@/lib/supabase/types';
import { formatDateIndo } from '@/lib/utils';

export default function StudentCertificatesPage() {
  const { user, profile } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCertificates() {
      if (!user) return;
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_valid', true)
          .order('issued_at', { ascending: false });

        let certList: Certificate[] = [];
        if (data && data.length > 0) {
          certList = data as Certificate[];
        }

        if (typeof window !== 'undefined') {
          // Scan localStorage for any local demo certificates strictly belonging to this user
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('marlins_cert_id_') || key.startsWith('marlins_cert_'))) {
              try {
                const item = JSON.parse(localStorage.getItem(key) || '');
                if (
                  item &&
                  item.id &&
                  (item.user_id === user.id || item.student_email === user.email) &&
                  !certList.some((c) => c.id === item.id || c.certificate_number === item.certificate_number)
                ) {
                  certList.push(item);
                }
              } catch (e) {}
            }
          }
        }

        setCertificates(certList);
      } catch (err) {
        console.error('Error loading certificates:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, [user]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0369A1] text-xs font-bold border border-sky-200/80 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Sertifikasi Kemahiran Resmi IMO STCW</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sertifikat Marlins Saya
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 max-w-2xl leading-relaxed">
            Kumpulan dokumen sertifikat kelulusan uji kecakapan Bahasa Inggris Maritim resmi berstandar internasional yang diakui secara global.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold shadow-xs hover:border-slate-300 transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verifikasi Publik</span>
          </Link>
          <Link
            href="/student/tests"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Ikuti Ujian Baru</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Certificates List / Modern Empty State */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-400 text-xs shadow-xs space-y-2.5">
          <div className="w-9 h-9 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
            <Award className="w-5 h-5" />
          </div>
          <p className="font-bold text-slate-700">Memuat daftar sertifikat resmi...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-7 sm:p-10 max-w-xl mx-auto text-center space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden">
          
          {/* Subtle Top Ambient Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] via-[#EA580C] to-slate-900 opacity-90" />

          {/* Golden Badge Icon */}
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#EA580C] border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Belum Ada Sertifikat Kelulusan
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
              Selesaikan salah satu paket ujian resmi Marlins dengan nilai minimal <strong className="text-slate-800 font-bold">70% (Passing Grade)</strong> untuk menerbitkan lembar sertifikat digital resmi berstandar IMO STCW & QR Code verifikasi.
            </p>
          </div>

          {/* Feature Badges Strip */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 text-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Standar</span>
              <span className="text-xs font-bold text-slate-800">STCW 2010</span>
            </div>
            <div className="border-x border-slate-200/70 px-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Passing</span>
              <span className="text-xs font-bold text-emerald-600">Min. 70%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Format</span>
              <span className="text-xs font-bold text-slate-800">Digital PDF</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
            <Link
              href="/student/tests"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Mulai Ujian Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/student/articles"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Baca Modul SMCP</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-[26px] border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-[#0284C7] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] to-emerald-500 opacity-90" />

              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>LULUS ({cert.grade || 'Merit'})</span>
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0369A1] font-bold text-[10px] border border-sky-200">
                    Level {cert.level || 'B2'}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-base leading-snug group-hover:text-[#0284C7] transition-colors line-clamp-1">
                    {cert.test_name}
                  </h3>
                  <p className="font-mono text-xs text-slate-500 mt-1">
                    No: <strong className="text-slate-800">{cert.certificate_number}</strong>
                  </p>
                </div>

                {/* Score & Completion Meta Box */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Skor Kelulusan:</span>
                    <span className="font-mono font-extrabold text-[#0284C7] text-lg">{cert.score}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Tanggal Ujian:</span>
                    <span className="font-bold text-slate-700 text-xs mt-0.5 block">
                      {formatDateIndo(cert.completion_date || cert.issued_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]" title={cert.verification_code || 'VER-VALID'}>
                  {cert.verification_code || 'VER-VALID'}
                </span>

                <Link
                  href={`/student/certificates/${cert.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Eye className="w-3.5 h-3.5 text-white" />
                  <span>Lihat & Cetak</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
