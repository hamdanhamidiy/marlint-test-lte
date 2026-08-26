-- ==============================================================================
-- FIX PERMISSION & ENABLE REALTIME SYNC (JALANKAN DI SUPABASE SQL EDITOR)
-- Salin seluruh query ini dan klik "RUN" di SQL Editor Supabase Anda
-- ==============================================================================

-- 1. BERIKAN HAK AKSES LENGKAP (SELECT, INSERT, UPDATE, DELETE) KE SEMUA ROLE
GRANT USAGE ON SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, postgres, service_role;

-- 2. NON-AKTIFKAN ROW LEVEL SECURITY (RLS) AGAR TIDAK MEMBLOKIR AKSI DELETE/UPDATE DARI CLIENT
ALTER TABLE IF EXISTS public.student_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_entitlements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marlint_tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.access_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.articles DISABLE ROW LEVEL SECURITY;

-- 3. BUAT STORED PROCEDURE / RPC UNTUK HAPUS RIWAYAT DENGAN HAK ELEVATED (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.delete_student_result(p_result_id TEXT)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count int;
BEGIN
  -- Hapus sertifikat terkait jika ada
  DELETE FROM public.certificates WHERE result_id::text = p_result_id;

  -- Hapus rekaman dari student_results
  DELETE FROM public.student_results WHERE id::text = p_result_id OR attempt_id::text = p_result_id;
  GET DIAGNOSTICS v_count = ROW_COUNT;

  -- Hapus rekaman test_attempts jika ada
  DELETE FROM public.test_attempts WHERE id::text = p_result_id OR result_id::text = p_result_id;

  RETURN json_build_object('success', true, 'deleted_count', v_count);
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_student_result(TEXT) TO anon, authenticated, postgres, service_role;

-- 4. AKTIFKAN REPLICATION UNTUK REALTIME DI SUPABASE (AGAR PERUBAHAN OTOMATIS LIVE)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'student_results'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.student_results;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'users'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'test_entitlements'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.test_entitlements;
  END IF;
END $$;
