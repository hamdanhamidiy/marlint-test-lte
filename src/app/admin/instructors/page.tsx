'use client';

import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  Award,
  Mail,
  Phone,
  Edit2,
  Trash2,
  RotateCcw,
  KeyRound,
  X,
  Check,
  Filter,
  UserCheck,
  Compass,
  Anchor,
  Radio,
  BookOpen,
  Utensils,
  Bed,
  ChefHat,
  ConciergeBell,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/supabase/types';
import { formatDateIndo } from '@/lib/utils';

interface InstructorItem {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  role: 'instructor' | 'admin';
  status: 'active' | 'inactive';
  job_title: string | null;
  specialization: 'fb' | 'housekeeping' | 'culinary' | 'frontoffice' | 'general';
  certificate_number: string | null;
  about: string | null;
  created_at: string;
}

const DEFAULT_INSTRUCTORS: InstructorItem[] = [
  {
    id: '00000000-0000-0000-0000-000000000002',
    full_name: 'Capt. Hendra Wijaya, M.Mar',
    email: 'instructor@marlins.com',
    phone_number: '081122334455',
    role: 'instructor',
    status: 'active',
    job_title: 'Lead Instructor & Assessor - Marlins Cruise English',
    specialization: 'general',
    certificate_number: 'IMO-6.09-ID-2024-091',
    about: 'Penguji dan instruktur resmi Marlins Test Bahasa Inggris Perhotelan & Kapal Pesiar LTE Cruise.',
    created_at: '2026-01-15T08:00:00.000Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    full_name: 'Ir. Bambang Sugiarto, M.T.',
    email: 'bambang.eng@marlins.com',
    phone_number: '081299887766',
    role: 'instructor',
    status: 'active',
    job_title: 'Cruise Technical & Safety Operations Assessor',
    specialization: 'general',
    certificate_number: 'IMO-6.09-ID-2023-142',
    about: 'Penguji komunikasi teknis, keselamatan kapal pesiar, dan prosedur darurat.',
    created_at: '2026-02-10T09:30:00.000Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    full_name: 'Sarah Melinda, S.Par., M.M.',
    email: 'sarah.deck@marlins.com',
    phone_number: '081377665544',
    role: 'instructor',
    status: 'active',
    job_title: 'Senior Hospitality & Guest Service Instructor',
    specialization: 'frontoffice',
    certificate_number: 'IMO-6.09-ID-2024-205',
    about: 'Instruktur bahasa Inggris perhotelan kapal pesiar, Food & Beverage, dan pelayanan tamu internasional.',
    created_at: '2026-03-01T10:15:00.000Z',
  },
];

