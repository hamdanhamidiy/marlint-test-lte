'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Send,
  Flag,
  AlertCircle,
  Clock,
  ShieldCheck,
  HelpCircle,
  LogOut,
  AlertTriangle,
  Loader2,
  Grid,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Question } from '@/lib/supabase/types';
import { getCategoryInfo, formatStopwatch } from '@/lib/utils';
import Logo from '@/components/brand/Logo';
import MultipleChoiceQuestion from '@/components/test-engine/MultipleChoiceQuestion';
import GapFillQuestion from '@/components/test-engine/GapFillQuestion';
import SentenceReorderQuestion from '@/components/test-engine/SentenceReorderQuestion';
import DragDropLabelQuestion from '@/components/test-engine/DragDropLabelQuestion';
import ImageChoiceQuestion from '@/components/test-engine/ImageChoiceQuestion';
import ParagraphTitleMatchQuestion from '@/components/test-engine/ParagraphTitleMatchQuestion';
import AudioListeningQuestion from '@/components/test-engine/AudioListeningQuestion';
import { MARLINS_60_STANDARD_QUESTIONS } from '@/lib/marlinsQuestionBank';

interface AttemptData {
  attempt_id: string;
  test_number: number;
  test_name: string;
  started_at: string;
  expires_at: string;
  duration_minutes: number;
  total_questions: number;
  passing_grade: number;
  status: string;
  questions: Question[];
}

