'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Article } from '@/lib/supabase/types';

export default function StudentArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
          setArticles([
            {
              id: 'art-1',
              title: 'Standard Marine Communication Phrases (SMCP) Essentials',
              summary: 'Panduan lengkap frasa komunikasi standar IMO untuk percakapan radio VHF antar kapal, VTS, dan stasiun pandu.',
              content: 'Standard Marine Communication Phrases (SMCP) dikembangkan oleh International Maritime Organization (IMO) untuk meningkatkan keselamatan navigasi. Penggunaan Message Markers seperti "INSTRUCTION", "ADVICE", "WARNING", dan "INFORMATION" memastikan tidak ada ambiguitas dalam komunikasi radio kapal.',
              category: 'Radio Communication',
              author: 'Capt. Maritime Instructor',
              read_time_minutes: 6,
              is_published: true,
              created_at: new Date().toISOString(),
            },
            {
              id: 'art-2',
              title: 'Essential Maritime Vocabulary: Deck & Engine Terminology',
              summary: 'Daftar istilah kunci kosakata maritim seputar peralatan geladak, kamar mesin, tali-temali, dan penataan kargo.',
              content: 'Pelaut wajib memahami perbedaan istilah teknis seperti "Heave up", "Slack away", "Bollard", "Windlass", "Fairlead", serta indikator mesin seperti "Auxiliary Engine", "Scavenge Air", dan "Bilge Pump" dalam percakapan kerja harian.',
              category: 'Vocabulary',
              author: 'Chief Engineer Consultant',
              read_time_minutes: 5,
              is_published: true,
              created_at: new Date().toISOString(),
            },
            {
              id: 'art-3',
              title: 'Mastering Prepositions and Directions at Sea',
              summary: 'Memahami penggunaan preposisi arah kapal: Ahead, Astern, Abeam, Port side, Starboard side, Forward, dan Aft.',
              content: 'Penggunaan arah kapal dalam Bahasa Inggris Maritim berbeda dengan bahasa sehari-hari. Istilah seperti "Vessel is approaching on our starboard bow" atau "Keep clear of the stern" adalah frasa krusial dalam tugas jaga laut (Bridge Watchkeeping).',
              category: 'Grammar & Navigation',
              author: 'Navigation Deck Officer',
              read_time_minutes: 4,
              is_published: true,
              created_at: new Date().toISOString(),
            },
            {
              id: 'art-4',
              title: 'Emergency Drill Commands and Life-Saving Appliances (LSA)',
              summary: 'Perintah baku saat latihan darurat di kapal: Fire Drill, Abandon Ship, Man Overboard, dan penggunaan LSA.',
              content: 'Latihan keselamatan di atas kapal menuntut respons cepat terhadap perintah darurat dalam bahasa Inggris. Kenali istilah seperti "Muster Station", "Immersion Suit", "EPIRB", "SART", "Lifebuoy", dan "Hydrostatic Release Unit".',
              category: 'Safety & Emergency',
              author: 'Safety Officer',
              read_time_minutes: 7,
              is_published: true,
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.summary && a.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.category && a.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEF0FF] text-[#5046E5] text-[11px] font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pusat Pembelajaran Maritim</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900">
            Materi & Referensi Bahasa Inggris Pelaut
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Perkaya perbendaharaan kosakata, tata bahasa, dan frasa navigasi kapal standar internasional IMO SMCP.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari materi maritim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5046E5]/20 focus:border-[#5046E5] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-100 rounded-3xl text-slate-400 text-xs shadow-2xs">
          Memuat artikel pembelajaran...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-100 rounded-3xl text-slate-400 text-xs shadow-2xs">
          Tidak ada artikel yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.map((art) => (
            <Link
              key={art.id}
              href={`/student/articles/${art.id}`}
              className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-100 hover:border-indigo-200 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4 transition-all group"
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-[#5046E5] text-[11px] font-bold border border-indigo-100">
                  {art.category || 'Maritime Studies'}
                </span>

                <h2 className="font-heading text-base font-extrabold text-slate-900 group-hover:text-[#5046E5] transition-colors leading-snug">
                  {art.title}
                </h2>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-normal">
                  {art.summary || art.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#5046E5]" />
                  <span>{art.read_time_minutes || 5} menit membaca</span>
                </span>

                <span className="font-bold text-[#5046E5] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Baca Materi <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
