'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Globe,
  Calendar,
  Save,
  CheckCircle2,
  Sparkles,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { getLevelBadge } from '@/lib/utils';

export default function StudentProfilePage() {
  const { profile, user, refreshProfile, signOut } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || '');
  const [jobTitle, setJobTitle] = useState(profile?.job_title || '');
  const [nationality, setNationality] = useState(profile?.nationality || 'Indonesia');
  const [dateOfBirth, setDateOfBirth] = useState(profile?.date_of_birth || '');
  const [about, setAbout] = useState(profile?.about || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const levelInfo = getLevelBadge(profile?.level_code || 'A1');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setSaveSuccess(false);

      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          job_title: jobTitle,
          nationality: nationality,
          date_of_birth: dateOfBirth || null,
          about: about,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (!error) {
        await refreshProfile();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#0B192C] text-white p-6 sm:p-8 rounded-[28px] shadow-lg shadow-indigo-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-white p-1 shadow-lg shadow-black/10 shrink-0">
            <div className="w-full h-full bg-slate-100 rounded-[22px] flex items-center justify-center font-heading text-3xl font-black text-slate-800 overflow-hidden">
              {profile?.photo_url ? (
                <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <span>👨‍✈️</span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
              {profile?.full_name || 'Pelaut Indonesia'}
            </h1>
            <p className="text-xs text-indigo-200 font-semibold">{profile?.job_title || 'Seafarer'} • {profile?.email}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                Level {profile?.level_code || 'A1'}
              </span>
              <span className="text-xs text-cyan-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {profile?.total_points || 0} XP
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/15 text-white border border-white/20 hover:bg-white/25 transition-all shrink-0 backdrop-blur-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-slate-100 shadow-2xs space-y-6">
        <div>
          <h2 className="font-heading text-base sm:text-lg font-extrabold text-slate-900">Data Diri & Posisi Kapal</h2>
          <p className="text-xs text-slate-500 font-medium">Informasi ini akan tercantum pada sertifikat kelulusan Marlins resmi Anda.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nama Lengkap (Sesuai Paspor / Buku Pelaut):</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Alamat Email:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            {/* Job Title / Rank */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Jabatan / Rank di Kapal:</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: 2nd Officer, Able Seaman, Cadet, Chief Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nomor Telepon / WhatsApp:</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            {/* Nationality */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Kewarganegaraan:</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Indonesia"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Tanggal Lahir:</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>
          </div>

          {/* About / Bio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Tentang / Pengalaman Berlayar:</label>
            <textarea
              rows={3}
              placeholder="Ceritakan singkat latar belakang atau sertifikat kepelautan yang Anda miliki..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
            />
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Perubahan profil berhasil disimpan!</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs text-white bg-[#5046E5] hover:bg-[#4338CA] shadow-md shadow-indigo-500/20 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Profil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