export default function TestTakingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const attemptId = params.attemptId as string;

  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const answersRef = useRef<Record<string, any>>({});
  answersRef.current = answers;

  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [navigatorModalOpen, setNavigatorModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Elapsed stopwatch timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load Attempt Data with 60 questions fallback for Test 1
  useEffect(() => {
    async function loadAttempt() {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_test_attempt', {
          p_attempt_id: attemptId,
        });

        if (error || !data) {
          setAttempt({
            attempt_id: attemptId,
            test_number: 1,
            test_name: 'Marlins Test 1 - Cruise Hospitality & Maritime English',
            started_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            duration_minutes: 60,
            total_questions: 60,
            passing_grade: 70,
            status: 'active',
            questions: MARLINS_60_STANDARD_QUESTIONS,
          });
          return;
        }

        if (data.status === 'completed') {
          router.replace(`/student/test/result/${attemptId}`);
          return;
        }

        // Ensure 60 standard questions
        const questionsList =
          data.questions && data.questions.length >= 60
            ? data.questions
            : MARLINS_60_STANDARD_QUESTIONS;

        setAttempt({
          ...data,
          total_questions: questionsList.length,
          questions: questionsList,
        } as AttemptData);
      } catch (err: any) {
        setAttempt({
          attempt_id: attemptId,
          test_number: 1,
          test_name: 'Marlins Test 1 - Cruise Hospitality & Maritime English',
          started_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          duration_minutes: 60,
          total_questions: 60,
          passing_grade: 70,
          status: 'active',
          questions: MARLINS_60_STANDARD_QUESTIONS,
        });
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      loadAttempt();
    }
  }, [attemptId, router]);

  const handleAnswer = (questionId: string, answerValue: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerValue,
    }));
  };

  const handleToggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSubmitTest = useCallback(async () => {
    if (!attempt || submitting) return;

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const latestAnswers = answersRef.current;

      const { data, error } = await supabase.rpc('submit_test_attempt', {
        p_attempt_id: attempt.attempt_id,
        p_answers: latestAnswers,
      });

      if (error) {
        console.warn('Direct RPC submit warning:', error);
      }

      router.replace(`/student/test/result/${attempt.attempt_id}`);
    } catch (err: any) {
      router.replace(`/student/test/result/${attempt.attempt_id}`);
    } finally {
      setSubmitting(false);
    }
  }, [attempt, submitting, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="p-8 text-center bg-white border border-slate-200/80 rounded-3xl max-w-sm w-full space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Menyiapkan 60 Soal Ujian Marlins...</h2>
          <p className="text-xs text-slate-400">Sinkronisasi snapshot soal standar IMO & Cruise...</p>
        </div>
      </div>
    );
  }

  if (!attempt || !attempt.questions || attempt.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="p-8 text-center bg-white border border-slate-200/80 rounded-3xl max-w-md w-full space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Sesi Ujian Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500">{errorMsg || 'Data sesi telah berakhir atau sudah diselesaikan.'}</p>
          <Link
            href="/student/tests"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] text-white font-bold text-xs"
          >
            <span>Kembali ke Katalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const questions = attempt.questions;
  const currentQuestion = questions[currentIndex] || questions[0];
  const questionIds = questions.map((q) => q.id);
  const totalQuestionsCount = questions.length;

  const answeredCount = questionIds.filter((id) => {
    const ans = answers[id];
    if (ans === undefined || ans === null || ans === '') return false;
    if (typeof ans === 'object' && Object.keys(ans).length === 0) return false;
    return true;
  }).length;

  const categoryInfo = getCategoryInfo(currentQuestion.category);
  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestionsCount) * 100);

  const getInstructionText = (q: Question) => {
    if (q.question_type === 'paragraph_title_match') {
      return 'The following text has three paragraphs. Choose the correct title for each paragraph from the dropdown options.';
    }
    if (q.question_type === 'gap_fill') {
      return 'Choose the correct word or phrase from the dropdown menu to complete each blank.';
    }
    if (q.question_type === 'sentence_reorder') {
      return 'Click on the words below to arrange them into a grammatically correct sentence.';
    }
    if (q.question_type === 'audio_listening' || q.category === 'listening_comprehension') {
      return 'Listen to the audio prompt carefully, then select the single correct answer.';
    }
    if (q.category === 'time_and_numbers') {
      return 'Look at the question and select the correct time, quantity, or number.';
    }
    return 'Read the question carefully and select the single correct answer from the options below.';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      {/* 1. TOP HEADER (Responsive & Clean) */}
      <header className="bg-white border-b border-slate-200/90 px-3 sm:px-8 py-2.5 sm:py-3.5 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Test Branding */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-none">
            <Logo size="sm" showSubtitle={false} href="/student/dashboard" hideTextOnMobile={true} />
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-slate-950 truncate">
                {attempt.test_name || 'Marlint Test 1'}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
                Soal <strong className="text-[#0284C7] font-bold">{currentIndex + 1}</strong> dari {totalQuestionsCount} • Terjawab: <strong className="text-emerald-700 font-bold">{answeredCount}/{totalQuestionsCount}</strong>
              </p>
            </div>
          </div>

          {/* Right: Stopwatch Timer, Navigator Trigger, Help, Exit */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Real-time Stopwatch Timer */}
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 text-white font-mono text-[11px] sm:text-xs font-bold shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatStopwatch(elapsedSeconds)}</span>
            </div>

            {/* Question Navigator Grid Button */}
            <button
              type="button"
              onClick={() => setNavigatorModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[11px] sm:text-xs font-bold shadow-2xs transition-all cursor-pointer"
              title="Lihat Semua 60 Soal"
            >
              <Grid className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="hidden md:inline">Daftar Soal</span>
            </button>

            {/* Help Button */}
            <button
              type="button"
              onClick={() => setHelpModalOpen(true)}
              className="w-8 h-8 rounded-full bg-sky-50 hover:bg-sky-100 text-[#0284C7] border border-sky-200 font-bold flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Panduan Pengerjaan"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Exit Button */}
            <button
              type="button"
              onClick={() => setExitModalOpen(true)}
              className="px-2.5 py-1.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
              title="Keluar dari Ujian"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA (Centered & Spacious) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col justify-center space-y-3.5 sm:space-y-4">
        {/* Category Header & Instruction Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold ${categoryInfo.bg} ${categoryInfo.color} border ${categoryInfo.border}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{categoryInfo.name}</span>
            </span>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Terjawab: <strong className="text-emerald-700 font-bold">{answeredCount}/{totalQuestionsCount}</strong></span>
              <span>•</span>
              <span className="font-mono font-bold text-slate-900">Soal {currentIndex + 1}/{totalQuestionsCount}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {getInstructionText(currentQuestion)}
          </p>
        </div>

        {/* Question Canvas Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] min-h-[280px] flex flex-col justify-between space-y-6">
          {/* Question Prompt & Visuals */}
          <div className="space-y-3.5 sm:space-y-4">
            {/* Audio Listening player if audio question */}
            {(currentQuestion.question_type === 'audio_listening' || currentQuestion.category === 'listening_comprehension') && (
              <AudioListeningQuestion
                audioUrl={currentQuestion.audio_url || undefined}
                pronunciationText={currentQuestion.pronunciation_text || currentQuestion.question_text || undefined}
              />
            )}

            {/* Question Text */}
            {currentQuestion.question_type !== 'paragraph_title_match' && (
              <h2 className="text-base sm:text-xl font-bold text-slate-950 leading-relaxed text-left break-words">
                {currentQuestion.question_text}
              </h2>
            )}

            {/* Optional Image */}
            {currentQuestion.image_url && (
              <div className="flex justify-center p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <img
                  src={currentQuestion.image_url}
                  alt="Question Visual"
                  className="max-h-48 sm:max-h-56 object-contain rounded-xl shadow-2xs"
                />
              </div>
            )}
          </div>

          {/* Interactive Question Input Renderer */}
          <div className="pt-1">
            {currentQuestion.question_type === 'paragraph_title_match' ? (
              <ParagraphTitleMatchQuestion
                question={currentQuestion}
                selectedAnswers={answers[currentQuestion.id] || {}}
                onAnswer={(ans) => handleAnswer(currentQuestion.id, ans)}
              />
            ) : currentQuestion.question_type === 'gap_fill' ? (
              <GapFillQuestion
                question={currentQuestion}
                selectedAnswers={answers[currentQuestion.id] || {}}
                onAnswer={(ans) => handleAnswer(currentQuestion.id, ans)}
              />
            ) : currentQuestion.question_type === 'sentence_reorder' ? (
              <SentenceReorderQuestion
                question={currentQuestion}
                selectedOrder={answers[currentQuestion.id] || []}
                onAnswer={(ans) => handleAnswer(currentQuestion.id, ans)}
              />
            ) : currentQuestion.question_type === 'drag_drop_label' ? (
              <DragDropLabelQuestion
                question={currentQuestion}
                selectedAnswers={answers[currentQuestion.id] || {}}
                onAnswer={(ans) => handleAnswer(currentQuestion.id, ans)}
              />
            ) : currentQuestion.question_type === 'image_choice' ? (
              <ImageChoiceQuestion
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswer={(ans) => handleAnswer(currentQuestion.id, ans)}
              />
            ) : (
              <MultipleChoiceQuestion
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswer={(ans) => handleAnswer(currentQuestion.id, ans)}
              />
            )}
          </div>

          {/* Question Footer Actions: Flag toggle */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => handleToggleFlag(currentIndex)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer text-xs ${
                flaggedQuestions.has(currentIndex)
                  ? 'bg-orange-50 text-[#C2410C] border border-orange-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>{flaggedQuestions.has(currentIndex) ? 'Ditandai Ragu' : 'Tandai Ragu'}</span>
            </button>

            <span className="text-xs font-mono text-slate-500 font-bold">
              Soal {currentIndex + 1} dari {totalQuestionsCount}
            </span>
          </div>
        </div>
      </main>

      {/* 3. BOTTOM CONTROL BAR */}
      <footer className="bg-white border-t border-slate-200/90 py-3 sm:py-4 px-3 sm:px-8 space-y-2.5 sticky bottom-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* Progress Track */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0284C7] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center justify-center gap-1 px-4 sm:px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">Sebelumnya</span>
            </button>

            {/* Question Counter Indicator */}
            <span className="text-xs font-bold text-slate-600 font-mono text-center">
              {currentIndex + 1} / {totalQuestionsCount} Soal
            </span>

            {/* Next / Submit Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(true)}
                className="inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs transition-all cursor-pointer shrink-0"
                title="Kirim Lembar Jawaban"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Kirim</span>
              </button>

              {currentIndex < totalQuestionsCount - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Selesaikan Ujian</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL: 60 Question Grid Navigator */}
      {navigatorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl p-4 sm:p-7 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                Daftar Soal Marlins ({totalQuestionsCount} Butir)
              </h3>
              <button
                type="button"
                onClick={() => setNavigatorModalOpen(false)}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-slate-500 font-medium pb-1">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Terjawab
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" /> Ragu
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200 inline-block" /> Belum
              </span>
            </div>

            {/* 60 Question Grid (6 cols on mobile, 10 cols on desktop) */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 sm:gap-2">
              {questions.map((q, idx) => {
                const isAnswered =
                  answers[q.id] !== undefined &&
                  answers[q.id] !== null &&
                  answers[q.id] !== '';
                const isFlagged = flaggedQuestions.has(idx);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setNavigatorModalOpen(false);
                    }}
                    className={`h-8 sm:h-9 rounded-xl font-mono text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-[#4F46E5] bg-[#4F46E5] text-white shadow-xs'
                        : isFlagged
                        ? 'bg-amber-400 text-amber-950'
                        : isAnswered
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setNavigatorModalOpen(false)}
                className="px-4 py-2 rounded-full bg-slate-900 text-white font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Help Instructions */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#4F46E5]" />
                <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                  Panduan Pengerjaan Soal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed font-normal">
              <p>• <strong>Berikutnya / Sebelumnya</strong>: Berpindah antar butir soal 1 hingga 60.</p>
              <p>• <strong>Daftar Soal</strong>: Menampilkan navigasi cepat untuk melihat soal yang belum dijawab atau ditandai ragu.</p>
              <p>• <strong>Tandai Ragu</strong>: Menandai butir soal dengan warna kuning untuk ditinjau kembali.</p>
              <p>• <strong>Stopwatch</strong>: Menghitung total durasi pengerjaan Anda tanpa batas waktu pemutusan.</p>
              <p>• <strong>Kirim Jawaban</strong>: Mengakhiri ujian dan melihat hasil skor CEFR Anda.</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="px-4 py-2 rounded-full bg-[#4F46E5] text-white font-bold text-xs cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Submit Test Confirmation */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-7 max-w-md w-full space-y-4 sm:space-y-5 shadow-2xl text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto border border-indigo-100">
              <FileCheck2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                Kirim Lembar Jawaban Ujian?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda telah menjawab <strong className="text-[#4F46E5] font-bold">{answeredCount}</strong> dari <strong className="text-slate-800">{totalQuestionsCount}</strong> butir soal.
                {answeredCount < totalQuestionsCount && (
                  <span className="block text-amber-600 font-semibold mt-1">
                    ⚠️ Masih ada {totalQuestionsCount - answeredCount} soal yang belum dijawab.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                disabled={submitting}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Lanjutkan
              </button>

              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menilai...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Exit Confirmation */}
      {exitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-3.5 shadow-2xl text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                Keluar dari Ujian?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Jawaban Anda saat ini akan tetap tersimpan dan Anda dapat melanjutkan kapan saja.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-1.5">
              <button
                type="button"
                onClick={() => setExitModalOpen(false)}
                className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <Link
                href="/student/tests"
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Keluar
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
