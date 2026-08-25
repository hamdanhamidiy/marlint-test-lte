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
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sertifikasi Kemahiran Resmi IMO STCW</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Sertifikat Marlins Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kumpulan dokumen sertifikat kelulusan uji kecakapan Bahasa Inggris Maritim resmi yang diakui secara global.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verifikasi Publik</span>
          </Link>
          <Link
            href="/student/tests"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Ikuti Ujian Baru</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Certificates List / Empty State */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
            <Award className="w-4 h-4" />
          </div>
          <p>Memuat daftar sertifikat resmi...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Belum Ada Sertifikat Kelulusan
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Anda belum menyelesaikan sesi ujian dengan nilai lulus (standar passing grade minimal 70%).
            </p>
          </div>
          <Link
            href="/student/tests"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5046E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Mulai Ujian Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>LULUS ({cert.grade || 'Merit'})</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">
                    {cert.level || 'B2'}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-sm leading-snug">
                    {cert.test_name}
                  </h3>
                  <p className="font-mono text-[11px] text-slate-500 mt-1">
                    No: {cert.certificate_number}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Skor Pencapaian:</span>
                    <span className="font-mono font-bold text-slate-900 text-base">{cert.score}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tanggal Ujian:</span>
                    <span className="font-semibold text-slate-700 text-xs">
                      {formatDateIndo(cert.completion_date || cert.issued_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="font-mono text-[10px] text-slate-400">
                  Kode: {cert.verification_code || 'VER-VALID'}
                </span>

                <Link
                  href={`/student/certificates/${cert.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
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
