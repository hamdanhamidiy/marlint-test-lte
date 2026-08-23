'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Clock,
  Award,
  CheckCircle2,
  Edit2,
  Plus,
  X,
  Sparkles,
  DollarSign,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR, getCategoryInfo } from '@/lib/utils';

export default function AdminTestsPage() {
  const [tests, setTests] = useState<MarlintTest[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingTest, setEditingTest] = useState<MarlintTest | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    test_name: '',
    description: '',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    is_free: false,
    price: 49000,
    is_active: true,
  });

  const loadTests = async () => {
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
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleOpenEdit = (test: MarlintTest) => {
    setEditingTest(test);
    setFormData({
      test_name: test.test_name,
      description: test.description || '',
      duration: test.duration || 60,
      total_questions: test.total_questions || 60,
      passing_grade: test.passing_grade || 70,
      is_free: Boolean(test.is_free),
      price: test.price || 0,
      is_active: Boolean(test.is_active),
    });
    setFormError(null);
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;

    try {
      setSaving(true);
      setFormError(null);

      const { error } = await supabase
        .from('marlint_tests')
        .update({
          test_name: formData.test_name.trim(),
          description: formData.description.trim(),
          duration: Number(formData.duration),
          total_questions: Number(formData.total_questions),
          passing_grade: Number(formData.passing_grade),
          is_free: formData.is_free,
          price: formData.is_free ? 0 : Number(formData.price),
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingTest.id);

      if (error) throw error;

      setEditingTest(null);
      await loadTests();
    } catch (err: any) {
      console.error('Error saving test package:', err);
      setFormError(err.message || 'Gagal menyimpan konfigurasi ujian.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7 min-w-0 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
              <span className="font-bold text-slate-900">Konfigurasi Ujian Standar IMO</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Evaluation Settings</span>
            </div>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
            Manajemen Paket Ujian
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Atur nama paket, durasi waktu ujian, passing grade kelulusan, tarif akses, dan status aktif secara realtime.
          </p>
        </div>

        <Link
          href="/admin/questions"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs text-white bg-slate-950 hover:bg-slate-800 shadow-md shadow-slate-900/15 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Kelola Bank Soal</span>
        </Link>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-400 text-xs shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <p className="font-semibold text-slate-700">Memuat konfigurasi paket ujian dari database...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-500 text-sm shadow-2xs">
          Belum ada data paket ujian.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tests.map((test) => {
            const comp = test.question_composition || {
              grammar: 10,
              vocabulary: 10,
              listening_comprehension: 10,
              reading_comprehension: 10,
              time_and_numbers: 10,
              pronunciation: 10,
            };

            return (
              <div
                key={test.id}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Row: Package Tag, Access, Active & Edit */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-sky-50 text-[#0369A1] font-black text-xs border border-sky-200 shadow-2xs">
                        Paket #{test.test_number}
                      </span>
                      {test.is_free ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black border border-emerald-200">
                          GRATIS
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C2410C] text-[11px] font-black border border-orange-200">
                          {formatPriceIDR(test.price)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          test.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {test.is_active ? 'AKTIF' : 'NONAKTIF'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(test)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-50 hover:bg-sky-100 text-[#0284C7] border border-sky-200 transition-all cursor-pointer shadow-2xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-950 leading-snug">
                      {test.test_name.replace('Marlint', 'Marlins')}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                      {test.description || 'Evaluasi standar kompetensi Bahasa Inggris Maritim IMO STCW untuk perwira dan rating kapal.'}
                    </p>
                  </div>

                  {/* Specs Row */}
                  <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Durasi</span>
                      <span className="font-mono text-sm font-black text-slate-950 mt-0.5 block">{test.duration} mnt</span>
                    </div>
                    <div className="border-x border-slate-200/80 px-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Soal</span>
                      <span className="font-mono text-sm font-black text-[#0284C7] mt-0.5 block">{test.total_questions >= 60 ? test.total_questions : 60} butir</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Passing</span>
                      <span className="font-mono text-sm font-black text-emerald-600 mt-0.5 block">{test.passing_grade}%</span>
                    </div>
                  </div>

                  {/* Question Composition */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Komposisi Modul Kategori:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(comp).map(([cat, count]) => {
                        const info = getCategoryInfo(cat);
                        return (
                          <div
                            key={cat}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs ${info.bg} ${info.border}`}
                          >
                            <span className={`font-bold text-[11px] ${info.color}`}>{info.name}</span>
                            <span className="font-mono font-black text-slate-900 text-xs">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Akses: <strong className="text-slate-800 font-bold">{test.is_free ? 'Gratis (Semua Siswa)' : formatPriceIDR(test.price)}</strong></span>
                  <Link
                    href={`/admin/questions`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors"
                  >
                    <span>Bank Soal Paket Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Test Package Modal */}
      {editingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="font-heading text-lg font-bold text-slate-950">
                Konfigurasi Marlins Test #{editingTest.test_number}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTest(null)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Nama Paket Ujian:</label>
                <input
                  type="text"
                  required
                  value={formData.test_name}
                  onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Deskripsi Singkat:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Durasi (Mnt):</label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Total Soal:</label>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    required
                    value={formData.total_questions}
                    onChange={(e) => setFormData({ ...formData, total_questions: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Passing (%):</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    required
                    value={formData.passing_grade}
                    onChange={(e) => setFormData({ ...formData, passing_grade: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Status Akses:</label>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-slate-800 font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="is_free"
                        checked={formData.is_free}
                        onChange={() => setFormData({ ...formData, is_free: true, price: 0 })}
                      />
                      <span>Gratis</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-800 font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="is_free"
                        checked={!formData.is_free}
                        onChange={() => setFormData({ ...formData, is_free: false, price: 49000 })}
                      />
                      <span>Berbayar</span>
                    </label>
                  </div>
                </div>

                {!formData.is_free && (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Tarif (IDR):</label>
                    <input
                      type="number"
                      min={1000}
                      step={1000}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0284C7]"
                  />
                  <span>Paket Ujian Aktif (Bisa dikerjakan siswa)</span>
                </label>
              </div>

              {formError && (
                <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-2xl border border-rose-200 font-medium">
                  {formError}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTest(null)}
                  className="flex-1 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
