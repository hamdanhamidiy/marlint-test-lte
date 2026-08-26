-- 1. Hapus foreign key & batasan kaku pada student_results
ALTER TABLE public.student_results DROP CONSTRAINT IF EXISTS student_results_test_session_id_fkey;
ALTER TABLE public.student_results DROP CONSTRAINT IF EXISTS student_results_attempt_id_fkey;
ALTER TABLE public.student_results ALTER COLUMN test_session_id DROP NOT NULL;
ALTER TABLE public.student_results ALTER COLUMN start_time DROP NOT NULL;
ALTER TABLE public.student_results ALTER COLUMN end_time DROP NOT NULL;
ALTER TABLE public.student_results ALTER COLUMN attempt_id DROP NOT NULL;

-- 2. Buka Izin Akses Penuh (RLS) untuk student_results
ALTER TABLE public.student_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read student_results" ON public.student_results;
DROP POLICY IF EXISTS "Public Insert student_results" ON public.student_results;
DROP POLICY IF EXISTS "Public Update student_results" ON public.student_results;
DROP POLICY IF EXISTS "Public Delete student_results" ON public.student_results;

CREATE POLICY "Public Read student_results" ON public.student_results FOR SELECT USING (true);
CREATE POLICY "Public Insert student_results" ON public.student_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update student_results" ON public.student_results FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete student_results" ON public.student_results FOR DELETE USING (true);

-- 3. Buka Izin Akses Penuh untuk tabel test_attempts & certificates
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read test_attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Public Insert test_attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Public Update test_attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Public Delete test_attempts" ON public.test_attempts;

CREATE POLICY "Public Read test_attempts" ON public.test_attempts FOR SELECT USING (true);
CREATE POLICY "Public Insert test_attempts" ON public.test_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update test_attempts" ON public.test_attempts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete test_attempts" ON public.test_attempts FOR DELETE USING (true);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public Insert certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public Update certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public Delete certificates" ON public.certificates;

CREATE POLICY "Public Read certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public Insert certificates" ON public.certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update certificates" ON public.certificates FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete certificates" ON public.certificates FOR DELETE USING (true);

-- 4. Masukkan data riwayat ujian Anda:
INSERT INTO public.student_results (
  id,
  student_id,
  score,
  correct_answers,
  total_questions,
  level,
  category_scores,
  time_spent_seconds,
  is_passed,
  start_time,
  end_time,
  created_at
) VALUES 
(
  '8899e649-9911-44eb-845f-edf00a792883',
  'a1c181cd-4d43-49b7-9814-d724ba27ea2e',
  7,
  4,
  60,
  'A2',
  '{"listening":{"correct":1,"total":15},"grammar":{"correct":1,"total":15},"reading":{"correct":1,"total":15},"pronunciation":{"correct":1,"total":15}}'::jsonb,
  1800,
  false,
  '2026-08-26T08:17:00Z',
  '2026-08-26T08:47:00Z',
  '2026-08-26T08:47:00Z'
),
(
  '9922a133-7711-42cb-912f-faf00b819994',
  'a1c181cd-4d43-49b7-9814-d724ba27ea2e',
  3,
  2,
  60,
  'A2',
  '{"listening":{"correct":1,"total":15},"grammar":{"correct":1,"total":15},"reading":{"correct":0,"total":15},"pronunciation":{"correct":0,"total":15}}'::jsonb,
  1800,
  false,
  '2026-08-24T07:14:00Z',
  '2026-08-24T07:44:00Z',
  '2026-08-24T07:44:00Z'
)
ON CONFLICT (id) DO UPDATE SET
  score = EXCLUDED.score,
  correct_answers = EXCLUDED.correct_answers,
  level = EXCLUDED.level;
