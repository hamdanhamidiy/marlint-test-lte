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
  specialization: 'nautika' | 'teknika' | 'gmdss' | 'hospitality' | 'general';
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
    job_title: 'Lead Maritime English Instructor & Master Mariner',
    specialization: 'nautika',
    certificate_number: 'IMO-6.09-ID-2024-091',
    about: 'Master Mariner bersertifikat IMO Model Course 6.09 Training for Instructors & Assessor STCW.',
    created_at: '2026-01-15T08:00:00.000Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    full_name: 'Ir. Bambang Sugiarto, M.T. (Chief Engineer)',
    email: 'bambang.eng@marlins.com',
    phone_number: '081299887766',
    role: 'instructor',
    status: 'active',
    job_title: 'Chief Engineer & Technical Maritime English Assessor',
    specialization: 'teknika',
    certificate_number: 'IMO-6.09-ID-2023-142',
    about: 'Spesialis permesinan kapal, ISM Code, dan Technical Communication Engine Room.',
    created_at: '2026-02-10T09:30:00.000Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    full_name: 'Capt. Sarah Melinda, S.Si.T., M.M.',
    email: 'sarah.deck@marlins.com',
    phone_number: '081377665544',
    role: 'instructor',
    status: 'active',
    job_title: 'Senior Navigation & GMDSS Communication Instructor',
    specialization: 'gmdss',
    certificate_number: 'IMO-6.09-ID-2024-205',
    about: 'Penguji resmi komunikasi radio maritim VHF, GMDSS, dan SAR Coordination.',
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
  const [formSpecialization, setFormSpecialization] = useState<'nautika' | 'teknika' | 'gmdss' | 'hospitality' | 'general'>('nautika');
  const [formCertNumber, setFormCertNumber] = useState('');
  const [formJobTitle, setFormJobTitle] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formAbout, setFormAbout] = useState('');
  const [formPassword, setFormPassword] = useState('password123');
  const [formError, setFormError] = useState<string | null>(null);

  const loadInstructors = async () => {
    try {
      setLoading(true);

      // Try loading from Supabase users where role is instructor
      const { data: dbData } = await supabase
        .from('users')
        .select('*')
        .in('role', ['instructor', 'admin'])
        .order('created_at', { ascending: false });

      let list: InstructorItem[] = [];

      if (dbData && dbData.length > 0) {
        list = dbData.map((u: any) => ({
          id: u.id,
          full_name: u.full_name || 'Instruktur Maritim',
          email: u.email || '',
          phone_number: u.phone_number,
          role: u.role || 'instructor',
          status: u.status || 'active',
          job_title: u.job_title || 'Instruktur Bahasa Inggris Maritim',
          specialization: 'nautika',
          certificate_number: 'IMO-6.09-ID',
          about: u.about,
          created_at: u.created_at || new Date().toISOString(),
        }));
      }

      // Check localStorage for custom added instructors
      if (typeof window !== 'undefined') {
        const localSaved = localStorage.getItem('marlins_instructors_list');
        if (localSaved) {
          try {
            const parsed = JSON.parse(localSaved);
            if (Array.isArray(parsed)) {
              parsed.forEach((item) => {
                if (!list.some((existing) => existing.id === item.id || existing.email === item.email)) {
                  list.push(item);
                }
              });
            }
          } catch (e) {}
        }
      }

      // Merge defaults if empty
      DEFAULT_INSTRUCTORS.forEach((def) => {
        if (!list.some((existing) => existing.email === def.email || existing.id === def.id)) {
          list.push(def);
        }
      });

      setInstructors(list);
    } catch (err) {
      console.error('Error loading instructors:', err);
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
    setFormSpecialization('nautika');
    setFormCertNumber('IMO-6.09-ID-2026-');
    setFormJobTitle('Instruktur Bahasa Inggris Maritim');
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
    setFormSpecialization(inst.specialization || 'nautika');
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
      setFormError('Nama lengkap instruktur wajib diisi.');
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
        job_title: formJobTitle.trim() || 'Instruktur Maritim',
        specialization: formSpecialization,
        certificate_number: formCertNumber.trim() || null,
        about: formAbout.trim() || null,
        created_at: new Date().toISOString(),
      };

      const updated = [newItem, ...instructors];
      setInstructors(updated);
      saveToStorage(updated);
    } else if (modalMode === 'edit' && editingId) {
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

  const handleToggleStatus = (instId: string) => {
    const updated = instructors.map((inst) => {
      if (inst.id === instId) {
        const nextStatus: 'active' | 'inactive' = inst.status === 'active' ? 'inactive' : 'active';
        return { ...inst, status: nextStatus };
      }
      return inst;
    });
    setInstructors(updated);
    saveToStorage(updated);
  };

  const handleDeleteInstructor = (instId: string, instName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun instruktur "${instName}"?`)) {
      const updated = instructors.filter((i) => i.id !== instId);
      setInstructors(updated);
      saveToStorage(updated);
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
  const nautikaCount = instructors.filter((i) => i.specialization === 'nautika').length;
  const teknikaCount = instructors.filter((i) => i.specialization === 'teknika').length;

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
            Manajemen Instruktur & Dosen Maritim
          </h1>
          <p className="text-xs sm:text-[14px] text-slate-500 leading-relaxed max-w-2xl">
            Kelola data staf pengajar, nomor sertifikasi penguji IMO 6.09, hak akses bank soal, dan status keaktifan instruktur.
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

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Instruktur</span>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{totalCount}</p>
          <p className="text-xs text-slate-500 font-medium">Staf Pengajar Terdaftar</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700">Instruktur Aktif</span>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">{activeCount}</p>
          <p className="text-xs text-slate-500 font-medium">Memiliki Hak Kelola Soal</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0369A1]">Bidang Nautika & Deck</span>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0284C7] font-mono">{nautikaCount}</p>
          <p className="text-xs text-slate-500 font-medium">Master Mariner / Watchkeeper</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 hover:border-slate-300 transition-all">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#C2410C]">Bidang Teknika & Engine</span>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#EA580C] font-mono">{teknikaCount}</p>
          <p className="text-xs text-slate-500 font-medium">Chief / Marine Engineer</p>
        </div>
      </div>

      {/* Toolbar: Search, Status Filter, Specialization Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3.5">
        <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, email, no. sertifikat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-200/90 text-xs sm:text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#F1F3F5] p-1 rounded-full border border-slate-200/70">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black hover:bg-white/70'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-black hover:bg-white/70'
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'inactive' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-black hover:bg-white/70'
              }`}
            >
              Nonaktif ({totalCount - activeCount})
            </button>
          </div>
        </div>

        {/* Specialization Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-200/90 text-xs sm:text-[13px] font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-[#0284C7] transition-all cursor-pointer"
          >
            <option value="all">Semua Spesialisasi</option>
            <option value="nautika">Nautika & Navigasi</option>
            <option value="teknika">Teknika & Permesinan</option>
            <option value="gmdss">Radio & GMDSS</option>
            <option value="hospitality">Hospitality Kapal Pesiar</option>
            <option value="general">Maritim Umum</option>
          </select>
        </div>
      </div>

      {/* Instructors List Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-500 text-xs">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="font-bold text-slate-700">Memuat data instruktur...</p>
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-500 text-xs space-y-2">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-extrabold text-slate-900 text-base">Tidak Ditemukan Instruktur</p>
            <p className="text-slate-500 text-xs sm:text-[13px]">Coba sesuaikan kata kunci pencarian atau filter status di atas.</p>
          </div>
        ) : (
          filteredInstructors.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-[26px] border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              <div className="space-y-3.5">
                {/* Top Row: Specialization Badge & Status Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
                      inst.specialization === 'nautika'
                        ? 'bg-sky-50 text-[#0369A1] border border-sky-200'
                        : inst.specialization === 'teknika'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : inst.specialization === 'gmdss'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {inst.specialization === 'nautika' && <Compass className="w-3.5 h-3.5 text-[#0284C7]" />}
                    {inst.specialization === 'teknika' && <Anchor className="w-3.5 h-3.5 text-amber-600" />}
                    {inst.specialization === 'gmdss' && <Radio className="w-3.5 h-3.5 text-purple-600" />}
                    <span>{inst.specialization}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(inst.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      inst.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    }`}
                    title="Klik untuk mengubah status aktif/nonaktif"
                  >
                    <span className={`w-2 h-2 rounded-full ${inst.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span>{inst.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                </div>

                {/* Name & Title */}
                <div>
                  <h3 className="font-heading font-extrabold text-slate-900 text-base sm:text-[17px] leading-snug group-hover:text-[#0284C7] transition-colors">
                    {inst.full_name}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                    {inst.job_title || 'Instruktur Bahasa Inggris Maritim'}
                  </p>
                </div>

                {/* Meta details */}
                <div className="space-y-2 text-xs sm:text-[13px] text-slate-600 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{inst.email}</span>
                  </div>

                  {inst.phone_number && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{inst.phone_number}</span>
                    </div>
                  )}

                  {inst.certificate_number && (
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {inst.certificate_number}
                      </span>
                    </div>
                  )}
                </div>

                {/* About note */}
                {inst.about && (
                  <p className="text-xs sm:text-[13px] text-slate-600 italic bg-[#F8FAFC] p-3 rounded-2xl border border-slate-100 leading-relaxed line-clamp-2">
                    "{inst.about}"
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  Terdaftar: {formatDateIndo(inst.created_at)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(inst)}
                    className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shadow-2xs"
                    title="Edit Data Instruktur"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteInstructor(inst.id, inst.full_name)}
                    className="p-2 rounded-full border border-rose-100 bg-rose-50/70 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer shadow-2xs"
                    title="Hapus Akun Instruktur"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-slate-900 text-base">
                    {modalMode === 'add' ? 'Tambah Instruktur Maritim' : 'Edit Data Instruktur'}
                  </h2>
                  <p className="text-xs text-slate-500">Standar Sertifikasi Trainer IMO Model Course 6.09</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveInstructor} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Lengkap & Gelar:</label>
                <input
                  type="text"
                  placeholder="Contoh: Capt. Hendra Wijaya, M.Mar"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#5046E5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Instruktur (Login):</label>
                  <input
                    type="email"
                    placeholder="instructor@marlins.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#5046E5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">No. WhatsApp / HP:</label>
                  <input
                    type="tel"
                    placeholder="081234567890"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#5046E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bidang Spesialisasi:</label>
                  <select
                    value={formSpecialization}
                    onChange={(e: any) => setFormSpecialization(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#5046E5]"
                  >
                    <option value="nautika">Nautika & Navigasi Deck</option>
                    <option value="teknika">Teknika & Permesinan Engine</option>
                    <option value="gmdss">Komunikasi Radio GMDSS & SAR</option>
                    <option value="hospitality">Hospitality Kapal Pesiar</option>
                    <option value="general">Bahasa Inggris Maritim Umum</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status Keaktifan:</label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#5046E5]"
                  >
                    <option value="active">Aktif (Bisa Login & Kelola Soal)</option>
                    <option value="inactive">Nonaktif (Akses Ditutup)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">No. Registrasi / Sertifikat Instruktur IMO:</label>
                <input
                  type="text"
                  placeholder="IMO-6.09-ID-2026-..."
                  value={formCertNumber}
                  onChange={(e) => setFormCertNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#5046E5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Jabatan Akademik / Pekerjaan:</label>
                <input
                  type="text"
                  placeholder="Lead Maritime English Instructor & Assessor"
                  value={formJobTitle}
                  onChange={(e) => setFormJobTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#5046E5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deskripsi / Catatan Kredensial:</label>
                <textarea
                  rows={2}
                  placeholder="Informasi latar belakang maritim..."
                  value={formAbout}
                  onChange={(e) => setFormAbout(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#5046E5]"
                />
              </div>

              {modalMode === 'add' && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] space-y-1">
                  <span className="font-bold text-slate-800 block">Kredensial Default Login:</span>
                  <p>Email: <strong className="text-slate-900">{formEmail || 'nama@marlins.com'}</strong> • Password: <strong className="font-mono text-slate-900">password123</strong></p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {modalMode === 'add' ? 'Simpan Instruktur Baru' : 'Perbarui Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
