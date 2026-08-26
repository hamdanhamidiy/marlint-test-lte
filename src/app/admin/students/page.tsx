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
  Edit2,
  Trash2,
  Save,
  Check,
  CheckCheck,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  TrendingUp,
  BarChart3,
  Flame,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { UserProfile, UserRole, StudentResult } from '@/lib/supabase/types';
import { getLevelBadge, formatDateIndo, formatDuration } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';

const MARLINS_10_TESTS = [
  { number: 1, name: 'Marlins Test #1', subtitle: 'Basic Maritime English - Foundation Level', isFree: true },
  { number: 2, name: 'Marlins Test #2', subtitle: 'Elementary Maritime Communication', isFree: false },
  { number: 3, name: 'Marlins Test #3', subtitle: 'Pre-Intermediate Maritime English', isFree: false },
  { number: 4, name: 'Marlins Test #4', subtitle: 'Intermediate Maritime English', isFree: false },
  { number: 5, name: 'Marlins Test #5', subtitle: 'Upper-Intermediate Operational English', isFree: false },
  { number: 6, name: 'Marlins Test #6', subtitle: 'Advanced Maritime English & Safety', isFree: false },
  { number: 7, name: 'Marlins Test #7', subtitle: 'Communication & Cargo Operations', isFree: false },
  { number: 8, name: 'Marlins Test #8', subtitle: 'Technical English & Engine Operations', isFree: false },
  { number: 9, name: 'Marlins Test #9', subtitle: 'Emergency & Distress Protocols (SMCP)', isFree: false },
  { number: 10, name: 'Marlins Test #10', subtitle: 'Master & Chief Engineer Proficiency', isFree: false },
];

const MARLINT_TEST_UUIDS: Record<number, string> = {
  1: 'c943bc21-c159-4c8f-9af0-2f8be1582b0f',
  2: '77e831cf-a3d0-4306-bb32-49dddf130248',
  3: 'b25d1278-a95a-4719-afa1-831d06a7eb3e',
  4: 'c1991eb1-d47a-4be1-aeb3-b71e2b9d068a',
  5: '1edeb04e-3d22-4194-b517-336b9ee75158',
  6: '7e7d4ff8-c051-4bed-9662-8ea02c2c37a3',
  7: '518759f3-3a81-47bd-afaf-168a2c3aab90',
  8: 'c09f9dbb-df21-4e1d-af01-d806c25e0521',
  9: '62854365-907b-43ad-a3dc-6c19debc0cf6',
  10: '9e18e110-47bc-4a47-aab3-1eb52a8b635d',
};

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
    job_title: 'F&B Service / Restaurant Waiter - Cruise Ship',
    date_of_birth: '1998-08-14',
    nationality: 'Indonesia',
    about: 'Siswa sekolah perhotelan & kapal pesiar LTE Cruise Training Center spesialis F&B Service dan pelayanan tamu internasional.',
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
    job_title: 'Housekeeping / Cabin Steward',
    date_of_birth: null,
    nationality: 'Indonesia',
    about: 'Siswa perhotelan kapal pesiar divisi Housekeeping & Cabin Attendant.',
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
    job_title: 'Guest Relations & Front Office Staff',
    date_of_birth: null,
    nationality: 'Indonesia',
    about: 'Siswa perhotelan kapal pesiar bidang Front Office & Guest Service.',
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
    job_title: 'Bar & Beverage Staff / Bartender',
    date_of_birth: null,
    nationality: 'Indonesia',
    about: 'Siswa perhotelan spesialisasi bar & beverage service kapal pesiar.',
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
    total_points: 120,
    phone_number: null,
    photo_url: null,
    job_title: 'Culinary / Galley Cook',
    date_of_birth: null,
    nationality: 'Indonesia',
    about: 'Siswa jurusan Tata Boga & Culinary untuk dapur kapal pesiar internasional.',
    placement_test_taken: true,
    placement_test_date: '2026-02-12T00:00:00.000Z',
    created_at: '2026-02-12T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
];

