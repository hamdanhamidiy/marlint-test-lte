'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/supabase/types';
import { getLevelBadge } from '@/lib/utils';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadStudents() {
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
    }

    loadStudents();
  }, []);

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
            Daftar seluruh pengguna aktif, level CEFR yang telah diraih, dan akumulasi poin.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, jabatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>
      </div>

      {/* Students List */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Memuat data siswa...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Tidak ada data siswa yang cocok.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((st) => {
            const badge = getLevelBadge(st.level_code || 'A1');

            return (
              <div
                key={st.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {st.full_name?.charAt(0)?.toUpperCase() || 'S'}
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
