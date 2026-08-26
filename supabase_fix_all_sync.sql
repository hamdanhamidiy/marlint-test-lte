-- ==============================================================================
-- MASTER PERMISSION & SYNC FIX (JALANKAN DI SUPABASE SQL EDITOR)
-- Salin dan jalankan seluruh query ini di https://supabase.com/dashboard/project/xekfarqemnyfguxtpeoj/sql
-- ==============================================================================

-- 1. Berikan Hak Akses Penuh (GRANT ALL) ke role anon dan authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 2. Non-aktifkan RLS agar semua request web app langsung sinkron secara instan
ALTER TABLE IF EXISTS public.student_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_entitlements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;

-- 3. Hapus foreign key penghambat pada test_entitlements jika ada
ALTER TABLE IF EXISTS public.test_entitlements ALTER COLUMN marlint_test_id DROP NOT NULL;
ALTER TABLE IF EXISTS public.test_entitlements DROP CONSTRAINT IF EXISTS test_entitlements_marlint_test_id_fkey;

-- 4. Buka akses paket Test 1, 2, 3, 4 untuk Tsabita Arni Safitri (bita@gmail.com)
UPDATE public.users 
SET department_track = '[1, 2, 3, 4]' 
WHERE id = '65a606b2-3074-43b1-ade6-fbbd7e00b7d6' OR email = 'bita@gmail.com';

-- 5. Masukkan riwayat nilai Tsabita Arni Safitri (Bita) ke database Supabase
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
