'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
  Printer,
  Headphones,
  BookOpen,
  Check,
  X,
  Flag,
  Filter,
  Eye,
  EyeOff,
  Play,
  Pause,
  ArrowRight,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Anchor,
  Compass,
  Search,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Question } from '@/lib/supabase/types';
import { getCategoryInfo, formatDateIndo } from '@/lib/utils';
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

function isImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/images/') ||
    /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(trimmed)
  );
}

function getTestQuestionsByNumber(testNum: number): { test_name: string; questions: Question[] } {
  switch (testNum) {
    case 10:
      return {
        test_name: 'Marlins Test 10 - Master & Chief Engineer Executive Capstone',
        questions: MARLINS_TEST_10_STANDARD_QUESTIONS,
      };
    case 9:
      return {
        test_name: 'Marlins Test 9 - Autonomous Ships (MASS), Modern GMDSS & BRM Forensics',
        questions: MARLINS_TEST_9_STANDARD_QUESTIONS,
      };
    case 8:
      return {
        test_name: 'Marlins Test 8 - Heavy Lift, Dry Docking, Ocean Towage & Bio-Fouling',
        questions: MARLINS_TEST_8_STANDARD_QUESTIONS,
      };
    case 7:
      return {
        test_name: 'Marlins Test 7 - Ro-Ro Passenger Safety, Polar Code & Green Shipping (CII)',
        questions: MARLINS_TEST_7_STANDARD_QUESTIONS,
      };
    case 6:
      return {
        test_name: 'Marlins Test 6 - Container & Bulk Carrier Operations (IMSBC & Cyber Risk)',
        questions: MARLINS_TEST_6_STANDARD_QUESTIONS,
      };
    case 5:
      return {
        test_name: 'Marlins Test 5 - Offshore Operations & Dynamic Positioning Systems',
        questions: MARLINS_TEST_5_STANDARD_QUESTIONS,
      };
    case 4:
      return {
        test_name: 'Marlins Test 4 - Tanker Operations & IMDG Cargo Handling',
        questions: MARLINS_TEST_4_STANDARD_QUESTIONS,
      };
    case 3:
      return {
        test_name: 'Marlins Test 3 - Bridge Watchkeeping & COLREGs',
        questions: MARLINS_TEST_3_STANDARD_QUESTIONS,
      };
    case 2:
      return {
        test_name: 'Marlins Test 2 - Deck & Engine Operations',
        questions: MARLINS_TEST_2_STANDARD_QUESTIONS,
      };
    case 1:
    default:
      return {
        test_name: 'Marlins Test 1 - Cruise Hospitality & Maritime English',
        questions: MARLINS_60_STANDARD_QUESTIONS,
      };
  }
}

// Clean Audio Player Component
function ReviewAudioPlayer({ audioUrl, transcript }: { audioUrl?: string | null; transcript?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const handlePlayAudio = () => {
    if (!audioUrl) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && transcript) {
        if (isPlaying) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
        } else {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(transcript);
          utterance.lang = 'en-GB';
          utterance.rate = 0.9;
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          setIsPlaying(true);
          window.speechSynthesis.speak(utterance);
        }
      }
      return;
    }

    const audio = new Audio(audioUrl);
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audio.play();
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
    }
  };

  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Headphones className="w-4 h-4 text-[#0284C7]" />
          <span>Audio Komunikasi VHF</span>
        </div>

        <div className="flex items-center gap-2">
          {transcript && (
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-[11px] font-medium text-[#0284C7] hover:underline cursor-pointer"
            >
              {showTranscript ? 'Tutup Transkrip' : 'Lihat Transkrip'}
            </button>
          )}

          <button
            type="button"
            onClick={handlePlayAudio}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'Jeda' : 'Putar Audio'}</span>
          </button>
        </div>
      </div>

      {showTranscript && transcript && (
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
          "{transcript}"
        </div>
      )}
    </div>
  );
}

