'use client';

export const dynamic = 'force-dynamic';

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
  LogOut,
  AlertTriangle,
  Loader2,
  Grid,
  X,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Question } from '@/lib/supabase/types';
import { getCategoryInfo, formatStopwatch, randomizeTestQuestions } from '@/lib/utils';
import Logo from '@/components/brand/Logo';
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

function getTestInfo(testNum: number) {
  switch (testNum) {
    case 10:
      return {
        test_number: 10,
        test_name: 'Marlins Test 10 – Master & Chief Engineer Executive Capstone',
        questions: MARLINS_TEST_10_STANDARD_QUESTIONS,
      };
    case 9:
      return {
        test_number: 9,
        test_name: 'Marlins Test 9 – Autonomous Ships (MASS), GMDSS & BRM Forensics',
        questions: MARLINS_TEST_9_STANDARD_QUESTIONS,
      };
    case 8:
      return {
        test_number: 8,
        test_name: 'Marlins Test 8 – Heavy Lift, Dry Docking & Ocean Towage',
        questions: MARLINS_TEST_8_STANDARD_QUESTIONS,
      };
    case 7:
      return {
        test_number: 7,
        test_name: 'Marlins Test 7 – Ro-Ro Passenger Safety & Green Shipping',
        questions: MARLINS_TEST_7_STANDARD_QUESTIONS,
      };
    case 6:
      return {
        test_number: 6,
        test_name: 'Marlins Test 6 – Container & Bulk Carrier Operations',
        questions: MARLINS_TEST_6_STANDARD_QUESTIONS,
      };
    case 5:
      return {
        test_number: 5,
        test_name: 'Marlins Test 5 – Offshore Operations & Dynamic Positioning',
        questions: MARLINS_TEST_5_STANDARD_QUESTIONS,
      };
    case 4:
      return {
        test_number: 4,
        test_name: 'Marlins Test 4 – Tanker Operations & IMDG Cargo Handling',
        questions: MARLINS_TEST_4_STANDARD_QUESTIONS,
      };
    case 3:
      return {
        test_number: 3,
        test_name: 'Marlins Test 3 – Bridge Watchkeeping & COLREGs',
        questions: MARLINS_TEST_3_STANDARD_QUESTIONS,
      };
    case 2:
      return {
        test_number: 2,
        test_name: 'Marlins Test 2 – Deck & Engine Operations',
        questions: MARLINS_TEST_2_STANDARD_QUESTIONS,
      };
    case 1:
    default:
      return {
        test_number: 1,
        test_name: 'Marlins Test 1 – Cruise Hospitality & Maritime English',
        questions: MARLINS_60_STANDARD_QUESTIONS,
      };
  }
}

