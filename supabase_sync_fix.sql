-- ==============================================================================
-- FIX SYNCHRONIZATION FOR TEST ENTITLEMENTS & ACCESS PERMISSIONS
-- Copy and run this script in Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Buka Hak Akses & Schema untuk test_entitlements
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

-- 2. Buka Hak Akses untuk users
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read users" ON public.users;
DROP POLICY IF EXISTS "Public Insert users" ON public.users;
DROP POLICY IF EXISTS "Public Update users" ON public.users;
DROP POLICY IF EXISTS "Public Delete users" ON public.users;

CREATE POLICY "Public Read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update users" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete users" ON public.users FOR DELETE USING (true);

-- 3. Buka Hak Akses untuk student_results
ALTER TABLE IF EXISTS public.student_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read student_results" ON public.student_results;
DROP POLICY IF EXISTS "Public Insert student_results" ON public.student_results;
DROP POLICY IF EXISTS "Public Update student_results" ON public.student_results;
DROP POLICY IF EXISTS "Public Delete student_results" ON public.student_results;

CREATE POLICY "Public Read student_results" ON public.student_results FOR SELECT USING (true);
CREATE POLICY "Public Insert student_results" ON public.student_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update student_results" ON public.student_results FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete student_results" ON public.student_results FOR DELETE USING (true);

-- 4. Buka Hak Akses untuk access_tokens
ALTER TABLE IF EXISTS public.access_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read access_tokens" ON public.access_tokens;
DROP POLICY IF EXISTS "Public Insert access_tokens" ON public.access_tokens;
DROP POLICY IF EXISTS "Public Update access_tokens" ON public.access_tokens;
DROP POLICY IF EXISTS "Public Delete access_tokens" ON public.access_tokens;

CREATE POLICY "Public Read access_tokens" ON public.access_tokens FOR SELECT USING (true);
CREATE POLICY "Public Insert access_tokens" ON public.access_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update access_tokens" ON public.access_tokens FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete access_tokens" ON public.access_tokens FOR DELETE USING (true);

-- 5. Buka Akses Test 2 dan Test 3 untuk Tsabita Arni Safitri (bita@gmail.com) di database Supabase:
UPDATE public.users 
SET department_track = '[1, 2, 3]' 
WHERE id = '65a606b2-3074-43b1-ade6-fbbd7e00b7d6' OR email = 'bita@gmail.com';

DELETE FROM public.test_entitlements 
WHERE user_id = '65a606b2-3074-43b1-ade6-fbbd7e00b7d6' AND test_number IN (2, 3);

INSERT INTO public.test_entitlements (
  user_id,
  marlint_test_id,
  test_number,
  is_active,
  source,
  granted_at
) VALUES 
(
  '65a606b2-3074-43b1-ade6-fbbd7e00b7d6',
  '77e831cf-a3d0-4306-bb32-49dddf130248',
  2,
  true,
  'super_admin_grant',
  NOW()
),
(
  '65a606b2-3074-43b1-ade6-fbbd7e00b7d6',
  'b25d1278-a95a-4719-afa1-831d06a7eb3e',
  3,
  true,
  'super_admin_grant',
  NOW()
);
