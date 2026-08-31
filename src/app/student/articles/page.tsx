'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Radio,
  Compass,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Bookmark,
  Award,
  Filter,
  Volume2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Article } from '@/lib/supabase/types';

const DEFAULT_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Standard Marine Communication Phrases (SMCP) Essentials',
    summary: 'Panduan lengkap frasa komunikasi standar IMO untuk percakapan radio VHF antar kapal, VTS, dan stasiun pandu pelabuhan.',
    content: `Standard Marine Communication Phrases (SMCP) merupakan instrumen penting keselamatan maritim internasional yang ditetapkan oleh International Maritime Organization (IMO).

Dalam komunikasi navigasi maritim, kejelasan informasi dan penggunaan frasa yang seragam adalah kunci utama untuk mencegah salah pengertian dan bahaya tabrakan di laut.

### 1. Penggunaan Message Markers
Message Markers digunakan pada awal transmisi radio VHF untuk menegaskan maksud dari pesan yang disampaikan:
- **INSTRUCTION**: Pesan yang mengikat secara regulasi navigasi (misal instruksi dari VTS).
- **ADVICE**: Saran navigasi dari stasiun pandu atau otoritas pelabuhan.
- **WARNING**: Peringatan bahaya navigasi mendesak (misal kapal hanyut, cuaca buruk, buoy padam).
- **INFORMATION**: Informasi umum mengenai posisi, draft, atau perkiraan waktu kedatangan (ETA).
- **QUESTION**: Permintaan informasi spesifik dari stasiun kapal lain.
- **ANSWER**: Jawaban langsung atas pertanyaan yang telah diajukan.
- **REQUEST**: Permintaan bantuan atau asistensi operasional (misal Tug assistance).
- **INTENTION**: Pernyataan tindakan manuver yang akan segera dilakukan oleh kapal.

### 2. Standar Respons Baku (Standard Responses)
Dalam komunikasi SMCP, setiap respons harus ringkas, tegas, dan tidak boleh ambigu:
- Hindari kata yang tidak pasti seperti *"Maybe"* atau *"I think so"*.
- Gunakan frasa resmi: **"Understood"**, **"Mistake - correction"**, **"Say again"**, dan **"Stand by on VHF Channel 16"**.

Pelajari dan praktikkan frasa ini secara teratur untuk memastikan kesiapan penuh menghadapi evaluasi Marlins English Test.`,
    category: 'Radio Communication',
    author: 'Capt. Maritime Instructor',
    read_time_minutes: 6,
    is_published: true,
    created_at: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 'art-2',
    title: 'Essential Maritime Vocabulary: Deck & Engine Terminology',
    summary: 'Daftar istilah kunci kosakata maritim seputar peralatan geladak kapal, kamar mesin, tali-temali, dan penataan kargo.',
    content: `Penguasaan kosakata teknis geladak (*deck*) dan kamar mesin (*engine room*) adalah fondasi mutlak bagi setiap pelaut yang bekerja di armada niaga maupun kapal pesiar internasional.

### 1. Istilah Geladak & Olah Gerak (Deck Terminology)
Kosakata harian operasional geladak kapal:
- **Windlass**: Mesin derek jangkar untuk mengangkat dan menurunkan rantai jangkar.
- **Fairlead**: Pemandu tali tambat agar tidak bergesekan langsung dengan lambung kapal.
- **Bollard**: Tiang besi kokoh di dermaga atau geladak untuk mengikatkan tali tambat (*mooring line*).
- **Heave Up**: Perintah untuk menarik tali atau rantai ke atas menggunakan mesin derek.
- **Slack Away**: Perintah untuk mengendurkan tali tambat secara bertahap dan aman.

### 2. Istilah Kamar Mesin (Engine Terminology)
Istilah penting permesinan kapal:
- **Auxiliary Engine**: Mesin bantu diesel penghasil daya listrik utama bagi seluruh sistem kapal.
- **Bilge Pump**: Pompa khusus untuk membuang akumulasi air got dari bagian terendah lambung kapal.
- **Scavenge Air**: Udara bertekanan bersih yang disuplai ke silinder mesin untuk pembakaran optimal.
- **Fuel Oil Purifier**: Alat pemisah sentrifugal untuk memurnikan bahan bakar minyak dari kotoran dan air.`,
    category: 'Vocabulary',
    author: 'Chief Engineer Consultant',
    read_time_minutes: 5,
    is_published: true,
    created_at: '2026-02-18T00:00:00.000Z',
  },
  {
    id: 'art-3',
    title: 'Mastering Prepositions and Directions at Sea',
    summary: 'Memahami preposisi arah navigasi kapal: Ahead, Astern, Abeam, Port side, Starboard side, Forward, dan Aft.',
    content: `Bahasa Inggris Maritim memiliki tata cara penunjukan arah dan posisi spasial yang sangat spesifik untuk mencegah kesalahan navigasi antar perwira jaga di anjungan (*bridge*).

### 1. Kuadran Posisi Kapal (Relative Bearings)
Penunjukan posisi relatif objek terhadap haluan kapal:
- **Ahead**: Tepat lurus di depan haluan kapal (000° relatif).
- **Astern**: Tepat lurus di belakang buritan kapal (180° relatif).
- **Abeam Port**: Tepat 90 derajat di lambung kiri kapal.
- **Abeam Starboard**: Tepat 90 derajat di lambung kanan kapal.
- **On the Starboard Bow**: Berada di arah serong depan sebelah kanan kapal (kira-kira 045°).
- **On the Port Quarter**: Berada di arah serong belakang sebelah kiri kapal (kira-kira 225°).

### 2. Arah di Dalam Kapal (Internal Vessel Directions)
Pergerakan di atas kapal:
- **Forward (Fwd)**: Bergerak menuju ke arah haluan (depan kapal).
- **Aft**: Bergerak menuju ke arah buritan (belakang kapal).
- **Athwartships**: Melintang dari satu sisi lambung ke sisi lambung lainnya.`,
    category: 'Grammar & Navigation',
    author: 'Navigation Deck Officer',
    read_time_minutes: 4,
    is_published: true,
    created_at: '2026-02-20T00:00:00.000Z',
  },
  {
    id: 'art-4',
    title: 'Emergency Drill Commands and Life-Saving Appliances (LSA)',
    summary: 'Perintah baku saat latihan darurat kapal: Fire Drill, Abandon Ship, Man Overboard (MOB), dan pengoperasian LSA.',
    content: `Kesiapan menghadapi situasi darurat di laut diatur secara ketat oleh konvensi SOLAS (*Safety of Life at Sea*). Setiap kru kapal wajib memahami komando audio dan terminologi keselamatan internasional.

### 1. Isyarat Darurat Umum (Alarm Signals)
Kenali bunyi tanda bahaya di atas kapal:
- **General Emergency Alarm**: Tujuh tiupan/bunyi pendek disusul satu bunyi panjang (7 short blasts + 1 prolonged blast).
- **Fire Alarm**: Bunyi sirine terus-menerus (*continuous ringing*).
- **Abandon Ship Order**: Hanya diberikan langsung secara verbal oleh Nakhoda (*Master*).

### 2. Peralatan Keselamatan Jiwa (Life-Saving Appliances)
Peralatan wajib standar IMO SOLAS:
- **Muster Station**: Titik kumpul yang telah ditentukan bagi seluruh penumpang dan awak kapal saat terjadi situasi darurat.
- **Immersion Suit**: Pakaian pelindung termal tahan air untuk mencegah hipotermia di air laut dingin.
- **EPIRB (Emergency Position Indicating Radio Beacon)**: Pemancar sinyal darurat satelit otomatis untuk lokasi kapal tenggelam.
- **SART (Search and Rescue Transponder)**: Perangkat radar pencari lokasi sekoci penolong oleh kapal penolong.
- **Lifebuoy with Self-Igniting Light**: Pelampung penolong yang dilengkapi lampu otomatis menyala saat tercebur ke laut.`,
    category: 'Safety & Emergency',
    author: 'Safety Officer & Auditor',
    read_time_minutes: 7,
    is_published: true,
    created_at: '2026-02-22T00:00:00.000Z',
  },
];