export default function TestTakingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile, isSuperAdmin, isInstructor } = useAuth();
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
  const [navigatorModalOpen, setNavigatorModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to get or persist initial attempt start timestamp
  const getOrSetStartTime = useCallback((attemptId: string, serverStartedAt?: string | null): number => {
    if (typeof window === 'undefined') return Date.now();
    const storageKey = `marlins_attempt_start_${attemptId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = Number(stored);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (serverStartedAt) {
      const serverTime = new Date(serverStartedAt).getTime();
      if (!isNaN(serverTime) && serverTime > 0) {
        localStorage.setItem(storageKey, String(serverTime));
        return serverTime;
      }
    }
    const now = Date.now();
    localStorage.setItem(storageKey, String(now));
    return now;
  }, []);

  // Elapsed stopwatch timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!attemptId) return;

    const calculateElapsed = () => {
      const startTimestamp = getOrSetStartTime(attemptId, attempt?.started_at);
      const now = Date.now();
      const elapsed = Math.max(0, Math.floor((now - startTimestamp) / 1000));
      setElapsedSeconds(elapsed);
      try {
        localStorage.setItem(`marlins_attempt_elapsed_${attemptId}`, String(elapsed));
      } catch (err) {}
    };

    calculateElapsed();
    const timer = setInterval(calculateElapsed, 1000);
    return () => clearInterval(timer);
  }, [attemptId, attempt?.started_at, getOrSetStartTime]);

  // Intercept browser back button & phone back gestures to trigger exit confirmation modal
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.history.pushState({ marlinsExamActive: true }, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState({ marlinsExamActive: true }, '', window.location.href);
      setExitModalOpen(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Sesi ujian sedang berlangsung. Keluar akan membatalkan sesi ujian.';
      return e.returnValue;
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Load Attempt Data
  useEffect(() => {
    async function loadAttempt() {
      try {
        setLoading(true);

        try {
          const savedAnswers = localStorage.getItem(`marlins_attempt_answers_${attemptId}`);
          if (savedAnswers) {
            const parsed = JSON.parse(savedAnswers);
            if (parsed && typeof parsed === 'object') {
              setAnswers(parsed);
            }
          }
        } catch (err) {}

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

        // Security check: verify entitlement for paid tests 2 to 10
        if (parsedTestNum > 1 && (user || profile)) {
          const isStaff = isSuperAdmin || isInstructor || profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'instructor';
          let hasAccess = isStaff;

          const userIds = [user?.id, profile?.id].filter(Boolean);
          const userEmails = [user?.email, profile?.email].filter(Boolean);

          if (!hasAccess && profile?.department_track && profile.department_track.startsWith('[')) {
            try {
              const arr = JSON.parse(profile.department_track);
              if (Array.isArray(arr) && arr.map(Number).includes(Number(parsedTestNum))) {
                hasAccess = true;
              }
            } catch (e) {}
          }

          if (!hasAccess && userIds.length > 0) {
            try {
              const { data: entData } = await supabase
                .from('test_entitlements')
                .select('id')
                .or(`user_id.in.(${userIds.map((id) => `"${id}"`).join(',')}),user_id.in.(${userEmails.map((em) => `"${em}"`).join(',')})`)
                .eq('test_number', parsedTestNum)
                .eq('is_active', true)
                .maybeSingle();

              if (entData) hasAccess = true;
            } catch (e) {}
          }

          if (!hasAccess && typeof window !== 'undefined') {
            const checkKeys = [
              ...userIds.map((id) => `marlins_entitlements_${id}`),
              ...userEmails.map((em) => `marlins_entitlements_${em?.toLowerCase()}`),
              'marlins_entitlements_all',
            ];

            checkKeys.forEach((k) => {
              const localEnt = localStorage.getItem(k);
              if (localEnt) {
                try {
                  const arr = JSON.parse(localEnt);
                  if (Array.isArray(arr) && arr.map(Number).includes(Number(parsedTestNum))) {
                    hasAccess = true;
                  }
                } catch (e) {}
              }
            });
          }

          if (!hasAccess) {
            router.push(`/student/checkout/${parsedTestNum}`);
            return;
          }
        }

        const info = getTestInfo(parsedTestNum);

        const { data, error } = await supabase.rpc('get_test_attempt', {
          p_attempt_id: attemptId,
        });

        if (error || !data) {
          const startTimeIso = new Date(getOrSetStartTime(attemptId)).toISOString();
          let randomizedList: Question[] = [];
          try {
            const cached = localStorage.getItem(`marlins_attempt_questions_${attemptId}`);
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length >= 60) {
                randomizedList = parsed;
              }
            }
          } catch (e) {}

          if (randomizedList.length === 0) {
            randomizedList = randomizeTestQuestions(info.questions, attemptId);
            try {
              localStorage.setItem(`marlins_attempt_questions_${attemptId}`, JSON.stringify(randomizedList));
            } catch (e) {}
          }

          setAttempt({
            attempt_id: attemptId,
            test_number: info.test_number,
            test_name: info.test_name,
            started_at: startTimeIso,
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            duration_minutes: 60,
            total_questions: randomizedList.length,
            passing_grade: 70,
            status: 'active',
            questions: randomizedList,
          });
          return;
        }

        if (data.status === 'completed') {
          router.replace(`/student/test/result/${attemptId}`);
          return;
        }

        const effectiveTestNumber = data.test_number || parsedTestNum;
        const resolvedInfo = getTestInfo(effectiveTestNumber);
        const rawQuestionsList = data.questions && data.questions.length >= 60 ? data.questions : resolvedInfo.questions;

        let randomizedList: Question[] = [];
        try {
          const cached = localStorage.getItem(`marlins_attempt_questions_${attemptId}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length >= 60) {
              randomizedList = parsed;
            }
          }
        } catch (e) {}

        if (randomizedList.length === 0) {
          randomizedList = randomizeTestQuestions(rawQuestionsList, attemptId);
          try {
            localStorage.setItem(`marlins_attempt_questions_${attemptId}`, JSON.stringify(randomizedList));
          } catch (e) {}
        }

        if (data.started_at) {
          getOrSetStartTime(attemptId, data.started_at);
        }

        setAttempt({
          ...data,
          test_number: resolvedInfo.test_number,
          test_name: resolvedInfo.test_name,
          total_questions: randomizedList.length,
          questions: randomizedList,
        } as AttemptData);
      } catch (err: any) {
        let parsedTestNum = 1;
        const info = getTestInfo(parsedTestNum);
        const startTimeIso = new Date(getOrSetStartTime(attemptId)).toISOString();

        let randomizedList: Question[] = [];
        try {
          const cached = localStorage.getItem(`marlins_attempt_questions_${attemptId}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length >= 60) {
              randomizedList = parsed;
            }
          }
        } catch (e) {}

        if (randomizedList.length === 0) {
          randomizedList = randomizeTestQuestions(info.questions, attemptId);
          try {
            localStorage.setItem(`marlins_attempt_questions_${attemptId}`, JSON.stringify(randomizedList));
          } catch (e) {}
        }

        setAttempt({
          attempt_id: attemptId,
          test_number: info.test_number,
          test_name: info.test_name,
          started_at: startTimeIso,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          duration_minutes: 60,
          total_questions: randomizedList.length,
          passing_grade: 70,
          status: 'active',
          questions: randomizedList,
        });
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      loadAttempt();
    }
  }, [attemptId, router, getOrSetStartTime]);

  const handleAnswer = (questionId: string, answerValue: any) => {
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [questionId]: answerValue,
      };
      try {
        localStorage.setItem(`marlins_attempt_answers_${attemptId}`, JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
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

  // Keyboard Shortcuts (A/B/C/D, 1/2/3/4, Arrows, Flag)
  useEffect(() => {
    if (!attempt || !attempt.questions || attempt.questions.length === 0) return;
    const currentQ = attempt.questions[currentIndex];
    if (!currentQ) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
        return;
      }

      const key = e.key.toUpperCase();

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex((prev) => prev - 1);
        return;
      }
      if (e.key === 'ArrowRight' && currentIndex < attempt.questions.length - 1) {
        e.preventDefault();
        setCurrentIndex((prev) => prev + 1);
        return;
      }

      if (key === 'F') {
        e.preventDefault();
        handleToggleFlag(currentIndex);
        return;
      }

      if (currentQ.question_type === 'multiple_choice' || !currentQ.question_type) {
        const options = currentQ.options || [];
        let optIndex = -1;

        if (key === 'A' || key === '1') optIndex = 0;
        else if (key === 'B' || key === '2') optIndex = 1;
        else if (key === 'C' || key === '3') optIndex = 2;
        else if (key === 'D' || key === '4') optIndex = 3;

        if (optIndex >= 0 && optIndex < options.length) {
          e.preventDefault();
          handleAnswer(currentQ.id, options[optIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [attempt, currentIndex]);

  // Handler: When user confirms to exit without completing, clear all stored session answers & progress
  const handleExitAndResetSession = () => {
    try {
      localStorage.removeItem(`marlins_attempt_answers_${attemptId}`);
      localStorage.removeItem(`marlins_attempt_questions_${attemptId}`);
      localStorage.removeItem(`marlins_attempt_start_${attemptId}`);
      localStorage.removeItem(`marlins_attempt_elapsed_${attemptId}`);
      localStorage.removeItem(`marlins_review_${attemptId}`);
    } catch (err) {}

    setAnswers({});
    setExitModalOpen(false);
    router.replace('/student/tests');
  };

  const handleFinalSubmit = async () => {
    if (!attempt || submitting) return;

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const formattedAnswers = Object.entries(answersRef.current).map(
        ([questionId, answerValue]) => ({
          question_id: questionId,
          answer_value: answerValue,
        })
      );

      const { data, error } = await supabase.rpc('submit_test_attempt', {
        p_attempt_id: attemptId,
        p_answers: formattedAnswers,
      });

      if (error) {
        evaluateAndSaveClientSide(formattedAnswers);
        return;
      }

      try {
        localStorage.setItem(
          `marlins_review_${attemptId}`,
          JSON.stringify({
            attempt_id: attemptId,
            test_number: attempt.test_number,
            test_name: attempt.test_name,
            questions: attempt.questions,
            answers: answersRef.current,
            flagged: Array.from(flaggedQuestions),
            completed_at: new Date().toISOString(),
          })
        );
      } catch (e) {}

      router.replace(`/student/test/result/${attemptId}`);
    } catch (err: any) {
      evaluateAndSaveClientSide(
        Object.entries(answersRef.current).map(([qId, val]) => ({
          question_id: qId,
          answer_value: val,
        }))
      );
    } finally {
      setSubmitting(false);
    }
  };

  const evaluateAndSaveClientSide = async (userAnswers: { question_id: string; answer_value: any }[]) => {
    if (!attempt) return;

    const answerMap = new Map(userAnswers.map((a) => [a.question_id, a.answer_value]));
    let totalScore = 0;
    const categoryStats: Record<string, { total: number; correct: number }> = {};
    const questionEvaluations: Record<string, boolean> = {};

    attempt.questions.forEach((q) => {
      const cat = q.category || 'general';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, correct: 0 };
      }
      categoryStats[cat].total += 1;

      const userAns = answerMap.get(q.id);
      let isCorrect = false;

      if (userAns !== undefined && userAns !== null) {
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
      }

      questionEvaluations[q.id] = isCorrect;

      if (isCorrect) {
        totalScore += 1;
        categoryStats[cat].correct += 1;
      }
    });

    const finalPercentage = Math.round((totalScore / Math.max(1, attempt.questions.length)) * 100);
    const isPassed = finalPercentage >= (attempt.passing_grade || 70);
    const levelCode =
      finalPercentage >= 90
        ? 'C2'
        : finalPercentage >= 80
        ? 'C1'
        : finalPercentage >= 70
        ? 'B2'
        : finalPercentage >= 55
        ? 'B1+'
        : finalPercentage >= 40
        ? 'B1'
        : 'A2';

    const categoryScoresObj: Record<string, { correct: number; total: number }> = {};
    Object.entries(categoryStats).forEach(([cat, stat]) => {
      categoryScoresObj[cat] = { correct: stat.correct, total: stat.total };
    });

    const isValidUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const resultUuid = isValidUuid(attemptId)
      ? attemptId
      : typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `8899e649-9911-44eb-845f-${Date.now().toString(16).padStart(12, '0')}`;
    const certUuid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `99887766-5544-3322-1100-${Date.now().toString(16).padStart(12, '0')}`;

    const studentUserId = user?.id || profile?.id || '65a606b2-3074-43b1-ade6-fbbd7e00b7d6';
    const studentEmail = (user?.email || profile?.email || 'bita@gmail.com').toLowerCase();
    const pointsEarned = Math.max(50, Math.round(finalPercentage * 1.5));
    const timeSpent = Math.max(60, Math.floor((Date.now() - getOrSetStartTime(attemptId)) / 1000));
    const nowIso = new Date().toISOString();

    const clientResult = {
      id: resultUuid,
      student_id: studentUserId,
      student_email: studentEmail,
      attempt_id: attemptId,
      test_number: attempt.test_number,
      marlint_test_number: attempt.test_number,
      test_name: attempt.test_name,
      score: finalPercentage,
      overall_score: finalPercentage,
      total_score: totalScore,
      correct_answers: totalScore,
      total_questions: attempt.questions.length,
      passing_grade: attempt.passing_grade || 70,
      is_passed: isPassed,
      level: levelCode,
      category_scores: categoryScoresObj,
      points_earned: pointsEarned,
      time_spent_seconds: timeSpent,
      start_time: new Date(getOrSetStartTime(attemptId)).toISOString(),
      end_time: nowIso,
      completed_at: nowIso,
      created_at: nowIso,
      user_answers: userAnswers,
    };

    let generatedCertificate: any = null;
    if (isPassed) {
      const studentName = profile?.full_name || user?.user_metadata?.full_name || 'Budi Santoso';
      const certNumber = `MARLINS-${attempt.test_number}-${Date.now().toString().slice(-6)}`;
      const verCode = `VER-${Date.now().toString().slice(-8)}`;

      generatedCertificate = {
        id: certUuid,
        certificate_number: certNumber,
        user_id: studentUserId,
        marlint_test_id: `test-${attempt.test_number}`,
        result_id: clientResult.id,
        student_name: studentName,
        student_email: studentEmail,
        test_name: attempt.test_name,
        test_number: attempt.test_number,
        score: finalPercentage,
        grade: finalPercentage >= 85 ? 'Distinction' : 'Merit',
        level: levelCode,
        is_passed: true,
        category_scores: categoryScoresObj,
        total_questions: attempt.questions.length,
        correct_answers: totalScore,
        duration_minutes: attempt.duration_minutes || 60,
        passing_grade: attempt.passing_grade || 70,
        completion_date: nowIso,
        is_valid: true,
        verification_code: verCode,
        issued_at: nowIso,
      };
    }

    try {
      localStorage.setItem(`test_result_${attemptId}`, JSON.stringify(clientResult));
      localStorage.setItem(`marlins_result_${attemptId}`, JSON.stringify(clientResult));
      localStorage.setItem(`marlins_result_${resultUuid}`, JSON.stringify(clientResult));

      if (generatedCertificate) {
        localStorage.setItem(`marlins_cert_${attemptId}`, JSON.stringify(generatedCertificate));
        localStorage.setItem(`marlins_cert_id_${generatedCertificate.id}`, JSON.stringify(generatedCertificate));
      }

      const reviewPayload = {
        attempt_id: attemptId,
        test_number: attempt.test_number,
        test_name: attempt.test_name,
        questions: attempt.questions,
        answers: answersRef.current,
        evaluations: questionEvaluations,
        result: clientResult,
        flagged: Array.from(flaggedQuestions),
        completed_at: clientResult.completed_at,
      };
      localStorage.setItem(`marlins_review_${attemptId}`, JSON.stringify(reviewPayload));

      const userHistKeys = [
        `marlins_history_results_${studentUserId}`,
        `marlins_history_results_${studentEmail}`,
        'marlins_history_results',
      ];
      userHistKeys.forEach((key) => {
        let historyArr: any[] = [];
        try {
          const existingStr = localStorage.getItem(key);
          if (existingStr) historyArr = JSON.parse(existingStr);
          if (!Array.isArray(historyArr)) historyArr = [];
        } catch (e) {
          historyArr = [];
        }
        historyArr = historyArr.filter((item) => item.attempt_id !== attemptId && item.id !== resultUuid);
        historyArr.unshift(clientResult);
        localStorage.setItem(key, JSON.stringify(historyArr));
      });
    } catch (e) {
      console.warn('Failed to save result to localStorage:', e);
    }

    try {
      await supabase.from('student_results').upsert({
        id: resultUuid,
        student_id: studentUserId,
        attempt_id: isValidUuid(attemptId) ? attemptId : null,
        score: finalPercentage,
        correct_answers: totalScore,
        total_questions: attempt.questions.length,
        level: levelCode,
        category_scores: categoryScoresObj,
        start_time: clientResult.start_time,
        end_time: clientResult.end_time,
        is_passed: isPassed,
        test_name: attempt.test_name,
        marlint_test_number: attempt.test_number,
        test_mode: 'standard',
        points_earned: pointsEarned,
        time_spent_seconds: timeSpent,
        created_at: nowIso,
      });

      await supabase
        .from('users')
        .update({
          total_points: (profile?.total_points || 0) + pointsEarned,
          level_code: levelCode,
          level: levelCode,
          updated_at: nowIso,
        })
        .or(`id.eq.${studentUserId},email.eq.${studentEmail}`);

      if (isValidUuid(attemptId)) {
        await supabase
          .from('test_attempts')
          .update({
            status: 'completed',
            submitted_at: nowIso,
            result_id: resultUuid,
          })
          .eq('id', attemptId);
      }

      if (generatedCertificate) {
        await supabase.from('certificates').upsert({
          id: generatedCertificate.id,
          certificate_number: generatedCertificate.certificate_number,
          user_id: studentUserId,
          marlint_test_id: `test-${attempt.test_number}`,
          result_id: clientResult.id,
          student_name: generatedCertificate.student_name,
          student_email: generatedCertificate.student_email,
          test_name: attempt.test_name,
          test_number: attempt.test_number,
          score: finalPercentage,
          grade: generatedCertificate.grade,
          level: levelCode,
          is_passed: true,
          category_scores: categoryScoresObj,
          total_questions: attempt.questions.length,
          correct_answers: totalScore,
          duration_minutes: attempt.duration_minutes || 60,
          passing_grade: attempt.passing_grade || 70,
          completion_date: nowIso,
          is_valid: true,
          verification_code: generatedCertificate.verification_code,
          issued_at: nowIso,
        });
      }
    } catch (dbErr) {
      console.warn('Supabase DB sync note:', dbErr);
    }

    router.replace(`/student/test/result/${attemptId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl max-w-sm w-full space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Menyiapkan Lembar Soal Ujian...</h2>
          <p className="text-xs text-slate-400">Standar Resmi Marlins Test IMO STCW</p>
        </div>
      </div>
    );
  }

  if (!attempt || !attempt.questions || attempt.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl max-w-md w-full space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Sesi Ujian Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500">{errorMsg || 'Data sesi telah berakhir atau sudah diselesaikan.'}</p>
          <Link
            href="/student/tests"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0284C7] text-white font-bold text-xs shadow-xs"
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
    return ans !== undefined && ans !== null && ans !== '' && (typeof ans !== 'object' || Object.keys(ans).length > 0);
  }).length;
  const unansweredCount = totalQuestionsCount - answeredCount;
  const flaggedCount = flaggedQuestions.size;
  const categoryInfo = getCategoryInfo(currentQuestion.category);
  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestionsCount) * 100);

  const getInstructionText = (q: Question) => {
    if (q.question_type === 'paragraph_title_match') return 'Choose the correct title for each paragraph from the dropdown menu.';
    if (q.question_type === 'gap_fill') return 'Choose the correct word or phrase from the dropdown menu to complete each blank.';
    if (q.question_type === 'sentence_reorder') return 'Click on the words below to arrange them into a grammatically correct sentence.';
    if (q.question_type === 'audio_listening' || q.category === 'listening_comprehension') return 'Listen to the audio prompt carefully, then select the single correct answer.';
    if (q.category === 'time_and_numbers') return 'Look at the question and select the correct time, quantity, or number.';
    return 'Read the question carefully and select the single correct answer from the options below.';
  };

  const handleJumpToFirstUnanswered = () => {
    const firstEmptyIdx = questions.findIndex((q) => {
      const ans = answers[q.id];
      return ans === undefined || ans === null || ans === '' || (typeof ans === 'object' && Object.keys(ans).length === 0);
    });
    if (firstEmptyIdx !== -1) {
      setCurrentIndex(firstEmptyIdx);
      setNavigatorModalOpen(false);
    }
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      className="fixed inset-0 h-[100dvh] w-screen bg-[#F8FAFC] flex flex-col overflow-hidden select-none touch-manipulation exam-secure-mode font-sans text-slate-900"
    >
      {/* 1. TOP HEADER — Clean, Minimal, Academic Standard */}
      <header className="shrink-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Logo & Test Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Logo size="sm" showSubtitle={false} href="/student/dashboard" hideTextOnMobile={true} />
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                  IMO STCW
                </span>
                <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate" title={attempt.test_name}>
                  {attempt.test_name || 'Marlins Test'}
                </h1>
              </div>
            </div>
          </div>

          {/* Right: Stopwatch, Navigator Button & Exit */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Stopwatch Time */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs sm:text-sm font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatStopwatch(elapsedSeconds)}</span>
            </div>

            {/* Navigator Trigger */}
            <button
              type="button"
              onClick={() => setNavigatorModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100/90 border border-sky-200/90 text-[#0284C7] text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Daftar Soal</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#0284C7] text-white text-[10px] font-mono shadow-2xs">
                {answeredCount}/{totalQuestionsCount}
              </span>
            </button>

            {/* Exit Trigger */}
            <button
              type="button"
              onClick={() => setExitModalOpen(true)}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 hover:scale-105 active:scale-95"
              title="Keluar dari Ujian"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN QUESTION WORKSPACE */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-4 my-auto pb-4">
          
          {/* Active Question Card */}
          <div className="bg-white rounded-[24px] p-5 sm:p-8 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4 relative">
            
            {/* Question Header: Number Pill, Category Pill & Flag Toggle */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide font-mono shadow-2xs">
                  SOAL {currentIndex + 1}
                </span>

                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${categoryInfo.bg} ${categoryInfo.color} border-slate-200/60`}
                >
                  {categoryInfo.name}
                </span>
              </div>

              {/* Ragu-Ragu Checkbox Button */}
              <button
                type="button"
                onClick={() => handleToggleFlag(currentIndex)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs ${
                  flaggedQuestions.has(currentIndex)
                    ? 'bg-amber-400 text-amber-950 font-bold ring-2 ring-amber-300 scale-102'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flaggedQuestions.has(currentIndex) ? 'fill-amber-950' : ''}`} />
                <span>{flaggedQuestions.has(currentIndex) ? 'Ragu-ragu' : 'Tandai Ragu'}</span>
              </button>
            </div>

            {/* Instruction Notice */}
            <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100/90 text-xs text-sky-950 font-medium flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0284C7] shrink-0" />
              <p className="leading-snug">{getInstructionText(currentQuestion)}</p>
            </div>

            {/* Audio Component for Listening Questions */}
            {(currentQuestion.question_type === 'audio_listening' ||
              currentQuestion.category === 'listening_comprehension') && (
              <AudioListeningQuestion
                audioUrl={currentQuestion.audio_url || undefined}
                pronunciationText={
                  currentQuestion.pronunciation_text ||
                  currentQuestion.question_text ||
                  undefined
                }
              />
            )}

            {/* Question Text */}
            {currentQuestion.question_type !== 'paragraph_title_match' && (
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug break-words">
                {currentQuestion.question_text}
              </h2>
            )}

            {/* Optional Image Illustration */}
            {currentQuestion.image_url && (
              <div className="flex justify-center p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
                <img
                  src={currentQuestion.image_url}
                  alt="Ilustrasi Soal Marlins"
                  draggable={false}
                  className="max-h-48 sm:max-h-56 object-contain rounded-lg pointer-events-none select-none"
                />
              </div>
            )}

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
          </div>
        </div>
      </main>

      {/* 3. BOTTOM CONTROL BAR */}
      <footer className="shrink-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 sm:px-8 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-3xl mx-auto space-y-2.5">
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0284C7] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3">
            {/* Previous Button */}
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 sm:px-5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-2xs disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer active:scale-95 hover:-translate-x-0.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Question Progress Indicator */}
            <div className="text-center font-mono">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                Soal {currentIndex + 1} / {totalQuestionsCount}
              </span>
              <span className="text-[10px] text-slate-400 font-sans hidden sm:block">
                {answeredCount} Terjawab • {unansweredCount} Belum
              </span>
            </div>

            {/* Next or Finish Button */}
            <div>
              {currentIndex < totalQuestionsCount - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-5 sm:px-6 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-sm shadow-sky-500/20 transition-all duration-200 cursor-pointer active:scale-95 hover:translate-x-0.5"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-5 sm:px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all duration-200 cursor-pointer active:scale-95 hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Selesai Ujian</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL: 60 Question Grid Navigator */}
      {navigatorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-slate-900 rounded-[28px] p-5 sm:p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Soal ({totalQuestionsCount} Butir)
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Pilih nomor soal untuk langsung menuju soal tersebut.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNavigatorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* KPI Summary Status */}
            <div className="grid grid-cols-3 gap-2.5 py-1">
              <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-center transition-all">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Terjawab</span>
                <span className="font-mono text-base font-extrabold text-emerald-900">{answeredCount}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-center transition-all">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Ragu-Ragu</span>
                <span className="font-mono text-base font-extrabold text-amber-900">{flaggedCount}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center transition-all">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Belum</span>
                <span className="font-mono text-base font-extrabold text-slate-800">{unansweredCount}</span>
              </div>
            </div>

            {/* 60 Question Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 pt-1">
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
                    className={`h-9 sm:h-10 rounded-xl font-mono text-xs font-extrabold transition-all duration-200 cursor-pointer relative flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-[#0284C7] ring-offset-2 bg-[#0284C7] text-white shadow-sm scale-105 z-10'
                        : isFlagged
                        ? 'bg-amber-400 text-amber-950 font-bold hover:bg-amber-500 shadow-2xs hover:-translate-y-0.5'
                        : isAnswered
                        ? 'bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-2xs hover:-translate-y-0.5'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 hover:-translate-y-0.5'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && !isCurrent && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-950" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              {unansweredCount > 0 ? (
                <button
                  type="button"
                  onClick={handleJumpToFirstUnanswered}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-bold text-xs border border-sky-200/90 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Lompat ke Soal Kosong →</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Semua {totalQuestionsCount} soal telah terisi!</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setNavigatorModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all duration-200 cursor-pointer active:scale-95"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Submit Confirmation */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-slate-900 rounded-[28px] p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl text-center border border-slate-100">
            <div className="w-13 h-13 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-100 shadow-2xs">
              <FileCheck2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                Selesaikan Ujian Sekarang?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda telah menjawab <strong className="text-[#0284C7] font-bold">{answeredCount}</strong> dari <strong className="text-slate-800 font-bold">{totalQuestionsCount}</strong> butir soal.
                {unansweredCount > 0 && (
                  <span className="block text-amber-800 font-bold mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-left">
                    ⚠️ Masih ada {unansweredCount} soal yang belum Anda isi!
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                disabled={submitting}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all duration-200 cursor-pointer active:scale-95"
              >
                Periksa Kembali
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs transition-all duration-200 shadow-sm shadow-sky-500/20 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menilai...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Jawaban</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Exit Confirmation (Answers will NOT be saved) */}
      {exitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-slate-900 rounded-[28px] p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl text-center border border-slate-100">
            <div className="w-13 h-13 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100/90 shadow-2xs">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                Keluar dari Sesi Ujian?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Jika Anda keluar sekarang, sesi ujian akan dibatalkan dan progres jawaban Anda <strong className="text-rose-600 font-bold">tidak akan disimpan</strong>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setExitModalOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all duration-200 cursor-pointer active:scale-95"
              >
                Lanjutkan Ujian
              </button>
              <button
                type="button"
                onClick={handleExitAndResetSession}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs text-center shadow-sm shadow-rose-600/20 transition-all duration-200 cursor-pointer active:scale-95"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
