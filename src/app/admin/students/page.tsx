'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
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
  Briefcase,
  Globe,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/supabase/types';
import { getLevelBadge, formatDateIndo } from '@/lib/utils';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Student Detail / Access Modal
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [studentAttempts, setStudentAttempts] = useState<any[]>([]);
  const [studentEntitlements, setStudentEntitlements] = useState<number[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingAccess, setUpdatingAccess] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setStudents(data as UserProfile[]);
      }
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

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

      // Load entitlements
      const { data: ents } = await supabase
        .from('user_entitlements')
        .select('test_number')
        .eq('user_id', st.id);

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
          .from('user_entitlements')
          .delete()
          .eq('user_id', selectedStudent.id)
          .eq('test_number', testNumber);

        setStudentEntitlements((prev) => prev.filter((t) => t !== testNumber));
      } else {
        // Grant access
        await supabase
          .from('user_entitlements')
          .insert([
            {
              user_id: selectedStudent.id,
              test_number: testNumber,
              granted_by_token: 'ADMIN_MANUAL_GRANT',
              created_at: new Date().toISOString(),
            },
          ]);

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

  const filteredStudents = students.filter((s) =>
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
    (s.job_title && s.job_title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Direktori Pelaut Terdaftar</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
            Data Siswa & Pelaut
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Kelola direktori siswa, akses hak ujian, dan tinjau riwayat evaluasi kompetensi.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, jabatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>
      </div>

      {/* Students List */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Memuat data siswa dari database...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Tidak ada data siswa yang cocok dengan pencarian.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((st) => {
            const badge = getLevelBadge(st.level_code || 'A1');

            return (
              <div
                key={st.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                    {st.photo_url ? (
                      <img src={st.photo_url} alt={st.full_name} className="w-full h-full object-cover" />
                    ) : (
                      st.full_name?.charAt(0)?.toUpperCase() || 'S'
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-sm font-bold text-slate-900">
                        {st.full_name || 'Tanpa Nama'}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700 font-bold">
                        {st.role}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      {st.email} • {st.job_title || 'Seafarer'} • {st.nationality || 'Indonesia'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${badge.badgeBg} ${badge.badgeText} border ${badge.badgeBorder}`}>
                    Level {st.level_code || 'A1'}
                  </span>

                  <span className="font-mono text-xs font-black text-amber-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {st.total_points || 0} XP
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenStudentDetail(st)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Kelola Akses
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Detail & Entitlements Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  Student Management
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  {selectedStudent.full_name || 'Detail Siswa'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Email</span>
                <span className="font-bold text-slate-800 truncate block">{selectedStudent.email || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Jabatan</span>
                <span className="font-bold text-slate-800">{selectedStudent.job_title || 'Pelaut'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Level CEFR</span>
                <span className="font-bold text-indigo-700">Level {selectedStudent.level_code || 'A1'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Akumulasi XP</span>
                <span className="font-bold text-amber-600">{selectedStudent.total_points || 0} XP</span>
              </div>
            </div>

            {/* Test Entitlements Management (Grant/Revoke Access) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-purple-600" />
                  <span>Hak Akses Paket Ujian Marlins</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">Klik untuk buka/kunci akses</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const isFree = num === 1;
                  const hasAccess = isFree || studentEntitlements.includes(num);

                  return (
                    <div
                      key={num}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        hasAccess
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold block">Marlins Test #{num}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {isFree ? 'Gratis Standard' : hasAccess ? 'Akses Manual Aktif' : 'Terkunci'}
                        </span>
                      </div>

                      {isFree ? (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Default Terbuka
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={updatingAccess}
                          onClick={() => handleToggleTestAccess(num)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            hasAccess
                              ? 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          {hasAccess ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          <span>{hasAccess ? 'Kunci Akses' : 'Buka Akses'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Attempts History */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
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
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {att.marlint_tests?.test_name || `Marlins Test #${att.test_number}`}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Skor: <strong className="text-emerald-700">{att.score ?? '-'}%</strong> • Status: {att.status} • {formatDateIndo(att.created_at)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleResetAttempts(att.test_number)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 transition-all cursor-pointer"
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
    </div>
  );
}
