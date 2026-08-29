'use client';

import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Save,
  CheckCircle2,
  LogOut,
  Camera,
  Trash2,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';

export default function StudentProfilePage() {
  const { profile, user, updateProfile, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || '');
  const [jobTitle, setJobTitle] = useState(profile?.job_title || '');
  const [dateOfBirth, setDateOfBirth] = useState(profile?.date_of_birth || '');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);

  const handleSelectPhoto = () => {
    setPhotoError(null);
    setPhotoSuccess(null);
    fileInputRef.current?.click();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
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

    if (file.size > 8 * 1024 * 1024) {
      setPhotoError('Ukuran foto maksimal 8 MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPhotoError('Format file harus berupa gambar (JPG, PNG, WEBP, JPEG).');
      return;
    }

    try {
      setUploadingPhoto(true);
      setPhotoError(null);
      setPhotoSuccess(null);

      const base64Data = await fileToBase64(file);
      let finalPhotoUrl: string = base64Data;

      try {
        const response = await fetch(base64Data);
        const imageBlob = await response.blob();
        const fileName = `${user.id}-${Date.now()}.jpg`;
        const filePath = `profile_photos/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, imageBlob, {
            upsert: true,
            contentType: 'image/jpeg',
          });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            finalPhotoUrl = publicUrlData.publicUrl;
          }
        }
      } catch (storageErr) {
        console.warn('Storage fallback:', storageErr);
      }

      const { error: updateErr } = await updateProfile({
        photo_url: finalPhotoUrl,
      });

      if (updateErr) {
        throw new Error(updateErr.message || 'Gagal menyimpan foto profil.');
      }

      setPhotoSuccess('Foto profil berhasil diperbarui.');
      setTimeout(() => setPhotoSuccess(null), 3000);
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
        date_of_birth: dateOfBirth || null,
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
    <div className="max-w-2xl mx-auto space-y-3.5 font-sans pb-8">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {/* Header Profile Card — Compact Horizontal Layout on all Screens */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs relative">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left Avatar + User Details in single clean row */}
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            
            {/* Avatar Container with fixed square size */}
            <div className="relative group shrink-0 w-14 h-14 sm:w-16 sm:h-16 aspect-square">
              <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-2xl bg-gradient-to-tr from-[#0284C7] to-amber-500 p-0.5 shadow-2xs overflow-hidden">
                <div className="w-full h-full bg-slate-100 rounded-[14px] flex items-center justify-center font-heading text-xl font-bold text-slate-700 overflow-hidden relative">
                  {uploadingPhoto ? (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white z-10">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    </div>
                  ) : profile?.photo_url ? (
                    <img
                      src={profile.photo_url}
                      alt={profile.full_name || 'Foto Profil'}
                      className="w-full h-full object-cover aspect-square"
                    />
                  ) : (
                    <span>👨‍✈️</span>
                  )}

                  <button
                    type="button"
                    onClick={handleSelectPhoto}
                    disabled={uploadingPhoto}
                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold cursor-pointer"
                    title="Ganti Foto"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSelectPhoto}
                disabled={uploadingPhoto}
                className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-[#0284C7] text-white border-2 border-white flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
                title="Unggah Foto"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            {/* Name, Role & Email */}
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-heading text-sm sm:text-base font-extrabold text-slate-900 truncate">
                  {profile?.full_name || 'Siswa LTE Cruise'}
                </h1>
                <span className="px-2 py-0.2 rounded-md bg-sky-50 text-[#0284C7] border border-sky-200/80 text-[9px] font-extrabold uppercase tracking-wider">
                  {profile?.role === 'super_admin' ? 'Super Admin' : profile?.role === 'instructor' ? 'Instruktur' : 'Siswa'}
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-500 font-normal truncate">
                {profile?.email}
              </p>

              <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                <span className="px-2 py-0.2 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200/80">
                  Level {profile?.level_code || 'A1'}
                </span>

                {profile?.photo_url && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={uploadingPhoto}
                    className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md text-[10px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 text-rose-500" />
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right: Compact Logout Action Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Keluar dari akun ini"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </div>

      {/* Alert Banners */}
      {photoSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{photoSuccess}</span>
        </div>
      )}

      {photoError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-semibold shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{photoError}</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="border-b border-slate-100 pb-2.5">
          <h2 className="font-heading text-sm sm:text-base font-extrabold text-slate-900">
            Informasi Data Diri Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Data ini digunakan untuk penerbitan sertifikat kelulusan Marlins Test resmi Anda.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Nama Lengkap (Sesuai KTP/Paspor):</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Nama Lengkap"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] font-medium transition-all"
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Alamat Email Login:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            {/* Department / Position */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Departemen & Posisi Kerja:</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: F&B Service, Housekeeping, Deck, Engine"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] font-medium transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Nomor WhatsApp / HP:</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] font-medium transition-all"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">Tanggal Lahir (Opsional):</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Data profil berhasil disimpan!</span>
            </div>
          )}

          <div className="pt-1.5 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:opacity-95 shadow-md shadow-sky-500/20 transition-all duration-150 disabled:opacity-50 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
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
