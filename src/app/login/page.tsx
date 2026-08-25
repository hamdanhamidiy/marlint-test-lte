'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  UserCheck,
  Shield,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Logo from '@/components/brand/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await signIn(email.trim(), password);
      if (res?.error) {
        setErrorMessage(res.error.message || 'Email atau kata sandi tidak valid.');
      } else {
        const role = res?.profile?.role;
        if (role === 'admin' || role === 'super_admin' || role === 'instructor') {
          router.push('/admin/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'student' | 'instructor' | 'super_admin') => {
    setLoading(true);
    await signInAsDemo(role);
    if (role === 'instructor' || role === 'super_admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/student/dashboard');
    }
  };

  const fillCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Logo size="md" showSubtitle={true} subtitleText="Maritime English Platform" href="/" />

        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-[#5046E5] transition-colors"
        >
          ← Kembali ke Beranda
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
              Masuk ke Portal Marlins
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Akses akun resmi Siswa Pelaut, Instruktur Maritim, atau Super Administrator.
            </p>
          </div>

          {/* Quick Access Account Selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pilih Role Akun Resmi (1-Click):</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl text-xs font-semibold bg-indigo-50/80 text-[#5046E5] border border-indigo-100 hover:bg-indigo-100/80 transition-colors text-center cursor-pointer shadow-2xs"
              >
                <UserCheck className="w-4 h-4 text-[#5046E5]" />
                <span>Siswa Pelaut</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('instructor')}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors text-center cursor-pointer shadow-2xs"
              >
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Instruktur</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('super_admin')}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors text-center cursor-pointer shadow-2xs"
              >
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Super Admin</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">atau login manual</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Alamat Email:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="siswa@marlinstest.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">Kata Sandi:</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Password123!"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Preset Credentials Hint Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Kredensial Akun Resmi:</p>
            <div className="space-y-1.5 text-xs">
              <div
                onClick={() => fillCredentials('siswa@marlinstest.com', 'Password123!')}
                className="cursor-pointer hover:text-[#5046E5] p-1.5 rounded-lg hover:bg-indigo-50 transition-colors flex justify-between items-center"
              >
                <span>👨‍✈️ <strong>Siswa:</strong> siswa@marlinstest.com</span>
                <span className="font-mono text-slate-400 text-[11px]">Password123!</span>
              </div>
              <div
                onClick={() => fillCredentials('instruktur@marlinstest.com', 'Password123!')}
                className="cursor-pointer hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50 transition-colors flex justify-between items-center"
              >
                <span>👨‍🏫 <strong>Instruktur:</strong> instruktur@marlinstest.com</span>
                <span className="font-mono text-slate-400 text-[11px]">Password123!</span>
              </div>
              <div
                onClick={() => fillCredentials('superadmin@marlinstest.com', 'Password123!')}
                className="cursor-pointer hover:text-purple-700 p-1.5 rounded-lg hover:bg-purple-50 transition-colors flex justify-between items-center"
              >
                <span>⚡ <strong>Super Admin:</strong> superadmin@marlinstest.com</span>
                <span className="font-mono text-slate-400 text-[11px]">Password123!</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            Belum memiliki akun pelaut?{' '}
            <Link href="/register" className="font-bold text-[#5046E5] hover:underline">
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-slate-400">
        Standard IMO SMCP Maritime English Testing Platform • Multi-Role RBAC System
      </div>
    </div>
  );
}