export default function AdminInstructorsPage() {
  const { isSuperAdmin, profile } = useAuth();
  const [instructors, setInstructors] = useState<InstructorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [specFilter, setSpecFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSpecialization, setFormSpecialization] = useState<'fb' | 'housekeeping' | 'culinary' | 'frontoffice' | 'general'>('general');
  const [formCertNumber, setFormCertNumber] = useState('');
  const [formJobTitle, setFormJobTitle] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formAbout, setFormAbout] = useState('');
  const [formPassword, setFormPassword] = useState('password123');
  const [formError, setFormError] = useState<string | null>(null);

  const loadInstructors = async () => {
    try {
      setLoading(true);

      // 1. Load from Supabase users where role is instructor
      const { data: dbData } = await supabase
        .from('users')
        .select('*')
        .in('role', ['instructor', 'admin'])
        .order('created_at', { ascending: false });

      const map = new Map<string, InstructorItem>();

      if (dbData && dbData.length > 0) {
        dbData.forEach((u: any) => {
          if (u.email) {
            map.set(u.email.toLowerCase(), {
              id: u.id,
              full_name: u.full_name || 'Instruktur Marlins',
              email: u.email || '',
              phone_number: u.phone_number,
              role: u.role || 'instructor',
              status: u.status || 'active',
              job_title: u.job_title || 'Instruktur Bahasa Inggris Perhotelan & Kapal Pesiar',
              specialization: 'general',
              certificate_number: 'IMO-6.09-ID',
              about: u.about,
              created_at: u.created_at || new Date().toISOString(),
            });
          }
        });
      } else {
        // Fallback default instructors only if DB returned 0 rows
        DEFAULT_INSTRUCTORS.forEach((def) => {
          map.set(def.email.toLowerCase(), def);
        });
      }

      setInstructors(Array.from(map.values()));
    } catch (err) {
      console.error('Error loading instructors:', err);
      setInstructors(DEFAULT_INSTRUCTORS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  const saveToStorage = (updatedList: InstructorItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('marlins_instructors_list', JSON.stringify(updatedList));
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormSpecialization('general');
    setFormCertNumber('IMO-6.09-ID-2026-');
    setFormJobTitle('Instruktur Bahasa Inggris Perhotelan & Kapal Pesiar');
    setFormStatus('active');
    setFormAbout('');
    setFormPassword('password123');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (inst: InstructorItem) => {
    setModalMode('edit');
    setEditingId(inst.id);
    setFormName(inst.full_name);
    setFormEmail(inst.email);
    setFormPhone(inst.phone_number || '');
    setFormSpecialization(inst.specialization || 'general');
    setFormCertNumber(inst.certificate_number || '');
    setFormJobTitle(inst.job_title || '');
    setFormStatus(inst.status);
    setFormAbout(inst.about || '');
    setFormPassword('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Nama lengkap pengajar wajib diisi.');
      return;
    }
    if (!formEmail.trim() || !formEmail.includes('@')) {
      setFormError('Alamat email valid wajib diisi.');
      return;
    }

    if (modalMode === 'add') {
      // Check duplicate email
      if (instructors.some((i) => i.email.toLowerCase() === formEmail.trim().toLowerCase())) {
        setFormError('Alamat email sudah terdaftar untuk instruktur lain.');
        return;
      }

      const newItem: InstructorItem = {
        id: `inst-${Date.now()}`,
        full_name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        phone_number: formPhone.trim() || null,
        role: 'instructor',
        status: formStatus,
        job_title: formJobTitle.trim() || 'Instruktur Perhotelan & Kapal Pesiar',
        specialization: formSpecialization,
        certificate_number: formCertNumber.trim() || null,
        about: formAbout.trim() || null,
        created_at: new Date().toISOString(),
      };

      // 1. Sync to Supabase
      try {
        await supabase.from('users').insert([
          {
            id: newItem.id,
            email: newItem.email,
            full_name: newItem.full_name,
            phone_number: newItem.phone_number,
            role: 'instructor',
            status: newItem.status,
            job_title: newItem.job_title,
            about: newItem.about,
            created_at: newItem.created_at,
            updated_at: new Date().toISOString(),
          },
        ]);
      } catch (dbErr) {
        console.warn('Supabase insert instructor note:', dbErr);
      }

      const updated = [newItem, ...instructors];
      setInstructors(updated);
      saveToStorage(updated);
    } else if (modalMode === 'edit' && editingId) {
      // 1. Sync to Supabase
      try {
        await supabase
          .from('users')
          .update({
            full_name: formName.trim(),
            phone_number: formPhone.trim() || null,
            status: formStatus,
            job_title: formJobTitle.trim(),
            about: formAbout.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .or(`id.eq.${editingId},email.eq.${formEmail.trim().toLowerCase()}`);
      } catch (dbErr) {
        console.warn('Supabase update instructor note:', dbErr);
      }

      const updated = instructors.map((inst) => {
        if (inst.id === editingId) {
          return {
            ...inst,
            full_name: formName.trim(),
            email: formEmail.trim().toLowerCase(),
            phone_number: formPhone.trim() || null,
            status: formStatus,
            job_title: formJobTitle.trim() || inst.job_title,
            specialization: formSpecialization,
            certificate_number: formCertNumber.trim() || null,
            about: formAbout.trim() || null,
          };
        }
        return inst;
      });

      setInstructors(updated);
      saveToStorage(updated);
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = async (instId: string) => {
    const inst = instructors.find((i) => i.id === instId);
    if (!inst) return;
    const nextStatus: 'active' | 'inactive' = inst.status === 'active' ? 'inactive' : 'active';

    try {
      await supabase
        .from('users')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .or(`id.eq.${inst.id},email.eq.${inst.email}`);
    } catch (dbErr) {
      console.warn('Supabase toggle instructor status note:', dbErr);
    }

    const updated = instructors.map((i) => (i.id === instId ? { ...i, status: nextStatus } : i));
    setInstructors(updated);
    saveToStorage(updated);
  };

  const handleDeleteInstructor = async (inst: InstructorItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun pengajar "${inst.full_name}" (${inst.email})?\nData akan dihapus dari direktori dan database Supabase.`)) {
      return;
    }

    try {
      // 1. Delete from Supabase users table
      try {
        await supabase.from('users').delete().or(`id.eq.${inst.id},email.eq.${inst.email}`);
      } catch (dbErr) {
        console.warn('Supabase delete instructor note:', dbErr);
      }

      // 2. Remove from state
      const updated = instructors.filter((i) => i.id !== inst.id && i.email.toLowerCase() !== inst.email.toLowerCase());
      setInstructors(updated);
      saveToStorage(updated);

      alert(`Instruktur ${inst.full_name} berhasil dihapus dari database.`);
    } catch (err: any) {
      alert('Gagal menghapus instruktur: ' + err.message);
    }
  };

  const filteredInstructors = instructors.filter((inst) => {
    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchName = inst.full_name.toLowerCase().includes(query);
      const matchEmail = inst.email.toLowerCase().includes(query);
      const matchCert = inst.certificate_number?.toLowerCase().includes(query);
      if (!matchName && !matchEmail && !matchCert) return false;
    }

    // Status
    if (statusFilter !== 'all' && inst.status !== statusFilter) return false;

    // Specialization
    if (specFilter !== 'all' && inst.specialization !== specFilter) return false;

    return true;
  });

  const totalCount = instructors.length;
  const activeCount = instructors.filter((i) => i.status === 'active').length;

  return (
    <div className="space-y-6 sm:space-y-7 max-w-7xl mx-auto font-sans pb-16">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Hak Akses Super Administrator</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Instruktur & Penguji Marlins
          </h1>
          <p className="text-xs sm:text-[14px] text-slate-500 leading-relaxed max-w-2xl">
            Kelola data staf pengajar perhotelan & kapal pesiar di LTE Cruise Training Center, nomor sertifikasi penguji IMO 6.09, hak akses bank soal, dan status keaktifan.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs sm:text-[13px] font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Instruktur Baru</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4.5 rounded-[22px] bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Instruktur</span>
          <p className="font-heading text-2xl font-black text-slate-900">{totalCount}</p>
          <span className="text-xs text-slate-500 font-medium">Staf Pengajar Terdaftar</span>
        </div>

        <div className="p-4.5 rounded-[22px] bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Instruktur Aktif</span>
          <p className="font-heading text-2xl font-black text-emerald-600">{activeCount}</p>
          <span className="text-xs text-slate-500 font-medium">Memiliki Hak Kelola Soal</span>
        </div>

        <div className="p-4.5 rounded-[22px] bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7]">F&B & Hospitality</span>
          <p className="font-heading text-2xl font-black text-[#0284C7]">
            {instructors.filter((i) => i.specialization === 'fb' || i.specialization === 'frontoffice' || i.specialization === 'general').length}
          </p>
          <span className="text-xs text-slate-500 font-medium">Penguji Standar Cruise Line</span>
        </div>

        <div className="p-4.5 rounded-[22px] bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Culinary & Housekeeping</span>
          <p className="font-heading text-2xl font-black text-amber-600">
            {instructors.filter((i) => i.specialization === 'culinary' || i.specialization === 'housekeeping').length}
          </p>
          <span className="text-xs text-slate-500 font-medium">Divisi Operasional Hotel</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pengajar, email, no. sertifikat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-200/90 text-xs sm:text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-black text-white shadow-xs' : 'hover:text-black'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-black'
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                statusFilter === 'inactive' ? 'bg-rose-600 text-white shadow-xs' : 'hover:text-black'
              }`}
            >
              Nonaktif ({totalCount - activeCount})
            </button>
          </div>
        </div>
      </div>

      {/* Instructors List Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-400 text-xs shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto animate-pulse">
            <GraduationCap className="w-4 h-4" />
          </div>
          <p className="font-semibold text-slate-600">Memuat data staf pengajar...</p>
        </div>
      ) : filteredInstructors.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-500 text-sm shadow-2xs space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-slate-900 text-base">Tidak Ada Instruktur Ditemukan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Coba sesuaikan kata kunci pencarian atau filter status pengajar.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInstructors.map((inst) => (
            <div
              key={inst.id || inst.email}
              className={`bg-white p-5 rounded-[26px] border transition-all duration-150 flex flex-col justify-between space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md ${
                inst.status === 'inactive'
                  ? 'border-slate-200 bg-slate-50/70 opacity-75'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Header: Badge & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/80">
                  Penguji Marlins
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(inst.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    inst.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  title="Klik untuk ubah status"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${inst.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <span>{inst.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
                </button>
              </div>

              {/* Identity & Details */}
              <div className="space-y-1.5">
                <h3 className="font-heading text-base font-extrabold text-slate-900 leading-snug break-words">
                  {inst.full_name}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {inst.job_title || 'Instruktur Perhotelan & Kapal Pesiar'}
                </p>

                <div className="pt-2 space-y-1 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{inst.email}</span>
                  </div>
                  {inst.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-xs">{inst.phone_number}</span>
                    </div>
                  )}
                  {inst.certificate_number && (
                    <div className="flex items-center gap-2 text-amber-700 font-semibold text-[11px]">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{inst.certificate_number}</span>
                    </div>
                  )}
                </div>

                {inst.about && (
                  <p className="text-[11px] text-slate-500 italic pt-1 leading-relaxed border-t border-slate-100 mt-2 line-clamp-2">
                    "{inst.about}"
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">
                  {formatDateIndo(inst.created_at)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(inst)}
                    className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Edit Pengajar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteInstructor(inst)}
                    className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Hapus Pengajar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Instructor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-7 rounded-[32px] border border-slate-200/90 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block">
                  {modalMode === 'add' ? 'Registrasi Pengajar Baru' : 'Perbarui Data Pengajar'}
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-950">
                  {modalMode === 'add' ? 'Tambah Instruktur Penguji' : 'Edit Data Instruktur'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveInstructor} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Capt. Hendra Wijaya, M.Mar"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-purple-600 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Email Login *</label>
                  <input
                    type="email"
                    required
                    disabled={modalMode === 'edit'}
                    placeholder="pengajar@marlins.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-purple-600 outline-none font-medium disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Nomor Telepon / WA</label>
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-purple-600 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Jabatan Penguji</label>
                  <input
                    type="text"
                    placeholder="Lead Instructor & Assessor"
                    value={formJobTitle}
                    onChange={(e) => setFormJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-purple-600 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">No. Sertifikat Penguji</label>
                  <input
                    type="text"
                    placeholder="IMO-6.09-ID-2026-001"
                    value={formCertNumber}
                    onChange={(e) => setFormCertNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-purple-600 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Status Keaktifan</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:bg-white focus:border-purple-600 outline-none cursor-pointer"
                >
                  <option value="active">Aktif (Memiliki Hak Kelola Soal)</option>
                  <option value="inactive">Nonaktif (Akses Ditangguhkan)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Profil Singkat / Pengalaman Mengajar</label>
                <textarea
                  rows={2}
                  placeholder="Pengalaman mengajar bahasa Inggris perhotelan kapal pesiar..."
                  value={formAbout}
                  onChange={(e) => setFormAbout(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-purple-600 outline-none resize-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full font-bold text-xs text-white bg-black hover:bg-neutral-800 shadow-xs transition-all cursor-pointer"
                >
                  {modalMode === 'add' ? 'Simpan Pengajar' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
