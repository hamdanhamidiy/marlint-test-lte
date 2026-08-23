'use client';

import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  Clock,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR, getCategoryInfo } from '@/lib/utils';

export default function AdminTestsPage() {
  const [tests, setTests] = useState<MarlintTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('marlint_tests')
          .select('*')
          .order('test_number', { ascending: true });

        if (data) {
          setTests(data as MarlintTest[]);
        }
      } catch (err) {
        console.error('Error loading tests for admin:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTests();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
          <FileCheck2 className="w-4 h-4 text-purple-600" />
          <span>Konfigurasi Ujian Marlins</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
          Manajemen Paket Ujian
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Atur komposisi modul soal, durasi waktu, passing grade kelulusan, dan status aktif paket tes.
        </p>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Memuat konfigurasi ujian...
        </div>
      ) : tests.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Belum ada data paket ujian.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test) => {
            const comp = test.question_composition || {};

            return (
              <div
                key={test.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 font-mono text-xs font-black border border-purple-200">
                    Marlins Test #{test.test_number}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                    test.is_active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {test.is_active ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">{test.test_name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Durasi</span>
                    <span className="font-mono font-black text-slate-900">{test.duration} mnt</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Soal</span>
                    <span className="font-mono font-black text-blue-700">{test.total_questions}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Passing</span>
                    <span className="font-mono font-black text-emerald-600">{test.passing_grade}%</span>
                  </div>
                </div>

                {/* Composition */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Komposisi Modul Kategori:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(comp).map(([cat, count]) => {
                      const info = getCategoryInfo(cat);
                      return (
                        <div
                          key={cat}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${info.bg} ${info.border}`}
                        >
                          <span className={`font-bold ${info.color}`}>{info.name}</span>
                          <span className="font-mono font-black text-slate-900">{count} soal</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Status Akses: {test.is_free ? 'Gratis Untuk Siswa' : formatPriceIDR(test.price)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
