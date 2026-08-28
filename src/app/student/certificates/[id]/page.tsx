'use client';

export const dynamic = 'force-dynamic';

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

        if (data) {
          setCertificate(data as Certificate);
          return;
        }

        // Fallback to local storage
        const localStr =
          typeof window !== 'undefined'
            ? localStorage.getItem(`marlins_cert_id_${certId}`) ||
              localStorage.getItem(`marlins_cert_${certId}`) ||
              localStorage.getItem(`marlins_cert_${certId.replace('cert-', '')}`)
            : null;

        if (localStr) {
          try {
            setCertificate(JSON.parse(localStr) as Certificate);
            return;
          } catch (e) {}
        }

        setErrorMsg('Sertifikat tidak ditemukan atau tidak valid.');
      } catch (err: any) {
        // Fallback check on catch
        const localStr =
          typeof window !== 'undefined'
            ? localStorage.getItem(`marlins_cert_id_${certId}`) ||
              localStorage.getItem(`marlins_cert_${certId}`)
            : null;

        if (localStr) {
          try {
            setCertificate(JSON.parse(localStr) as Certificate);
            return;
          } catch (e) {}
        }
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
          className="inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white font-bold text-xs shadow-md shadow-sky-500/20"
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
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0284C7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Koleksi Sertifikat</span>
        </Link>
      </div>

      <CertificateTemplate certificate={certificate} allowPrint={true} />
    </div>
  );
}