// Formatter for Human-Readable User Answer (Removes raw JSON code displays)
function renderFormattedUserAnswer(userAns: any, q: Question) {
  if (userAns === undefined || userAns === null || String(userAns).trim() === '') {
    return <span className="text-slate-400 italic">Tidak Dijawab</span>;
  }

  // 1. Sentence Reorder: userAns is string[] of arranged words
  if (q.question_type === 'sentence_reorder' || (Array.isArray(userAns) && typeof userAns[0] === 'string')) {
    if (Array.isArray(userAns)) {
      return (
        <div className="space-y-1.5">
          <p className="font-medium text-slate-900 text-xs sm:text-sm leading-relaxed">
            "{userAns.join(' ')}"
          </p>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {userAns.map((word, wIdx) => (
              <span
                key={wIdx}
                className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      );
    }
    return <p className="font-medium text-slate-900 text-xs sm:text-sm">"{String(userAns)}"</p>;
  }

  // 2. Paragraph Title Match: userAns is Record<paragraph_num, title>
  if (q.question_type === 'paragraph_title_match' && typeof userAns === 'object' && !Array.isArray(userAns)) {
    const entries = Object.entries(userAns);
    if (entries.length === 0) return <span className="text-slate-400 italic">Tidak Dijawab</span>;
    return (
      <div className="space-y-1 text-xs">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">Paragraf {k}:</span>
            <span className="text-slate-900 font-medium">{String(v)}</span>
          </div>
        ))}
      </div>
    );
  }

  // 3. Drag Drop Label: userAns is Record<zone_id, label>
  if (q.question_type === 'drag_drop_label' && typeof userAns === 'object' && !Array.isArray(userAns)) {
    const entries = Object.entries(userAns);
    const dropZones = q.question_data?.drop_zones || [];
    if (entries.length === 0) return <span className="text-slate-400 italic">Tidak Dijawab</span>;
    return (
      <div className="space-y-1 text-xs">
        {entries.map(([k, v], idx) => {
          const zone = dropZones.find((dz: any) => dz.id === k);
          const zoneName = zone?.label || `Posisi ${idx + 1}`;
          return (
            <div key={k} className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600">{zoneName}:</span>
              <span className="text-slate-900 font-medium">{String(v)}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // 4. Gap Fill: userAns is Record or Array
  if (q.question_type === 'gap_fill' && typeof userAns === 'object') {
    const values = Array.isArray(userAns) ? userAns : Object.values(userAns);
    return (
      <div className="flex flex-wrap gap-1.5 text-xs">
        {values.map((val, idx) => (
          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-slate-800">
            {idx + 1}. {String(val)}
          </span>
        ))}
      </div>
    );
  }

  // 5. Default clean string
  return <span className="font-medium text-slate-900 text-xs sm:text-sm">{String(userAns)}</span>;
}

// Formatter for Human-Readable Official Correct Answer
function renderFormattedCorrectAnswer(q: Question) {
  // 1. Sentence Reorder
  if (q.question_type === 'sentence_reorder') {
    const sent = q.correct_answer || q.question_data?.correct_sentence || '';
    return (
      <p className="font-semibold text-emerald-950 text-xs sm:text-sm leading-relaxed">
        "{sent}"
      </p>
    );
  }

  // 2. Paragraph Title Match
  if (q.question_type === 'paragraph_title_match') {
    const correctMatches = q.question_data?.correct_matches || {};
    const entries = Object.entries(correctMatches);
    if (entries.length > 0) {
      return (
        <div className="space-y-1 text-xs">
          {entries.map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-800">Paragraf {k}:</span>
              <span className="text-emerald-950 font-semibold">{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }
  }

  // 3. Drag Drop Label
  if (q.question_type === 'drag_drop_label') {
    const dropZones = q.question_data?.drop_zones || [];
    if (dropZones.length > 0) {
      return (
        <div className="space-y-1 text-xs">
          {dropZones.map((dz: any, idx: number) => (
            <div key={dz.id || idx} className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-800">{dz.label || `Posisi ${idx + 1}`}:</span>
              <span className="text-emerald-950 font-semibold">{dz.correct_label}</span>
            </div>
          ))}
        </div>
      );
    }
  }

  // 4. Gap Fill
  if (q.question_type === 'gap_fill') {
    const correctParts = String(q.correct_answer || '').split(',').map((s) => s.trim());
    return (
      <div className="flex flex-wrap gap-1.5 text-xs">
        {correctParts.map((val, idx) => (
          <span key={idx} className="px-2 py-0.5 rounded bg-emerald-100/90 border border-emerald-200 font-mono text-emerald-950 font-semibold">
            {idx + 1}. {val}
          </span>
        ))}
      </div>
    );
  }

  // Default string
  return (
    <span className="font-semibold text-emerald-950 text-xs sm:text-sm">
      {q.correct_answer || q.question_data?.correct_sentence || 'Kunci standar IMO SMCP'}
    </span>
  );
}

export default function TestReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const attemptId = params.attemptId as string;

  const [loading, setLoading] = useState(true);
  const [testName, setTestName] = useState('Marlins Test');
  const [testNumber, setTestNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [passingGrade, setPassingGrade] = useState(70);
  const [isPassed, setIsPassed] = useState(false);
  const [level, setLevel] = useState('B1');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [completedAt, setCompletedAt] = useState<string>(new Date().toISOString());

  // Expand / Collapse explanation state
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered' | 'flagged'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadReviewData() {
      try {
        setLoading(true);

        // 1. Try reading rich review payload from localStorage
        const reviewRaw =
          typeof window !== 'undefined'
            ? localStorage.getItem(`marlins_review_${attemptId}`)
            : null;

        if (reviewRaw) {
          try {
            const parsed = JSON.parse(reviewRaw);
            setTestName(parsed.test_name || 'Marlins Test');
            setTestNumber(parsed.test_number || 1);
            setQuestions(parsed.questions || []);
            setAnswers(parsed.answers || {});
            setFlagged(parsed.flagged || []);
            setCompletedAt(parsed.completed_at || new Date().toISOString());

            if (parsed.result) {
              setScore(parsed.result.score !== undefined ? parsed.result.score : parsed.result.overall_score || 0);
              setPassingGrade(parsed.result.passing_grade || 70);
              setIsPassed(parsed.result.is_passed || false);
              setLevel(parsed.result.level || 'B1');
            }
            setLoading(false);
            return;
          } catch (e) {
            console.warn('Error parsing review payload:', e);
          }
        }

        // 2. Fallback: load result from Supabase or localStorage and match with question bank
        const localResultRaw =
          typeof window !== 'undefined'
            ? localStorage.getItem(`marlins_result_${attemptId}`) ||
              localStorage.getItem(`test_result_${attemptId}`)
            : null;

        let parsedResult: any = null;
        if (localResultRaw) {
          try {
            parsedResult = JSON.parse(localResultRaw);
          } catch (e) {}
        }

        // Try load from Supabase if not in localStorage
        if (!parsedResult) {
          const { data: dbRes } = await supabase
            .from('student_results')
            .select('*')
            .or(`attempt_id.eq.${attemptId},id.eq.${attemptId}`)
            .maybeSingle();

          if (dbRes) {
            parsedResult = dbRes;
          }
        }

        let parsedTestNum = 1;
        if (attemptId.includes('test-10') || attemptId.includes('test10')) parsedTestNum = 10;
        else if (attemptId.includes('test-9') || attemptId.includes('test9')) parsedTestNum = 9;
        else if (attemptId.includes('test-8') || attemptId.includes('test8')) parsedTestNum = 8;
        else if (attemptId.includes('test-7') || attemptId.includes('test7')) parsedTestNum = 7;
        else if (attemptId.includes('test-6') || attemptId.includes('test6')) parsedTestNum = 6;
        else if (attemptId.includes('test-5') || attemptId.includes('test5')) parsedTestNum = 5;
        else if (attemptId.includes('test-4') || attemptId.includes('test4')) parsedTestNum = 4;
        else if (attemptId.includes('test-3') || attemptId.includes('test3')) parsedTestNum = 3;
        else if (attemptId.includes('test-2') || attemptId.includes('test2')) parsedTestNum = 2;
        else if (parsedResult?.marlint_test_number) parsedTestNum = parsedResult.marlint_test_number;
        else if (parsedResult?.test_number) parsedTestNum = parsedResult.test_number;

        const standardData = getTestQuestionsByNumber(parsedTestNum);
        setTestName(parsedResult?.test_name || standardData.test_name);
        setTestNumber(parsedTestNum);
        setQuestions(standardData.questions);

        // Load answers if saved
        let userAnswers: Record<string, any> = {};
        const savedAnswersRaw =
          typeof window !== 'undefined'
            ? localStorage.getItem(`marlins_attempt_answers_${attemptId}`)
            : null;
        if (savedAnswersRaw) {
          try {
            userAnswers = JSON.parse(savedAnswersRaw);
          } catch (e) {}
        }
        setAnswers(userAnswers);

        if (parsedResult) {
          setScore(parsedResult.score !== undefined ? parsedResult.score : parsedResult.overall_score || 0);
          setPassingGrade(parsedResult.passing_grade || 70);
          setIsPassed(parsedResult.is_passed || false);
          setLevel(parsedResult.level || 'B1');
          setCompletedAt(parsedResult.completed_at || parsedResult.created_at || new Date().toISOString());
        }
      } catch (err) {
        console.error('Error loading review:', err);
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      loadReviewData();
    }
  }, [attemptId]);

  // Helper to evaluate a question
  const evaluateQuestion = (q: Question, userAns: any): { isCorrect: boolean; isAnswered: boolean } => {
    const isAnswered = userAns !== undefined && userAns !== null && String(userAns).trim() !== '';
    if (!isAnswered) return { isCorrect: false, isAnswered: false };

    let isCorrect = false;
    if (q.question_type === 'paragraph_title_match') {
      if (typeof userAns === 'object') {
        const correctMatches = q.question_data?.correct_matches || {};
        const keys = Object.keys(correctMatches);
        const matchesCount = keys.filter((k) => userAns[k] === correctMatches[k]).length;
        if (keys.length > 0 && matchesCount === keys.length) isCorrect = true;
      }
    } else if (q.question_type === 'sentence_reorder') {
      const correctSent = String(q.correct_answer || q.question_data?.correct_sentence || '').trim().toLowerCase();
      let userSent = '';
      if (Array.isArray(userAns)) {
        userSent = userAns.join(' ').trim().toLowerCase();
      } else {
        userSent = String(userAns || '').trim().toLowerCase();
      }
      const cleanCorrect = correctSent.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ');
      const cleanUser = userSent.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ');
      if (cleanCorrect === cleanUser && cleanCorrect !== '') {
        isCorrect = true;
      }
    } else if (q.question_type === 'gap_fill') {
      if (typeof userAns === 'object') {
        const correctAnsStr = q.correct_answer || '';
        const correctParts = correctAnsStr.split(',').map((s) => s.trim().toLowerCase());
        const userParts = Object.values(userAns).map((s: any) => String(s).trim().toLowerCase());
        if (correctParts.length === userParts.length && correctParts.every((cp, i) => cp === userParts[i])) {
          isCorrect = true;
        }
      } else if (String(userAns).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase()) {
        isCorrect = true;
      }
    } else if (q.question_type === 'drag_drop_label') {
      if (typeof userAns === 'object') {
        const dropZones = q.question_data?.drop_zones || [];
        const allMatched = dropZones.every(
          (dz: any) => String(userAns[dz.id] || '').trim().toLowerCase() === String(dz.correct_label || '').trim().toLowerCase()
        );
        if (dropZones.length > 0 && allMatched) isCorrect = true;
      }
    } else if (q.question_type === 'image_choice') {
      const optLabels = q.question_data?.option_labels || [];
      const userStr = String(userAns).trim().toLowerCase();
      const correctStr = String(q.correct_answer).trim().toLowerCase();

      if (userStr === correctStr) {
        isCorrect = true;
      } else if (!isNaN(Number(userAns)) && optLabels[Number(userAns)]) {
        if (optLabels[Number(userAns)].toLowerCase() === correctStr) isCorrect = true;
      } else if (q.options) {
        const matchingOptIdx = q.options.findIndex((opt) => opt.trim() === String(userAns).trim());
        if (matchingOptIdx !== -1 && optLabels[matchingOptIdx]?.toLowerCase() === correctStr) {
          isCorrect = true;
        }
      }
    } else if (String(userAns).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase()) {
      isCorrect = true;
    }

    return { isCorrect, isAnswered: true };
  };

  // Compute stats across all questions
  const evaluatedQuestions = useMemo(() => {
    return questions.map((q, idx) => {
      const userAns = answers[q.id];
      const { isCorrect, isAnswered } = evaluateQuestion(q, userAns);
      const isFlagged = flagged.includes(idx);
      const explanation = getRichQuestionExplanation(q);

      return {
        question: q,
        index: idx,
        number: idx + 1,
        userAnswer: userAns,
        isCorrect,
        isAnswered,
        isFlagged,
        explanation,
      };
    });
  }, [questions, answers, flagged]);

  const correctCount = evaluatedQuestions.filter((item) => item.isCorrect).length;
  const incorrectCount = evaluatedQuestions.filter((item) => item.isAnswered && !item.isCorrect).length;
  const unansweredCount = evaluatedQuestions.filter((item) => !item.isAnswered).length;
  const flaggedCount = evaluatedQuestions.filter((item) => item.isFlagged).length;

  // Filter questions according to user selection
  const filteredQuestions = useMemo(() => {
    return evaluatedQuestions.filter((item) => {
      // Status filter
      if (statusFilter === 'correct' && !item.isCorrect) return false;
      if (statusFilter === 'incorrect' && (!item.isAnswered || item.isCorrect)) return false;
      if (statusFilter === 'unanswered' && item.isAnswered) return false;
      if (statusFilter === 'flagged' && !item.isFlagged) return false;

      // Category filter
      if (categoryFilter !== 'all' && item.question.category !== categoryFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const qText = item.question.question_text.toLowerCase();
        const query = searchQuery.toLowerCase();
        if (!qText.includes(query)) return false;
      }

      return true;
    });
  }, [evaluatedQuestions, statusFilter, categoryFilter, searchQuery]);

  const toggleQuestionExplanation = (qId: string) => {
    setExpandedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) {
        next.delete(qId);
      } else {
        next.add(qId);
      }
      return next;
    });
  };

  const handleToggleAllExplanations = () => {
    if (allExpanded) {
      setExpandedQuestionIds(new Set());
      setAllExpanded(false);
    } else {
      const allIds = new Set(questions.map((q) => q.id));
      setExpandedQuestionIds(allIds);
      setAllExpanded(true);
    }
  };

  const scrollToQuestion = (qNum: number) => {
    const el = document.getElementById(`review-question-${qNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl max-w-sm w-full mx-auto space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6 animate-pulse text-[#0284C7]" />
          </div>
          <h2 className="font-heading text-base font-bold text-slate-900">Memuat Pembahasan...</h2>
          <p className="text-xs text-slate-500">Menyiapkan ulasan soal dan referensi IMO SMCP.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 font-sans pb-16 px-3 sm:px-6 text-sm">
      {/* Top Header Card (Clean & Compact) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href={`/student/test/result/${attemptId}`} className="hover:text-[#0284C7] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Lembar Nilai</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Review Pembahasan</span>
          </div>
          <h1 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
            {testName}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span className={`font-bold font-mono px-2 py-0.5 rounded-md ${isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
              Skor: {score}% ({isPassed ? 'Lulus' : 'Remedial'})
            </span>
            <span>•</span>
            <span>{correctCount} Benar, {incorrectCount} Salah dari {questions.length} Soal</span>
            <span>•</span>
            <span>Level CEFR: <strong>{level}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleToggleAllExplanations}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            {allExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{allExpanded ? 'Tutup Semua' : 'Buka Semua'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak</span>
          </button>

          <Link
            href={`/student/test/${testNumber}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs font-semibold transition-all shadow-md shadow-sky-500/25"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Ujian</span>
          </Link>
        </div>
      </div>

      {/* Main Review Section (3:1 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
        {/* Left Column: Filter & Questions List (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Streamlined Filter Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Semua ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('correct')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'correct'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Check className="w-3 h-3" />
                <span>Benar ({correctCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('incorrect')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'incorrect'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <X className="w-3 h-3" />
                <span>Salah ({incorrectCount})</span>
              </button>
              {unansweredCount > 0 && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('unanswered')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'unanswered'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>Kosong ({unansweredCount})</span>
                </button>
              )}
              {flaggedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('flagged')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'flagged'
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Flag className="w-3 h-3" />
                  <span>Ragu ({flaggedCount})</span>
                </button>
              )}
            </div>

            {/* Category Dropdown & Search */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0284C7]"
              >
                <option value="all">Semua Kategori</option>
                <option value="grammar">Grammar</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="time_and_numbers">Time & Numbers</option>
                <option value="reading_comprehension">Reading</option>
                <option value="listening_comprehension">Listening</option>
              </select>

              <div className="relative flex-1 sm:w-40">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari kata..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>
          </div>

          {/* Question List */}
          {filteredQuestions.length === 0 ? (
            <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">Tidak ada soal sesuai filter ini.</p>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="text-[#0284C7] hover:underline font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((item) => {
                const q = item.question;
                const catInfo = getCategoryInfo(q.category);
                const userAns = item.userAnswer;
                const expl = item.explanation;
                const isExpanded = expandedQuestionIds.has(q.id) || allExpanded;
                const optLabels = q.question_data?.option_labels || [];

                return (
                  <div
                    key={q.id}
                    id={`review-question-${item.number}`}
                    className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 transition-colors scroll-mt-20 ${
                      item.isCorrect
                        ? 'border-emerald-200'
                        : item.isAnswered
                        ? 'border-rose-200'
                        : 'border-amber-200'
                    }`}
                  >
                    {/* Header: Number, Category, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                          {item.number}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${catInfo.bg} ${catInfo.color}`}>
                          {catInfo.name}
                        </span>

                        {item.isFlagged && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                            <Flag className="w-3 h-3 text-amber-600" />
                            <span>Ragu</span>
                          </span>
                        )}
                      </div>

                      {/* Status badge */}
                      <div>
                        {item.isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                            <Check className="w-3.5 h-3.5" />
                            <span>Benar</span>
                          </span>
                        ) : item.isAnswered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                            <X className="w-3.5 h-3.5" />
                            <span>Salah</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Tidak Dijawab</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Audio Player if Listening */}
                    {(q.category === 'listening_comprehension' || q.audio_url || q.question_data?.audio_transcript) && (
                      <ReviewAudioPlayer
                        audioUrl={q.audio_url}
                        transcript={q.question_data?.audio_transcript || q.question_text}
                      />
                    )}

                    {/* Question Stimulus Image */}
                    {q.image_url && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 max-w-md mx-auto bg-slate-50">
                        <img
                          src={q.image_url}
                          alt="Stimulus Soal"
                          className="w-full h-auto max-h-56 object-contain mx-auto"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Question Statement */}
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-relaxed">
                        {q.question_text}
                      </h3>
                    </div>

                    {/* Options / Answer Breakdown */}
                    <div className="space-y-2">
                      {/* 1. Multiple Choice / Image Choice Options */}
                      {q.options && q.options.length > 0 && q.question_type !== 'paragraph_title_match' && (
                        <div className={`grid gap-2.5 ${
                          q.options.some((opt) => isImageUrl(opt))
                            ? 'grid-cols-2 sm:grid-cols-4'
                            : 'grid-cols-1 sm:grid-cols-2'
                        }`}>
                          {q.options.map((opt, optIdx) => {
                            const optLabel = optLabels[optIdx];
                            const isImg = isImageUrl(opt);

                            // Match selection
                            const isSelected =
                              String(userAns || '').trim() === opt.trim() ||
                              (optLabel && String(userAns || '').trim().toLowerCase() === optLabel.toLowerCase()) ||
                              String(userAns || '').trim() === String(optIdx);

                            // Match correct answer
                            const isCorrectOpt =
                              String(q.correct_answer || '').trim() === opt.trim() ||
                              (optLabel && String(q.correct_answer || '').trim().toLowerCase() === optLabel.toLowerCase()) ||
                              (q.correct_answer && String(opt).toLowerCase().includes(String(q.correct_answer).toLowerCase()));

                            let cardBorder = 'border-slate-200 bg-slate-50 text-slate-700';
                            let badgeStyle = 'bg-slate-200 text-slate-700';

                            if (isCorrectOpt) {
                              cardBorder = 'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-300';
                              badgeStyle = 'bg-emerald-600 text-white';
                            } else if (isSelected && !isCorrectOpt) {
                              cardBorder = 'border-rose-300 bg-rose-50/70 text-rose-950 font-semibold ring-1 ring-rose-300';
                              badgeStyle = 'bg-rose-600 text-white';
                            }

                            // If Option is Image
                            if (isImg) {
                              return (
                                <div
                                  key={optIdx}
                                  className={`rounded-xl border p-2 flex flex-col items-center gap-1.5 transition-all ${cardBorder}`}
                                >
                                  <div className="relative w-full h-28 sm:h-32 rounded-lg overflow-hidden bg-white border border-slate-200">
                                    <img
                                      src={opt}
                                      alt={optLabel || `Opsi ${String.fromCharCode(65 + optIdx)}`}
                                      className="w-full h-full object-cover object-center"
                                      loading="lazy"
                                    />
                                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold absolute top-1 left-1 ${badgeStyle}`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                  </div>

                                  <div className="w-full text-center">
                                    {optLabel && (
                                      <p className="font-semibold text-xs text-slate-800 truncate">
                                        {optLabel}
                                      </p>
                                    )}
                                    <div className="flex items-center justify-center mt-0.5">
                                      {isCorrectOpt && (
                                        <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                                          <Check className="w-3 h-3" />
                                          <span>Kunci Benar</span>
                                        </span>
                                      )}
                                      {isSelected && !isCorrectOpt && (
                                        <span className="text-[10px] font-bold text-rose-700 flex items-center gap-0.5">
                                          <X className="w-3 h-3" />
                                          <span>Pilihan Anda</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // Standard Text Option
                            return (
                              <div
                                key={optIdx}
                                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2.5 transition-all ${cardBorder}`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${badgeStyle}`}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="leading-relaxed">{opt}</span>
                                </div>

                                <div className="shrink-0 flex items-center gap-1">
                                  {isCorrectOpt && (
                                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                      <Check className="w-3 h-3" />
                                      <span>Kunci Benar</span>
                                    </span>
                                  )}
                                  {isSelected && !isCorrectOpt && (
                                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                                      <X className="w-3 h-3" />
                                      <span>Pilihan Anda</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 2. Non-MC / Sentence Reorder / Gap Fill Summary (Formatted as Human Readable Text) */}
                      {(!q.options || q.options.length === 0 || q.question_type === 'paragraph_title_match' || q.question_type === 'sentence_reorder' || q.question_type === 'gap_fill') && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                Jawaban Anda:
                              </span>
                              <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-800">
                                {renderFormattedUserAnswer(userAns, q)}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                                Kunci Jawaban Resmi:
                              </span>
                              <div className="p-3 rounded-lg bg-emerald-50/90 border border-emerald-200 text-emerald-950">
                                {renderFormattedCorrectAnswer(q)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pembahasan & Analisis Section (Clean Accordion) */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden text-xs">
                      {/* Toggle Bar */}
                      <button
                        type="button"
                        onClick={() => toggleQuestionExplanation(q.id)}
                        className="w-full p-3 flex items-center justify-between gap-3 text-left hover:bg-slate-100/70 transition-colors cursor-pointer bg-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Lightbulb className="w-3 h-3" />
                          </div>
                          <span className="font-semibold text-slate-900 text-xs">
                            Pembahasan & Analisis Soal
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0284C7] hover:text-[#0369A1] shrink-0">
                          <span>{isExpanded ? 'Tutup' : 'Lihat Pembahasan'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="p-4 space-y-3 text-xs bg-white border-t border-slate-100">
                          {/* 1. Alasan Kunci Benar */}
                          <div className="space-y-1">
                            <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Alasan Kunci Jawaban Benar:</span>
                            </span>
                            <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-slate-800 leading-relaxed font-normal">
                              <p>{expl.whyCorrect}</p>
                              {expl.ruleOrFormula && (
                                <div className="mt-2 pt-2 border-t border-emerald-200/70 flex items-center gap-1.5 text-[11px] font-mono text-emerald-900">
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-200/80 font-semibold">Kaidah:</span>
                                  <span>{expl.ruleOrFormula}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 2. Analisis Opsi Lain */}
                          {expl.distractors && expl.distractors.length > 0 && (
                            <div className="space-y-1 pt-1">
                              <span className="font-bold text-rose-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Analisis Pilihan Lain:</span>
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {expl.distractors.map((d, dIdx) => (
                                  <div key={dIdx} className="p-2 rounded-lg bg-rose-50/60 border border-rose-200 text-[11px] text-slate-700 leading-relaxed">
                                    <span className="font-semibold text-rose-900 block mb-0.5">
                                      Opsi "{d.option}":
                                    </span>
                                    <span>{d.reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. Konteks Maritim */}
                          {expl.maritimeContext && (
                            <div className="space-y-1 pt-1">
                              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1">
                                <Anchor className="w-3.5 h-3.5 text-[#0284C7]" />
                                <span>Konteks Maritim:</span>
                              </span>
                              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                                {expl.maritimeContext}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Question Navigator (1 Col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs sticky top-20 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#0284C7]" />
                <span>Navigator (1–{questions.length})</span>
              </h3>
            </div>

            {/* Compact Legend */}
            <div className="flex items-center gap-3 text-[10px] font-medium pb-2 border-b border-slate-100 text-slate-600 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Benar</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Salah</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Kosong</span>
              </div>
            </div>

            {/* Grid 1 to 60 */}
            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-1 max-h-[320px] overflow-y-auto pr-0.5">
              {evaluatedQuestions.map((item) => {
                let btnStyle = 'bg-amber-100 text-amber-900 border-amber-200';
                if (item.isCorrect) {
                  btnStyle = 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600';
                } else if (item.isAnswered) {
                  btnStyle = 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600';
                }

                return (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => scrollToQuestion(item.number)}
                    className={`h-7 rounded-md font-mono font-bold text-xs border flex items-center justify-center relative transition-colors cursor-pointer ${btnStyle}`}
                    title={`Soal #${item.number}`}
                  >
                    <span>{item.number}</span>
                    {item.isFlagged && (
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 absolute top-0.5 right-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sidebar bottom links */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <Link
                href={`/student/test/result/${attemptId}`}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20"
              >
                <span>Lembar Hasil Ujian</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/student/history"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
              >
                <span>Riwayat Ujian</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
