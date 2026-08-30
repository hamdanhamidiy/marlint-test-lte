-- ==============================================================================
-- MARLINS TEST PLATFORM - PRODUCTION SECURITY & ROW LEVEL SECURITY (RLS)
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor
-- URL: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. FUNGSI BANTUAN UNTUK MEMERIKSA ROLE PENGGUNA SECARA AMAN DI POSTGRES
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin', 'instructor')
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. AKTIFKAN ROW LEVEL SECURITY (RLS) PADA SEMUA TABEL
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marlint_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.articles ENABLE ROW LEVEL SECURITY;

-- 3. BERSIHKAN POLICY LAMA
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- ==============================================================================
-- 4. POLICIES: USERS (PROFIL PENGGUNA)
-- ==============================================================================
-- Siswa & Instruktur dapat melihat profil mereka sendiri
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR public.is_staff());

-- Pengguna dapat mengupdate profil miliknya sendiri
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- User baru dapat mendaftarkan profilnya saat register
CREATE POLICY "Users can insert own profile on signup"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id OR auth.uid() IS NOT NULL OR public.is_admin());

-- Hanya Super Admin yang dapat menghapus akun user
CREATE POLICY "Admin can delete users"
  ON public.users FOR DELETE
  USING (public.is_admin());


-- ==============================================================================
-- 5. POLICIES: STUDENT_RESULTS (RIWAYAT HASIL UJIAN)
-- ==============================================================================
-- Siswa hanya bisa melihat hasil ujian miliknya sendiri, staff bisa melihat semua
CREATE POLICY "Students can view own results"
  ON public.student_results FOR SELECT
  USING (auth.uid() = student_id OR public.is_staff());

-- Hasil ujian dapat diinput oleh sistem/user yang terautentikasi untuk dirinya
CREATE POLICY "Students can insert own results"
  ON public.student_results FOR INSERT
  WITH CHECK (auth.uid() = student_id OR public.is_staff() OR auth.role() = 'service_role');

-- Hanya admin yang dapat mengubah atau menghapus riwayat hasil
CREATE POLICY "Staff can update results"
  ON public.student_results FOR UPDATE
  USING (public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "Staff can delete results"
  ON public.student_results FOR DELETE
  USING (public.is_admin() OR auth.role() = 'service_role');


-- ==============================================================================
-- 6. POLICIES: CERTIFICATES (SERTIFIKAT KELULUSAN)
-- ==============================================================================
-- Publik dapat melihat sertifikat untuk keperluan verifikasi QR code di /verify
CREATE POLICY "Public can view valid certificates"
  ON public.certificates FOR SELECT
  USING (true);

-- Hanya sistem (service_role) atau admin yang dapat membuat sertifikat
CREATE POLICY "Authorized can insert certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_staff() OR auth.role() = 'service_role');

-- Hanya admin atau sistem yang dapat mengedit/menghapus sertifikat
CREATE POLICY "Admin can update certificates"
  ON public.certificates FOR UPDATE
  USING (public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "Admin can delete certificates"
  ON public.certificates FOR DELETE
  USING (public.is_admin() OR auth.role() = 'service_role');


-- ==============================================================================
-- 7. POLICIES: TEST_ENTITLEMENTS (AKSES PAKET UJIAN & QRIS)
-- ==============================================================================
-- Siswa dapat melihat paket ujian miliknya sendiri
CREATE POLICY "Users can view own entitlements"
  ON public.test_entitlements FOR SELECT
  USING (auth.uid() = user_id OR public.is_staff());

-- Siswa dapat mengajukan konfirmasi QRIS (pending: is_active = false)
CREATE POLICY "Users can submit payment requests"
  ON public.test_entitlements FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_staff() OR auth.role() = 'service_role');

-- Hanya Admin/Staff yang dapat menyetujui (is_active = true) atau membatalkan
CREATE POLICY "Staff can manage entitlements"
  ON public.test_entitlements FOR UPDATE
  USING (public.is_staff() OR auth.role() = 'service_role')
  WITH CHECK (public.is_staff() OR auth.role() = 'service_role');

CREATE POLICY "Staff can delete entitlements"
  ON public.test_entitlements FOR DELETE
  USING (public.is_staff() OR auth.role() = 'service_role');


-- ==============================================================================
-- 8. POLICIES: MARLINT_TESTS & QUESTIONS (PAKET UJIAN & BANK SOAL)
-- ==============================================================================
-- Siapapun yang terautentikasi dapat melihat daftar paket ujian yang aktif
CREATE POLICY "Anyone can view active tests"
  ON public.marlint_tests FOR SELECT
  USING (is_active = true OR public.is_staff());

CREATE POLICY "Admin can manage tests"
  ON public.marlint_tests FOR ALL
  USING (public.is_admin() OR auth.role() = 'service_role');

-- Siswa dapat membaca soal ujian yang aktif
CREATE POLICY "Authenticated users can view active questions"
  ON public.questions FOR SELECT
  USING (is_active = true OR public.is_staff());

CREATE POLICY "Admin can manage questions"
  ON public.questions FOR ALL
  USING (public.is_admin() OR auth.role() = 'service_role');


-- ==============================================================================
-- 9. POLICIES: ACCESS_TOKENS (VOUCHER AKSES)
-- ==============================================================================
-- Pengguna dapat memeriksa token yang valid untuk redeem
CREATE POLICY "Users can check tokens"
  ON public.access_tokens FOR SELECT
  USING (is_active = true OR public.is_staff());

-- Hanya Admin yang dapat membuat dan mengubah token voucher
CREATE POLICY "Staff can manage tokens"
  ON public.access_tokens FOR ALL
  USING (public.is_staff() OR auth.role() = 'service_role');


-- ==============================================================================
-- 10. POLICIES: ARTICLES (ARTIKEL PEMBELAJARAN)
-- ==============================================================================
CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  USING (is_published = true OR public.is_staff());

CREATE POLICY "Staff can manage articles"
  ON public.articles FOR ALL
  USING (public.is_staff() OR auth.role() = 'service_role');


-- ==============================================================================
-- 11. OTOMATISASI SYNC AKUN AUTH.USERS KE PUBLIC.USERS (TRIGGER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    status,
    level,
    level_code,
    total_points,
    job_title,
    placement_test_taken,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    'active',
    'A1',
    'A1',
    0,
    COALESCE(NEW.raw_user_meta_data->>'job_title', 'Pelaut / Seafarer'),
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 12. REALTIME PUBLICATION UNTUK UPDATE INSTAN
-- ==============================================================================
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
    WHERE pubname = 'supabase_realtime' AND tablename = 'test_entitlements'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.test_entitlements;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'users'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  END IF;
END $$;
