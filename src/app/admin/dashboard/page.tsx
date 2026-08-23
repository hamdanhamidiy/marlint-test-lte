'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  HelpCircle,
  FileCheck2,
  KeyRound,
  TrendingUp,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDateIndo } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalTests: 0,
    totalAttempts: 0,
    totalCertificates: 0,
  });
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);

        const [
          { count: uCount },
          { count: qCount },
          { count: tCount },
          { count: aCount },
          { count: cCount },
        ] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('questions').select('*', { count: 'exact', head: true }),
          supabase.from('marlint_tests').select('*', { count: 'exact', head: true }),
          supabase.from('test_attempts').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          totalUsers: uCount || 0,
          totalQuestions: qCount || 0,
          totalTests: tCount || 0,
          totalAttempts: aCount || 0,
          totalCertificates: cCount || 0,
        });

        // Load recent attempts
        const { data: attemptsData } = await supabase
          .from('test_attempts')
          .select('*, marlint_tests(test_name)')
          .order('created_at', { ascending: false })
          .limit(6);

        if (attemptsData) {
          setRecentAttempts(attemptsData);
        }
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>Admin Control Center</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
          Ringkasan Sistem Marlins Test
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Monitoring aktivitas ujian maritim, bank soal, registrasi siswa, dan penerbitan sertifikat digital.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Total Siswa</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 block">
            {stats.totalUsers}
          </span>
          <Link
            href="/admin/students"
            className="text-[11px] text-purple-700 hover:text-purple-800 font-bold flex items-center gap-1"
          >
            <span>Lihat Direktori</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Total Questions */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Bank Soal</span>
            <HelpCircle className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 block">
            {stats.totalQuestions}
          </span>
          <Link
            href="/admin/questions"
            className="text-[11px] text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1"
          >
            <span>Kelola Soal</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Total Tests */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Paket Ujian</span>
            <FileCheck2 className="w-4 h-4 text-cyan-600" />
          </div>
          <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 block">
            {stats.totalTests}
          </span>
          <Link
            href="/admin/tests"
            className="text-[11px] text-cyan-700 hover:text-cyan-800 font-bold flex items-center gap-1"
          >
            <span>Konfigurasi Ujian</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Certificates Issued */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Sertifikat Terbit</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <span className="font-mono text-2xl sm:text-3xl font-black text-amber-600 block">
            {stats.totalCertificates}
          </span>
          <p className="text-[11px] text-slate-500 font-medium">Dari {stats.totalAttempts} sesi ujian</p>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Aktivitas Sesi Ujian Terbaru
          </h2>
          <span className="text-xs text-slate-500">Sinkronisasi Realtime</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          {recentAttempts.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">Belum ada aktivitas sesi ujian.</p>
          ) : (
            recentAttempts.map((att) => (
              <div
                key={att.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {att.marlint_tests?.test_name || `Marlins Test #${att.test_number}`}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Mulai: {formatDateIndo(att.started_at)} • Attempt ID: {att.id.substring(0, 8)}...
                  </p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                    att.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {att.status.toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
