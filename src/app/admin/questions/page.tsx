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
  SlidersHorizontal,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
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
      console.error('Save question error:', err);
      setFormError(err.message || 'Gagal menyimpan data soal');
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

  const formatQuestionTypeName = (type: string) => {
    const map: Record<string, string> = {
      multiple_choice: 'Multiple Choice',
      gap_fill: 'Gap Fill',
      sentence_reorder: 'Sentence Reorder',
      drag_drop_label: 'Drag & Drop',
      image_choice: 'Image Choice',
      paragraph_title_match: 'Title Match',
      audio_question: 'Audio Question',
      audio_listening: 'Audio Listening',
    };
    return map[type] || type;
  };

  return (
    <div className="space-y-6 min-w-0 font-sans">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
            <span className="font-bold text-slate-900">Bank Soal Standar IMO STCW & SMCP</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">Evaluation Repository</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Kelola Bank Soal Maritim
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Total <strong className="text-slate-900 font-bold">{questions.length}</strong> butir pertanyaan aktif. Tambah, edit, review interaktif, dan konfigurasi paket ujian secara realtime.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs text-white bg-slate-950 hover:bg-slate-800 shadow-md shadow-slate-900/15 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Soal Baru</span>
        </button>
      </div>

      {/* Modern Responsive Search & Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="relative lg:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari kata kunci soal, opsi, atau kunci jawaban..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 font-medium transition-all"
            />
          </div>

          {/* Test Package Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedTestNum}
              onChange={(e) => setSelectedTestNum(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-bold outline-none focus:bg-white focus:border-[#0284C7] transition-all cursor-pointer"
            >
              <option value="all">Semua Paket Tes</option>
              <option value="1">Paket #1 (Marlins Test 1)</option>
              <option value="2">Paket #2 (Marlins Test 2)</option>
              <option value="3">Paket #3 (Marlins Test 3)</option>
              <option value="4">Paket #4</option>
              <option value="5">Paket #5</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-bold outline-none focus:bg-white focus:border-[#0284C7] transition-all cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              <option value="grammar">Grammar</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="listening_comprehension">Listening Comprehension</option>
              <option value="reading_comprehension">Reading Comprehension</option>
              <option value="time_and_numbers">Time & Numbers</option>
              <option value="pronunciation">Pronunciation</option>
            </select>
          </div>

          {/* Question Type Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-bold outline-none focus:bg-white focus:border-[#0284C7] transition-all cursor-pointer"
            >
              <option value="all">Semua Tipe</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="gap_fill">Gap Fill</option>
              <option value="sentence_reorder">Sentence Reorder</option>
              <option value="drag_drop_label">Drag & Drop</option>
              <option value="image_choice">Image Choice</option>
              <option value="paragraph_title_match">Title Match</option>
              <option value="audio_listening">Audio Listening</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1 px-1 border-t border-slate-100">
          <span>Menampilkan <strong className="text-slate-900 font-bold">{filteredQuestions.length}</strong> butir soal</span>
          {(search || selectedCategory !== 'all' || selectedType !== 'all' || selectedTestNum !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedTestNum('all');
              }}
              className="text-[#0284C7] hover:text-[#0369A1] font-bold cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Questions Cards List */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-400 text-xs shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
            <HelpCircle className="w-4 h-4" />
          </div>
          <p className="font-semibold text-slate-700">Memuat bank soal dari database Supabase...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-500 text-sm shadow-2xs space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-slate-900 text-base">Tidak Ada Soal yang Sesuai</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori/tipe soal di atas.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const catInfo = getCategoryInfo(q.category);

            return (
              <div
                key={q.id}
                className="bg-white p-4.5 sm:p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-xs transition-all group"
              >
                {/* Left: Info & Prompt */}
                <div className="space-y-2 flex-1 min-w-0">
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${catInfo.bg} ${catInfo.color} border ${catInfo.border}`}
                    >
                      {catInfo.name}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-700 font-bold">
                      {formatQuestionTypeName(q.question_type)}
                    </span>

                    {q.marlint_test_number && (
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0369A1] text-[10px] font-extrabold border border-sky-200">
                        Paket #{q.marlint_test_number}
                      </span>
                    )}

                    {q.audio_url && (
                      <span className="flex items-center gap-1 text-[10px] text-[#C2410C] font-extrabold bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                        <Headphones className="w-3 h-3 text-[#EA580C]" /> Audio
                      </span>
                    )}
                  </div>

                  {/* Question Text */}
                  <p className="text-sm sm:text-base font-bold text-slate-950 leading-snug break-words">
                    {q.question_text}
                  </p>

                  {/* Answer Key */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>Kunci:</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 text-[11px] truncate max-w-md">
                      {q.correct_answer || '-'}
                    </span>
                  </div>
                </div>

                {/* Right: Actions (Preview, Edit, Delete) */}
                <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                  <button
                    type="button"
                    onClick={() => setPreviewQuestion(q)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-sky-50 hover:bg-sky-100 text-[#0284C7] border border-sky-200/80 transition-all cursor-pointer shadow-2xs"
                    title="Interactive Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(q)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer shadow-2xs"
                    title="Edit Soal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(q.id)}
                    className="p-2 rounded-full text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer shadow-2xs"
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

      {/* Modal: Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-sm w-full p-6 sm:p-7 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-slate-950">
                Hapus Butir Soal Ini?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Soal ini akan dihapus secara permanen dari bank soal database dan tidak dapat dipulihkan.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleDeleteQuestion(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                {saving ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Question */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="font-heading text-lg font-bold text-slate-950">
                {modalMode === 'create' ? 'Tambah Butir Soal Baru' : 'Edit Butir Soal'}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Paket Tes:</label>
                  <select
                    value={formData.marlint_test_number}
                    onChange={(e) => setFormData({ ...formData, marlint_test_number: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7]"
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
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7]"
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
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7]"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="gap_fill">Gap Fill</option>
                    <option value="sentence_reorder">Sentence Reorder</option>
                    <option value="drag_drop_label">Drag & Drop</option>
                    <option value="image_choice">Image Choice</option>
                    <option value="paragraph_title_match">Title Match</option>
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
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
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
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium font-mono outline-none focus:bg-white focus:border-[#0284C7]"
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
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Audio URL (Opsional):</label>
                  <input
                    type="url"
                    value={formData.audio_url}
                    onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                    placeholder="https://.../audio.mp3"
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
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
                  className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7]"
                />
              </div>

              {formError && (
                <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-2xl border border-rose-200 font-medium">
                  {formError}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Butir Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Interactive Preview */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                  Interactive Preview: {previewQuestion.category}
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-950">
                  Tipe Soal: {formatQuestionTypeName(previewQuestion.question_type)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audio player if audio exists */}
            {previewQuestion.audio_url && (
              <AudioListeningQuestion audioUrl={previewQuestion.audio_url} />
            )}

            {/* Prompt */}
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-bold text-slate-950 leading-relaxed">{previewQuestion.question_text}</p>
            </div>

            {/* Interactive Renderer Preview */}
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80">
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
                <p className="text-slate-700 font-medium">Penjelasan: {previewQuestion.explanation}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
