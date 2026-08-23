'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Briefcase,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Logo from '@/components/brand/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const { error } = await signUp(email.trim(), password, fullName.trim(), jobTitle.trim());
      if (error) {
        setErrorMessage(error.message || 'Gagal mendaftarkan akun.');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
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

      {/* Main Register Card */}
      <div className="max-w-md w-full mx-auto my-6">
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900">
              Daftar Akun Pelaut
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Buat akun untuk mengikuti ujian Marlins dan memperoleh sertifikat CEFR resmi
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nama Lengkap (Sesuai Paspor / STCW):</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: Capt. Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Jabatan / Rank di Kapal:</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: Deck Officer, Able Seaman, Cadet"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Alamat Email:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="pelaut@maritim.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Kata Sandi:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-bold text-xs text-white bg-[#5046E5] hover:bg-[#4338CA] shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-bold text-[#5046E5] hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-400 font-medium">
        Dengan mendaftar, Anda menyetujui Ketentuan Ujian Maritim Standar Internasional IMO STCW.
      </div>
    </div>
  );
}
