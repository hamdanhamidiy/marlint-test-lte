import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/server';
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
import { Question } from '@/lib/supabase/types';

function getQuestionsByTestNumber(testNum: number): { name: string; questions: Question[] } {
  switch (testNum) {
    case 10:
      return {
        name: 'Marlins Test 10 – Master & Chief Engineer Executive Capstone',
        questions: MARLINS_TEST_10_STANDARD_QUESTIONS,
      };
    case 9:
      return {
        name: 'Marlins Test 9 – Autonomous Ships (MASS), GMDSS & BRM Forensics',
        questions: MARLINS_TEST_9_STANDARD_QUESTIONS,
      };
    case 8:
      return {
        name: 'Marlins Test 8 – Heavy Lift, Dry Docking & Ocean Towage',
        questions: MARLINS_TEST_8_STANDARD_QUESTIONS,
      };
    case 7:
      return {
        name: 'Marlins Test 7 – Ro-Ro Passenger Safety & Green Shipping',
        questions: MARLINS_TEST_7_STANDARD_QUESTIONS,
      };
    case 6:
      return {
        name: 'Marlins Test 6 – Container & Bulk Carrier Operations',
        questions: MARLINS_TEST_6_STANDARD_QUESTIONS,
      };
    case 5:
      return {
        name: 'Marlins Test 5 – Offshore Operations & Dynamic Positioning',
        questions: MARLINS_TEST_5_STANDARD_QUESTIONS,
      };
    case 4:
      return {
        name: 'Marlins Test 4 – Tanker Operations & IMDG Cargo Handling',
        questions: MARLINS_TEST_4_STANDARD_QUESTIONS,
      };
    case 3:
      return {
        name: 'Marlins Test 3 – Bridge Watchkeeping & COLREGs',
        questions: MARLINS_TEST_3_STANDARD_QUESTIONS,
      };
    case 2:
      return {
        name: 'Marlins Test 2 – Deck & Engine Operations',
        questions: MARLINS_TEST_2_STANDARD_QUESTIONS,
      };
    case 1:
    default:
      return {
        name: 'Marlins Test 1 – Cruise Hospitality & Maritime English',
        questions: MARLINS_60_STANDARD_QUESTIONS,
      };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      attempt_id,
      test_number = 1,
      student_id,
      student_name = 'Siswa Marlins Test',
      student_email,
      answers = [],
      time_spent_seconds = 60,
    } = body;

    if (!attempt_id) {
      return NextResponse.json(
        { success: false, error: 'attempt_id diperlukan.' },
        { status: 400 }
      );
    }

    const testNum = Number(test_number) || 1;
    const { name: testName, questions: fullBank } = getQuestionsByTestNumber(testNum);

    // Build answer map: question_id -> user answer value
    const answerMap = new Map<string, any>();
    if (Array.isArray(answers)) {
      answers.forEach((a: any) => {
        if (a && a.question_id) {
          answerMap.set(a.question_id, a.answer_value);
        }
      });
    }

    let totalScore = 0;
    const categoryStats: Record<string, { total: number; correct: number }> = {};
    const questionEvaluations: Record<string, boolean> = {};

    fullBank.forEach((q) => {
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
          if (userSent === correctSent) isCorrect = true;
        } else if (q.question_type === 'drag_drop_label') {
          if (typeof userAns === 'object') {
            const dropZones = q.question_data?.drop_zones || [];
            let allMatched = dropZones.length > 0;
            dropZones.forEach((dz) => {
              const expected = dz.correct_label || dz.label || '';
              const actual = userAns[dz.id] || '';
              if (actual.trim().toLowerCase() !== expected.trim().toLowerCase()) {
                allMatched = false;
              }
            });
            if (allMatched) isCorrect = true;
          }
        } else if (q.question_type === 'gap_fill') {
          const gaps = q.question_data?.gaps || [];
          if (gaps.length > 0 && typeof userAns === 'object') {
            let allGapsCorrect = true;
            gaps.forEach((g) => {
              const expected = g.correct || '';
              const actual = userAns[g.index] || '';
              if (actual.trim().toLowerCase() !== expected.trim().toLowerCase()) {
                allGapsCorrect = false;
              }
            });
            if (allGapsCorrect) isCorrect = true;
          } else {
            const cleanUser = String(userAns).trim().toLowerCase();
            const cleanCorrect = String(q.correct_answer).trim().toLowerCase();
            if (cleanUser === cleanCorrect) isCorrect = true;
          }
        } else if (q.question_type === 'image_choice' || q.question_type === 'multiple_choice' || q.question_type === 'audio_listening') {
          const optLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
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

    const totalQuestions = Math.max(1, fullBank.length);
    const finalPercentage = Math.round((totalScore / totalQuestions) * 100);
    const passingGrade = 70;
    const isPassed = finalPercentage >= passingGrade;

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

    const pointsEarned = Math.max(50, Math.round(finalPercentage * 1.5));
    const nowIso = new Date().toISOString();

    const isValidUuid = (str?: string | null) =>
      Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

    const resultId = isValidUuid(attempt_id)
      ? attempt_id
      : `8899e649-9911-44eb-845f-${Date.now().toString(16).padStart(12, '0')}`;

    const certUuid = `99887766-5544-3322-1100-${Date.now().toString(16).padStart(12, '0')}`;
    const certCode = `LTE-MAR-${testNum.toString().padStart(2, '0')}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const studentUserId = isValidUuid(student_id) ? student_id : '65a606b2-3074-43b1-ade6-fbbd7e00b7d6';
    const emailToRecord = (student_email || 'student@marlinstest.com').toLowerCase();

    const supabase = createServerAdminClient();

    // 1. Insert into student_results
    const { error: resultErr } = await supabase.from('student_results').upsert(
      {
        id: resultId,
        student_id: studentUserId,
        student_email: emailToRecord,
        attempt_id: attempt_id,
        test_number: testNum,
        marlint_test_number: testNum,
        test_name: testName,
        score: finalPercentage,
        overall_score: finalPercentage,
        total_score: totalScore,
        correct_answers: totalScore,
        total_questions: totalQuestions,
        passing_grade: passingGrade,
        is_passed: isPassed,
        level: levelCode,
        level_code: levelCode,
        category_scores: categoryScoresObj,
        points_earned: pointsEarned,
        time_spent_seconds: Math.max(30, Number(time_spent_seconds) || 60),
        test_mode: 'standard',
        start_time: nowIso,
        end_time: nowIso,
        created_at: nowIso,
      },
      { onConflict: 'id' }
    );

    if (resultErr) {
      console.warn('Server Supabase student_results notice:', resultErr.message);
    }

    // 2. If passed, generate certificate
    let createdCertId: string | null = null;
    if (isPassed) {
      createdCertId = certUuid;
      const { error: certErr } = await supabase.from('certificates').upsert(
        {
          id: certUuid,
          certificate_number: certCode,
          user_id: studentUserId,
          student_name: student_name,
          student_email: emailToRecord,
          test_name: testName,
          test_number: testNum,
          result_id: resultId,
          score: finalPercentage,
          grade: levelCode,
          level: levelCode,
          is_passed: true,
          category_scores: categoryScoresObj,
          total_questions: totalQuestions,
          correct_answers: totalScore,
          duration_minutes: 60,
          passing_grade: passingGrade,
          issue_date: nowIso,
          issued_at: nowIso,
          verification_code: certCode,
          is_valid: true,
          created_at: nowIso,
        },
        { onConflict: 'id' }
      );

      if (certErr) {
        console.warn('Server Supabase certificates notice:', certErr.message);
      }
    }

    // 3. Update user total points & placement stats in users table
    if (isValidUuid(studentUserId)) {
      try {
        const { data: userProfile } = await supabase
          .from('users')
          .select('total_points')
          .eq('id', studentUserId)
          .maybeSingle();

        const currentPts = userProfile?.total_points || 0;
        await supabase
          .from('users')
          .update({
            total_points: currentPts + pointsEarned,
            level: levelCode,
            level_code: levelCode,
            placement_test_taken: true,
            placement_test_date: nowIso,
            updated_at: nowIso,
          })
          .eq('id', studentUserId);
      } catch (ptsErr) {
        console.warn('User points update notice:', ptsErr);
      }
    }

    return NextResponse.json({
      success: true,
      result_id: resultId,
      certificate_id: createdCertId,
      certificate_code: isPassed ? certCode : null,
      score: finalPercentage,
      total_score: totalScore,
      total_questions: totalQuestions,
      level: levelCode,
      is_passed: isPassed,
      category_scores: categoryScoresObj,
      points_earned: pointsEarned,
      test_name: testName,
      test_number: testNum,
    });
  } catch (err: any) {
    console.error('Server test evaluation error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memproses penilaian ujian.' },
      { status: 500 }
    );
  }
}
