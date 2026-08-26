-- ==============================================================================
-- 1. BUKA HAK AKSES DAN IZIN LENGKAP PADA SEMUA TABEL SUPABASE
-- Salin dan jalankan seluruh script ini di Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- A. Tabel student_results (Untuk Menyimpan & Menampilkan Riwayat Nilai Semua Siswa)
ALTER TABLE IF EXISTS public.student_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read student_results" ON public.student_results;
DROP POLICY IF EXISTS "Public Insert student_results" ON public.student_results;
DROP POLICY IF EXISTS "Public Update student_results" ON public.student_results;
DROP POLICY IF EXISTS "Public Delete student_results" ON public.student_results;

CREATE POLICY "Public Read student_results" ON public.student_results FOR SELECT USING (true);
CREATE POLICY "Public Insert student_results" ON public.student_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update student_results" ON public.student_results FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete student_results" ON public.student_results FOR DELETE USING (true);

-- B. Tabel test_entitlements (Untuk Akses Ujian Test 1-10)
ALTER TABLE IF EXISTS public.test_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_entitlements ALTER COLUMN marlint_test_id DROP NOT NULL;
ALTER TABLE IF EXISTS public.test_entitlements DROP CONSTRAINT IF EXISTS test_entitlements_marlint_test_id_fkey;

DROP POLICY IF EXISTS "Public Read test_entitlements" ON public.test_entitlements;
DROP POLICY IF EXISTS "Public Insert test_entitlements" ON public.test_entitlements;
DROP POLICY IF EXISTS "Public Update test_entitlements" ON public.test_entitlements;
DROP POLICY IF EXISTS "Public Delete test_entitlements" ON public.test_entitlements;

CREATE POLICY "Public Read test_entitlements" ON public.test_entitlements FOR SELECT USING (true);
CREATE POLICY "Public Insert test_entitlements" ON public.test_entitlements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update test_entitlements" ON public.test_entitlements FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete test_entitlements" ON public.test_entitlements FOR DELETE USING (true);

-- C. Tabel test_attempts
ALTER TABLE IF EXISTS public.test_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read test_attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Public Insert test_attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Public Update test_attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Public Delete test_attempts" ON public.test_attempts;

CREATE POLICY "Public Read test_attempts" ON public.test_attempts FOR SELECT USING (true);
CREATE POLICY "Public Insert test_attempts" ON public.test_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update test_attempts" ON public.test_attempts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete test_attempts" ON public.test_attempts FOR DELETE USING (true);

-- D. Tabel certificates
ALTER TABLE IF EXISTS public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public Insert certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public Update certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public Delete certificates" ON public.certificates;

CREATE POLICY "Public Read certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public Insert certificates" ON public.certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update certificates" ON public.certificates FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete certificates" ON public.certificates FOR DELETE USING (true);

-- E. Tabel users
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read users" ON public.users;
DROP POLICY IF EXISTS "Public Insert users" ON public.users;
DROP POLICY IF EXISTS "Public Update users" ON public.users;
DROP POLICY IF EXISTS "Public Delete users" ON public.users;

CREATE POLICY "Public Read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update users" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete users" ON public.users FOR DELETE USING (true);

-- F. Buka akses paket Test 1, 2, 3, 4 untuk Tsabita Arni Safitri (bita@gmail.com)
UPDATE public.users 
SET department_track = '[1, 2, 3, 4]' 
WHERE id = '65a606b2-3074-43b1-ade6-fbbd7e00b7d6' OR email = 'bita@gmail.com';

-- G. Masukkan langsung riwayat nilai Tsabita Arni Safitri (Bita) ke database Supabase
INSERT INTO public.student_results (
  id,
  student_id,
  score,
  correct_answers,
  total_questions,
  level,
  is_passed,
  test_name,
  marlint_test_number,
  test_mode,
  points_earned,
  time_spent_seconds,
  start_time,
  end_time,
  created_at
) VALUES (
  '77aa1122-3344-5566-7788-99aabbccddee',
  '65a606b2-3074-43b1-ade6-fbbd7e00b7d6',
  3,
  2,
  60,
  'A2',
  false,
  'Marlins Test 1 - Cruise Hospitality & Maritime English',
  1,
  'standard',
  50,
  60,
  NOW() - INTERVAL '1 minute',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  score = EXCLUDED.score,
  correct_answers = EXCLUDED.correct_answers;
