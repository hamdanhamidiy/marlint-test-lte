'use client';

import React, { useState, useRef } from 'react';
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
  Camera,
  Trash2,
  Loader2,
  AlertCircle,
  Shield,
  Award,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { getLevelBadge } from '@/lib/utils';

export default function StudentProfilePage() {
  const { profile, user, updateProfile, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || '');
  const [jobTitle, setJobTitle] = useState(profile?.job_title || '');
  const [nationality, setNationality] = useState(profile?.nationality || 'Indonesia');
  const [dateOfBirth, setDateOfBirth] = useState(profile?.date_of_birth || '');
  const [about, setAbout] = useState(profile?.about || '');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);

  // Trigger file selection
  const handleSelectPhoto = () => {
    setPhotoError(null);
    setPhotoSuccess(null);
    fileInputRef.current?.click();
  };

  // Convert and compress file to base64 helper
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.88));
        };
        img.onerror = () => resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processUploadedFile = async (file: File) => {
    if (!user) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Ukuran foto maksimal 5 MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPhotoError('Format file harus berupa gambar (JPG, PNG, atau WEBP).');
      return;
    }

    try {
      setUploadingPhoto(true);
      setPhotoError(null);
      setPhotoSuccess(null);

      const base64Data = await fileToBase64(file);
      let finalPhotoUrl: string = base64Data;

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile_photos/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            finalPhotoUrl = publicUrlData.publicUrl;
          }
        }
      } catch (storageErr) {
        console.warn('Storage bucket upload fallback to Base64:', storageErr);
      }

      const { error: updateErr } = await updateProfile({
        photo_url: finalPhotoUrl,
      });

      if (updateErr) {
        throw new Error(updateErr.message || 'Gagal menyimpan foto profil.');
      }

      setPhotoSuccess('Foto profil resmi berhasil diperbarui!');
      setTimeout(() => setPhotoSuccess(null), 3500);
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      setPhotoError(err.message || 'Gagal mengunggah foto profil.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    try {
      setUploadingPhoto(true);
      setPhotoError(null);
      setPhotoSuccess(null);

      await updateProfile({
        photo_url: null,
      });

      setPhotoSuccess('Foto profil berhasil dihapus.');
      setTimeout(() => setPhotoSuccess(null), 3000);
    } catch (err: any) {
      setPhotoError(err.message || 'Gagal menghapus foto profil.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setSaveSuccess(false);

      const { error } = await updateProfile({
        full_name: fullName,
        phone_number: phoneNumber,
        job_title: jobTitle,
        nationality: nationality,
        date_of_birth: dateOfBirth || null,
        about: about,
      });

      if (!error) {
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
    <div className="max-w-4xl mx-auto space-y-5 font-sans pb-10">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {/* Header Profile Card (Clean Modern Antigravity Aesthetic) */}
      <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        
        {/* Subtle Top Ambient Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] via-[#EA580C] to-slate-900 opacity-90" />

        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar with Click-to-Upload Trigger */}
          <div className="relative group shrink-0">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#EA580C] p-0.5 shadow-sm">
              <div className="w-full h-full bg-amber-50 rounded-[14px] flex items-center justify-center font-heading text-2xl font-black text-slate-800 overflow-hidden relative">
                {uploadingPhoto ? (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white z-10">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  </div>
                ) : profile?.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.full_name || 'Foto Profil'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>👨‍✈️</span>
                )}

                {/* Hover Overlay Button */}
                <button
                  type="button"
                  onClick={handleSelectPhoto}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5 cursor-pointer"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <span>Ubah</span>
                </button>
              </div>
            </div>

            {/* Quick Action Floating Camera Badge */}
            <button
              type="button"
              onClick={handleSelectPhoto}
              disabled={uploadingPhoto}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white border-2 border-white flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
              title="Unggah Foto Baru"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-lg sm:text-xl font-bold text-slate-900 truncate">
                {profile?.full_name || 'Pelaut Indonesia'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0369A1] border border-sky-200/80 text-[10px] font-bold uppercase tracking-wider">
                {profile?.role === 'super_admin' ? 'Super Admin' : profile?.role === 'instructor' ? 'Instruktur' : 'Siswa Pelaut'}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-normal truncate">
              {profile?.job_title || 'Chief Officer'} • <span className="text-slate-400 font-mono">{profile?.email}</span>
            </p>

            {/* Action Buttons & Badges Row */}
            <div className="flex items-center gap-2 pt-1.5 flex-wrap text-xs">
              <button
                type="button"
                onClick={handleSelectPhoto}
                disabled={uploadingPhoto}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                <span>{profile?.photo_url ? 'Ganti Foto' : 'Unggah Foto'}</span>
              </button>

              {profile?.photo_url && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={uploadingPhoto}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Hapus</span>
                </button>
              )}

              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                Level {profile?.level_code || 'B1+'}
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C2410C] border border-orange-200 text-[11px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#EA580C]" />
                {profile?.total_points || 0} XP
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Alerts for Photo Actions */}
      {photoSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold shadow-2xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{photoSuccess}</span>
        </div>
      )}

      {photoError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-semibold shadow-2xs animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{photoError}</span>
        </div>
      )}

      {/* Profile Edit Form */}
      <div className="bg-white p-5 sm:p-7 rounded-[26px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">Data Diri & Posisi Kapal</h2>
          <p className="text-xs text-slate-500 mt-0.5">Informasi ini akan tercantum pada sertifikat kelulusan Marlins resmi Anda.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Nama Lengkap (Sesuai Paspor / Buku Pelaut):</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Alamat Email Login:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            {/* Job Title / Rank */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Jabatan / Rank di Kapal:</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: Chief Officer, 2nd Engineer, Able Seaman, Cadet"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Nomor Telepon / WhatsApp:</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* Nationality */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Kewarganegaraan:</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Indonesia"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Tanggal Lahir:</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20 font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* About / Bio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Tentang / Pengalaman Berlayar:</label>
            <textarea
              rows={3}
              placeholder="Ceritakan singkat latar belakang atau sertifikat kepelautan yang Anda miliki..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20 font-medium transition-all"
            />
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Perubahan data diri berhasil disimpan!</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs text-white bg-black hover:bg-neutral-800 transition-all disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
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
