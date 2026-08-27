'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  Mail,
  Phone,
  Edit3,
  Trash2,
  X,
  Check,
  Filter,
  UserCheck,
  Briefcase,
  BookOpen,
  Utensils,
  Bed,
  ChefHat,
  SlidersHorizontal,
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

    const channel = supabase
      .channel('admin_instructors_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => {
          loadInstructors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchName = inst.full_name.toLowerCase().includes(query);
      const matchEmail = inst.email.toLowerCase().includes(query);
      const matchCert = inst.certificate_number?.toLowerCase().includes(query);
      if (!matchName && !matchEmail && !matchCert) return false;
    }

    if (statusFilter !== 'all' && inst.status !== statusFilter) return false;

    return true;
  });

  const totalCount = instructors.length;
  const activeCount = instructors.filter((i) => i.status === 'active').length;

  return (
    <div className="space-y-6 sm:space-y-7 max-w-7xl mx-auto font-sans pb-16 min-w-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold text-[#0284C7] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span className="font-bold text-[#0369A1]">Super Administrator Control</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Manajemen Instruktur & Penguji
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
            Kelola data staf pengajar perhotelan & kapal pesiar di LTE Cruise Training Center, nomor sertifikasi penguji IMO 6.09, dan hak akses pengelolaan soal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white text-xs sm:text-[13px] font-bold shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 text-cyan-200" />
          <span>Tambah Instruktur Baru</span>
        </button>
      </div>

      {/* Top Metric Cards - Oceanic Blue Modern Palette */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
        {/* Card 1: Total Instruktur */}
        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pengajar
            </span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100/80 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-heading text-2xl sm:text-3xl font-black text-slate-950 leading-tight">{totalCount}</p>
            <span className="text-xs text-slate-500 font-medium mt-1 block">Staf Pengajar Terdaftar</span>
          </div>
        </div>

        {/* Card 2: Instruktur Aktif */}
        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Status Aktif
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </div>
          <div>
            <p className="font-heading text-2xl sm:text-3xl font-black text-slate-950 leading-tight">{activeCount}</p>
            <span className="text-xs text-emerald-700 font-bold mt-1 block">Memiliki Hak Kelola Soal</span>
          </div>
        </div>

        {/* Card 3: F&B & Hospitality */}
        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              F&B & Service
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0369A1] flex items-center justify-center border border-blue-100/80 group-hover:scale-110 transition-transform">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-heading text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {instructors.filter((i) => i.specialization === 'fb' || i.specialization === 'frontoffice' || i.specialization === 'general').length}
            </p>
            <span className="text-xs text-slate-500 font-medium mt-1 block">Penguji Cruise Line</span>
          </div>
        </div>

        {/* Card 4: Culinary & Rooms */}
        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Culinary & Rooms
            </span>
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 text-[#0284C7] flex items-center justify-center border border-cyan-100/80 group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-heading text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {instructors.filter((i) => i.specialization === 'culinary' || i.specialization === 'housekeeping').length}
            </p>
            <span className="text-xs text-slate-500 font-medium mt-1 block">Divisi Operasional Hotel</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar - Oceanic Clean Design */}
      <div className="bg-white p-3.5 sm:p-4 rounded-[24px] border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama pengajar, email, no. sertifikasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50/80 border border-slate-200/90 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full text-xs font-bold text-slate-600 shrink-0 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer text-center flex-1 sm:flex-initial ${
              statusFilter === 'all'
                ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-xs'
                : 'hover:text-[#0284C7]'
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer text-center flex-1 sm:flex-initial ${
              statusFilter === 'active'
                ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-xs'
                : 'hover:text-[#0284C7]'
            }`}
          >
            Aktif ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer text-center flex-1 sm:flex-initial ${
              statusFilter === 'inactive'
                ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-xs'
                : 'hover:text-[#0284C7]'
            }`}
          >
            Nonaktif ({totalCount - activeCount})
          </button>
        </div>
      </div>

      {/* Instructors List Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-[28px] text-slate-400 text-xs shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-100 animate-pulse">
            <Users className="w-5 h-5" />
          </div>
          <p className="font-bold text-slate-700">Memuat direktori staf pengajar...</p>
        </div>
      ) : filteredInstructors.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-[28px] text-slate-500 text-sm shadow-2xs space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-100">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-slate-900 text-base">Tidak Ada Instruktur Ditemukan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Coba sesuaikan kata kunci pencarian atau filter status pengajar.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredInstructors.map((inst) => (
            <div
              key={inst.id || inst.email}
              className={`bg-white p-5 sm:p-6 rounded-[28px] border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xs hover:border-sky-300 hover:shadow-md group ${
                inst.status === 'inactive'
                  ? 'border-slate-200 bg-slate-50/70 opacity-75'
                  : 'border-slate-200/80'
              }`}
            >
              {/* Card Header: Role Badge & Active Toggle */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-50 text-[#0284C7] border border-sky-200/80">
                  Penguji Marlins
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(inst.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    inst.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                  title="Klik untuk ubah status"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${inst.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <span>{inst.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
                </button>
              </div>

              {/* Identity & Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white font-heading font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {inst.full_name.charAt(0)}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-heading text-base font-extrabold text-slate-950 leading-snug break-words">
                      {inst.full_name}
                    </h3>
                    <p className="text-xs text-[#0284C7] font-semibold leading-relaxed truncate">
                      {inst.job_title || 'Instruktur Perhotelan & Kapal Pesiar'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 space-y-1.5 text-xs text-slate-600 font-medium border-t border-slate-100">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{inst.email}</span>
                  </div>
                  {inst.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-xs text-slate-800">{inst.phone_number}</span>
                    </div>
                  )}
                  {inst.certificate_number && (
                    <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs pt-0.5">
                      <Award className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                      <span className="font-mono text-[11px] bg-sky-50 text-[#0369A1] px-2 py-0.5 rounded-lg border border-sky-100">
                        {inst.certificate_number}
                      </span>
                    </div>
                  )}
                </div>

                {inst.about && (
                  <p className="text-xs text-slate-500 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 leading-relaxed italic line-clamp-2">
                    "{inst.about}"
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  {formatDateIndo(inst.created_at)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(inst)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-[#0284C7] text-slate-700 transition-colors cursor-pointer"
                    title="Edit Pengajar"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteInstructor(inst)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
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

      {/* Add / Edit Instructor Modal - Oceanic Clean Style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-7 rounded-[32px] border border-slate-200 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#0284C7] uppercase tracking-wider block">
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
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none font-medium"
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
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none font-medium disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Nomor Telepon / WA</label>
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none font-medium"
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
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">No. Sertifikat Penguji</label>
                  <input
                    type="text"
                    placeholder="IMO-6.09-ID-2026-001"
                    value={formCertNumber}
                    onChange={(e) => setFormCertNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Status Keaktifan</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none cursor-pointer"
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
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 outline-none resize-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] shadow-md shadow-sky-500/20 hover:opacity-95 transition-all cursor-pointer"
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
