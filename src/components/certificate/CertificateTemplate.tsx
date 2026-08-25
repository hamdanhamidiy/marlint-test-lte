'use client';

import React from 'react';
import { Certificate } from '@/lib/supabase/types';
import { Anchor, Award, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { formatDateIndo, getCategoryInfo } from '@/lib/utils';

interface CertificateTemplateProps {
  certificate: Certificate;
  allowPrint?: boolean;
}

export default function CertificateTemplate({
  certificate,
  allowPrint = true,
}: CertificateTemplateProps) {
  const handlePrint = () => {
    window.print();
  };

  const categories = certificate.category_scores || {};

  return (
    <div className="space-y-6">
      {/* Actions (Hidden on Print) */}
      {allowPrint && (
        <div className="no-print flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Sertifikat Resmi Terverifikasi & Terdaftar di Sistem Marlins</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md shadow-blue-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Certificate Frame Area */}
      <div className="certificate-print-area relative w-full bg-white text-slate-900 rounded-3xl p-8 sm:p-12 md:p-14 shadow-xl border-[8px] border-[#0A2540] overflow-hidden font-sans">
        {/* Decorative Luxury Gold/Navy Inner Border */}
        <div className="absolute inset-3 border-2 border-[#C5A059] pointer-events-none rounded-2xl" />
        <div className="absolute inset-5 border border-[#C5A059]/40 pointer-events-none rounded-xl" />

        {/* Watermark Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Anchor className="w-96 h-96 text-slate-900" />
        </div>

        {/* Header: Logo & Title */}
        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white p-2 mb-3 shadow-md border border-slate-100 mx-auto">
            <img src="/images/lte-cruise-logo.png" alt="LTE Cruise Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-[#0A2540]">
            Certificate of Proficiency
          </h1>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#C5A059] mt-1">
            LTE CRUISE • MARLINS MARITIME ENGLISH TEST
          </p>
        </div>

        {/* Certificate Recipient */}
        <div className="relative z-10 text-center my-6">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
            This is to certify that
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A2540] border-b-2 border-[#C5A059] pb-2 inline-block px-8">
            {certificate.student_name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-xl mx-auto font-medium">
            has successfully completed and met all proficiency requirements for the standard maritime English assessment:
          </p>
          <p className="text-base sm:text-lg font-bold text-[#0A2540] mt-1">
            {certificate.test_name} (Test #{certificate.test_number})
          </p>
        </div>

        {/* Scores & CEFR Grade Badges */}
        <div className="relative z-10 my-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
              Overall Score
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-700">
              {certificate.score}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
              CEFR Level
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-700">
              {certificate.level}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
              Grade
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#C5A059]">
              Grade {certificate.grade}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
              Result
            </span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-600 flex items-center justify-center gap-1 mt-1">
              PASSED
            </span>
          </div>
        </div>

        {/* Category Breakdown Table */}
        {Object.keys(categories).length > 0 && (
          <div className="relative z-10 max-w-3xl mx-auto my-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 text-center">
              Competency Breakdown by Maritime Category
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.entries(categories).map(([catKey, val]) => {
                const info = getCategoryInfo(catKey);
                const percent = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;

                return (
                  <div key={catKey} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{info.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {val.correct}/{val.total} Benar
                      </p>
                    </div>
                    <span className="font-mono text-sm font-extrabold text-slate-800">
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer: Signatures, Verification Code, Official Seal */}
        <div className="relative z-10 mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
          <div className="text-center sm:text-left space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Certificate Number</p>
            <p className="font-mono font-bold text-slate-900 text-sm">{certificate.certificate_number}</p>
            <p className="text-[10px] text-slate-500">
              Verification Code: <span className="font-mono font-semibold text-slate-800">{certificate.verification_code}</span>
            </p>
            <p className="text-[10px] text-slate-400">
              Issued on: {formatDateIndo(certificate.completion_date || certificate.issued_at)}
            </p>
          </div>

          {/* Golden Seal Stamp */}
          <div className="w-20 h-20 rounded-full border-4 border-[#C5A059] flex flex-col items-center justify-center text-[#C5A059] shadow-inner rotate-[-6deg] bg-amber-50/50 shrink-0">
            <Award className="w-7 h-7" />
            <span className="text-[7px] font-black uppercase tracking-tighter">OFFICIAL SEAL</span>
          </div>

          {/* Signatures */}
          <div className="text-center sm:text-right space-y-1">
            <div className="w-36 border-b border-slate-400 mx-auto sm:ml-auto mb-1 pb-4">
              <span className="font-serif italic text-base font-bold text-slate-800">Maritime Board</span>
            </div>
            <p className="font-bold text-slate-800 text-xs">Chief Examiner</p>
            <p className="text-[10px] text-slate-500">Marlins Maritime Standards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
