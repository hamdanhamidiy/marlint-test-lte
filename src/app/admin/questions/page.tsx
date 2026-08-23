'use client';

import React, { useEffect, useState } from 'react';
import {
  HelpCircle,
  Search,
  Eye,
  Headphones,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Question } from '@/lib/supabase/types';
import { getCategoryInfo } from '@/lib/utils';
import MultipleChoiceQuestion from '@/components/test-engine/MultipleChoiceQuestion';
import GapFillQuestion from '@/components/test-engine/GapFillQuestion';
import SentenceReorderQuestion from '@/components/test-engine/SentenceReorderQuestion';
import DragDropLabelQuestion from '@/components/test-engine/DragDropLabelQuestion';
import ImageChoiceQuestion from '@/components/test-engine/ImageChoiceQuestion';
import ParagraphTitleMatchQuestion from '@/components/test-engine/ParagraphTitleMatchQuestion';
import AudioListeningQuestion from '@/components/test-engine/AudioListeningQuestion';

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        let query = supabase
          .from('questions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (selectedCategory !== 'all') {
          query = query.eq('category', selectedCategory);
        }
        if (selectedType !== 'all') {
          query = query.eq('question_type', selectedType);
        }

        const { data, error } = await query;
        if (data) {
          setQuestions(data as Question[]);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [selectedCategory, selectedType]);

  const filteredQuestions = questions.filter((q) =>
    q.question_text.toLowerCase().includes(search.toLowerCase()) ||
    (q.correct_answer && q.correct_answer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span>Bank Soal Ujian Marlins</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
            Kelola Bank Soal Maritim
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Daftar seluruh butir pertanyaan, listening audio, dan modul interaktif yang aktif di sistem.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari teks soal atau kunci..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
        >
          <option value="all">Semua Kategori</option>
          <option value="grammar">Grammar</option>
          <option value="vocabulary">Vocabulary</option>
          <option value="listening_comprehension">Listening</option>
          <option value="reading_comprehension">Reading</option>
          <option value="time_and_numbers">Time & Numbers</option>
          <option value="pronunciation">Pronunciation</option>
        </select>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
        >
          <option value="all">Semua Tipe Soal</option>
          <option value="multiple_choice">Multiple Choice</option>
          <option value="gap_fill">Gap Fill</option>
          <option value="sentence_reorder">Sentence Reorder</option>
          <option value="drag_drop_label">Drag & Drop</option>
          <option value="image_choice">Image Choice</option>
          <option value="paragraph_title_match">Paragraph Title Match</option>
          <option value="audio_question">Audio Question</option>
        </select>
      </div>

      {/* Questions Table / List */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Memuat bank soal...
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Tidak ada soal yang sesuai dengan kriteria filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const catInfo = getCategoryInfo(q.category);

            return (
              <div
                key={q.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${catInfo.bg} ${catInfo.color} border ${catInfo.border}`}
                    >
                      {catInfo.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-mono font-bold">
                      {q.question_type}
                    </span>
                    {q.marlint_test_number && (
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono font-bold border border-blue-200">
                        Tes #{q.marlint_test_number}
                      </span>
                    )}
                    {q.audio_url && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                        <Headphones className="w-3 h-3" /> Audio
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-slate-900 pt-1 leading-snug">{q.question_text}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Kunci: <strong className="text-emerald-700 font-bold">{q.correct_answer || '-'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPreviewQuestion(q)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Interactive Preview: {previewQuestion.category}
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Tipe Soal: {previewQuestion.question_type}
                </h3>
              </div>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audio player if audio exists */}
            {previewQuestion.audio_url && (
              <AudioListeningQuestion audioUrl={previewQuestion.audio_url} />
            )}

            {/* Prompt */}
            <div className="space-y-2">
              <p className="text-base font-bold text-slate-900">{previewQuestion.question_text}</p>
            </div>

            {/* Interactive Renderer Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              {previewQuestion.question_type === 'gap_fill' ? (
                <GapFillQuestion question={previewQuestion} onAnswer={() => {}} />
              ) : previewQuestion.question_type === 'sentence_reorder' ? (
                <SentenceReorderQuestion question={previewQuestion} onAnswer={() => {}} />
              ) : previewQuestion.question_type === 'drag_drop_label' ? (
                <DragDropLabelQuestion question={previewQuestion} onAnswer={() => {}} />
              ) : previewQuestion.question_type === 'image_choice' ? (
                <ImageChoiceQuestion question={previewQuestion} onAnswer={() => {}} />
              ) : previewQuestion.question_type === 'paragraph_title_match' ? (
                <ParagraphTitleMatchQuestion question={previewQuestion} onAnswer={() => {}} />
              ) : (
                <MultipleChoiceQuestion question={previewQuestion} onAnswer={() => {}} />
              )}
            </div>

            {/* Answer details */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
              <p className="font-bold text-emerald-800">
                Kunci Jawaban Resmi: {previewQuestion.correct_answer}
              </p>
              {previewQuestion.explanation && (
                <p className="text-slate-700">Penjelasan: {previewQuestion.explanation}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
