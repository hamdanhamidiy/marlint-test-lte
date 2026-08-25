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
  ShieldAlert,
  EyeOff,
  Lock,
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
        test_name: 'Marlins Test 10 - Master & Chief Engineer Executive Capstone',
        questions: MARLINS_TEST_10_STANDARD_QUESTIONS,
      };
    case 9:
      return {
        test_number: 9,
        test_name: 'Marlins Test 9 - Autonomous Ships (MASS), Modern GMDSS & BRM Forensics',
        questions: MARLINS_TEST_9_STANDARD_QUESTIONS,
      };
    case 8:
      return {
        test_number: 8,
        test_name: 'Marlins Test 8 - Heavy Lift, Dry Docking, Ocean Towage & Bio-Fouling',
        questions: MARLINS_TEST_8_STANDARD_QUESTIONS,
      };
    case 7:
      return {
        test_number: 7,
        test_name: 'Marlins Test 7 - Ro-Ro Passenger Safety, Polar Code & Green Shipping (CII)',
        questions: MARLINS_TEST_7_STANDARD_QUESTIONS,
      };
    case 6:
      return {
        test_number: 6,
        test_name: 'Marlins Test 6 - Container & Bulk Carrier Operations (IMSBC & Cyber Risk)',
        questions: MARLINS_TEST_6_STANDARD_QUESTIONS,
      };
    case 5:
      return {
        test_number: 5,
        test_name: 'Marlins Test 5 - Offshore Operations & Dynamic Positioning Systems',
        questions: MARLINS_TEST_5_STANDARD_QUESTIONS,
      };
    case 4:
      return {
        test_number: 4,
        test_name: 'Marlins Test 4 - Tanker Operations & IMDG Cargo Handling',
        questions: MARLINS_TEST_4_STANDARD_QUESTIONS,
      };
    case 3:
      return {
        test_number: 3,
        test_name: 'Marlins Test 3 - Bridge Watchkeeping & COLREGs',
        questions: MARLINS_TEST_3_STANDARD_QUESTIONS,
      };
    case 2:
      return {
        test_number: 2,
        test_name: 'Marlins Test 2 - Deck & Engine Operations',
        questions: MARLINS_TEST_2_STANDARD_QUESTIONS,
      };
    case 1:
    default:
      return {
        test_number: 1,
        test_name: 'Marlins Test 1 - Cruise Hospitality & Maritime English',
        questions: MARLINS_60_STANDARD_QUESTIONS,
      };
  }
}

