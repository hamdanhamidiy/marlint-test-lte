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
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Logo size="md" showSubtitle={true} subtitleText="Maritime English Platform" href="/" />

        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Main Register Card */}
      <div className="max-w-[460px] w-full mx-auto my-auto py-8">
        <div className="bg-white p-7 sm:p-9 rounded-[28px] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6 relative overflow-hidden">
          
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] opacity-90" />

          {/* Heading */}
          <div className="text-center space-y-1.5 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/70 text-slate-600 text-[11px] font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Registrasi Pelaut Resmi</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-[26px] font-extrabold text-slate-950 tracking-tight leading-snug">
              Daftar Akun Pelaut
            </h1>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Buat akun untuk mengikuti asesmen Marlins dan memperoleh sertifikat CEFR maritim resmi.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-medium animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nama Lengkap (Sesuai Paspor / KTP)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: Ahmad Syahputra"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#0284C7] transition-all font-normal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Departemen & Posisi Minat di Kapal Pesiar</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: F&B Service, Cabin Steward, Culinary, Guest Service"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#0284C7] transition-all font-normal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="nama@student.lte.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#0284C7] transition-all font-normal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 rounded-full bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#0284C7] transition-all font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-bold text-xs text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md shadow-sky-500/25 hover:scale-[1.01] active:scale-[0.99] mt-2"
            >
              <span>{loading ? 'Mendaftarkan Akun...' : 'Daftar Akun Sekarang'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500 font-normal">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 font-normal py-2">
        Dengan mendaftar, Anda menyetujui Ketentuan Ujian Maritim Standar Internasional IMO STCW.
      </div>
    </div>
  );
}
