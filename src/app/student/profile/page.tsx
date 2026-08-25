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
  ShieldCheck,
  Award,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { getLevelBadge } from '@/lib/utils';

const PRESET_AVATARS = [
  { label: '👨‍✈️ Perwira Deck', icon: '👨‍✈️' },
  { label: '👩‍✈️ Perwira Wanita', icon: '👩‍✈️' },
  { label: '🧑‍🔧 Perwira Mesin', icon: '🧑‍🔧' },
  { label: '👨‍💻 Komunikasi Radio', icon: '👨‍💻' },
  { label: '🧑‍✈️ Kadeta Taruna', icon: '🧑‍✈️' },
];

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
  const [isDragOver, setIsDragOver] = useState(false);

  const levelInfo = getLevelBadge(profile?.level_code || 'A1');

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

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Ukuran foto maksimal 5 MB.');
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setPhotoError('Format file harus berupa gambar (JPG, PNG, atau WEBP).');
      return;
    }

    try {
      setUploadingPhoto(true);
      setPhotoError(null);
      setPhotoSuccess(null);

      // Generate instant local base64 preview & storage format
      const base64Data = await fileToBase64(file);
      let finalPhotoUrl: string = base64Data;

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile_photos/${fileName}`;

      // 1. Try uploading to Supabase Storage bucket 'avatars'
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

      // 2. Persist to Auth Context and Supabase database
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
      setPhotoError(err.message || 'Gagal mengunggah foto profil. Silakan coba lagi.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Photo Upload from Input
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
  };

  // Handle Drag and Drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
  };

  // Handle Remove Photo
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
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-12">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden border border-slate-800">
        <div className="flex items-center gap-5">
          {/* Avatar with Upload Trigger Button */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 shadow-md">
              <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center font-heading text-3xl font-black text-slate-800 overflow-hidden relative">
                {uploadingPhoto ? (
                  <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white z-10">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
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
                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer"
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
              className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5046E5] hover:bg-[#4338CA] text-white border-2 border-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
              title="Unggah Foto Baru"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-white">
                {profile?.full_name || 'Pelaut Indonesia'}
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
                {profile?.role === 'super_admin' ? 'Super Admin' : profile?.role === 'instructor' ? 'Instruktur' : 'Siswa Pelaut'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {profile?.job_title || 'Chief Officer'} • {profile?.email}
            </p>

            {/* Photo Action Buttons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
              <button
                type="button"
                onClick={handleSelectPhoto}
                disabled={uploadingPhoto}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors cursor-pointer border border-white/15"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{profile?.photo_url ? 'Ganti Foto' : 'Unggah Foto'}</span>
              </button>

              {profile?.photo_url && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={uploadingPhoto}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 backdrop-blur-xs transition-colors cursor-pointer border border-rose-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Foto</span>
                </button>
              )}

              <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white/10 text-white border border-white/15">
                Level {profile?.level_code || 'B1+'}
              </span>
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {profile?.total_points || 0} XP
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Alerts for Photo Actions */}
      {photoSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold shadow-xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{photoSuccess}</span>
        </div>
      )}

      {photoError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-semibold shadow-xs animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{photoError}</span>
        </div>
      )}

      {/* Drag & Drop Photo Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={handleSelectPhoto}
        className={`p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
          isDragOver
            ? 'border-[#5046E5] bg-indigo-50/50'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
        }`}
      >
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#5046E5] flex items-center justify-center mx-auto">
          <Upload className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-800">
            Tarik & Lepas Foto Profil di Sini, atau <span className="text-[#5046E5] underline">Pilih Berkas</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Mendukung file JPG, PNG, atau WEBP (Maksimal 5 MB). Foto otomatis dioptimasi untuk lembar sertifikat resmi.
          </p>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">Data Diri & Posisi Kapal</h2>
          <p className="text-xs text-slate-500">Informasi ini akan tercantum pada sertifikat kelulusan Marlins resmi Anda.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Nama Lengkap (Sesuai Paspor / Buku Pelaut):</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Alamat Email Login:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            {/* Job Title / Rank */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Jabatan / Rank di Kapal:</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: Chief Officer, 2nd Engineer, Able Seaman, Cadet"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Nomor Telepon / WhatsApp:</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            {/* Nationality */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Kewarganegaraan:</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Indonesia"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Tanggal Lahir:</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
                />
              </div>
            </div>
          </div>

          {/* About / Bio */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Tentang / Pengalaman Berlayar:</label>
            <textarea
              rows={3}
              placeholder="Ceritakan singkat latar belakang atau sertifikat kepelautan yang Anda miliki..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5046E5] font-medium"
            />
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Perubahan data diri berhasil disimpan!</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
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