export default function TestTakingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
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

  // Elapsed stopwatch timer state (Persisted & Synced with Absolute Timestamp)
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

  // Load Attempt Data with 60 questions fallback
  useEffect(() => {
    async function loadAttempt() {
      try {
        setLoading(true);

        // Restore previously saved answers from localStorage if any
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
        if (parsedTestNum > 1 && user) {
          let hasAccess = false;
          try {
            const { data: entData } = await supabase
              .from('test_entitlements')
              .select('id')
              .eq('user_id', user.id)
              .eq('test_number', parsedTestNum)
              .eq('is_active', true)
              .maybeSingle();

            if (entData) hasAccess = true;
          } catch (e) {}

          if (typeof window !== 'undefined') {
            const localEnt = localStorage.getItem(`marlins_entitlements_${user.id}`);
            if (localEnt) {
              try {
                const arr = JSON.parse(localEnt);
                if (Array.isArray(arr) && arr.map(Number).includes(Number(parsedTestNum))) {
                  hasAccess = true;
                }
              } catch (e) {}
            }
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
          const rawQuestions = info.questions;

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
            randomizedList = randomizeTestQuestions(rawQuestions, attemptId);
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

        const rawQuestionsList =
          data.questions && data.questions.length >= 60
            ? data.questions
            : resolvedInfo.questions;

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

        // Ensure start time is synced with server data.started_at
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
        if (attemptId.includes('test-10') || attemptId.includes('test10')) parsedTestNum = 10;
        else if (attemptId.includes('test-9') || attemptId.includes('test9')) parsedTestNum = 9;
        else if (attemptId.includes('test-8') || attemptId.includes('test8')) parsedTestNum = 8;
        else if (attemptId.includes('test-7') || attemptId.includes('test7')) parsedTestNum = 7;
        else if (attemptId.includes('test-6') || attemptId.includes('test6')) parsedTestNum = 6;
        else if (attemptId.includes('test-5') || attemptId.includes('test5')) parsedTestNum = 5;
        else if (attemptId.includes('test-4') || attemptId.includes('test4')) parsedTestNum = 4;
        else if (attemptId.includes('test-3') || attemptId.includes('test3')) parsedTestNum = 3;
        else if (attemptId.includes('test-2') || attemptId.includes('test2')) parsedTestNum = 2;

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
        console.warn('RPC submit failed, using client-side evaluation fallback:', error.message);
        evaluateAndSaveClientSide(formattedAnswers);
        return;
      }

      // Also persist review cache for server-evaluated attempts
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
      console.error('Error submitting test:', err);
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

    const studentUserId = user?.id || '00000000-0000-0000-0000-000000000001';
    const pointsEarned = Math.max(50, Math.round(finalPercentage * 1.5));
    const timeSpent = Math.max(60, Math.floor((Date.now() - getOrSetStartTime(attemptId)) / 1000));
    const nowIso = new Date().toISOString();

    const clientResult = {
      id: `res-${attemptId}`,
      student_id: studentUserId,
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

    // Synthesize certificate if passed
    let generatedCertificate: any = null;
    if (isPassed) {
      const studentName = profile?.full_name || user?.user_metadata?.full_name || 'Budi Santoso';
      const studentEmail = user?.email || 'siswa@marlinstest.com';
      const certNumber = `MARLINS-${attempt.test_number}-${Date.now().toString().slice(-6)}`;
      const verCode = `VER-${Date.now().toString().slice(-8)}`;

      generatedCertificate = {
        id: `cert-${attemptId}`,
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
      // 1. Save standard result keys to localStorage
      localStorage.setItem(`test_result_${attemptId}`, JSON.stringify(clientResult));
      localStorage.setItem(`marlins_result_${attemptId}`, JSON.stringify(clientResult));

      // 2. Save certificate if passed
      if (generatedCertificate) {
        localStorage.setItem(`marlins_cert_${attemptId}`, JSON.stringify(generatedCertificate));
        localStorage.setItem(`marlins_cert_id_${generatedCertificate.id}`, JSON.stringify(generatedCertificate));
      }

      // 3. Save complete review payload
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

      // 4. Append to history list
      const existingHistoryStr = localStorage.getItem('marlins_history_results');
      let historyArr: any[] = [];
      if (existingHistoryStr) {
        try {
          historyArr = JSON.parse(existingHistoryStr);
          if (!Array.isArray(historyArr)) historyArr = [];
        } catch (e) {
          historyArr = [];
        }
      }
      historyArr = historyArr.filter((item) => item.attempt_id !== attemptId && item.id !== clientResult.id);
      historyArr.unshift(clientResult);
      localStorage.setItem('marlins_history_results', JSON.stringify(historyArr));
    } catch (e) {
      console.warn('Failed to save result to localStorage:', e);
    }

    // 5. Asynchronous Dual Persistence to Supabase DB
    try {
      // Upsert to student_results table
      await supabase.from('student_results').upsert({
        id: clientResult.id,
        student_id: studentUserId,
        attempt_id: attemptId,
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

      // Update attempt in test_attempts table
      await supabase
        .from('test_attempts')
        .update({
          status: 'completed',
          submitted_at: nowIso,
          result_id: clientResult.id,
        })
        .eq('id', attemptId);

      // If passed, upsert certificate
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
      console.warn('Supabase DB background sync warning (offline mode active):', dbErr);
    }

    router.replace(`/student/test/result/${attemptId}`);
  };

  const handleExit = () => {
    router.replace('/student/dashboard');
  };

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
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      className="fixed inset-0 h-[100dvh] w-screen bg-[#F8FAFC] flex flex-col overflow-hidden select-none touch-manipulation exam-secure-mode"
    >
      {/* 1. TOP HEADER (Simple, Clean, Modern) */}
      <header className="shrink-0 w-full bg-white border-b border-slate-200/80 px-3.5 sm:px-6 py-2.5 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Left: Test Branding & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <Logo size="md" showSubtitle={false} href="/student/dashboard" hideTextOnMobile={true} />
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={attempt.test_name}>
                {attempt.test_name || 'Marlins Test 1'}
              </h1>
            </div>
          </div>

          {/* Right: Minimalist Timer, Daftar Soal, Keluar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Simple Minimalist Timer */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs sm:text-sm font-semibold border border-slate-200/60 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{formatStopwatch(elapsedSeconds)}</span>
            </div>

            {/* Question Navigator Button (Icon Only) */}
            <button
              type="button"
              onClick={() => setNavigatorModalOpen(true)}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200/80 text-[#0284C7] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
              title="Daftar Soal"
              aria-label="Daftar Soal"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* Exit Button */}
            <button
              type="button"
              onClick={() => setExitModalOpen(true)}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-transparent hover:border-rose-200 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
              title="Keluar dari Ujian"
              aria-label="Keluar"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden px-3.5 sm:px-8 py-4 sm:py-6 overscroll-contain bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Main Question Assessment Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Card Top Bar: Category & Flag Toggle */}
            <div className="px-5 sm:px-7 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${categoryInfo.bg} ${categoryInfo.color} border ${categoryInfo.border}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{categoryInfo.name}</span>
                </span>
              </div>

              {/* Flag Toggle Button */}
              <button
                type="button"
                onClick={() => handleToggleFlag(currentIndex)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all cursor-pointer text-xs ${
                  flaggedQuestions.has(currentIndex)
                    ? 'bg-amber-50 text-[#C2410C] border border-amber-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Flag
                  className={`w-3.5 h-3.5 ${
                    flaggedQuestions.has(currentIndex)
                      ? 'text-[#EA580C] fill-amber-500'
                      : 'text-slate-400'
                  }`}
                />
                <span>{flaggedQuestions.has(currentIndex) ? 'Ragu-ragu' : 'Tandai Ragu'}</span>
              </button>
            </div>

            {/* Card Body: Question Content, Audio, Image & Options */}
            <div className="p-5 sm:p-7 space-y-4">
              {/* Question Instruction Subtitle */}
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {getInstructionText(currentQuestion)}
              </p>

              {/* Audio Listening player if audio question */}
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
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed text-left break-words">
                  {currentQuestion.question_text}
                </h2>
              )}

              {/* Optional Image */}
              {currentQuestion.image_url && (
                <div className="flex justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100/90">
                  <img
                    src={currentQuestion.image_url}
                    alt="Question Visual"
                    draggable={false}
                    className="max-h-44 sm:max-h-56 object-contain rounded-xl shadow-2xs pointer-events-none select-none"
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
        </div>
      </main>

      {/* 3. BOTTOM CONTROL BAR */}
      <footer className="shrink-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 sm:px-8 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* Progress Track */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0284C7] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 sm:px-5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm shadow-2xs disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Question Counter Indicator */}
            <div className="text-center font-mono">
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Soal {currentIndex + 1} / {totalQuestionsCount}
              </span>
            </div>

            {/* Next or Finish Button */}
            <div className="flex items-center gap-2 shrink-0">
              {currentIndex < totalQuestionsCount - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-5 sm:px-7 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-5 sm:px-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>Selesaikan Ujian</span>
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
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs transition-all shadow-md shadow-sky-500/20 cursor-pointer disabled:opacity-50"
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
