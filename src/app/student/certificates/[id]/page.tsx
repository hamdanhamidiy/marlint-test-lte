'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Certificate } from '@/lib/supabase/types';
import CertificateTemplate from '@/components/certificate/CertificateTemplate';

export default function SingleCertificatePage() {
  const params = useParams();
  const router = useRouter();
  const certId = params.id as string;

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadCert() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('id', certId)
          .maybeSingle();

        if (error || !data) {
          setErrorMsg('Sertifikat tidak ditemukan atau tidak valid.');
          return;
        }

        setCertificate(data as Certificate);
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memuat sertifikat.');
      } finally {
        setLoading(false);
      }
    }

    if (certId) {
      loadCert();
    }
  }, [certId]);

  if (loading) {
    return (
      <div className="p-16 text-center bg-white border border-slate-200 rounded-3xl max-w-md mx-auto space-y-4 shadow-sm">
        <Award className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
        <h2 className="text-lg font-bold text-slate-900">Memuat Sertifikat Resmi...</h2>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="p-10 text-center bg-white border border-slate-200 rounded-3xl max-w-lg mx-auto space-y-4 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Sertifikat Tidak Ditemukan</h2>
        <p className="text-xs text-slate-600">{errorMsg || 'Data sertifikat tidak valid.'}</p>
        <Link
          href="/student/certificates"
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Kembali ke Daftar Sertifikat
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="no-print">
        <Link
          href="/student/certificates"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Koleksi Sertifikat</span>
        </Link>
      </div>

      <CertificateTemplate certificate={certificate} allowPrint={true} />
    </div>
  );
}
