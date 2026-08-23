'use client';

import React, { useEffect, useState } from 'react';
import {
  HelpCircle,
  Search,
  Eye,
  Headphones,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  FileQuestion,
  Image as ImageIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Question, QuestionCategory, QuestionType } from '@/lib/supabase/types';
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
  const [selectedTestNum, setSelectedTestNum] = useState<string>('all');

  // Modals
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    category: 'grammar' as QuestionCategory,
    question_type: 'multiple_choice' as QuestionType,
    marlint_test_number: 1,
    question_text: '',
    optionsRaw: '',
    correct_answer: '',
    audio_url: '',
    explanation: '',
    points: 10,
  });

  const loadQuestions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      if (selectedType !== 'all') {
        query = query.eq('question_type', selectedType);
      }
      if (selectedTestNum !== 'all') {
        query = query.eq('marlint_test_number', Number(selectedTestNum));
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
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory, selectedType, selectedTestNum]);

  const handleOpenCreate = () => {
    setFormData({
      category: 'grammar',
      question_type: 'multiple_choice',
      marlint_test_number: 1,
      question_text: '',
      optionsRaw: 'Option A\nOption B\nOption C\nOption D',
      correct_answer: 'Option A',
      audio_url: '',
      explanation: '',
      points: 10,
    });
    setFormError(null);
    setModalMode('create');
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      category: q.category,
      question_type: q.question_type,
      marlint_test_number: q.marlint_test_number || 1,
      question_text: q.question_text,
      optionsRaw: Array.isArray(q.options) ? q.options.join('\n') : '',
      correct_answer: q.correct_answer || '',
      audio_url: q.audio_url || '',
      explanation: q.explanation || '',
      points: q.points || 10,
    });
    setFormError(null);
    setModalMode('edit');
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFormError(null);

      const parsedOptions = formData.optionsRaw
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: any = {
        category: formData.category,
        question_type: formData.question_type,
        marlint_test_number: Number(formData.marlint_test_number),
        question_text: formData.question_text.trim(),
        options: parsedOptions.length > 0 ? parsedOptions : null,
        correct_answer: formData.correct_answer.trim(),
        audio_url: formData.audio_url.trim() || null,
        explanation: formData.explanation.trim() || null,
        points: Number(formData.points) || 10,
        is_active: true,
      };

      if (modalMode === 'create') {
        const { error } = await supabase.from('questions').insert([payload]);
        if (error) throw error;
      } else if (modalMode === 'edit' && editingQuestion?.id) {
        const { error } = await supabase
          .from('questions')
          .update(payload)
          .eq('id', editingQuestion.id);
        if (error) throw error;
      }

      setModalMode(null);
      await loadQuestions();
    } catch (err: any) {
      console.error('Error saving question:', err);
      setFormError(err.message || 'Gagal menyimpan butir soal.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      setSaving(true);
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) throw error;
      setDeleteConfirmId(null);
      await loadQuestions();
    } catch (err: any) {
      alert('Gagal menghapus soal: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.question_text.toLowerCase().includes(search.toLowerCase()) ||
    (q.correct_answer && q.correct_answer.toLowerCase().includes(search.toLowerCase())) ||
    (q.explanation && q.explanation.toLowerCase().includes(search.toLowerCase()))
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
            Total {questions.length} butir pertanyaan aktif. Tambah, edit, dan konfigurasi soal secara realtime.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-950 hover:bg-slate-800 shadow-md shadow-slate-900/15 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Soal Baru</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-3">
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

        {/* Test Number Filter */}
        <select
          value={selectedTestNum}
          onChange={(e) => setSelectedTestNum(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
        >
          <option value="all">Semua Paket Tes</option>
          <option value="1">Paket #1 (Marlins Test 1)</option>
          <option value="2">Paket #2 (Marlins Test 2)</option>
          <option value="3">Paket #3 (Marlins Test 3)</option>
          <option value="4">Paket #4</option>
          <option value="5">Paket #5</option>
        </select>

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
          <option value="drag_drop_label">Drag & Drop Label</option>
          <option value="image_choice">Image Choice</option>
          <option value="paragraph_title_match">Paragraph Title Match</option>
          <option value="audio_question">Audio Question</option>
          <option value="audio_listening">Audio Listening</option>
        </select>
      </div>

      {/* Questions Table / List */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm">
          Memuat bank soal dari database...
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm shadow-sm space-y-2">
          <FileQuestion className="w-8 h-8 mx-auto text-slate-400" />
          <p className="font-semibold text-slate-700">Tidak ada soal yang sesuai dengan kriteria filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const catInfo = getCategoryInfo(q.category);

            return (
              <div
                key={q.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${catInfo.bg} ${catInfo.color} border ${catInfo.border}`}
                    >
                      {catInfo.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-mono font-bold">
                      {q.question_type}
                    </span>
                    {q.marlint_test_number && (
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[10px] font-mono font-bold border border-sky-200">
                        Tes #{q.marlint_test_number}
                      </span>
                    )}
                    {q.audio_url && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Headphones className="w-3 h-3" /> Audio
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-slate-900 pt-0.5 leading-snug break-words">
                    {q.question_text}
                  </p>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    Kunci Jawaban: <strong className="text-emerald-700 font-bold">{q.correct_answer || '-'}</strong>
                  </p>
                </div>

                {/* Actions: Preview, Edit, Delete */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPreviewQuestion(q)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                    title="Preview Soal"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(q)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all cursor-pointer"
                    title="Edit Soal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(q.id)}
                    className="p-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Hapus Butir Soal Ini?
            </h3>
            <p className="text-xs text-slate-500">
              Soal ini akan dihapus secara permanen dari bank soal database dan tidak dapat dipulihkan.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleDeleteQuestion(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
              >
                {saving ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Question Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading text-lg font-bold text-slate-900">
                {modalMode === 'create' ? 'Tambah Butir Soal Baru' : 'Edit Butir Soal'}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Paket Tes:</label>
                  <select
                    value={formData.marlint_test_number}
                    onChange={(e) => setFormData({ ...formData, marlint_test_number: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                  >
                    <option value={1}>Marlins Test 1</option>
                    <option value={2}>Marlins Test 2</option>
                    <option value={3}>Marlins Test 3</option>
                    <option value={4}>Marlins Test 4</option>
                    <option value={5}>Marlins Test 5</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Kategori Modul:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as QuestionCategory })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                  >
                    <option value="grammar">Grammar</option>
                    <option value="vocabulary">Vocabulary</option>
                    <option value="listening_comprehension">Listening</option>
                    <option value="reading_comprehension">Reading</option>
                    <option value="time_and_numbers">Time & Numbers</option>
                    <option value="pronunciation">Pronunciation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tipe Soal:</label>
                  <select
                    value={formData.question_type}
                    onChange={(e) => setFormData({ ...formData, question_type: e.target.value as QuestionType })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="gap_fill">Gap Fill</option>
                    <option value="sentence_reorder">Sentence Reorder</option>
                    <option value="drag_drop_label">Drag & Drop Label</option>
                    <option value="image_choice">Image Choice</option>
                    <option value="paragraph_title_match">Paragraph Title Match</option>
                    <option value="audio_question">Audio Question</option>
                    <option value="audio_listening">Audio Listening</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Teks Pertanyaan / Instruksi:</label>
                <textarea
                  rows={3}
                  required
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="Ketik teks pertanyaan atau instruksi soal maritim..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Pilihan Opsi Jawaban (1 Baris per Opsi):
                </label>
                <textarea
                  rows={4}
                  value={formData.optionsRaw}
                  onChange={(e) => setFormData({ ...formData, optionsRaw: e.target.value })}
                  placeholder="Opsi A&#10;Opsi B&#10;Opsi C&#10;Opsi D"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Kunci Jawaban Benar:</label>
                  <input
                    type="text"
                    required
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    placeholder="Contoh: Option A atau kata kunci"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Audio URL (Opsional):</label>
                  <input
                    type="url"
                    value={formData.audio_url}
                    onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                    placeholder="https://.../audio.mp3"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Penjelasan / Pembahasan (Opsional):</label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Penjelasan gramatikal atau referensi IMO SMCP..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium"
                />
              </div>

              {formError && (
                <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
                  {formError}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Butir Soal'}
                </button>
              </div>
            </form>
          </div>
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
                type="button"
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
