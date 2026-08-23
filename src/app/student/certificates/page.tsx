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
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Certificate } from '@/lib/supabase/types';
import { formatDateIndo } from '@/lib/utils';

export default function StudentCertificatesPage() {
  const { user } = useAuth();
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

        if (data) {
          setCertificates(data as Certificate[]);
        }
      } catch (err) {
        console.error('Error loading certificates:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, [user]);

  return (
    <div className="space-y-5 sm:space-y-6 min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E0E7FF] text-[#4338CA] text-[11px] font-bold tracking-tight">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sertifikasi Kemahiran Resmi IMO STCW</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
            Sertifikat Marlins Saya
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:shadow transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verifikasi Publik</span>
          </Link>
          <Link
            href="/student/tests"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-sm hover:shadow transition-all"
          >
            <span>Ikuti Ujian Baru</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Certificates List / Empty State */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl text-slate-400 text-xs shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto animate-pulse">
            <Award className="w-4 h-4" />
          </div>
          <p className="font-semibold text-slate-700">Memuat sertifikat resmi Anda...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-8 sm:p-10 text-center bg-white border border-slate-200/80 rounded-3xl max-w-md mx-auto space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-100 to-indigo-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs border border-amber-200/60">
            <Award className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
              Belum Ada Sertifikat
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-normal">
              Selesaikan paket ujian dengan nilai minimal 70% untuk menerbitkan sertifikat resmi berstandar IMO STCW.
            </p>
          </div>

          <div className="pt-1">
            <Link
              href="/student/tests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] text-white font-bold text-xs shadow-sm hover:shadow-md hover:bg-[#4338CA] transition-all cursor-pointer"
            >
              <span>Ikuti Ujian Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-indigo-300/80 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between space-y-5 group relative overflow-hidden"
            >
              <div className="space-y-3.5">
                {/* Header: Cert No & Verified Pill */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-extrabold text-[#4F46E5] px-3 py-1 rounded-full bg-[#EEF0FF] border border-indigo-100">
                    {cert.certificate_number}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/80 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>VERIFIED</span>
                  </span>
                </div>

                {/* Title & Issue Date */}
                <div className="space-y-1">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors leading-snug">
                    {cert.test_name} (Test #{cert.test_number})
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 font-normal">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Diterbitkan: {formatDateIndo(cert.completion_date || cert.issued_at)}</span>
                  </p>
                </div>
              </div>

              {/* Quick stats badges */}
              <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-2xl bg-slate-50/90 border border-slate-100 text-center">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Skor</span>
                  <span className="font-mono text-lg font-extrabold text-[#4F46E5]">{cert.score}%</span>
                </div>
                <div className="border-x border-slate-200/70 px-1">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Level CEFR</span>
                  <span className="font-mono text-lg font-extrabold text-indigo-800">{cert.level}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Predikat</span>
                  <span className="text-sm font-extrabold text-emerald-600 mt-0.5 block">{cert.grade}</span>
                </div>
              </div>

              {/* Action footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-mono">
                  Kode: {cert.verification_code.substring(0, 10)}...
                </span>

                <Link
                  href={`/student/certificates/${cert.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-xs hover:shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat & Cetak</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
