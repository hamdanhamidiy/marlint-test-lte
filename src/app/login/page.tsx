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
        if (res?.profile?.role === 'admin') {
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

  const handleQuickDemo = async (role: 'student' | 'admin') => {
    setLoading(true);
    await signInAsDemo(role);
    if (role === 'admin') {
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
    <div className="min-h-screen bg-[#F0F2F6] text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Logo size="md" showSubtitle={true} subtitleText="Maritime English Platform" href="/" />

        <Link
          href="/"
          className="text-xs font-bold text-slate-500 hover:text-[#5046E5] transition-colors"
        >
          ← Kembali ke Beranda
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-6">
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900">
              Masuk ke Portal Marlins
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Akses akun ujian Bahasa Inggris Maritim dan sertifikat digital Anda
            </p>
          </div>

          {/* Quick Demo 1-Click Login Buttons */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Akses Cepat Demo (1-Click):</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl text-xs font-bold bg-[#EEF0FF] text-[#5046E5] border border-indigo-100 hover:bg-indigo-100 transition-all shadow-2xs"
              >
                <UserCheck className="w-4 h-4" />
                <span>Akun Siswa</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all shadow-2xs"
              >
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Akun Admin</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">atau login manual</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Alamat Email:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="student@marlins.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Kata Sandi:</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="password123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-bold text-xs text-white bg-[#5046E5] hover:bg-[#4338CA] shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Preset Credentials Hint Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Kredensial Default:</p>
            <div className="space-y-1 text-[11px]">
              <div
                onClick={() => fillCredentials('student@marlins.com', 'password123')}
                className="cursor-pointer hover:text-[#5046E5] p-1 rounded-xl hover:bg-indigo-50 transition-colors flex justify-between"
              >
                <span>👨‍✈️ <strong>Siswa:</strong> student@marlins.com</span>
                <span className="font-mono text-slate-400">password123</span>
              </div>
              <div
                onClick={() => fillCredentials('admin@marlins.com', 'password123')}
                className="cursor-pointer hover:text-purple-700 p-1 rounded-xl hover:bg-purple-50 transition-colors flex justify-between"
              >
                <span>🛡️ <strong>Admin:</strong> admin@marlins.com</span>
                <span className="font-mono text-slate-400">password123</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Belum memiliki akun pelaut?{' '}
            <Link href="/register" className="font-bold text-[#5046E5] hover:underline">
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-[11px] text-slate-400 font-medium">
        Standard IMO SMCP Maritime English Testing Platform • Sistem Terintegrasi Supabase
      </div>
    </div>
  );
}
