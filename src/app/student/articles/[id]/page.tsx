'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, User, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Article } from '@/lib/supabase/types';
import { formatDateIndo } from '@/lib/utils';

export default function SingleArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .maybeSingle();

        if (data) {
          setArticle(data as Article);
        } else {
          setArticle({
            id: articleId,
            title: 'Standard Marine Communication Phrases (SMCP) Essentials',
            summary: 'Panduan lengkap frasa komunikasi standar IMO untuk percakapan radio VHF antar kapal, VTS, dan stasiun pandu.',
            content: `Standard Marine Communication Phrases (SMCP) merupakan instrumen penting keselamatan maritim internasional yang ditetapkan oleh International Maritime Organization (IMO).

Dalam komunikasi navigasi maritim, kejelasan informasi dan penggunaan frasa yang seragam adalah kunci utama untuk mencegah salah pengertian dan bahaya tabrakan di laut.

### 1. Penggunaan Message Markers
Message Markers digunakan pada awal transmisi radio VHF untuk menegaskan maksud dari pesan yang disampaikan:
- **INSTRUCTION**: Pesan yang mengikat secara regulasi navigasi (misal instruksi VTS).
- **ADVICE**: Saran navigasi dari stasiun pandu atau otoritas pelabuhan.
- **WARNING**: Peringatan bahaya navigasi mendesak (misal kapal hanyut atau cuaca buruk).
- **INFORMATION**: Informasi umum posisi, draft, atau waktu kedatangan (ETA).
- **QUESTION**: Permintaan informasi spesifik.
- **ANSWER**: Jawaban atas pertanyaan yang diajukan.
- **REQUEST**: Permintaan bantuan atau asistensi (misal Tug assistance).
- **INTENTION**: Pernyataan manuver yang akan dilakukan oleh kapal.

### 2. Standar Respons Baku
Dalam komunikasi SMCP, respons harus ringkas dan jelas:
- Hindari kata ambigu seperti "Maybe" atau "I think so".
- Gunakan "Understood", "Mistake - correction", "Say again", dan "Stand by on VHF Channel 16".

Pelajari dan praktikkan frasa ini secara teratur untuk memastikan kesiapan penuh menghadapi ujian Marlins English Test.`,
            category: 'Radio Communication',
            author: 'Capt. Maritime Instructor',
            read_time_minutes: 6,
            is_published: true,
            created_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    }

    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  if (loading) {
    return (
      <div className="p-16 text-center bg-white border border-slate-100 rounded-[32px] max-w-md mx-auto space-y-4 shadow-2xs">
        <BookOpen className="w-10 h-10 text-[#5046E5] mx-auto animate-pulse" />
        <h2 className="text-sm font-extrabold text-slate-900">Memuat Materi Pembelajaran...</h2>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/student/articles"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#5046E5] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Pusat Materi</span>
      </Link>

      <article className="bg-white p-6 sm:p-10 rounded-[32px] border border-slate-100 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-[#5046E5] text-xs font-bold border border-indigo-100">
            {article.category || 'Maritime Studies'}
          </span>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#5046E5]" />
              <span>{article.read_time_minutes || 5} mnt membaca</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5046E5]" />
              <span>{formatDateIndo(article.created_at)}</span>
            </span>
          </div>
        </div>

        <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug">
          {article.title}
        </h1>

        {article.summary && (
          <div className="p-4 rounded-2xl bg-[#EEF0FF]/60 border-l-4 border-[#5046E5] text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed">
            "{article.summary}"
          </div>
        )}

        <div className="text-slate-800 text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line font-normal">
          {article.content}
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-[#5046E5] border border-indigo-100 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{article.author || 'Marlins Editorial Team'}</p>
              <p className="text-[10px] text-slate-400 font-medium">Maritime English Specialist</p>
            </div>
          </div>

          <Link
            href="/student/tests"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5046E5] text-white font-bold text-xs hover:bg-[#4338CA] transition-all shadow-md shadow-indigo-500/20"
          >
            <span>Uji Pemahaman</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
}