export default function AdminStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<'all' | 'fb' | 'housekeeping' | 'culinary' | 'frontoffice'>('all');

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    job_title: 'F&B Service / Waiter',
    level_code: 'A2',
    nationality: 'Indonesia',
    about: '',
  });
  const [addingStudent, setAddingStudent] = useState(false);

  // Edit Student Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    job_title: '',
    level_code: 'A1',
    total_points: 0,
    nationality: 'Indonesia',
    about: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Student Detail / Access / Scores Modal
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [modalTab, setModalTab] = useState<'access' | 'scores'>('access');
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [studentEntitlements, setStudentEntitlements] = useState<number[]>([1]);
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
        data.forEach((s: any) => {
          if (s.email && s.role !== 'instructor' && s.role !== 'super_admin' && s.role !== 'admin') {
            map.set(s.email.toLowerCase(), s as UserProfile);
          }
        });
      } else {
        DEFAULT_STUDENTS.forEach((s) => {
          if (s.email) map.set(s.email.toLowerCase(), s);
        });
      }

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

    const channel = supabase
      .channel('admin_students_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => {
          loadStudents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.full_name.trim() || !newStudentForm.email.trim()) {
      alert('Nama lengkap dan email wajib diisi.');
      return;
    }

    try {
      setAddingStudent(true);
      const newId = `user-${Date.now()}`;
      const newStudent: UserProfile = {
        id: newId,
        email: newStudentForm.email.trim().toLowerCase(),
        full_name: newStudentForm.full_name.trim(),
        role: 'student',
        status: 'active',
        level: newStudentForm.level_code,
        level_code: newStudentForm.level_code,
        total_points: 100,
        phone_number: newStudentForm.phone_number.trim() || null,
        photo_url: null,
        job_title: newStudentForm.job_title.trim() || 'F&B Service / Waiter',
        date_of_birth: null,
        nationality: newStudentForm.nationality.trim() || 'Indonesia',
        about: newStudentForm.about.trim() || null,
        placement_test_taken: true,
        placement_test_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('marlins_students_list');
        const list: UserProfile[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem('marlins_students_list', JSON.stringify([newStudent, ...list]));
      }

      const newEmail = (newStudent.email || '').toLowerCase();
      setStudents((prev) => [
        newStudent,
        ...prev.filter((s) => (s.email?.toLowerCase() || '') !== newEmail),
      ]);

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
        job_title: 'F&B Service / Waiter',
        level_code: 'A2',
        nationality: 'Indonesia',
        about: '',
      });
      alert(`Siswa ${newStudent.full_name} berhasil didaftarkan ke direktori!`);
    } catch (err: any) {
      alert('Gagal menambah siswa: ' + err.message);
    } finally {
      setAddingStudent(false);
    }
  };

  const handleOpenEditModal = (st: UserProfile) => {
    setEditingStudent(st);
    setEditForm({
      full_name: st.full_name || '',
      email: st.email || '',
      phone_number: st.phone_number || '',
      job_title: st.job_title || 'F&B Service / Waiter',
      level_code: st.level_code || 'A1',
      total_points: st.total_points || 0,
      nationality: st.nationality || 'Indonesia',
      about: st.about || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      setSavingEdit(true);
      const studentEmail = (editingStudent.email || '').toLowerCase();

      const updatedStudent: UserProfile = {
        ...editingStudent,
        full_name: editForm.full_name.trim(),
        phone_number: editForm.phone_number.trim() || null,
        job_title: editForm.job_title.trim() || 'F&B Service / Waiter',
        level: editForm.level_code,
        level_code: editForm.level_code,
        total_points: Number(editForm.total_points) || 0,
        nationality: editForm.nationality.trim() || 'Indonesia',
        about: editForm.about.trim() || null,
        updated_at: new Date().toISOString(),
      };

      setStudents((prev) =>
        prev.map((s) => ((s.email?.toLowerCase() || '') === studentEmail ? updatedStudent : s))
      );

      if (selectedStudent && (selectedStudent.email?.toLowerCase() || '') === studentEmail) {
        setSelectedStudent(updatedStudent);
      }

      try {
        await supabase
          .from('users')
          .update({
            full_name: updatedStudent.full_name,
            phone_number: updatedStudent.phone_number,
            job_title: updatedStudent.job_title,
            level: updatedStudent.level_code,
            level_code: updatedStudent.level_code,
            total_points: updatedStudent.total_points,
            nationality: updatedStudent.nationality,
            about: updatedStudent.about,
            updated_at: updatedStudent.updated_at,
          })
          .or(`id.eq.${editingStudent.id},email.eq.${editingStudent.email}`);
      } catch (dbErr) {
        console.warn('Supabase update student note:', dbErr);
      }

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('marlins_students_list');
        if (stored) {
          try {
            const list: UserProfile[] = JSON.parse(stored);
            const updatedList = list.map((s) => ((s.email?.toLowerCase() || '') === studentEmail ? updatedStudent : s));
            localStorage.setItem('marlins_students_list', JSON.stringify(updatedList));
          } catch (e) {}
        }
      }

      setIsEditModalOpen(false);
      setEditingStudent(null);
      alert(`Data siswa ${updatedStudent.full_name} berhasil diperbarui!`);
    } catch (err: any) {
      alert('Gagal menyimpan perubahan: ' + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteStudent = async (st: UserProfile) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data siswa "${st.full_name}" (${st.email || '-'})?\nSeluruh data dan riwayat nilai siswa ini akan dihapus.`)) {
      return;
    }

    try {
      const targetEmail = (st.email || '').toLowerCase();

      setStudents((prev) => prev.filter((s) => (s.email?.toLowerCase() || '') !== targetEmail));

      if (selectedStudent && (selectedStudent.email?.toLowerCase() || '') === targetEmail) {
        setSelectedStudent(null);
      }

      try {
        if (st.id) {
          await supabase.from('test_entitlements').delete().or(`user_id.eq.${st.id},user_id.eq.${st.email}`);
          await supabase.from('student_results').delete().or(`student_id.eq.${st.id},student_id.eq.${st.email}`);
        }
        await supabase.from('users').delete().or(`id.eq.${st.id},email.eq.${st.email}`);
      } catch (dbErr) {
        console.warn('Supabase delete student note:', dbErr);
      }

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('marlins_students_list');
        if (stored) {
          try {
            const list: UserProfile[] = JSON.parse(stored);
            const filtered = list.filter((s) => (s.email?.toLowerCase() || '') !== targetEmail);
            localStorage.setItem('marlins_students_list', JSON.stringify(filtered));
          } catch (e) {}
        }
      }

      alert(`Siswa ${st.full_name} berhasil dihapus.`);
    } catch (err: any) {
      alert('Gagal menghapus siswa: ' + err.message);
    }
  };

  const handleOpenStudentDetail = async (st: UserProfile, defaultTab: 'access' | 'scores' = 'access') => {
    setSelectedStudent(st);
    setModalTab(defaultTab);
    try {
      setLoadingDetails(true);

      const isValidUuid = (str?: string | null): boolean =>
        !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

      let studentRecord = st;
      let targetUuid: string | null = isValidUuid(st.id) ? st.id : null;

      try {
        let uQuery = supabase.from('users').select('*');
        if (isValidUuid(st.id) && st.email) {
          uQuery = uQuery.or(`id.eq.${st.id},email.eq.${st.email}`);
        } else if (st.email) {
          uQuery = uQuery.eq('email', st.email);
        } else if (isValidUuid(st.id)) {
          uQuery = uQuery.eq('id', st.id);
        }

        const { data: freshUser } = await uQuery.maybeSingle();
        if (freshUser) {
          studentRecord = { ...st, ...freshUser };
          if (isValidUuid(freshUser.id)) targetUuid = freshUser.id;
          setSelectedStudent(studentRecord);
        }
      } catch (e) {}

      // 1. Load results from Supabase student_results using valid UUID ONLY
      let resultsList: StudentResult[] = [];
      if (targetUuid) {
        try {
          const { data: resultsData } = await supabase
            .from('student_results')
            .select('*')
            .eq('student_id', targetUuid)
            .order('created_at', { ascending: false });

          if (resultsData && resultsData.length > 0) {
            resultsList = resultsData as StudentResult[];
          }
        } catch (err) {
          console.warn('Load student results error:', err);
        }
      }

      // Results strictly from Supabase
      resultsList.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      setStudentResults(resultsList);

      // 2. Load entitlements from Supabase
      const entSet = new Set<number>([1]); // Test 1 free by default

      // A. Check database department_track JSON
      if (studentRecord.department_track && studentRecord.department_track.startsWith('[')) {
        try {
          const parsed = JSON.parse(studentRecord.department_track);
          if (Array.isArray(parsed)) parsed.forEach((num) => entSet.add(Number(num)));
        } catch (e) {}
      }

      // B. Check test_entitlements table
      try {
        const { data: ents } = await supabase
          .from('test_entitlements')
          .select('test_number, is_active')
          .or(`user_id.eq.${studentRecord.id},user_id.eq.${studentRecord.email}`)
          .eq('is_active', true);

        if (ents && ents.length > 0) {
          ents.forEach((e) => entSet.add(e.test_number));
        }
      } catch (e) {}

      // C. Check localStorage entitlements
      if (typeof window !== 'undefined') {
        const keys = [`marlins_entitlements_${studentRecord.id}`, `marlins_entitlements_${studentRecord.email?.toLowerCase()}`];
        keys.forEach((k) => {
          const val = localStorage.getItem(k);
          if (val) {
            try {
              const arr = JSON.parse(val);
              if (Array.isArray(arr)) arr.forEach((num) => entSet.add(Number(num)));
            } catch (e) {}
          }
        });
      }

      setStudentEntitlements(Array.from(entSet));
    } catch (err) {
      console.error('Error loading student details:', err);
      setStudentEntitlements([1]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleTestAccess = async (testNumber: number) => {
    if (!selectedStudent) return;

    try {
      setUpdatingAccess(true);
      const hasAccess = studentEntitlements.includes(testNumber);
      const marlintTestId = MARLINT_TEST_UUIDS[testNumber] || 'c943bc21-c159-4c8f-9af0-2f8be1582b0f';

      let nextEnts: number[] = [];
      if (hasAccess) {
        // Revoke access
        nextEnts = studentEntitlements.filter((t) => t !== testNumber);
        try {
          await supabase
            .from('test_entitlements')
            .delete()
            .or(`user_id.eq.${selectedStudent.id},user_id.eq.${selectedStudent.email}`)
            .eq('test_number', testNumber);
        } catch (e) {}
      } else {
        // Grant access
        nextEnts = Array.from(new Set([...studentEntitlements, testNumber]));
        try {
          await supabase.from('test_entitlements').insert([
            {
              user_id: selectedStudent.id,
              marlint_test_id: marlintTestId,
              test_number: testNumber,
              source: 'super_admin_grant',
              is_active: true,
              granted_at: new Date().toISOString(),
            },
          ]);
        } catch (e) {}
      }

      // Synchronize directly to users.department_track in Supabase
      try {
        await supabase
          .from('users')
          .update({ department_track: JSON.stringify(nextEnts) })
          .or(`id.eq.${selectedStudent.id},email.eq.${selectedStudent.email}`);
      } catch (e) {}

      setStudentEntitlements(nextEnts);

      // Update state in memory
      const updatedStudent = {
        ...selectedStudent,
        department_track: JSON.stringify(nextEnts),
      };
      setSelectedStudent(updatedStudent);

      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id || s.email?.toLowerCase() === selectedStudent.email?.toLowerCase()
            ? { ...s, department_track: JSON.stringify(nextEnts) }
            : s
        )
      );

      // Save to local storage for cross-session fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem(`marlins_entitlements_${selectedStudent.id}`, JSON.stringify(nextEnts));
        if (selectedStudent.email) {
          localStorage.setItem(`marlins_entitlements_${selectedStudent.email.toLowerCase()}`, JSON.stringify(nextEnts));
        }
      }
    } catch (err: any) {
      alert('Gagal memperbarui akses: ' + err.message);
    } finally {
      setUpdatingAccess(false);
    }
  };

  const handleGrantAllAccess = async () => {
    if (!selectedStudent) return;
    try {
      setUpdatingAccess(true);
      const allNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      setStudentEntitlements(allNums);

      // 1. Update Supabase users table
      try {
        await supabase
          .from('users')
          .update({ department_track: JSON.stringify(allNums) })
          .or(`id.eq.${selectedStudent.id},email.eq.${selectedStudent.email}`);
      } catch (e) {}

      // 2. Insert into test_entitlements
      try {
        const records = allNums.map((num) => ({
          user_id: selectedStudent.id,
          marlint_test_id: MARLINT_TEST_UUIDS[num],
          test_number: num,
          source: 'super_admin_grant_all',
          is_active: true,
          granted_at: new Date().toISOString(),
        }));
        await supabase.from('test_entitlements').insert(records);
      } catch (e) {}

      const updatedStudent = {
        ...selectedStudent,
        department_track: JSON.stringify(allNums),
      };
      setSelectedStudent(updatedStudent);

      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id || s.email?.toLowerCase() === selectedStudent.email?.toLowerCase()
            ? { ...s, department_track: JSON.stringify(allNums) }
            : s
        )
      );

      if (typeof window !== 'undefined') {
        localStorage.setItem(`marlins_entitlements_${selectedStudent.id}`, JSON.stringify(allNums));
        if (selectedStudent.email) {
          localStorage.setItem(`marlins_entitlements_${selectedStudent.email.toLowerCase()}`, JSON.stringify(allNums));
        }
      }
    } catch (err: any) {
      setStudentEntitlements([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    } finally {
      setUpdatingAccess(false);
    }
  };

  const handleRevokeAllAccess = async () => {
    if (!selectedStudent) return;
    try {
      setUpdatingAccess(true);
      setStudentEntitlements([1]);

      // 1. Update Supabase users table
      try {
        await supabase
          .from('users')
          .update({ department_track: JSON.stringify([1]) })
          .or(`id.eq.${selectedStudent.id},email.eq.${selectedStudent.email}`);
      } catch (e) {}

      // 2. Delete from test_entitlements
      try {
        await supabase
          .from('test_entitlements')
          .delete()
          .or(`user_id.eq.${selectedStudent.id},user_id.eq.${selectedStudent.email}`)
          .neq('test_number', 1);
      } catch (e) {}

      const updatedStudent = {
        ...selectedStudent,
        department_track: JSON.stringify([1]),
      };
      setSelectedStudent(updatedStudent);

      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id || s.email?.toLowerCase() === selectedStudent.email?.toLowerCase()
            ? { ...s, department_track: JSON.stringify([1]) }
            : s
        )
      );

      if (typeof window !== 'undefined') {
        localStorage.setItem(`marlins_entitlements_${selectedStudent.id}`, JSON.stringify([1]));
        if (selectedStudent.email) {
          localStorage.setItem(`marlins_entitlements_${selectedStudent.email.toLowerCase()}`, JSON.stringify([1]));
        }
      }
    } catch (err: any) {
      setStudentEntitlements([1]);
    } finally {
      setUpdatingAccess(false);
    }
  };

  const handleDeleteStudentResult = async (resultId: string) => {
    if (!confirm('Hapus rekaman sesi ujian ini? Sesi yang dihapus tidak dapat dipulihkan.')) return;
    try {
      setUpdatingAccess(true);

      // Find the result being deleted to get attempt_id for cache cleanup
      const deletedResult = studentResults.find((r) => r.id === resultId);
      const attemptId = deletedResult?.attempt_id || resultId;

      // 1. Delete related certificates first (foreign key: result_id)
      try {
        await supabase.from('certificates').delete().eq('result_id', resultId);
      } catch (certErr) {
        console.warn('Certificate cleanup note:', certErr);
      }

      // 2. Delete the student result from Supabase
      const { error } = await supabase.from('student_results').delete().eq('id', resultId);
      if (error) {
        // Also try deleting by attempt_id in case id doesn't match
        const { error: error2 } = await supabase.from('student_results').delete().eq('attempt_id', attemptId);
        if (error2) {
          throw new Error(error.message || error2.message);
        }
      }

      // 3. Update local UI state
      setStudentResults((prev) => prev.filter((r) => r.id !== resultId && r.attempt_id !== resultId && r.attempt_id !== attemptId));

      // 4. Clean ALL localStorage caches that might contain this result
      if (typeof window !== 'undefined') {
        // Remove individual result keys
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          if (
            key === `marlins_result_${attemptId}` ||
            key === `test_result_${attemptId}` ||
            key === `marlins_result_${resultId}` ||
            key === `test_result_${resultId}`
          ) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));

        // Clean history array caches for this student
        const studentId = deletedResult?.student_id || selectedStudent?.id;
        const studentEmail = selectedStudent?.email;
        const historyKeys = [
          `marlins_history_results_${studentId}`,
          `marlins_history_results_${studentEmail}`,
        ];
        historyKeys.forEach((hk) => {
          const str = localStorage.getItem(hk);
          if (str) {
            try {
              const arr = JSON.parse(str);
              if (Array.isArray(arr)) {
                const filtered = arr.filter(
                  (item: any) =>
                    item.id !== resultId &&
                    item.attempt_id !== resultId &&
                    item.id !== attemptId &&
                    item.attempt_id !== attemptId
                );
                localStorage.setItem(hk, JSON.stringify(filtered));
              }
            } catch (e) {}
          }
        });

        // Track deleted IDs so student-side never re-syncs them
        try {
          const deletedIdsKey = 'marlins_deleted_result_ids';
          const existing = JSON.parse(localStorage.getItem(deletedIdsKey) || '[]');
          const updated = Array.from(new Set([...existing, resultId, attemptId]));
          localStorage.setItem(deletedIdsKey, JSON.stringify(updated));
        } catch (e) {}
      }

      alert('Rekaman sesi ujian berhasil dihapus.');
    } catch (err: any) {
      alert('Gagal menghapus hasil ujian: ' + (err?.message || err));
    } finally {
      setUpdatingAccess(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (s.role === 'instructor' || s.role === 'super_admin' || s.role === 'admin') return false;

    if (deptFilter === 'fb') {
      const match = (s.job_title + ' ' + (s.about || '')).toLowerCase();
      if (!match.includes('f&b') && !match.includes('waiter') && !match.includes('bar') && !match.includes('beverage') && !match.includes('restaurant') && !match.includes('sommelier') && !match.includes('dining')) {
        return false;
      }
    } else if (deptFilter === 'housekeeping') {
      const match = (s.job_title + ' ' + (s.about || '')).toLowerCase();
      if (!match.includes('housekeeping') && !match.includes('cabin') && !match.includes('steward') && !match.includes('cleaner') && !match.includes('laundry')) {
        return false;
      }
    } else if (deptFilter === 'culinary') {
      const match = (s.job_title + ' ' + (s.about || '')).toLowerCase();
      if (!match.includes('culinary') && !match.includes('cook') && !match.includes('chef') && !match.includes('kitchen') && !match.includes('galley') && !match.includes('baker') && !match.includes('pastry')) {
        return false;
      }
    } else if (deptFilter === 'frontoffice') {
      const match = (s.job_title + ' ' + (s.about || '')).toLowerCase();
      if (!match.includes('front') && !match.includes('office') && !match.includes('guest') && !match.includes('reception') && !match.includes('concierge')) {
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
    <div className="space-y-6 sm:space-y-7 min-w-0 font-sans pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
            <span className="font-bold text-slate-900">Direktori Siswa LTE Cruise</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">Sekolah Perhotelan & Kapal Pesiar</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Data Siswa & Manajemen Nilai
          </h1>

          <p className="text-xs sm:text-[14px] text-slate-500 font-normal max-w-2xl leading-relaxed">
            Total <strong className="text-slate-900 font-bold">{filteredStudents.length}</strong> siswa terdaftar. Kelola akses ujian Marlins (Test 1–10), pantau rekapitulasi nilai ujian, edit biodata, atau hapus akun siswa.
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

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama siswa, email, departemen, atau kebangsaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-2xs font-normal"
          />
        </div>

        {/* Clean Modern Filter Pills (No ugly scrollbar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setDeptFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              deptFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Semua Siswa ({students.length})
          </button>
          <button
            type="button"
            onClick={() => setDeptFilter('fb')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              deptFilter === 'fb'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            F&B Service & Bar
          </button>
          <button
            type="button"
            onClick={() => setDeptFilter('housekeeping')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              deptFilter === 'housekeeping'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Housekeeping & Laundry
          </button>
          <button
            type="button"
            onClick={() => setDeptFilter('culinary')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              deptFilter === 'culinary'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Culinary & Galley
          </button>
          <button
            type="button"
            onClick={() => setDeptFilter('frontoffice')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              deptFilter === 'frontoffice'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Front Office & Guest Service
          </button>
        </div>
      </div>

      {/* Student List */}
      {loading ? (
        <div className="bg-white p-12 text-center rounded-[28px] border border-slate-200/90 space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-black flex items-center justify-center mx-auto animate-pulse">
            <Users className="w-4 h-4" />
          </div>
          <p className="font-bold text-slate-800 text-xs">Memuat direktori siswa...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-[28px] border border-slate-200/90 space-y-3 shadow-2xs">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-900 text-sm">Tidak ada siswa ditemukan</p>
          <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau filter departemen.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((st) => {
            const initial = (st.full_name || 'S').charAt(0).toUpperCase();

            return (
              <div
                key={st.id || st.email}
                className="bg-white p-4 sm:p-5 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-black transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                {/* Student Info */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {st.photo_url ? (
                    <img
                      src={st.photo_url}
                      alt={st.full_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-heading font-black text-base shrink-0 shadow-2xs">
                      {initial}
                    </div>
                  )}

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-extrabold text-slate-950 text-sm sm:text-base group-hover:text-black transition-colors truncate">
                        {st.full_name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-extrabold text-[9px] uppercase tracking-wider border border-slate-200">
                        Siswa LTE Cruise
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap font-medium">
                      <span>{st.email || '-'}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-slate-700">{st.job_title || 'F&B Service / Waiter'}</span>
                      {st.phone_number && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>{st.phone_number}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badges & Actions */}
                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 pt-3 lg:pt-0 border-t lg:border-0 border-slate-100">
                  {/* Badges */}
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-900 font-extrabold text-[10px] border border-slate-200/90">
                      Level {st.level_code || 'A1'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-extrabold text-[10px] border border-amber-200/80 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{st.total_points || 0} XP</span>
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Riwayat Nilai Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenStudentDetail(st, 'scores')}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200/90 text-slate-900 font-bold text-xs transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-slate-700" />
                      <span>Riwayat Nilai</span>
                    </button>

                    {/* Kelola Akses Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenStudentDetail(st, 'access')}
                      className="px-3.5 py-1.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kelola Akses (1–10)</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(st)}
                      title="Edit Biodata Siswa"
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteStudent(st)}
                      title="Hapus Siswa"
                      className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Detail Modal: Access & Score Management */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-2xl w-full p-5 sm:p-7 rounded-[32px] border border-slate-200/90 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                {selectedStudent.photo_url ? (
                  <img
                    src={selectedStudent.photo_url}
                    alt={selectedStudent.full_name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-black text-base shrink-0">
                    {(selectedStudent.full_name || 'S').charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-950 truncate">
                    {selectedStudent.full_name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    {selectedStudent.email} • {selectedStudent.job_title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditModal(selectedStudent);
                  }}
                  className="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Biodata</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tab Switcher */}
            <div className="flex items-center gap-1 bg-[#F1F3F5] p-1 rounded-full text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setModalTab('access')}
                className={`flex-1 py-2 rounded-full transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === 'access' ? 'bg-black text-white shadow-xs' : 'hover:text-black'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Hak Akses Ujian (1–10)</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('scores')}
                className={`flex-1 py-2 rounded-full transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === 'scores' ? 'bg-black text-white shadow-xs' : 'hover:text-black'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Riwayat Nilai ({studentResults.length})</span>
              </button>
            </div>

            {/* Tab 1: Access Control */}
            {modalTab === 'access' && (
              <div className="space-y-4">
                {/* Action Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                  <div>
                    <h4 className="font-heading font-extrabold text-slate-950 text-sm">
                      Hak Akses Paket Ujian Marlins (1–10)
                    </h4>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Buka atau kunci hak akses simulasi ujian perhotelan kapal pesiar untuk siswa ini.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGrantAllAccess}
                      disabled={updatingAccess}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Buka Semua (1–10)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRevokeAllAccess}
                      disabled={updatingAccess}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Kunci Berbayar</span>
                    </button>
                  </div>
                </div>

                {/* 10 Test Packages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MARLINS_10_TESTS.map((t) => {
                    const isUnlocked = studentEntitlements.includes(t.number) || t.isFree;

                    return (
                      <div
                        key={t.number}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isUnlocked
                            ? 'bg-emerald-50/40 border-emerald-200/90'
                            : 'bg-slate-50/60 border-slate-200'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading font-extrabold text-xs text-slate-950">
                              {t.name}
                            </span>
                            {t.isFree ? (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                                Gratis
                              </span>
                            ) : null}
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">{t.subtitle}</p>
                        </div>

                        {t.isFree ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[11px] shrink-0">
                            Terbuka
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleTestAccess(t.number)}
                            disabled={updatingAccess}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                              isUnlocked
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-black text-white hover:bg-neutral-800 shadow-2xs'
                            }`}
                          >
                            {isUnlocked ? (
                              <>
                                <Unlock className="w-3 h-3" />
                                <span>Terbuka</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-amber-400" />
                                <span>Buka Akses</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Scores & Results History */}
            {modalTab === 'scores' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-heading font-extrabold text-slate-950 text-sm">
                    Rekapitulasi Nilai & Sesi Ujian Siswa
                  </h4>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Daftar seluruh simulasi ujian yang telah diselesaikan oleh {selectedStudent.full_name}.
                  </p>
                </div>

                {loadingDetails ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                    Memuat riwayat nilai...
                  </div>
                ) : studentResults.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-800 text-xs">Belum ada riwayat ujian tercatat.</p>
                    <p className="text-[11px] text-slate-400">
                      Siswa ini belum menyelesaikan simulasi ujian Marlins.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {studentResults.map((res) => (
                      <div
                        key={res.id || res.attempt_id}
                        className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-black transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs shrink-0 border shadow-2xs ${
                              res.is_passed ? 'bg-white border-emerald-200' : 'bg-white border-rose-200'
                            }`}
                          >
                            <span className={`font-heading text-sm font-black leading-none ${
                              res.is_passed ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                              {res.score}%
                            </span>
                            <span className={`text-[8px] font-extrabold uppercase mt-0.5 px-1 py-0.2 rounded text-white ${
                              res.is_passed ? 'bg-emerald-600' : 'bg-rose-500'
                            }`}>
                              {res.is_passed ? 'LULUS' : 'REMED'}
                            </span>
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-heading font-extrabold text-xs sm:text-sm text-slate-950 truncate">
                                {res.test_name || `Marlins Test #${res.marlint_test_number || 1}`}
                              </span>
                              <span className={`px-2 py-0.2 rounded text-[9px] font-bold ${
                                res.is_passed ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                              }`}>
                                {res.is_passed ? 'Lulus' : 'Remedial'}
                              </span>
                              <span className="px-2 py-0.2 rounded bg-slate-100 text-slate-800 text-[9px] font-bold">
                                Level {res.level || 'A1'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                              <span>{formatDateIndo(res.created_at)}</span>
                              <span>•</span>
                              <span>Benar: <strong className="text-slate-900">{res.correct_answers}/{res.total_questions}</strong></span>
                              <span>•</span>
                              <span>{formatDuration(res.time_spent_seconds || 1800)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <Link
                            href={`/student/test/review/${res.attempt_id || res.id}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                          >
                            <BookOpen className="w-3 h-3 text-slate-600" />
                            <span>Review</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteStudentResult(res.id)}
                            className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Reset / Hapus Sesi Ujian"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-7 rounded-[32px] border border-slate-200/90 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#0284C7] uppercase tracking-wider block">
                  Perbarui Informasi Siswa
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-950">Edit Biodata Siswa</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingStudent(null);
                }}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Email Akun</label>
                  <input
                    type="email"
                    disabled
                    value={editForm.email}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs cursor-not-allowed font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    value={editForm.phone_number}
                    onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Departemen & Posisi di Kapal</label>
                  <input
                    type="text"
                    value={editForm.job_title}
                    onChange={(e) => setEditForm({ ...editForm, job_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Level CEFR</label>
                  <select
                    value={editForm.level_code}
                    onChange={(e) => setEditForm({ ...editForm, level_code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:bg-white focus:border-black outline-none cursor-pointer"
                  >
                    <option value="A1">Level A1 (Beginner)</option>
                    <option value="A2">Level A2 (Elementary)</option>
                    <option value="A2+">Level A2+ (Pre-Intermediate)</option>
                    <option value="B1">Level B1 (Intermediate)</option>
                    <option value="B1+">Level B1+ (Upper-Intermediate)</option>
                    <option value="B2">Level B2 (Vantage)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Akumulasi XP</label>
                  <input
                    type="number"
                    value={editForm.total_points}
                    onChange={(e) => setEditForm({ ...editForm, total_points: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Kewarganegaraan</label>
                  <input
                    type="text"
                    value={editForm.nationality}
                    onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Catatan / Minat Bidang Kerja Siswa</label>
                <textarea
                  rows={3}
                  placeholder="Catatan keahlian, minat departemen perhotelan kapal pesiar..."
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none resize-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-full font-bold text-xs text-white bg-black hover:bg-neutral-800 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-7 rounded-[32px] border border-slate-200/90 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#0284C7] uppercase tracking-wider block">
                  Registrasi Siswa Baru LTE Cruise
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
                <label className="font-bold text-slate-800">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Syahputra"
                  value={newStudentForm.full_name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Email Akun *</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@student.lte.id"
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Nomor Telepon / WA</label>
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={newStudentForm.phone_number}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Departemen & Posisi Kerja</label>
                  <input
                    type="text"
                    placeholder="Contoh: F&B Service / Waiter"
                    value={newStudentForm.job_title}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, job_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Level CEFR Awal</label>
                  <select
                    value={newStudentForm.level_code}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, level_code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:bg-white focus:border-black outline-none cursor-pointer"
                  >
                    <option value="A1">Level A1 (Beginner)</option>
                    <option value="A2">Level A2 (Elementary)</option>
                    <option value="A2+">Level A2+ (Pre-Intermediate)</option>
                    <option value="B1">Level B1 (Intermediate)</option>
                    <option value="B1+">Level B1+ (Upper-Intermediate)</option>
                    <option value="B2">Level B2 (Vantage)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Catatan Minat / Pelatihan</label>
                <textarea
                  rows={2}
                  placeholder="Informasi pelatihan di LTE Cruise atau minat kerja perhotelan kapal pesiar..."
                  value={newStudentForm.about}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, about: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-black outline-none resize-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
                  className="px-5 py-2 rounded-full font-bold text-xs text-white bg-black hover:bg-neutral-800 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{addingStudent ? 'Menyimpan...' : 'Simpan Siswa'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