function ArticlesContent() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>(DEFAULT_ARTICLES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'radio' | 'vocab' | 'grammar' | 'safety'>('all');

  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q');
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setArticles(data as Article[]);
        } else {
          setArticles(DEFAULT_ARTICLES);
        }
      } catch (err) {
        console.error('Error loading articles:', err);
        setArticles(DEFAULT_ARTICLES);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  const getCategoryIcon = (category?: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('radio') || cat.includes('communication')) {
      return <Radio className="w-4 h-4 text-sky-600" />;
    }
    if (cat.includes('vocab') || cat.includes('vocabulary')) {
      return <BookOpen className="w-4 h-4 text-indigo-600" />;
    }
    if (cat.includes('grammar') || cat.includes('navig')) {
      return <Compass className="w-4 h-4 text-emerald-600" />;
    }
    return <ShieldAlert className="w-4 h-4 text-amber-600" />;
  };

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.summary && art.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.category && art.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.content && art.content.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'radio') return art.category?.toLowerCase().includes('radio');
    if (selectedCategory === 'vocab') return art.category?.toLowerCase().includes('vocab');
    if (selectedCategory === 'grammar') return art.category?.toLowerCase().includes('grammar') || art.category?.toLowerCase().includes('navig');
    if (selectedCategory === 'safety') return art.category?.toLowerCase().includes('safe') || art.category?.toLowerCase().includes('emerg');

    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-7 max-w-7xl mx-auto font-sans pb-16 min-w-0">
      
      {/* Top Hero Banner — Rich Executive Maritime Styling */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] p-6 sm:p-8 text-white shadow-lg shadow-sky-500/15">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-cyan-200 backdrop-blur-xs w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pusat Pembelajaran Maritim</span>
            <span className="text-white/30">•</span>
            <span className="text-slate-200 font-medium">Standar IMO SMCP & STCW</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Modul & Referensi Bahasa Inggris Pelaut
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
            Tingkatkan penguasaan kosakata teknis, dialog radio VHF maritim, komando darurat SOLAS, dan tata bahasa navigasi untuk persiapan ujian Marlins Test dan wawancara kapal pesiar internasional.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-cyan-100">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15">
              <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
              <span>{articles.length} Modul Terstruktur</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15">
              <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Fitur Audio Pronunciation</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Persiapan Marlins Test B2-C1</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0284C7] text-white shadow-md shadow-sky-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            Semua Modul ({articles.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('radio')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'radio'
                ? 'bg-[#0284C7] text-white shadow-md shadow-sky-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            Radio SMCP
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('vocab')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'vocab'
                ? 'bg-[#0284C7] text-white shadow-md shadow-sky-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            Vocabulary Dek & Mesin
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('grammar')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'grammar'
                ? 'bg-[#0284C7] text-white shadow-md shadow-sky-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            Arah & Navigasi
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('safety')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'safety'
                ? 'bg-[#0284C7] text-white shadow-md shadow-sky-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            Keselamatan (LSA/SOLAS)
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kata kunci, topik, frasa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#0284C7] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Grid of Learning Articles */}
      {loading ? (
        <div className="p-16 text-center bg-white border border-slate-200/80 rounded-3xl text-slate-400 text-xs shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-spin">
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="font-bold text-slate-700">Memuat modul pembelajaran maritim...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-14 text-center bg-white border border-slate-200/80 rounded-3xl text-slate-500 text-xs shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Materi Tidak Ditemukan</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Tidak ada modul yang cocok dengan pencarian "{searchQuery}". Coba kata kunci lain atau reset filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.map((art) => (
            <Link
              key={art.id}
              href={`/student/articles/${art.id}`}
              className="bg-white p-6 sm:p-7 rounded-[26px] border border-slate-200/90 hover-lift shadow-2xs flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              {/* Subtle Ambient Color Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] to-[#0369A1] opacity-90" />

              <div className="space-y-3.5">
                {/* Header Tag and Module Type */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1.5 rounded-lg bg-sky-50 border border-sky-100 shrink-0">
                      {getCategoryIcon(art.category)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-[11px] font-bold tracking-tight">
                      {art.category || 'IMO SMCP'}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Modul Mandiri
                  </span>
                </div>

                {/* Article Title */}
                <h2 className="font-heading text-base sm:text-lg font-bold text-slate-950 group-hover:text-[#0284C7] transition-colors leading-snug">
                  {art.title}
                </h2>

                {/* Summary */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-normal">
                  {art.summary || art.content}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>{art.read_time_minutes || 5} menit membaca</span>
                </span>

                <span className="font-bold text-slate-900 group-hover:text-[#0284C7] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Pelajari Modul</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudentArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[28px] text-slate-400 text-xs shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="font-bold text-slate-700">Memuat materi maritim...</p>
        </div>
      }
    >
      <ArticlesContent />
    </Suspense>
  );
}
