'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  User,
  Calendar,
  ArrowRight,
  Sparkles,
  Volume2,
  Share2,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  Radio,
  FileText,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Article } from '@/lib/supabase/types';
import { formatDateIndo } from '@/lib/utils';

// Helper to parse inline markdown like **bold** text
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Structured content renderer that transforms raw markdown into clean UI components
function renderArticleContent(rawContent: string) {
  if (!rawContent) return null;

  // Split content by double newlines into blocks
  const blocks = rawContent.split(/\n\n+/);

  return blocks.map((block, blockIdx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Heading 3 detection (### Title)
    if (trimmed.startsWith('###')) {
      const lines = trimmed.split('\n');
      const headingText = lines[0].replace(/^###\s*/, '').trim();
      const restLines = lines.slice(1).join('\n').trim();

      return (
        <div key={blockIdx} className="space-y-4 pt-4 border-t border-slate-100 first:pt-0 first:border-0">
          <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-950 flex items-center gap-2.5 tracking-tight">
            <span className="w-1.5 h-5 rounded-full bg-[#0284C7] shrink-0" />
            <span>{headingText}</span>
          </h3>

          {restLines && renderBlockBody(restLines, `${blockIdx}-sub`)}
        </div>
      );
    }

    // Heading 2 detection (## Title)
    if (trimmed.startsWith('##')) {
      const lines = trimmed.split('\n');
      const headingText = lines[0].replace(/^##\s*/, '').trim();
      const restLines = lines.slice(1).join('\n').trim();

      return (
        <div key={blockIdx} className="space-y-4 pt-5 border-t border-slate-100 first:pt-0 first:border-0">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-3">
            <span className="w-2 h-6 rounded-full bg-[#0284C7] shrink-0" />
            <span>{headingText}</span>
          </h2>

          {restLines && renderBlockBody(restLines, `${blockIdx}-sub`)}
        </div>
      );
    }

    return renderBlockBody(trimmed, blockIdx);
  });
}

function renderBlockBody(text: string, keyPrefix: string | number) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // Check if this block is a list of items starting with '- '
  const isBulletList = lines.every((l) => l.startsWith('- ') || l.startsWith('* '));

  if (isBulletList) {
    const isKeyValueList = lines.some((l) => l.includes('**') && l.includes(':'));

    if (isKeyValueList) {
      // Render as rich modern key-value definition cards
      return (
        <div key={keyPrefix} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 pb-2">
          {lines.map((line, lIdx) => {
            const cleanLine = line.replace(/^[-*]\s*/, '');
            // Extract **KEY**: Value
            const match = cleanLine.match(/^\*\*(.*?)\*\*:\s*(.*)$/);

            if (match) {
              const [, key, val] = match;
              return (
                <div
                  key={lIdx}
                  className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/30 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-sky-50 text-[#0284C7] border border-sky-100 font-mono text-[11px] font-bold uppercase tracking-wider group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
                      {key}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {parseInlineMarkdown(val)}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={lIdx}
                className="col-span-full flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed p-2.5 rounded-xl bg-slate-50 border border-slate-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                <span>{parseInlineMarkdown(cleanLine)}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // Standard styled bullet list with custom bullet indicators
    return (
      <div key={keyPrefix} className="space-y-2.5 py-1">
        {lines.map((line, lIdx) => {
          const cleanLine = line.replace(/^[-*]\s*/, '');
          return (
            <div key={lIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] mt-2 shrink-0 shadow-2xs" />
              <span>{parseInlineMarkdown(cleanLine)}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Mixed or regular paragraph
  return (
    <div key={keyPrefix} className="space-y-2">
      {lines.map((line, lIdx) => {
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const cleanLine = line.replace(/^[-*]\s*/, '');
          return (
            <div key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-2 shrink-0" />
              <span>{parseInlineMarkdown(cleanLine)}</span>
            </div>
          );
        }
        return (
          <p key={lIdx} className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {parseInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function SingleArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center bg-white border border-slate-200/80 rounded-3xl max-w-md mx-auto space-y-3 shadow-2xs">
        <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
          <BookOpen className="w-4 h-4" />
        </div>
        <h2 className="text-xs font-bold text-slate-700">Memuat Materi Pembelajaran...</h2>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/student/articles"
          className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-black transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:border-black group-hover:text-black transition-all shadow-2xs">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Kembali ke Pusat Materi</span>
        </Link>

        {/* Quick Utilities: Bookmark & Share */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-full border text-xs font-medium transition-all cursor-pointer shadow-2xs ${
              isBookmarked
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'bg-white border-slate-200 text-slate-600 hover:text-black hover:border-slate-300'
            }`}
            title="Simpan Modul"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-black hover:border-slate-300 text-xs font-medium transition-all cursor-pointer shadow-2xs"
            title="Bagikan Tautan"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 text-[11px] font-bold">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Bagikan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Article Card */}
      <article className="bg-white p-6 sm:p-10 rounded-[28px] border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6 relative overflow-hidden">
        
        {/* Subtle Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] opacity-90" />

        {/* Category & Meta Information */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 pt-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-xs font-bold uppercase tracking-wider">
              {article.category || 'IMO SMCP'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
              <Radio className="w-3 h-3 text-amber-600" />
              <span>VHF Standar</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>{article.read_time_minutes || 5} menit baca</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDateIndo(article.created_at)}</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-950 leading-[1.25] tracking-tight">
          {article.title}
        </h1>

        {/* Key Summary / Takeaway Quote Box */}
        {article.summary && (
          <div className="p-4.5 sm:p-5 rounded-2xl bg-[#F8FAFC] border-l-4 border-[#0284C7] text-xs sm:text-sm text-slate-700 font-medium leading-relaxed shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#0284C7] block">Ringkasan Materi</span>
            <p className="italic">"{article.summary}"</p>
          </div>
        )}

        {/* Structured Body Content */}
        <div className="space-y-5 pt-2">
          {renderArticleContent(article.content)}
        </div>

        {/* Footer: Author Card & Action CTA */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 p-0.5 shadow-2xs flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-lg">
                👨‍✈️
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">{article.author || 'Capt. Maritime Instructor'}</p>
              <p className="text-[11px] text-slate-400 font-normal">IMO SMCP Lead Instructor</p>
            </div>
          </div>

          <Link
            href="/student/tests"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Uji Pemahaman Soal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
}
