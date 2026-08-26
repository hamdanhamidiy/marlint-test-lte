'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Clock,
  Award,
  CheckCircle2,
  Edit2,
  Plus,
  Trash2,
  Copy,
  X,
  Sparkles,
  DollarSign,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
  BookOpen,
  Search,
  Filter,
  ExternalLink,
  Check,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { MarlintTest } from '@/lib/supabase/types';
import { formatPriceIDR } from '@/lib/utils';

// Standard 10 packages baseline fallback
const DEFAULT_TESTS_SEED: MarlintTest[] = [
  {
    id: 'test-1',
    test_number: 1,
    test_name: 'Marlins Test 1 - Cruise Hospitality & Maritime English',
    description: 'Foundation Level & Cruise Staff English standard IMO SMCP.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Foundation',
    is_free: true,
    price: 0,
    currency: 'IDR',
    question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
    icon_url: null,
    color: '#0284C7',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-2',
    test_number: 2,
    test_name: 'Marlins Test 2 - Deck & Engine Operations',
    description: 'Elementary maritime deck, machinery room & safety operations.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Elementary',
    is_free: false,
    price: 49000,
    currency: 'IDR',
    question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
    icon_url: null,
    color: '#0284C7',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-3',
    test_number: 3,
    test_name: 'Marlins Test 3 - Bridge Watchkeeping & COLREGs',
    description: 'Pre-Intermediate bridge navigation, lookouts & watch handover.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Pre-Intermediate',
    is_free: false,
    price: 49000,
    currency: 'IDR',
    question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
    icon_url: null,
    color: '#0284C7',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-4',
    test_number: 4,
    test_name: 'Marlins Test 4 - Tanker Operations & IMDG Cargo Handling',
    description: 'Intermediate tanker cargo hazards, inerting & hazardous handling.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Intermediate',
    is_free: false,
    price: 49000,
    currency: 'IDR',
    question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
    icon_url: null,
    color: '#0284C7',
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-5',
    test_number: 5,
    test_name: 'Marlins Test 5 - Offshore Operations & Dynamic Positioning Systems',
    description: 'Offshore support vessel logistics, helideck & dynamic positioning.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Intermediate',
    is_free: false,
    price: 49000,
    currency: 'IDR',
    question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
    icon_url: null,
    color: '#0284C7',
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-6',
    test_number: 6,
    test_name: 'Marlins Test 6 - Container & Bulk Carrier Operations',
    description: 'Bulk carrier liquefaction, IMSBC code, lashing & maritime cyber security.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Upper-Intermediate',
    is_free: false,
    price: 49000,
    currency: 'IDR',
    question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
    icon_url: null,
    color: '#0284C7',
    is_active: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-7',
    test_number: 7,
    test_name: 'Marlins Test 7 - Ro-Ro Passenger Safety, Polar Code & Green Shipping',
    description: 'Passenger crowd management, Polar water navigation & decarbonization.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Advanced',
    is_free: false,
    price: 49000,
    currency: 'IDR',
    question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
    icon_url: null,
    color: '#0284C7',
    is_active: true,
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-8',
    test_number: 8,
    test_name: 'Marlins Test 8 - Heavy Lift, Dry Docking, Ocean Towage & Bio-Fouling',
    description: 'Tandem crane lift, dry docking survey, bollard pull & hull bio-fouling.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Advanced',
    is_free: false,
    price: 49000,
    currency: 'IDR',
    question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
    icon_url: null,
    color: '#0284C7',
    is_active: true,
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-9',
    test_number: 9,
    test_name: 'Marlins Test 9 - Autonomous Ships (MASS), Modern GMDSS & BRM Forensics',
    description: 'Maritime autonomous surface ships, GMDSS digital modernization & root-cause forensics.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Master/Chief',
    is_free: false,
    price: 49000,
    currency: 'IDR',
    question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
    icon_url: null,
    color: '#0284C7',
    is_active: true,
    display_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-10',
    test_number: 10,
    test_name: 'Marlins Test 10 - Master & Chief Engineer Executive Capstone',
    description: 'Executive command, complex maritime law, salvage contracts & crisis management.',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Capstone',
    is_free: false,
    price: 49000,
    currency: 'IDR',
    question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
    icon_url: null,
    color: '#0284C7',
    is_active: true,
    display_order: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function AdminTestsPage() {
  const [tests, setTests] = useState<MarlintTest[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'number-asc' | 'number-desc' | 'price-asc' | 'price-desc'>('number-asc');

  // Modals State
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedTest, setSelectedTest] = useState<MarlintTest | null>(null);
  const [deleteConfirmTest, setDeleteConfirmTest] = useState<MarlintTest | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    test_number: 1,
    test_name: '',
    description: '',
    duration: 60,
    total_questions: 60,
    passing_grade: 70,
    difficulty_level: 'Intermediate',
    is_free: false,
    price: 49000,
    is_active: true,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const loadTests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marlint_tests')
        .select('*')
        .order('test_number', { ascending: true });

      if (data && data.length > 0) {
        const adjusted = data.map((t) => {
          if (t.test_number <= 10 && (!t.total_questions || t.total_questions < 60)) {
            return { ...t, total_questions: 60 };
          }
          return t;
        });
        setTests(adjusted as MarlintTest[]);
      } else {
        // Use initial standard seeds
        setTests(DEFAULT_TESTS_SEED);
      }
    } catch (err) {
      console.error('Error loading tests for admin:', err);
      setTests(DEFAULT_TESTS_SEED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();

    const channel = supabase
      .channel('admin_tests_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'marlint_tests' },
        () => {
          loadTests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter & Search Logic
  const filteredTests = useMemo(() => {
    return tests
      .filter((t) => {
        const matchesSearch =
          t.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          t.test_number.toString().includes(searchTerm);

        if (!matchesSearch) return false;

        if (statusFilter === 'active') return t.is_active;
        if (statusFilter === 'inactive') return !t.is_active;
        if (statusFilter === 'free') return t.is_free;
        if (statusFilter === 'paid') return !t.is_free;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'number-asc') return a.test_number - b.test_number;
        if (sortBy === 'number-desc') return b.test_number - a.test_number;
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        return 0;
      });
  }, [tests, searchTerm, statusFilter, sortBy]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = tests.length;
    const active = tests.filter((t) => t.is_active).length;
    const free = tests.filter((t) => t.is_free).length;
    const totalQuestions = tests.reduce((acc, curr) => acc + (curr.total_questions || 60), 0);
    return { total, active, free, totalQuestions };
  }, [tests]);

  // Open Create Modal
  const handleOpenCreate = () => {
    const maxTestNum = tests.reduce((max, t) => Math.max(max, t.test_number || 0), 0);
    const nextNum = maxTestNum + 1;

    setFormData({
      test_number: nextNum,
      test_name: `Marlins Test ${nextNum} - Maritime Evaluation Package`,
      description: 'Evaluasi standar kompetensi Bahasa Inggris Maritim IMO STCW.',
      duration: 60,
      total_questions: 60,
      passing_grade: 70,
      difficulty_level: 'Intermediate',
      is_free: false,
      price: 49000,
      is_active: true,
    });
    setFormError(null);
    setSelectedTest(null);
    setModalMode('create');
  };

  // Open Edit Modal
  const handleOpenEdit = (test: MarlintTest) => {
    setSelectedTest(test);
    setFormData({
      test_number: test.test_number,
      test_name: test.test_name,
      description: test.description || '',
      duration: test.duration || 60,
      total_questions: test.total_questions || 60,
      passing_grade: test.passing_grade || 70,
      difficulty_level: test.difficulty_level || 'Intermediate',
      is_free: Boolean(test.is_free),
      price: test.price || 0,
      is_active: Boolean(test.is_active),
    });
    setFormError(null);
    setModalMode('edit');
  };

  // Handle Save (Create or Update)
  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.test_name.trim()) {
      setFormError('Nama paket ujian tidak boleh kosong.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      if (modalMode === 'create') {
        const newPackage: Partial<MarlintTest> = {
          test_number: Number(formData.test_number),
          test_name: formData.test_name.trim(),
          description: formData.description.trim(),
          duration: Number(formData.duration),
          total_questions: Number(formData.total_questions),
          passing_grade: Number(formData.passing_grade),
          difficulty_level: formData.difficulty_level,
          is_free: formData.is_free,
          price: formData.is_free ? 0 : Number(formData.price),
          currency: 'IDR',
          question_composition: { grammar: 15, vocabulary: 15, time_and_numbers: 10, reading: 10, listening: 10 },
          color: '#0284C7',
          is_active: formData.is_active,
          display_order: Number(formData.test_number),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('marlint_tests')
          .insert(newPackage)
          .select();

        if (error) {
          console.warn('Supabase insert warning, updating local state:', error);
          const localItem: MarlintTest = {
            ...newPackage,
            id: `local-test-${Date.now()}`,
          } as MarlintTest;
          setTests((prev) => [...prev, localItem].sort((a, b) => a.test_number - b.test_number));
        } else if (data && data[0]) {
          setTests((prev) => [...prev, data[0] as MarlintTest].sort((a, b) => a.test_number - b.test_number));
        }

        showToast(`Paket Ujian #${formData.test_number} berhasil dibuat.`);
      } else if (modalMode === 'edit' && selectedTest) {
        const updatedFields = {
          test_number: Number(formData.test_number),
          test_name: formData.test_name.trim(),
          description: formData.description.trim(),
          duration: Number(formData.duration),
          total_questions: Number(formData.total_questions),
          passing_grade: Number(formData.passing_grade),
          difficulty_level: formData.difficulty_level,
          is_free: formData.is_free,
          price: formData.is_free ? 0 : Number(formData.price),
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('marlint_tests')
          .update(updatedFields)
          .eq('id', selectedTest.id);

        if (error) {
          console.warn('Supabase update warning, updating local state:', error);
        }

        setTests((prev) =>
          prev.map((t) => (t.id === selectedTest.id ? ({ ...t, ...updatedFields } as MarlintTest) : t))
        );

        showToast(`Konfigurasi Paket #${formData.test_number} berhasil diperbarui.`);
      }

      setModalMode(null);
      setSelectedTest(null);
    } catch (err: any) {
      console.error('Error saving test package:', err);
      setFormError(err.message || 'Gagal menyimpan konfigurasi ujian.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active Status Instantly
  const handleToggleActive = async (test: MarlintTest) => {
    const newStatus = !test.is_active;

    setTests((prev) =>
      prev.map((t) => (t.id === test.id ? { ...t, is_active: newStatus } : t))
    );

    try {
      await supabase
        .from('marlint_tests')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', test.id);

      showToast(`Paket #${test.test_number} sekarang ${newStatus ? 'AKTIF' : 'NONAKTIF'}.`);
    } catch (err) {
      console.error('Error toggling test status:', err);
    }
  };

  // Duplicate Package
  const handleDuplicateTest = async (test: MarlintTest) => {
    const maxTestNum = tests.reduce((max, t) => Math.max(max, t.test_number || 0), 0);
    const nextNum = maxTestNum + 1;

    const duplicatedItem: Partial<MarlintTest> = {
      test_number: nextNum,
      test_name: `${test.test_name.replace(/Marlins Test \d+ - /i, '')} (Salinan #${nextNum})`,
      description: test.description,
      duration: test.duration,
      total_questions: test.total_questions,
      passing_grade: test.passing_grade,
      difficulty_level: test.difficulty_level,
      is_free: test.is_free,
      price: test.price,
      currency: test.currency,
      question_composition: test.question_composition,
      color: test.color,
      is_active: false, // Default duplicated is draft/inactive
      display_order: nextNum,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('marlint_tests')
        .insert(duplicatedItem)
        .select();

      if (data && data[0]) {
        setTests((prev) => [...prev, data[0] as MarlintTest].sort((a, b) => a.test_number - b.test_number));
      } else {
        const localCopy: MarlintTest = {
          ...duplicatedItem,
          id: `local-copy-${Date.now()}`,
        } as MarlintTest;
        setTests((prev) => [...prev, localCopy].sort((a, b) => a.test_number - b.test_number));
      }

      showToast(`Berhasil menduplikasi Paket #${test.test_number} menjadi Paket #${nextNum}.`);
    } catch (err) {
      console.error('Error duplicating test:', err);
    }
  };

  // Delete Test Package
  const handleDeleteTest = async () => {
    if (!deleteConfirmTest) return;

    try {
      setSaving(true);
      await supabase.from('marlint_tests').delete().eq('id', deleteConfirmTest.id);

      setTests((prev) => prev.filter((t) => t.id !== deleteConfirmTest.id));
      showToast(`Paket #${deleteConfirmTest.test_number} telah berhasil dihapus.`);
      setDeleteConfirmTest(null);
    } catch (err: any) {
      console.error('Error deleting test:', err);
      setTests((prev) => prev.filter((t) => t.id !== deleteConfirmTest.id));
      setDeleteConfirmTest(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 min-w-0 font-sans pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-950 text-white text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-top-3 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse"></span>
            <span className="font-bold text-slate-900">Konfigurasi Standar STCW & SMCP</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">Official Test Packages</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Kelola Paket Ujian Marlins
          </h1>

          <p className="text-xs sm:text-[14px] text-slate-500 font-normal max-w-2xl leading-relaxed">
            Atur parameter penilaian, passing grade, durasi pengerjaan, dan skema tarif untuk seluruh paket ujian.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <Link
            href="/admin/questions"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs sm:text-[13px] text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Kelola Bank Soal</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-[13px] text-white bg-black hover:bg-neutral-800 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket Ujian</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Paket Ujian</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono">{stats.total}</span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Paket Aktif</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">{stats.active}</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-[#0369A1] text-xs font-bold uppercase tracking-wider">Total Soal Terhubung</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono">{stats.totalQuestions}</span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-[#C2410C] text-xs font-bold uppercase tracking-wider">Paket Gratis (Free)</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#EA580C] font-mono">{stats.free}</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama paket atau nomor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-200/90 text-xs sm:text-[13px] font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#0284C7] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges & Sort Selector */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-[#F1F3F5] p-1 rounded-full border border-slate-200/70 shrink-0">
            {(
              [
                { id: 'all', label: 'Semua' },
                { id: 'active', label: 'Aktif' },
                { id: 'inactive', label: 'Nonaktif' },
                { id: 'free', label: 'Gratis' },
                { id: 'paid', label: 'Berbayar' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-600 hover:text-black hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-200/90 text-xs sm:text-[13px] font-bold text-slate-800 outline-none focus:bg-white focus:border-[#0284C7] shrink-0 cursor-pointer"
          >
            <option value="number-asc">Nomor Paket (1 - 10)</option>
            <option value="number-desc">Nomor Paket (10 - 1)</option>
            <option value="price-desc">Harga Tertinggi</option>
            <option value="price-asc">Harga Termurah</option>
          </select>
        </div>
      </div>

      {/* Tests Listing Cards */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-400 text-xs shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <p className="font-semibold text-slate-700">Memuat konfigurasi paket ujian dari database...</p>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-500 text-sm shadow-2xs space-y-3">
          <p className="font-semibold text-slate-700">Tidak ada paket ujian yang sesuai dengan filter.</p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0284C7] text-white text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredTests.map((test) => {
            return (
              <div
                key={test.id}
                className="bg-white p-4.5 sm:p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-xs transition-all"
              >
                {/* Left: Package Info & Metadata */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-0.5 rounded-full bg-sky-50 text-[#0369A1] font-black text-xs border border-sky-200 shadow-2xs">
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

                    <button
                      type="button"
                      onClick={() => handleToggleActive(test)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                        test.is_active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                      }`}
                      title="Klik untuk mengubah status aktif"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${test.is_active ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                      <span>{test.is_active ? 'AKTIF' : 'NONAKTIF'}</span>
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                      <span>{test.test_name.replace('Marlint', 'Marlins')}</span>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {test.description || 'Evaluasi standar kompetensi Bahasa Inggris Maritim IMO STCW.'}
                    </p>
                  </div>

                  {/* Inline Stats Chips */}
                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 font-medium pt-1">
                    <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/70">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Stopwatch Waktu</span>
                    </span>

                    <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/70">
                      <BookOpen className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{test.total_questions >= 60 ? test.total_questions : 60} Butir Soal</span>
                    </span>

                    <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/70">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Passing {test.passing_grade}%</span>
                    </span>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end flex-wrap">
                  {/* Bank Soal Quick Link */}
                  <Link
                    href={`/admin/questions`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                    title="Kelola butir soal pada paket ini"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Bank Soal</span>
                  </Link>

                  {/* Duplicate Button */}
                  <button
                    type="button"
                    onClick={() => handleDuplicateTest(test)}
                    className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                    title="Duplikat paket ujian"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(test)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Konfigurasi</span>
                  </button>

                  {/* Delete Button (Only for custom packages > 10 or test packages) */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmTest(test)}
                    className="p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer shadow-2xs"
                    title="Hapus paket ujian"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE & EDIT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="font-heading text-lg font-bold text-slate-950">
                  {modalMode === 'create' ? 'Tambah Paket Ujian Baru' : `Konfigurasi Paket #${formData.test_number}`}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {modalMode === 'create'
                    ? 'Buat paket ujian baru standar maritim internasional IMO.'
                    : 'Perbarui parameter butir soal, kelulusan, dan tarif paket.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1 col-span-1">
                  <label className="block text-xs font-bold text-slate-700">Nomor Paket:</label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    required
                    value={formData.test_number}
                    onChange={(e) => setFormData({ ...formData, test_number: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>

                <div className="space-y-1 col-span-3">
                  <label className="block text-xs font-bold text-slate-700">Nama Paket Ujian:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Marlins Test 11 - Port & Cargo"
                    value={formData.test_name}
                    onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Deskripsi Singkat:</label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan cakupan materi dan kompetensi yang diuji..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Total Butir Soal:</label>
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
                  <label className="block text-xs font-bold text-slate-700">Passing Grade (%):</label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    required
                    value={formData.passing_grade}
                    onChange={(e) => setFormData({ ...formData, passing_grade: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tingkat Kesulitan:</label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                  >
                    <option value="Foundation">Foundation</option>
                    <option value="Elementary">Elementary</option>
                    <option value="Pre-Intermediate">Pre-Intermediate</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Capstone">Capstone</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tipe Akses Paket:</label>
                  <div className="flex items-center gap-4 pt-1.5">
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

                {!formData.is_free ? (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Tarif Harga (IDR):</label>
                    <input
                      type="number"
                      min={1000}
                      step={1000}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Tingkat Kesulitan:</label>
                    <select
                      value={formData.difficulty_level}
                      onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                      className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                    >
                      <option value="Foundation">Foundation (Dasar)</option>
                      <option value="Elementary">Elementary</option>
                      <option value="Pre-Intermediate">Pre-Intermediate</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Capstone">Master / Capstone</option>
                    </select>
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
                  <span>Aktifkan Paket (Tersedia dan dapat dikerjakan siswa)</span>
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
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer transition-all disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : modalMode === 'create' ? 'Buat Paket Ujian' : 'Simpan Konfigurasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-slate-900">
                Hapus Paket Ujian #{deleteConfirmTest.test_number}?
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Tindakan ini akan menghapus paket <strong>{deleteConfirmTest.test_name}</strong> dari daftar ujian siswa.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTest(null)}
                className="flex-1 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteTest}
                disabled={saving}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all disabled:opacity-50"
              >
                {saving ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
