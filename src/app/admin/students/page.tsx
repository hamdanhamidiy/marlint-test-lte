'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Sparkles,
  KeyRound,
  FileCheck2,
  X,
  Award,
  Clock,
  Unlock,
  Lock,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  Globe,
  Shield,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { UserProfile, UserRole } from '@/lib/supabase/types';
import { getLevelBadge, formatDateIndo } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';

const DEFAULT_STUDENTS: UserProfile[] = [
  {
    id: 'a1c181cd-4d43-49b7-9814-d724ba27ea2e',
    email: 'hamdan@gmail.com',
    full_name: 'Ahmad Hamdan Hamidiy',
    role: 'student',
    status: 'active',
    level: 'A1',
    level_code: 'A1',
    total_points: 320,
    phone_number: '0813318044694',
    photo_url: 'https://xekfarqemnyfguxtpeoj.supabase.co/storage/v1/object/public/avatars/profile_photos/a1c181cd-4d43-49b7-9814-d724ba27ea2e-1770544970243.jpg',
    job_title: 'Taruna Nautika / Deck Officer',
    date_of_birth: '1998-08-14',
    nationality: 'Indonesia',
    about: 'Taruna pelayaran persiapan ujian kompetensi Marlins Test standar internasional.',
    placement_test_taken: true,
    placement_test_date: '2026-02-10T00:00:00.000Z',
    created_at: '2026-02-10T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '3f5812ac-0a1b-48e3-9a5d-6dfb73c52611',
    email: 'asfa@gmail.com',
    full_name: 'Asfa Ahmad',
    role: 'student',
    status: 'active',
    level: 'A1',
    level_code: 'A1',
    total_points: 150,
    phone_number: null,
    photo_url: 'https://xekfarqemnyfguxtpeoj.supabase.co/storage/v1/object/public/avatars/profile_photos/3f5812ac-0a1b-48e3-9a5d-6dfb73c52611-1768089944358.jpg',
    job_title: 'Taruna Pelaut',
    date_of_birth: null,
    nationality: 'Indonesia',
    about: 'Kandidat siswa evaluasi bahasa Inggris maritim.',
    placement_test_taken: true,
    placement_test_date: '2026-02-10T00:00:00.000Z',
    created_at: '2026-02-10T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '65a606b2-3074-43b1-ade6-fbbd7e00b7d6',
    email: 'bita@gmail.com',
    full_name: 'Tsabita Arni Safitri',
    role: 'student',
    status: 'active',
    level: 'A1',
    level_code: 'A1',
    total_points: 210,
    phone_number: null,
    photo_url: 'https://xekfarqemnyfguxtpeoj.supabase.co/storage/v1/object/public/avatars/profile_photos/65a606b2-3074-43b1-ade6-fbbd7e00b7d6-1768119018128.jpg',
    job_title: 'Hospitality & Cruise Staff',
    date_of_birth: null,
    nationality: 'Indonesia',
    about: 'Kandidat perhotelan kapal pesiar internasional.',
    placement_test_taken: true,
    placement_test_date: '2026-02-11T00:00:00.000Z',
    created_at: '2026-02-11T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ad8db4a9-f175-4b4b-9fa1-9e7797a9a76f',
    email: 'leo@gmail.com',
    full_name: 'Paulus Leo Martin',
    role: 'student',
    status: 'active',
    level: 'A1',
    level_code: 'A1',
    total_points: 180,
    phone_number: null,
    photo_url: null,
    job_title: 'Deck Rating / Seafarer',
    date_of_birth: null,
    nationality: 'Indonesia',
    about: 'Kandidat pelaut niaga.',
    placement_test_taken: true,
    placement_test_date: '2026-02-12T00:00:00.000Z',
    created_at: '2026-02-12T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c5118799-cd16-4340-8f27-39e90813554b',
    email: 'zaki@gmail.com',
    full_name: 'Faris Zaki Ahnaf',
    role: 'student',
    status: 'active',
    level: 'A1',
    level_code: 'A1',
    total_points: 240,
    phone_number: null,
    photo_url: null,
    job_title: 'Taruna Teknika / Engine',
    date_of_birth: null,
    nationality: 'Indonesia',
    about: 'Taruna permesinan kapal niaga.',
    placement_test_taken: true,
    placement_test_date: '2026-02-13T00:00:00.000Z',
    created_at: '2026-02-13T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'siswa@marlinstest.com',
    full_name: 'Budi Santoso (Perwira Pelaut)',
    role: 'student',
    status: 'active',
    level: 'B1+',
    level_code: 'B1+',
    total_points: 540,
    phone_number: '081234567890',
    photo_url: null,
    job_title: 'Chief Officer / Deck Officer',
    date_of_birth: '1995-04-12',
    nationality: 'Indonesia',
    about: 'Perwira pelaut Deck Officer berpengalaman di kapal tanker dan kontainer internasional.',
    placement_test_taken: true,
    placement_test_date: '2026-01-10T00:00:00.000Z',
    created_at: '2026-01-10T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
];

export default function AdminStudentsPage() {
  const { isSuperAdmin, isInstructor, profile } = useAuth();
  const [students, setStudents] = useState<UserProfile[]>(DEFAULT_STUDENTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<'all' | 'nautika' | 'teknika' | 'hospitality'>('all');

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    job_title: 'Taruna Pelaut',
    level_code: 'A2',
    nationality: 'Indonesia',
    about: '',
  });
  const [addingStudent, setAddingStudent] = useState(false);

  // Student Detail / Access Modal
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [studentAttempts, setStudentAttempts] = useState<any[]>([]);
  const [studentEntitlements, setStudentEntitlements] = useState<number[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingAccess, setUpdatingAccess] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);

      // 1. Fetch live student records directly from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('role', 'instructor')
        .neq('role', 'super_admin')
        .neq('role', 'admin')
        .order('created_at', { ascending: false });

      // 2. Get locally created students
      let localCustom: UserProfile[] = [];
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('marlins_students_list');
        if (stored) {
          try {
            localCustom = JSON.parse(stored);
          } catch (e) {}
        }
      }

      // 3. Deduplicate strictly by email so each student appears ONLY ONCE
      const map = new Map<string, UserProfile>();

      if (data && data.length > 0) {
        // Priority 1: Live Supabase database student records
        data.forEach((s: any) => {
          if (s.email && s.role !== 'instructor' && s.role !== 'super_admin' && s.role !== 'admin') {
            map.set(s.email.toLowerCase(), s as UserProfile);
          }
        });
      } else {
        // Fallback only if database returned 0 rows
        DEFAULT_STUDENTS.forEach((s) => {
          if (s.email) map.set(s.email.toLowerCase(), s);
        });
      }

      // Only add custom students that do not already exist in database
      localCustom.forEach((s) => {
        if (s.email && !map.has(s.email.toLowerCase()) && s.role !== 'instructor' && s.role !== 'super_admin' && s.role !== 'admin') {
          map.set(s.email.toLowerCase(), s);
        }
      });

      setStudents(Array.from(map.values()));
    } catch (err) {
      console.error('Error loading students:', err);
      setStudents(DEFAULT_STUDENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.full_name.trim() || !newStudentForm.email.trim()) {
      alert('Nama lengkap dan email wajib diisi.');
      return;
    }

    try {
      setAddingStudent(true);
      const newStudent: UserProfile = {
        id: `user-${Date.now()}`,
        email: newStudentForm.email.trim(),
        full_name: newStudentForm.full_name.trim(),
        role: 'student',
        status: 'active',
        level: newStudentForm.level_code,
        level_code: newStudentForm.level_code,
        total_points: 100,
        phone_number: newStudentForm.phone_number.trim() || null,
        photo_url: null,
        job_title: newStudentForm.job_title.trim() || 'Taruna Pelaut',
        date_of_birth: null,
        nationality: newStudentForm.nationality.trim() || 'Indonesia',
        about: newStudentForm.about.trim() || null,
        placement_test_taken: true,
        placement_test_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to local storage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('marlins_students_list');
        const list: UserProfile[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem('marlins_students_list', JSON.stringify([newStudent, ...list]));
      }

      setStudents((prev) => [newStudent, ...prev]);

      // Try inserting into Supabase
      try {
        await supabase.from('users').insert([newStudent]);
      } catch (dbErr) {
        console.warn('Supabase insert student note:', dbErr);
      }

      setIsAddModalOpen(false);
      setNewStudentForm({
        full_name: '',
        email: '',
        phone_number: '',
        job_title: 'Taruna Pelaut',
        level_code: 'A2',
        nationality: 'Indonesia',
        about: '',
      });
      alert(`Siswa ${newStudent.full_name} berhasil ditambahkan ke direktori!`);
    } catch (err: any) {
      alert('Gagal menambah siswa: ' + err.message);
    } finally {
      setAddingStudent(false);
    }
  };

  const handleOpenStudentDetail = async (st: UserProfile) => {
    setSelectedStudent(st);
    try {
      setLoadingDetails(true);

      // Load attempts
      const { data: attempts } = await supabase
        .from('test_attempts')
        .select('*, marlint_tests(test_name)')
        .eq('user_id', st.id)
        .order('created_at', { ascending: false });

      if (attempts) {
        setStudentAttempts(attempts);
      }

      // Load entitlements from canonical test_entitlements table
      const { data: ents } = await supabase
        .from('test_entitlements')
        .select('test_number')
        .eq('user_id', st.id)
        .eq('is_active', true);

      if (ents) {
        setStudentEntitlements(ents.map((e) => e.test_number));
      } else {
        setStudentEntitlements([]);
      }
    } catch (err) {
      console.error('Error loading student details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleTestAccess = async (testNumber: number) => {
    if (!selectedStudent) return;

    try {
      setUpdatingAccess(true);
      const hasAccess = studentEntitlements.includes(testNumber);

      if (hasAccess) {
        // Revoke access
        await supabase
          .from('test_entitlements')
          .update({ is_active: false, revoked_at: new Date().toISOString() })
          .eq('user_id', selectedStudent.id)
          .eq('test_number', testNumber);

        setStudentEntitlements((prev) => prev.filter((t) => t !== testNumber));
      } else {
        // Grant access
        const { data: tData } = await supabase
          .from('marlint_tests')
          .select('id')
          .eq('test_number', testNumber)
          .maybeSingle();

        const marlintTestId = tData?.id || `test-${testNumber}`;

        await supabase
          .from('test_entitlements')
          .upsert(
            [
              {
                user_id: selectedStudent.id,
                marlint_test_id: marlintTestId,
                test_number: testNumber,
                source: 'super_admin_grant',
                is_active: true,
                granted_at: new Date().toISOString(),
              },
            ],
            { onConflict: 'user_id, marlint_test_id' }
          );

        setStudentEntitlements((prev) => [...prev, testNumber]);
      }
    } catch (err: any) {
      alert('Gagal memperbarui akses: ' + err.message);
    } finally {
      setUpdatingAccess(false);
    }
  };

  const handleResetAttempts = async (testNumber: number) => {
    if (!selectedStudent) return;
    if (!confirm(`Reset sesi pengerjaan Test #${testNumber} untuk siswa ini?`)) return;

    try {
      setUpdatingAccess(true);
      await supabase
        .from('test_attempts')
        .delete()
        .eq('user_id', selectedStudent.id)
        .eq('test_number', testNumber);

      // Refresh attempts
      const { data: attempts } = await supabase
        .from('test_attempts')
        .select('*, marlint_tests(test_name)')
        .eq('user_id', selectedStudent.id)
        .order('created_at', { ascending: false });

      if (attempts) setStudentAttempts(attempts);
      alert(`Sesi pengerjaan Test #${testNumber} berhasil di-reset.`);
    } catch (err: any) {
      alert('Gagal reset sesi: ' + err.message);
    } finally {
      setUpdatingAccess(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    // Strictly exclude instructors and admins from students directory
    if (s.role === 'instructor' || s.role === 'super_admin' || s.role === 'admin') return false;

    if (deptFilter === 'nautika') {
      const match = (s.job_title + ' ' + (s.about || '')).toLowerCase();
      if (!match.includes('deck') && !match.includes('nautika') && !match.includes('officer') && !match.includes('perwira') && !match.includes('seafarer') && !match.includes('rating')) {
        return false;
      }
    } else if (deptFilter === 'teknika') {
      const match = (s.job_title + ' ' + (s.about || '')).toLowerCase();
      if (!match.includes('engine') && !match.includes('teknika') && !match.includes('mesin')) {
        return false;
      }
    } else if (deptFilter === 'hospitality') {
      const match = (s.job_title + ' ' + (s.about || '')).toLowerCase();
      if (!match.includes('hotel') && !match.includes('hospitality') && !match.includes('cruise') && !match.includes('steward') && !match.includes('f&b')) {
        return false;
      }
    }

    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.full_name?.toLowerCase().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.job_title && s.job_title.toLowerCase().includes(q)) ||
      (s.nationality && s.nationality.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 sm:space-y-7 min-w-0 font-sans pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
            <span className="font-bold text-slate-900">Direktori Siswa & Taruna</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">Khusus Data Siswa</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Data Siswa & Pelaut
          </h1>

          <p className="text-xs sm:text-[14px] text-slate-500 font-normal max-w-2xl leading-relaxed">
            Total <strong className="text-slate-900 font-bold">{filteredStudents.length}</strong> siswa dan taruna terdaftar. Kelola direktori siswa, akses hak ujian (*entitlements*), dan tinjau riwayat evaluasi kompetensi secara realtime.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-[13px] text-white bg-black hover:bg-neutral-800 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Modern Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama kandidat, email, jabatan, atau kebangsaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-200/90 text-xs sm:text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] font-medium transition-all"
          />
        </div>

        {/* Department Track Filter Tabs */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-[#F1F3F5] p-1 rounded-full border border-slate-200/70">
          <button
            type="button"
            onClick={() => setDeptFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              deptFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/70'
            }`}
          >
            Semua Siswa ({students.filter((s) => s.role === 'student' || !s.role).length})
          </button>
          <button
            type="button"
            onClick={() => setDeptFilter('nautika')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              deptFilter === 'nautika'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/70'
            }`}
          >
            Nautika / Deck
          </button>
          <button
            type="button"
            onClick={() => setDeptFilter('teknika')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              deptFilter === 'teknika'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/70'
            }`}
          >
            Teknika / Engine
          </button>
          <button
            type="button"
            onClick={() => setDeptFilter('hospitality')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              deptFilter === 'hospitality'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-white/70'
            }`}
          >
            Hospitality & Cruise
          </button>
        </div>
      </div>

      {/* Students List Cards */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-400 text-xs shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
            <Users className="w-4 h-4" />
          </div>
          <p className="font-bold text-slate-700">Memuat data siswa dari database...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-500 text-sm shadow-2xs space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-100">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-slate-900 text-base">Tidak Ada Data Siswa</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {search || deptFilter !== 'all'
                ? 'Tidak ada siswa yang sesuai dengan filter pencarian.'
                : 'Belum ada akun siswa yang terdaftar di database.'}
            </p>
          </div>
          {(search || deptFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setDeptFilter('all');
              }}
              className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
            >
              Reset Filter Pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredStudents.map((st) => {
            const badge = getLevelBadge(st.level_code || 'A1');

            return (
              <div
                key={st.id}
                className="bg-white p-5 sm:p-6 rounded-[26px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-md transition-all"
              >
                {/* Left: Avatar & Candidate Information */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] via-slate-900 to-[#EA580C] text-white font-heading font-black text-base flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-0.5">
                    <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                      {st.photo_url ? (
                        <img src={st.photo_url} alt={st.full_name} className="w-full h-full object-cover" />
                      ) : (
                        st.full_name?.charAt(0)?.toUpperCase() || 'S'
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading text-base sm:text-[17px] font-extrabold text-slate-950 truncate">
                        {st.full_name || 'Kandidat Pelaut'}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        st.role === 'admin' || st.role === 'super_admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : st.role === 'instructor'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {st.role || 'Student'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-500 font-medium truncate flex items-center gap-2 flex-wrap">
                      <span>{st.email}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-800 font-bold">{st.job_title || 'Perwira / Rating'}</span>
                      <span className="text-slate-300">•</span>
                      <span>{st.nationality || 'Indonesia'}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Badges & Action */}
                <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${badge.badgeBg} ${badge.badgeText} border ${badge.badgeBorder}`}>
                      Level {st.level_code || 'A1'}
                    </span>

                    <span className="font-mono text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {st.total_points || 0} XP
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenStudentDetail(st)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs sm:text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer"
                  >
                    <span>Kelola Akses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Detail & Entitlements Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#0284C7] uppercase tracking-wider block">
                  Candidate Access Control
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-950">
                  {selectedStudent.full_name || 'Detail Siswa'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email</span>
                <span className="font-bold text-slate-900 truncate block mt-0.5">{selectedStudent.email || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Jabatan</span>
                <span className="font-bold text-slate-900 block mt-0.5">{selectedStudent.job_title || 'Pelaut'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Level CEFR</span>
                <span className="font-black text-[#0284C7] block mt-0.5">Level {selectedStudent.level_code || 'A1'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Akumulasi XP</span>
                <span className="font-black text-amber-600 block mt-0.5">{selectedStudent.total_points || 0} XP</span>
              </div>
            </div>

            {/* Test Entitlements Management (Grant/Revoke Access) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-sm font-bold text-slate-950 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#EA580C]" />
                  <span>Hak Akses Paket Ujian Marlins</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">Klik untuk buka / kunci akses ujian</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const isFree = num === 1;
                  const hasAccess = isFree || studentEntitlements.includes(num);

                  return (
                    <div
                      key={num}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        hasAccess
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-black block">Marlins Test #{num}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {isFree ? 'Gratis Standard' : hasAccess ? 'Akses Terbuka' : 'Terkunci'}
                        </span>
                      </div>

                      {isFree ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          Default Terbuka
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={updatingAccess}
                          onClick={() => handleToggleTestAccess(num)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            hasAccess
                              ? 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                              : 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-xs'
                          }`}
                        >
                          {hasAccess ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          <span>{hasAccess ? 'Kunci' : 'Buka Akses'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Attempts History */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="font-heading text-sm font-bold text-slate-950 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#0284C7]" />
                <span>Riwayat Sesi Ujian Siswa</span>
              </h4>

              {loadingDetails ? (
                <p className="text-xs text-slate-400 py-4 text-center">Memuat riwayat sesi...</p>
              ) : studentAttempts.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center bg-slate-50 rounded-2xl">
                  Siswa ini belum pernah mengerjakan sesi ujian.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {studentAttempts.map((att) => (
                    <div
                      key={att.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {att.marlint_tests?.test_name || `Marlins Test #${att.test_number}`}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Skor: <strong className="text-emerald-700 font-bold">{att.score ?? '-'}%</strong> • Status: <span className="font-bold">{att.status}</span> • {formatDateIndo(att.created_at)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleResetAttempts(att.test_number)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 text-[#C2410C] text-[10px] font-bold border border-orange-200 transition-all cursor-pointer"
                        title="Reset sesi ujian ini"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Sesi</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Add New Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-7 rounded-3xl border border-slate-200/90 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#0284C7] uppercase tracking-wider block">
                  Registrasi Taruna & Siswa Baru
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-950">Tambah Data Siswa</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Nama Lengkap & Pangkat / Jabatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Syahputra (Deck Cadet)"
                  value={newStudentForm.full_name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Email Akun *</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@taruna.id"
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={newStudentForm.phone_number}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Departemen / Bidang</label>
                  <input
                    type="text"
                    placeholder="Contoh: Taruna Nautika / Deck"
                    value={newStudentForm.job_title}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, job_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Level CEFR Awal</label>
                  <select
                    value={newStudentForm.level_code}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, level_code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:bg-white focus:border-[#0284C7] outline-none cursor-pointer"
                  >
                    <option value="A1">Level A1 (Beginner)</option>
                    <option value="A2">Level A2 (Elementary)</option>
                    <option value="B1">Level B1 (Intermediate)</option>
                    <option value="B1+">Level B1+ (High Intermediate)</option>
                    <option value="B2">Level B2 (Upper Intermediate)</option>
                    <option value="C1">Level C1 (Advanced)</option>
                    <option value="C2">Level C2 (Mastery)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Catatan / Bio Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Catatan pendidikan maritim atau instansi pelatihan..."
                  value={newStudentForm.about}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, about: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addingStudent}
                  className="px-5 py-2 rounded-full text-xs font-bold text-white bg-black hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
                >
                  {addingStudent ? 'Menyimpan...' : 'Daftarkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
