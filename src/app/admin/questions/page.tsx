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
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter,
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
import {
  MARLINS_60_STANDARD_QUESTIONS,
  MARLINS_TEST_2_STANDARD_QUESTIONS,
  MARLINS_TEST_3_STANDARD_QUESTIONS,
  MARLINS_TEST_4_STANDARD_QUESTIONS,
  MARLINS_TEST_5_STANDARD_QUESTIONS,
  MARLINS_TEST_6_STANDARD_QUESTIONS,
  MARLINS_TEST_7_STANDARD_QUESTIONS,
  MARLINS_TEST_8_STANDARD_QUESTIONS,
  MARLINS_TEST_9_STANDARD_QUESTIONS,
  MARLINS_TEST_10_STANDARD_QUESTIONS,
} from '@/lib/marlinsQuestionBank';

import { getRichQuestionExplanation } from '@/lib/questionExplanations';

const STANDARD_QUESTIONS_BANK: Question[] = [
  ...MARLINS_60_STANDARD_QUESTIONS.map((q) => ({ ...q, marlint_test_number: 1 })),
  ...MARLINS_TEST_2_STANDARD_QUESTIONS.map((q) => ({ ...q, marlint_test_number: 2 })),
  ...MARLINS_TEST_3_STANDARD_QUESTIONS.map((q) => ({ ...q, marlint_test_number: 3 })),
  ...MARLINS_TEST_4_STANDARD_QUESTIONS.map((q) => ({ ...q, marlint_test_number: 4 })),
  ...MARLINS_TEST_5_STANDARD_QUESTIONS.map((q) => ({ ...q, marlint_test_number: 5 })),
  ...MARLINS_TEST_6_STANDARD_QUESTIONS.map((q) => ({ ...q, marlint_test_number: 6 })),
  ...MARLINS_TEST_7_STANDARD_QUESTIONS.map((q) => ({ ...q, marlint_test_number: 7 })),
  ...MARLINS_TEST_8_STANDARD_QUESTIONS.map((q) => ({ ...q, marlint_test_number: 8 })),
  ...MARLINS_TEST_9_STANDARD_QUESTIONS.map((q) => ({ ...q, marlint_test_number: 9 })),
  ...MARLINS_TEST_10_STANDARD_QUESTIONS.map((q) => ({ ...q, marlint_test_number: 10 })),
];

export default function AdminQuestionsPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>(STANDARD_QUESTIONS_BANK);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTestNum, setSelectedTestNum] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    why_correct: '',
    distractor_reasons_raw: '',
    maritime_context: '',
    rule_or_formula: '',
    points: 10,
    is_active: true,
  });

  const loadQuestions = async () => {
    try {
      setLoading(true);
      let customAdditions: Question[] = [];
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('marlins_custom_questions');
        if (stored) {
          try {
            const parsed: Question[] = JSON.parse(stored);
            // Bersihkan dan hapus semua butir soal duplikat / salinan yang tersimpan
            customAdditions = parsed.filter(
              (q) =>
                q.question_text &&
                !q.question_text.toLowerCase().includes('(salinan)') &&
                !q.question_text.toLowerCase().includes('(copy)')
            );
            if (customAdditions.length > 0) {
              localStorage.setItem('marlins_custom_questions', JSON.stringify(customAdditions));
            } else {
              localStorage.removeItem('marlins_custom_questions');
            }
          } catch (e) {
            localStorage.removeItem('marlins_custom_questions');
          }
        }
      }

      const combined = [...customAdditions, ...STANDARD_QUESTIONS_BANK].filter(
        (q) =>
          q.question_text &&
          !q.question_text.toLowerCase().includes('(salinan)') &&
          !q.question_text.toLowerCase().includes('(copy)')
      );
      setAllQuestions(combined);
    } catch (err) {
      setAllQuestions(STANDARD_QUESTIONS_BANK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // Filter questions dynamically
  const questions = allQuestions.filter((q) => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (selectedType !== 'all' && q.question_type !== selectedType) return false;
    if (selectedTestNum !== 'all' && q.marlint_test_number !== Number(selectedTestNum)) return false;
    if (search.trim() !== '') {
      const s = search.toLowerCase();
      const matchText = q.question_text?.toLowerCase().includes(s);
      const matchCat = q.category?.toLowerCase().includes(s);
      const matchAns = typeof q.correct_answer === 'string' && q.correct_answer.toLowerCase().includes(s);
      if (!matchText && !matchCat && !matchAns) return false;
    }
    return true;
  });

  const handleOpenCreate = () => {
    setFormData({
      category: 'grammar',
      question_type: 'multiple_choice',
      marlint_test_number: selectedTestNum !== 'all' ? Number(selectedTestNum) : 1,
      question_text: '',
      optionsRaw: '',
      correct_answer: '',
      audio_url: '',
      explanation: '',
      why_correct: '',
      distractor_reasons_raw: '',
      maritime_context: '',
      rule_or_formula: '',
      points: 10,
      is_active: true,
    });
    setEditingQuestion(null);
    setFormError(null);
    setModalMode('create');
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    const rich = getRichQuestionExplanation(q);
    const qData = q.question_data || {};

    let distRaw = '';
    if (qData.distractor_reasons) {
      distRaw = Object.entries(qData.distractor_reasons)
        .map(([opt, reason]) => `${opt} : ${reason}`)
        .join('\n');
    } else if (rich.distractors && rich.distractors.length > 0) {
      distRaw = rich.distractors
        .map((d) => `${d.option} : ${d.reason}`)
        .join('\n');
    }

    setFormData({
      category: q.category,
      question_type: q.question_type,
      marlint_test_number: q.marlint_test_number || 1,
      question_text: q.question_text,
      optionsRaw: Array.isArray(q.options) ? q.options.join('\n') : '',
      correct_answer: typeof q.correct_answer === 'string' ? q.correct_answer : JSON.stringify(q.correct_answer),
      audio_url: q.audio_url || '',
      explanation: q.explanation || rich.summary || '',
      why_correct: qData.why_correct || rich.whyCorrect || '',
      distractor_reasons_raw: distRaw,
      maritime_context: qData.maritime_context || rich.maritimeContext || '',
      rule_or_formula: qData.rule_or_formula || rich.ruleOrFormula || '',
      points: q.points || 10,
      is_active: q.is_active !== false,
    });
    setFormError(null);
    setModalMode('edit');
  };

  const handleToggleActive = async (q: Question) => {
    const nextStatus = !q.is_active;
    setAllQuestions((prev: Question[]) =>
      prev.map((item: Question) => (item.id === q.id ? { ...item, is_active: nextStatus } : item))
    );

    try {
      await supabase
        .from('questions')
        .update({ is_active: nextStatus })
        .eq('id', q.id);
    } catch (err) {}
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

      const distractorMap: Record<string, string> = {};
      if (formData.distractor_reasons_raw) {
        formData.distractor_reasons_raw.split('\n').forEach((line) => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const k = parts[0].trim();
            const v = parts.slice(1).join(':').trim();
            if (k && v) distractorMap[k] = v;
          }
        });
      }

      const existingData =
        modalMode === 'edit' && editingQuestion?.question_data ? editingQuestion.question_data : {};
      const updatedQuestionData = {
        ...existingData,
        why_correct: formData.why_correct.trim() || undefined,
        distractor_reasons: Object.keys(distractorMap).length > 0 ? distractorMap : undefined,
        maritime_context: formData.maritime_context.trim() || undefined,
        rule_or_formula: formData.rule_or_formula.trim() || undefined,
      };

      const payload: Question = {
        id: modalMode === 'edit' && editingQuestion?.id ? editingQuestion.id : `custom-q-${Date.now()}`,
        category: formData.category,
        question_type: formData.question_type,
        marlint_test_number: Number(formData.marlint_test_number),
        question_text: formData.question_text.trim(),
        options: parsedOptions.length > 0 ? parsedOptions : undefined,
        correct_answer: formData.correct_answer.trim(),
        audio_url: formData.audio_url.trim() || null,
        image_url: editingQuestion?.image_url || null,
        pronunciation_text: editingQuestion?.pronunciation_text || null,
        level: editingQuestion?.level || 'A2',
        question_data: updatedQuestionData,
        explanation: formData.explanation.trim() || undefined,
        points: Number(formData.points) || 10,
        is_active: formData.is_active,
        created_at: editingQuestion?.created_at || new Date().toISOString(),
      };

      if (modalMode === 'create') {
        setAllQuestions((prev) => [payload, ...prev]);
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('marlins_custom_questions');
          const list = stored ? JSON.parse(stored) : [];
          localStorage.setItem('marlins_custom_questions', JSON.stringify([payload, ...list]));
        }
        try {
          await supabase.from('questions').insert([payload]);
        } catch (e) {}
      } else if (modalMode === 'edit' && editingQuestion?.id) {
        setAllQuestions((prev) =>
          prev.map((item) => (item.id === editingQuestion.id ? { ...item, ...payload } : item))
        );
        try {
          await supabase
            .from('questions')
            .update(payload)
            .eq('id', editingQuestion.id);
        } catch (e) {}
      }

      setModalMode(null);
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
      setAllQuestions((prev) => prev.filter((item) => item.id !== id));
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('marlins_custom_questions');
        if (stored) {
          const list = JSON.parse(stored).filter((item: any) => item.id !== id);
          localStorage.setItem('marlins_custom_questions', JSON.stringify(list));
        }
      }
      try {
        await supabase.from('questions').delete().eq('id', id);
      } catch (e) {}
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert('Gagal menghapus soal: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
    <div className="space-y-6 sm:space-y-7 min-w-0 font-sans pb-16 max-w-7xl mx-auto">
      {/* Top Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold text-[#0284C7] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse shrink-0"></span>
            <span className="font-bold text-[#0369A1]">Bank Soal Standar IMO STCW & SMCP</span>
            <span className="text-sky-300">•</span>
            <span className="text-slate-500 font-medium">Evaluation Repository</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Kelola Bank Soal Maritim
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Total <strong className="text-slate-900 font-bold">{allQuestions.length}</strong> butir pertanyaan aktif. Tambah, edit, kelola status, dan uji interaktif secara realtime.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-[13px] text-white bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-cyan-200" />
          <span>Tambah Soal Baru</span>
        </button>
      </div>

      {/* Quick Test Package Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {[
          { label: 'Semua Paket', val: 'all', count: allQuestions.length },
          { label: 'Paket #1', val: '1', count: allQuestions.filter((q) => q.marlint_test_number === 1).length },
          { label: 'Paket #2', val: '2', count: allQuestions.filter((q) => q.marlint_test_number === 2).length },
          { label: 'Paket #3', val: '3', count: allQuestions.filter((q) => q.marlint_test_number === 3).length },
          { label: 'Paket #4', val: '4', count: allQuestions.filter((q) => q.marlint_test_number === 4).length },
          { label: 'Paket #5', val: '5', count: allQuestions.filter((q) => q.marlint_test_number === 5).length },
          { label: 'Paket #6', val: '6', count: allQuestions.filter((q) => q.marlint_test_number === 6).length },
          { label: 'Paket #7', val: '7', count: allQuestions.filter((q) => q.marlint_test_number === 7).length },
          { label: 'Paket #8', val: '8', count: allQuestions.filter((q) => q.marlint_test_number === 8).length },
          { label: 'Paket #9', val: '9', count: allQuestions.filter((q) => q.marlint_test_number === 9).length },
          { label: 'Paket #10', val: '10', count: allQuestions.filter((q) => q.marlint_test_number === 10).length },
        ].map((tab) => (
          <button
            key={tab.val}
            type="button"
            onClick={() => {
              setSelectedTestNum(tab.val);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedTestNum === tab.val
                ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-[#0284C7] border border-slate-200/90 hover:bg-sky-50/40'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${
              selectedTestNum === tab.val ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Modern Clean Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[28px] border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
          {/* Search Input */}
          <div className="relative lg:col-span-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari kata kunci soal, kunci jawaban, atau opsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50/80 border border-slate-200/90 text-xs sm:text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 font-medium transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-slate-50/80 border border-slate-200/90 text-xs sm:text-[13px] text-slate-800 font-bold outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition-all cursor-pointer"
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
          <div className="lg:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-slate-50/80 border border-slate-200/90 text-xs sm:text-[13px] text-slate-800 font-bold outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition-all cursor-pointer"
            >
              <option value="all">Semua Tipe Soal</option>
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

        {/* Filter Meta & Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 px-1 border-t border-slate-100">
          <span>
            Menampilkan <strong className="text-slate-900 font-bold">{paginatedQuestions.length}</strong> dari{' '}
            <strong className="text-slate-900 font-bold">{questions.length}</strong> butir soal terfilter
          </span>
          {(search || selectedCategory !== 'all' || selectedType !== 'all' || selectedTestNum !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedTestNum('all');
              }}
              className="text-[#0284C7] hover:text-[#0369A1] font-bold cursor-pointer transition-colors"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Questions Cards List */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-[28px] text-slate-400 text-xs shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse border border-sky-100">
            <HelpCircle className="w-5 h-5" />
          </div>
          <p className="font-bold text-slate-700">Memuat bank soal dari database Supabase...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-[28px] text-slate-500 text-sm shadow-2xs space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-100">
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
        <div className="space-y-3.5">
          {paginatedQuestions.map((q, idx) => {
            const catInfo = getCategoryInfo(q.category);
            const questionNumber = (currentPage - 1) * itemsPerPage + idx + 1;

            return (
              <div
                key={q.id}
                className={`bg-white p-5 sm:p-6 rounded-[28px] border transition-all duration-200 ease-out hover:border-sky-300 hover:shadow-md group ${
                  q.is_active === false
                    ? 'border-slate-200 bg-slate-50/70 opacity-60'
                    : 'border-slate-200/80 shadow-xs'
                }`}
              >
                {/* Header Row: Number + Badges + Actions Toolbar */}
                <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-xl bg-sky-50 text-[#0284C7] text-xs font-black flex items-center justify-center shrink-0 border border-sky-100">
                      {questionNumber}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${catInfo.bg} ${catInfo.color} border ${catInfo.border}`}
                    >
                      {catInfo.name}
                    </span>

                    {q.marlint_test_number && (
                      <span className="px-3 py-1 rounded-full bg-sky-50 text-[#0369A1] text-xs font-bold border border-sky-200/80">
                        Paket #{q.marlint_test_number}
                      </span>
                    )}

                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-600 font-medium hidden sm:inline-block">
                      {formatQuestionTypeName(q.question_type)}
                    </span>

                    {q.audio_url && (
                      <span className="flex items-center gap-1 text-xs text-sky-700 font-bold bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                        <Headphones className="w-3.5 h-3.5 text-[#0284C7]" /> Audio
                      </span>
                    )}
                  </div>

                  {/* Right Actions Toolbar */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(q)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        q.is_active !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                      }`}
                      title="Ubah Status Aktif"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${q.is_active !== false ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{q.is_active !== false ? 'Aktif' : 'Nonaktif'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewQuestion(q)}
                      className="p-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0284C7] hover:bg-sky-50 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Preview Soal"
                    >
                      <Eye className="w-4 h-4 text-slate-500 group-hover:text-[#0284C7]" />
                      <span className="hidden sm:inline text-xs">Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(q)}
                      className="p-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0284C7] hover:bg-sky-50 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Edit Soal"
                    >
                      <Edit2 className="w-4 h-4 text-slate-500 group-hover:text-[#0284C7]" />
                      <span className="hidden sm:inline text-xs">Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(q.id)}
                      className="p-2 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Hapus Soal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="py-2">
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed break-words">
                    {q.question_text}
                  </p>
                </div>

                {/* Answer Key Row */}
                <div className="pt-2 flex items-center justify-between gap-3 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-400">Kunci:</span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 text-xs truncate max-w-lg">
                      {q.correct_answer || '-'}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    Level {q.level || 'A1'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Menampilkan <strong className="text-slate-900 font-bold">{Math.min((currentPage - 1) * itemsPerPage + 1, questions.length)}</strong> - <strong className="text-slate-900 font-bold">{Math.min(currentPage * itemsPerPage, questions.length)}</strong> dari <strong className="text-slate-900 font-bold">{questions.length}</strong> butir soal
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2.5 rounded-full border border-slate-200/90 bg-white text-slate-700 hover:bg-sky-50 hover:text-[#0284C7] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs sm:text-sm font-bold text-slate-800 px-2">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2.5 rounded-full border border-slate-200/90 bg-white text-slate-700 hover:bg-sky-50 hover:text-[#0284C7] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-sm w-full p-6 sm:p-7 rounded-[32px] border border-slate-200/90 space-y-4 shadow-2xl text-center">
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
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-[32px] border border-slate-200 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#0284C7] uppercase tracking-wider block">
                  {modalMode === 'create' ? 'Modul Soal Baru' : 'Perbarui Butir Soal'}
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-950">
                  {modalMode === 'create' ? 'Tambah Butir Soal Baru' : 'Edit Butir Soal'}
                </h3>
              </div>
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
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
                  >
                    <option value={1}>Marlins Test 1</option>
                    <option value={2}>Marlins Test 2</option>
                    <option value={3}>Marlins Test 3</option>
                    <option value={4}>Marlins Test 4</option>
                    <option value={5}>Marlins Test 5</option>
                    <option value={6}>Marlins Test 6</option>
                    <option value={7}>Marlins Test 7</option>
                    <option value={8}>Marlins Test 8</option>
                    <option value={9}>Marlins Test 9</option>
                    <option value={10}>Marlins Test 10</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Kategori Modul:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as QuestionCategory })}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
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
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
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
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
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
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium font-mono outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
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
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Audio URL (Opsional):</label>
                  <input
                    type="url"
                    value={formData.audio_url}
                    onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                    placeholder="https://.../audio.mp3"
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Ringkasan Pembahasan Singkat (Opsional):</label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Ringkasan inti pembahasan..."
                  className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {/* Deep Explanation & Distractor Analysis Section */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-100 text-[#0284C7] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Pembahasan & Analisis Kesalahan Opsi (Sistem Review Ujian)
                  </h4>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">1. Alasan Mengapa Kunci Jawaban Benar:</label>
                  <textarea
                    rows={2}
                    value={formData.why_correct}
                    onChange={(e) => setFormData({ ...formData, why_correct: e.target.value })}
                    placeholder="Jelaskan alasan gramatikal / teknis mengapa opsi ini benar..."
                    className="w-full p-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    2. Analisis Kenapa Opsi Lain Salah (1 Opsi per Baris, Format: <code className="text-[#0284C7]">Opsi : Alasan salah</code>):
                  </label>
                  <textarea
                    rows={3}
                    value={formData.distractor_reasons_raw}
                    onChange={(e) => setFormData({ ...formData, distractor_reasons_raw: e.target.value })}
                    placeholder="Opsi B : Salah karena bentuk past tense tidak sesuai&#10;Opsi C : Salah karena subjek tunggal..."
                    className="w-full p-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 font-mono text-[11px] outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">3. Kaidah / Rumus Singkat (Opsional):</label>
                    <input
                      type="text"
                      value={formData.rule_or_formula}
                      onChange={(e) => setFormData({ ...formData, rule_or_formula: e.target.value })}
                      placeholder="Contoh: Subject + Verb-1 (s/es)"
                      className="w-full p-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">4. Konteks Maritim & Standar IMO (Opsional):</label>
                    <input
                      type="text"
                      value={formData.maritime_context}
                      onChange={(e) => setFormData({ ...formData, maritime_context: e.target.value })}
                      placeholder="Contoh: Prosedur evakuasi SOLAS / Komunikasi radio VHF"
                      className="w-full p-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-2xl border border-rose-200 font-medium">
                  {formError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:opacity-95 transition-all cursor-pointer"
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
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-[32px] border border-slate-200 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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

            {/* Deep Explanation Details Preview */}
            {(() => {
              const rich = getRichQuestionExplanation(previewQuestion);
              return (
                <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200/90 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800">
                      Kunci Jawaban Resmi: <strong>{previewQuestion.correct_answer}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-200/70 text-[#0369A1] font-mono text-[9px] font-bold">
                      IMO SMCP
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      🎯 Mengapa Kunci Jawaban Benar:
                    </p>
                    <p className="text-slate-700 leading-relaxed font-medium bg-white/80 p-2.5 rounded-xl border border-sky-100">
                      {rich.whyCorrect}
                    </p>
                  </div>

                  {rich.distractors && rich.distractors.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="font-bold text-rose-800 text-[11px] uppercase tracking-wider">
                        ❌ Analisis Kenapa Opsi Lain Salah:
                      </p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {rich.distractors.map((d, dIdx) => (
                          <div key={dIdx} className="p-2 rounded-xl bg-rose-50/70 border border-rose-200/70 text-[11px]">
                            <span className="font-bold text-rose-950">✗ Opsi "{d.option}":</span> {d.reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {rich.maritimeContext && (
                    <p className="text-slate-600 text-[11px] italic pt-1 border-t border-sky-200/60">
                      ⚓ Konteks Maritim: {rich.maritimeContext}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
